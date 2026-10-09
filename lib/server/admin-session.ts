import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { AdminRole } from "@/generated/prisma/client";
import { type AdminContext, findSession, hasRole } from "./admin-auth";

// Session cookie handling for the admin workspace. In production the __Host- prefix pins the
// cookie to this exact origin over HTTPS; local development runs over plain HTTP.
const secure = process.env.NODE_ENV === "production";
export const ADMIN_COOKIE = secure ? "__Host-nestgh-admin" : "nestgh-admin";

export async function readSessionToken() {
  return (await cookies()).get(ADMIN_COOKIE)?.value;
}

/** Only callable from server actions / route handlers (pages cannot set cookies). */
export async function setSessionCookie(token: string) {
  // No maxAge: a browser-session cookie. Expiry is enforced server-side in admin_sessions.
  (await cookies()).set(ADMIN_COOKIE, token, { httpOnly: true, secure, sameSite: "strict", path: "/" });
}

export async function clearSessionCookie() {
  (await cookies()).delete(ADMIN_COOKIE);
}

export async function requestMeta() {
  const h = await headers();
  return {
    ip: h.get("x-nf-client-connection-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown",
    userAgent: h.get("user-agent"),
  };
}

export async function getAdminContext(): Promise<AdminContext | null> {
  return findSession(await readSessionToken());
}

/**
 * Guards admin pages and actions: signed in, MFA verified and (optionally) holding one of `roles`.
 * Redirects otherwise.
 */
export async function requireAdmin(roles?: AdminRole[]): Promise<AdminContext> {
  const context = await getAdminContext();
  if (!context) redirect("/admin");
  if (!context.mfaVerified) redirect("/admin/verify");
  if (roles && !hasRole(context, roles)) redirect("/admin?error=forbidden");
  return context;
}

/** Public base URL for links sent to owners (PUBLIC_SITE_URL, else this request's host). */
export async function siteBase(): Promise<string> {
  const configured = process.env.PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/+$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "production" ? "https" : "http");
  return `${proto}://${host}`;
}
