// Integration test for the MySQL schema guards and the listing lifecycle.
// Run with `npm run test:db`: it builds a throwaway `nestghana_test` database, applies the
// migrations, runs these tests, and drops the database again (see scripts/test-db.mjs).
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/server/db";
import { transitionListing, TransitionError } from "@/lib/server/listing-status";
import { listPublicListings } from "@/lib/server/public-listings";

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

function newListing() {
  return db.listing.create({
    data: {
      submissionId: randomUUID(),
      ownerId,
      areaId,
      title: "Self-contained room near the market",
      description: "A bright self-contained room with a private bathroom and kitchen, close to transport, shops and the main road. ".repeat(2),
      roomType: "SELF_CONTAINED",
      condition: "GOOD",
      furnished: "UNFURNISHED",
      unitsTotal: 2,
      bedrooms: 1,
      rentAmountPesewas: 80000,
      rentPeriod: "MONTH",
      advancePayments: 6,
      facilities: { m: { fac_Water: "Included" }, bath: "Private" },
      rules: { pets: "No" },
      landmark: "Behind the Community 20 market",
      availabilityDate: new Date("2026-01-01"),
      unitsAvailable: 1,
      private: { create: { exactAddress: "House 12, Secret Street", moderationNotes: "internal note" } },
    },
  });
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

  const rows = await listPublicListings(0, 50);
  const row = rows.find(r => r.id === listing.id);
  assert.ok(row, "LIVE listing is public");
  assert.equal(row.public_data.town, "Tema");
  assert.equal(row.public_data.area, "Community 20");
  assert.equal(row.public_data.region, "Greater Accra");
  assert.equal(row.public_data.rent, 800);
  assert.equal(row.public_data.period, "Monthly");
  assert.equal(row.public_data.phone, "+233241234567");
  const serialized = JSON.stringify(row);
  assert.ok(!serialized.includes("Secret Street"), "exact address stays private");
  assert.ok(!serialized.includes("internal note"), "moderation notes stay private");
  assert.ok(!serialized.includes("ama@test.local"), "owner email stays private");
});

test("non-LIVE listings are not public", async () => {
  const listing = await newListing();
  const rows = await listPublicListings(0, 50);
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
