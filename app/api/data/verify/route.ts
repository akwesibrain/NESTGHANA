import { DataOrderError, verifyDataPayment } from "@/lib/server/data-bundles";
import { isSameOrigin, json } from "@/lib/server/http";
import { clientIp, consumeRateLimit, hashIp } from "@/lib/server/rate-limit";

// Called when the customer returns from Paystack (?reference=...). The payment is always re-checked
// with Paystack server-side. Response shape kept from the page's previous backend:
// { verified, payment_status, message }.
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ verified: false, error: "Origin is not allowed." }, 403);
  try {
    const limit = await consumeRateLimit("data_verify", hashIp(clientIp(request)), 30, 600);
    if (!limit.allowed) return json({ verified: false, error: "Too many requests. Please wait a few minutes." }, 429);

    const body = (await request.json().catch(() => null)) as { reference?: unknown } | null;
    const status = await verifyDataPayment(body?.reference);
    if (status === "paid") return json({ verified: true, payment_status: "success" });
    if (status === "failed") return json({ verified: false, payment_status: "failed", message: "Paystack marked this payment as failed or cancelled. You have not been charged for a completed order." }, 402);
    return json({ verified: false, payment_status: "pending", message: "Paystack has not confirmed this payment yet. If you were charged, your order will be processed once it is confirmed." }, 409);
  } catch (error) {
    if (error instanceof DataOrderError) return json({ verified: false, error: error.message }, error.status);
    console.error("data_verify_failed", error instanceof Error ? error.message : "unknown");
    return json({ verified: false, error: "We could not confirm the payment right now. Please try again shortly." }, 502);
  }
}
