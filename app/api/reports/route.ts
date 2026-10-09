import { z } from "zod";
import { getDb } from "@/lib/server/db";
import { clientIp, consumeRateLimit, hashIp } from "@/lib/server/rate-limit";

const body = z.object({
  listing_id: z.uuid(),
  reason: z.string().trim().min(3).max(1000),
});

// Anyone may report a LIVE listing; reports go to the admin review queue.
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.startsWith("application/json")) {
    return Response.json({ error: "Expected JSON." }, { status: 415 });
  }

  let input: z.infer<typeof body>;
  try {
    const parsed = body.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Please describe the problem (3–1000 characters)." }, { status: 400 });
    input = parsed.data;
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  try {
    const limit = await consumeRateLimit("reports", hashIp(clientIp(request)), 5, 3600);
    if (!limit.allowed) {
      return Response.json(
        { error: "Too many reports. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
      );
    }

    const db = getDb();
    const listing = await db.listing.findFirst({ where: { id: input.listing_id, status: "LIVE" }, select: { id: true } });
    if (!listing) return Response.json({ error: "Listing not found." }, { status: 404 });

    await db.report.create({ data: { listingId: listing.id, reason: input.reason } });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("report_create_failed", error instanceof Error ? error.message : "unknown");
    return Response.json({ error: "Your report could not be sent." }, { status: 503 });
  }
}
