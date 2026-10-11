import "server-only";
import { randomUUID } from "node:crypto";
import type { DataOrderStatus, MobileNetwork } from "@/generated/prisma/client";
import { getDb } from "./db";
import { initializeTransaction, isPaystackCheckoutUrl, paystackConfigured, verifyTransaction, type PaystackTransaction } from "./paystack";

// Buy Data (/buy-data): data bundle packages, orders and their Paystack payments.
// The price is always read from the database (never from the browser), every payment is re-checked
// with Paystack before it is recorded, and recording is idempotent so webhook retries are safe.
// Bundles are sent by a team member, who then marks the order delivered in Admin → Data bundles.

export class DataOrderError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}

/** Data order references; listing-fee payments use NGH-. */
export const DATA_REFERENCE_PATTERN = /^NGD-[0-9A-F]{32}$/;

/** Network names as the Buy Data page shows and matches them. */
export const NETWORK_LABEL: Record<MobileNetwork, string> = { MTN: "MTN", TELECEL: "Telecel", AIRTELTIGO: "AirtelTigo" };

export const DATA_ORDER_LABEL: Record<DataOrderStatus, string> = {
  PENDING: "Awaiting payment",
  PAID: "Paid, to deliver",
  DELIVERED: "Delivered",
  FAILED: "Payment failed",
  CANCELLED: "Cancelled",
};

/** Active packages in the row shape the Buy Data page reads (price in cedis). */
export async function listActivePackages() {
  const rows = await getDb().dataPackage.findMany({ where: { active: true }, orderBy: { id: "asc" } });
  return rows.map(row => ({
    id: row.id,
    network: NETWORK_LABEL[row.network],
    package_name: row.packageName,
    data_amount: row.dataAmount,
    price: row.pricePesewas / 100,
    status: "active" as const,
  }));
}

/** Accepts 024XXXXXXX, 23324XXXXXXX or +23324XXXXXXX; returns +233XXXXXXXXX or null. */
export function normalizeGhanaMobile(value: unknown): string | null {
  if (typeof value !== "string") return null;
  let digits = value.replace(/[\s\-()]/g, "");
  if (digits.startsWith("+233")) digits = `0${digits.slice(4)}`;
  else if (digits.startsWith("233") && digits.length === 12) digits = `0${digits.slice(3)}`;
  return /^0[235]\d{8}$/.test(digits) ? `+233${digits.slice(1)}` : null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function startDataCheckout(input: {
  packageId: unknown;
  customerPhone: unknown;
  customerEmail: unknown;
  callbackUrl: string;
  ipHash: Uint8Array<ArrayBuffer> | null;
}): Promise<{ authorizationUrl: string; reference: string; orderId: string }> {
  if (!paystackConfigured()) throw new DataOrderError("Online payment is not available yet. Please try again later.", 503);
  const packageId = Number(input.packageId);
  if (!Number.isInteger(packageId) || packageId < 1) throw new DataOrderError("Choose a data package.");
  const phone = normalizeGhanaMobile(input.customerPhone);
  if (!phone) throw new DataOrderError("Enter a valid Ghana mobile number (e.g. 024XXXXXXX).");
  const email = typeof input.customerEmail === "string" ? input.customerEmail.trim().toLowerCase() : "";
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) throw new DataOrderError("Enter a valid email address for your receipt.");

  const db = getDb();
  const pkg = await db.dataPackage.findUnique({ where: { id: packageId } });
  if (!pkg || !pkg.active) throw new DataOrderError("This package is no longer available. Refresh the page and choose another.", 409);

  const reference = `NGD-${randomUUID().replaceAll("-", "").toUpperCase()}`;
  const order = await db.dataOrder.create({
    data: {
      packageId: pkg.id,
      network: pkg.network,
      packageName: pkg.packageName,
      dataAmount: pkg.dataAmount,
      amountPesewas: pkg.pricePesewas,
      customerPhoneE164: phone,
      customerEmail: email,
      reference,
      ipHash: input.ipHash,
    },
    select: { id: true },
  });

  try {
    const checkout = await initializeTransaction({
      email,
      amountPesewas: pkg.pricePesewas,
      reference,
      callbackUrl: input.callbackUrl,
      metadata: { kind: "data_bundle", order_id: order.id },
    });
    if (!isPaystackCheckoutUrl(checkout.authorization_url)) throw new Error("Unexpected checkout URL.");
    return { authorizationUrl: checkout.authorization_url, reference, orderId: order.id };
  } catch (error) {
    await db.dataOrder.update({ where: { id: order.id }, data: { status: "FAILED", note: "Checkout could not be started." } });
    console.error("data_checkout_failed", error instanceof Error ? error.message : "unknown");
    throw new DataOrderError("We could not start the payment. Please try again.", 502);
  }
}

/**
 * Records a successful Paystack transaction against its order. Returns false when it was already
 * recorded. The amount and currency must match what the order was created with.
 */
export async function finalizeDataPayment(reference: string, transaction: PaystackTransaction): Promise<boolean> {
  if (!DATA_REFERENCE_PATTERN.test(reference) || transaction.reference !== reference || transaction.status !== "success") {
    throw new DataOrderError("Paystack has not confirmed a successful transaction for this reference.");
  }
  return getDb().$transaction(async tx => {
    const [order] = await tx.$queryRaw<{ id: string; status: DataOrderStatus; amount_pesewas: number; currency: string }[]>`
      SELECT id, status, amount_pesewas, currency FROM data_orders WHERE reference = ${reference} FOR UPDATE`;
    if (!order) throw new DataOrderError("Payment reference not found.", 404);
    if (order.status === "PAID" || order.status === "DELIVERED" || order.status === "CANCELLED") return false;
    if (Number(order.amount_pesewas) !== transaction.amount || order.currency !== transaction.currency) {
      throw new DataOrderError("The verified payment does not match the order.", 409);
    }
    await tx.dataOrder.update({
      where: { id: order.id },
      data: { status: "PAID", paidAt: new Date(), paystackTransactionId: String(transaction.id), note: null },
    });
    return true;
  });
}

/** Checks an order's payment with Paystack when the customer returns from checkout. */
export async function verifyDataPayment(reference: unknown): Promise<"paid" | "failed" | "pending"> {
  if (typeof reference !== "string" || !DATA_REFERENCE_PATTERN.test(reference)) throw new DataOrderError("Invalid payment reference.");
  const order = await getDb().dataOrder.findUnique({ where: { reference }, select: { status: true } });
  if (!order) throw new DataOrderError("Payment reference not found.", 404);
  if (order.status === "PAID" || order.status === "DELIVERED") return "paid";
  if (order.status === "CANCELLED") return "failed";

  const transaction = await verifyTransaction(reference);
  if (transaction.status === "success") {
    await finalizeDataPayment(reference, transaction);
    return "paid";
  }
  if (["abandoned", "failed", "reversed"].includes(transaction.status)) {
    await getDb().dataOrder.updateMany({ where: { reference, status: "PENDING" }, data: { status: "FAILED" } });
    return "failed";
  }
  return "pending";
}

/** Figures for Admin → Data bundles. Revenue counts paid and delivered orders only. */
export async function getDataSalesSummary() {
  const db = getDb();
  const [row] = await db.$queryRaw<{ today: unknown; month: unknown; all_time: unknown; paid_count: unknown }[]>`
    SELECT
      COALESCE(SUM(CASE WHEN paid_at >= UTC_DATE() THEN amount_pesewas END), 0) AS today,
      COALESCE(SUM(CASE WHEN paid_at >= UTC_DATE() - INTERVAL 29 DAY THEN amount_pesewas END), 0) AS month,
      COALESCE(SUM(amount_pesewas), 0) AS all_time,
      COUNT(*) AS paid_count
    FROM data_orders WHERE status IN ('PAID', 'DELIVERED')`;
  const toDeliver = await db.dataOrder.count({ where: { status: "PAID" } });
  return {
    todayPesewas: Number(row?.today ?? 0),
    last30DaysPesewas: Number(row?.month ?? 0),
    allTimePesewas: Number(row?.all_time ?? 0),
    paidCount: Number(row?.paid_count ?? 0),
    toDeliver,
  };
}
