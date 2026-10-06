import "server-only";

// Request helpers shared by the public POST endpoints.

/**
 * Rejects cross-site browser requests. Same-origin fetches carry an Origin matching the Host; other
 * sites' pages cannot forge it. Requests without Origin (non-browser clients) are allowed through,
 * as they carry no visitor cookies to abuse.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Base URL that Paystack sends the owner back to after checkout. */
export function siteBaseUrl(request: Request): string {
  const configured = process.env.PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/+$/, "");
  const origin = request.headers.get("origin");
  if (origin && isSameOrigin(request)) return origin;
  return new URL(request.url).origin;
}

export function json(body: unknown, status = 200, headers?: HeadersInit) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}
