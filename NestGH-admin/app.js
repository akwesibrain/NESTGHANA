const icons = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  building: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 21v-4h6v4M8 7h1m6 0h1M8 11h1m6 0h1"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/>',
  listings: '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M8 5V3h8v2m-9 5h10m-10 4h10"/>',
  wallet: '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18m-5 5h1"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18m-13 4h4"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.4 1.6c-1.1 1.2-2 1.4-2 3.1M12 17h.01"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
};

const statusLabels = {
  payment_pending: "Payment pending",
  pending_approval: "Pending approval",
  changes_requested: "Changes requested",
  live: "Live",
  unavailable: "Unavailable",
  needs_confirmation: "Needs confirmation",
  rejected: "Rejected",
  removed: "Removed",
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
  open: "Open",
  reviewing: "Reviewing",
  resolved: "Resolved",
  dismissed: "Dismissed",
};
const statusFilters = {
  "#pending-approval": "pending_approval",
  "#changes-requested": "changes_requested",
  "#live-listings": "live",
  "#needs-confirmation": "needs_confirmation",
  "#unavailable": "unavailable",
  "#rejected": "rejected",
  "#removed": "removed",
};
const paymentFilters = {
  "#successful-payments": "paid",
  "#pending-payments": "pending",
  "#failed-payments": "failed",
  "#refunded-payments": "refunded",
};
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);
const money = (amount) => `GH₵ ${Number(amount || 0).toLocaleString("en-GH")}`;
const shortType = (value) => String(value || "Room").replace(/Self-Contained/i, "Self-contained");
const client = window.supabase?.createClient && window.NESTGH_SUPABASE_CONFIG
  ? window.supabase.createClient(window.NESTGH_SUPABASE_CONFIG.url, window.NESTGH_SUPABASE_CONFIG.publishableKey)
  : null;
const pageNames = new Map([...document.querySelectorAll("[data-page]")].map((link) => [link.getAttribute("href"), link.dataset.page]));
const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.help}</svg>`;
document.querySelectorAll("[data-icon]").forEach((element) => { element.innerHTML = icon(element.dataset.icon); });

const authPanel = document.getElementById("auth-panel");
const authForm = document.getElementById("auth-form");
const authError = document.getElementById("auth-error");
const appShell = document.getElementById("app-shell");
const sidebar = document.getElementById("sidebar");
const scrim = document.getElementById("scrim");
const menuButton = document.getElementById("menu-button");
const profileButton = document.getElementById("profile-button");
const profileMenu = document.getElementById("profile-menu");
const toast = document.getElementById("toast");
const state = { user: null, admin: null, listings: [], payments: [], reports: [], activity: [] };
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 3200);
}

function showAuth(message = "") {
  authPanel.hidden = false;
  appShell.hidden = true;
  authError.textContent = message;
  authError.hidden = !message;
}

function setSidebarOpen(open) {
  sidebar.classList.toggle("open", open);
  scrim.classList.toggle("visible", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  document.body.classList.toggle("navigation-open", open);
}

function normalizeListing(row) {
  const data = row.public_data || {};
  return {
    ...row,
    title: String(data.title || "Untitled listing"),
    owner: String(data.name || "Owner not provided"),
    town: String(data.town || "—"),
    area: String(data.area || "—"),
    rent: Number(data.rent) || 0,
    type: shortType(data.type),
    period: String(data.period || "Monthly"),
  };
}

function listingStatus(status) {
  return statusLabels[status] || String(status || "Unknown");
}

function statusClass(status) {
  if (status === "pending_approval" || status === "payment_pending" || status === "pending") return "pending";
  return status || "pending";
}

function dashboardMetric(title, value, note, iconName) {
  return `<article class="metric-card" aria-label="${escapeHtml(title)}: ${escapeHtml(value)}">
    <div class="metric-topline"><span>${escapeHtml(title)}</span><span class="metric-icon" aria-hidden="true">${icon(iconName)}</span></div>
    <div class="metric-value">${escapeHtml(value)}</div><p class="metric-note">${escapeHtml(note)}</p>
  </article>`;
}

function renderDashboard() {
  const live = state.listings.filter((listing) => listing.status === "live");
  const pending = state.listings.filter((listing) => listing.status === "pending_approval");
  const rent = state.listings.reduce((sum, listing) => {
    if (!["live", "unavailable", "needs_confirmation"].includes(listing.status)) return sum;
    const months = { Monthly: 1, "3 Months": 3, "6 Months": 6, Yearly: 12, Semester: 6 }[listing.period] || 1;
    return sum + listing.rent / months;
  }, 0);
  document.getElementById("metrics-grid").innerHTML = [
    dashboardMetric("Total Listings", state.listings.length, "Live backend records", "building"),
    dashboardMetric("Live Listings", live.length, "Visible on the public site", "shield"),
    dashboardMetric("Pending Approval", pending.length, "Paid submissions awaiting review", "listings"),
    dashboardMetric("Listed Monthly Rent", money(rent), "Monthly equivalent of active listings", "wallet"),
  ].join("");
  document.getElementById("hero-stats").innerHTML = `
    <div><span>Rooms on the platform</span><strong>${state.listings.length.toLocaleString()}</strong></div>
    <div><span>Live across Ghana</span><strong>${live.length.toLocaleString()}</strong></div>`;

  const featured = [...pending, ...live, ...state.listings.filter((listing) => !["pending_approval", "live", "removed", "rejected"].includes(listing.status))].slice(0, 3);
  document.getElementById("featured-grid").innerHTML = featured.length
    ? featured.map((listing, index) => {
      const photo = listing.public_data.photos?.find((url) => typeof url === "string" && url.startsWith("https://"));
      return `<article class="property-card">
        <a class="property-photo property-photo-${index + 1}" href="#listings" data-page="All Listings" aria-label="View ${escapeHtml(listing.title)}"${photo ? ` style="background-image:url('${escapeHtml(photo)}')"` : ""}></a>
        <span class="property-status status-${statusClass(listing.status)}">${escapeHtml(listingStatus(listing.status))}</span>
        <div class="property-body"><div class="property-type">${escapeHtml(listing.type)} <span>·</span> ${escapeHtml(listing.town)}</div>
          <h3>${escapeHtml(listing.title)}</h3><p>${escapeHtml(listing.area)} · Listed by ${escapeHtml(listing.owner)}</p>
          <div class="property-price">${money(listing.rent)} <small>/ ${escapeHtml(listing.period)}</small></div></div>
      </article>`;
    }).join("")
    : '<div class="featured-empty">No live listings have been submitted yet.</div>';

  document.getElementById("preview-listing-rows").innerHTML = state.listings.slice(0, 4).map((listing, index) => `
    <tr><td><span class="table-property-thumb thumb-${index + 1}"></span><strong>${escapeHtml(listing.title)}</strong><small>${escapeHtml(listing.type)}</small></td>
    <td>${escapeHtml(listing.area)}, ${escapeHtml(listing.town)}</td><td>${money(listing.rent)}</td>
    <td><span class="status-badge status-${statusClass(listing.status)}">${escapeHtml(listingStatus(listing.status))}</span></td></tr>`).join("");
  const townCounts = state.listings.reduce((counts, listing) => {
    counts[listing.town] = (counts[listing.town] || 0) + 1;
    return counts;
  }, {});
  document.getElementById("tema-count").textContent = townCounts.Tema || 0;
  document.getElementById("accra-count").textContent = townCounts.Accra || 0;
  document.getElementById("kumasi-count").textContent = townCounts.Kumasi || 0;

  const recentListings = state.listings.slice(0, 3);
  const recentPayments = state.payments.slice(0, 3);
  const recentReports = state.reports.slice(0, 3);
  const recentActivity = state.activity.slice(0, 3);
  const sections = [
    ["Recent Listings", "#listings", recentListings.map((item) => `<div class="activity-row"><span>${escapeHtml(item.title)}</span><b class="status-badge status-${statusClass(item.status)}">${escapeHtml(listingStatus(item.status))}</b></div>`).join(""), "No listing records."],
    ["Recent Payments", "#payments", recentPayments.map((item) => `<div class="activity-row"><span>${escapeHtml(item.reference)}</span><b>${money(item.amount_minor / 100)} <span class="payment-status">${escapeHtml(listingStatus(item.status))}</span></b></div>`).join(""), "No payment records."],
    ["Recent Reports", "#reports", recentReports.map((item) => `<div class="activity-row"><span>${escapeHtml(item.reason)}</span><b class="status-badge status-${statusClass(item.status)}">${escapeHtml(listingStatus(item.status))}</b></div>`).join(""), "No reports have been submitted."],
    ["Recent Activity", "#activity-logs", recentActivity.map((item) => `<div class="activity-row"><span>${escapeHtml(item.action)}</span><time>${new Date(item.created_at).toLocaleString()}</time></div>`).join(""), "No admin activity recorded."],
  ];
  document.getElementById("activity-grid").innerHTML = sections.map(([title, hash, rows, empty]) => `
    <article class="activity-card"><header class="activity-header"><h3>${title}</h3><a href="${hash}" data-page="${escapeHtml(pageNames.get(hash) || title)}">View all</a></header>
    <div class="activity-list">${rows || `<div class="activity-empty">${empty}</div>`}</div></article>`).join("");
}

function renderListings() {
  const filter = statusFilters[window.location.hash];
  const listings = state.listings.filter((listing) => !filter || listing.status === filter);
  document.getElementById("listings-title").textContent = pageNames.get(window.location.hash) || "All Listings";
  document.querySelector(".listing-table thead").innerHTML = "<tr><th>Listing</th><th>Owner</th><th>Location</th><th>Rent</th><th>Status</th><th>Actions</th></tr>";
  document.getElementById("listing-rows").innerHTML = listings.map((listing) => {
    let actions = "";
    if (["pending_approval", "changes_requested"].includes(listing.status)) {
      actions = `<button class="row-action approve-action" data-action="live" data-id="${escapeHtml(listing.id)}">Approve</button>
        <button class="row-action" data-action="changes_requested" data-id="${escapeHtml(listing.id)}">Request changes</button>
        <button class="row-action remove-action" data-action="rejected" data-id="${escapeHtml(listing.id)}">Reject</button>`;
    } else if (listing.status === "live") {
      actions = `<button class="row-action" data-action="unavailable" data-id="${escapeHtml(listing.id)}">Mark unavailable</button>`;
    } else if (["unavailable", "rejected", "removed", "needs_confirmation"].includes(listing.status)) {
      actions = `<button class="row-action approve-action" data-action="live" data-id="${escapeHtml(listing.id)}">Restore live</button>`;
    }
    if (!["removed", "rejected"].includes(listing.status)) {
      actions += `<button class="row-action remove-action" data-action="removed" data-id="${escapeHtml(listing.id)}">Remove</button>`;
    }
    const privateAddress = listing.private_data?.exact_address;
    return `<tr><td><strong>${escapeHtml(listing.title)}</strong><small>${escapeHtml(listing.id)} · ${escapeHtml(listing.type)}</small></td>
      <td>${escapeHtml(listing.owner)}<small>${escapeHtml(listing.private_data?.owner_email || "")}</small></td>
      <td>${escapeHtml(listing.area)}, ${escapeHtml(listing.town)}${privateAddress ? `<small>${escapeHtml(privateAddress)}</small>` : ""}</td>
      <td>${money(listing.rent)}<small>/ ${escapeHtml(listing.period)}</small></td>
      <td><span class="status-badge status-${statusClass(listing.status)}">${escapeHtml(listingStatus(listing.status))}</span></td>
      <td><div class="row-actions">${actions || "—"}</div></td></tr>`;
  }).join("");
  document.getElementById("listings-empty").hidden = listings.length > 0;
  document.querySelector(".listing-table").hidden = listings.length === 0;
}

function renderPayments() {
  const filter = paymentFilters[window.location.hash];
  const payments = state.payments.filter((payment) => !filter || payment.status === filter);
  const listingById = new Map(state.listings.map((listing) => [listing.id, listing]));
  document.getElementById("listings-title").textContent = pageNames.get(window.location.hash) || "All Payments";
  document.querySelector(".listing-table thead").innerHTML = "<tr><th>Reference</th><th>Listing</th><th>Owner</th><th>Amount</th><th>Status</th><th>Created</th></tr>";
  document.getElementById("listing-rows").innerHTML = payments.map((payment) => {
    const listing = listingById.get(payment.listing_id);
    return `<tr><td><strong>${escapeHtml(payment.reference)}</strong><small>${escapeHtml(payment.id)}</small></td>
      <td>${escapeHtml(listing?.title || "Listing unavailable")}</td><td>${escapeHtml(listing?.owner || "—")}</td>
      <td>${money(payment.amount_minor / 100)}<small>${escapeHtml(payment.currency)}</small></td>
      <td><span class="status-badge status-${statusClass(payment.status)}">${escapeHtml(listingStatus(payment.status))}</span></td>
      <td>${new Date(payment.created_at).toLocaleString()}</td></tr>`;
  }).join("");
  document.getElementById("listings-empty").hidden = payments.length > 0;
  document.querySelector(".listing-table").hidden = payments.length === 0;
}

function renderReports() {
  document.getElementById("listings-title").textContent = "Reports & Safety";
  document.querySelector(".listing-table thead").innerHTML = "<tr><th>Reason</th><th>Listing</th><th>Reporter contact</th><th>Status</th><th>Submitted</th><th>Actions</th></tr>";
  const listingById = new Map(state.listings.map((listing) => [listing.id, listing]));
  document.getElementById("listing-rows").innerHTML = state.reports.map((report) => {
    const listing = listingById.get(report.listing_id);
    const actions = ["open", "reviewing"].includes(report.status)
      ? `<button class="row-action approve-action" data-report-action="resolved" data-id="${escapeHtml(report.id)}">Resolve</button><button class="row-action" data-report-action="dismissed" data-id="${escapeHtml(report.id)}">Dismiss</button>`
      : "—";
    return `<tr><td>${escapeHtml(report.reason)}</td><td>${escapeHtml(listing?.title || report.listing_id)}</td>
      <td>${escapeHtml(report.reporter_contact || "—")}</td><td><span class="status-badge status-${statusClass(report.status)}">${escapeHtml(listingStatus(report.status))}</span></td>
      <td>${new Date(report.created_at).toLocaleString()}</td><td><div class="row-actions">${actions}</div></td></tr>`;
  }).join("");
  document.getElementById("listings-empty").hidden = state.reports.length > 0;
  document.querySelector(".listing-table").hidden = state.reports.length === 0;
}

function renderOwners() {
  const owners = new Map();
  state.listings.forEach((listing) => {
    const phone = String(listing.public_data.phone || "");
    const email = String(listing.private_data?.owner_email || "");
    const key = phone || email || listing.id;
    const owner = owners.get(key) || {
      name: listing.owner,
      phone,
      email,
      role: String(listing.public_data.role || "—"),
      listings: 0,
    };
    owner.listings++;
    owners.set(key, owner);
  });
  const records = [...owners.values()];
  document.getElementById("listings-title").textContent = "Owners & Caretakers";
  document.querySelector(".listing-table thead").innerHTML = "<tr><th>Owner</th><th>Role</th><th>Phone</th><th>Email</th><th>Listings</th></tr>";
  document.getElementById("listing-rows").innerHTML = records.map((owner) => `
    <tr><td><strong>${escapeHtml(owner.name)}</strong></td><td>${escapeHtml(owner.role)}</td>
      <td>${escapeHtml(owner.phone || "—")}</td><td>${escapeHtml(owner.email || "—")}</td><td>${owner.listings}</td></tr>`).join("");
  document.getElementById("listings-empty").hidden = records.length > 0;
  document.querySelector(".listing-table").hidden = records.length === 0;
}

function renderActivity() {
  const listingById = new Map(state.listings.map((listing) => [listing.id, listing]));
  document.getElementById("listings-title").textContent = "Activity Logs";
  document.querySelector(".listing-table thead").innerHTML = "<tr><th>Action</th><th>Listing</th><th>Details</th><th>Time</th></tr>";
  document.getElementById("listing-rows").innerHTML = state.activity.map((item) => `
    <tr><td>${escapeHtml(item.action)}</td><td>${escapeHtml(listingById.get(item.listing_id)?.title || "—")}</td>
      <td>${escapeHtml(JSON.stringify(item.details || {}))}</td><td>${new Date(item.created_at).toLocaleString()}</td></tr>`).join("");
  document.getElementById("listings-empty").hidden = state.activity.length > 0;
  document.querySelector(".listing-table").hidden = state.activity.length === 0;
}

function renderPage() {
  const page = pageNames.get(window.location.hash) || "Dashboard";
  const dashboard = page === "Dashboard";
  const listingsPage = window.location.hash === "#listings" || Boolean(statusFilters[window.location.hash]);
  const paymentsPage = window.location.hash === "#payments" || Boolean(paymentFilters[window.location.hash]);
  const reportsPage = window.location.hash === "#reports";
  const ownersPage = window.location.hash === "#owners";
  const activityPage = window.location.hash === "#activity-logs";
  document.title = `${page} | NestGH Admin`;
  document.getElementById("page-title").textContent = page;
  document.getElementById("page-eyebrow").textContent = dashboard ? "Overview" : "Workspace";
  document.getElementById("page-description").textContent = dashboard
    ? "A live view of listings, payments, and platform activity."
    : (listingsPage || paymentsPage || reportsPage || ownersPage || activityPage ? "Review and manage records stored in Supabase." : `${page} is not connected to a live data source yet.`);
  document.getElementById("connection-title").textContent = "Connected to Supabase";
  document.getElementById("connection-description").textContent = "Live data is protected by your administrator account and Supabase row-level security.";
  document.getElementById("snapshot-title").textContent = dashboard ? "Platform snapshot" : `${page} overview`;
  document.getElementById("snapshot-section").hidden = !dashboard;
  document.getElementById("recent-section").hidden = !dashboard;
  document.getElementById("featured-section").hidden = !dashboard;
  document.getElementById("dashboard-hero").hidden = !dashboard;
  document.getElementById("overview-grid").hidden = !dashboard;
  document.getElementById("lower-grid").hidden = !dashboard;
  document.querySelector(".page-heading").hidden = dashboard;
  document.getElementById("listings-section").hidden = !(listingsPage || paymentsPage || reportsPage || ownersPage || activityPage);
  document.getElementById("placeholder-section").hidden = dashboard || listingsPage || paymentsPage || reportsPage || ownersPage || activityPage;
  document.getElementById("placeholder-title").textContent = `${page} is not connected yet`;
  if (dashboard) renderDashboard();
  if (listingsPage) renderListings();
  if (paymentsPage) renderPayments();
  if (reportsPage) renderReports();
  if (ownersPage) renderOwners();
  if (activityPage) renderActivity();
  document.querySelectorAll(".nav-link[data-page], .nav-more-menu a[data-page]").forEach((link) => {
    const active = link.dataset.page === page;
    link.classList.toggle("active", active && link.classList.contains("nav-link"));
    link.classList.toggle("current", active && link.closest(".nav-more-menu") !== null);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

async function refreshData() {
  document.getElementById("connection-title").textContent = "Loading live data…";
  let results;
  try {
    results = await Promise.all([
      client.from("listings").select("id,status,public_data,private_data,created_at,updated_at").order("created_at", { ascending: false }),
      client.from("payments").select("id,listing_id,reference,amount_minor,currency,status,created_at,paid_at").order("created_at", { ascending: false }),
      client.from("listing_reports").select("id,listing_id,reason,reporter_contact,status,created_at").order("created_at", { ascending: false }),
      client.from("admin_activity").select("id,admin_user_id,listing_id,action,details,created_at").order("created_at", { ascending: false }).limit(20),
    ]);
  } catch (error) {
    console.error("Could not reach Supabase admin data:", error);
    document.getElementById("connection-title").textContent = "Backend data could not be loaded";
    document.getElementById("connection-description").textContent = error instanceof Error ? error.message : "Network request failed.";
    showToast("Could not reach Supabase. Check your network and try refreshing.");
    return;
  }
  const failure = results.find((result) => result.error);
  if (failure) {
    console.error("Could not load Supabase admin data:", failure.error);
    document.getElementById("connection-title").textContent = "Backend data could not be loaded";
    document.getElementById("connection-description").textContent = failure.error.message;
    showToast(`Could not load admin data: ${failure.error.message}`);
    return;
  }
  state.listings = results[0].data.map(normalizeListing);
  state.payments = results[1].data;
  state.reports = results[2].data;
  state.activity = results[3].data;
  document.getElementById("connection-title").textContent = "Connected to Supabase";
  renderPage();
}

async function activateSession(session) {
  const user = session?.user;
  if (!user) {
    state.user = null;
    state.admin = null;
    showAuth();
    return;
  }
  const { data: admin, error } = await client.from("admin_users").select("user_id,display_name").eq("user_id", user.id).maybeSingle();
  if (error) {
    console.error("Could not verify admin access:", error);
    await client.auth.signOut();
    showAuth("Admin access could not be verified. Check the Supabase migration and administrator setup.");
    return;
  }
  if (!admin) {
    await client.auth.signOut();
    showAuth("This account is not authorized for the NestGH admin workspace.");
    return;
  }
  state.user = user;
  state.admin = admin;
  document.getElementById("admin-name").textContent = admin.display_name || "NestGH Admin";
  document.getElementById("admin-email").textContent = user.email || "";
  profileButton.textContent = (admin.display_name || user.email || "N").slice(0, 1).toUpperCase();
  authPanel.hidden = true;
  appShell.hidden = false;
  await refreshData();
}

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!client) {
    showAuth("Supabase configuration did not load. Check the project URL, publishable key, and browser network connection.");
    return;
  }
  const button = document.getElementById("auth-submit");
  button.disabled = true;
  button.textContent = "Signing in…";
  authError.hidden = true;
  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: document.getElementById("auth-email").value.trim(),
      password: document.getElementById("auth-password").value,
    });
    if (error) {
      showAuth(`Sign in failed: ${error.message}`);
      return;
    }
    await activateSession(data.session);
  } catch (error) {
    console.error("Admin sign in failed:", error);
    showAuth(`Sign in failed: ${error instanceof Error ? error.message : "Network request failed."}`);
  } finally {
    button.disabled = false;
    button.textContent = "Sign in";
  }
});

document.getElementById("sign-out").addEventListener("click", async () => {
  try {
    const { error } = await client.auth.signOut();
    if (error) {
      console.error("Admin sign out failed:", error);
      showToast(`Could not sign out: ${error.message}`);
      return;
    }
    state.user = null;
    state.admin = null;
    state.listings = [];
    state.payments = [];
    state.reports = [];
    showAuth();
  } catch (error) {
    console.error("Admin sign out failed:", error);
    showToast(`Could not sign out: ${error instanceof Error ? error.message : "Network request failed."}`);
  }
});

document.getElementById("refresh-data").addEventListener("click", () => {
  refreshData().catch((error) => {
    console.error("Admin refresh failed:", error);
    showToast("Unable to refresh live data. Please try again.");
  });
});

document.getElementById("listing-rows").addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action][data-id]");
  if (!button || !state.user) return;
  const listing = state.listings.find((item) => item.id === button.dataset.id);
  if (!listing) return;
  button.disabled = true;
  const { error } = await client.from("listings").update({
    status: button.dataset.action,
    public_data: { ...listing.public_data, verified: ["live", "unavailable"].includes(button.dataset.action) },
    updated_at: new Date().toISOString(),
  }).eq("id", listing.id);
  if (error) {
    console.error("Listing moderation failed:", error);
    button.disabled = false;
    showToast(`Listing update failed: ${error.message}`);
    return;
  }
  const { error: activityError } = await client.from("admin_activity").insert({
    admin_user_id: state.user.id,
    listing_id: listing.id,
    action: `${listingStatus(button.dataset.action)}: ${listing.title}`,
    details: { from: listing.status, to: button.dataset.action },
  });
  if (activityError) console.error("Listing was updated but its activity log was not saved:", activityError);
  await refreshData();
  showToast(activityError ? "Listing updated, but its activity log could not be saved." : `Listing updated: ${listingStatus(button.dataset.action)}.`);
});

document.getElementById("listing-rows").addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-report-action][data-id]");
  if (!button || !state.user) return;
  button.disabled = true;
  const { error } = await client.from("listing_reports")
    .update({ status: button.dataset.reportAction })
    .eq("id", button.dataset.id);
  if (error) {
    console.error("Report moderation failed:", error);
    button.disabled = false;
    showToast(`Report update failed: ${error.message}`);
    return;
  }
  await refreshData();
  showToast(`Report ${listingStatus(button.dataset.reportAction).toLowerCase()}.`);
});

document.getElementById("menu-button").addEventListener("click", () => setSidebarOpen(!sidebar.classList.contains("open")));
scrim.addEventListener("click", () => setSidebarOpen(false));
profileButton.addEventListener("click", () => {
  const open = profileButton.getAttribute("aria-expanded") !== "true";
  profileButton.setAttribute("aria-expanded", String(open));
  profileMenu.hidden = !open;
});
document.addEventListener("click", (event) => {
  if (event.target.closest("[data-page]")) {
    const moreMenu = document.querySelector(".nav-more");
    if (moreMenu) moreMenu.open = false;
    if (window.matchMedia("(max-width: 600px)").matches) setSidebarOpen(false);
  }
  if (!event.target.closest(".topbar-actions")) {
    profileMenu.hidden = true;
    profileButton.setAttribute("aria-expanded", "false");
  }
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setSidebarOpen(false);
    profileMenu.hidden = true;
    profileButton.setAttribute("aria-expanded", "false");
  }
});
window.addEventListener("hashchange", renderPage);
if (client) {
  client.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error("Could not restore admin session:", error);
      showAuth(`Could not restore your session: ${error.message}`);
      return;
    }
    activateSession(data.session).catch((activationError) => {
      console.error("Could not activate admin session:", activationError);
      showAuth("Admin access could not be activated. Please sign in again.");
    });
  }).catch((error) => {
    console.error("Could not restore admin session:", error);
    showAuth("Could not connect to restore your admin session. Check your network and try again.");
  });
  client.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT" && state.user) {
      state.user = null;
      state.admin = null;
      state.listings = [];
      state.payments = [];
      state.reports = [];
      showAuth("Your admin session has ended. Please sign in again.");
    }
  });
} else {
  showAuth("Supabase configuration did not load. Check the project URL and browser SDK.");
}
