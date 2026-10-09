(function registerCommercialListings(root, createApi) {
  const api = createApi();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.NestGHCommercial = api;
})(typeof globalThis === "undefined" ? this : globalThis, function createApi() {
  /**
   * A commercial record is published in public_listings.public_data with
   * category "commercial" and the same property fields consumed below.
   * Numeric fields are stored as numbers and feature availability as booleans.
   * @typedef {Object} CommercialListing
   * @property {string} id
   * @property {string} title
   * @property {"commercial"} category
   * @property {string} type
   * @property {string|null} location
   * @property {number|null} rent
   * @property {number|null} advance
   * @property {number|null} size
   * @property {string|null} sizeUnit
   * @property {boolean|string|null} roadVisibility
   * @property {boolean|string|null} parking
   * @property {boolean|string|null} electricity
   * @property {boolean|string|null} water
   * @property {number|null} estimatedMoveInCost
   * @property {string|null} availability
   * @property {string[]} images
   * @property {string|null} description
   */
  const TYPES = Object.freeze([
    "Shop",
    "Store",
    "Office",
    "Showroom",
    "Warehouse",
    "Salon",
    "Restaurant",
    "Commercial Space",
    "Other",
  ]);
  const PAGE_SIZE = 24;

  function optionalText(value) {
    return typeof value === "string" && value.trim() ? value.trim() : null;
  }

  function optionalNumber(value) {
    if (value === null || value === undefined || value === "") return null;
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : null;
  }

  function optionalBoolean(value) {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return null;
  }

  function optionalFacet(value) {
    return typeof value === "boolean" ? value : optionalText(value);
  }

  function safeImagePath(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    const path = value.trim();
    if (path.startsWith("/") && !path.startsWith("//") && !path.includes("\\")) {
      return path;
    }
    try {
      const url = new URL(path);
      return url.protocol === "https:" ? url.href : null;
    } catch {
      return null;
    }
  }

  function normalize(row) {
    const data = row && row.public_data;
    if (!data || !["commercial", "shops_spaces"].includes(data.category)) {
      return null;
    }
    const id = optionalText(row.id);
    const title = optionalText(data.title);
    const type = optionalText(data.type);
    if (!id || !title || !type) return null;

    const location = optionalText(data.location);
    const images = Array.isArray(data.images)
      ? data.images.map(safeImagePath).filter(Boolean)
      : Array.isArray(data.photos)
        ? data.photos.map(safeImagePath).filter(Boolean)
        : [];

    return Object.freeze({
      id,
      title,
      category: "commercial",
      type,
      location,
      rent: optionalNumber(data.rent),
      advance: optionalNumber(data.advance),
      size: optionalNumber(data.size),
      sizeUnit: optionalText(data.sizeUnit),
      roadVisibility: optionalFacet(data.roadVisibility),
      parking: optionalFacet(data.parking),
      electricity: optionalFacet(data.electricity),
      water: optionalFacet(data.water),
      estimatedMoveInCost: optionalNumber(data.estimatedMoveInCost),
      availability: optionalText(data.availability),
      images: Object.freeze(images),
      description: optionalText(data.description),
      phone: optionalText(data.phone),
      whatsapp: optionalText(data.whatsapp),
    });
  }

  function readFilters(form) {
    const values = new FormData(form);
    const number = (key) => optionalNumber(values.get(key));
    const triState = (key) => optionalBoolean(values.get(key));
    return Object.freeze({
      location: optionalText(values.get("location")),
      region: optionalText(values.get("region")),
      town: optionalText(values.get("town")),
      minRent: number("minRent"),
      maxRent: number("maxRent"),
      type: optionalText(values.get("type")),
      minSize: number("minSize"),
      maxSize: number("maxSize"),
      roadVisibility: triState("roadVisibility"),
      parking: triState("parking"),
      electricity: triState("electricity"),
      water: triState("water"),
    });
  }

  /** Fetches one page of LIVE commercial listings from the NestGH API (MySQL). */
  async function queryPage(filters, offset = 0) {
    const params = new URLSearchParams({
      category: "commercial",
      offset: String(Math.max(0, Math.trunc(offset))),
      limit: String(PAGE_SIZE),
    });
    for (const [key, value] of Object.entries(filters || {})) {
      if (value !== null && value !== undefined && value !== "") params.set(key, String(value));
    }
    try {
      const response = await fetch("/api/listings?" + params, { credentials: "same-origin" });
      const body = await response.json().catch(() => null);
      if (!response.ok) return { data: null, error: new Error(body?.error || "Request failed (" + response.status + ").") };
      return { data: Array.isArray(body?.rows) ? body.rows : [], error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(
      /[&<>"']/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[character],
    );
  }

  function formatCedi(amount) {
    if (typeof amount !== "number" || !Number.isFinite(amount)) return "";
    return `GH₵ ${amount.toLocaleString("en-GH")}`;
  }

  function renderCard(listing, { saved, icon, saveIcon }) {
    const image = listing.images[0]
      ? `<img src="${escapeHtml(listing.images[0])}" alt="${escapeHtml(listing.title)}" loading="lazy" decoding="async">`
      : `<div class="commercial-placeholder" role="img" aria-label="No property image provided">${icon}</div>`;
    const facts = [
      listing.size !== null
        ? `<span>${escapeHtml(`${listing.size}${listing.sizeUnit ? ` ${listing.sizeUnit}` : ""}`)}</span>`
        : "",
      listing.roadVisibility !== null
        ? `<span>${escapeHtml(
            typeof listing.roadVisibility === "boolean"
              ? listing.roadVisibility
                ? "Road visible"
                : "Not road visible"
              : listing.roadVisibility,
          )}</span>`
        : "",
      listing.parking !== null
        ? `<span>${escapeHtml(
            typeof listing.parking === "boolean"
              ? listing.parking
                ? "Parking"
                : "No parking"
              : listing.parking,
          )}</span>`
        : "",
      listing.electricity !== null
        ? `<span>${escapeHtml(
            typeof listing.electricity === "boolean"
              ? listing.electricity
                ? "Electricity"
                : "No electricity"
              : listing.electricity,
          )}</span>`
        : "",
      listing.water !== null
        ? `<span>${escapeHtml(
            typeof listing.water === "boolean"
              ? listing.water
                ? "Water"
                : "No water"
              : listing.water,
          )}</span>`
        : "",
    ].filter(Boolean);
    return `<article class="commercial-card" data-commercial-id="${escapeHtml(listing.id)}">
      <div class="commercial-image">${image}<span class="commercial-type">${escapeHtml(listing.type)}</span>
        <button class="hb commercial-save" type="button" data-commercial-save="${escapeHtml(listing.id)}" aria-label="${saved ? "Remove saved space" : "Save space"}" aria-pressed="${saved}"><span aria-hidden="true">${saveIcon}</span></button>
      </div>
      <div class="commercial-card-body">
        <h3>${escapeHtml(listing.title)}</h3>
        ${listing.location ? `<p class="commercial-location">${icon}<span>${escapeHtml(listing.location)}</span></p>` : ""}
        ${facts.length ? `<div class="commercial-facts">${facts.join("")}</div>` : ""}
        <div class="commercial-pricing">
          ${listing.rent !== null ? `<p class="commercial-rent"><b>${formatCedi(listing.rent)}</b><span>/ month</span></p>` : ""}
          ${listing.advance !== null ? `<p><span>Advance</span><b>${formatCedi(listing.advance)}</b></p>` : ""}
          ${listing.estimatedMoveInCost !== null ? `<p class="commercial-move-in"><span>Estimated move-in cost</span><b>${formatCedi(listing.estimatedMoveInCost)}</b></p>` : ""}
        </div>
        ${listing.availability ? `<p class="commercial-availability"><span class="availability-dot" aria-hidden="true"></span>${escapeHtml(listing.availability)}</p>` : ""}
        <button class="btn commercial-details-button" type="button" data-commercial-details="${escapeHtml(listing.id)}">View Details</button>
      </div>
    </article>`;
  }

  function renderDetails(listing, { icon, interestUrl, callUrl }) {
    const images = listing.images.length
      ? `<div class="commercial-gallery">${listing.images
          .map(
            (image, index) =>
              `<img src="${escapeHtml(image)}" alt="${escapeHtml(listing.title)} photo ${index + 1}" loading="lazy" decoding="async">`,
          )
          .join("")}</div>`
      : `<div class="commercial-placeholder commercial-details-placeholder" role="img" aria-label="No property images provided">${icon}<span>No property images provided</span></div>`;
    const rows = [
      ["Space type", listing.type],
      ["Monthly rent", listing.rent === null ? null : `${formatCedi(listing.rent)} / month`],
      ["Advance", listing.advance === null ? null : formatCedi(listing.advance)],
      ["Size", listing.size === null ? null : `${listing.size}${listing.sizeUnit ? ` ${listing.sizeUnit}` : ""}`],
      ["Road visibility", listing.roadVisibility === null ? null : typeof listing.roadVisibility === "boolean" ? listing.roadVisibility ? "Yes" : "No" : listing.roadVisibility],
      ["Parking", listing.parking === null ? null : typeof listing.parking === "boolean" ? listing.parking ? "Available" : "Not available" : listing.parking],
      ["Electricity", listing.electricity === null ? null : typeof listing.electricity === "boolean" ? listing.electricity ? "Available" : "Not available" : listing.electricity],
      ["Water", listing.water === null ? null : typeof listing.water === "boolean" ? listing.water ? "Available" : "Not available" : listing.water],
      ["Estimated move-in cost", listing.estimatedMoveInCost === null ? null : formatCedi(listing.estimatedMoveInCost)],
      ["Availability", listing.availability],
    ].filter(([, value]) => value !== null);
    const features = [
      ["Road visibility", listing.roadVisibility],
      ["Parking", listing.parking],
      ["Electricity", listing.electricity],
      ["Water", listing.water],
    ].filter(([, value]) => value !== null);
    const formatFeature = (value) =>
      typeof value === "boolean" ? (value ? "Available" : "Not available") : value;
    const location = listing.location
      ? `<p class="property-summary-location">${icon}<span>${escapeHtml(listing.location)}</span></p>`
      : "";
    const contact = interestUrl
      ? `<a class="btn wa" href="${escapeHtml(interestUrl)}" target="_blank" rel="noopener">Contact Owner</a>`
      : "";
    const call = callUrl
      ? `<a class="btn2 commercial-call" href="${escapeHtml(callUrl)}">Call owner</a>`
      : "";
    return `<div class="sp commercial-detail property-details" role="dialog" aria-modal="true" aria-label="${escapeHtml(`Property details: ${listing.title}`)}">
      <button class="x" id="cx" aria-label="Close">Close ✕</button>
      <header class="property-details-heading"><span class="property-details-mark">${icon}</span><div><h2>Property Details</h2><p>Everything you need to know before you contact.</p></div></header>
      <section class="property-summary">
        <div class="property-summary-image">${listing.images[0] ? `<img src="${escapeHtml(listing.images[0])}" alt="${escapeHtml(listing.title)}" decoding="async">` : `<div class="commercial-placeholder" role="img" aria-label="No property image provided">${icon}</div>`}${listing.images.length > 1 ? `<span class="property-photo-count">${listing.images.length} photos</span>` : ""}</div>
        <div class="property-summary-copy">
          <span class="property-kind">${escapeHtml(listing.type)}</span>
          <h3 class="sn">${escapeHtml(listing.title)}</h3>
          ${location}
          ${listing.rent !== null ? `<p class="property-summary-rent">${formatCedi(listing.rent)} <span>/month</span></p>` : ""}
          ${listing.estimatedMoveInCost !== null ? `<p class="property-move-in">Estimated move-in cost <b>${formatCedi(listing.estimatedMoveInCost)}</b></p>` : ""}
          <div class="property-quick-facts">${listing.size !== null ? `<span>${escapeHtml(`${listing.size}${listing.sizeUnit ? ` ${listing.sizeUnit}` : ""}`)}</span>` : ""}${listing.availability ? `<span class="property-availability">${escapeHtml(listing.availability)}</span>` : ""}</div>
        </div>
      </section>
      <div class="property-tabs" role="tablist" aria-label="Property information">
        <button type="button" class="property-tab is-active" id="property-tab-overview" role="tab" aria-selected="true" aria-controls="property-panel-overview" data-property-tab="overview">Overview</button>
        <button type="button" class="property-tab" id="property-tab-facilities" role="tab" aria-selected="false" aria-controls="property-panel-facilities" data-property-tab="facilities">Facilities</button>
        <button type="button" class="property-tab" id="property-tab-location" role="tab" aria-selected="false" aria-controls="property-panel-location" data-property-tab="location">Location</button>
      </div>
      <section class="property-panel" id="property-panel-overview" role="tabpanel" aria-labelledby="property-tab-overview" data-property-panel="overview">
        ${listing.description ? `<h4>Description</h4><p class="property-description">${escapeHtml(listing.description)}</p>` : ""}
        ${rows.length ? `<h4>Property details</h4><div class="kv">${rows.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b></div>`).join("")}</div>` : ""}
      </section>
      <section class="property-panel" id="property-panel-facilities" role="tabpanel" aria-labelledby="property-tab-facilities" data-property-panel="facilities" hidden>
        ${features.length ? `<h4>Property features</h4><div class="property-feature-grid">${features.map(([label, value]) => `<div><span>${icon}</span><b>${escapeHtml(label)}</b><small>${escapeHtml(formatFeature(value))}</small></div>`).join("")}</div>` : '<p class="property-description">No facility details have been provided.</p>'}
        ${listing.images.length > 1 ? `<h4>Photos</h4>${images}` : ""}
      </section>
      <section class="property-panel" id="property-panel-location" role="tabpanel" aria-labelledby="property-tab-location" data-property-panel="location" hidden>
        ${location ? `<h4>Location</h4>${location}` : '<p class="property-description">No location details have been provided.</p>'}
        ${listing.location ? `<a class="mp" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.location)}">Open area in Maps</a>` : ""}
      </section>
      ${contact || call ? `<section class="property-contact"><div><b>Property owner</b><span>Contact the listing owner directly.</span></div><div class="property-contact-actions">${contact}${call}</div></section>` : ""}
    </div>`;
  }

  return Object.freeze({
    TYPES,
    PAGE_SIZE,
    normalize,
    readFilters,
    queryPage,
    formatCedi,
    renderCard,
    renderDetails,
  });
});
