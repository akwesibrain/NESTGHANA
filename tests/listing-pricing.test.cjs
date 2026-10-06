const test = require("node:test");
const assert = require("node:assert/strict");
const pricing = require("../listing-pricing.js");

test("returns the configured fee and currency for each listing type", () => {
  assert.deepEqual(pricing.getListingPricing("Room"), {
    listingType: "room",
    listingFee: 30,
    currency: "GHS",
  });
  assert.deepEqual(pricing.getListingPricing("HOSTEL"), {
    listingType: "hostel",
    listingFee: 35,
    currency: "GHS",
  });
  assert.deepEqual(pricing.getListingPricing("space"), {
    listingType: "space",
    listingFee: 40,
    currency: "GHS",
  });
});

test("derives the listing type from the existing owner form fields", () => {
  assert.equal(
    pricing.getListingType({ category: "rooms", type: "Single Room" }),
    "room",
  );
  assert.equal(
    pricing.getListingType({ category: "rooms", type: "Student Hostel" }),
    "hostel",
  );
  assert.equal(
    pricing.getListingType({ category: "commercial", type: "Shop" }),
    "space",
  );
  assert.equal(
    pricing.getListingType({ category: "commercial", type: "Other" }),
    "space",
  );
});

test("normalizes existing residential and commercial property type labels", () => {
  for (const type of [
    "Single Room",
    "Chamber & Hall",
    "Self-Contained",
    "1-in-a-Room",
    "2-in-a-Room",
    "4-in-a-Room",
    "Apartment",
    "House",
  ]) {
    assert.equal(pricing.getListingType(type), "room", type);
  }
  for (const type of [
    "Shop",
    "Store",
    "Office",
    "Showroom",
    "Warehouse",
    "Salon",
    "Restaurant",
    "Commercial Space",
  ]) {
    assert.equal(pricing.getListingType(type), "space", type);
  }
});

test("does not assign a fee to an unknown or incomplete listing type", () => {
  assert.equal(pricing.getListingType(""), null);
  assert.equal(pricing.getListingType("Other"), null);
  assert.equal(pricing.getListingPricing({ category: "rooms" }), null);
  assert.equal(
    pricing.getListingPricing({ listingType: "unknown", category: "commercial" }),
    null,
  );
  assert.equal(pricing.getListingPrice("unrecognized"), null);
  assert.equal(pricing.formatListingPrice("unrecognized"), "Not available");
});

test("formats owner-facing fees as Ghana cedi amounts", () => {
  assert.equal(pricing.formatListingPrice("room"), "GH₵30");
  assert.equal(pricing.formatListingPrice("hostel"), "GH₵35");
  assert.equal(pricing.formatListingPrice("space"), "GH₵40");
});
