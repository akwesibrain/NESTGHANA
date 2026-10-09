import type { NextRequest } from "next/server";
import { getDb } from "@/lib/server/db";
import { mimeForKey, readImage } from "@/lib/server/image-storage";

// Public listing photos: only approved, non-profile photos of LIVE listings are ever served.
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/images/[id]">) {
  const { id } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response(null, { status: 404 });

  const image = await getDb().listingImage.findFirst({
    where: { id, approvedForPublic: true, category: { not: "PROFILE" }, listing: { status: "LIVE" } },
    select: { storagePath: true },
  });
  if (!image) return new Response(null, { status: 404 });

  try {
    const bytes = await readImage(image.storagePath);
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": mimeForKey(image.storagePath),
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
