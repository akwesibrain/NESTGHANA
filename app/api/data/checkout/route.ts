import { DataOrderError, startDataCheckout } from "@/lib/server/data-bundles";
import { isSameOrigin, json, siteBaseUrl } from "@/lib/server/http";
import { clientIp, consumeRateLimit, hashIp } from "@/lib/server/rate-limit";

// Starts a Paystack checkout for a data bundle. The response keeps the shape the Buy Data page
// already used: { success, authorization_url, reference, order_id } or { success: false, error }.
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ success: false, error: "Origin is not allowed." }, 403);
  try {
    const ipHash = hashIp(clientIp(request));
    const limit = await consumeRateLimit("data_checkout", ipHash, 10, 600);
    if (!limit.allowed) return json({ success: false, error: "Too many attempts. Please wait a few minutes." }, 429);

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    const checkout = await startDataCheckout({
      packageId: body?.package_id,
      customerPhone: body?.customer_phone,
      customerEmail: body?.customer_email,
      callbackUrl: `${siteBaseUrl(request)}/buy-data/index.html`,
      ipHash,
    });
    return json({ success: true, authorization_url: checkout.authorizationUrl, reference: checkout.reference, order_id: checkout.orderId });
  } catch (error) {
    if (error instanceof DataOrderError) return json({ success: false, error: error.message }, error.status);
    console.error("data_checkout_route_failed", error instanceof Error ? error.message : "unknown");
    return json({ success: false, error: "We could not start the payment. Please try again." }, 500);
  }
}
