import Link from "next/link";

export const metadata = { title: "Privacy notice" };

export default function PrivacyPage() {
  return (
    <main className="info-page">
      <Link className="logo" href="/">NestGH</Link>
      <p className="eyebrow">Your information</p>
      <h1>Privacy notice</h1>
      <p>NestGH is preparing its secure listing-submission service. This staging website currently lets visitors browse published listings; owner submissions and payments are not enabled.</p>
      <h2>Browser storage</h2>
      <p>The cookie preference control stores your choice in this browser. Optional analytics and advertising cookies are not currently active. Essential authentication storage is used only when an administrator signs in.</p>
      <h2>Contact</h2>
      <p>Do not submit personal or payment information through this staging website. Contact the NestGH team through its official public channels for privacy questions.</p>
      <Link className="info-link" href="/">Return to NestGH</Link>
    </main>
  );
}
