// End-to-end check over real HTTP: starts `next dev` against a throwaway database and a fake
// Paystack, then walks submission → checkout → payment → approval → public listing + photos.
// Usage: npm run test:e2e   (stop any running `npm run dev` first; Next allows one dev server).
import "dotenv/config";
import { spawn, execSync } from "node:child_process";
import { createHmac, randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import mariadb from "mariadb";

const PORT = 3011;
const BASE = `http://localhost:${PORT}`;
const SECRET = "sk_test_e2e";
const admin = new URL(process.env.DATABASE_URL);
const dbUrl = new URL(process.env.DATABASE_URL);
dbUrl.pathname = "/nestghana_e2e";
const sql = async (query, params = [], database) => {
  const conn = await mariadb.createConnection({
    host: admin.hostname, port: Number(admin.port || 3306), user: decodeURIComponent(admin.username),
    password: decodeURIComponent(admin.password), database, multipleStatements: true,
  });
  try { return await conn.query(query, params); } finally { await conn.end(); }
};

// ── Fake Paystack ──
const paid = new Map();
const fake = createServer((req, res) => {
  const send = body => { res.writeHead(200, { "Content-Type": "application/json" }); res.end(JSON.stringify(body)); };
  if (req.headers.authorization !== `Bearer ${SECRET}`) { res.writeHead(401); return res.end(); }
  if (req.method === "POST" && req.url === "/transaction/initialize") {
    let raw = "";
    req.on("data", c => (raw += c));
    req.on("end", () => {
      const body = JSON.parse(raw);
      send({ status: true, data: { authorization_url: `http://127.0.0.1:${fake.address().port}/pay/${body.reference}`, reference: body.reference, callback: body.callback_url } });
    });
    return;
  }
  const m = req.url.match(/^\/transaction\/verify\/(.+)$/);
  if (m) {
    const reference = decodeURIComponent(m[1]);
    return send({ status: true, data: { id: 900001, reference, currency: "GHS", status: paid.has(reference) ? "success" : "ongoing", amount: paid.get(reference) ?? 0 } });
  }
  res.writeHead(404); res.end();
});
await new Promise(r => fake.listen(0, "127.0.0.1", r));

const storage = mkdtempSync(path.join(tmpdir(), "nestgh-e2e-"));
let server;
let failed = false;
const step = (name) => console.log(`✔ ${name}`);

try {
  await sql("DROP DATABASE IF EXISTS nestghana_e2e; CREATE DATABASE nestghana_e2e CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
  execSync("npx prisma migrate deploy", { env: { ...process.env, DATABASE_URL: dbUrl.href }, stdio: "ignore" });
  const regionId = randomUUID();
  await sql(
    "INSERT INTO locations (id, kind, parent_id, name, slug, path, updated_at) VALUES (?, 'REGION', NULL, 'Volta', 'volta', 'volta', UTC_TIMESTAMP(3)), (?, 'TOWN', ?, 'Ho', 'ho', 'volta/ho', UTC_TIMESTAMP(3))",
    [regionId, randomUUID(), regionId], "nestghana_e2e",
  );

  server = spawn("npx", ["next", "dev", "-p", String(PORT)], {
    shell: true,
    env: { ...process.env, DATABASE_APP_URL: dbUrl.href, PAYSTACK_SECRET_KEY: SECRET, PAYSTACK_API_BASE: `http://127.0.0.1:${fake.address().port}`, IMAGE_STORAGE_DIR: storage, PUBLIC_SITE_URL: BASE, NEXT_DIST_DIR: ".next-e2e" },
    stdio: ["ignore", "pipe", "pipe"],
    // Own process group on Linux/macOS so the whole tree (shell + next) can be stopped together.
    detached: process.platform !== "win32",
  });
  let log = "";
  server.stdout.on("data", d => (log += d));
  server.stderr.on("data", d => (log += d));
  for (let i = 0; ; i++) {
    try { if ((await fetch(`${BASE}/api/settings`)).ok) break; } catch {}
    if (i > 90) throw new Error("Dev server did not start:\n" + log.slice(-2000));
    await new Promise(r => setTimeout(r, 2000));
  }

  const settings = await (await fetch(`${BASE}/api/settings`)).json();
  assert.deepEqual(settings.listing_fees_pesewas, { room: 3000, hostel: 3500, space: 4000 });
  assert.equal(settings.payments_enabled, true);
  step("settings: per-type fees and payments enabled");

  for (const file of ["/index.html", "/app.js", "/listing-pricing.js", "/commercial-listings.js"]) {
    assert.equal((await fetch(BASE + file)).status, 200, file);
  }
  const html = await (await fetch(`${BASE}/index.html`)).text();
  assert.ok(!html.toLowerCase().includes("supabase"), "no third-party database scripts");
  step("public site assets load (MySQL API only)");

  // ── Submission over multipart ──
  const heroJpeg = readFileSync("public/hero.jpg");
  const jpeg = () => new Blob([heroJpeg], { type: "image/jpeg" });
  const submissionId = randomUUID();
  const listing = {
    category: "rooms", title: "E2E single room in Ho", type: "Single Room", cond: "Good Condition", furn: "Furnished",
    desc: "A furnished single room with a private bathroom, close to the Ho central market, transport and the university shuttle.",
    units: "2", aunits: "1", beds: "1", rent: "500", period: "Monthly", adv: "3", dep: "", fee: "", oth: "", maxOcc: "1",
    m: { Water: "Included" }, region: "Volta", town: "Ho", area: "Ahoe", addr: "Plot 12, Ahoe road", lm: "Ahoe junction",
    avail: "Yes, available now", name: "E2E Owner", rel: "Property Owner", phone: "0201234567", wa: "0201234567",
    email: "e2e.owner@example.com", cons: [true, true, true, true, true, true],
  };
  const form = new FormData();
  form.append("submission_id", submissionId);
  form.append("listing", JSON.stringify(listing));
  form.append("expected_fee_pesewas", "3000");
  for (const name of ["Exterior", "Bedroom", "Bathroom", "Kitchen", "Compound or common area"]) form.append(`photo:${name}`, jpeg(), `${name}.jpg`);
  form.append("profile_photo", jpeg(), "profile.jpg");

  const crossSite = await fetch(`${BASE}/api/listings/submit`, { method: "POST", body: form, headers: { Origin: "https://evil.example" } });
  assert.equal(crossSite.status, 403);
  step("cross-site submission is refused");

  const submit = await fetch(`${BASE}/api/listings/submit`, { method: "POST", body: form, headers: { Origin: BASE } });
  const checkout = await submit.json();
  assert.equal(submit.status, 200, JSON.stringify(checkout));
  assert.match(checkout.reference, /^NGH-[0-9A-F]{32}$/);
  assert.ok(checkout.authorization_url.includes(checkout.reference));
  assert.match(checkout.manage_url ?? "", /\/manage\/[A-Za-z0-9_-]{43}$/, "owner gets a manage link");
  step("submission accepted, Paystack checkout started (GH₵30), owner manage link issued");

  const [row] = await sql("SELECT l.id, l.status, (SELECT COUNT(*) FROM listing_images i WHERE i.listing_id = l.id) AS images FROM listings l WHERE submission_id = ?", [submissionId], "nestghana_e2e");
  assert.equal(row.status, "PAYMENT_PENDING");
  assert.equal(Number(row.images), 6);
  const [image] = await sql("SELECT id FROM listing_images WHERE listing_id = ? AND category = 'EXTERIOR'", [row.id], "nestghana_e2e");
  assert.equal((await fetch(`${BASE}/api/images/${image.id}`)).status, 404, "unapproved photo is private");
  assert.equal((await fetch(`${BASE}/api/admin/images/${image.id}`)).status, 401, "admin photo route needs a session");
  step("listing saved as PAYMENT_PENDING with 6 private photos");

  // ── Payment ──
  const verifyEarly = await fetch(`${BASE}/api/payments/verify`, { method: "POST", headers: { "Content-Type": "application/json", Origin: BASE }, body: JSON.stringify({ reference: checkout.reference }) });
  assert.equal(verifyEarly.status, 409, "not paid yet");
  paid.set(checkout.reference, 3000);
  const event = JSON.stringify({ event: "charge.success", data: { reference: checkout.reference } });
  const badHook = await fetch(`${BASE}/api/webhooks/paystack`, { method: "POST", body: event, headers: { "x-paystack-signature": "0".repeat(128) } });
  assert.equal(badHook.status, 401);
  const hook = await fetch(`${BASE}/api/webhooks/paystack`, { method: "POST", body: event, headers: { "x-paystack-signature": createHmac("sha512", SECRET).update(event).digest("hex") } });
  assert.equal(hook.status, 200);
  const replay = await fetch(`${BASE}/api/webhooks/paystack`, { method: "POST", body: event, headers: { "x-paystack-signature": createHmac("sha512", SECRET).update(event).digest("hex") } });
  assert.equal(replay.status, 200, "webhook retries are harmless");
  const verify = await fetch(`${BASE}/api/payments/verify`, { method: "POST", headers: { "Content-Type": "application/json", Origin: BASE }, body: JSON.stringify({ reference: checkout.reference }) });
  assert.deepEqual(await verify.json(), { status: "already_processed" });
  const [afterPay] = await sql("SELECT l.status, p.status AS payment FROM listings l JOIN payments p ON p.listing_id = l.id WHERE l.id = ?", [row.id], "nestghana_e2e");
  assert.deepEqual({ ...afterPay }, { status: "PENDING_APPROVAL", payment: "PAID" });
  step("signed webhook records the payment once; listing awaits review");

  const ownerPage = await (await fetch(checkout.manage_url)).text();
  assert.ok(ownerPage.includes("E2E single room in Ho") && ownerPage.includes("Being reviewed"), "owner manage page shows the listing status");
  assert.ok((await (await fetch(`${BASE}/manage/${"x".repeat(43)}`)).text()).includes("This link is not valid"));
  step("owner manage link opens their listing; a fake link is refused");

  // ── Admin review page (signed-in, MFA-verified session) ──
  const adminId = randomUUID();
  const token = randomUUID() + randomUUID();
  await sql(
    "INSERT INTO admin_users (id, email, password_hash, mfa_enabled_at, updated_at) VALUES (?, 'e2e-admin@test.local', 'x', UTC_TIMESTAMP(3), UTC_TIMESTAMP(3)); INSERT INTO admin_roles (user_id, role, updated_at) VALUES (?, 'MODERATOR', UTC_TIMESTAMP(3)); INSERT INTO admin_sessions (id, user_id, token_sha256, mfa_verified_at, expires_at, updated_at) VALUES (UUID(), ?, UNHEX(SHA2(?, 256)), UTC_TIMESTAMP(3), UTC_TIMESTAMP(3) + INTERVAL 30 MINUTE, UTC_TIMESTAMP(3));",
    [adminId, adminId, adminId, token], "nestghana_e2e",
  );
  const cookie = { Cookie: `nestgh-admin=${token}` };
  const dashboard = await (await fetch(`${BASE}/admin`, { headers: cookie })).text();
  assert.ok(dashboard.includes("E2E single room in Ho") && dashboard.includes("Overview"), "dashboard lists the submission");
  for (const page of ["/admin/listings", "/admin/payments", "/admin/reports", "/admin/messages", "/admin/settings"]) {
    const res = await fetch(`${BASE}${page}`, { headers: cookie });
    assert.equal(res.status, 200, page);
    assert.ok((await res.text()).includes("ngd-tabs"), `${page} renders the admin frame`);
  }
  const detail = await fetch(`${BASE}/admin/listings/${row.id}`, { headers: cookie });
  const detailHtml = await detail.text();
  assert.equal(detail.status, 200);
  for (const text of ["Review this listing", "Plot 12, Ahoe road", "e2e.owner@example.com", checkout.reference]) {
    assert.ok(detailHtml.includes(text), `review page shows ${text}`);
  }
  assert.match(detailHtml, /Photos \((<!-- -->)?6(<!-- -->)?\)/, "review page lists 6 photos");
  assert.equal((await fetch(`${BASE}/api/admin/images/${image.id}`, { headers: cookie })).status, 200, "admin sees pending photo");
  step("admin dashboard and review page show the submission, address, owner, payment and photos");

  // ── Approval (same database steps as the admin review action) ──
  await sql(
    "SET @nestgh_status_transition = 1; UPDATE listings SET status = 'LIVE', approved_by = ?, approved_at = UTC_TIMESTAMP(3), last_confirmed_at = UTC_TIMESTAMP(3) WHERE id = ?; SET @nestgh_status_transition = NULL; UPDATE listing_images SET approved_for_public = 1 WHERE listing_id = ? AND category <> 'PROFILE';",
    [adminId, row.id, row.id], "nestghana_e2e",
  );
  const rooms = await (await fetch(`${BASE}/api/listings?category=room`)).json();
  const pub = rooms.rows.find(r => r.id === row.id);
  assert.ok(pub, "approved listing is public");
  assert.equal(pub.public_data.photos.length, 5, "profile photo stays private");
  assert.equal(pub.public_data.lm, "Ahoe junction");
  const photo = await fetch(BASE + pub.public_data.photos[0]);
  assert.equal(photo.status, 200);
  assert.equal(photo.headers.get("content-type"), "image/jpeg");
  const [profile] = await sql("SELECT id FROM listing_images WHERE listing_id = ? AND category = 'PROFILE'", [row.id], "nestghana_e2e");
  assert.equal((await fetch(`${BASE}/api/images/${profile.id}`)).status, 404);
  assert.ok(!JSON.stringify(rooms).includes("Plot 12"), "exact address stays private");
  step("approved listing is public with its photos; address and profile photo stay private");

  console.log("\nEnd-to-end flow passed.");
} catch (error) {
  failed = true;
  console.error("\n✖ End-to-end flow failed:", error);
} finally {
  if (server) {
    if (process.platform === "win32") { try { execSync(`taskkill /pid ${server.pid} /T /F`, { stdio: "ignore" }); } catch {} }
    else { try { process.kill(-server.pid, "SIGTERM"); } catch { server.kill(); } }
  }
  fake.close();
  rmSync(storage, { recursive: true, force: true });
  await sql("DROP DATABASE IF EXISTS nestghana_e2e;").catch(() => {});
}
process.exit(failed ? 1 : 0);
