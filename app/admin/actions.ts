"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function safeReturnPath(value: FormDataEntryValue | null): string {
  return typeof value === "string" && value.startsWith("/admin") && !value.startsWith("//")
    ? value
    : "/admin";
}

export async function signInAdmin(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 256) {
    redirect("/admin?error=invalid");
  }
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin?error=configuration");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) redirect("/admin?error=credentials");

  const { data: roles, error: roleError } = await supabase
    .from("admin_roles")
    .select("role")
    .eq("user_id", data.user.id);
  if (roleError || !roles?.length) {
    await supabase.auth.signOut();
    redirect("/admin?error=unauthorized");
  }
  redirect("/admin/verify");
}

export async function verifyAdminMfa(formData: FormData) {
  const code = String(formData.get("code") || "").replace(/\s/g, "");
  const returnTo = safeReturnPath(formData.get("returnTo"));
  if (!/^\d{6,8}$/.test(code)) redirect(`/admin/verify?returnTo=${encodeURIComponent(returnTo)}&error=code`);
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin?error=configuration");

  const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
  const factor = factors?.totp.find((item) => item.status === "verified");
  if (factorsError || !factor) redirect("/admin?error=mfa_required");
  const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: factor.id });
  if (challengeError || !challenge) redirect("/admin/verify?error=challenge");
  const { error: verifyError } = await supabase.auth.mfa.verify({
    factorId: factor.id,
    challengeId: challenge.id,
    code,
  });
  if (verifyError) redirect("/admin/verify?error=code");
  redirect(returnTo);
}

export async function signOutAdmin() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin");
}
