import Link from "next/link";
import { updateMessage } from "@/app/admin/actions";
import { AdminFrame, Card, ghanaDate, Icon } from "@/app/admin/admin-ui";
import { requireAdmin } from "@/lib/server/admin-session";
import { getDb } from "@/lib/server/db";
import { whatsappUrl } from "@/lib/server/notifications";

type SearchParams = Promise<{ msg?: string; show?: string }>;

const TEMPLATE_LABEL: Record<string, string> = {
  approved: "Listing approved",
  changes_requested: "Changes requested",
  rejected: "Listing rejected",
  needs_confirmation: "Please confirm availability",
  manage_link: "Manage link",
};
const FLASH: Record<string, { kind: "success" | "error"; text: string }> = {
  queued: { kind: "success", text: "Message queued. Send it below." },
  sent: { kind: "success", text: "Marked as sent." },
  dismissed: { kind: "success", text: "Message dismissed." },
  invalid: { kind: "error", text: "That message was already handled or does not exist." },
};

export default async function AdminMessagesPage({ searchParams }: { searchParams: SearchParams }) {
  const admin = await requireAdmin(["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT"]);
  const params = await searchParams;
  const showHistory = params.show === "history";
  const db = getDb();
  const [messages, pendingCount, openReports] = await Promise.all([
    db.notification.findMany({
      where: showHistory ? { status: { not: "PENDING" } } : { status: "PENDING" },
      orderBy: { createdAt: showHistory ? "desc" : "asc" },
      take: 100,
      include: { listing: { select: { id: true, title: true, owner: { select: { fullName: true } } } }, sentBy: { select: { displayName: true, email: true } } },
    }),
    db.notification.count({ where: { status: "PENDING" } }),
    db.report.count({ where: { status: { in: ["OPEN", "REVIEWING"] } } }),
  ]);
  const flash = params.msg ? FLASH[params.msg] : undefined;

  return (
    <AdminFrame admin={admin} active="/admin/messages" alerts={openReports}>
      <div className="ngd-page-head">
        <div>
          <h1>Messages</h1>
          <p>Messages to owners about their listings. Open WhatsApp to send each one, then mark it sent.</p>
        </div>
        <span className="ngd-chip">{pendingCount} to send</span>
      </div>
      {flash ? <p className="status-banner" data-kind={flash.kind} role={flash.kind === "error" ? "alert" : "status"}>{flash.text}</p> : null}

      <Card>
        <nav className="ngd-tabs-filter" aria-label="Message view">
          <Link className={!showHistory ? "is-active" : undefined} href="/admin/messages">To send ({pendingCount})</Link>
          <Link className={showHistory ? "is-active" : undefined} href="/admin/messages?show=history">Sent &amp; dismissed</Link>
        </nav>
        <ul className="ngd-messages">
          {messages.map(m => (
            <li key={m.id}>
              <div className="ngd-message-head">
                <span className="ngd-badge is-neutral">{TEMPLATE_LABEL[m.template] ?? m.template}</span>
                <strong>{m.listing ? <Link href={`/admin/listings/${m.listing.id}`}>{m.listing.title}</Link> : "Listing deleted"}</strong>
                <small className="ngd-muted">to {m.listing?.owner.fullName ?? "owner"} · {m.recipient} · {ghanaDate(m.createdAt, true)}</small>
              </div>
              <pre className="ngd-message-body">{m.message}</pre>
              {m.status === "PENDING" ? (
                <div className="ngd-message-actions">
                  <a className="ngd-btn is-primary" href={whatsappUrl(m.recipient, m.message)} target="_blank" rel="noopener noreferrer">
                    <Icon name="external" size={14} /> Open WhatsApp
                  </a>
                  <form action={updateMessage}>
                    <input type="hidden" name="id" value={m.id} />
                    <button className="ngd-btn" name="status" value="SENT">Mark sent</button>
                    <button className="ngd-btn" name="status" value="DISMISSED">Dismiss</button>
                  </form>
                </div>
              ) : (
                <small className="ngd-muted">
                  {m.status === "SENT" ? "Sent" : "Dismissed"} {m.sentAt ? ghanaDate(m.sentAt, true) : ""} by {m.sentBy?.displayName || m.sentBy?.email || "—"}
                </small>
              )}
            </li>
          ))}
          {!messages.length ? <li className="ngd-empty">{showHistory ? "No sent messages yet." : "Nothing to send. Messages appear here when you approve, reject or request changes, and when listings need confirming."}</li> : null}
        </ul>
        <p className="ngd-note">Messages with a private manage link are cleared from the database once sent or dismissed. When a WhatsApp or email provider is set up, these can be sent automatically.</p>
      </Card>
    </AdminFrame>
  );
}
