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

  function queryPage(client, filters, offset = 0) {
    let query = client
      .from("public_listings")
      .select("id,public_data,created_at")
      .contains("public_data", { category: "commercial" })
      .order("created_at", { ascending: false })
      .order("id", { ascending: true });

    if (filters.location) {
      query = query.ilike("public_data->>location", `%${filters.location}%`);
    }
    if (filters.type) query = query.eq("public_data->>type", filters.type);
    if (filters.minRent !== null) {
      query = query.gte("public_data->rent", filters.minRent);
    }
    if (filters.maxRent !== null) {
      query = query.lte("public_data->rent", filters.maxRent);
    }
    if (filters.minSize !== null) {
      query = query.gte("public_data->size", filters.minSize);
    }
    if (filters.maxSize !== null) {
      query = query.lte("public_data->size", filters.maxSize);
    }
    for (const field of ["roadVisibility", "parking", "electricity", "water"]) {
      if (filters[field] !== null) {
        query = query.eq(`public_data->${field}`, filters[field]);
      }
    }
    const start = Math.max(0, Math.trunc(offset));
    return query.range(start, start + PAGE_SIZE - 1);
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
    const contact = interestUrl
      ? `<a class="btn wa" href="${escapeHtml(interestUrl)}" target="_blank" rel="noopener">Contact about this space</a>`
      : "";
    const call = callUrl
      ? `<a class="btn2 commercial-call" href="${escapeHtml(callUrl)}">Call owner</a>`
      : "";
    return `<div class="sp commercial-detail" role="dialog" aria-modal="true" aria-label="${escapeHtml(listing.title)}">
      <button class="x" id="cx" aria-label="Close">Close ✕</button>
      ${images}
      <h2 class="sn">${escapeHtml(listing.title)}</h2>
      ${listing.location ? `<p class="commercial-location">${icon}<span>${escapeHtml(listing.location)}</span></p>` : ""}
      ${listing.availability ? `<p class="commercial-availability"><span class="availability-dot" aria-hidden="true"></span>${escapeHtml(listing.availability)}</p>` : ""}
      ${rows.length ? `<h3>Space details</h3><div class="kv">${rows.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b></div>`).join("")}</div>` : ""}
      ${listing.description ? `<h3>Description</h3><p class="commercial-description">${escapeHtml(listing.description)}</p>` : ""}
      ${contact || call ? `<div class="commercial-contact">${contact}${call}</div>` : ""}
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
