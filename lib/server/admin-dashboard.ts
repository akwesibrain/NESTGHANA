import "server-only";
import type { ListingStatus, RoomType } from "@/generated/prisma/client";
import { getDb } from "./db";

// Read-only figures for the admin overview. Everything comes from MySQL; nothing is estimated.
// Grouping happens in SQL so the dashboard stays fast as listings grow.

const DAY = 86_400_000;
const since = (days: number) => new Date(Date.now() - days * DAY);

/** Percentage change between two periods, or null when there is no earlier figure to compare with. */
export function trend(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

const PUBLIC_STATUSES: ListingStatus[] = ["LIVE", "NEEDS_CONFIRMATION", "UNAVAILABLE"];
const CATEGORY_GROUPS: { label: string; types: RoomType[] }[] = [
  { label: "Rooms", types: ["SINGLE_ROOM", "CHAMBER_HALL", "SELF_CONTAINED", "ONE_IN_ROOM", "TWO_IN_ROOM", "FOUR_IN_ROOM"] },
  { label: "Hostels", types: ["STUDENT_HOSTEL"] },
  { label: "Shops", types: ["SHOP", "STORE"] },
  { label: "Offices", types: ["OFFICE"] },
  { label: "Warehouses", types: ["WAREHOUSE"] },
  { label: "Other commercial", types: ["SHOWROOM", "SALON", "RESTAURANT", "COMMERCIAL_SPACE", "OTHER"] },
];

export async function getDashboardData() {
  const db = getDb();
  const [
    statusCounts, listingsNow, listingsBefore, ownersTotal, ownersNow, ownersBefore, ownersLive, adminsActive,
    revenueTotal, revenueNow, revenueBefore, paymentGroups, pending, reportsOpen, reportsNow, reportsBefore,
    failedLogins, lockouts, mfaFailures, typeCounts, regions, towns, recent, activity,
  ] = await Promise.all([
    db.listing.groupBy({ by: ["status"], _count: { _all: true } }),
    db.listing.count({ where: { createdAt: { gte: since(30) } } }),
    db.listing.count({ where: { createdAt: { gte: since(60), lt: since(30) } } }),
    db.owner.count(),
    db.owner.count({ where: { createdAt: { gte: since(30) } } }),
    db.owner.count({ where: { createdAt: { gte: since(60), lt: since(30) } } }),
    db.owner.count({ where: { listings: { some: { status: "LIVE" } } } }),
    db.adminUser.count({ where: { isActive: true } }),
    db.payment.aggregate({ where: { status: "PAID" }, _sum: { amountPesewas: true } }),
    db.payment.aggregate({ where: { status: "PAID", paidAt: { gte: since(30) } }, _sum: { amountPesewas: true } }),
    db.payment.aggregate({ where: { status: "PAID", paidAt: { gte: since(60), lt: since(30) } }, _sum: { amountPesewas: true } }),
    db.payment.groupBy({ by: ["status"], _count: { _all: true }, _sum: { amountPesewas: true } }),
    db.listing.findMany({
      where: { status: "PENDING_APPROVAL" },
      orderBy: { createdAt: "asc" },
      take: 3,
      select: {
        id: true, title: true, roomType: true, rentAmountPesewas: true, createdAt: true,
        area: { select: { name: true } },
        images: { where: { category: { not: "PROFILE" } }, orderBy: { displayOrder: "asc" }, take: 1, select: { id: true } },
      },
    }),
    db.report.count({ where: { status: { in: ["OPEN", "REVIEWING"] } } }),
    db.report.count({ where: { createdAt: { gte: since(7) } } }),
    db.report.count({ where: { createdAt: { gte: since(14), lt: since(7) } } }),
    db.securityEvent.count({ where: { eventType: "ADMIN_LOGIN_FAILED", createdAt: { gte: since(7) } } }),
    db.securityEvent.count({ where: { eventType: { in: ["ADMIN_ACCOUNT_LOCKED", "ADMIN_LOGIN_BLOCKED", "ADMIN_LOGIN_RATE_LIMITED"] }, createdAt: { gte: since(7) } } }),
    db.securityEvent.count({ where: { eventType: "ADMIN_MFA_FAILED", createdAt: { gte: since(7) } } }),
    db.listing.groupBy({ by: ["roomType"], where: { status: { in: PUBLIC_STATUSES } }, _count: { _all: true } }),
    db.$queryRaw<{ name: string; n: bigint }[]>`
      SELECT r.name, COUNT(*) AS n FROM listings l
      JOIN locations a ON a.id = l.area_id JOIN locations t ON t.id = a.parent_id JOIN locations r ON r.id = t.parent_id
      WHERE l.status IN ('LIVE', 'NEEDS_CONFIRMATION', 'UNAVAILABLE') GROUP BY r.name ORDER BY n DESC, r.name`,
    db.$queryRaw<{ name: string; n: bigint }[]>`
      SELECT t.name, COUNT(*) AS n FROM listings l
      JOIN locations a ON a.id = l.area_id JOIN locations t ON t.id = a.parent_id
      WHERE l.status IN ('LIVE', 'NEEDS_CONFIRMATION', 'UNAVAILABLE') GROUP BY t.name ORDER BY n DESC, t.name LIMIT 6`,
    db.listing.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: 6,
      select: {
        id: true, title: true, status: true, roomType: true, propertyCategory: true, rentAmountPesewas: true, rentPeriod: true, createdAt: true,
        area: { select: { name: true, parent: { select: { name: true } } } },
        images: { where: { category: { not: "PROFILE" } }, orderBy: { displayOrder: "asc" }, take: 1, select: { id: true } },
      },
    }),
    db.listingStatusHistory.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, newStatus: true, actorType: true, createdAt: true, listing: { select: { id: true, title: true } } },
    }),
  ]);

  const status = (s: ListingStatus) => statusCounts.find(row => row.status === s)?._count._all ?? 0;
  const totalListings = statusCounts.reduce((sum, row) => sum + row._count._all, 0);
  const pay = (s: string) => paymentGroups.find(row => row.status === s);
  // Stored times are UTC (see rate-limit.ts), so compare with UTC_TIMESTAMP().
  const [confirm] = await db.$queryRaw<{ days: number | null }[]>`
    SELECT AVG(TIMESTAMPDIFF(SECOND, last_confirmed_at, UTC_TIMESTAMP())) / 86400 AS days
    FROM listings WHERE status = 'LIVE' AND last_confirmed_at IS NOT NULL`;
  const avgConfirmDays = confirm?.days === null || confirm?.days === undefined ? null : Math.max(0, Math.round(Number(confirm.days)));
  const typeCount = (types: RoomType[]) => typeCounts.filter(row => types.includes(row.roomType)).reduce((sum, row) => sum + row._count._all, 0);

  return {
    kpis: {
      totalListings,
      listingsTrend: trend(listingsNow, listingsBefore),
      owners: ownersTotal,
      ownersTrend: trend(ownersNow, ownersBefore),
      revenuePesewas: revenueTotal._sum.amountPesewas ?? 0,
      revenueTrend: trend(revenueNow._sum.amountPesewas ?? 0, revenueBefore._sum.amountPesewas ?? 0),
      live: status("LIVE"),
    },
    moderation: { pending: status("PENDING_APPROVAL"), live: status("LIVE"), rejected: status("REJECTED"), queue: pending },
    owners: { total: ownersTotal, withLive: ownersLive, admins: adminsActive, newThisMonth: ownersNow },
    payments: {
      paid: { count: pay("PAID")?._count._all ?? 0, pesewas: pay("PAID")?._sum.amountPesewas ?? 0 },
      pending: { count: (pay("PENDING")?._count._all ?? 0) + (pay("PROCESSING")?._count._all ?? 0), pesewas: (pay("PENDING")?._sum.amountPesewas ?? 0) + (pay("PROCESSING")?._sum.amountPesewas ?? 0) },
      failed: { count: (pay("FAILED")?._count._all ?? 0) + (pay("ABANDONED")?._count._all ?? 0), pesewas: (pay("FAILED")?._sum.amountPesewas ?? 0) + (pay("ABANDONED")?._sum.amountPesewas ?? 0) },
      awaitingPayment: status("PAYMENT_PENDING"),
    },
    safety: { reportsOpen, reportsNow, reportsBefore, failedLogins, lockouts, mfaFailures },
    availability: {
      available: status("LIVE"),
      needsAttention: status("NEEDS_CONFIRMATION") + status("UNAVAILABLE"),
      avgConfirmDays,
    },
    regions: regions.map(row => ({ name: row.name, count: Number(row.n) })),
    towns: towns.map(row => ({ name: row.name, count: Number(row.n) })),
    categories: CATEGORY_GROUPS.map(group => ({ label: group.label, count: typeCount(group.types) })),
    recent,
    activity,
  };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;
