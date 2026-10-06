import { updateListingFees } from "@/app/admin/actions";
import { AdminFrame, Card, cedis, ghanaDate } from "@/app/admin/admin-ui";
import { hasRole } from "@/lib/server/admin-auth";
import { requireAdmin } from "@/lib/server/admin-session";
import { getDb } from "@/lib/server/db";

type SearchParams = Promise<{ fee?: string }>;

const feeMessages: Record<string, { kind: "success" | "error"; text: string }> = {
  saved: { kind: "success", text: "Listing fees updated. New checkouts use these amounts." },
  invalid: { kind: "error", text: "Enter three positive fees (up to two decimal places) and a reason." },
  save_failed: { kind: "error", text: "The listing fees could not be saved. Please try again." },
};

export default async function AdminSettingsPage({ searchParams }: { searchParams: SearchParams }) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const canManage = hasRole(admin, ["SUPER_ADMIN", "ADMIN"]);
  const db = getDb();
  const [settings, history, admins, openReports] = await Promise.all([
    db.websiteSettings.findUnique({ where: { id: 1 } }),
    db.websiteSettingsHistory.findMany({ orderBy: { createdAt: "desc" }, take: 10, include: { changedBy: { select: { displayName: true, email: true } } } }),
    db.adminUser.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, email: true, displayName: true, isActive: true, mfaEnabledAt: true, lastLoginAt: true, roles: { select: { role: true } } },
    }),
    db.report.count({ where: { status: { in: ["OPEN", "REVIEWING"] } } }),
  ]);
  const message = params.fee ? feeMessages[params.fee] : undefined;

  return (
    <AdminFrame admin={admin} active="/admin/settings" alerts={openReports}>
      <div className="ngd-page-head">
        <div><h1>Settings</h1><p>Listing fees and the admin team.</p></div>
      </div>
      {message ? <p className="status-banner" data-kind={message.kind} role={message.kind === "error" ? "alert" : "status"}>{message.text}</p> : null}

      <div className="ngd-row ngd-row-bottom">
        <Card title="Listing fees">
          <p className="ngd-note">One-time fee an owner pays to submit a listing. Student hostels pay the hostel fee; shops and spaces pay the space fee. Payments already started keep their original amount.</p>
          {!settings ? <p className="status-banner" data-kind="error" role="alert">Website settings are missing. Run the database migrations.</p> : canManage ? (
            <form className="ngd-fee-form" action={updateListingFees}>
              <label className="ngd-field">Room fee (GH₵)<input name="roomFee" type="number" min="0.01" step="0.01" defaultValue={(settings.roomFeePesewas / 100).toFixed(2)} required /></label>
              <label className="ngd-field">Hostel fee (GH₵)<input name="hostelFee" type="number" min="0.01" step="0.01" defaultValue={(settings.hostelFeePesewas / 100).toFixed(2)} required /></label>
              <label className="ngd-field">Shop / space fee (GH₵)<input name="spaceFee" type="number" min="0.01" step="0.01" defaultValue={(settings.spaceFeePesewas / 100).toFixed(2)} required /></label>
              <label className="ngd-field ngd-fee-reason">Reason for change<input name="reason" type="text" minLength={3} maxLength={1000} required placeholder="e.g. New pricing from 1 November" /></label>
              <button className="ngd-btn is-primary" type="submit">Save listing fees</button>
            </form>
          ) : (
            <p>Room {cedis(settings.roomFeePesewas, 2)} · Hostel {cedis(settings.hostelFeePesewas, 2)} · Space {cedis(settings.spaceFeePesewas, 2)}. Only admins can change fees.</p>
          )}
          <h3>Fee history</h3>
          <div className="ngd-table-wrap">
            <table className="ngd-table">
              <thead><tr><th>Changed</th><th>Room</th><th>Hostel</th><th>Space</th><th>By</th><th>Reason</th></tr></thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.id}>
                    <td>{ghanaDate(h.createdAt, true)}</td>
                    <td>{cedis(h.roomFeePesewas, 2)}</td><td>{cedis(h.hostelFeePesewas, 2)}</td><td>{cedis(h.spaceFeePesewas, 2)}</td>
                    <td>{h.changedBy?.displayName || h.changedBy?.email || "—"}</td>
                    <td>{h.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!history.length ? <p className="ngd-empty">No fee changes yet.</p> : null}
          </div>
        </Card>

        <Card title="Admin team">
          <ul className="ngd-alerts">
            {admins.map(a => (
              <li key={a.id} className={a.isActive ? "is-good" : "is-neutral"}>
                <span className="ngd-avatar" aria-hidden="true">{(a.displayName || a.email).slice(0, 1).toUpperCase()}</span>
                <div>
                  <span>{a.displayName || a.email}{a.id === admin.user.id ? " (you)" : ""}</span>
                  <small>{a.email} · {a.roles.map(r => r.role.replace("_", " ").toLowerCase()).join(", ") || "no role"}</small>
                  <small>{a.isActive ? "Active" : "Disabled"} · authenticator {a.mfaEnabledAt ? "set up" : "not set up"} · last sign-in {a.lastLoginAt ? ghanaDate(a.lastLoginAt) : "never"}</small>
                </div>
              </li>
            ))}
          </ul>
          <p className="ngd-note">Add or reset admins with <code>npm run admin:create</code> on the server.</p>
        </Card>
      </div>
    </AdminFrame>
  );
}
