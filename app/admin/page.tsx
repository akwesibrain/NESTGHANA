import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { signInAdmin, signOutAdmin, updateListingFee } from "@/app/admin/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminNavigation } from "@/app/admin/_components/admin-navigation";
import "./_styles/admin-theme.css";
import "./admin.css";

type SearchParams = Promise<{ error?: string; fee?: string; q?: string; status?: string }>;
const listingStatuses = ["DRAFT", "PAYMENT_PENDING", "PENDING_APPROVAL", "CHANGES_REQUESTED", "LIVE", "NEEDS_CONFIRMATION", "UNAVAILABLE", "REJECTED", "REMOVED"] as const;

const signInErrors: Record<string, string> = {
  invalid: "Enter a valid email and password.",
  credentials: "Sign-in failed. Check your details and try again.",
  unauthorized: "This account is not authorized for the admin workspace.",
  configuration: "Admin sign-in is not configured. Add the staging Supabase URL and publishable key to the server environment.",
  mfa_required: "A verified authenticator factor is required for every admin account.",
};

const feeMessages: Record<string, { kind: "success" | "error"; text: string }> = {
  saved: { kind: "success", text: "The listing fee was updated. New payments will use this amount." },
  invalid: { kind: "error", text: "Enter a positive fee with no more than two decimal places and a reason." },
  save_failed: { kind: "error", text: "The listing fee could not be saved. Please try again." },
};

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <SignIn error={signInErrors.configuration} />;
  }
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError) console.error("admin_session_lookup_failed", authError.name);
  if (!auth.user) return <SignIn error={signInErrors[params.error || ""]} />;

  const { data: roles, error: rolesError } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", auth.user.id);
  if (rolesError || !roles?.length) {
    console.error("admin_role_lookup_failed", rolesError?.code || "missing_role");
    await supabase.auth.signOut();
    return <SignIn error={signInErrors.unauthorized} />;
  }
  const { data: assurance, error: assuranceError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assuranceError) {
    console.error("admin_mfa_assurance_failed", assuranceError.name);
    return <SignIn error={signInErrors.mfa_required} />;
  }
  if (assurance.currentLevel !== "aal2") redirect("/admin/verify?returnTo=%2Fadmin");

  const canManageSettings = roles.some((item) => item.role === "SUPER_ADMIN" || item.role === "ADMIN");
  const { data: settings, error: settingsError } = canManageSettings
    ? await supabase.from("website_settings")
      .select("listing_fee_pesewas, currency")
      .eq("id", 1)
      .single()
    : { data: null, error: null };
  if (settingsError) console.error("admin_website_settings_query_failed", settingsError.code);

  const { data: listings, error: listingsError } = await supabase
    .from("listings")
    .select("id,status,title,room_type,rent_amount_pesewas,rent_period,area_id,created_at")
    .order("created_at", { ascending: false })
    .range(0, 19);
  if (listingsError) console.error("admin_listing_query_failed", listingsError.code);
  const recentListings = listings || [];
  const pendingCount = recentListings.filter((listing) => listing.status === "PENDING_APPROVAL").length;
  const liveCount = recentListings.filter((listing) => listing.status === "LIVE").length;
  const areaIds = [...new Set(recentListings.map((listing) => listing.area_id))];
  const { data: areas, error: areasError } = areaIds.length
    ? await supabase.from("locations").select("id,name,parent_id").in("id", areaIds)
    : { data: [], error: null };
  if (areasError) console.error("admin_listing_locations_query_failed", areasError.code);
  const townIds = [...new Set((areas || []).flatMap((location) => location.parent_id ? [location.parent_id] : []))];
  const { data: towns, error: townsError } = townIds.length
    ? await supabase.from("locations").select("id,name").in("id", townIds)
    : { data: [], error: null };
  if (townsError) console.error("admin_listing_towns_query_failed", townsError.code);
  const townById = new Map((towns || []).map((town) => [town.id, town.name]));
  const areaById = new Map((areas || []).map((location) => [location.id, {
    name: location.name,
    town: location.parent_id ? townById.get(location.parent_id) : undefined,
  }]));
  const listingIds = recentListings.map((listing) => listing.id);
  const { data: listingImages, error: listingImagesError } = listingIds.length
    ? await supabase.from("listing_images")
      .select("listing_id,storage_path,display_order")
      .in("listing_id", listingIds)
      .order("display_order", { ascending: true })
    : { data: [], error: null };
  if (listingImagesError) console.error("admin_listing_images_query_failed", listingImagesError.code);
  const firstImageByListing = new Map<string, string>();
  for (const image of listingImages || []) {
    if (!firstImageByListing.has(image.listing_id)) firstImageByListing.set(image.listing_id, image.storage_path);
  }
  const imagePaths = [...new Set(firstImageByListing.values())];
  const { data: signedImages, error: signedImagesError } = imagePaths.length
    ? await supabase.storage.from("listing-pending").createSignedUrls(imagePaths, 3600)
    : { data: [], error: null };
  if (signedImagesError) console.error("admin_listing_image_urls_failed", signedImagesError.name);
  const imageUrlByPath = new Map((signedImages || [])
    .filter((image) => image.signedUrl)
    .map((image) => [image.path, image.signedUrl]));
  const thumbnails = new Map([...firstImageByListing].flatMap(([listingId, path]) => {
    const url = imageUrlByPath.get(path);
    return url ? [[listingId, url] as const] : [];
  }));
  const searchQuery = params.q?.trim().slice(0, 100) || "";
  const statusFilter = listingStatuses.includes(params.status as (typeof listingStatuses)[number]) ? params.status : "";
  const visibleListings = recentListings.filter((listing) => {
    const matchesSearch = !searchQuery || `${listing.title} ${listing.room_type} ${listing.id}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && (!statusFilter || listing.status === statusFilter);
  });
  const formatMoney = (pesewas: number) => new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(pesewas / 100);

  return (
    <main className="admin-shell">
      <div className="admin-workspace">
        <header className="admin-topbar">
          <Link className="admin-brand" href="/">
            <Image alt="NestGH" height={40} src="/logo-80.webp" width={40} />
            <span><strong>NestGH</strong><small>Find Your Next Place</small></span>
          </Link>
          <AdminNavigation canManageSettings={canManageSettings} />
          <div className="admin-topbar-actions">
            <a className="admin-icon-button" href="#listings" aria-label="Search listings">
              <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
            </a>
            <a className="admin-icon-button" href="#listings" aria-label="Review listings">
              <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
            </a>
            <span className="admin-user-avatar" aria-label={auth.user.email || "Admin"}>{(auth.user.email || "A").slice(0, 1).toUpperCase()}</span>
            <span className="admin-user-name">{auth.user.email || "Admin"}</span>
            <form action={signOutAdmin}><button className="admin-secondary-button" type="submit">Sign out</button></form>
          </div>
        </header>
        <section className="admin-content" id="overview">
          <div className="admin-hero">
            <div className="admin-hero-copy">
              <p className="eyebrow">PROPERTY MANAGEMENT</p>
              <h1>Your rooms, all in one place.</h1>
              <p>Welcome back. Here’s the latest from your NestGH marketplace.</p>
              <div className="admin-hero-metrics">
                <div><span>Recent submissions</span><strong>{recentListings.length}</strong></div>
                <div><span>Awaiting review</span><strong>{pendingCount}</strong></div>
              </div>
            </div>
            <Image className="admin-hero-image" src="/hero.jpg" alt="Modern home with a secure gated entrance" width={900} height={500} priority />
          </div>

          <div className="admin-stats" aria-label="Listing summary">
            <article className="admin-stat-card"><span className="admin-stat-icon gold" aria-hidden="true">▤</span><small>Latest listings</small><strong>{recentListings.length}</strong><span>Most recent submissions</span></article>
            <article className="admin-stat-card"><span className="admin-stat-icon blue" aria-hidden="true">◷</span><small>Awaiting review</small><strong>{pendingCount}</strong><span>In the latest 20 listings</span></article>
            <article className="admin-stat-card"><span className="admin-stat-icon green" aria-hidden="true">✓</span><small>Live listings</small><strong>{liveCount}</strong><span>In the latest 20 listings</span></article>
            <article className="admin-stat-card"><span className="admin-stat-icon lilac" aria-hidden="true">GH₵</span><small>Listing fee</small><strong>{settings ? formatMoney(settings.listing_fee_pesewas) : "—"}</strong>{canManageSettings ? <a href="#website-settings">Manage fee →</a> : <span>Admin access only</span>}</article>
          </div>

          <section className="admin-property-section" aria-labelledby="properties-heading">
            <div className="admin-panel-heading"><div><p className="eyebrow">LATEST FROM THE MARKETPLACE</p><h2 id="properties-heading">Property listings</h2></div><a className="admin-text-link" href="#listings">View all listings <span aria-hidden="true">↗</span></a></div>
            {listingsError ? <p className="admin-status-banner" data-kind="error" role="alert">Could not load listings. Check your role permissions and database migration.</p> : null}
            <div className="admin-property-cards">
              {recentListings.slice(0, 3).map((listing) => (
                <article className="admin-property-card" key={listing.id}>
                  <div className="admin-property-photo">
                    {thumbnails.has(listing.id)
                      ? <Image src={thumbnails.get(listing.id)!} alt="" width={400} height={230} unoptimized />
                      : <span aria-label="No listing photo" role="img">⌂</span>}
                    <span className={`admin-status status-${listing.status.toLowerCase()}`}>{listing.status.replaceAll("_", " ")}</span>
                  </div>
                  <div className="admin-property-details"><h3>{listing.title}</h3><p>{areaById.get(listing.area_id)?.name || "Ghana"}{areaById.get(listing.area_id)?.town ? `, ${areaById.get(listing.area_id)?.town}` : ""}</p><div><span>{listing.room_type}</span><strong>{formatMoney(listing.rent_amount_pesewas)} <small>/ period</small></strong></div></div>
                </article>
              ))}
              {!listingsError && !recentListings.length ? <p className="admin-empty">No listings have been submitted yet.</p> : null}
            </div>
          </section>

          <div className="admin-dashboard-grid">
            <section className="admin-panel admin-listings-panel" id="listings" aria-labelledby="listings-heading">
              <div className="admin-panel-heading"><div><h2 id="listings-heading">Manage listings</h2><p>Search and filter the 20 most recent submissions.</p></div><span className="admin-result-count">{visibleListings.length} shown</span></div>
              <form className="admin-listing-filters" action="/admin#listings">
                <input type="search" name="q" aria-label="Search listings" placeholder="Search property or type" defaultValue={searchQuery} />
                <select name="status" aria-label="Filter by status" defaultValue={statusFilter}>
                  <option value="">All statuses</option>{listingStatuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
                </select>
                <button className="admin-filter-button" type="submit"><span aria-hidden="true">⌕</span> Search</button>
              </form>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>PROPERTY NAME</th><th>TYPE</th><th>MONTHLY RENT</th><th>STATUS</th><th>SUBMITTED</th></tr></thead>
                  <tbody>
                    {visibleListings.map((listing) => (
                      <tr key={listing.id}>
                        <td data-label="Property"><span className="admin-table-property">{thumbnails.has(listing.id) ? <Image src={thumbnails.get(listing.id)!} alt="" width={44} height={44} unoptimized /> : <span aria-hidden="true">⌂</span>}<span><strong>{listing.title}</strong><small>{areaById.get(listing.area_id)?.name || "Ghana"} · {listing.id.slice(0, 8)}</small></span></span></td>
                        <td data-label="Type">{listing.room_type}</td><td data-label="Rent">{formatMoney(listing.rent_amount_pesewas)}</td>
                        <td data-label="Status"><span className={`admin-status status-${listing.status.toLowerCase()}`}>{listing.status.replaceAll("_", " ")}</span></td>
                        <td data-label="Submitted">{new Date(listing.created_at).toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!listingsError && !visibleListings.length ? <p className="admin-empty">{recentListings.length ? "No listings match your search." : "No listings have been submitted yet."}</p> : null}
              </div>
            </section>
            {canManageSettings ? (
              <section className="admin-settings-card" id="website-settings" aria-labelledby="listing-fee-heading">
                <div className="admin-panel-heading"><div><p className="eyebrow">WEBSITE SETTINGS</p><h2 id="listing-fee-heading">Listing fee</h2></div><span className="admin-stat-icon lilac" aria-hidden="true">GH₵</span></div>
                <p>Set the one-time fee owners pay to submit a listing. New and retried checkouts use the saved amount.</p>
                {params.fee && feeMessages[params.fee] ? (
                  <p className="admin-status-banner" data-kind={feeMessages[params.fee].kind} role={feeMessages[params.fee].kind === "error" ? "alert" : "status"}>
                    {feeMessages[params.fee].text}
                  </p>
                ) : null}
                {settingsError || !settings ? (
                  <p className="admin-status-banner" data-kind="error" role="alert">Could not load the current listing fee. Check that the database migration has been applied.</p>
                ) : (
                  <>
                    <p className="admin-current-fee"><span>Current fee</span><strong>{new Intl.NumberFormat("en-GH", { style: "currency", currency: settings.currency }).format(settings.listing_fee_pesewas / 100)}</strong></p>
                    <form className="admin-fee-form" action={updateListingFee}>
                      <label htmlFor="feeGhs">New fee (GH₵)</label>
                      <input id="feeGhs" name="feeGhs" type="number" min="0.01" max="21474836.47" step="0.01" defaultValue={(settings.listing_fee_pesewas / 100).toFixed(2)} required />
                      <label htmlFor="fee-reason">Reason for change</label>
                      <input id="fee-reason" name="reason" type="text" minLength={3} maxLength={1000} required />
                      <button className="admin-primary-button" type="submit">Save listing fee <span aria-hidden="true">→</span></button>
                    </form>
                    <p className="admin-settings-note">Changes are audited and apply to new checkouts. Payments already started keep their original amount.</p>
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
    <main className="admin-auth-panel">
      <form className="admin-auth-card" action={signInAdmin}>
        <Link className="brand admin-auth-brand" href="/"><span className="brand-copy"><strong>NestGH.</strong><small>ADMIN WORKSPACE</small></span></Link>
        <p className="eyebrow">Secure sign in</p>
        <h1>Admin workspace</h1>
        <p>Sign in with an account that has been granted NestGH administrator access. MFA is required.</p>
        {error ? <p className="admin-auth-error" role="alert">{error}</p> : null}
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" autoComplete="username" maxLength={254} required />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" minLength={8} maxLength={256} required />
        <button className="admin-primary-button" type="submit">Sign in</button>
      </form>
    </main>
  );
}
