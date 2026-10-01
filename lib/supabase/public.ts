import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let publicClient: SupabaseClient | undefined;

export function getPublicSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!url.startsWith("https://")) throw new Error("NEXT_PUBLIC_SUPABASE_URL must use HTTPS.");
  publicClient ??= createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return publicClient;
}
