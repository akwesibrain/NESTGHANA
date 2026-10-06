(() => {
  const groups = [
    ["Account", [["profile", "Profile"], ["security", "Security"], ["sessions", "Sessions"]]],
    ["Administration", [["admin-users", "Admin Users"], ["roles", "Roles & Permissions"]]],
    ["Listings", [["listing-settings", "Listing Settings"], ["room-types", "Room Types"], ["facilities", "Facilities"]]],
    ["Locations", [["regions", "Regions"], ["towns", "Towns"], ["areas", "Areas & Aliases"]]],
    ["Payments", [["pricing", "Pricing"], ["paystack", "Paystack"]]],
    ["Communication", [["contact", "Contact Information"], ["whatsapp", "WhatsApp"], ["notifications", "Notifications"]]],
    ["Website", [["general", "General"], ["homepage", "Homepage"], ["seo", "SEO"]]],
    ["Privacy & Safety", [["privacy", "Privacy & Legal"], ["moderation", "Moderation"]]],
    ["Integrations", [["supabase", "Supabase"], ["payment-integration", "Payment Integration"], ["email", "Email"], ["analytics", "Analytics"]]],
    ["System", [["audit-logs", "Audit Logs"], ["system-status", "System Status"], ["data-management", "Data Management"], ["danger-zone", "Danger Zone"]]]
  ];

  const state = { section: "profile", data: null, loading: false, error: "", saving: false };
  const escape = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  const formatDate = value => value ? new Date(value).toLocaleString() : "Not available";
  const status = value => {
    const tone = value === "operational" || value === "connected" ? "var(--ok)"
      : value === "configured" ? "var(--blue)" : "var(--wa)";
    const label = value.replaceAll("_", " ");
    return `<span class="bg" style="--c:${tone}">${escape(label)}</span>`;
  };
  const unavailable = (message = "This setting has no authorized persistent backend in the current schema.") =>
    `<div class="settings-unavailable"><b>Not configured</b><p class="mu">${escape(message)}</p></div>`;
  const sectionName = id => groups.flatMap(([, items]) => items).find(([key]) => key === id)?.[1] || "Settings";
  const responsePayload = async response => {
    const text = await response.text();
    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      throw new Error(`Settings service returned HTTP ${response.status} without a readable response.`);
    }
    return payload;
  };

  const navigation = () => groups.map(([group, items]) =>
    `<div class="settings-nav-group"><h3>${escape(group)}</h3>${items.map(([id, label]) =>
      `<button type="button" class="settings-nav-link${state.section === id ? " active" : ""}" data-settings-section="${id}"${state.section === id ? ' aria-current="page"' : ""}>${escape(label)}</button>`
    ).join("")}</div>`
  ).join("");

  const settingCard = (title, description, stateValue) =>
    `<div class="settings-status-card"><div><b>${escape(title)}</b><p class="mu">${escape(description)}</p></div>${stateValue ? status(stateValue) : '<span class="bg" style="--c:var(--wa)">Unavailable</span>'}</div>`;

  const renderProfile = () => {
    const profile = state.data?.profile;
    if (!profile) return unavailable("Profile details require an authenticated administrator session.");
    const roles = state.data.roles?.join(", ") || "Administrator";
    return `<div class="settings-content-grid">
      <section class="settings-subcard"><h3>Administrator profile</h3>
        <dl class="settings-detail-list">
          <div><dt>Full name</dt><dd>${escape(profile.fullName || "Not set")}</dd></div>
          <div><dt>Display name</dt><dd>${escape(profile.displayName || "Not set")}</dd></div>
          <div><dt>Email address</dt><dd>${escape(profile.email || "Not available")}</dd></div>
          <div><dt>Phone number</dt><dd>${escape(profile.phone || "Not available")}</dd></div>
          <div><dt>Admin role</dt><dd>${escape(roles)}</dd></div>
          <div><dt>Account status</dt><dd><span class="bg" style="--c:var(--ok)">Active session</span></dd></div>
          <div><dt>Account created</dt><dd>${escape(formatDate(profile.createdAt))}</dd></div>
          <div><dt>Last login</dt><dd>${escape(formatDate(profile.lastLogin))}</dd></div>
          <div><dt>Last profile update</dt><dd>${escape(formatDate(profile.lastProfileUpdate))}</dd></div>
        </dl>
      </section>
      ${unavailable(state.data.unavailable.profileWrites)}
    </div>`;
  };

  const renderSecurity = () => {
    if (!state.data) return unavailable("Security status requires an authenticated administrator session.");
    const security = state.data.security;
    return `<div class="settings-content-grid">
      <section class="settings-subcard"><h3>Security status</h3>
        ${settingCard("Two-factor authentication", security.verifiedTotp ? "A verified authenticator factor is enrolled." : "No verified authenticator factor is enrolled.", security.verifiedTotp ? "operational" : "not_configured")}
        ${settingCard("Current session assurance", "Verified by Supabase Auth for this request.", security.assuranceLevel === "aal2" ? "operational" : "not_configured")}
        ${unavailable("This admin preview does not expose password changes, MFA enrollment, login alerts, session listing, or session revocation. No security action has been simulated.")}
      </section>
      <section class="settings-subcard"><h3>Session controls</h3><p class="mu">Session details are not available from the current authenticated API.</p>${unavailable("Session-management actions are unavailable until an authorized session-management endpoint is implemented.")}</section>
    </div>`;
  };

  const renderPricing = () => {
    const settings = state.data?.websiteSettings;
    const pricing = window.NestGHListingPricing;
    const tieredPrices = pricing
      ? ["room", "hostel", "space"].map(type => {
        const quote = pricing.getListingPricing(type);
        return quote
          ? `<div><dt>${escape(pricing.LISTING_LABELS[type])}</dt><dd>${escape(pricing.formatListingPrice(quote))}</dd></div>`
          : "";
      }).join("")
      : unavailable("The shared listing-pricing configuration is unavailable.");
    const legacySetting = settings
      ? (() => {
        const allowed = !!state.data.permissions?.updateListingFee;
        const price = (settings.listing_fee_pesewas / 100).toFixed(2);
        return `<section class="settings-subcard">
          <h3>Legacy single listing fee</h3>
          <p class="mu">This existing website setting and its MFA-protected update function apply one fee globally. It does not change the type-based frontend prices above and is not used for the new type-based checkout.</p>
          <form id="settings-pricing-form" class="settings-form">
            <label>Legacy listing price
              <div class="settings-price-input"><span>GH₵</span><input class="page-input" name="feeGhs" type="number" min="0.01" max="21474836.47" step="0.01" value="${price}" required${allowed ? "" : " disabled"}></div>
            </label>
            <label>Currency<input class="page-input" value="${escape(settings.currency)}" readonly></label>
            <label>Reason for change<textarea class="page-input" name="reason" rows="3" minlength="3" maxlength="1000" required placeholder="Explain why this legacy listing price is changing."${allowed ? "" : " disabled"}></textarea></label>
            <button class="btn p" type="submit"${allowed && !state.saving ? "" : " disabled"}>${state.saving ? "Saving…" : "Save legacy fee"}</button>
            ${allowed ? "" : '<p class="mu sm">Changing this legacy setting requires an authorized Super Admin/Admin session with verified MFA.</p>'}
          </form>
          <p class="mu sm">Last database update information is not granted by the current schema.</p>
        </section>`;
      })()
      : unavailable("The authenticated settings API did not provide the existing single-fee website_settings record.");
    const checkoutNotice = unavailable("The current payment endpoint validates a single global fee, not these listing-type prices. Type-based checkout stays unavailable until the backend validates the listing type and fee.");
    return `<div class="settings-content-grid">
      <section class="settings-subcard">
        <h3>Type-based listing fees</h3>
        <p class="mu">Read-only preview from the shared frontend pricing configuration used by the owner checkout and admin listing views.</p>
        <dl class="settings-detail-list">${tieredPrices}</dl>
        ${checkoutNotice}
      </section>
      ${legacySetting}
    </div>`;
  };

  const renderLocations = section => {
    const locations = state.data?.locations;
    if (!locations) return unavailable(state.data.unavailable.locations);
    const kind = section === "regions" ? "REGION" : "TOWN";
    const selected = section === "areas" ? locations.filter(item => item.kind === "AREA")
      : locations.filter(item => item.kind === kind);
    const aliases = state.data.locationAliases || [];
    if (section === "areas") {
      const rows = selected.map(area => {
        const town = locations.find(item => item.id === area.parent_id);
        const region = locations.find(item => item.id === town?.parent_id);
        const names = aliases.filter(alias => alias.location_id === area.id).map(alias => alias.alias);
        return `<tr><td>${escape(region?.name || "—")}</td><td>${escape(town?.name || "—")}</td><td><b>${escape(area.name)}</b></td><td>${escape(names.join(", ") || "—")}</td></tr>`;
      }).join("");
      return `<section class="settings-subcard"><h3>Areas & aliases</h3><p class="mu">Read-only data from the existing locations and location_aliases tables.</p>${state.data.locationAliases ? "" : unavailable(state.data.unavailable.locationAliases)}<div class="table-wrap"><table class="t"><thead><tr><th>Region</th><th>Town</th><th>Area</th><th>Aliases</th></tr></thead><tbody>${rows || '<tr><td colspan="4">No area data.</td></tr>'}</tbody></table></div>${unavailable(state.data.unavailable.locationWrites)}</section>`;
    }
    const rows = selected.map(item => {
      const parent = locations.find(value => value.id === item.parent_id);
      return `<tr><td><b>${escape(item.name)}</b></td><td>${escape(parent?.name || "—")}</td><td>${escape(item.slug)}</td></tr>`;
    }).join("");
    return `<section class="settings-subcard"><h3>${sectionName(section)}</h3><p class="mu">Read-only data from the existing locations table.</p><div class="table-wrap"><table class="t"><thead><tr><th>Name</th><th>Parent</th><th>Slug</th></tr></thead><tbody>${rows || '<tr><td colspan="3">No location data.</td></tr>'}</tbody></table></div>${unavailable(state.data.unavailable.locationWrites)}</section>`;
  };

  const renderRoles = () => {
    if (!state.data) return unavailable("Role status requires an authenticated administrator session.");
    return `<section class="settings-subcard"><h3>Your administrator roles</h3><p>${(state.data.roles || []).map(role => `<span class="bg" style="--c:var(--blue)">${escape(role)}</span>`).join(" ") || "No administrator role returned."}</p>${unavailable("The current schema does not grant administrator-role listing or mutation from the settings interface. Role changes are not available.")}</section>`;
  };

  const renderIntegration = section => {
    if (!state.data) return unavailable("Integration status requires the authenticated settings API.");
    const integration = state.data.integrations || {};
    const entries = section === "supabase" ? [["Supabase", integration.supabase], ["Database", integration.database], ["Authentication", integration.authentication], ["Storage", integration.storage]]
      : section === "payment-integration" || section === "paystack" ? [["Paystack credentials", integration.paystack]]
      : section === "email" ? [["Email provider", integration.email]]
      : [["Analytics", "not_configured"]];
    return `<div class="settings-content-grid"><section class="settings-subcard"><h3>${sectionName(section)}</h3>${entries.map(([name, value]) => settingCard(name, name === "Paystack credentials" && value === "configured" ? "Server-side credentials are present; secret values are never returned." : "Status is based on a live authenticated server-side check.", value)).join("")}
      ${section === "paystack" || section === "payment-integration" ? settingCard("Webhook status", "The existing webhook endpoint is deployed; recent webhook events are not available to this UI.", null) : ""}
      ${unavailable("Integration credentials and connection changes are server-managed and cannot be edited from this page.")}
    </section></div>`;
  };

  const renderSystemStatus = () => {
    if (!state.data) return unavailable("System checks require the authenticated settings API.");
    return `<section class="settings-subcard"><h3>Live service checks</h3>
      ${settingCard("Database", "Existing settings record query completed.", state.data.integrations.database)}
      ${settingCard("Authentication", "Supabase verified the current administrator session.", state.data.integrations.authentication)}
      ${settingCard("Storage", "Listing image storage bucket check.", state.data.integrations.storage)}
      ${settingCard("Paystack", "Credential presence only; no secret values are exposed.", state.data.integrations.paystack)}
      ${settingCard("Email", "No email provider is configured in the current server settings.", state.data.integrations.email)}
    </section>`;
  };

  const renderAudit = () => unavailable(state.data?.unavailable.auditLogs || "No audit-log API is available. No historical events are fabricated.");

  const renderCurrentSection = () => {
    if (state.loading) return '<div class="sk"></div><div class="sk"></div>';
    if (state.error && state.section !== "pricing") return `<div class="settings-error"><b>Settings service unavailable</b><p>${escape(state.error)}</p><p class="mu">No changes were saved.</p></div>`;
    switch (state.section) {
      case "profile": return renderProfile();
      case "security":
      case "sessions": return renderSecurity();
      case "pricing": return renderPricing();
      case "regions":
      case "towns":
      case "areas": return renderLocations(state.section);
      case "roles":
      case "admin-users": return renderRoles();
      case "paystack":
      case "payment-integration":
      case "supabase":
      case "email":
      case "analytics": return renderIntegration(state.section);
      case "system-status": return renderSystemStatus();
      case "audit-logs": return renderAudit();
      default: return unavailable(state.data?.unavailable.otherSettings || "No authorized persistent setting or mutation exists for this section.");
    }
  };

  const render = () => `<div class="page-panel settings-page">
    <div class="page-heading"><div><h2>Settings</h2><p class="mu">Account, marketplace, and system configuration.</p></div><span class="bg" style="--c:${state.error ? "var(--wa)" : state.data ? "var(--ok)" : "var(--sl)"}">${state.error ? "Backend unavailable" : state.data ? "Authenticated" : "Checking access"}</span></div>
    <div class="settings-mobile-nav"><label class="vh" for="settings-section-select">Settings section</label><select id="settings-section-select" class="page-input">${groups.map(([group, items]) => `<optgroup label="${escape(group)}">${items.map(([id, label]) => `<option value="${id}"${state.section === id ? " selected" : ""}>${escape(label)}</option>`).join("")}</optgroup>`).join("")}</select></div>
    <div class="settings-layout"><nav class="settings-sidebar" aria-label="Settings sections">${navigation()}</nav>
      <section class="settings-main" aria-live="polite"><div class="settings-section-heading"><h2>${escape(sectionName(state.section))}</h2><p class="mu">${state.section === "pricing" ? "Marketplace listing fee" : "Settings are loaded from authorized server capabilities."}</p></div>${renderCurrentSection()}</section>
    </div>
  </div>`;

  const refresh = async () => {
    state.loading = true;
    state.error = "";
    const container = document.querySelector("#page-view");
    if (container && !container.hidden) container.innerHTML = render();
    try {
      const response = await fetch("/api/admin/settings", {
        method: "GET",
        credentials: "same-origin",
        headers: { Accept: "application/json" },
        cache: "no-store"
      });
      const payload = await responsePayload(response);
      if (!response.ok) throw new Error(payload.error || `Settings request failed (${response.status}).`);
      state.data = payload;
    } catch (error) {
      state.data = null;
      state.error = error instanceof Error
        ? error.message
        : "Unable to reach the authenticated settings service.";
    } finally {
      state.loading = false;
      if (container && !container.hidden) container.innerHTML = render();
    }
  };

  const savePricing = async form => {
    const data = new FormData(form);
    state.saving = true;
    const container = document.querySelector("#page-view");
    if (container) container.innerHTML = render();
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          action: "update_listing_fee",
          feeGhs: data.get("feeGhs"),
          reason: data.get("reason")
        })
      });
      const payload = await responsePayload(response);
      if (!response.ok || payload.saved !== true) throw new Error(payload.error || "The database did not confirm this pricing update.");
      await refresh();
      window.dispatchEvent(new CustomEvent("nestgh-admin-toast", { detail: "Listing pricing was saved to the database." }));
    } catch (error) {
      state.error = error instanceof Error ? error.message : "The pricing update failed.";
      if (container && !container.hidden) container.innerHTML = render();
    } finally {
      state.saving = false;
      if (container && !container.hidden) container.innerHTML = render();
    }
  };

  const container = document.querySelector("#page-view");
  container?.addEventListener("click", event => {
    const link = event.target.closest("[data-settings-section]");
    if (!link) return;
    state.section = link.dataset.settingsSection;
    container.innerHTML = render();
  });
  container?.addEventListener("change", event => {
    if (event.target.id !== "settings-section-select") return;
    state.section = event.target.value;
    container.innerHTML = render();
  });
  container?.addEventListener("submit", event => {
    if (event.target.id !== "settings-pricing-form") return;
    event.preventDefault();
    void savePricing(event.target);
  });
  window.addEventListener("nestgh-admin-toast", event => {
    const toast = document.querySelector("#toast");
    if (!toast) return;
    toast.textContent = event.detail;
    toast.classList.add("on");
    setTimeout(() => toast.classList.remove("on"), 2600);
  });

  window.NestGHSettings = { render, refresh };
})();
