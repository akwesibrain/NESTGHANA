import "server-only";
import { createHmac } from "node:crypto";
import { getDb } from "./db";

/** HMAC of the client IP so raw addresses are never stored. */
export function hashIp(ip: string): Uint8Array<ArrayBuffer> {
  const secret = process.env.IP_HASH_SECRET;
  if (!secret) throw new Error("IP_HASH_SECRET is not configured.");
  return new Uint8Array(createHmac("sha256", secret).update(ip).digest());
}

export function clientIp(request: Request): string {
  // Netlify sets x-nf-client-connection-ip; fall back to the first x-forwarded-for hop locally.
  return (
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/**
 * Fixed-window counter (port of consume_rate_limit). Atomic: a single upsert statement both
 * resets an expired window and increments the count.
 */
export async function consumeRateLimit(endpoint: string, key: Uint8Array<ArrayBuffer>, maxRequests: number, windowSeconds: number) {
  const db = getDb();
  await db.$executeRaw`
    INSERT INTO rate_limit_counters (endpoint, key_sha256, window_started_at, request_count, created_at, updated_at)
    VALUES (${endpoint}, ${key}, NOW(3), 1, NOW(3), NOW(3))
    ON DUPLICATE KEY UPDATE
      request_count = IF(window_started_at <= NOW(3) - INTERVAL ${windowSeconds} SECOND, 1, request_count + 1),
      window_started_at = IF(window_started_at <= NOW(3) - INTERVAL ${windowSeconds} SECOND, NOW(3), window_started_at),
      updated_at = NOW(3)`;
  const counter = await db.rateLimitCounter.findUniqueOrThrow({
    where: { endpoint_keySha256: { endpoint, keySha256: key } },
    select: { requestCount: true, windowStartedAt: true },
  });
  const retryAfterSeconds = Math.max(
    0,
    Math.ceil((counter.windowStartedAt.getTime() + windowSeconds * 1000 - Date.now()) / 1000),
  );
  return { allowed: counter.requestCount <= maxRequests, retryAfterSeconds };
}
