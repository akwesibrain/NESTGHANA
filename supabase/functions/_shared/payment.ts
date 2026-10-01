import { createClient } from "npm:@supabase/supabase-js@2";
import { env } from "./http.ts";

export function serviceClient() {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getPaystackTransaction(reference: string) {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${env("PAYSTACK_SECRET_KEY")}` } },
  );
  const payload = await response.json();
  if (!response.ok || payload.status !== true || !payload.data) {
    throw new Error("Paystack could not verify this transaction.");
  }
  return payload.data;
}

export async function verifyPaystack(reference: string) {
  if (!/^NGH-[0-9A-F]{32}$/.test(reference)) throw new Error("Invalid payment reference.");
  const transaction = await getPaystackTransaction(reference);
  if (transaction.status !== "success") throw new Error("Paystack has not confirmed a successful transaction.");
  return transaction;
}

export async function recordVerifiedPayment(
  reference: string,
  transaction: Record<string, unknown>,
  eventType = "transaction.verify",
  rawBody = JSON.stringify(transaction),
  rawPayload: Record<string, unknown> = transaction,
) {
  const transactionId = String(transaction.id ?? "");
  const amountPesewas = Number(transaction.amount);
  const currency = String(transaction.currency ?? "");
  if (!transactionId || !Number.isSafeInteger(amountPesewas) || amountPesewas <= 0 || currency !== "GHS") {
    throw new Error("The verified payment data is invalid.");
  }

  const supabase = serviceClient();
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .select("id, amount_pesewas, currency, status")
    .eq("reference", reference)
    .single();
  if (paymentError) throw paymentError;
  if (amountPesewas !== payment.amount_pesewas || currency !== payment.currency) {
    throw new Error("The verified payment amount or currency does not match the listing fee.");
  }

  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(rawBody));
  const bodyHash = `\\x${[...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
  const { data: finalized, error: finalizeError } = await supabase.rpc("finalize_paystack_payment", {
    p_reference: reference,
    p_transaction_id: transactionId,
    p_amount_pesewas: amountPesewas,
    p_currency: currency,
    p_event_type: eventType,
    p_raw_body_sha256: bodyHash,
    p_raw_payload: rawPayload,
  });
  if (finalizeError) throw finalizeError;
  return { status: finalized ? "PENDING_APPROVAL" : "already_processed" };
}
