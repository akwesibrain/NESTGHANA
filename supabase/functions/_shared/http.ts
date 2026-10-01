import { allowedCorsOrigin } from "./cors-policy.mjs";

export function isAllowedBrowserOrigin(request: Request): boolean {
  const origin = request.headers.get("Origin");
  if (!origin) return true;
  return allowedCorsOrigin(origin, Deno.env.get("PUBLIC_SITE_ORIGINS") ?? "") !== null;
}

export function corsHeaders(request: Request): HeadersInit {
  const origin = allowedCorsOrigin(
    request.headers.get("Origin"),
    Deno.env.get("PUBLIC_SITE_ORIGINS") ?? "",
  );
  return {
    ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
    "Vary": "Origin",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, paystack-signature",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

export function jsonResponse(body: unknown, status = 200, request?: Request): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...(request ? corsHeaders(request) : {}),
      "Content-Type": "application/json",
    },
  });
}

export function env(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing server configuration: ${name}`);
  return value;
}
