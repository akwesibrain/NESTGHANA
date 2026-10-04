import { getPublicSiteSettings } from "@/lib/server/public-listings";

export async function GET() {
  try {
    const settings = await getPublicSiteSettings();
    if (!settings) return Response.json({ error: "Settings are not configured." }, { status: 503 });
    return Response.json(settings, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("public_settings_failed", error instanceof Error ? error.message : "unknown");
    return Response.json({ error: "Settings are temporarily unavailable." }, { status: 503 });
  }
}
