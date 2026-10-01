import { corsHeaders, jsonResponse } from "../_shared/http.ts";
import { recordVerifiedPayment, verifyPaystack } from "../_shared/payment.ts";

async function validSignature(body: string, signature: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body)));
  const expected = [...digest].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  if (expected.length !== signature.length) return false;
  let difference = 0;
  for (let index = 0; index < expected.length; index++) difference |= expected.charCodeAt(index) ^ signature.charCodeAt(index);
  return difference === 0;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders(request) });
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405, request);
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature") ?? "";
    const secret = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!secret || !(await validSignature(body, signature, secret))) {
      return jsonResponse({ error: "Invalid webhook signature." }, 401, request);
    }
    const event = JSON.parse(body);
    if (event.event === "charge.success" && typeof event.data?.reference === "string") {
      const transaction = await verifyPaystack(event.data.reference);
      await recordVerifiedPayment(event.data.reference, transaction, event.event, body, event);
    }
    return jsonResponse({ received: true }, 200, request);
  } catch (error) {
    console.error("paystack-webhook failed:", error);
    return jsonResponse({ error: "Webhook processing failed." }, 500, request);
  }
});
