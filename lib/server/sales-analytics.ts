import "server-only";
import type { ListingFeeType, PaymentStatus } from "@/generated/prisma/client";
import { getDb } from "./db";

// Listing-fee sales analytics for Admin → Payments. Everything is computed from MySQL on each
// request (grouping in SQL), so the live view always matches the database. Ghana is UTC+0, so
// UTC calendar days are Ghana calendar days.

export const SALES_PERIODS = [7, 30, 90] as const;
export type SalesPeriod = (typeof SALES_PERIODS)[number];

const DAY = 86_400_000;
const startOfDay = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
const isoDay = (date: Date) => date.toISOString().slice(0, 10);
const pctChange = (now: number, before: number) => (before ? Math.round(((now - before) / before) * 100) : null);

export async function getSalesAnalytics(days: SalesPeriod) {
  const db = getDb();
  const now = new Date();
  const today = startOfDay(now);
  const from = new Date(today.getTime() - (days - 1) * DAY);
  const previousFrom = new Date(from.getTime() - days * DAY);
  const sevenDaysAgo = new Date(today.getTime() - 6 * DAY);

  const [daily, attemptsDaily, byType, sums, statusInPeriod, funnelRows, recent] = await Promise.all([
    db.$queryRaw<{ d: Date | string; n: bigint; s: bigint | number | null }[]>`
      SELECT DATE(paid_at) AS d, COUNT(*) AS n, SUM(amount_pesewas) AS s
      FROM payments WHERE status = 'PAID' AND paid_at >= ${from}
      GROUP BY DATE(paid_at) ORDER BY d`,
    db.$queryRaw<{ d: Date | string; n: bigint }[]>`
      SELECT DATE(created_at) AS d, COUNT(*) AS n
      FROM payments WHERE created_at >= ${from}
      GROUP BY DATE(created_at) ORDER BY d`,
    db.payment.groupBy({
      by: ["listingType"],
      where: { status: "PAID", paidAt: { gte: from } },
      _count: { _all: true },
      _sum: { amountPesewas: true },
    }),
    db.$queryRaw<{ today: number | null; week: number | null; period: number | null; previous: number | null; all_time: number | null; paid_period: bigint }[]>`
      SELECT
        SUM(CASE WHEN paid_at >= ${today} THEN amount_pesewas ELSE 0 END) AS today,
        SUM(CASE WHEN paid_at >= ${sevenDaysAgo} THEN amount_pesewas ELSE 0 END) AS week,
        SUM(CASE WHEN paid_at >= ${from} THEN amount_pesewas ELSE 0 END) AS period,
        SUM(CASE WHEN paid_at >= ${previousFrom} AND paid_at < ${from} THEN amount_pesewas ELSE 0 END) AS previous,
        SUM(amount_pesewas) AS all_time,
        SUM(CASE WHEN paid_at >= ${from} THEN 1 ELSE 0 END) AS paid_period
      FROM payments WHERE status = 'PAID'`,
    db.payment.groupBy({ by: ["status"], where: { createdAt: { gte: from } }, _count: { _all: true } }),
    db.$queryRaw<{ submitted: bigint; paid: bigint; approved: bigint }[]>`
      SELECT
        COUNT(*) AS submitted,
        SUM(CASE WHEN EXISTS (SELECT 1 FROM payments p WHERE p.listing_id = l.id AND p.status = 'PAID') THEN 1 ELSE 0 END) AS paid,
        SUM(CASE WHEN l.approved_at IS NOT NULL THEN 1 ELSE 0 END) AS approved
      FROM listings l WHERE l.created_at >= ${from}`,
    db.payment.findMany({
      orderBy: { updatedAt: "desc" },
      take: 8,
      select: {
        id: true, reference: true, status: true, amountPesewas: true, listingType: true, updatedAt: true,
        listing: { select: { id: true, title: true } },
      },
    }),
  ]);

  // One point per day, including days with no sales.
  const key = (d: Date | string) => (typeof d === "string" ? d.slice(0, 10) : isoDay(d));
  const paidByDay = new Map(daily.map(r => [key(r.d), { count: Number(r.n), pesewas: Number(r.s ?? 0) }]));
  const attemptsByDay = new Map(attemptsDaily.map(r => [key(r.d), Number(r.n)]));
  const series = Array.from({ length: days }, (_, i) => {
    const day = isoDay(new Date(from.getTime() + i * DAY));
    return { day, pesewas: paidByDay.get(day)?.pesewas ?? 0, paid: paidByDay.get(day)?.count ?? 0, attempts: attemptsByDay.get(day) ?? 0 };
  });

  const status = (s: PaymentStatus[]) => statusInPeriod.filter(r => s.includes(r.status)).reduce((t, r) => t + r._count._all, 0);
  const finished = status(["PAID", "FAILED", "ABANDONED"]);
  const s = sums[0];
  const paidInPeriod = Number(s?.paid_period ?? 0);
  const periodPesewas = Number(s?.period ?? 0);
  const types: ListingFeeType[] = ["ROOM", "HOSTEL", "SPACE"];
  const f = funnelRows[0];

  return {
    generatedAt: now.toISOString(),
    days,
    kpis: {
      todayPesewas: Number(s?.today ?? 0),
      weekPesewas: Number(s?.week ?? 0),
      periodPesewas,
      periodTrend: pctChange(periodPesewas, Number(s?.previous ?? 0)),
      allTimePesewas: Number(s?.all_time ?? 0),
      paidCount: paidInPeriod,
      averagePesewas: paidInPeriod ? Math.round(periodPesewas / paidInPeriod) : 0,
      successRate: finished ? Math.round((status(["PAID"]) / finished) * 100) : null,
      inProgress: status(["PENDING", "PROCESSING"]),
    },
    series,
    byType: types.map(type => {
      const row = byType.find(r => r.listingType === type);
      return { type, count: row?._count._all ?? 0, pesewas: row?._sum.amountPesewas ?? 0 };
    }),
    funnel: { submitted: Number(f?.submitted ?? 0), paid: Number(f?.paid ?? 0), approved: Number(f?.approved ?? 0) },
    recent: recent.map(p => ({
      id: p.id, reference: p.reference, status: p.status, pesewas: p.amountPesewas, type: p.listingType,
      at: p.updatedAt.toISOString(), listingId: p.listing.id, title: p.listing.title,
    })),
  };
}

export type SalesAnalytics = Awaited<ReturnType<typeof getSalesAnalytics>>;
