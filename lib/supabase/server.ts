import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function supabaseEnvironment() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!url.startsWith("https://")) throw new Error("NEXT_PUBLIC_SUPABASE_URL must use HTTPS.");
  return { url, key };
}

export async function createSupabaseServerClient() {
  const environment = supabaseEnvironment();
  if (!environment) return null;
  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";
  return createServerClient(environment.url, environment.key, {
    cookieOptions: {
      name: "nestgh-admin-auth",
      path: "/",
      sameSite: "strict",
      secure,
      httpOnly: true,
      maxAge: 30 * 60,
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, {
              ...options,
              path: "/",
              sameSite: "strict",
              secure,
              httpOnly: true,
              maxAge: 30 * 60,
            });
          }
        } catch (error) {
          console.error("supabase_cookie_refresh_failed", error instanceof Error ? error.name : "unknown");
        }
      },
    },
  });
}
