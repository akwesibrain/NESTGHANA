import { corsHeaders, isAllowedBrowserOrigin, jsonResponse } from "../_shared/http.ts";
import { recordVerifiedPayment, verifyPaystack } from "../_shared/payment.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders(request) });
  if (!isAllowedBrowserOrigin(request)) return jsonResponse({ error: "Origin is not allowed." }, 403, request);
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405, request);
  try {
    const body = await request.json();
    const reference = typeof body.reference === "string" ? body.reference : "";
    if (!/^NGH-[0-9A-F]{32}$/.test(reference)) return jsonResponse({ error: "Invalid payment reference." }, 400, request);
    const transaction = await verifyPaystack(reference);
    const result = await recordVerifiedPayment(reference, transaction);
    return jsonResponse(result, 200, request);
  } catch (error) {
    console.error("verify-listing-payment failed:", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Payment verification failed." }, 400, request);
  }
});
