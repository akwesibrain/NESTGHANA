// Live sales analysis figures (lib/server/sales-analytics.ts), run via `npm run test:db`.
// Other test files share the database, so assertions compare before/after a known payment.
import { after, test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/server/db";
import { transitionListing } from "@/lib/server/listing-status";
import { getSalesAnalytics } from "@/lib/server/sales-analytics";

const db = getDb();
after(() => db.$disconnect());

async function shopAwaitingPayment() {
  const region = await db.location.create({ data: { kind: "REGION", name: `Sales Region ${randomUUID().slice(0, 6)}`, slug: `sales-${randomUUID().slice(0, 8)}`, path: `sales-${randomUUID()}` } });
  const town = await db.location.create({ data: { kind: "TOWN", parentId: region.id, name: "Sales Town", slug: "sales-town", path: `${region.path}/sales-town` } });
  const area = await db.location.create({ data: { kind: "AREA", parentId: town.id, name: "Sales Area", slug: "sales-area", path: `${town.path}/sales-area` } });
  const owner = await db.owner.create({ data: { fullName: "Sales Owner", phoneE164: "+233241111111", whatsappE164: "+233241111111", email: "sales@test.local", relationship: "Property Owner" } });
  const listing = await db.listing.create({
    data: {
      submissionId: randomUUID(), propertyCategory: "COMMERCIAL", ownerId: owner.id, areaId: area.id, title: "Shop for sales analytics test",
      description: "A shop used by the sales analytics test. It exists only inside the throwaway test database and is never shown anywhere.",
      roomType: "SHOP", condition: "GOOD", furnished: "NOT_APPLICABLE", unitsTotal: 1, unitsAvailable: 1, rentAmountPesewas: 100000,
      rentPeriod: "MONTH", advancePayments: 0, advanceAmountPesewas: 0, sizeSqm: 20, roadVisibility: true, parking: true,
      electricity: true, water: true, estimatedMoveInCostPesewas: 0, facilities: {}, rules: {}, availabilityDate: new Date("2026-01-01"),
    },
  });
  await transitionListing({ listingId: listing.id, to: "PAYMENT_PENDING", actorType: "SYSTEM", actorId: null, source: "validated_submission" });
  return listing.id;
}

test("a paid fee shows up in today, the period, the daily series, the fee type and the funnel", async () => {
  const before = await getSalesAnalytics(30);
  const listingId = await shopAwaitingPayment();
  await db.payment.create({
    data: { listingId, paidListingId: listingId, listingType: "SPACE", reference: `NGH-${randomUUID().replaceAll("-", "").toUpperCase()}`, amountPesewas: 4000, currency: "GHS", status: "PAID", paidAt: new Date() },
  });
  const afterPaid = await getSalesAnalytics(30);

  assert.equal(afterPaid.kpis.todayPesewas - before.kpis.todayPesewas, 4000);
  assert.equal(afterPaid.kpis.periodPesewas - before.kpis.periodPesewas, 4000);
  assert.equal(afterPaid.kpis.allTimePesewas - before.kpis.allTimePesewas, 4000);
  assert.equal(afterPaid.kpis.paidCount - before.kpis.paidCount, 1);
  assert.equal(afterPaid.series.length, 30, "one point per day, including empty days");
  assert.equal(afterPaid.series.at(-1)!.pesewas - before.series.at(-1)!.pesewas, 4000, "today's point grows");
  const space = (d: typeof before) => d.byType.find(t => t.type === "SPACE")!;
  assert.equal(space(afterPaid).pesewas - space(before).pesewas, 4000);
  assert.equal(afterPaid.funnel.submitted - before.funnel.submitted, 1);
  assert.equal(afterPaid.funnel.paid - before.funnel.paid, 1);
  assert.equal(afterPaid.recent[0].pesewas, 4000, "newest activity first");
});

test("in-progress and failed attempts are counted but never added to revenue", async () => {
  const before = await getSalesAnalytics(7);
  const listingId = await shopAwaitingPayment();
  const reference = () => `NGH-${randomUUID().replaceAll("-", "").toUpperCase()}`;
  await db.payment.create({ data: { listingId, listingType: "SPACE", reference: reference(), amountPesewas: 4000, currency: "GHS", status: "PENDING" } });
  await db.payment.create({ data: { listingId, listingType: "SPACE", reference: reference(), amountPesewas: 4000, currency: "GHS", status: "FAILED" } });
  const afterAttempts = await getSalesAnalytics(7);
  assert.equal(afterAttempts.kpis.periodPesewas, before.kpis.periodPesewas);
  assert.equal(afterAttempts.kpis.inProgress - before.kpis.inProgress, 1);
  assert.equal(afterAttempts.series.at(-1)!.attempts - before.series.at(-1)!.attempts, 2);
  assert.ok(afterAttempts.kpis.successRate === null || afterAttempts.kpis.successRate <= 100);
});
