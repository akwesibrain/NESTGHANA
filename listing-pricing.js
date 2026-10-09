(function registerListingPricing(root, createApi) {
  const api = createApi();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.NestGHListingPricing = api;
})(typeof globalThis === "undefined" ? this : globalThis, function createApi() {
  const LISTING_PRICES = Object.freeze({
    room: 30,
    hostel: 35,
    space: 40,
  });
  // Defaults; the live fees are loaded from /api/settings (admin-editable) via setListingPrices.
  let currentPrices = { ...LISTING_PRICES };
  const LISTING_LABELS = Object.freeze({
    room: "Room",
    hostel: "Hostel",
    space: "Space",
  });
  const ROOM_TYPES = new Set([
    "room",
    "rooms",
    "single room",
    "chamber and hall",
    "self contained",
    "1 in a room",
    "2 in a room",
    "4 in a room",
    "apartment",
    "house",
  ]);
  const SPACE_TYPES = new Set([
    "commercial",
    "commercial space",
    "office",
    "other commercial space",
    "restaurant",
    "salon",
    "shop",
    "showroom",
    "space",
    "store",
    "warehouse",
  ]);

  const normalize = value =>
    typeof value === "string"
      ? value.trim().toLowerCase().replace(/&/g, "and").replace(/[-_]/g, " ").replace(/\s+/g, " ")
      : "";

  function getListingType(value) {
    if (typeof value === "string") {
      const type = normalize(value);
      if (type === "room" || type === "rooms") return "room";
      if (type.includes("hostel")) return "hostel";
      if (ROOM_TYPES.has(type)) return "room";
      if (SPACE_TYPES.has(type) || /\b(shop|store|office|showroom|warehouse|salon|restaurant)\b/.test(type)) {
        return "space";
      }
      return null;
    }

    if (!value || typeof value !== "object") return null;
    if (value.listingType !== null && value.listingType !== undefined) {
      const explicitType = normalize(value.listingType);
      if (explicitType === "room" || explicitType === "hostel" || explicitType === "space") {
        return explicitType;
      }
      return null;
    }

    const category = normalize(value.category);
    if (category === "commercial" || category === "shops and spaces" || category === "shops and spaces to let") {
      return "space";
    }
    if (category === "hostel") return "hostel";
    if (category === "room" || category === "rooms") {
      const propertyType = getListingType(value.type || value.propertyType || value.otherType);
      return propertyType === "hostel" ? "hostel" : propertyType === "room" ? "room" : null;
    }
    if (category === "space") return "space";

    return getListingType(value.type || value.propertyType || value.otherType);
  }

  function getListingPrice(value) {
    const listingType = getListingType(value);
    return listingType ? currentPrices[listingType] : null;
  }

  function getListingPricing(value) {
    const listingType = getListingType(value);
    if (!listingType) return null;
    return Object.freeze({
      listingType,
      listingFee: currentPrices[listingType],
      currency: "GHS",
    });
  }

  function formatListingPrice(value) {
    const pricing =
      value && typeof value === "object" && Number.isFinite(value.listingFee)
        ? value
        : getListingPricing(value);
    if (!pricing || pricing.currency !== "GHS") return "Not available";
    const amount = new Intl.NumberFormat("en-GH", {
      maximumFractionDigits: 2,
    }).format(pricing.listingFee);
    return `GH₵${amount}`;
  }

  /** Replaces the fees (in cedis) with the server's current values; invalid input is ignored. */
  function setListingPrices(prices) {
    if (!prices || typeof prices !== "object") return false;
    const next = {};
    for (const type of Object.keys(LISTING_PRICES)) {
      const fee = Number(prices[type]);
      if (!Number.isFinite(fee) || fee <= 0) return false;
      next[type] = fee;
    }
    currentPrices = next;
    return true;
  }

  return Object.freeze({
    LISTING_PRICES,
    setListingPrices,
    LISTING_LABELS,
    formatListingPrice,
    getListingPrice,
    getListingPricing,
    getListingType,
  });
});
