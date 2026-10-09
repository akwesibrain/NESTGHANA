import type { NextRequest } from "next/server";
import { getDb } from "@/lib/server/db";
import { mimeForKey, readImage } from "@/lib/server/image-storage";
import { getAdminContext } from "@/lib/server/admin-session";

// Any listing photo (including pending and profile photos) for signed-in, MFA-verified admins.
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/admin/images/[id]">) {
  const admin = await getAdminContext();
  if (!admin?.mfaVerified) return new Response(null, { status: 401 });

  const { id } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response(null, { status: 404 });
  const image = await getDb().listingImage.findUnique({ where: { id }, select: { storagePath: true } });
  if (!image) return new Response(null, { status: 404 });

  try {
    const bytes = await readImage(image.storagePath);
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": mimeForKey(image.storagePath),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
