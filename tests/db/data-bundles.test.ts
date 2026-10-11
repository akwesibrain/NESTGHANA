// Buy Data: packages → Paystack checkout → payment verification, against a local fake Paystack
// (run via `npm run test:db`). The migration seeds six packages (ids 1–6).
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";

const paystack: { verify: Map<string, { status: string; amount: number }>; initialized: { reference: string; amount: number; email: string }[] } = {
  verify: new Map(),
  initialized: [],
};
let server: Server;

before(async () => {
  server = createServer((req, res) => {
    const send = (body: unknown) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(body));
    };
    if (req.method === "POST" && req.url === "/transaction/initialize") {
      let raw = "";
      req.on("data", chunk => (raw += chunk));
      req.on("end", () => {
        const body = JSON.parse(raw);
        paystack.initialized.push({ reference: body.reference, amount: body.amount, email: body.email });
        send({ status: true, data: { authorization_url: `http://127.0.0.1:${port()}/checkout/${body.reference}`, reference: body.reference } });
      });
      return;
    }
    const match = req.url?.match(/^\/transaction\/verify\/(.+)$/);
    if (req.method === "GET" && match) {
      const reference = decodeURIComponent(match[1]);
      const outcome = paystack.verify.get(reference) ?? { status: "ongoing", amount: 0 };
      const id = 500000 + [...reference].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 400000, 0);
      return send({ status: true, data: { id, reference, currency: "GHS", ...outcome } });
    }
    res.writeHead(404);
    res.end();
  });
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  process.env.PAYSTACK_SECRET_KEY = "sk_test_fake";
  process.env.PAYSTACK_API_BASE = `http://127.0.0.1:${port()}`;
});

after(async () => {
  server.close();
  await (await database()).$disconnect();
});

const port = () => (server.address() as { port: number }).port;
// Imported lazily so the env above is set before any module reads it.
const database = async () => (await import("@/lib/server/db")).getDb();
const bundles = () => import("@/lib/server/data-bundles");

const checkout = async (over: Record<string, unknown> = {}) =>
  (await bundles()).startDataCheckout({
    packageId: 1, customerPhone: "024 123 4567", customerEmail: "Buyer@Example.com ", callbackUrl: "http://localhost/buy-data/index.html", ipHash: null, ...over,
  });

test("packages: only those on sale are listed, in the shape the Buy Data page reads", async () => {
  const { listActivePackages } = await bundles();
  const db = await database();
  const all = await listActivePackages();
  assert.equal(all.length, 6);
  assert.deepEqual(all[0], { id: 1, network: "MTN", package_name: "MTN 2GB", data_amount: "2GB", price: 10, status: "active" });
  assert.deepEqual(all.find(p => p.id === 5), { id: 5, network: "MTN", package_name: "1GB", data_amount: "1GB", price: 4.5, status: "active" });
  assert.equal(all.find(p => p.id === 4)?.network, "AirtelTigo");

  await db.dataPackage.update({ where: { id: 6 }, data: { active: false } });
  assert.ok(!(await listActivePackages()).some(p => p.id === 6), "a package taken off sale is hidden");
  await assert.rejects(checkout({ packageId: 6 }), /no longer available/);
  await db.dataPackage.update({ where: { id: 6 }, data: { active: true } });
});

test("checkout charges the database price and stores a normalised order", async () => {
  const db = await database();
  const result = await checkout();
  assert.match(result.reference, /^NGD-[0-9A-F]{32}$/);
  const sent = paystack.initialized.at(-1)!;
  assert.deepEqual(sent, { reference: result.reference, amount: 1000, email: "buyer@example.com" });

  const order = await db.dataOrder.findUniqueOrThrow({ where: { id: result.orderId } });
  assert.equal(order.status, "PENDING");
  assert.equal(order.customerPhoneE164, "+233241234567");
  assert.equal(order.customerEmail, "buyer@example.com");
  assert.equal(order.amountPesewas, 1000);
  assert.equal(`${order.network} ${order.dataAmount}`, "MTN 2GB");
});

test("invalid checkout input is refused before anything is stored", async () => {
  const db = await database();
  const count = await db.dataOrder.count();
  await assert.rejects(checkout({ customerPhone: "12345" }), /valid Ghana mobile number/);
  await assert.rejects(checkout({ customerPhone: "0712345678" }), /valid Ghana mobile number/);
  await assert.rejects(checkout({ customerEmail: "not-an-email" }), /valid email/);
  await assert.rejects(checkout({ packageId: "abc" }), /Choose a data package/);
  await assert.rejects(checkout({ packageId: 9999 }), /no longer available/);
  assert.equal(await db.dataOrder.count(), count);
});

test("a verified payment marks the order paid exactly once", async () => {
  const { verifyDataPayment, finalizeDataPayment, getDataSalesSummary } = await bundles();
  const db = await database();
  const before = await getDataSalesSummary();
  const { reference, orderId } = await checkout({ packageId: 2 });

  assert.equal(await verifyDataPayment(reference), "pending", "not paid until Paystack says so");
  assert.equal((await db.dataOrder.findUniqueOrThrow({ where: { id: orderId } })).status, "PENDING");

  paystack.verify.set(reference, { status: "success", amount: 2000 });
  assert.equal(await verifyDataPayment(reference), "paid");
  const paid = await db.dataOrder.findUniqueOrThrow({ where: { id: orderId } });
  assert.equal(paid.status, "PAID");
  assert.ok(paid.paidAt && paid.paystackTransactionId);

  // The webhook arriving afterwards (or a page refresh) changes nothing.
  assert.equal(await finalizeDataPayment(reference, { id: 1, status: "success", reference, amount: 2000, currency: "GHS" }), false);
  assert.equal(await verifyDataPayment(reference), "paid");

  const afterPaid = await getDataSalesSummary();
  assert.equal(afterPaid.allTimePesewas - before.allTimePesewas, 2000);
  assert.equal(afterPaid.todayPesewas - before.todayPesewas, 2000);
  assert.equal(afterPaid.toDeliver - before.toDeliver, 1);

  await db.dataOrder.update({ where: { id: orderId }, data: { status: "DELIVERED", deliveredAt: new Date() } });
  const afterDelivery = await getDataSalesSummary();
  assert.equal(afterDelivery.toDeliver, before.toDeliver, "delivered orders leave the queue");
  assert.equal(afterDelivery.allTimePesewas, afterPaid.allTimePesewas, "and still count as revenue");
});

test("a payment for the wrong amount is never recorded as paid", async () => {
  const { verifyDataPayment } = await bundles();
  const db = await database();
  const { reference, orderId } = await checkout({ packageId: 2 });
  paystack.verify.set(reference, { status: "success", amount: 100 });
  await assert.rejects(verifyDataPayment(reference), /does not match the order/);
  assert.equal((await db.dataOrder.findUniqueOrThrow({ where: { id: orderId } })).status, "PENDING");
});

test("failed payments are marked failed; a late success still completes the order", async () => {
  const { verifyDataPayment } = await bundles();
  const db = await database();
  const { reference, orderId } = await checkout();
  paystack.verify.set(reference, { status: "abandoned", amount: 0 });
  assert.equal(await verifyDataPayment(reference), "failed");
  assert.equal((await db.dataOrder.findUniqueOrThrow({ where: { id: orderId } })).status, "FAILED");

  paystack.verify.set(reference, { status: "success", amount: 1000 });
  assert.equal(await verifyDataPayment(reference), "paid");
  assert.equal((await db.dataOrder.findUniqueOrThrow({ where: { id: orderId } })).status, "PAID");
});

test("references that are not data orders are refused", async () => {
  const { verifyDataPayment, finalizeDataPayment } = await bundles();
  await assert.rejects(verifyDataPayment("NGH-" + "A".repeat(32)), /Invalid payment reference/);
  await assert.rejects(verifyDataPayment("NGD-" + "A".repeat(32)), /not found/);
  await assert.rejects(verifyDataPayment(undefined), /Invalid payment reference/);
  const reference = "NGD-" + "B".repeat(32);
  await assert.rejects(finalizeDataPayment(reference, { id: 2, status: "failed", reference, amount: 1000, currency: "GHS" }), /has not confirmed/);
});

test("database rules: a delivered order needs its delivery time, and phone numbers must be Ghanaian", async () => {
  const db = await database();
  const { orderId } = await checkout();
  await assert.rejects(db.dataOrder.update({ where: { id: orderId }, data: { status: "DELIVERED" } }));
  await assert.rejects(db.dataOrder.update({ where: { id: orderId }, data: { status: "PAID" } }), "paid needs paid_at");
  await assert.rejects(db.dataOrder.update({ where: { id: orderId }, data: { customerPhoneE164: "+15551234567" } }));
  await assert.rejects(db.dataPackage.update({ where: { id: 1 }, data: { pricePesewas: 0 } }));
});
