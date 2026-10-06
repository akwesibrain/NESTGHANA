import { json, isSameOrigin, siteBaseUrl } from "@/lib/server/http";
import { createSubmission, type PhotoFile, SubmissionError } from "@/lib/server/listing-submission";
import { paystackConfigured } from "@/lib/server/paystack";
import { PaymentError, startCheckout } from "@/lib/server/payments";
import { clientIp, consumeRateLimit, hashIp } from "@/lib/server/rate-limit";

const MAX_BODY_BYTES = 6 * 1024 * 1024;

// "List your property": validates and stores the submission, then starts Paystack checkout.
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ error: "Origin is not allowed." }, 403);
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return json({ error: "The compressed photos are too large to upload together." }, 413);
  }
  if (!paystackConfigured()) {
    return json({ error: "Online payment is not set up yet. Your listing was not submitted; please try again later." }, 503);
  }

  try {
    const limit = await consumeRateLimit("listing_submit", hashIp(clientIp(request)), 10, 3600);
    if (!limit.allowed) {
      return json({ error: "Too many listing submissions from this connection. Please try again later." }, 429, {
        "Retry-After": String(limit.retryAfterSeconds),
      });
    }

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return json({ error: "The submission could not be read. Please try again." }, 400);
    }
    const listingText = form.get("listing");
    if (typeof listingText !== "string" || listingText.length > 100_000) {
      return json({ error: "Listing details are incomplete. Please review and submit again." }, 400);
    }
    let listing: unknown;
    try {
      listing = JSON.parse(listingText);
    } catch {
      return json({ error: "Listing details are incomplete. Please review and submit again." }, 400);
    }

    const photos: PhotoFile[] = [];
    for (const [field, value] of form.entries()) {
      if (!field.startsWith("photo:") && field !== "profile_photo") continue;
      if (!(value instanceof File)) return json({ error: "A photo upload is invalid." }, 400);
      photos.push({ field, bytes: new Uint8Array(await value.arrayBuffer()) });
    }

    const submission = await createSubmission(String(form.get("submission_id") ?? ""), listing, photos);
    const checkout = await startCheckout({
      listingId: submission.listingId,
      ownerEmail: submission.ownerEmail,
      expectedFeePesewas: Number(form.get("expected_fee_pesewas")),
      callbackUrl: `${siteBaseUrl(request)}/index.html`,
    });
    return json({ authorization_url: checkout.authorizationUrl, reference: checkout.reference });
  } catch (error) {
    if (error instanceof SubmissionError || error instanceof PaymentError) return json({ error: error.message }, error.status);
    console.error("listing_submit_failed", error instanceof Error ? error.message : "unknown");
    return json({ error: "Unable to submit this listing right now. Please try again later." }, 500);
  }
}
