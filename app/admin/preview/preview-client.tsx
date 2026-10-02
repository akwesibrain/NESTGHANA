"use client";

import { useMemo, useState } from "react";
import "./preview.css";

type Listing = {
  id: string;
  title: string;
  area: string;
  type: string;
  rent: number;
  status: "Pending review" | "Approved" | "Needs changes";
  date: string;
};

const initialListings: Listing[] = [
  { id: "NG-1048", title: "Bright chamber and hall", area: "East Legon, Accra", type: "Chamber and hall", rent: 1800, status: "Pending review", date: "Today, 10:42 AM" },
  { id: "NG-1047", title: "Furnished single room", area: "Adenta, Accra", type: "Single room", rent: 850, status: "Approved", date: "Today, 9:18 AM" },
  { id: "NG-1046", title: "Private hostel room", area: "Ayeduase, Kumasi", type: "Hostel", rent: 1200, status: "Needs changes", date: "Yesterday" },
  { id: "NG-1045", title: "Self-contained apartment", area: "Community 25, Tema", type: "Self-contained", rent: 2400, status: "Approved", date: "Yesterday" },
  { id: "NG-1044", title: "Quiet single room", area: "Cape Coast", type: "Single room", rent: 600, status: "Pending review", date: "Sep 29, 2026" },
];

const sections = ["Overview", "Listings", "Website settings"] as const;
type Section = (typeof sections)[number];
const money = (amount: number) => `GH₵ ${amount.toLocaleString("en-GH")}`;

export default function AdminPreview() {
  const [section, setSection] = useState<Section>("Overview");
  const [listings, setListings] = useState(initialListings);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [fee, setFee] = useState("25.00");
  const [savedFee, setSavedFee] = useState("25.00");
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<Listing | null>(null);

  const filteredListings = useMemo(() => listings.filter((listing) => {
    const matchesQuery = `${listing.id} ${listing.title} ${listing.area}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === "All statuses" || listing.status === status);
  }), [listings, query, status]);

  function changeStatus(id: string, nextStatus: Listing["status"]) {
    setListings((current) => current.map((listing) => listing.id === id ? { ...listing, status: nextStatus } : listing));
    setSelected(null);
    setNotice(`${id} marked ${nextStatus.toLowerCase()} (preview only).`);
  }

  return (
    <main className="preview-shell">
      <aside className="preview-sidebar">
        <a className="preview-brand" href="/admin/preview"><strong>NestGH.</strong><span>ADMIN WORKSPACE</span></a>
        <p className="preview-nav-label">WORKSPACE</p>
        <nav aria-label="Preview sections">
          {sections.map((item, index) => (
            <button key={item} className={section === item ? "preview-nav-item active" : "preview-nav-item"} onClick={() => { setSection(item); setNotice(""); }}>
              <span className="preview-nav-icon">{["⌂", "▤", "⚙"][index]}</span>{item}
            </button>
          ))}
        </nav>
        <div className="preview-sidebar-bottom"><span className="preview-avatar">BA</span><span><strong>Brain Amponsah</strong><small>Super admin · Preview</small></span></div>
      </aside>

      <section className="preview-main">
        <header className="preview-topbar">
          <div className="preview-mobile-brand"><strong>NestGH.</strong><span>ADMIN</span></div>
          <div className="preview-account"><span className="preview-live-dot" /> Demo workspace <span className="preview-avatar small">BA</span></div>
        </header>
        <nav className="preview-mobile-nav" aria-label="Preview sections">
          {sections.map((item) => <button key={item} className={section === item ? "active" : ""} onClick={() => { setSection(item); setNotice(""); }}>{item}</button>)}
        </nav>
        <div className="preview-content">
          <div className="preview-banner"><span><strong>Interactive preview</strong><small>Sample data only. Nothing here changes the live site.</small></span><span className="preview-banner-tag">DEMO MODE</span></div>
          {notice && <p className="preview-notice" role="status">{notice}</p>}

          {section === "Overview" && (
            <>
              <div className="preview-page-heading"><div><p className="preview-eyebrow">WORKSPACE OVERVIEW</p><h1>Good morning, Brain <span>👋</span></h1><p>Here’s what’s happening with your listings today.</p></div><button className="preview-primary" onClick={() => setSection("Listings")}>Review listings <span>→</span></button></div>
              <div className="preview-stats">
                <article><span className="preview-stat-icon gold">▤</span><small>Total listings</small><strong>128</strong><span className="preview-stat-note">↑ 12% <em>vs last month</em></span></article>
                <article><span className="preview-stat-icon blue">◷</span><small>Pending review</small><strong>8</strong><span className="preview-stat-note neutral">Needs your attention</span></article>
                <article><span className="preview-stat-icon green">✓</span><small>Published</small><strong>104</strong><span className="preview-stat-note">↑ 8% <em>vs last month</em></span></article>
                <article><span className="preview-stat-icon lilac">GH₵</span><small>Listing fee</small><strong>{money(Number(savedFee))}</strong><button className="preview-text-button" onClick={() => setSection("Website settings")}>Manage fee →</button></article>
              </div>
              <div className="preview-overview-grid">
                <section className="preview-panel">
                  <div className="preview-panel-heading"><div><h2>Recent listings</h2><p>The latest submissions from property owners</p></div><button className="preview-text-button" onClick={() => setSection("Listings")}>View all →</button></div>
                  <div className="preview-recent-list">{listings.slice(0, 4).map((listing) => <button className="preview-recent-row" key={listing.id} onClick={() => setSelected(listing)}><span className="preview-listing-icon">⌂</span><span className="preview-recent-copy"><strong>{listing.title}</strong><small>{listing.area} · {listing.id}</small></span><span className={`preview-status ${listing.status === "Approved" ? "approved" : listing.status === "Needs changes" ? "changes" : "pending"}`}>{listing.status}</span></button>)}</div>
                </section>
                <section className="preview-panel preview-activity"><div className="preview-panel-heading"><div><h2>Listing activity</h2><p>Submissions this week</p></div><span className="preview-week-label">THIS WEEK</span></div><div className="preview-chart"><div className="preview-y-labels"><span>20</span><span>10</span><span>0</span></div><div className="preview-bars">{[38, 64, 48, 82, 58, 94, 70].map((height, index) => <div key={index}><i className={`bar-${height}`} /><small>{["M", "T", "W", "T", "F", "S", "S"][index]}</small></div>)}</div></div><p className="preview-chart-summary"><strong>46 submissions</strong><span>Over the last 7 days</span></p></section>
              </div>
            </>
          )}

          {section === "Listings" && (
            <>
              <div className="preview-page-heading"><div><p className="preview-eyebrow">MANAGE YOUR MARKETPLACE</p><h1>Listings</h1><p>Review submissions and keep the marketplace up to date.</p></div><span className="preview-count">{listings.length} sample listings</span></div>
              <section className="preview-panel preview-listings-panel"><div className="preview-panel-heading"><div><h2>All listings</h2><p>Click a listing to review its details and status.</p></div></div><div className="preview-filters"><input aria-label="Search listings" placeholder="Search title, area or ID" value={query} onChange={(event) => setQuery(event.target.value)} /><select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Pending review</option><option>Approved</option><option>Needs changes</option></select></div>
                <div className="preview-table-wrap"><table className="preview-table"><thead><tr><th>LISTING</th><th>TYPE</th><th>MONTHLY RENT</th><th>STATUS</th><th>SUBMITTED</th></tr></thead><tbody>{filteredListings.map((listing) => <tr key={listing.id} onClick={() => setSelected(listing)}><td><strong>{listing.title}</strong><small>{listing.area} · {listing.id}</small></td><td>{listing.type}</td><td>{money(listing.rent)}</td><td><span className={`preview-status ${listing.status === "Approved" ? "approved" : listing.status === "Needs changes" ? "changes" : "pending"}`}>{listing.status}</span></td><td>{listing.date}</td></tr>)}</tbody></table></div>
                {!filteredListings.length && <p className="preview-empty">No sample listings match those filters.</p>}
                <div className="preview-mobile-list">{filteredListings.map((listing) => <button key={listing.id} className="preview-mobile-listing" onClick={() => setSelected(listing)}><span><strong>{listing.title}</strong><small>{listing.area} · {listing.id}</small></span><span className={`preview-status ${listing.status === "Approved" ? "approved" : listing.status === "Needs changes" ? "changes" : "pending"}`}>{listing.status}</span><span className="preview-mobile-rent">{money(listing.rent)} <small>/ month</small><span>{listing.type} · {listing.date}</span></span></button>)}</div>
              </section>
            </>
          )}

          {section === "Website settings" && (
            <>
              <div className="preview-page-heading"><div><p className="preview-eyebrow">CONFIGURE YOUR MARKETPLACE</p><h1>Website settings</h1><p>Manage the listing fee shown to property owners.</p></div></div>
              <section className="preview-panel preview-settings-panel"><span className="preview-stat-icon lilac">GH₵</span><p className="preview-eyebrow">PAYMENTS · LISTING FEE</p><h2>One-time listing fee</h2><p>Set the fee owners pay when submitting a new room. The saved amount is used for new checkouts.</p><div className="preview-current-fee"><span>Current fee</span><strong>{money(Number(savedFee))}</strong></div><form onSubmit={(event) => { event.preventDefault(); setSavedFee(Number(fee).toFixed(2)); setNotice("Listing fee updated in this preview only."); }}><label htmlFor="preview-fee">New fee (GH₵)</label><input id="preview-fee" type="number" min="0.01" step="0.01" required value={fee} onChange={(event) => setFee(event.target.value)} /><label htmlFor="preview-reason">Reason for change</label><input id="preview-reason" type="text" minLength={3} required placeholder="e.g. Annual pricing review" /><button className="preview-primary" type="submit">Save fee <span>→</span></button></form><p className="preview-settings-note">Demo only: this does not update the production fee or make a backend request.</p></section>
            </>
          )}
        </div>
      </section>

      {selected && <div className="preview-modal-backdrop" role="presentation" onClick={() => setSelected(null)}><section className="preview-modal" role="dialog" aria-modal="true" aria-labelledby="preview-modal-title" onClick={(event) => event.stopPropagation()}><button className="preview-modal-close" aria-label="Close details" onClick={() => setSelected(null)}>×</button><p className="preview-eyebrow">LISTING REVIEW · {selected.id}</p><h2 id="preview-modal-title">{selected.title}</h2><p>{selected.area} · {selected.type}</p><div className="preview-modal-rent">{money(selected.rent)} <small>/ month</small></div><p className="preview-modal-label">Current status</p><span className={`preview-status ${selected.status === "Approved" ? "approved" : selected.status === "Needs changes" ? "changes" : "pending"}`}>{selected.status}</span><div className="preview-modal-actions"><button className="preview-secondary" onClick={() => changeStatus(selected.id, "Needs changes")}>Request changes</button><button className="preview-primary" onClick={() => changeStatus(selected.id, "Approved")}>Approve listing</button></div><small className="preview-settings-note">Status changes are temporary and only affect this demo.</small></section></div>}
    </main>
  );
}
