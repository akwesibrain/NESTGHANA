import { z } from "zod";
import { LISTING_PAGE_MAX, listPublicListings } from "@/lib/server/public-listings";

const query = z.object({
  offset: z.coerce.number().int().min(0).max(100_000).default(0),
  limit: z.coerce.number().int().min(1).max(LISTING_PAGE_MAX).default(12),
});

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const parsed = query.safeParse(params);
  if (!parsed.success) return Response.json({ error: "Invalid pagination." }, { status: 400 });

  try {
    const rows = await listPublicListings(parsed.data.offset, parsed.data.limit);
    return Response.json({ rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("public_listings_failed", error instanceof Error ? error.message : "unknown");
    return Response.json({ error: "Listings are temporarily unavailable." }, { status: 503 });
  }
}
