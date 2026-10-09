import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// Minimal Paystack client (https://paystack.com/docs/api/). PAYSTACK_API_BASE exists only so tests
// can point at a local fake; production always uses the real API.

const DEFAULT_BASE = "https://api.paystack.co";

export function paystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  if (process.env.NODE_ENV === "production" && !key.startsWith("sk_")) throw new Error("PAYSTACK_SECRET_KEY is invalid.");
  return key;
}

/** The override is ignored in production builds, so a live site always talks to the real Paystack. */
function testApiBase(): string | null {
  return process.env.NODE_ENV !== "production" && process.env.PAYSTACK_API_BASE ? process.env.PAYSTACK_API_BASE : null;
}

function apiBase(): string {
  return testApiBase() ?? DEFAULT_BASE;
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiBase() + path, {
    ...init,
    headers: { Authorization: `Bearer ${secretKey()}`, "Content-Type": "application/json", ...init?.headers },
    signal: AbortSignal.timeout(15_000),
  });
  const body = (await response.json().catch(() => null)) as { status?: boolean; data?: T; message?: string } | null;
  if (!response.ok || body?.status !== true || !body.data) {
    throw new Error(`Paystack request failed (${response.status}).`);
  }
  return body.data;
}

export type PaystackTransaction = {
  id: number;
  status: string;
  reference: string;
  amount: number;
  currency: string;
};

export function initializeTransaction(input: {
  email: string;
  amountPesewas: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, string>;
}) {
  return call<{ authorization_url: string; reference: string }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: input.amountPesewas,
      currency: "GHS",
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  });
}

export function verifyTransaction(reference: string) {
  return call<PaystackTransaction>(`/transaction/verify/${encodeURIComponent(reference)}`);
}

/** Paystack signs webhook bodies with HMAC-SHA512 of the secret key (x-paystack-signature). */
export function validWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature || !/^[0-9a-f]{128}$/i.test(signature)) return false;
  const expected = createHmac("sha512", secretKey()).update(rawBody).digest();
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}

/** Only real Paystack checkout pages may be handed to the browser. */
export function isPaystackCheckoutUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const testBase = testApiBase();
    if (testBase && url.origin === new URL(testBase).origin) return true;
    return url.protocol === "https:" && (url.hostname === "paystack.com" || url.hostname.endsWith(".paystack.com"));
  } catch {
    return false;
  }
}
