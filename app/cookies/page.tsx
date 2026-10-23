import Link from "next/link";

export const metadata = { title: "Cookie Policy" };

export default function CookiesPage() {
  return (
    <main className="info-page">
      <Link className="logo" href="/">NestGH</Link>
      <p className="eyebrow">Browser storage</p>
      <h1>Cookie Policy</h1>
      <p><strong>Last updated: 23 October 2026</strong></p>

      <h2>What we use</h2>
      <p>NestGH uses a small amount of browser storage to keep parts of the service working. The current site does not use analytics or advertising cookies.</p>
      <ul>
        <li><strong>Saved rooms:</strong> your favourite listing IDs are stored in local storage on your device under <code>nestgh_saved_rooms_v1</code>. They stay there until you clear the site’s browser data.</li>
        <li><strong>Cookie choice:</strong> your choice of “Essential only” or “Accept all” is stored in local storage under <code>nestgh_cookie_consent_v1</code>. We remember it until you clear site data or change it using “Cookie settings” in the footer.</li>
        <li><strong>Payment recovery:</strong> while you complete an owner listing payment, session storage may hold the submission ID, payment reference and details needed to check or retry that payment. It is limited to that browser session and is removed when payment is confirmed.</li>
        <li><strong>Admin sign-in:</strong> the admin area uses a secure, HTTP-only session cookie named <code>nestgh-admin-auth</code>. It is not used to sign in renters, owners or agents.</li>
      </ul>
      <p>When you go to Paystack checkout, Paystack may use its own cookies or browser storage on its service. Paystack’s policy applies there. NestGH does not read or store your card number or Mobile Money PIN.</p>
      <p>NestGH loads fonts from Google Fonts. This makes a request to Google’s servers, which may receive technical connection information such as your IP address. The site does not use Google Analytics or another analytics tracker.</p>

      <h2>Your choice</h2>
      <p>Choose “Essential only” to keep only the storage needed for the site, or choose “Accept all”. We do not currently load optional analytics or advertising cookies, so both choices keep the same active storage today. You can change your choice at any time using “Cookie settings” in the footer.</p>

      <h2>How to clear browser storage</h2>
      <p>Use your browser’s privacy or site settings to clear cookies and site data for nestghana.com. This also clears local and session storage, including saved rooms and any pending payment recovery details. You can also block cookies in your browser, but sign-in or payment services may not work properly.</p>

      <h2>Changes to this policy</h2>
      <p>If we add a new cookie, tracker or optional storage purpose, we will update this policy and ask for your choice where required. We will change the date above.</p>

      <p>Read our <Link href="/privacy">Privacy Policy</Link> and <Link href="/terms">Terms and Conditions</Link>.</p>
      <Link className="info-link" href="/">Return to NestGH</Link>
    </main>
  );
}
