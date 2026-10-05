// Integration test for the MySQL schema guards and the listing lifecycle.
// Run with `npm run test:db`: it builds a throwaway `nestghana_test` database, applies the
// migrations, runs these tests, and drops the database again (see scripts/test-db.mjs).
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/server/db";
import { transitionListing, TransitionError } from "@/lib/server/listing-status";
import { CONTACT_CONSENT_KEY, listPublicListings } from "@/lib/server/public-listings";

const db = getDb();
let areaId = "";
let adminId = "";
let ownerId = "";

before(async () => {
  const region = await db.location.create({ data: { kind: "REGION", name: "Greater Accra", slug: "greater-accra", path: "greater-accra" } });
  const town = await db.location.create({ data: { kind: "TOWN", parentId: region.id, name: "Tema", slug: "tema", path: "greater-accra/tema" } });
  const area = await db.location.create({ data: { kind: "AREA", parentId: town.id, name: "Community 20", slug: "community-20", path: "greater-accra/tema/community-20" } });
  areaId = area.id;
  const admin = await db.adminUser.create({
    data: { email: "moderator@test.local", passwordHash: "x", roles: { create: { role: "MODERATOR" } } },
  });
  adminId = admin.id;
  const owner = await db.owner.create({
    data: { fullName: "Ama Owner", phoneE164: "+233241234567", whatsappE164: "+233241234567", email: "ama@test.local", relationship: "Property owner" },
  });
  ownerId = owner.id;
});

after(() => db.$disconnect());

const DESCRIPTION =
  "A bright space with good access, close to transport, shops and the main road, available to rent right away. ".repeat(2);

function consent(contactDisplay: boolean) {
  return {
    create: {
      privacyPolicyVersion: "2026-10-01",
      termsVersion: "2026-10-01",
      checkboxValues: { [CONTACT_CONSENT_KEY]: contactDisplay },
      consentedAt: new Date(),
    },
  };
}

function newListing({ contactDisplay = true } = {}) {
  return db.listing.create({
    data: {
      submissionId: randomUUID(),
      ownerId,
      areaId,
      title: "Self-contained room near the market",
      description: DESCRIPTION,
      roomType: "SELF_CONTAINED",
      condition: "GOOD",
      furnished: "UNFURNISHED",
      unitsTotal: 2,
      bedrooms: 1,
      rentAmountPesewas: 80000,
      rentPeriod: "MONTH",
      advancePayments: 6,
      facilities: { selections: { Water: "Included" }, other: "Backup generator", bath: "Private" },
      rules: { pets: "No" },
      landmark: "Behind the Community 20 market",
      availabilityDate: new Date("2026-01-01"),
      unitsAvailable: 1,
      private: { create: { exactAddress: "House 12, Secret Street", moderationNotes: "internal note" } },
      consents: consent(contactDisplay),
    },
  });
}

function newShop(overrides: { sizeSqm?: number; parking?: boolean; rentAmountPesewas?: number } = {}) {
  return db.listing.create({
    data: {
      submissionId: randomUUID(),
      propertyCategory: "COMMERCIAL",
      ownerId,
      areaId,
      title: "Roadside shop near the market",
      description: DESCRIPTION,
      roomType: "SHOP",
      condition: "GOOD",
      furnished: "NOT_APPLICABLE",
      unitsTotal: 1,
      rentAmountPesewas: overrides.rentAmountPesewas ?? 150000,
      rentPeriod: "MONTH",
      advancePayments: 0,
      advanceAmountPesewas: 900000,
      sizeSqm: overrides.sizeSqm ?? 24,
      roadVisibility: true,
      parking: overrides.parking ?? true,
      electricity: true,
      water: false,
      estimatedMoveInCostPesewas: 1050000,
      facilities: {},
      rules: {},
      availabilityDate: new Date("2026-01-01"),
      unitsAvailable: 1,
      consents: consent(true),
    },
  });
}

/** Takes a new listing all the way to LIVE through the real transition function. */
async function publish(listingId: string) {
  await transitionListing({ listingId, to: "PAYMENT_PENDING", actorType: "SYSTEM", actorId: null, source: "validated_submission" });
  await payFor(listingId);
  await transitionListing({ listingId, to: "PENDING_APPROVAL", actorType: "SYSTEM", actorId: null, source: "verified_payment" });
  await transitionListing({ listingId, to: "LIVE", actorType: "ADMIN", actorId: adminId, source: "admin_review" });
}

async function payFor(listingId: string) {
  await db.payment.create({
    data: {
      listingId,
      paidListingId: listingId,
      reference: `NGH-${randomUUID().replace(/-/g, "").toUpperCase()}`,
      amountPesewas: 3000,
      currency: "GHS",
      status: "PAID",
      paidAt: new Date(),
    },
  });
}

test("listings must start as DRAFT", async () => {
  const listing = await newListing();
  assert.equal(listing.status, "DRAFT");
  await assert.rejects(
    db.$executeRaw`INSERT INTO listings (id, submission_id, status, owner_id, area_id, title, description, room_type, \`condition\`, furnished, units_total, bedrooms, rent_amount_pesewas, rent_period, advance_payments, facilities, rules, availability_date, units_available, updated_at)
      SELECT UUID(), UUID(), 'LIVE', owner_id, area_id, title, description, room_type, \`condition\`, furnished, units_total, bedrooms, rent_amount_pesewas, rent_period, advance_payments, facilities, rules, availability_date, units_available, NOW(3) FROM listings WHERE id = ${listing.id}`,
    /must begin in DRAFT/,
  );
});

test("status cannot be changed by a plain UPDATE", async () => {
  const listing = await newListing();
  await assert.rejects(
    db.listing.update({ where: { id: listing.id }, data: { status: "PAYMENT_PENDING" } }),
    /approved transition function/,
  );
});

test("full lifecycle: draft → payment → approval → live, visible publicly without private data", async () => {
  const listing = await newListing();
  await transitionListing({ listingId: listing.id, to: "PAYMENT_PENDING", actorType: "SYSTEM", actorId: null, source: "validated_submission" });

  // Cannot skip payment.
  await assert.rejects(
    transitionListing({ listingId: listing.id, to: "PENDING_APPROVAL", actorType: "OWNER", actorId: null, source: "owner_manage" }),
    TransitionError,
  );

  await payFor(listing.id);
  await transitionListing({ listingId: listing.id, to: "PENDING_APPROVAL", actorType: "SYSTEM", actorId: null, source: "verified_payment" });

  // Only an admin can publish.
  await assert.rejects(
    transitionListing({ listingId: listing.id, to: "LIVE", actorType: "SYSTEM", actorId: null, source: "verified_payment" }),
    TransitionError,
  );
  await transitionListing({ listingId: listing.id, to: "LIVE", actorType: "ADMIN", actorId: adminId, source: "admin_review" });

  const live = await db.listing.findUniqueOrThrow({ where: { id: listing.id } });
  assert.equal(live.status, "LIVE");
  assert.equal(live.approvedById, adminId);

  const history = await db.listingStatusHistory.findMany({ where: { listingId: listing.id }, orderBy: { createdAt: "asc" } });
  assert.deepEqual(history.map(h => h.newStatus), ["PAYMENT_PENDING", "PENDING_APPROVAL", "LIVE"]);
  assert.equal(await db.adminActivityLog.count({ where: { resourceId: listing.id } }), 1);

  const rows = await listPublicListings("room", 0, 50);
  const row = rows.find(r => r.id === listing.id);
  assert.ok(row, "LIVE listing is public");
  assert.equal(row.category, "ROOM");
  const data = row.public_data as Record<string, unknown>;
  assert.equal(data.town, "Tema");
  assert.equal(data.area, "Community 20");
  assert.equal(data.region, "Greater Accra");
  assert.equal(data.rent, 800);
  assert.equal(data.period, "Monthly");
  assert.equal(data.phone, "+233241234567");
  assert.deepEqual(data.m, { Water: "Included" });
  assert.equal(data.facOther, "Backup generator");
  assert.ok(!(await listPublicListings("commercial", 0, 50)).some(r => r.id === listing.id), "rooms are not in Shops & Spaces");
  const serialized = JSON.stringify(row);
  assert.ok(!serialized.includes("Secret Street"), "exact address stays private");
  assert.ok(!serialized.includes("internal note"), "moderation notes stay private");
  assert.ok(!serialized.includes("ama@test.local"), "owner email stays private");
});

test("listings without contact-display consent are not public", async () => {
  const listing = await newListing({ contactDisplay: false });
  await publish(listing.id);
  assert.ok(!(await listPublicListings("room", 0, 50)).some(r => r.id === listing.id));
});

test("commercial listings: public shape and filters", async () => {
  const small = await newShop({ sizeSqm: 12, parking: false, rentAmountPesewas: 50000 });
  const large = await newShop({ sizeSqm: 80, parking: true, rentAmountPesewas: 400000 });
  await publish(small.id);
  await publish(large.id);
  const ids = async (filters: Parameters<typeof listPublicListings>[3]) =>
    (await listPublicListings("commercial", 0, 50, filters)).map(r => r.id).sort();

  const [row] = (await listPublicListings("commercial", 0, 50)).filter(r => r.id === large.id);
  assert.ok(row);
  const data = row.public_data as Record<string, unknown>;
  assert.equal(data.category, "commercial");
  assert.equal(data.type, "Shop");
  assert.equal(data.location, "Tema, Community 20");
  assert.equal(data.rent, 4000);
  assert.equal(data.advance, 9000);
  assert.equal(data.size, 80);
  assert.equal(data.parking, true);
  assert.equal(data.estimatedMoveInCost, 10500);
  assert.equal(data.whatsapp, "+233241234567");

  assert.deepEqual(await ids({ minSize: 50 }), [large.id]);
  assert.deepEqual(await ids({ parking: false }), [small.id]);
  assert.deepEqual(await ids({ maxRent: 1000 }), [small.id]);
  assert.deepEqual(await ids({ town: "Tema", region: "Greater Accra", type: "Shop" }), [small.id, large.id].sort());
  assert.deepEqual(await ids({ location: "community" }), [small.id, large.id].sort());
  assert.deepEqual(await ids({ town: "Kumasi" }), []);
  assert.deepEqual(await ids({ type: "Office" }), []);
});

test("rooms and commercial listings only carry their own fields", async () => {
  // A room cannot have commercial fields.
  await assert.rejects(
    db.listing.update({ where: { id: (await newListing()).id }, data: { parking: true } }),
  );
  // A commercial listing needs all its fields and a commercial type.
  await assert.rejects(newShop().then(shop => db.listing.update({ where: { id: shop.id }, data: { sizeSqm: null } })));
  await assert.rejects(newShop().then(shop => db.listing.update({ where: { id: shop.id }, data: { roomType: "SINGLE_ROOM" } })));
});

test("non-LIVE listings are not public", async () => {
  const listing = await newListing();
  const rows = await listPublicListings("room", 0, 50);
  assert.ok(!rows.some(r => r.id === listing.id));
});

test("a listing can have only one PAID payment", async () => {
  const listing = await newListing();
  await payFor(listing.id);
  await assert.rejects(payFor(listing.id));
});

test("PAID marker must match status", async () => {
  const listing = await newListing();
  await assert.rejects(
    db.payment.create({
      data: { listingId: listing.id, reference: `NGH-${"A".repeat(24)}`, amountPesewas: 3000, currency: "GHS", status: "PAID", paidAt: new Date() },
    }),
  );
});

test("audit history is append-only", async () => {
  const entry = await db.listingStatusHistory.findFirstOrThrow();
  await assert.rejects(db.listingStatusHistory.update({ where: { id: entry.id }, data: { reason: "edited" } }), /append-only/);
  await assert.rejects(db.listingStatusHistory.delete({ where: { id: entry.id } }), /append-only/);
});

test("check constraints reject invalid data", async () => {
  await assert.rejects(
    db.owner.create({ data: { fullName: "Bad Phone", phoneE164: "0241234567", whatsappE164: "+233241234567", email: "x@test.local", relationship: "Owner" } }),
  );
  const region = await db.location.findFirstOrThrow({ where: { kind: "REGION" } });
  await assert.rejects(
    db.location.create({ data: { kind: "AREA", parentId: region.id, name: "Bad", slug: "bad", path: "x/bad" } }),
    /must belong/,
  );
});
