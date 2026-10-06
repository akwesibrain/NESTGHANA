import { finalizePayment, REFERENCE_PATTERN } from "@/lib/server/payments";
import { paystackConfigured, validWebhookSignature, verifyTransaction } from "@/lib/server/paystack";

// Paystack webhook (set the URL to https://<site>/api/webhooks/paystack in the Paystack dashboard).
// The signature proves the call came from Paystack; the transaction is still re-verified via the API
// before anything is recorded. Processing is idempotent, so Paystack's retries are safe.
export async function POST(request: Request) {
  if (!paystackConfigured()) return new Response(null, { status: 503 });
  const rawBody = await request.text();
  if (rawBody.length > 1_000_000 || !validWebhookSignature(rawBody, request.headers.get("x-paystack-signature"))) {
    return new Response(null, { status: 401 });
  }

  let event: { event?: unknown; data?: { reference?: unknown } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response(null, { status: 400 });
  }

  const reference = event.data?.reference;
  if (event.event !== "charge.success" || typeof reference !== "string" || !REFERENCE_PATTERN.test(reference)) {
    // Not a NestGH listing-fee charge (or an event type we do not act on): acknowledge it.
    return new Response(null, { status: 200 });
  }

  try {
    const transaction = await verifyTransaction(reference);
    if (transaction.status === "success") {
      await finalizePayment(reference, transaction, "charge.success", rawBody, event as Record<string, never>);
    }
    return new Response(null, { status: 200 });
  } catch (error) {
    // A 5xx makes Paystack retry later.
    console.error("paystack_webhook_failed", error instanceof Error ? error.message : "unknown");
    return new Response(null, { status: 500 });
  }
}
