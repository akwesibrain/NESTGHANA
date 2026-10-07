import Link from "next/link";
import { headers } from "next/headers";
import { reviewListing, signInAdmin } from "@/app/admin/actions";
import { AdminFrame, Card, cedis, count, ghanaDate, Icon, StatusBadge, Thumb, timeAgo, Trend } from "@/app/admin/admin-ui";
import { hasRole } from "@/lib/server/admin-auth";
import { getDashboardData } from "@/lib/server/admin-dashboard";
import { getAdminContext, requireAdmin } from "@/lib/server/admin-session";
import { ROOM_TYPE_LABEL } from "@/lib/server/public-listings";
import { turnstileEnabled, turnstileSiteKey } from "@/lib/server/turnstile";
import "./admin.css";

type SearchParams = Promise<{ error?: string; review?: string }>;

const signInErrors: Record<string, string> = {
  invalid: "Enter a valid email and password.",
  credentials: "Sign-in failed. Check your details and try again.",
  locked: "Too many failed attempts. This account is locked for 15 minutes.",
  rate_limited: "Too many sign-in attempts from this network. Try again in 15 minutes.",
  bot_check: "Please complete the security check, then sign in.",
};
const reviewMessages: Record<string, { kind: "success" | "error"; text: string }> = {
  approve: { kind: "success", text: "Listing approved. It is now live on the website." },
  not_allowed: { kind: "error", text: "That action is not allowed for this listing in its current status." },
  failed: { kind: "error", text: "The review could not be saved. Please try again." },
};

// Approximate positions (lat, lng) of each region's capital, for the schematic map.
const REGION_POINTS: Record<string, [number, number]> = {
  "Greater Accra": [5.6, -0.19], Ashanti: [6.69, -1.62], Central: [5.11, -1.25], Western: [4.9, -1.76],
  "Western North": [6.2, -2.48], Eastern: [6.09, -0.26], Volta: [6.6, 0.47], Oti: [8.07, 0.18],
  Bono: [7.34, -2.33], "Bono East": [7.59, -1.94], Ahafo: [6.8, -2.52], Northern: [9.4, -0.84],
  Savannah: [9.08, -1.82], "North East": [10.53, -0.37], "Upper East": [10.79, -0.85], "Upper West": [10.06, -2.5],
};
// Simplified Ghana outline (lat, lng) — schematic, not survey-accurate.
const GHANA_OUTLINE: [number, number][] = [
  [11.0, -2.83], [11.1, -1.0], [11.0, 0.0], [10.6, 0.4], [9.9, 0.25], [9.1, 0.5], [8.3, 0.65], [7.4, 0.55],
  [6.9, 0.7], [6.1, 1.2], [5.75, 0.6], [5.5, -0.1], [5.2, -0.8], [4.95, -1.6], [4.75, -2.1], [5.0, -2.9],
  [5.1, -3.1], [6.1, -3.25], [7.0, -3.0], [7.9, -2.65], [8.6, -2.6], [9.5, -2.7], [10.3, -2.9],
];
const project = ([lat, lng]: [number, number]) => [((lng + 3.45) / 4.85) * 300, ((11.3 - lat) / 6.75) * 420] as const;

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const session = await getAdminContext();
  if (!session) {
    const nonce = (await headers()).get("x-nonce") ?? undefined;
    return <SignIn error={signInErrors[params.error || ""]} siteKey={turnstileEnabled() ? turnstileSiteKey() : null} nonce={nonce} />;
  }
  const admin = await requireAdmin();
  const canReview = hasRole(admin, ["SUPER_ADMIN", "ADMIN", "MODERATOR"]);
  const d = await getDashboardData();
  const message = params.review ? reviewMessages[params.review] : undefined;
  const regionTotal = d.regions.reduce((sum, r) => sum + r.count, 0);
  const townMax = Math.max(1, ...d.towns.map(t => t.count));
  const availTotal = d.availability.available + d.availability.needsAttention;
  const availPct = availTotal ? Math.round((d.availability.available / availTotal) * 100) : 0;
  const payTotal = d.payments.paid.count + d.payments.pending.count + d.payments.failed.count;
  const pct = (n: number) => (payTotal ? `${Math.round((n / payTotal) * 100)}% of attempts` : "no attempts yet");
  const maxRegion = Math.max(1, ...d.regions.map(r => r.count));

  return (
    <AdminFrame admin={admin} active="/admin" alerts={d.safety.reportsOpen}>
      <div className="ngd-page-head">
        <div>
          <h1>Overview</h1>
          <p>Here’s what’s happening on NestGH today.</p>
        </div>
        <span className="ngd-chip"><Icon name="calendar" size={15} /> {ghanaDate(new Date())} · trends compare the last 30 days</span>
      </div>
      {message ? <p className="status-banner" data-kind={message.kind} role={message.kind === "error" ? "alert" : "status"}>{message.text}</p> : null}

      <div className="ngd-row ngd-row-top">
        <div className="ngd-kpis">
          <Kpi icon="building" tone="blue" label="Total listings" value={count(d.kpis.totalListings)} trend={<Trend value={d.kpis.listingsTrend} />} />
          <Kpi icon="users" tone="violet" label="Property owners" value={count(d.kpis.owners)} trend={<Trend value={d.kpis.ownersTrend} />} />
          <Kpi icon="cedi" tone="orange" label="Listing fee revenue" value={cedis(d.kpis.revenuePesewas)} trend={<Trend value={d.kpis.revenueTrend} />} />
          <Kpi icon="check" tone="green" label="Live listings" value={count(d.kpis.live)} trend={<span className="ngd-muted">{d.kpis.totalListings ? Math.round((d.kpis.live / d.kpis.totalListings) * 100) : 0}% of all listings</span>} />
        </div>
        <Card title="Quick actions" className="ngd-quick">
          <div className="ngd-quick-grid">
            <Link href="/admin/listings?status=PENDING_APPROVAL"><Icon name="clock" /><span>Review pending{d.moderation.pending ? ` (${d.moderation.pending})` : ""}</span></Link>
            <Link href="/admin/payments"><Icon name="card" /><span>View payments</span></Link>
            <Link href="/admin/reports"><Icon name="flag" /><span>Reports{d.safety.reportsOpen ? ` (${d.safety.reportsOpen})` : ""}</span></Link>
            <Link href="/admin/settings"><Icon name="settings" /><span>Fees &amp; settings</span></Link>
          </div>
        </Card>
      </div>

      <div className="ngd-row ngd-row-4">
        <Card title="Listing moderation" link={{ href: "/admin/listings" }}>
          <div className="ngd-mini-stats">
            <MiniStat icon="clock" tone="warning" label="Pending" value={d.moderation.pending} />
            <MiniStat icon="check" tone="good" label="Live" value={d.moderation.live} />
            <MiniStat icon="x" tone="critical" label="Rejected" value={d.moderation.rejected} />
          </div>
          <ul className="ngd-queue">
            {d.moderation.queue.map(item => (
              <li key={item.id}>
                <Thumb imageId={item.images[0]?.id} />
                <div>
                  <Link href={`/admin/listings/${item.id}`}><strong>{item.title}</strong></Link>
                  <span>{cedis(item.rentAmountPesewas)} · {ROOM_TYPE_LABEL[item.roomType]} · {item.area.name}</span>
                  <small>{timeAgo(item.createdAt)}</small>
                </div>
                {canReview ? (
                  <div className="ngd-queue-actions">
                    <form action={reviewListing}>
                      <input type="hidden" name="listingId" value={item.id} />
                      <input type="hidden" name="from" value="dashboard" />
                      <button className="ngd-btn is-primary" type="submit" name="decision" value="approve">Approve</button>
                    </form>
                    <Link className="ngd-btn" href={`/admin/listings/${item.id}`}>Review</Link>
                  </div>
                ) : null}
              </li>
            ))}
            {!d.moderation.queue.length ? <li className="ngd-empty">Nothing waiting for review.</li> : null}
          </ul>
        </Card>

        <Card title="Owners & team">
          <div className="ngd-mini-stats">
            <MiniStat icon="users" tone="blue" label="Owners" value={d.owners.total} />
            <MiniStat icon="check" tone="good" label="With live listing" value={d.owners.withLive} />
            <MiniStat icon="shield" tone="violet" label="Active admins" value={d.owners.admins} />
          </div>
          <Meter label="Owners with a live listing" value={d.owners.withLive} total={d.owners.total} tone="good" />
          <Meter label="New owners in the last 30 days" value={d.owners.newThisMonth} total={d.owners.total} tone="warning" />
          <p className="ngd-note">Renters browse without accounts, so there are no renter user numbers.</p>
        </Card>

        <Card title="Payments & revenue" link={{ href: "/admin/payments" }}>
          <div className="ngd-hero-figure">
            <span>Total listing fees collected</span>
            <strong>{cedis(d.payments.paid.pesewas, 2)}</strong>
            <Trend value={d.kpis.revenueTrend} />
          </div>
          <div className="ngd-pay-split">
            <PayStat tone="good" icon="check" label="Successful" value={d.payments.paid} note={pct(d.payments.paid.count)} />
            <PayStat tone="warning" icon="clock" label="In progress" value={d.payments.pending} note={pct(d.payments.pending.count)} />
            <PayStat tone="critical" icon="x" label="Failed / cancelled" value={d.payments.failed} note={pct(d.payments.failed.count)} />
          </div>
          <p className="ngd-note">{count(d.payments.awaitingPayment)} submitted listing{d.payments.awaitingPayment === 1 ? "" : "s"} not paid yet.</p>
        </Card>

        <Card title="Reports & security" link={{ href: "/admin/reports" }}>
          <ul className="ngd-alerts">
            <AlertRow icon="alert" tone="critical" label="Open listing reports" value={d.safety.reportsOpen}
              note={`${d.safety.reportsNow} new in 7 days (${d.safety.reportsBefore} the week before)`} />
            <AlertRow icon="key" tone="warning" label="Failed admin sign-ins" value={d.safety.failedLogins} note="last 7 days" />
            <AlertRow icon="lock" tone="warning" label="Lockouts & blocked attempts" value={d.safety.lockouts} note="last 7 days" />
            <AlertRow icon="shield" tone="neutral" label="Wrong authenticator codes" value={d.safety.mfaFailures} note="last 7 days" />
          </ul>
        </Card>
      </div>

      <div className="ngd-row ngd-row-4">
        <Card title="Availability & freshness">
          <div className="ngd-mini-stats is-two">
            <MiniStat icon="check" tone="good" label="Available (live)" value={d.availability.available} />
            <MiniStat icon="clock" tone="warning" label="Needs confirmation / unavailable" value={d.availability.needsAttention} />
          </div>
          <Meter label="Public listings that are available" value={d.availability.available} total={availTotal} tone="good" />
          <div className="ngd-inline-figure">
            <Icon name="calendar" />
            <div><span>Average time since owners confirmed</span><strong>{d.availability.avgConfirmDays === null ? "—" : d.availability.avgConfirmDays === 0 ? "Today" : `${d.availability.avgConfirmDays} day${d.availability.avgConfirmDays === 1 ? "" : "s"}`}</strong></div>
          </div>
          <span className="sr-only">{availPct}% available</span>
        </Card>

        <Card title="Location & market">
          <div className="ngd-bars-two">
            <div>
              <h3><Icon name="pin" size={14} /> Top regions</h3>
              <BarList rows={d.regions.slice(0, 6)} total={regionTotal} max={maxRegion} showPct />
            </div>
            <div>
              <h3><Icon name="pin" size={14} /> Top towns</h3>
              <BarList rows={d.towns} total={regionTotal} max={townMax} />
            </div>
          </div>
        </Card>

        <Card title="Property categories" link={{ href: "/admin/listings" }}>
          <div className="ngd-categories">
            {d.categories.map(c => (
              <div key={c.label}>
                <Icon name={{ Rooms: "bed", Hostels: "hostel", Shops: "shop", Offices: "office", Warehouses: "warehouse" }[c.label] ?? "grid"} />
                <span>{c.label}</span>
                <strong>{count(c.count)}</strong>
              </div>
            ))}
          </div>
          <p className="ngd-note">Public listings (live, needs confirmation or unavailable).</p>
        </Card>

        <Card title="Recent activity">
          <ul className="ngd-activity">
            {d.activity.map(a => (
              <li key={a.id}>
                <span className="ngd-activity-dot" aria-hidden="true" />
                <div>
                  <Link href={`/admin/listings/${a.listing.id}`}>{a.listing.title}</Link>
                  <span>Now <StatusBadge status={a.newStatus} /> · by {a.actorType.toLowerCase()}</span>
                  <small>{timeAgo(a.createdAt)}</small>
                </div>
              </li>
            ))}
            {!d.activity.length ? <li className="ngd-empty">No activity yet.</li> : null}
          </ul>
        </Card>
      </div>

      <div className="ngd-row ngd-row-bottom">
        <Card title="Recent listings" link={{ href: "/admin/listings" }}>
          <div className="ngd-table-wrap">
            <table className="ngd-table">
              <thead><tr><th>Image</th><th>Title</th><th>Location</th><th>Type</th><th>Price</th><th>Status</th><th>Listed on</th><th><span className="sr-only">Open</span></th></tr></thead>
              <tbody>
                {d.recent.map(l => (
                  <tr key={l.id}>
                    <td><Thumb imageId={l.images[0]?.id} small /></td>
                    <td><Link href={`/admin/listings/${l.id}`}>{l.title}</Link></td>
                    <td>{[l.area.name, l.area.parent?.name].filter(Boolean).join(", ")}</td>
                    <td>{ROOM_TYPE_LABEL[l.roomType]}</td>
                    <td>{cedis(l.rentAmountPesewas)}<small className="ngd-muted"> /{l.rentPeriod === "MONTH" ? "month" : l.rentPeriod.toLowerCase().replace("_", " ")}</small></td>
                    <td><StatusBadge status={l.status} /></td>
                    <td>{ghanaDate(l.createdAt)}</td>
                    <td><Link className="ngd-icon-button is-small" href={`/admin/listings/${l.id}`} aria-label={`Open ${l.title}`}><Icon name="arrowRight" size={14} /></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!d.recent.length ? <p className="ngd-empty">No listings yet.</p> : null}
          </div>
        </Card>

        <Card title="Listings by region">
          <div className="ngd-map">
            <svg viewBox="0 0 300 420" role="img" aria-label="Schematic map of Ghana with public listing counts per region">
              <polygon className="ngd-map-land" points={GHANA_OUTLINE.map(p => project(p).join(",")).join(" ")} />
              {d.regions.map(r => {
                const point = REGION_POINTS[r.name];
                if (!point) return null;
                const [x, y] = project(point);
                const radius = 14 + Math.sqrt(r.count / maxRegion) * 14;
                return (
                  <g key={r.name} className="ngd-map-pin">
                    <title>{`${r.name}: ${r.count} listing${r.count === 1 ? "" : "s"}`}</title>
                    <circle cx={x} cy={y} r={radius} />
                    <text x={x} y={y + 5} textAnchor="middle">{r.count}</text>
                    <text className="ngd-map-label" x={x} y={y + radius + 13} textAnchor="middle">{r.name}</text>
                  </g>
                );
              })}
            </svg>
            <ol className="ngd-map-legend">
              {d.regions.map(r => <li key={r.name}><span>{r.name}</span><strong>{r.count}</strong></li>)}
              {!d.regions.length ? <li className="ngd-empty">No public listings yet.</li> : null}
            </ol>
          </div>
          <p className="ngd-note">Schematic map; circles sit at each region’s capital. Hover a circle for its count.</p>
        </Card>
      </div>
    </AdminFrame>
  );
}

function Kpi({ icon, tone, label, value, trend }: { icon: string; tone: string; label: string; value: string; trend: React.ReactNode }) {
  return (
    <article className="ngd-card ngd-kpi">
      <span className={`ngd-icon-tile is-${tone}`}><Icon name={icon} size={22} /></span>
      <div>
        <span className="ngd-kpi-label">{label}</span>
        <strong className="ngd-kpi-value">{value}</strong>
        {trend}
      </div>
    </article>
  );
}

function MiniStat({ icon, tone, label, value }: { icon: string; tone: string; label: string; value: number }) {
  return (
    <div className={`ngd-mini is-${tone}`}>
      <span className="ngd-mini-icon"><Icon name={icon} size={16} /></span>
      <span>{label}</span>
      <strong>{count(value)}</strong>
    </div>
  );
}

function Meter({ label, value, total, tone }: { label: string; value: number; total: number; tone: "good" | "warning" }) {
  const percent = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="ngd-meter" title={`${value} of ${total}`}>
      <div className="ngd-meter-head"><span>{label}</span><strong>{percent}%</strong></div>
      {/* SVG geometry, not inline styles: the CSP blocks style attributes. */}
      <svg className="ngd-meter-svg" width="100%" height="8" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label={label}>
        <rect width="100%" height="8" rx="4" className="ngd-meter-bg" />
        {percent > 0 ? <rect width={`${percent}%`} height="8" rx="4" className={`ngd-meter-fill is-${tone}`} /> : null}
      </svg>
      <small className="ngd-muted">{count(value)} of {count(total)}</small>
    </div>
  );
}

function PayStat({ tone, icon, label, value, note }: { tone: string; icon: string; label: string; value: { count: number; pesewas: number }; note: string }) {
  return (
    <div className={`ngd-pay is-${tone}`}>
      <span className="ngd-mini-icon"><Icon name={icon} size={16} /></span>
      <span>{label}</span>
      <strong>{cedis(value.pesewas)}</strong>
      <small>{count(value.count)} · {note}</small>
    </div>
  );
}

function AlertRow({ icon, tone, label, value, note }: { icon: string; tone: string; label: string; value: number; note: string }) {
  return (
    <li className={`is-${tone}`}>
      <span className="ngd-mini-icon"><Icon name={icon} size={17} /></span>
      <div><span>{label}</span><small>{note}</small></div>
      <strong>{count(value)}</strong>
    </li>
  );
}

function BarList({ rows, total, max, showPct = false }: { rows: { name: string; count: number }[]; total: number; max: number; showPct?: boolean }) {
  if (!rows.length) return <p className="ngd-empty">No public listings yet.</p>;
  return (
    <ul className="ngd-bars">
      {rows.map(row => (
        <li key={row.name} title={`${row.name}: ${row.count} listing${row.count === 1 ? "" : "s"}`}>
          <div><span>{row.name}</span><strong>{showPct && total ? `${Math.round((row.count / total) * 100)}%` : row.count}</strong></div>
          <svg className="ngd-bar-svg" width="100%" height="6" aria-hidden="true">
            <rect width="100%" height="6" rx="3" className="ngd-meter-bg" />
            <rect width={`${Math.max(4, (row.count / max) * 100)}%`} height="6" rx="3" className="ngd-bar-fill" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

function SignIn({ error, siteKey, nonce }: { error?: string; siteKey: string | null; nonce?: string }) {
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
        {siteKey ? (
          <>
            {/* Cloudflare Turnstile adds a hidden cf-turnstile-response field to this form. */}
            <div className="cf-turnstile" data-sitekey={siteKey} />
            <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer nonce={nonce} />
          </>
        ) : null}
        <button className="primary-button" type="submit">Sign in</button>
      </form>
    </main>
  );
}
