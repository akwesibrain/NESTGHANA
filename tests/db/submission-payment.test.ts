// Owner submission → Paystack checkout → payment verification → admin approval, against a local
// fake Paystack (run via `npm run test:db`).
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { createServer, type Server } from "node:http";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const paystack: { verify: Map<string, { status: string; amount: number }>; initialized: string[] } = {
  verify: new Map(),
  initialized: [],
};
let server: Server;
let storageDir = "";

before(async () => {
  server = createServer((req, res) => {
    const send = (body: unknown) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(body));
    };
    if (req.headers.authorization !== "Bearer sk_test_fake") {
      res.writeHead(401);
      return res.end();
    }
    if (req.method === "POST" && req.url === "/transaction/initialize") {
      let raw = "";
      req.on("data", chunk => (raw += chunk));
      req.on("end", () => {
        const body = JSON.parse(raw);
        paystack.initialized.push(body.reference);
        send({ status: true, data: { authorization_url: `http://127.0.0.1:${port()}/checkout/${body.reference}`, reference: body.reference } });
      });
      return;
    }
    const match = req.url?.match(/^\/transaction\/verify\/(.+)$/);
    if (req.method === "GET" && match) {
      const reference = decodeURIComponent(match[1]);
      const outcome = paystack.verify.get(reference) ?? { status: "ongoing", amount: 0 };
      const id = 100000 + [...reference].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 900000, 0);
      return send({ status: true, data: { id, reference, currency: "GHS", ...outcome } });
    }
    res.writeHead(404);
    res.end();
  });
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  process.env.PAYSTACK_SECRET_KEY = "sk_test_fake";
  process.env.PAYSTACK_API_BASE = `http://127.0.0.1:${port()}`;
  storageDir = await mkdtemp(path.join(tmpdir(), "nestgh-images-"));
  process.env.IMAGE_STORAGE_DIR = storageDir;

  const db = await database();
  const region = await db.location.create({ data: { kind: "REGION", name: "Volta", slug: "volta", path: "volta" } });
  await db.location.create({ data: { kind: "TOWN", parentId: region.id, name: "Ho", slug: "ho", path: "volta/ho" } });
});

after(async () => {
  server.close();
  await rm(storageDir, { recursive: true, force: true });
  await (await database()).$disconnect();
});

const port = () => (server.address() as { port: number }).port;
// Imported lazily so the env above is set before any module reads it.
const database = async () => (await import("@/lib/server/db")).getDb();
const submissions = () => import("@/lib/server/listing-submission");
const payments = () => import("@/lib/server/payments");

const jpeg = () => new Uint8Array([0xff, 0xd8, 0xff, 0xe0, ...Array.from({ length: 200 }, (_, i) => i % 256)]);
const ROOM_PHOTOS = ["Exterior", "Bedroom", "Bathroom", "Kitchen", "Compound or common area"];
const SPACE_PHOTOS = ["Exterior", "Interior", "Frontage", "Facilities", "Surrounding area"];
const photosFor = (names: string[]) => [
  ...names.map(name => ({ field: `photo:${name}`, bytes: jpeg() })),
  { field: "profile_photo", bytes: jpeg() },
  { field: "photo:Extra 1", bytes: jpeg() },
];

function roomForm(overrides: Record<string, unknown> = {}) {
  return {
    category: "rooms",
    title: "Bright single room in Ho",
    desc: "A bright single room with a shared kitchen and bathroom, close to the main road, shops and the university bus stop.",
    type: "Single Room",
    cond: "Good Condition",
    furn: "Unfurnished",
    units: "3",
    aunits: "2",
    beds: "1",
    rent: "450",
    period: "Monthly",
    adv: "6",
    dep: "",
    fee: "50",
    oth: "",
    maxOcc: "2",
    m: { Water: "Included", Electricity: "Separate Charge" },
    facOther: "Backup tank",
    who: ["Students", "Workers"],
    pets: "No",
    region: "Volta",
    town: "Ho",
    area: "Bankoe",
    addr: "House 7, behind the Bankoe chapel",
    lm: "Bankoe chapel",
    avail: "Yes, available now",
    name: "Esi Owner",
    rel: "Property Owner",
    phone: "024 123 4567",
    wa: "0241234567",
    email: "Esi@Example.com",
    cons: [true, true, true, true, true, true],
    accurate: true,
    ...overrides,
  };
}

function spaceForm(overrides: Record<string, unknown> = {}) {
  return {
    ...roomForm(),
    category: "commercial",
    title: "Roadside shop in Ho market",
    type: "Shop",
    size: "24",
    roadVisibility: "Yes",
    parking: "No",
    electricity: "Yes",
    water: "No",
    advanceAmount: "3000",
    ...overrides,
  };
}

async function submitAndCheckout(form: Record<string, unknown>, photos = photosFor(ROOM_PHOTOS), expected?: number) {
  const { createSubmission } = await submissions();
  const { startCheckout } = await payments();
  const submissionId = randomUUID();
  const result = await createSubmission(submissionId, form, photos);
  const db = await database();
  const listing = await db.listing.findUniqueOrThrow({ where: { id: result.listingId } });
  const fee = expected ?? (listing.propertyCategory === "COMMERCIAL" ? 4000 : listing.roomType === "STUDENT_HOSTEL" ? 3500 : 3000);
  const checkout = await startCheckout({ listingId: result.listingId, ownerEmail: result.ownerEmail, expectedFeePesewas: fee, callbackUrl: "http://localhost:3002/index.html" });
  return { submissionId, listingId: result.listingId, checkout };
}

test("room submission stores everything privately and starts a GH₵30 checkout", async () => {
  const db = await database();
  const { submissionId, listingId, checkout } = await submitAndCheckout(roomForm());
  assert.match(checkout.reference, /^NGH-[0-9A-F]{32}$/);
  assert.equal(checkout.amountPesewas, 3000);
  assert.ok(paystack.initialized.includes(checkout.reference));

  const listing = await db.listing.findUniqueOrThrow({
    where: { id: listingId },
    include: { owner: true, private: true, consents: true, images: true, area: { include: { parent: true } }, payments: true },
  });
  assert.equal(listing.status, "PAYMENT_PENDING");
  assert.equal(listing.rentAmountPesewas, 45000);
  assert.equal(listing.agencyFeePesewas, 5000);
  assert.equal(listing.depositPesewas, 0);
  assert.equal(listing.landmark, "Bankoe chapel");
  assert.equal(listing.owner.phoneE164, "+233241234567");
  assert.equal(listing.owner.email, "esi@example.com");
  assert.equal(listing.private?.exactAddress, "House 7, behind the Bankoe chapel");
  assert.equal(listing.area.name, "Bankoe", "a new area under a known town is created");
  assert.equal(listing.area.parent?.name, "Ho");
  assert.equal((listing.consents[0].checkboxValues as Record<string, boolean>).profile_and_contact_display_consent, true);
  assert.equal(listing.images.length, 7);
  assert.ok(listing.images.every(image => !image.approvedForPublic));
  assert.deepEqual((listing.facilities as { selections: unknown }).selections, { Water: "Included", Electricity: "Separate Charge" });
  assert.equal(listing.payments[0].listingType, "ROOM");
  assert.equal((await readdir(path.join(storageDir, submissionId))).length, 7, "photos are on disk");
});

test("fees follow the listing type: hostel GH₵35, shop GH₵40", async () => {
  const hostel = await submitAndCheckout(roomForm({ type: "Student Hostel", title: "Student hostel near campus" }));
  assert.equal(hostel.checkout.amountPesewas, 3500);
  const shop = await submitAndCheckout(spaceForm(), photosFor(SPACE_PHOTOS));
  assert.equal(shop.checkout.amountPesewas, 4000);
  const listing = await (await database()).listing.findUniqueOrThrow({ where: { id: shop.listingId } });
  assert.equal(listing.propertyCategory, "COMMERCIAL");
  assert.equal(Number(listing.sizeSqm), 24);
  assert.equal(listing.parking, false);
  assert.equal(listing.advanceAmountPesewas, 300000);
  assert.equal(listing.estimatedMoveInCostPesewas, 305000, "advance + agency fee");
});

test("a stale fee from the browser is refused instead of charging a different amount", async () => {
  const { PaymentError } = await payments();
  await assert.rejects(submitAndCheckout(roomForm(), undefined, 2500), (error: unknown) => error instanceof PaymentError && error.status === 409);
});

test("resubmitting the same submission does not create a duplicate", async () => {
  const { createSubmission } = await submissions();
  const id = randomUUID();
  const first = await createSubmission(id, roomForm(), photosFor(ROOM_PHOTOS));
  const second = await createSubmission(id, roomForm(), []);
  assert.equal(second.listingId, first.listingId);
  assert.equal(second.created, false);
  await assert.rejects(createSubmission(id, roomForm({ email: "someone.else@example.com" }), []), /different owner/);
});

test("invalid submissions are rejected and leave no files behind", async () => {
  const { createSubmission, SubmissionError } = await submissions();
  const reject = (form: Record<string, unknown>, photos = photosFor(ROOM_PHOTOS)) =>
    assert.rejects(createSubmission(randomUUID(), form, photos), SubmissionError);
  await reject(roomForm({ cons: [true, true, true, true, false, true] }));
  await reject(roomForm({ phone: "12345" }));
  await reject(roomForm({ desc: "Too short" }));
  await reject(roomForm({ aunits: "9" }));
  await reject(roomForm({ town: "Atlantis" }));
  await reject(roomForm({ type: "Castle" }));
  await reject(roomForm(), photosFor(ROOM_PHOTOS).filter(photo => photo.field !== "photo:Kitchen"));
  // A text file renamed to .jpg is refused by its content, not its name.
  await reject(roomForm(), [...photosFor(ROOM_PHOTOS).slice(1), { field: "photo:Exterior", bytes: new TextEncoder().encode("<script>alert(1)</script>") }]);
  await reject(spaceForm({ size: "0" }), photosFor(SPACE_PHOTOS));
  await reject(spaceForm({ roadVisibility: "Maybe" }), photosFor(SPACE_PHOTOS));
});

test("verified payment moves the listing to review exactly once", async () => {
  const db = await database();
  const { verifyPayment } = await payments();
  const { listingId, checkout } = await submitAndCheckout(roomForm());

  assert.equal(await verifyPayment(checkout.reference), "pending", "not paid yet");
  paystack.verify.set(checkout.reference, { status: "success", amount: 3000 });
  assert.equal(await verifyPayment(checkout.reference), "PENDING_APPROVAL");
  assert.equal(await verifyPayment(checkout.reference), "already_processed");

  const listing = await db.listing.findUniqueOrThrow({ where: { id: listingId }, include: { payments: true, statusHistory: true } });
  assert.equal(listing.status, "PENDING_APPROVAL");
  assert.equal(listing.payments[0].status, "PAID");
  assert.match(listing.payments[0].paystackTransactionId ?? "", /^\d+$/);
  assert.equal(listing.statusHistory.filter(h => h.newStatus === "PENDING_APPROVAL").length, 1);
  assert.equal(await db.paymentEvent.count({ where: { paymentReference: checkout.reference } }), 1);

  // A paid listing cannot start another checkout.
  const { startCheckout, PaymentError } = await payments();
  await assert.rejects(
    startCheckout({ listingId, ownerEmail: "esi@example.com", expectedFeePesewas: 3000, callbackUrl: "http://localhost/index.html" }),
    PaymentError,
  );
});

test("a payment whose amount does not match is never recorded as paid", async () => {
  const db = await database();
  const { verifyPayment } = await payments();
  const { listingId, checkout } = await submitAndCheckout(roomForm());
  paystack.verify.set(checkout.reference, { status: "success", amount: 100 });
  await assert.rejects(verifyPayment(checkout.reference), /does not match/);
  const listing = await db.listing.findUniqueOrThrow({ where: { id: listingId }, include: { payments: true } });
  assert.equal(listing.status, "PAYMENT_PENDING");
  assert.notEqual(listing.payments[0].status, "PAID");
});

test("failed payments can be retried with a new reference", async () => {
  const { verifyPayment, startCheckout } = await payments();
  const { listingId, checkout } = await submitAndCheckout(roomForm());
  paystack.verify.set(checkout.reference, { status: "abandoned", amount: 3000 });
  assert.equal(await verifyPayment(checkout.reference), "failed");
  const retry = await startCheckout({ listingId, ownerEmail: "esi@example.com", expectedFeePesewas: 3000, callbackUrl: "http://localhost/index.html" });
  assert.notEqual(retry.reference, checkout.reference);
  const statuses = (await (await database()).payment.findMany({ where: { listingId }, orderBy: { createdAt: "asc" } })).map(p => p.status);
  assert.deepEqual(statuses, ["ABANDONED", "PENDING"]);
});

test("webhook signatures are checked with the secret key", async () => {
  const { validWebhookSignature } = await import("@/lib/server/paystack");
  const body = JSON.stringify({ event: "charge.success", data: { reference: "NGH-X" } });
  const good = createHmac("sha512", "sk_test_fake").update(body).digest("hex");
  assert.equal(validWebhookSignature(body, good), true);
  assert.equal(validWebhookSignature(body + " ", good), false);
  assert.equal(validWebhookSignature(body, createHmac("sha512", "wrong").update(body).digest("hex")), false);
  assert.equal(validWebhookSignature(body, null), false);
});

test("approving publishes the listing with its property photos but not the profile photo", async () => {
  const db = await database();
  const { verifyPayment } = await payments();
  const { transitionListing } = await import("@/lib/server/listing-status");
  const { listPublicListings } = await import("@/lib/server/public-listings");
  const { listingId, checkout } = await submitAndCheckout(roomForm({ title: "Room to approve in Ho" }));
  paystack.verify.set(checkout.reference, { status: "success", amount: 3000 });
  await verifyPayment(checkout.reference);

  const admin = await db.adminUser.create({ data: { email: `reviewer-${randomUUID()}@test.local`, passwordHash: "x", roles: { create: { role: "MODERATOR" } } } });
  await transitionListing({ listingId, to: "LIVE", actorType: "ADMIN", actorId: admin.id, source: "admin_dashboard" });
  // Same update the admin review action performs.
  await db.listingImage.updateMany({ where: { listingId, category: { not: "PROFILE" } }, data: { approvedForPublic: true } });

  const row = (await listPublicListings("room", 0, 50)).find(r => r.id === listingId);
  assert.ok(row, "listing is public");
  const photos = (row.public_data as { photos: string[] }).photos;
  assert.equal(photos.length, 6, "5 required + 1 extra, no profile photo");
  assert.ok(photos.every(url => /^\/api\/images\/[0-9a-f-]{36}$/.test(url)));
  assert.equal((row.public_data as { lm: string }).lm, "Bankoe chapel");
});
