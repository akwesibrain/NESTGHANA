// Admin authentication: password hashing, TOTP, lockout, sessions and MFA (run via `npm run test:db`).
import { after, test } from "node:test";
import assert from "node:assert/strict";
import { getDb } from "@/lib/server/db";
import {
  base32Encode,
  currentTotpStep,
  decryptSecret,
  encryptSecret,
  hashPassword,
  totpCode,
  verifyPassword,
  verifyTotp,
} from "@/lib/server/admin-crypto";
import {
  authenticatePassword,
  createSession,
  findSession,
  getPendingMfaSecret,
  MAX_FAILED_LOGINS,
  revokeSession,
  verifySessionMfa,
} from "@/lib/server/admin-auth";

const db = getDb();
after(() => db.$disconnect());

async function newAdmin(email: string, password = "correct horse battery") {
  return db.adminUser.create({
    data: { email, passwordHash: await hashPassword(password), roles: { create: { role: "ADMIN" } } },
  });
}

test("password hashes verify only the right password", async () => {
  const hash = await hashPassword("s3cret-password!");
  assert.match(hash, /^scrypt\$/);
  assert.equal(await verifyPassword("s3cret-password!", hash), true);
  assert.equal(await verifyPassword("wrong", hash), false);
  assert.notEqual(hash, await hashPassword("s3cret-password!"), "salted");
});

test("TOTP matches the RFC 6238 test vector and rejects replays", () => {
  const secret = base32Encode(Buffer.from("12345678901234567890"));
  assert.equal(secret, "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ");
  assert.equal(totpCode(secret, 1), "287082"); // T = 59 s
  const now = 59_000;
  assert.equal(verifyTotp(secret, "287082", null, now), 1);
  assert.equal(verifyTotp(secret, "287082", 1, now), null, "same step cannot be reused");
  assert.equal(verifyTotp(secret, "000000", null, now), null);
});

test("MFA secrets are encrypted and tamper-evident", () => {
  const sealed = encryptSecret("JBSWY3DPEHPK3PXP");
  assert.ok(!sealed.includes("JBSWY3DPEHPK3PXP"));
  assert.equal(decryptSecret(sealed), "JBSWY3DPEHPK3PXP");
  const parts = sealed.split(".");
  parts[3] = Buffer.from("tampered").toString("base64url");
  assert.throws(() => decryptSecret(parts.join(".")));
});

test("wrong passwords lock the account after the limit", async () => {
  const admin = await newAdmin("lockout@test.local");
  for (let i = 1; i < MAX_FAILED_LOGINS; i++) {
    assert.deepEqual(await authenticatePassword("lockout@test.local", "nope", null), { ok: false, reason: "credentials" });
  }
  assert.deepEqual(await authenticatePassword("lockout@test.local", "nope", null), { ok: false, reason: "locked" });
  // Even the right password is refused while locked.
  assert.deepEqual(await authenticatePassword("lockout@test.local", "correct horse battery", null), { ok: false, reason: "locked" });
  const locked = await db.adminUser.findUniqueOrThrow({ where: { id: admin.id } });
  assert.ok(locked.lockedUntil && locked.lockedUntil > new Date());
});

test("unknown emails and users without a role are rejected like wrong passwords", async () => {
  assert.deepEqual(await authenticatePassword("nobody@test.local", "whatever", null), { ok: false, reason: "credentials" });
  await db.adminUser.create({ data: { email: "norole@test.local", passwordHash: await hashPassword("correct horse battery") } });
  assert.deepEqual(await authenticatePassword("norole@test.local", "correct horse battery", null), { ok: false, reason: "credentials" });
});

test("sign-in → MFA enrolment → verified session; codes cannot be replayed", async () => {
  const admin = await newAdmin("Flow@Test.local".toLowerCase());
  const result = await authenticatePassword("FLOW@test.local", "correct horse battery", null);
  assert.deepEqual(result, { ok: true, userId: admin.id }, "email match is case-insensitive");

  const token = await createSession(admin.id, null, "test-agent");
  const before = await findSession(token);
  assert.ok(before);
  assert.equal(before.mfaVerified, false);
  assert.equal(before.user.mfaEnrolled, false);
  assert.deepEqual(before.roles, ["ADMIN"]);

  const secret = await getPendingMfaSecret(admin.id);
  assert.equal(await getPendingMfaSecret(admin.id), secret, "pending secret is stable until confirmed");
  assert.equal(await verifySessionMfa(before, "123456".replace(/./g, "9")), false);
  const code = totpCode(secret, currentTotpStep());
  assert.equal(await verifySessionMfa(before, code), true);

  const after = await findSession(token);
  assert.ok(after);
  assert.equal(after.mfaVerified, true);
  assert.equal(after.user.mfaEnrolled, true);
  const stored = await db.adminUser.findUniqueOrThrow({ where: { id: admin.id } });
  assert.ok(stored.mfaSecretEnc && !stored.mfaSecretEnc.includes(secret), "secret stored encrypted");

  // A second session cannot reuse the same code.
  const second = await findSession(await createSession(admin.id, null, null));
  assert.ok(second);
  assert.equal(await verifySessionMfa(second, code), false);

  await revokeSession(token);
  assert.equal(await findSession(token), null, "revoked sessions are rejected");
});

test("expired and unknown sessions are rejected; only token hashes are stored", async () => {
  const admin = await newAdmin("expiry@test.local");
  const token = await createSession(admin.id, null, null);
  const row = await db.adminSession.findFirstOrThrow({ where: { userId: admin.id } });
  assert.ok(!Buffer.from(row.tokenSha256).toString("base64url").includes(token));
  await db.adminSession.update({ where: { id: row.id }, data: { expiresAt: new Date(Date.now() - 1000) } });
  assert.equal(await findSession(token), null);
  assert.equal(await findSession("not-a-real-token"), null);
  assert.equal(await findSession(undefined), null);
});

test("deactivated admins lose their sessions", async () => {
  const admin = await newAdmin("inactive@test.local");
  const token = await createSession(admin.id, null, null);
  assert.ok(await findSession(token));
  await db.adminUser.update({ where: { id: admin.id }, data: { isActive: false } });
  assert.equal(await findSession(token), null);
});
