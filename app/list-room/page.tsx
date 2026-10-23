import Link from "next/link";

export const metadata = { title: "List your room" };

export default function ListRoomPage() {
  return (
    <main className="info-page">
      <Link className="logo" href="/">NestGH</Link>
      <p className="eyebrow">For property owners</p>
      <h1>List your room</h1>
      <p>Secure listing submissions and payments are not available on this staging site yet. Please do not send personal details or payment.</p>
      <p>Before you list, read our <Link href="/terms">Terms and Conditions</Link>, <Link href="/privacy">Privacy Policy</Link> and <Link href="/cookies">Cookie Policy</Link>.</p>
      <Link className="info-link" href="/">Return to room search</Link>
    </main>
  );
}
