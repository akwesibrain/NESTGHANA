import Link from "next/link";
import type { ReportStatus } from "@/generated/prisma/client";
import { updateReportStatus } from "@/app/admin/actions";
import { AdminFrame, Card, ghanaDate, StatusBadge } from "@/app/admin/admin-ui";
import { hasRole } from "@/lib/server/admin-auth";
import { requireAdmin } from "@/lib/server/admin-session";
import { getDb } from "@/lib/server/db";

type SearchParams = Promise<{ report?: string }>;

const REPORT: Record<ReportStatus, { label: string; tone: string }> = {
  OPEN: { label: "Open", tone: "critical" },
  REVIEWING: { label: "Reviewing", tone: "warning" },
  RESOLVED: { label: "Resolved", tone: "good" },
  DISMISSED: { label: "Dismissed", tone: "neutral" },
};
const EVENT_LABEL: Record<string, string> = {
  ADMIN_LOGIN_FAILED: "Failed sign-in",
  ADMIN_ACCOUNT_LOCKED: "Account locked",
  ADMIN_LOGIN_BLOCKED: "Sign-in blocked (locked)",
  ADMIN_LOGIN_RATE_LIMITED: "Sign-in rate limited",
  ADMIN_MFA_FAILED: "Wrong authenticator code",
  ADMIN_MFA_ENROLLED: "Authenticator set up",
  ADMIN_LOGIN_SUCCEEDED: "Signed in",
};
const messages: Record<string, { kind: "success" | "error"; text: string }> = {
  saved: { kind: "success", text: "Report updated." },
  invalid: { kind: "error", text: "That report update was not valid." },
  failed: { kind: "error", text: "The report could not be updated. Please try again." },
};

export default async function AdminReportsPage({ searchParams }: { searchParams: SearchParams }) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const canModerate = hasRole(admin, ["SUPER_ADMIN", "ADMIN", "MODERATOR"]);
  const canSeeSecurity = hasRole(admin, ["SUPER_ADMIN", "ADMIN"]);
  const db = getDb();
  const [reports, events] = await Promise.all([
    db.report.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 100,
      select: {
        id: true, reason: true, status: true, createdAt: true, reviewedAt: true,
        listing: { select: { id: true, title: true, status: true } },
        reviewedBy: { select: { displayName: true, email: true } },
      },
    }),
    canSeeSecurity
      ? db.securityEvent.findMany({ orderBy: { createdAt: "desc" }, take: 30, select: { id: true, eventType: true, severity: true, createdAt: true, actorId: true } })
      : Promise.resolve([]),
  ]);
  const open = reports.filter(r => r.status === "OPEN" || r.status === "REVIEWING").length;
  const message = params.report ? messages[params.report] : undefined;

  return (
    <AdminFrame admin={admin} active="/admin/reports" alerts={open}>
      <div className="ngd-page-head">
        <div><h1>Reports</h1><p>Problems reported by visitors, and admin security events.</p></div>
        <span className="ngd-chip">{open} open</span>
      </div>
      {message ? <p className="status-banner" data-kind={message.kind} role={message.kind === "error" ? "alert" : "status"}>{message.text}</p> : null}

      <Card title="Listing reports">
        <div className="ngd-table-wrap">
          <table className="ngd-table">
            <thead><tr><th>Received</th><th>Listing</th><th>Reason</th><th>Status</th><th>Reviewed</th>{canModerate ? <th>Action</th> : null}</tr></thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td>{ghanaDate(r.createdAt, true)}</td>
                  <td><Link href={`/admin/listings/${r.listing.id}`}>{r.listing.title}</Link><br /><StatusBadge status={r.listing.status} /></td>
                  <td>{r.reason}</td>
                  <td><span className={`ngd-badge is-${REPORT[r.status].tone}`}>{REPORT[r.status].label}</span></td>
                  <td>{r.reviewedAt ? `${ghanaDate(r.reviewedAt)} · ${r.reviewedBy?.displayName || r.reviewedBy?.email || ""}` : "—"}</td>
                  {canModerate ? (
                    <td>
                      <form className="ngd-review" action={updateReportStatus}>
                        <input type="hidden" name="reportId" value={r.id} />
                        {r.status === "OPEN" ? <button className="ngd-btn" name="status" value="REVIEWING">Start review</button> : null}
                        {r.status === "OPEN" || r.status === "REVIEWING" ? (
                          <>
                            <button className="ngd-btn is-primary" name="status" value="RESOLVED">Resolved</button>
                            <button className="ngd-btn" name="status" value="DISMISSED">Dismiss</button>
                          </>
                        ) : <span className="ngd-muted">Closed</span>}
                      </form>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
          {!reports.length ? <p className="ngd-empty">No reports yet.</p> : null}
        </div>
        <p className="ngd-note">To act on the listing itself (mark unavailable, remove), open it from here.</p>
      </Card>

      {canSeeSecurity ? (
        <div style={{ marginTop: 16 }}>
          <Card title="Admin security events (latest 30)">
            <div className="ngd-table-wrap">
              <table className="ngd-table">
                <thead><tr><th>When</th><th>Event</th><th>Severity</th></tr></thead>
                <tbody>
                  {events.map(e => (
                    <tr key={e.id}>
                      <td>{ghanaDate(e.createdAt, true)}</td>
                      <td>{EVENT_LABEL[e.eventType] ?? e.eventType}</td>
                      <td><span className={`ngd-badge is-${e.severity === "INFO" ? "neutral" : e.severity === "WARN" ? "warning" : "critical"}`}>{e.severity.toLowerCase()}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!events.length ? <p className="ngd-empty">No security events.</p> : null}
            </div>
          </Card>
        </div>
      ) : null}
    </AdminFrame>
  );
}
