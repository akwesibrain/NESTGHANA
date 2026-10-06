import "server-only";
import { createHash, randomBytes } from "node:crypto";
import type { Prisma } from "@/generated/prisma/client";
import { getDb } from "./db";

// Owner manage links. Owners have no accounts: a secret link lets them confirm availability, mark
// a listing as taken, or fix and resubmit it when changes are requested. Only the SHA-256 of the
// token is stored; the link itself is shown/sent to the owner and never kept in plain text
// (except briefly inside an unsent outbox message, which is redacted once handled).

export const MANAGE_LINK_DAYS = 365;
const hash = (token: string) => new Uint8Array(createHash("sha256").update(token).digest());
type Db = Prisma.TransactionClient | ReturnType<typeof getDb>;

export async function createManageLink(listingId: string, db: Db = getDb()): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await db.manageLinkToken.create({
    data: {
      listingId,
      tokenSha256: hash(token),
      purpose: "MANAGE_LISTING",
      expiresAt: new Date(Date.now() + MANAGE_LINK_DAYS * 86_400_000),
    },
  });
  return token;
}

export const manageUrl = (base: string, token: string) => `${base.replace(/\/+$/, "")}/manage/${token}`;

/** Resolves a manage token to its listing, or null if unknown, expired or revoked. */
export async function findManageToken(token: string) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const row = await getDb().manageLinkToken.findUnique({ where: { tokenSha256: hash(token) }, select: { id: true, listingId: true, expiresAt: true, revokedAt: true } });
  if (!row || row.revokedAt || row.expiresAt <= new Date()) return null;
  return { tokenId: row.id, listingId: row.listingId };
}

export async function logManageUse(input: { tokenId: string | null; listingId: string | null; action: string; succeeded: boolean; ipHash: Uint8Array<ArrayBuffer> | null }) {
  try {
    await getDb().manageLinkUsage.create({ data: { ...input, action: input.action.slice(0, 80) } });
  } catch (error) {
    console.error("manage_usage_log_failed", error instanceof Error ? error.message : "unknown");
  }
}

/** Revokes every active link for a listing (e.g. if a link leaked). */
export async function revokeManageLinks(listingId: string) {
  const result = await getDb().manageLinkToken.updateMany({ where: { listingId, revokedAt: null }, data: { revokedAt: new Date() } });
  return result.count;
}
