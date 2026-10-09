import Link from "next/link";
import type { PaymentStatus } from "@/generated/prisma/client";
import { AdminFrame, Card, cedis, ghanaDate } from "@/app/admin/admin-ui";
import { SalesLive } from "@/app/admin/payments/sales-live";
import { getSalesAnalytics } from "@/lib/server/sales-analytics";
import { requireAdmin } from "@/lib/server/admin-session";
import { getDb } from "@/lib/server/db";

type SearchParams = Promise<{ status?: string }>;

const STATUS: Record<PaymentStatus, { label: string; tone: "good" | "warning" | "critical" | "neutral" }> = {
  PAID: { label: "Paid", tone: "good" },
  PENDING: { label: "Pending", tone: "warning" },
  PROCESSING: { label: "Processing", tone: "warning" },
  FAILED: { label: "Failed", tone: "critical" },
  ABANDONED: { label: "Cancelled", tone: "neutral" },
  REFUNDED: { label: "Refunded", tone: "neutral" },
  PARTIALLY_REFUNDED: { label: "Partly refunded", tone: "neutral" },
};
const TYPE_LABEL = { ROOM: "Room", HOSTEL: "Hostel", SPACE: "Shop / space" } as const;

export default async function AdminPaymentsPage({ searchParams }: { searchParams: SearchParams }) {
  const admin = await requireAdmin(["SUPER_ADMIN", "ADMIN"]);
  const params = await searchParams;
  const status = (Object.keys(STATUS) as PaymentStatus[]).find(s => s === params.status);
  const db = getDb();
  const [payments, sales, openReports] = await Promise.all([
    db.payment.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true, reference: true, listingType: true, amountPesewas: true, status: true, createdAt: true, paidAt: true,
        listing: { select: { id: true, title: true, owner: { select: { fullName: true } } } },
      },
    }),
    getSalesAnalytics(30),
    db.report.count({ where: { status: { in: ["OPEN", "REVIEWING"] } } }),
  ]);

  return (
    <AdminFrame admin={admin} active="/admin/payments" alerts={openReports}>
      <div className="ngd-page-head">
        <div><h1>Payments</h1><p>Listing fees paid through Paystack. Amounts are recorded only after Paystack confirms them.</p></div>
      </div>
      <SalesLive initial={sales} />
      <div className="ngd-spacer" />
      <Card title="Payment attempts">
        <nav className="ngd-tabs-filter" aria-label="Filter by payment status">
          <Link className={!status ? "is-active" : undefined} href="/admin/payments">All</Link>
          {(Object.keys(STATUS) as PaymentStatus[]).map(s => (
            <Link key={s} className={s === status ? "is-active" : undefined} href={`/admin/payments?status=${s}`}>{STATUS[s].label}</Link>
          ))}
        </nav>
        <div className="ngd-table-wrap">
          <table className="ngd-table">
            <thead><tr><th>Reference</th><th>Listing</th><th>Owner</th><th>Fee type</th><th>Amount</th><th>Status</th><th>Started</th><th>Paid</th></tr></thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td><code>{p.reference}</code></td>
                  <td><Link href={`/admin/listings/${p.listing.id}`}>{p.listing.title}</Link></td>
                  <td>{p.listing.owner.fullName}</td>
                  <td>{TYPE_LABEL[p.listingType]}</td>
                  <td>{cedis(p.amountPesewas, 2)}</td>
                  <td><span className={`ngd-badge is-${STATUS[p.status].tone}`}>{STATUS[p.status].label}</span></td>
                  <td>{ghanaDate(p.createdAt, true)}</td>
                  <td>{p.paidAt ? ghanaDate(p.paidAt, true) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!payments.length ? <p className="ngd-empty">No payments{status ? " with this status" : " yet"}.</p> : null}
        </div>
        <p className="ngd-note">Shows the 100 most recent attempts.</p>
      </Card>
    </AdminFrame>
  );
}

