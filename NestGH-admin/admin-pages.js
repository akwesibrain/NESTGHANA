const adminState = {
  page: "dashboard",
  query: "",
  status: "all",
  days: 30,
  notificationsRead: false,
  profileName: "Admin"
};

const main = document.querySelector("main");
const dashboard = $("#g");
const pageView = document.createElement("section");
pageView.id = "page-view";
pageView.hidden = true;
main.append(pageView);

const listingPricing = window.NestGHListingPricing;
const pricingForListing = listing =>
  listingPricing?.getListingPricing({
    listingType: listing.listingType,
    category: listing.category,
    type: listing.type,
  }) || null;
const formatListingFee = pricing =>
  pricing ? listingPricing.formatListingPrice(pricing) : "Not available";
const pricingCatalog = () =>
  `<section class="settings-item"><h3>Listing fee preview</h3><p class="mu">Shared frontend pricing configuration. These preview values are not loaded from or saved to a backend.</p><dl class="detail-list">${Object.entries(listingPricing.LISTING_PRICES).map(([type, fee]) => `<div><dt>${esc(listingPricing.LISTING_LABELS[type])}</dt><dd>${listingPricing.formatListingPrice({ listingType: type, listingFee: fee, currency: "GHS" })}</dd></div>`).join("")}</dl></section>`;

const sampleNames = ["Ama Mensah", "Kwame Boateng", "Akosua Owusu", "Kofi Asare", "Abena Osei"];
D.U.forEach((user, i) => {
  user.id = user.id || i + 1;
  user.name = user.name || sampleNames[i % sampleNames.length];
  user.email = user.email || `user${i + 1}@example.com`;
});
D.R.forEach((report, i) => {
  report.id = report.id || i + 1;
  report.status = report.status || "open";
});
D.S.forEach((ticket, i) => {
  ticket.id = ticket.id || i + 1;
  ticket.name = ticket.name || sampleNames[i % sampleNames.length];
  ticket.subject = ticket.subject || ({
    owner: "Owner enquiry",
    user: "User enquiry",
    comp: "Listing complaint",
    tick: "Support request"
  })[ticket.k];
});
D.P.forEach((payment, i) => {
  payment.id = payment.id || i + 1;
});

const pageTitles = {
  listings: ["Listings", "Review and manage property listings."],
  users: ["Users", "Review accounts and verification status."],
  payments: ["Payments", "Sample payment activity only; no payment provider is connected."],
  reports: ["Reports", "Review and resolve reported activity."],
  categories: ["Categories", "Manage property categories."],
  support: ["Support", "Review enquiries and support tickets."],
  settings: ["Settings", "Manage account, marketplace, and system configuration."],
  profile: ["Admin profile", "Update the profile shown in this preview."],
  notifications: ["Notifications", "Recent activity across the demo dashboard."],
  search: ["Search", "Search listings and user accounts."]
};

const closeMenus = () => {
  document.querySelectorAll(".pop").forEach(menu => { menu.hidden = true; });
  document.querySelectorAll("[data-m]").forEach(button => button.setAttribute("aria-expanded", "false"));
  nav.classList.remove("open");
  bk.hidden = true;
  mb.setAttribute("aria-expanded", "false");
};

const button = (label, action, value = "", primary = false) =>
  `<button class="btn${primary ? " p" : ""}" type="button" data-admin-action="${action}"${value ? ` data-value="${esc(value)}"` : ""}>${label}</button>`;

const table = (headers, rows) =>
  `<div class="table-wrap"><table class="t"><thead><tr>${headers.map(label => `<th scope="col">${label}</th>`).join("")}</tr></thead><tbody id="page-rows">${rows}</tbody></table></div>`;

const statusBadge = status => {
  const key = ["active", "pending", "rejected", "suspended"].includes(status) ? status : "pending";
  return `<span class="bg" style="--c:${CL[key]}">${esc(LB[key])}</span>`;
};

const listingRows = () => {
  const q = adminState.query.trim().toLowerCase();
  return D.L.filter(listing =>
    (adminState.status === "all" || listing.status === adminState.status) &&
    (!q || `${listing.title} ${listing.town} ${listing.region} ${listing.type} ${pricingForListing(listing)?.listingType || ""}`.toLowerCase().includes(q))
  ).sort((a, b) => b.created - a.created).map(listing => {
    const pricing = pricingForListing(listing);
    const listingType =
      pricing && listingPricing.LISTING_LABELS[pricing.listingType];
    const actions = [
      button("Details", "listing-details", String(listing.id)),
      listing.status === "pending" ? button("Approve", "listing-status", `${listing.id}:active`, true) : "",
      listing.status === "active" ? button("Suspend", "listing-status", `${listing.id}:suspended`) : "",
      listing.status === "suspended" ? button("Reactivate", "listing-status", `${listing.id}:active`, true) : "",
      listing.status !== "rejected" ? button("Reject", "listing-status", `${listing.id}:rejected`) : ""
    ].join("");
    return `<tr>
      <td data-l="Listing"><b>${esc(listing.title)}</b></td>
      <td data-l="Location">${esc(listing.town)}, ${esc(listing.region)}</td>
      <td data-l="Property type">${esc(listing.type)}</td>
      <td data-l="Listing type">${listingType ? esc(listingType) : "Not available"}</td>
      <td data-l="Rent">${cedi(listing.price)} / month</td>
      <td data-l="Listing fee">${formatListingFee(pricing)}</td>
      <td data-l="Listing status">${statusBadge(listing.status)}</td>
      <td data-l="Actions"><div class="page-actions">${actions}</div></td>
    </tr>`;
  }).join("") || `<tr><td colspan="8" class="mu">No listings match these filters.</td></tr>`;
};

const userRows = () => {
  const q = adminState.query.trim().toLowerCase();
  return D.U.filter(user =>
    (!q || `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(q)) &&
    (adminState.status === "all" || (adminState.status === "verified" ? user.verified : !user.verified))
  ).map(user => `<tr>
    <td data-l="User"><b>${esc(user.name)}</b></td>
    <td data-l="Email">${esc(user.email)}</td>
    <td data-l="Role">${esc(user.role)}</td>
    <td data-l="Verification">${user.verified ? '<span class="bg" style="--c:var(--ok)">Verified</span>' : '<span class="bg" style="--c:var(--wa)">Pending</span>'}</td>
    <td data-l="Joined">${fd(user.created)}</td>
    <td data-l="Actions">${button(user.verified ? "Unverify" : "Verify", "user-verify", String(user.id), !user.verified)}</td>
  </tr>`).join("") || `<tr><td colspan="6" class="mu">No users match these filters.</td></tr>`;
};

const paymentRows = () => {
  const q = adminState.query.trim().toLowerCase();
  return D.P.map(payment => {
    const listing =
      D.L.find(item => String(item.id) === String(payment.listingId)) || null;
    const pricing = payment.listingType
      ? listingPricing.getListingPricing(payment.listingType)
      : listing
        ? pricingForListing(listing)
        : null;
    const listingFee =
      Number.isFinite(Number(payment.listingFee)) &&
      Number(payment.listingFee) > 0 &&
      payment.currency === "GHS"
        ? listingPricing.formatListingPrice({
            listingType: pricing?.listingType,
            listingFee: Number(payment.listingFee),
            currency: payment.currency,
          })
        : formatListingFee(pricing);
    return { payment, listing, pricing, listingFee };
  }).filter(({ payment, listing, pricing }) =>
    !q ||
    `${payment.st} ${payment.amt} ${payment.listingTitle || listing?.title || ""} ${pricing ? listingPricing.LISTING_LABELS[pricing.listingType] : ""} ${payment.reference || ""}`.toLowerCase().includes(q)
  ).sort((a, b) => b.payment.at - a.payment.at).map(({ payment, listing, pricing, listingFee }) => `<tr>
      <td data-l="Listing">${esc(payment.listingTitle || listing?.title || "Not linked (sample data)")}</td>
      <td data-l="Listing type">${pricing ? esc(listingPricing.LISTING_LABELS[pricing.listingType]) : "Not available"}</td>
      <td data-l="Listing fee">${esc(listingFee)}</td>
      <td data-l="Amount (sample)">${cedi(payment.amt)}</td>
      <td data-l="Payment status"><span class="bg" style="--c:${payment.st === "ok" ? "var(--ok)" : payment.st === "wait" ? "var(--wa)" : "var(--er)"}">${payment.st === "ok" ? "Successful" : payment.st === "wait" ? "Pending" : "Failed"}${payment.source === "live" ? "" : " · sample"}</span></td>
      <td data-l="Payment reference">${esc(payment.reference || (payment.source === "live" ? "Not provided" : "Not provided (sample data)"))}</td>
      <td data-l="Date">${fd(payment.at)}</td>
    </tr>`).join("") || `<tr><td colspan="7" class="mu">No payments match this search.</td></tr>`;
};

const reportRows = () => {
  const q = adminState.query.trim().toLowerCase();
  const labels = { rep: "Reported listing", sus: "Suspicious activity", dup: "Duplicate listing" };
  return D.R.filter(report => !q || `${labels[report.k]} ${report.status}`.toLowerCase().includes(q))
    .sort((a, b) => b.at - a.at).map(report => `<tr>
      <td data-l="Report">RPT-${String(report.id).padStart(4, "0")}</td>
      <td data-l="Type">${labels[report.k]}</td>
      <td data-l="Status"><span class="bg" style="--c:${report.status === "open" ? "var(--wa)" : "var(--ok)"}">${report.status === "open" ? "Open" : "Resolved"}</span></td>
      <td data-l="Reported">${fd(report.at)}</td>
      <td data-l="Actions">${button(report.status === "open" ? "Resolve" : "Reopen", "report-toggle", String(report.id), report.status === "open")}</td>
    </tr>`).join("") || `<tr><td colspan="5" class="mu">No reports match this search.</td></tr>`;
};

const supportRows = () => {
  const q = adminState.query.trim().toLowerCase();
  const labels = { owner: "Owner enquiry", user: "User enquiry", comp: "Complaint", tick: "Support ticket" };
  return D.S.filter(ticket => !q || `${ticket.name} ${ticket.subject} ${labels[ticket.k]}`.toLowerCase().includes(q))
    .sort((a, b) => b.at - a.at).map(ticket => `<tr>
      <td data-l="Request"><b>${labels[ticket.k]}</b></td>
      <td data-l="From">${esc(ticket.name)}</td>
      <td data-l="Status"><span class="bg" style="--c:${ticket.open ? "var(--wa)" : "var(--ok)"}">${ticket.open ? "Open" : "Closed"}</span></td>
      <td data-l="Received">${fd(ticket.at)}</td>
      <td data-l="Actions">${button(ticket.open ? "Close ticket" : "Reopen", "support-toggle", String(ticket.id), ticket.open)}</td>
    </tr>`).join("") || `<tr><td colspan="5" class="mu">No support requests match this search.</td></tr>`;
};

const filteredRows = {
  listings: listingRows,
  users: userRows,
  payments: paymentRows,
  reports: reportRows,
  support: supportRows
};

const filterBar = (options, placeholder = "Search this section") =>
  `<div class="page-filters">
    <label class="vh" for="page-search">Search this section</label>
    <input id="page-search" class="page-input" type="search" placeholder="${placeholder}" value="${esc(adminState.query)}">
    ${options ? `<label class="vh" for="page-filter">Filter results</label><select id="page-filter" class="page-input">${options}</select>` : ""}
  </div>`;

const sectionMarkup = page => {
  const [title, description] = pageTitles[page] || pageTitles.dashboard;
  let content = "";
  if (page === "listings") {
    content = `<div class="page-toolbar">${filterBar('<option value="all">All statuses</option><option value="active">Active</option><option value="pending">Pending</option><option value="rejected">Rejected</option><option value="suspended">Suspended</option>', "Search listings")}<div>${button("Add listing", "listing-add", "", true)}</div></div>${table(["Listing", "Location", "Property type", "Listing type", "Rent", "Listing fee", "Listing status", "Actions"], listingRows())}`;
  } else if (page === "users") {
    content = `${filterBar('<option value="all">All users</option><option value="verified">Verified</option><option value="pending">Pending verification</option>', "Search users")}${table(["User", "Email", "Role", "Verification", "Joined", "Actions"], userRows())}`;
  } else if (page === "payments") {
    content = `${pricingCatalog()}<div class="page-summary">${tile("Sample successful", D.P.filter(p => p.st === "ok").length, "var(--ok)", "check")}${tile("Sample pending", D.P.filter(p => p.st === "wait").length, "var(--wa)", "clock")}${tile("Sample failed", D.P.filter(p => p.st === "fail").length, "var(--er)", "x")}</div><p class="mu">Sample payment activity below is not connected to Paystack. No live payments, payment references or listing links are represented.</p>${filterBar("", "Search payments")}${table(["Listing", "Listing type", "Listing fee", "Amount (sample)", "Payment status", "Payment reference", "Date"], paymentRows())}`;
  } else if (page === "reports") {
    content = `<div class="page-summary">${tile("Open reports", D.R.filter(r => r.status === "open").length, "var(--wa)", "alert")}${tile("Resolved", D.R.filter(r => r.status !== "open").length, "var(--ok)", "check")}</div>${filterBar("", "Search reports")}${table(["Report", "Type", "Status", "Reported", "Actions"], reportRows())}`;
  } else if (page === "support") {
    content = `${filterBar("", "Search support requests")}${table(["Request", "From", "Status", "Received", "Actions"], supportRows())}`;
  } else if (page === "categories") {
    content = `<div class="page-toolbar"><p class="mu">Counts reflect the current sample listings.</p><div>${button("Add category", "category-add", "", true)}</div></div>${table(["Category", "Listings", "Actions"], D.Y.map((category, i) => `<tr>
      <td data-l="Category"><b>${esc(category[0])}</b></td>
      <td data-l="Listings">${cnt(D.L, listing => listing.type === category[0])}</td>
      <td data-l="Actions"><div class="page-actions">${button("Rename", "category-rename", String(i))}${button("Remove", "category-remove", String(i))}</div></td>
    </tr>`).join(""))}`;
  } else if (page === "settings") {
    content = `<div class="settings-grid">
      <div class="settings-item"><h3>Appearance</h3><p class="mu">Choose the dashboard accent theme.</p>${button("Toggle gold theme", "toggle-theme")}</div>
      <div class="settings-item"><h3>Date range</h3><p class="mu">Current dashboard range: Last ${adminState.days} days.</p>${button("Change date range", "cycle-range")}</div>
      ${pricingCatalog()}
      <div class="settings-item"><h3>Demo data</h3><p class="mu">Changes in this preview reset when the page reloads.</p>${button("Reset preview data", "reset-demo")}</div>
    </div>`;
  } else if (page === "profile") {
    content = `<form id="profile-form" class="profile-form">
      <label>Display name<input class="page-input" name="name" required maxlength="40" value="${esc(adminState.profileName)}"></label>
      <label>Email<input class="page-input" name="email" type="email" value="admin@nestgh.example"></label>
      <div class="page-actions">${button("Sign out of preview", "sign-out") }<button class="btn p" type="submit">Save profile</button></div>
    </form>`;
  } else if (page === "notifications") {
    const notifications = [
      ...D.L.filter(item => item.status === "pending").slice(0, 5).map(item => ({ at: item.created, text: `Listing pending review: ${item.title}` })),
      ...D.R.filter(item => item.status === "open").slice(0, 3).map(item => ({ at: item.at, text: "A report is awaiting review." }))
    ].sort((a, b) => b.at - a.at);
    content = `<div class="page-toolbar"><p class="mu">${adminState.notificationsRead ? "You're all caught up." : `${notifications.length} recent demo notifications.`}</p><div>${button("Mark all read", "notifications-read")}</div></div><div class="notification-list">${notifications.map(item => `<div class="notification-item"><span class="chip">${ic("bell")}</span><div><b>${esc(item.text)}</b><div class="mu sm">${rel(item.at)}</div></div></div>`).join("") || '<p class="mu">No new notifications.</p>'}</div>`;
  } else if (page === "search") {
    content = `${filterBar("", "Search listings and users")}<div id="search-results" class="search-results"></div>`;
  }
  return `<div class="page-panel">
    <div class="page-heading"><div><h2>${title}</h2><p class="mu">${description}</p></div>${button("Back to dashboard", "dashboard")}</div>
    ${content}
  </div>`;
};

const renderSearchResults = () => {
  const query = adminState.query.trim().toLowerCase();
  const results = [];
  if (query) {
    D.L.filter(item => `${item.title} ${item.town} ${item.type}`.toLowerCase().includes(query)).slice(0, 12)
      .forEach(item => results.push(`<button class="search-result" data-admin-action="listing-details" data-value="${item.id}"><b>${esc(item.title)}</b><span class="mu sm">Listing · ${esc(item.town)} · ${esc(item.type)}</span></button>`));
    D.U.filter(user => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query)).slice(0, 12)
      .forEach(user => results.push(`<button class="search-result" data-admin-action="open-user" data-value="${user.id}"><b>${esc(user.name)}</b><span class="mu sm">User · ${esc(user.email)}</span></button>`));
  }
  $("#search-results").innerHTML = results.join("") || `<p class="mu">${query ? "No matches found." : "Enter a name, location, or listing type to search."}</p>`;
};

const updateActiveNav = page => {
  const active = { dashboard: "Dashboard", listings: "Listings", users: "Users", payments: "Payments", reports: "Reports" }[page];
  document.querySelectorAll("#nav>a").forEach(link => {
    if (link.textContent.trim() === active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
};

const openPage = (page, options = {}) => {
  if (!pageTitles[page] && page !== "dashboard") return;
  closeMenus();
  adminState.page = page;
  adminState.query = "";
  adminState.status = "all";
  const title = $("main h1");
  const subtitle = $("main .ov .mu");
  if (page === "dashboard") {
    title.textContent = "Overview";
    subtitle.textContent = "Here's what's happening with your NestGH platform today.";
    pageView.hidden = true;
    dashboard.hidden = false;
    run(true);
  } else {
    const [heading, description] = pageTitles[page];
    title.textContent = heading;
    subtitle.textContent = description;
    dashboard.hidden = true;
    pageView.hidden = false;
    pageView.innerHTML = page === "settings" && window.NestGHSettings
      ? window.NestGHSettings.render()
      : sectionMarkup(page);
    if (page === "search") renderSearchResults();
    if (page === "settings" && window.NestGHSettings) void window.NestGHSettings.refresh();
  }
  updateActiveNav(page);
  if (options.focusSearch) $("#page-search")?.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const openDialog = (title, body) => {
  let dialog = $("#admin-dialog");
  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.id = "admin-dialog";
    document.body.append(dialog);
  }
  dialog.innerHTML = `<h2>${title}</h2>${body}<div class="dialog-actions"><button class="btn" type="button" data-close-dialog>Close</button></div>`;
  dialog.showModal();
  return dialog;
};

const addListing = () => {
  const dialog = openDialog("Add listing", `<form id="listing-form" class="record-form">
    <label>Listing title<input class="page-input" name="title" required maxlength="100"></label>
    <label>Location<select class="page-input" name="town">${D.T.map(town => `<option value="${esc(town[0])}">${esc(town[0])}</option>`).join("")}</select></label>
    <label>Category<select class="page-input" name="type">${D.Y.map(category => `<option value="${esc(category[0])}">${esc(category[0])}</option>`).join("")}</select></label>
    <label>Monthly price (GH₵)<input class="page-input" name="price" type="number" min="50" step="50" required value="1500"></label>
    <div class="dialog-actions"><button class="btn" type="button" data-close-dialog>Cancel</button><button class="btn p" type="submit">Save listing</button></div>
  </form>`);
  dialog.lastElementChild.remove();
  dialog.querySelector("#listing-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const town = D.T.find(item => item[0] === form.get("town"));
    const created = Date.now();
    D.L.unshift({
      id: Math.max(0, ...D.L.map(item => item.id)) + 1,
      title: String(form.get("title")).trim(),
      town: town[0],
      region: town[1],
      type: String(form.get("type")),
      ic: D.Y.find(item => item[0] === form.get("type"))?.[1] || "building",
      price: Number(form.get("price")),
      status: "pending",
      created,
      available: true,
      confirmed: created,
      updated: created,
      imageUrl: null
    });
    dialog.close();
    toast("Listing added to the pending review queue.");
    openPage("listings");
  });
};

const editCategory = index => {
  const category = index === null ? null : D.Y[index];
  if (index !== null && !category) return;
  const dialog = openDialog(category ? "Rename category" : "Add category", `<form id="category-form" class="record-form">
    <label>Category name<input class="page-input" name="name" required maxlength="50" value="${esc(category?.[0] || "")}"></label>
    <div class="dialog-actions"><button class="btn" type="button" data-close-dialog>Cancel</button><button class="btn p" type="submit">${category ? "Save category" : "Add category"}</button></div>
  </form>`);
  dialog.lastElementChild.remove();
  dialog.querySelector("#category-form").addEventListener("submit", event => {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name")).trim();
    if (!name) return;
    if (D.Y.some((item, i) => i !== index && item[0].toLowerCase() === name.toLowerCase())) {
      toast("That category already exists.");
      return;
    }
    if (category) {
      const oldName = category[0];
      category[0] = name;
      category[3] = name;
      D.L.forEach(listing => { if (listing.type === oldName) listing.type = name; });
    } else {
      D.Y.push([name, "building", 0, name]);
    }
    dialog.close();
    openPage("categories");
    toast(category ? "Category renamed." : "Category added.");
  });
};

const showListing = id => {
  const listing = D.L.find(item => String(item.id) === String(id));
  if (!listing) return toast("That listing is no longer available.");
  const pricing = pricingForListing(listing);
  openDialog(esc(listing.title), `<dl class="detail-list">
    <div><dt>Listing status</dt><dd>${statusBadge(listing.status)}</dd></div>
    <div><dt>Location</dt><dd>${esc(listing.town)}, ${esc(listing.region)}</dd></div>
    <div><dt>Property type</dt><dd>${esc(listing.type)}</dd></div>
    <div><dt>Listing type</dt><dd>${pricing ? esc(listingPricing.LISTING_LABELS[pricing.listingType]) : "Not available"}</dd></div>
    <div><dt>Listing fee</dt><dd>${formatListingFee(pricing)}</dd></div>
    <div><dt>Monthly rent</dt><dd>${cedi(listing.price)}</dd></div>
    <div><dt>Listed</dt><dd>${fd(listing.created)}</dd></div>
  </dl>`);
};

const refreshCurrentPage = () => {
  if (adminState.page === "dashboard") run(true);
  else openPage(adminState.page);
};

const handleAction = async (action, value = "") => {
  if (action === "dashboard") return openPage("dashboard");
  if (action === "listing-add") return addListing();
  if (action === "listing-details") return showListing(value);
  if (action === "listing-status") {
    const [id, status] = value.split(":");
    const listing = D.L.find(item => String(item.id) === id);
    if (!listing) return toast("That listing is no longer available.");
    await svc.set(Number(id), status);
    refreshCurrentPage();
    return toast(`Listing ${LB[status].toLowerCase()}.`);
  }
  if (action === "user-verify") {
    const user = D.U.find(item => String(item.id) === value);
    if (user) user.verified = !user.verified;
    refreshCurrentPage();
    return toast(user?.verified ? "User verified." : "Verification removed.");
  }
  if (action === "open-user") {
    openPage("users");
    adminState.query = D.U.find(item => String(item.id) === value)?.email || "";
    $("#page-search").value = adminState.query;
    $("#page-rows").innerHTML = userRows();
    return;
  }
  if (action === "report-toggle") {
    const report = D.R.find(item => String(item.id) === value);
    if (report) report.status = report.status === "open" ? "resolved" : "open";
    refreshCurrentPage();
    return toast(report?.status === "resolved" ? "Report resolved." : "Report reopened.");
  }
  if (action === "support-toggle") {
    const ticket = D.S.find(item => String(item.id) === value);
    if (ticket) ticket.open = !ticket.open;
    refreshCurrentPage();
    return toast(ticket?.open ? "Support request reopened." : "Support request closed.");
  }
  if (action === "category-add") {
    return editCategory(null);
  }
  if (action === "category-rename") {
    return editCategory(Number(value));
  }
  if (action === "category-remove") {
    const index = Number(value);
    const category = D.Y[index];
    if (!category) return;
    if (cnt(D.L, listing => listing.type === category[0])) return toast("A category with listings cannot be removed.");
    D.Y.splice(index, 1);
    refreshCurrentPage();
    return toast("Category removed.");
  }
  if (action === "toggle-theme") return $("#th").click();
  if (action === "cycle-range") {
    adminState.days = adminState.days === 7 ? 30 : adminState.days === 30 ? 90 : 7;
    updateRangeButton();
    return toast(`Dashboard range set to the last ${adminState.days} days.`);
  }
  if (action === "reset-demo") {
    if (window.confirm("Reset this preview by reloading the original sample data?")) window.location.reload();
    return;
  }
  if (action === "sign-out") {
    adminState.profileName = "Admin";
    openPage("dashboard");
    return toast("Signed out of the demo preview. No live account was changed.");
  }
  if (action === "notifications-read") {
    adminState.notificationsRead = true;
    openPage("notifications");
    return toast("Notifications marked as read.");
  }
};

const updateRangeButton = () => {
  const range = document.querySelector(".ov button[aria-disabled], .ov button[data-range]");
  if (!range) return;
  range.disabled = false;
  range.removeAttribute("aria-disabled");
  range.dataset.range = "true";
  range.title = `Change dashboard date range (currently last ${adminState.days} days)`;
  range.parentElement.removeAttribute("title");
  range.innerHTML = `${ic("cal")} Last ${adminState.days} days`;
};

updateRangeButton();
const signOutButton = document.querySelector(".tools .rel .pop button[data-soon]:last-child");
if (signOutButton) signOutButton.textContent = "Sign out of preview";
$("#th").addEventListener("click", () => {
  if (adminState.page === "settings") openPage("settings");
});

document.addEventListener("click", event => {
  const target = event.target.closest("button, a");
  if (!target) return;

  const navLink = target.closest("#nav>a");
  if (navLink) {
    const label = navLink.textContent.trim().toLowerCase();
    const route = { dashboard: "dashboard", listings: "listings", users: "users", payments: "payments", reports: "reports" }[label];
    if (route) {
      event.preventDefault();
      event.stopImmediatePropagation();
      openPage(route);
      return;
    }
  }

  if (target.closest("a.logo")) {
    event.preventDefault();
    event.stopImmediatePropagation();
    openPage("dashboard");
    return;
  }

  if (target.matches("[data-admin-action]")) {
    event.preventDefault();
    event.stopImmediatePropagation();
    void handleAction(target.dataset.adminAction, target.dataset.value || "");
    return;
  }

  if (target.dataset.a === "view") {
    event.preventDefault();
    event.stopImmediatePropagation();
    showListing(target.dataset.id);
    return;
  }

  if (target.dataset.range) {
    event.preventDefault();
    event.stopImmediatePropagation();
    void handleAction("cycle-range");
    return;
  }

  if (target.getAttribute("aria-label") === "Search") {
    event.preventDefault();
    event.stopImmediatePropagation();
    openPage("search", { focusSearch: true });
    return;
  }
  if (target.getAttribute("aria-label") === "Notifications") {
    event.preventDefault();
    event.stopImmediatePropagation();
    openPage("notifications");
    return;
  }
  if (target.getAttribute("aria-label") === "Settings") {
    event.preventDefault();
    event.stopImmediatePropagation();
    openPage("settings");
    return;
  }
  if (target.getAttribute("aria-label") === "Admin menu") return;

  if (target.hasAttribute("data-soon")) {
    const label = target.textContent.trim().toLowerCase();
    const section = target.closest("section.card")?.querySelector("h2")?.textContent || "";
    const route = label.includes("add listing") ? "add-listing"
      : label.includes("user") ? "users"
      : label.includes("payment") ? "payments"
      : label.includes("categor") ? "categories"
      : label.includes("support") ? "support"
      : label.includes("setting") ? "settings"
      : label.includes("profile") ? "profile"
      : label.includes("sign out") ? "sign-out"
      : section.startsWith("Listing") || section.startsWith("Recent") || section.startsWith("Availability") || section.startsWith("Location") ? "listings"
      : section.startsWith("User") ? "users"
      : section.startsWith("Payment") ? "payments"
      : section.startsWith("Report") ? "reports"
      : section.startsWith("Property") ? "categories"
      : section.startsWith("Support") ? "support"
      : "";
    if (route) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (route === "add-listing") addListing();
      else if (route === "sign-out") void handleAction("sign-out");
      else openPage(route);
      return;
    }
    if (label.includes("view")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      toast("Choose a section to view from the navigation.");
      return;
    }
  }
}, true);

document.addEventListener("input", event => {
  if (event.target.id === "page-search") {
    adminState.query = event.target.value;
    if (adminState.page === "search") renderSearchResults();
    else if (filteredRows[adminState.page]) $("#page-rows").innerHTML = filteredRows[adminState.page]();
  }
});

document.addEventListener("change", event => {
  if (event.target.id === "page-filter") {
    adminState.status = event.target.value;
    if (filteredRows[adminState.page]) $("#page-rows").innerHTML = filteredRows[adminState.page]();
  }
});

document.addEventListener("submit", event => {
  if (event.target.id !== "profile-form") return;
  event.preventDefault();
  adminState.profileName = String(new FormData(event.target).get("name")).trim();
  const profileButton = document.querySelector(".tools [aria-label='Admin menu'] .name");
  if (profileButton) profileButton.textContent = adminState.profileName;
  openPage("profile");
  toast("Profile updated for this preview.");
});

document.addEventListener("click", event => {
  if (event.target.closest("[data-close-dialog]")) {
    event.target.closest("dialog")?.close();
  }
});
