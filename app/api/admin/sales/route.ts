import type { NextRequest } from "next/server";
import { hasRole } from "@/lib/server/admin-auth";
import { getAdminContext } from "@/lib/server/admin-session";
import { getSalesAnalytics, SALES_PERIODS, type SalesPeriod } from "@/lib/server/sales-analytics";

// Live sales data for Admin → Payments (polled by the page). Admins with payment access only.
export async function GET(request: NextRequest) {
  const admin = await getAdminContext();
  if (!admin?.mfaVerified) return Response.json({ error: "Sign in required." }, { status: 401 });
  if (!hasRole(admin, ["SUPER_ADMIN", "ADMIN"])) return Response.json({ error: "Not allowed." }, { status: 403 });

  const requested = Number(request.nextUrl.searchParams.get("days"));
  const days = (SALES_PERIODS as readonly number[]).includes(requested) ? (requested as SalesPeriod) : 30;
  try {
    return Response.json(await getSalesAnalytics(days), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("sales_analytics_failed", error instanceof Error ? error.message : "unknown");
    return Response.json({ error: "Sales data is temporarily unavailable." }, { status: 503 });
  }
}
