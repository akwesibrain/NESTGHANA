import "server-only";

// Cloudflare Turnstile bot protection. Off until TURNSTILE_SECRET_KEY and
// NEXT_PUBLIC_TURNSTILE_SITE_KEY are set; then listing submissions and admin sign-ins must carry a
// token that Cloudflare confirms server-side.

export function turnstileSiteKey(): string | null {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || null;
}

export function turnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && turnstileSiteKey());
}

/** True when the token is valid, or when Turnstile is not configured. */
export async function verifyTurnstile(token: unknown, ip: string | null): Promise<boolean> {
  if (!turnstileEnabled()) return true;
  if (typeof token !== "string" || !token || token.length > 2048) return false;
  const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: token });
  if (ip && ip !== "unknown") body.set("remoteip", ip);
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(10_000),
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch (error) {
    console.error("turnstile_verify_failed", error instanceof Error ? error.message : "unknown");
    return false;
  }
}
