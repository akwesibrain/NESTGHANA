import Link from "next/link";
import { redirect } from "next/navigation";
import { verifyAdminMfa } from "@/app/admin/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SearchParams = Promise<{ error?: string; returnTo?: string }>;

const errors: Record<string, string> = {
  code: "The verification code was not accepted. Check the code and try again.",
  challenge: "Could not create a verification challenge. Please try again.",
};

export default async function VerifyAdminPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin?error=configuration");
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) redirect("/admin");
  const { data: assurance, error: assuranceError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assuranceError) redirect("/admin?error=mfa_required");
  if (assurance.currentLevel === "aal2") redirect("/admin");
  const returnTo = typeof params.returnTo === "string" && params.returnTo.startsWith("/admin/") ? params.returnTo : "/admin";

  return (
    <main className="auth-panel">
      <form className="auth-card" action={verifyAdminMfa}>
        <Link className="brand auth-brand" href="/"><span className="brand-copy"><strong>NestGH.</strong><small>ADMIN WORKSPACE</small></span></Link>
        <p className="eyebrow">Multi-factor authentication</p>
        <h1>Verify your sign-in</h1>
        <p>Enter the current code from your registered authenticator app.</p>
        {params.error && errors[params.error] ? <p className="auth-error" role="alert">{errors[params.error]}</p> : null}
        <input type="hidden" name="returnTo" value={returnTo} />
        <label htmlFor="code">Authenticator code</label>
        <input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" minLength={6} maxLength={8} required />
        <button className="primary-button" type="submit">Verify and continue</button>
      </form>
    </main>
  );
}
