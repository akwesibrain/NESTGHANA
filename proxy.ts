import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const secure = process.env.NODE_ENV === "production";
  const supabaseOrigin = url ? new URL(url).origin : "";
  const policy = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self' https://checkout.paystack.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "img-src 'self' data: blob: https://*.supabase.co",
    "font-src 'self'",
    `style-src 'self' 'nonce-${nonce}'`,
    `script-src 'self' 'nonce-${nonce}'`,
    `connect-src 'self'${supabaseOrigin ? ` ${supabaseOrigin}` : ""}`,
    "upgrade-insecure-requests",
  ].join("; ");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", policy);
  let response = NextResponse.next({ request: { headers: requestHeaders } });

  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookieOptions: {
        name: "nestgh-admin-auth",
        path: "/",
        sameSite: "strict",
        secure,
        httpOnly: true,
        maxAge: 30 * 60,
      },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set(name, value);
            response = NextResponse.next({ request: { headers: requestHeaders } });
            response.cookies.set(name, value, {
              ...options,
              path: "/",
              sameSite: "strict",
              secure,
              httpOnly: true,
              maxAge: 30 * 60,
            });
          }
        },
      },
    });
    await supabase.auth.getUser();
  }
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
