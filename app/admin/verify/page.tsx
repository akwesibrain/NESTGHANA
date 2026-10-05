import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { signOutAdmin, verifyAdminMfa } from "@/app/admin/actions";
import { getPendingMfaSecret } from "@/lib/server/admin-auth";
import { totpUri } from "@/lib/server/admin-crypto";
import { getAdminContext } from "@/lib/server/admin-session";
import "../admin.css";

type SearchParams = Promise<{ error?: string }>;

const errors: Record<string, string> = {
  code: "The verification code was not accepted. Check the code and try again.",
  rate_limited: "Too many attempts. Wait a few minutes, then try again.",
};

export default async function VerifyAdminPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const context = await getAdminContext();
  if (!context) redirect("/admin");
  if (context.mfaVerified) redirect("/admin");

  const enrolling = !context.user.mfaEnrolled;
  let setup: { secret: string; qr: string; uri: string } | null = null;
  if (enrolling) {
    const secret = await getPendingMfaSecret(context.user.id);
    const uri = totpUri(secret, context.user.email);
    setup = { secret, uri, qr: await QRCode.toDataURL(uri, { margin: 1, width: 220 }) };
  }

  return (
    <main className="auth-panel">
      <form className="auth-card" action={verifyAdminMfa}>
        <Link className="brand auth-brand" href="/"><span className="brand-copy"><strong>NestGH.</strong><small>ADMIN WORKSPACE</small></span></Link>
        <p className="eyebrow">Multi-factor authentication</p>
        {setup ? (
          <>
            <h1>Set up your authenticator</h1>
            <p>Scan this code with an authenticator app (Google Authenticator, Microsoft Authenticator, Authy or 1Password), then enter the 6-digit code it shows.</p>
            <Image src={setup.qr} alt="QR code for your authenticator app" width={220} height={220} unoptimized />
            <p>Can&apos;t scan? Enter this key manually:</p>
            <p><code>{setup.secret.match(/.{1,4}/g)?.join(" ")}</code></p>
          </>
        ) : (
          <>
            <h1>Verify your sign-in</h1>
            <p>Enter the current code from your authenticator app.</p>
          </>
        )}
        {params.error && errors[params.error] ? <p className="auth-error" role="alert">{errors[params.error]}</p> : null}
        <label htmlFor="code">Authenticator code</label>
        <input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength={6} maxLength={6} required autoFocus />
        <button className="primary-button" type="submit">{setup ? "Confirm and continue" : "Verify and continue"}</button>
      </form>
      <form action={signOutAdmin}><button className="secondary-button" type="submit">Cancel and sign out</button></form>
    </main>
  );
}
