import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  // Supabase origins stay allowed until the legacy browser payment flow is replaced (workflow step 5).
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secure = process.env.NODE_ENV === "production";
  const supabaseOrigin = url ? new URL(url).origin : "";
  const browserSupabaseOrigin = "https://plbtnltcocsuekifddat.supabase.co";
  const policy = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self' https://checkout.paystack.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data: blob: https://*.supabase.co",
    `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
    `script-src 'self' 'nonce-${nonce}'`,
    `connect-src 'self' ${browserSupabaseOrigin}${supabaseOrigin && supabaseOrigin !== browserSupabaseOrigin ? ` ${supabaseOrigin}` : ""}`,
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
