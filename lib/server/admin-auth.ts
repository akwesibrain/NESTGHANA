import "server-only";
import { createHash, randomBytes } from "node:crypto";
import type { AdminRole, Prisma, SecuritySeverity } from "@/generated/prisma/client";
import {
  decryptSecret,
  encryptSecret,
  generateTotpSecret,
  getDummyPasswordHash,
  verifyPassword,
  verifyTotp,
} from "./admin-crypto";
import { getDb } from "./db";

// Admin accounts, sessions and MFA (replaces Supabase Auth). Cookie handling lives in
// admin-session.ts; everything here works on plain values so it can be tested directly.

export const SESSION_IDLE_MS = 30 * 60 * 1000;
export const SESSION_ABSOLUTE_MS = 12 * 60 * 60 * 1000;
export const MAX_FAILED_LOGINS = 5;
export const LOCKOUT_MS = 15 * 60 * 1000;

const sha256 = (value: string) => new Uint8Array(createHash("sha256").update(value).digest());

export async function logSecurityEvent(
  eventType: string,
  severity: SecuritySeverity,
  details: { actorId?: string | null; ipHash?: Uint8Array<ArrayBuffer> | null; metadata?: Prisma.InputJsonObject } = {},
) {
  try {
    await getDb().securityEvent.create({
      data: {
        eventType,
        severity,
        actorId: details.actorId ?? null,
        ipHash: details.ipHash ?? null,
        resourceType: "ADMIN_USER",
        resourceId: details.actorId ?? null,
        safeMetadata: details.metadata ?? {},
      },
    });
  } catch (error) {
    console.error("security_event_log_failed", error instanceof Error ? error.message : "unknown");
  }
}

export type PasswordResult = { ok: true; userId: string } | { ok: false; reason: "credentials" | "locked" };

/**
 * Checks an email/password pair. Unknown emails, wrong passwords and inactive accounts all return
 * "credentials" after the same amount of hashing work. Five failures lock the account for 15 minutes.
 */
export async function authenticatePassword(
  email: string,
  password: string,
  ipHash: Uint8Array<ArrayBuffer> | null,
): Promise<PasswordResult> {
  const db = getDb();
  const user = await db.adminUser.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: { id: true, passwordHash: true, isActive: true, lockedUntil: true, failedLoginCount: true, roles: { select: { role: true } } },
  });

  if (!user) {
    await verifyPassword(password, await getDummyPasswordHash());
    await logSecurityEvent("ADMIN_LOGIN_FAILED", "WARN", { ipHash, metadata: { reason: "unknown_email" } });
    return { ok: false, reason: "credentials" };
  }
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    await logSecurityEvent("ADMIN_LOGIN_BLOCKED", "WARN", { actorId: user.id, ipHash, metadata: { reason: "locked" } });
    return { ok: false, reason: "locked" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid || !user.isActive || user.roles.length === 0) {
    const failures = user.failedLoginCount + 1;
    const lock = failures >= MAX_FAILED_LOGINS;
    await db.adminUser.update({
      where: { id: user.id },
      data: lock
        ? { failedLoginCount: 0, lockedUntil: new Date(Date.now() + LOCKOUT_MS) }
        : { failedLoginCount: failures },
    });
    await logSecurityEvent(lock ? "ADMIN_ACCOUNT_LOCKED" : "ADMIN_LOGIN_FAILED", "WARN", {
      actorId: user.id,
      ipHash,
      metadata: { reason: !valid ? "password" : !user.isActive ? "inactive" : "no_role" },
    });
    return { ok: false, reason: lock ? "locked" : "credentials" };
  }

  await db.adminUser.update({ where: { id: user.id }, data: { failedLoginCount: 0, lockedUntil: null } });
  return { ok: true, userId: user.id };
}

/** Creates a session and returns the raw token for the cookie. Only its SHA-256 is stored. */
export async function createSession(userId: string, ipHash: Uint8Array<ArrayBuffer> | null, userAgent: string | null) {
  const token = randomBytes(32).toString("base64url");
  await getDb().adminSession.create({
    data: {
      userId,
      tokenSha256: sha256(token),
      ipHash,
      userAgent: userAgent?.slice(0, 255) ?? null,
      expiresAt: new Date(Date.now() + SESSION_IDLE_MS),
    },
  });
  return token;
}

export type AdminContext = {
  sessionId: string;
  mfaVerified: boolean;
  user: { id: string; email: string; displayName: string; mfaEnrolled: boolean };
  roles: AdminRole[];
};

/** Resolves a session token, enforcing idle/absolute expiry, revocation and account status. */
export async function findSession(token: string | undefined): Promise<AdminContext | null> {
  if (!token || token.length > 100) return null;
  const db = getDb();
  const session = await db.adminSession.findUnique({
    where: { tokenSha256: sha256(token) },
    include: {
      user: {
        select: { id: true, email: true, displayName: true, isActive: true, mfaEnabledAt: true, roles: { select: { role: true } } },
      },
    },
  });
  const now = Date.now();
  if (
    !session ||
    session.revokedAt ||
    session.expiresAt.getTime() <= now ||
    session.createdAt.getTime() + SESSION_ABSOLUTE_MS <= now ||
    !session.user.isActive ||
    session.user.roles.length === 0
  ) {
    return null;
  }

  // Sliding idle expiry, written at most once a minute.
  if (now - session.lastSeenAt.getTime() > 60_000) {
    await db.adminSession.update({
      where: { id: session.id },
      data: {
        lastSeenAt: new Date(now),
        expiresAt: new Date(Math.min(now + SESSION_IDLE_MS, session.createdAt.getTime() + SESSION_ABSOLUTE_MS)),
      },
    });
  }

  return {
    sessionId: session.id,
    mfaVerified: Boolean(session.mfaVerifiedAt && session.user.mfaEnabledAt),
    user: {
      id: session.user.id,
      email: session.user.email,
      displayName: session.user.displayName,
      mfaEnrolled: Boolean(session.user.mfaEnabledAt),
    },
    roles: session.user.roles.map(r => r.role),
  };
}

export async function revokeSession(token: string | undefined) {
  if (!token) return;
  await getDb().adminSession.updateMany({ where: { tokenSha256: sha256(token), revokedAt: null }, data: { revokedAt: new Date() } });
}

/**
 * Returns the secret for an admin who has not finished MFA setup, creating one on first use.
 * The secret stays pending (mfaEnabledAt = null) until a valid code confirms it.
 */
export async function getPendingMfaSecret(userId: string): Promise<string> {
  const db = getDb();
  const user = await db.adminUser.findUniqueOrThrow({ where: { id: userId }, select: { mfaSecretEnc: true, mfaEnabledAt: true } });
  if (user.mfaEnabledAt) throw new Error("MFA is already enrolled.");
  if (user.mfaSecretEnc) {
    try {
      return decryptSecret(user.mfaSecretEnc);
    } catch {
      // Key rotated or data corrupted: issue a fresh secret below.
    }
  }
  const secret = generateTotpSecret();
  await db.adminUser.update({ where: { id: userId }, data: { mfaSecretEnc: encryptSecret(secret), mfaLastStep: null } });
  return secret;
}

/**
 * Verifies an authenticator code for this session. Completes enrolment on first success and marks
 * the session MFA-verified. Each code works once.
 */
export async function verifySessionMfa(context: AdminContext, code: string): Promise<boolean> {
  const db = getDb();
  const user = await db.adminUser.findUniqueOrThrow({
    where: { id: context.user.id },
    select: { mfaSecretEnc: true, mfaEnabledAt: true, mfaLastStep: true },
  });
  if (!user.mfaSecretEnc) return false;

  let secret: string;
  try {
    secret = decryptSecret(user.mfaSecretEnc);
  } catch {
    return false;
  }
  const lastStep = user.mfaLastStep === null ? null : Number(user.mfaLastStep);
  const step = verifyTotp(secret, code, lastStep);
  if (step === null) {
    await logSecurityEvent("ADMIN_MFA_FAILED", "WARN", { actorId: context.user.id });
    return false;
  }

  const now = new Date();
  // The conditional update makes concurrent use of the same code fail for all but one request.
  const claimed = await db.adminUser.updateMany({
    where: { id: context.user.id, OR: [{ mfaLastStep: null }, { mfaLastStep: { lt: step } }] },
    data: { mfaLastStep: step, lastLoginAt: now, ...(user.mfaEnabledAt ? {} : { mfaEnabledAt: now }) },
  });
  if (claimed.count !== 1) return false;

  await db.adminSession.update({ where: { id: context.sessionId }, data: { mfaVerifiedAt: now } });
  await logSecurityEvent(user.mfaEnabledAt ? "ADMIN_LOGIN_SUCCEEDED" : "ADMIN_MFA_ENROLLED", "INFO", { actorId: context.user.id });
  return true;
}

export function hasRole(context: AdminContext, allowed: AdminRole[]) {
  return context.roles.some(role => allowed.includes(role));
}
