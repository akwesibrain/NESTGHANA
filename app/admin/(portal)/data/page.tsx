import Link from "next/link";
import type { DataOrderStatus } from "@/generated/prisma/client";
import { saveDataPackage, updateDataOrder } from "@/app/admin/actions";
import { Card, cedis, ghanaDate } from "@/app/admin/admin-ui";
import { hasRole } from "@/lib/server/admin-auth";
import { requireAdmin } from "@/lib/server/admin-session";
import { DATA_ORDER_LABEL, getDataSalesSummary, NETWORK_LABEL } from "@/lib/server/data-bundles";
import { getDb } from "@/lib/server/db";
import { paystackConfigured } from "@/lib/server/paystack";

type SearchParams = Promise<{ status?: string; data?: string }>;

const TONE: Record<DataOrderStatus, "good" | "warning" | "critical" | "neutral"> = {
  PENDING: "neutral", PAID: "warning", DELIVERED: "good", FAILED: "critical", CANCELLED: "neutral",
};
const messages: Record<string, { kind: "success" | "error"; text: string }> = {
  deliver: { kind: "success", text: "Order marked as delivered." },
  undeliver: { kind: "success", text: "Order moved back to “Paid, to deliver”." },
  cancel: { kind: "success", text: "Order cancelled." },
  not_allowed: { kind: "error", text: "That order has already been updated. Check its current status." },
  note_required: { kind: "error", text: "Give a reason (at least 3 characters) when cancelling a paid order." },
  invalid: { kind: "error", text: "That request was not valid." },
  package_saved: { kind: "success", text: "Package saved. The Buy Data page shows it straight away." },
  package_invalid: { kind: "error", text: "Check the package: name, size and a price between GH₵0.10 and GH₵5,000 are required." },
};
/** Local format (024…) for dialling when sending the bundle. */
const localPhone = (e164: string) => `0${e164.slice(4)}`;

export default async function AdminDataPage({ searchParams }: { searchParams: SearchParams }) {
  const admin = await requireAdmin(["SUPER_ADMIN", "ADMIN", "SUPPORT"]);
  const params = await searchParams;
  const status = (Object.keys(DATA_ORDER_LABEL) as DataOrderStatus[]).find(s => s === params.status);
  const canEditPackages = hasRole(admin, ["SUPER_ADMIN", "ADMIN"]);
  const db = getDb();
  const [orders, packages, summary] = await Promise.all([
    db.dataOrder.findMany({
      // By default, show paid orders, with those still waiting for their bundle first.
      where: status ? { status } : { status: { in: ["PAID", "DELIVERED", "CANCELLED"] } },
      orderBy: status ? { createdAt: "desc" } : [{ status: "asc" }, { createdAt: "desc" }],
      take: 100,
      include: { deliveredBy: { select: { displayName: true, email: true } } },
    }),
    db.dataPackage.findMany({ orderBy: [{ network: "asc" }, { pricePesewas: "asc" }] }),
    getDataSalesSummary(),
  ]);
  const message = params.data ? messages[params.data] : undefined;

  return (
    <>
      <div className="ngd-page-head">
        <div><h1>Data bundles</h1><p>Orders from the Buy Data page. Send the bundle to the customer’s number, then mark the order delivered.</p></div>
        <Link className="ngd-chip" href="/buy-data/index.html" target="_blank">Open Buy Data page</Link>
      </div>
      {message ? <p className="status-banner" data-kind={message.kind} role={message.kind === "error" ? "alert" : "status"}>{message.text}</p> : null}
      {!paystackConfigured() ? (
        <p className="status-banner" data-kind="error" role="alert">
          Online payment is switched off because PAYSTACK_SECRET_KEY is not set, so customers cannot buy bundles yet.
        </p>
      ) : null}

      <div className="sales-kpis data-kpis">
        <div className="sales-kpi"><span>To deliver</span><strong>{summary.toDeliver}</strong><small>paid, bundle not sent yet</small></div>
        <div className="sales-kpi"><span>Today</span><strong>{cedis(summary.todayPesewas, 2)}</strong><small>paid orders</small></div>
        <div className="sales-kpi"><span>Last 30 days</span><strong>{cedis(summary.last30DaysPesewas, 2)}</strong><small>paid orders</small></div>
        <div className="sales-kpi"><span>All time</span><strong>{cedis(summary.allTimePesewas, 2)}</strong><small>{summary.paidCount} paid order{summary.paidCount === 1 ? "" : "s"}</small></div>
      </div>
      <div className="ngd-spacer" />

      <Card title="Orders">
        <nav className="ngd-tabs-filter" aria-label="Filter by order status">
          <Link className={!status ? "is-active" : undefined} href="/admin/data">Paid orders</Link>
          {(Object.keys(DATA_ORDER_LABEL) as DataOrderStatus[]).map(s => (
            <Link key={s} className={s === status ? "is-active" : undefined} href={`/admin/data?status=${s}`}>{DATA_ORDER_LABEL[s]}</Link>
          ))}
        </nav>
        <div className="ngd-table-wrap">
          <table className="ngd-table">
            <thead><tr><th>Ordered</th><th>Bundle</th><th>Send to</th><th>Receipt email</th><th>Amount</th><th>Status</th><th>Reference</th><th>Action</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{ghanaDate(o.createdAt, true)}</td>
                  <td>
                    <strong>{NETWORK_LABEL[o.network]} {o.dataAmount}</strong>
                    {o.packageName !== `${NETWORK_LABEL[o.network]} ${o.dataAmount}` ? <><br /><span className="ngd-muted">{o.packageName}</span></> : null}
                  </td>
                  <td><strong>{localPhone(o.customerPhoneE164)}</strong></td>
                  <td>{o.customerEmail}</td>
                  <td>{cedis(o.amountPesewas, 2)}</td>
                  <td>
                    <span className={`ngd-badge is-${TONE[o.status]}`}>{DATA_ORDER_LABEL[o.status]}</span>
                    {o.deliveredAt ? <><br /><span className="ngd-muted">{ghanaDate(o.deliveredAt, true)} · {o.deliveredBy?.displayName || o.deliveredBy?.email || ""}</span></> : null}
                    {o.note ? <><br /><span className="ngd-muted">{o.note}</span></> : null}
                  </td>
                  <td><code>{o.reference}</code></td>
                  <td>
                    {o.status === "PAID" ? (
                      <form className="ngd-review" action={updateDataOrder}>
                        <input type="hidden" name="orderId" value={o.id} />
                        <button className="ngd-btn is-primary" name="action" value="deliver">Mark delivered</button>
                        <input type="text" name="note" placeholder="Reason, if cancelling" maxLength={500} aria-label="Reason for cancelling" />
                        <button className="ngd-btn is-danger" name="action" value="cancel">Cancel order</button>
                      </form>
                    ) : o.status === "DELIVERED" ? (
                      <form className="ngd-review" action={updateDataOrder}>
                        <input type="hidden" name="orderId" value={o.id} />
                        <button className="ngd-btn" name="action" value="undeliver">Undo delivered</button>
                      </form>
                    ) : <span className="ngd-muted">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!orders.length ? <p className="ngd-empty">No orders{status ? " with this status" : " yet"}.</p> : null}
        </div>
        <p className="ngd-note">Shows the 100 most recent. Checkouts that were started but not paid are under “Awaiting payment”.</p>
      </Card>

      <div className="ngd-gap-top">
        <Card title="Packages on sale">
          <div className="ngd-table-wrap">
            <table className="ngd-table">
              <thead><tr><th>Network</th><th>Name</th><th>Size</th><th>Price (GH₵)</th><th>On sale</th>{canEditPackages ? <th>Save</th> : null}</tr></thead>
              <tbody>
                {packages.map(p => (
                  <tr key={p.id}>
                    {canEditPackages ? (
                      <PackageFields formId={`pkg-${p.id}`} network={p.network} name={p.packageName} size={p.dataAmount} price={(p.pricePesewas / 100).toFixed(2)} active={p.active} />
                    ) : (
                      <><td>{NETWORK_LABEL[p.network]}</td><td>{p.packageName}</td><td>{p.dataAmount}</td><td>{cedis(p.pricePesewas, 2)}</td><td>{p.active ? "Yes" : "No"}</td></>
                    )}
                    {canEditPackages ? (
                      <td>
                        <form id={`pkg-${p.id}`} action={saveDataPackage}><input type="hidden" name="packageId" value={p.id} /><button className="ngd-btn">Save</button></form>
                      </td>
                    ) : null}
                  </tr>
                ))}
                {canEditPackages ? (
                  <tr>
                    <PackageFields formId="pkg-new" network="MTN" name="" size="" price="" active />
                    <td><form id="pkg-new" action={saveDataPackage}><input type="hidden" name="packageId" value="" /><button className="ngd-btn is-primary">Add package</button></form></td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <p className="ngd-note">A price change applies to new orders only. Take a package off sale instead of deleting it, so past orders keep their record.</p>
        </Card>
      </div>
    </>
  );
}

function PackageFields({ formId, network, name, size, price, active }: { formId: string; network: string; name: string; size: string; price: string; active: boolean }) {
  return (
    <>
      <td>
        <select className="ngd-cell-input" form={formId} name="network" defaultValue={network} aria-label="Network">
          {Object.entries(NETWORK_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </td>
      <td><input className="ngd-cell-input" form={formId} type="text" name="packageName" defaultValue={name} placeholder="e.g. MTN 10GB" maxLength={80} required aria-label="Package name" /></td>
      <td><input className="ngd-cell-input is-short" form={formId} type="text" name="dataAmount" defaultValue={size} placeholder="10GB" maxLength={20} required aria-label="Data size" /></td>
      <td><input className="ngd-cell-input is-short" form={formId} type="text" inputMode="decimal" name="price" defaultValue={price} placeholder="0.00" required aria-label="Price in cedis" /></td>
      <td><input form={formId} type="checkbox" name="active" defaultChecked={active} aria-label="On sale" /></td>
    </>
  );
}
