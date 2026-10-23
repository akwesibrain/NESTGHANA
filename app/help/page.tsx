import Link from "next/link";

export const metadata = { title: "Help centre" };

export default function HelpPage() {
  return (
    <main className="info-page">
      <Link className="logo" href="/">NestGH</Link>
      <p className="eyebrow">We can help</p>
      <h1>Help centre</h1>
      <p>Need help with a listing, an agent application or a payment? Contact us and include the phone number on your account. For a payment question, include the payment reference or rental report number. Do not send your card number or Mobile Money PIN.</p>
      <p><strong>Email:</strong> <a href="mailto:amponsahbrain2007@gmail.com">amponsahbrain2007@gmail.com</a></p>
      <p><strong>Phone:</strong> <a href="tel:+23354030637">054 030 9637</a></p>
      <p><strong>WhatsApp:</strong> <a href="https://wa.me/23354030637">Message NestGH on WhatsApp</a></p>
      <p><strong>Service operator:</strong> [REGISTERED BUSINESS NAME AND ADDRESS]</p>
      <p>Read our <Link href="/terms">Terms and Conditions</Link>, <Link href="/privacy">Privacy Policy</Link> and <Link href="/cookies">Cookie Policy</Link>.</p>
      <Link className="info-link" href="/">Return to NestGH</Link>
    </main>
  );
}
