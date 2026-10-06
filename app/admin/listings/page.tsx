import Link from "next/link";
import type { ListingStatus, Prisma } from "@/generated/prisma/client";
import { reviewListing } from "@/app/admin/actions";
import { AdminFrame, Card, cedis, count, ghanaDate, StatusBadge, Thumb } from "@/app/admin/admin-ui";
import { hasRole } from "@/lib/server/admin-auth";
import { requireAdmin } from "@/lib/server/admin-session";
import { getDb } from "@/lib/server/db";
import { ROOM_TYPE_LABEL } from "@/lib/server/public-listings";

type SearchParams = Promise<{ q?: string; status?: string; category?: string; page?: string; review?: string }>;

const STATUSES: { value: ListingStatus | ""; label: string }[] = [
  { value: "", label: "All" },
  { value: "PENDING_APPROVAL", label: "Pending review" },
  { value: "LIVE", label: "Live" },
  { value: "PAYMENT_PENDING", label: "Awaiting payment" },
  { value: "CHANGES_REQUESTED", label: "Changes requested" },
  { value: "NEEDS_CONFIRMATION", label: "Needs confirmation" },
  { value: "UNAVAILABLE", label: "Unavailable" },
  { value: "REJECTED", label: "Rejected" },
  { value: "REMOVED", label: "Removed" },
];
const PAGE_SIZE = 25;
const reviewMessages: Record<string, { kind: "success" | "error"; text: string }> = {
  approve: { kind: "success", text: "Listing approved. It is now live on the website." },
  changes: { kind: "success", text: "Changes requested from the owner." },
  reject: { kind: "success", text: "Listing rejected." },
  reason_required: { kind: "error", text: "Give a reason (at least 3 characters) when requesting changes or rejecting." },
  not_allowed: { kind: "error", text: "That action is not allowed for this listing in its current status." },
  invalid: { kind: "error", text: "The review request was not valid." },
  failed: { kind: "error", text: "The review could not be saved. Please try again." },
};

export default async function AdminListingsPage({ searchParams }: { searchParams: SearchParams }) {
  const admin = await requireAdmin();
  const params = await searchParams;
  const canReview = hasRole(admin, ["SUPER_ADMIN", "ADMIN", "MODERATOR"]);
  const q = params.q?.trim().slice(0, 100) || "";
  const status = STATUSES.find(s => s.value && s.value === params.status)?.value || "";
  const category = params.category === "ROOM" || params.category === "COMMERCIAL" ? params.category : "";
  const page = Math.max(1, Math.min(1000, Number(params.page) || 1));

  const where: Prisma.ListingWhereInput = {
    ...(status ? { status } : {}),
    ...(category ? { propertyCategory: category } : {}),
    ...(q ? { OR: [{ title: { contains: q } }, { id: { startsWith: q } }, { area: { name: { contains: q } } }, { area: { parent: { name: { contains: q } } } }] } : {}),
  };
  const db = getDb();
  const [rows, total, statusCounts, openReports] = await Promise.all([
    db.listing.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true, title: true, status: true, roomType: true, propertyCategory: true, rentAmountPesewas: true, createdAt: true,
        area: { select: { name: true, parent: { select: { name: true } } } },
        owner: { select: { fullName: true } },
        images: { where: { category: { not: "PROFILE" } }, orderBy: { displayOrder: "asc" }, take: 1, select: { id: true } },
      },
    }),
    db.listing.count({ where }),
    db.listing.groupBy({ by: ["status"], _count: { _all: true } }),
    db.report.count({ where: { status: { in: ["OPEN", "REVIEWING"] } } }),
  ]);
  const statusCount = (value: string) =>
    value ? statusCounts.find(s => s.status === value)?._count._all ?? 0 : statusCounts.reduce((sum, s) => sum + s._count._all, 0);
  const link = (changes: Record<string, string>) => {
    const next = new URLSearchParams({ ...(q ? { q } : {}), ...(status ? { status } : {}), ...(category ? { category } : {}), ...changes });
    for (const [key, value] of [...next.entries()]) if (!value) next.delete(key);
    const query = next.toString();
    return `/admin/listings${query ? `?${query}` : ""}`;
  };
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const message = params.review ? reviewMessages[params.review] : undefined;

  return (
    <AdminFrame admin={admin} active="/admin/listings" alerts={openReports}>
      <div className="ngd-page-head">
        <div><h1>Listings</h1><p>Every submission, with search, filters and review actions.</p></div>
        <span className="ngd-chip">{count(total)} matching</span>
      </div>
      {message ? <p className="status-banner" data-kind={message.kind} role={message.kind === "error" ? "alert" : "status"}>{message.text}</p> : null}

      <Card>
        <nav className="ngd-tabs-filter" aria-label="Filter by status">
          {STATUSES.map(s => (
            <Link key={s.value || "all"} className={s.value === status ? "is-active" : undefined} href={link({ status: s.value, page: "" })}>
              {s.label} ({count(statusCount(s.value))})
            </Link>
          ))}
        </nav>
        <form className="ngd-filters" action="/admin/listings">
          <input type="search" name="q" aria-label="Search listings" placeholder="Search title, area, town or listing ID" defaultValue={q} />
          <select name="category" aria-label="Category" defaultValue={category}>
            <option value="">Rooms and spaces</option>
            <option value="ROOM">Rooms &amp; hostels</option>
            <option value="COMMERCIAL">Shops &amp; spaces</option>
          </select>
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <button className="ngd-btn is-primary" type="submit">Search</button>
          {q || category ? <Link className="ngd-btn" href={link({ q: "", category: "", page: "" })}>Clear</Link> : null}
        </form>

        <div className="ngd-table-wrap">
          <table className="ngd-table">
            <thead><tr><th>Image</th><th>Title</th><th>Location</th><th>Type</th><th>Rent</th><th>Owner</th><th>Status</th><th>Submitted</th>{canReview ? <th>Review</th> : null}</tr></thead>
            <tbody>
              {rows.map(l => (
                <tr key={l.id}>
                  <td><Thumb imageId={l.images[0]?.id} small /></td>
                  <td><Link href={`/admin/listings/${l.id}`}>{l.title}</Link><br /><small className="ngd-muted">{l.id.slice(0, 8)}</small></td>
                  <td>{[l.area.name, l.area.parent?.name].filter(Boolean).join(", ")}</td>
                  <td>{ROOM_TYPE_LABEL[l.roomType]}{l.propertyCategory === "COMMERCIAL" ? <small className="ngd-muted"> · space</small> : null}</td>
                  <td>{cedis(l.rentAmountPesewas)}</td>
                  <td>{l.owner.fullName}</td>
                  <td><StatusBadge status={l.status} /></td>
                  <td>{ghanaDate(l.createdAt)}</td>
                  {canReview ? (
                    <td>
                      {l.status === "PENDING_APPROVAL" ? (
                        <form className="ngd-review" action={reviewListing}>
                          <input type="hidden" name="listingId" value={l.id} />
                          <input type="hidden" name="from" value="listings" />
                          <input type="text" name="reason" aria-label={`Reason for ${l.title}`} placeholder="Reason (for changes / reject)" maxLength={1000} />
                          <button className="ngd-btn is-primary" type="submit" name="decision" value="approve">Approve</button>
                          <button className="ngd-btn" type="submit" name="decision" value="changes">Request changes</button>
                          <button className="ngd-btn is-danger" type="submit" name="decision" value="reject">Reject</button>
                        </form>
                      ) : <Link className="ngd-btn" href={`/admin/listings/${l.id}`}>Open</Link>}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length ? <p className="ngd-empty">No listings match these filters.</p> : null}
        </div>

        {pages > 1 ? (
          <nav className="ngd-tabs-filter" aria-label="Pages">
            {page > 1 ? <Link href={link({ page: String(page - 1) })}>← Previous</Link> : null}
            <span className="ngd-muted">Page {page} of {pages}</span>
            {page < pages ? <Link href={link({ page: String(page + 1) })}>Next →</Link> : null}
          </nav>
        ) : null}
      </Card>
    </AdminFrame>
  );
}
