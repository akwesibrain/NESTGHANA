import Link from "next/link";
import Image from "next/image";
import type { ListingStatus } from "@/generated/prisma/client";
import { reviewListing, signInAdmin, signOutAdmin, updateListingFee } from "@/app/admin/actions";
import { hasRole } from "@/lib/server/admin-auth";
import { getAdminContext, requireAdmin } from "@/lib/server/admin-session";
import { getDb } from "@/lib/server/db";
import { ROOM_TYPE_LABEL } from "@/lib/server/public-listings";
import "./admin.css";

type SearchParams = Promise<{ error?: string; fee?: string; review?: string; q?: string; status?: string }>;
const listingStatuses = ["DRAFT", "PAYMENT_PENDING", "PENDING_APPROVAL", "CHANGES_REQUESTED", "LIVE", "NEEDS_CONFIRMATION", "UNAVAILABLE", "REJECTED", "REMOVED"] as const;

const signInErrors: Record<string, string> = {
  invalid: "Enter a valid email and password.",
  credentials: "Sign-in failed. Check your details and try again.",
  locked: "Too many failed attempts. This account is locked for 15 minutes.",
  rate_limited: "Too many sign-in attempts from this network. Try again in 15 minutes.",
};

const feeMessages: Record<string, { kind: "success" | "error"; text: string }> = {
  saved: { kind: "success", text: "The listing fee was updated. New payments will use this amount." },
  invalid: { kind: "error", text: "Enter a positive fee with no more than two decimal places and a reason." },
  save_failed: { kind: "error", text: "The listing fee could not be saved. Please try again." },
};

const reviewMessages: Record<string, { kind: "success" | "error"; text: string }> = {
  approve: { kind: "success", text: "Listing approved. It is now live on the website." },
  changes: { kind: "success", text: "Changes requested. The owner can update and resubmit the listing." },
  reject: { kind: "success", text: "Listing rejected." },
  reason_required: { kind: "error", text: "Give a reason (at least 3 characters) when requesting changes or rejecting." },
  not_allowed: { kind: "error", text: "That action is not allowed for this listing in its current status." },
  invalid: { kind: "error", text: "The review request was not valid." },
  failed: { kind: "error", text: "The review could not be saved. Please try again." },
};

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const session = await getAdminContext();
  if (!session) return <SignIn error={signInErrors[params.error || ""]} />;
  const admin = await requireAdmin();

  const db = getDb();
  const canManageSettings = hasRole(admin, ["SUPER_ADMIN", "ADMIN"]);
  const canReview = hasRole(admin, ["SUPER_ADMIN", "ADMIN", "MODERATOR"]);
  const searchQuery = params.q?.trim().slice(0, 100) || "";
  const statusFilter = listingStatuses.find(status => status === params.status) ?? "";

  const [settings, statusCounts, listings] = await Promise.all([
    db.websiteSettings.findUnique({ where: { id: 1 }, select: { listingFeePesewas: true, currency: true } }),
    db.listing.groupBy({ by: ["status"], _count: { _all: true } }),
    db.listing.findMany({
      where: {
        ...(statusFilter ? { status: statusFilter as ListingStatus } : {}),
        ...(searchQuery
          ? { OR: [{ title: { contains: searchQuery } }, { id: { startsWith: searchQuery } }, { area: { name: { contains: searchQuery } } }] }
          : {}),
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      take: 50,
      select: {
        id: true,
        status: true,
        title: true,
        roomType: true,
        propertyCategory: true,
        rentAmountPesewas: true,
        createdAt: true,
        area: { select: { name: true, parent: { select: { name: true } } } },
      },
    }),
  ]);
  const countOf = (status: ListingStatus) => statusCounts.find(row => row.status === status)?._count._all ?? 0;
  const totalCount = statusCounts.reduce((sum, row) => sum + row._count._all, 0);
  const pendingCount = countOf("PENDING_APPROVAL");
  const liveCount = countOf("LIVE");
  const formatMoney = (pesewas: number) => new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(pesewas / 100);
  const place = (listing: (typeof listings)[number]) => [listing.area.name, listing.area.parent?.name].filter(Boolean).join(", ");
  const displayName = admin.user.displayName || admin.user.email;
  const reviewMessage = params.review ? reviewMessages[params.review] : undefined;

  return (
    <main className="admin-shell">
      <div className="admin-workspace">
        <header className="admin-topbar">
          <Link className="admin-brand" href="/"><span className="admin-brand-mark">N</span><span><strong>NestGH.</strong><small>ADMIN WORKSPACE</small></span></Link>
          <nav className="admin-desktop-nav" aria-label="Admin workspace">
            <a className="active" href="#overview">Dashboard</a><a href="#listings">Listings</a>{canManageSettings ? <a href="#website-settings">Settings</a> : null}
          </nav>
          <div className="admin-topbar-actions">
            <a className="admin-icon-button" href="#listings" aria-label="Search listings">⌕</a>
            <a className="admin-icon-button" href="/admin?status=PENDING_APPROVAL#listings" aria-label="Review pending listings">♧</a>
            <span className="admin-user-avatar" title={`${displayName} · ${admin.roles.join(", ")}`} aria-label={displayName}>{displayName.slice(0, 1).toUpperCase()}</span>
            <form action={signOutAdmin}><button className="secondary-button" type="submit">Sign out</button></form>
          </div>
        </header>
        <nav className="admin-mobile-nav" aria-label="Admin workspace">
          <a className="active" href="#overview">Dashboard</a><a href="#listings">Listings</a>{canManageSettings ? <a href="#website-settings">Settings</a> : null}
        </nav>
        <section className="admin-content" id="overview">
          {params.error === "forbidden" ? <p className="status-banner" data-kind="error" role="alert">Your role does not allow that action.</p> : null}
          <div className="admin-hero">
            <div className="admin-hero-copy">
              <p className="eyebrow">PROPERTY MANAGEMENT</p>
              <h1>Your rooms, all in one place.</h1>
              <p>Welcome back{admin.user.displayName ? `, ${admin.user.displayName}` : ""}. Here’s the latest from your NestGH marketplace.</p>
              <div className="admin-hero-metrics">
                <div><span>All listings</span><strong>{totalCount}</strong></div>
                <div><span>Awaiting review</span><strong>{pendingCount}</strong></div>
              </div>
            </div>
            <Image className="admin-hero-image" src="/hero.jpg" alt="Modern home with a secure gated entrance" width={900} height={500} priority />
          </div>

          <div className="admin-stats" aria-label="Listing summary">
            <article className="admin-stat-card"><span className="admin-stat-icon gold" aria-hidden="true">▤</span><small>All listings</small><strong>{totalCount}</strong><span>Every submission, any status</span></article>
            <article className="admin-stat-card"><span className="admin-stat-icon blue" aria-hidden="true">◷</span><small>Awaiting review</small><strong>{pendingCount}</strong><a href="/admin?status=PENDING_APPROVAL#listings">Review now →</a></article>
            <article className="admin-stat-card"><span className="admin-stat-icon green" aria-hidden="true">✓</span><small>Live listings</small><strong>{liveCount}</strong><span>Visible on the website</span></article>
            <article className="admin-stat-card"><span className="admin-stat-icon lilac" aria-hidden="true">GH₵</span><small>Listing fee</small><strong>{settings ? formatMoney(settings.listingFeePesewas) : "—"}</strong>{canManageSettings ? <a href="#website-settings">Manage fee →</a> : <span>Admin access only</span>}</article>
          </div>

          <section className="admin-property-section" aria-labelledby="properties-heading">
            <div className="admin-panel-heading"><div><p className="eyebrow">LATEST FROM THE MARKETPLACE</p><h2 id="properties-heading">Property listings</h2></div><a className="admin-text-link" href="#listings">View all listings <span aria-hidden="true">↗</span></a></div>
            <div className="admin-property-cards">
              {listings.slice(0, 3).map(listing => (
                <article className="admin-property-card" key={listing.id}>
                  <div className="admin-property-photo">
                    {/* Photos are added with image storage (workflow step 4). */}
                    <span aria-label="No listing photo" role="img">⌂</span>
                    <span className={`admin-status status-${listing.status.toLowerCase()}`}>{listing.status.replaceAll("_", " ")}</span>
                  </div>
                  <div className="admin-property-details"><h3>{listing.title}</h3><p>{place(listing) || "Ghana"}</p><div><span>{ROOM_TYPE_LABEL[listing.roomType]}</span><strong>{formatMoney(listing.rentAmountPesewas)} <small>/ period</small></strong></div></div>
                </article>
              ))}
              {!totalCount ? <p className="admin-empty">No listings have been submitted yet.</p> : null}
            </div>
          </section>

          <div className="admin-dashboard-grid">
            <section className="admin-panel admin-listings-panel" id="listings" aria-labelledby="listings-heading">
              <div className="admin-panel-heading"><div><h2 id="listings-heading">Manage listings</h2><p>Search by title, area or listing ID. Shows the 50 most recent matches.</p></div><span className="admin-result-count">{listings.length} shown</span></div>
              {reviewMessage ? <p className="status-banner" data-kind={reviewMessage.kind} role={reviewMessage.kind === "error" ? "alert" : "status"}>{reviewMessage.text}</p> : null}
              <form className="admin-listing-filters" action="/admin#listings">
                <input type="search" name="q" aria-label="Search listings" placeholder="Search property, area or ID" defaultValue={searchQuery} />
                <select name="status" aria-label="Filter by status" defaultValue={statusFilter}>
                  <option value="">All statuses</option>{listingStatuses.map(status => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
                </select>
                <button className="admin-filter-button" type="submit"><span aria-hidden="true">⌕</span> Search</button>
              </form>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>PROPERTY NAME</th><th>TYPE</th><th>RENT</th><th>STATUS</th><th>SUBMITTED</th>{canReview ? <th>REVIEW</th> : null}</tr></thead>
                  <tbody>
                    {listings.map(listing => (
                      <tr key={listing.id}>
                        <td data-label="Property"><span className="admin-table-property"><span aria-hidden="true">⌂</span><span><strong>{listing.title}</strong><small>{place(listing) || "Ghana"} · {listing.id.slice(0, 8)}</small></span></span></td>
                        <td data-label="Type">{ROOM_TYPE_LABEL[listing.roomType]}{listing.propertyCategory === "COMMERCIAL" ? " (commercial)" : ""}</td>
                        <td data-label="Rent">{formatMoney(listing.rentAmountPesewas)}</td>
                        <td data-label="Status"><span className={`admin-status status-${listing.status.toLowerCase()}`}>{listing.status.replaceAll("_", " ")}</span></td>
                        <td data-label="Submitted">{listing.createdAt.toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" })}</td>
                        {canReview ? (
                          <td data-label="Review">
                            {listing.status === "PENDING_APPROVAL" ? (
                              <form className="admin-review-form" action={reviewListing}>
                                <input type="hidden" name="listingId" value={listing.id} />
                                <input type="text" name="reason" aria-label={`Reason for ${listing.title}`} placeholder="Reason (for changes / reject)" maxLength={1000} />
                                <button className="primary-button" type="submit" name="decision" value="approve">Approve</button>
                                <button className="secondary-button" type="submit" name="decision" value="changes">Request changes</button>
                                <button className="secondary-button" type="submit" name="decision" value="reject">Reject</button>
                              </form>
                            ) : <span aria-hidden="true">—</span>}
                          </td>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!listings.length ? <p className="admin-empty">{totalCount ? "No listings match your search." : "No listings have been submitted yet."}</p> : null}
              </div>
            </section>
            {canManageSettings ? (
              <section className="settings-card" id="website-settings" aria-labelledby="listing-fee-heading">
                <div className="admin-panel-heading"><div><p className="eyebrow">WEBSITE SETTINGS</p><h2 id="listing-fee-heading">Listing fee</h2></div><span className="admin-stat-icon lilac" aria-hidden="true">GH₵</span></div>
                <p>Set the one-time fee owners pay to submit a listing. New and retried checkouts use the saved amount.</p>
                {params.fee && feeMessages[params.fee] ? (
                  <p className="status-banner" data-kind={feeMessages[params.fee].kind} role={feeMessages[params.fee].kind === "error" ? "alert" : "status"}>
                    {feeMessages[params.fee].text}
                  </p>
                ) : null}
                {!settings ? (
                  <p className="status-banner" data-kind="error" role="alert">Could not load the current listing fee. Check that the database migrations have been applied.</p>
                ) : (
                  <>
                    <p className="current-fee"><span>Current fee</span><strong>{new Intl.NumberFormat("en-GH", { style: "currency", currency: settings.currency }).format(settings.listingFeePesewas / 100)}</strong></p>
                    <form className="fee-form" action={updateListingFee}>
                      <label htmlFor="feeGhs">New fee (GH₵)</label>
                      <input id="feeGhs" name="feeGhs" type="number" min="0.01" max="21474836.47" step="0.01" defaultValue={(settings.listingFeePesewas / 100).toFixed(2)} required />
                      <label htmlFor="fee-reason">Reason for change</label>
                      <input id="fee-reason" name="reason" type="text" minLength={3} maxLength={1000} required />
                      <button className="primary-button" type="submit">Save listing fee <span aria-hidden="true">→</span></button>
                    </form>
                    <p className="settings-note">Changes are audited and apply to new checkouts. Payments already started keep their original amount.</p>
                  </>
                )}
              </section>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function SignIn({ error }: { error?: string }) {
  return (
    <main className="auth-panel">
      <form className="auth-card" action={signInAdmin}>
        <Link className="brand auth-brand" href="/"><span className="brand-copy"><strong>NestGH.</strong><small>ADMIN WORKSPACE</small></span></Link>
        <p className="eyebrow">Secure sign in</p>
        <h1>Admin workspace</h1>
        <p>Sign in with an account that has been granted NestGH administrator access. An authenticator app is required.</p>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" autoComplete="username" maxLength={254} required />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" maxLength={256} required />
        <button className="primary-button" type="submit">Sign in</button>
      </form>
    </main>
  );
}
