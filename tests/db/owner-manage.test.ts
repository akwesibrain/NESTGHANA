// Owner manage links, owner actions, notifications and the availability job (run via `npm run test:db`).
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/server/db";
import { transitionListing } from "@/lib/server/listing-status";
import { createManageLink, findManageToken, revokeManageLinks } from "@/lib/server/manage-links";
import { confirmAvailable, markTaken, OwnerActionError, resubmit, updateUnitsAvailable } from "@/lib/server/owner-manage";
import { queueOwnerMessage } from "@/lib/server/notifications";
import { runAvailabilityCheck } from "@/lib/server/availability";

const db = getDb();
let areaId = "";
let ownerId = "";
let adminId = "";
const BASE = "https://nestgh.example";

before(async () => {
  const region = await db.location.create({ data: { kind: "REGION", name: "Central", slug: "central", path: "central" } });
  const town = await db.location.create({ data: { kind: "TOWN", parentId: region.id, name: "Cape Coast", slug: "cape-coast", path: "central/cape-coast" } });
  const area = await db.location.create({ data: { kind: "AREA", parentId: town.id, name: "Abura", slug: "abura", path: "central/cape-coast/abura" } });
  areaId = area.id;
  ownerId = (await db.owner.create({ data: { fullName: "Kojo Owner", phoneE164: "+233551234567", whatsappE164: "+233551234567", email: "kojo@test.local", relationship: "Property Owner" } })).id;
  adminId = (await db.adminUser.create({ data: { email: `mod-${randomUUID()}@test.local`, passwordHash: "x", roles: { create: { role: "MODERATOR" } } } })).id;
});
after(() => db.$disconnect());

async function listingIn(status: "LIVE" | "PENDING_APPROVAL" | "CHANGES_REQUESTED") {
  const listing = await db.listing.create({
    data: {
      submissionId: randomUUID(), ownerId, areaId, title: "Room near Cape Coast castle",
      description: "A tidy single room close to the castle, the market and transport, with water and a shared kitchen in a quiet compound.",
      roomType: "SINGLE_ROOM", condition: "GOOD", furnished: "UNFURNISHED", unitsTotal: 3, unitsAvailable: 2, bedrooms: 1,
      rentAmountPesewas: 60000, rentPeriod: "MONTH", advancePayments: 6, facilities: {}, rules: {},
      availabilityDate: new Date("2026-01-01"),
    },
  });
  await transitionListing({ listingId: listing.id, to: "PAYMENT_PENDING", actorType: "SYSTEM", actorId: null, source: "validated_submission" });
  await db.payment.create({
    data: { listingId: listing.id, paidListingId: listing.id, listingType: "ROOM", reference: `NGH-${randomUUID().replaceAll("-", "").toUpperCase()}`, amountPesewas: 3000, currency: "GHS", status: "PAID", paidAt: new Date() },
  });
  await transitionListing({ listingId: listing.id, to: "PENDING_APPROVAL", actorType: "SYSTEM", actorId: null, source: "verified_payment" });
  if (status === "LIVE") await transitionListing({ listingId: listing.id, to: "LIVE", actorType: "ADMIN", actorId: adminId, source: "test" });
  if (status === "CHANGES_REQUESTED") await transitionListing({ listingId: listing.id, to: "CHANGES_REQUESTED", actorType: "ADMIN", actorId: adminId, reason: "Add more detail", source: "test" });
  return listing.id;
}
const statusOf = async (id: string) => (await db.listing.findUniqueOrThrow({ where: { id } })).status;

test("manage links: valid while active; unknown, malformed and revoked links are refused", async () => {
  const id = await listingIn("LIVE");
  const token = await createManageLink(id);
  assert.equal((await findManageToken(token))?.listingId, id);
  assert.equal(await findManageToken("x".repeat(43)), null);
  assert.equal(await findManageToken("../../etc/passwd"), null);
  const stored = await db.manageLinkToken.findFirstOrThrow({ where: { listingId: id } });
  assert.ok(!Buffer.from(stored.tokenSha256).toString("base64url").includes(token), "only a hash is stored");
  assert.equal(await revokeManageLinks(id), 1);
  assert.equal(await findManageToken(token), null);
});

test("owner can mark taken, re-confirm, and update units (0 units = taken)", async () => {
  const id = await listingIn("LIVE");
  await confirmAvailable(id);
  assert.equal(await statusOf(id), "LIVE");
  await markTaken(id);
  assert.equal(await statusOf(id), "UNAVAILABLE");
  await confirmAvailable(id);
  assert.equal(await statusOf(id), "LIVE");
  await updateUnitsAvailable(id, 1);
  assert.equal((await db.listing.findUniqueOrThrow({ where: { id } })).unitsAvailable, 1);
  await assert.rejects(updateUnitsAvailable(id, 9), (e: unknown) => e instanceof OwnerActionError && e.code === "units_range");
  await updateUnitsAvailable(id, 0);
  assert.equal(await statusOf(id), "UNAVAILABLE");
  const history = await db.listingStatusHistory.findMany({ where: { listingId: id, actorType: "OWNER" } });
  assert.ok(history.length >= 3 && history.every(h => h.source === "owner_manage"));
});

test("owner actions respect the listing state", async () => {
  const id = await listingIn("PENDING_APPROVAL");
  await assert.rejects(confirmAvailable(id), (e: unknown) => e instanceof OwnerActionError && e.code === "not_live");
  await assert.rejects(markTaken(id), (e: unknown) => e instanceof OwnerActionError && e.code === "cannot_mark_taken");
  await assert.rejects(resubmit(id, {}), OwnerActionError);
});

test("owner fixes a listing after changes are requested and resubmits it", async () => {
  const id = await listingIn("CHANGES_REQUESTED");
  await assert.rejects(resubmit(id, { title: "Short", description: "too short", rent: 700, unitsAvailable: 1, availabilityDate: "2026-11-01" }),
    (e: unknown) => e instanceof OwnerActionError && e.code === "invalid_field");
  assert.equal(await statusOf(id), "CHANGES_REQUESTED", "nothing saved on invalid input");
  await resubmit(id, {
    title: "Updated room near Cape Coast castle",
    description: "Now with photos of the kitchen and bathroom described: a tidy single room close to the castle, market and transport.",
    rent: "750", unitsAvailable: "2", landmark: "Castle junction", availabilityDate: "2026-11-01",
  });
  const listing = await db.listing.findUniqueOrThrow({ where: { id } });
  assert.equal(listing.status, "PENDING_APPROVAL");
  assert.equal(listing.rentAmountPesewas, 75000);
  assert.equal(listing.title, "Updated room near Cape Coast castle");
  assert.equal(listing.landmark, "Castle junction");
});

test("notifications: link templates carry a working manage link; rejections do not", async () => {
  const id = await listingIn("LIVE");
  const approved = await queueOwnerMessage(db, { listingId: id, template: "approved", baseUrl: BASE });
  assert.equal(approved.recipient, "+233551234567");
  assert.equal(approved.status, "PENDING");
  const token = approved.message.match(/\/manage\/([A-Za-z0-9_-]{43})/)?.[1];
  assert.ok(token, "message contains a manage link");
  assert.equal((await findManageToken(token))?.listingId, id);
  const rejected = await queueOwnerMessage(db, { listingId: id, template: "rejected", baseUrl: BASE, reason: "Photos do not match" });
  assert.ok(!rejected.message.includes("/manage/"));
  assert.ok(rejected.message.includes("Photos do not match"));
});

test("availability job flags listings not confirmed in time and asks the owner", async () => {
  const fresh = await listingIn("LIVE");
  const stale = await listingIn("LIVE");
  await db.listing.update({ where: { id: stale }, data: { lastConfirmedAt: new Date(Date.now() - 45 * 86_400_000) } });

  const result = await runAvailabilityCheck(BASE);
  assert.ok(result.flagged >= 1);
  assert.equal(await statusOf(stale), "NEEDS_CONFIRMATION");
  assert.equal(await statusOf(fresh), "LIVE");
  const message = await db.notification.findFirstOrThrow({ where: { listingId: stale, template: "needs_confirmation" } });
  const token = message.message.match(/\/manage\/([A-Za-z0-9_-]{43})/)?.[1];
  assert.ok(token);

  // The owner confirms through the link: back to LIVE.
  await confirmAvailable((await findManageToken(token!))!.listingId);
  assert.equal(await statusOf(stale), "LIVE");
});
