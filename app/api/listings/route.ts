import { z } from "zod";
import { LISTING_PAGE_MAX, listPublicListings } from "@/lib/server/public-listings";

const optionalText = z.string().trim().min(1).max(100).optional();
const optionalAmount = z.coerce.number().min(0).max(100_000_000).optional();
const optionalFlag = z.enum(["true", "false"]).transform(value => value === "true").optional();

const query = z.object({
  category: z.enum(["room", "commercial"]).default("room"),
  offset: z.coerce.number().int().min(0).max(100_000).default(0),
  limit: z.coerce.number().int().min(1).max(LISTING_PAGE_MAX).default(24),
  // Shops & Spaces filters (ignored for rooms).
  region: optionalText,
  town: optionalText,
  location: optionalText,
  type: optionalText,
  minRent: optionalAmount,
  maxRent: optionalAmount,
  minSize: optionalAmount,
  maxSize: optionalAmount,
  roadVisibility: optionalFlag,
  parking: optionalFlag,
  electricity: optionalFlag,
  water: optionalFlag,
});

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  const parsed = query.safeParse(params);
  if (!parsed.success) return Response.json({ error: "Invalid listing filters." }, { status: 400 });

  const { category, offset, limit, ...filters } = parsed.data;
  try {
    const rows = await listPublicListings(category, offset, limit, filters);
    return Response.json({ rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("public_listings_failed", error instanceof Error ? error.message : "unknown");
    return Response.json({ error: "Listings are temporarily unavailable." }, { status: 503 });
  }
}
