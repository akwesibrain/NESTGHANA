import Link from "next/link";
import { redirect } from "next/navigation";
import { signInAdmin, signOutAdmin, updateListingFee } from "@/app/admin/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import "./admin.css";

type SearchParams = Promise<{ error?: string; fee?: string }>;

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
    .select("id,status,title,room_type,rent_amount_pesewas,rent_period,created_at")
    .order("created_at", { ascending: false })
    .range(0, 19);
  if (listingsError) console.error("admin_listing_query_failed", listingsError.code);

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <Link className="brand" href="/"><span className="brand-copy"><strong>NestGH.</strong><small>ADMIN WORKSPACE</small></span></Link>
        <div><span>{auth.user.email}</span><form action={signOutAdmin}><button className="secondary-button" type="submit">Sign out</button></form></div>
      </header>
      <section className="admin-content">
        <p className="eyebrow">Overview</p>
        <h1>Listings dashboard</h1>
        <p>Authenticated staging workspace. Your role: {roles.map((item) => item.role).join(", ")}.</p>
        {canManageSettings ? (
          <section className="settings-card" aria-labelledby="listing-fee-heading">
            <p className="eyebrow">Website settings</p>
            <h2 id="listing-fee-heading">Listing fee</h2>
            <p>Set the one-time fee owners pay to submit a listing. The payment backend uses the saved amount for new and retried checkouts.</p>
            {params.fee && feeMessages[params.fee] ? (
              <p className="status-banner" data-kind={feeMessages[params.fee].kind} role={feeMessages[params.fee].kind === "error" ? "alert" : "status"}>
                {feeMessages[params.fee].text}
              </p>
            ) : null}
            {settingsError || !settings ? (
              <p className="status-banner" data-kind="error" role="alert">Could not load the current listing fee. Check that the database migration has been applied.</p>
            ) : (
              <>
                <p className="current-fee">Current fee: <strong>{new Intl.NumberFormat("en-GH", { style: "currency", currency: settings.currency }).format(settings.listing_fee_pesewas / 100)}</strong></p>
                <form className="fee-form" action={updateListingFee}>
                  <label htmlFor="feeGhs">New fee (GH₵)</label>
                  <input
                    id="feeGhs"
                    name="feeGhs"
                    type="number"
                    min="0.01"
                    max="21474836.47"
                    step="0.01"
                    defaultValue={(settings.listing_fee_pesewas / 100).toFixed(2)}
                    required
                  />
                  <label htmlFor="fee-reason">Reason for change</label>
                  <input id="fee-reason" name="reason" type="text" minLength={3} maxLength={1000} required />
                  <button className="primary-button" type="submit">Save listing fee</button>
                </form>
                <p className="settings-note">Changes are audited and take effect for new checkouts. Payments already initiated keep their original amount.</p>
              </>
            )}
          </section>
        ) : null}
        {listingsError ? <p className="status-banner" data-kind="error" role="alert">Could not load listings. Check your role permissions and database migration.</p> : null}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Listing</th><th>Type</th><th>Rent (pesewas)</th><th>Status</th><th>Submitted</th></tr></thead>
            <tbody>
              {(listings || []).map((listing) => (
                <tr key={listing.id}>
                  <td>{listing.title}</td><td>{listing.room_type}</td><td>{listing.rent_amount_pesewas}</td>
                  <td>{listing.status}</td><td>{new Date(listing.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!listingsError && !listings?.length ? <p>No listings have been submitted yet.</p> : null}
        </div>
      </section>
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
        <p>Sign in with an account that has been granted NestGH administrator access. MFA is required.</p>
        {error ? <p className="auth-error" role="alert">{error}</p> : null}
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" autoComplete="username" maxLength={254} required />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" minLength={8} maxLength={256} required />
        <button className="primary-button" type="submit">Sign in</button>
      </form>
    </main>
  );
}
