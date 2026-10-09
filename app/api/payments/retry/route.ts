import { z } from "zod";
import { getDb } from "@/lib/server/db";
import { json, isSameOrigin, siteBaseUrl } from "@/lib/server/http";
import { paystackConfigured } from "@/lib/server/paystack";
import { PaymentError, startCheckout } from "@/lib/server/payments";
import { clientIp, consumeRateLimit, hashIp } from "@/lib/server/rate-limit";

const body = z.object({
  submission_id: z.uuid(),
  email: z.email().max(254).transform(v => v.toLowerCase()),
  expected_fee_pesewas: z.number().int().positive(),
});

// Restarts checkout for an already-submitted listing (after a failed or cancelled payment) without
// re-uploading. The owner email must match, so a leaked submission id alone is not enough.
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ error: "Origin is not allowed." }, 403);
  if (!paystackConfigured()) return json({ error: "Online payment is not set up yet." }, 503);
  try {
    const limit = await consumeRateLimit("payment_retry", hashIp(clientIp(request)), 10, 3600);
    if (!limit.allowed) return json({ error: "Too many payment attempts. Please try again later." }, 429);

    const parsed = body.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return json({ error: "The payment retry request is invalid." }, 400);

    const listing = await getDb().listing.findUnique({
      where: { submissionId: parsed.data.submission_id },
      select: { id: true, owner: { select: { email: true } } },
    });
    if (!listing || listing.owner.email !== parsed.data.email) return json({ error: "Listing not found." }, 404);

    const checkout = await startCheckout({
      listingId: listing.id,
      ownerEmail: listing.owner.email,
      expectedFeePesewas: parsed.data.expected_fee_pesewas,
      callbackUrl: `${siteBaseUrl(request)}/index.html`,
    });
    return json({ authorization_url: checkout.authorizationUrl, reference: checkout.reference });
  } catch (error) {
    if (error instanceof PaymentError) return json({ error: error.message }, error.status);
    console.error("payment_retry_failed", error instanceof Error ? error.message : "unknown");
    return json({ error: "Secure checkout could not be started. Please try again later." }, 500);
  }
}
