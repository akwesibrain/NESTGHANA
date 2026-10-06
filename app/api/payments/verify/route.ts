import { json, isSameOrigin } from "@/lib/server/http";
import { PaymentError, verifyPayment } from "@/lib/server/payments";
import { clientIp, consumeRateLimit, hashIp } from "@/lib/server/rate-limit";

// Called when the owner returns from Paystack (?payment_reference=...). The result is always
// re-checked with Paystack server-side; the browser's word is never trusted.
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ error: "Origin is not allowed." }, 403);
  try {
    const limit = await consumeRateLimit("payment_verify", hashIp(clientIp(request)), 30, 600);
    if (!limit.allowed) return json({ error: "Too many requests. Please wait a few minutes." }, 429);

    const body = (await request.json().catch(() => null)) as { reference?: unknown } | null;
    const reference = typeof body?.reference === "string" ? body.reference : "";
    const status = await verifyPayment(reference);
    if (status === "failed") return json({ status, error: "Paystack marked this payment as failed or cancelled." }, 402);
    if (status === "pending") return json({ status, error: "Paystack has not confirmed this payment yet." }, 409);
    return json({ status });
  } catch (error) {
    if (error instanceof PaymentError) return json({ error: error.message }, error.status);
    console.error("payment_verify_failed", error instanceof Error ? error.message : "unknown");
    return json({ error: "Payment verification failed. Please try again shortly." }, 502);
  }
}
