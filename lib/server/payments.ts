import "server-only";
import { createHash, randomUUID } from "node:crypto";
import type { Prisma } from "@/generated/prisma/client";
import { getDb } from "./db";
import { feeFor, getListingFees, listingFeeType } from "./listing-fees";
import { transitionListingInTransaction } from "./listing-status";
import { initializeTransaction, isPaystackCheckoutUrl, type PaystackTransaction, verifyTransaction } from "./paystack";

// Listing-fee payments via Paystack (port of the Supabase payment functions + finalize RPC).
// The amount always comes from website_settings for the listing's type; the browser only echoes
// the fee it showed so a fee change mid-checkout is detected instead of silently charged.

export class PaymentError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}

export const REFERENCE_PATTERN = /^NGH-[0-9A-F]{32}$/;

/**
 * Starts (or restarts) checkout for a listing awaiting payment. Earlier open attempts are checked
 * with Paystack first so an owner is never charged twice.
 */
export async function startCheckout(input: {
  listingId: string;
  ownerEmail: string;
  expectedFeePesewas: number;
  callbackUrl: string;
}): Promise<{ authorizationUrl: string; reference: string; amountPesewas: number }> {
  const db = getDb();
  const listing = await db.listing.findUniqueOrThrow({
    where: { id: input.listingId },
    select: { status: true, propertyCategory: true, roomType: true },
  });
  if (listing.status !== "PAYMENT_PENDING") throw new PaymentError("This listing has already been paid or is being reviewed.", 409);

  const open = await db.payment.findMany({ where: { listingId: input.listingId, status: { in: ["PENDING", "PROCESSING"] } } });
  for (const previous of open) {
    const transaction = await verifyTransaction(previous.reference).catch(() => null);
    if (transaction?.status === "success") {
      await finalizePayment(previous.reference, transaction, "transaction.verify");
      throw new PaymentError("Your earlier payment was verified. Refresh the page.", 409);
    }
    if (!transaction || ["abandoned", "failed", "reversed"].includes(transaction.status)) {
      await db.payment.update({ where: { id: previous.id }, data: { status: transaction?.status === "abandoned" ? "ABANDONED" : "FAILED" } });
    } else {
      throw new PaymentError("Your earlier Paystack attempt is still processing. Wait for confirmation before paying again.", 409);
    }
  }

  const fees = await getListingFees();
  const type = listingFeeType(listing.propertyCategory, listing.roomType);
  const amountPesewas = feeFor(fees, type);
  if (input.expectedFeePesewas !== amountPesewas) {
    throw new PaymentError("The listing fee changed. Refresh the page and review the updated fee before paying.", 409);
  }

  const reference = `NGH-${randomUUID().replaceAll("-", "").toUpperCase()}`;
  await db.payment.create({
    data: { listingId: input.listingId, listingType: type, reference, amountPesewas, currency: fees.currency, status: "PENDING" },
  });

  const callback = new URL(input.callbackUrl);
  callback.searchParams.set("payment_reference", reference);
  try {
    const checkout = await initializeTransaction({
      email: input.ownerEmail,
      amountPesewas,
      reference,
      callbackUrl: callback.toString(),
      metadata: { listing_id: input.listingId, listing_type: type },
    });
    if (!isPaystackCheckoutUrl(checkout.authorization_url)) throw new Error("Unexpected checkout URL.");
    return { authorizationUrl: checkout.authorization_url, reference, amountPesewas };
  } catch (error) {
    await db.payment.update({ where: { reference }, data: { status: "FAILED" } });
    console.error("paystack_initialize_failed", error instanceof Error ? error.message : "unknown");
    throw new PaymentError("Paystack could not start checkout. Your submission is saved and you can retry.", 502);
  }
}

/**
 * Records a Paystack-verified successful transaction exactly once: stores the raw event, marks the
 * payment PAID and moves the listing to PENDING_APPROVAL in one transaction. Returns false if this
 * event or payment was already processed.
 */
export async function finalizePayment(
  reference: string,
  transaction: PaystackTransaction,
  eventType: string,
  rawBody: string = JSON.stringify(transaction),
  rawPayload: Prisma.InputJsonObject = transaction as unknown as Prisma.InputJsonObject,
): Promise<boolean> {
  if (!REFERENCE_PATTERN.test(reference) || transaction.reference !== reference || transaction.status !== "success") {
    throw new PaymentError("Paystack has not confirmed a successful transaction for this reference.");
  }
  const bodySha256 = new Uint8Array(createHash("sha256").update(rawBody).digest());

  return getDb().$transaction(async tx => {
    const [payment] = await tx.$queryRaw<{ id: string; listing_id: string; status: string; amount_pesewas: number; currency: string }[]>`
      SELECT id, listing_id, status, amount_pesewas, currency FROM payments WHERE reference = ${reference} FOR UPDATE`;
    if (!payment) throw new PaymentError("Payment reference not found.", 404);

    const event = await tx.paymentEvent.createMany({
      data: [{ paymentReference: reference, eventType: eventType.slice(0, 100), bodySha256, rawPayload }],
      skipDuplicates: true,
    });
    if (event.count === 0 || payment.status === "PAID") return false;

    if (!["PENDING", "PROCESSING", "FAILED", "ABANDONED"].includes(payment.status)
      || Number(payment.amount_pesewas) !== transaction.amount || payment.currency !== transaction.currency) {
      throw new PaymentError("The verified payment does not match the stored payment.", 409);
    }

    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        paidListingId: payment.listing_id,
        paidAt: new Date(),
        paystackTransactionId: String(transaction.id),
      },
    });
    await transitionListingInTransaction(tx, {
      listingId: payment.listing_id,
      to: "PENDING_APPROVAL",
      actorType: "SYSTEM",
      actorId: null,
      source: "verified_payment",
    });
    return true;
  });
}

/** Checks a payment with Paystack (after the browser returns from checkout) and records it. */
export async function verifyPayment(reference: string): Promise<"PENDING_APPROVAL" | "already_processed" | "failed" | "pending"> {
  if (!REFERENCE_PATTERN.test(reference)) throw new PaymentError("Invalid payment reference.");
  const payment = await getDb().payment.findUnique({ where: { reference }, select: { status: true } });
  if (!payment) throw new PaymentError("Payment reference not found.", 404);
  if (payment.status === "PAID") return "already_processed";

  const transaction = await verifyTransaction(reference);
  if (transaction.status === "success") {
    return (await finalizePayment(reference, transaction, "transaction.verify")) ? "PENDING_APPROVAL" : "already_processed";
  }
  if (["abandoned", "failed", "reversed"].includes(transaction.status)) {
    await getDb().payment.update({ where: { reference }, data: { status: transaction.status === "abandoned" ? "ABANDONED" : "FAILED" } });
    return "failed";
  }
  return "pending";
}
