import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const secure = process.env.NODE_ENV === "production";
  // Cloudflare Turnstile (bot protection) loads a script and an iframe when it is configured.
  const turnstile = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? " https://challenges.cloudflare.com" : "";
  const policy = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self' https://checkout.paystack.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data: blob:",
    `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
    // React's development build needs eval() for its error overlay; production never allows it.
    `script-src 'self' 'nonce-${nonce}'${turnstile}${secure ? "" : " 'unsafe-eval'"}`,
    `frame-src 'self'${turnstile}`,
    "connect-src 'self'",
    "font-src 'self' https://fonts.gstatic.com",
    // Only upgrade in production: the dev server is plain HTTP, so upgrading breaks every asset when opened via a LAN IP.
    ...(secure ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", policy);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
