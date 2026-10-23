import Link from "next/link";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main className="info-page">
      <Link className="logo" href="/">NestGH</Link>
      <p className="eyebrow">Your information</p>
      <h1>Privacy Policy</h1>
      <p><strong>Last updated: 23 October 2026</strong></p>

      <h2>Who we are</h2>
      <p>NestGH is a Ghana property marketplace for renters, property owners and agents. The service is operated by <strong>[REGISTERED BUSINESS NAME AND ADDRESS]</strong>.</p>
      <p>For privacy questions or requests, email <a href="mailto:amponsahbrain2007@gmail.com">amponsahbrain2007@gmail.com</a> or call <a href="tel:+23354030637">054 030 9637</a>.</p>

      <h2>Information we collect</h2>
      <p>Depending on how you use NestGH, we may collect:</p>
      <ul>
        <li>Your phone number, name, email address if you provide one, and your role as a renter, owner or agent.</li>
        <li>Listing details, rent and other costs, location, photos, availability and contact details you submit.</li>
        <li>Agent application and verification information. We may ask for identity details to check an agent.</li>
        <li>Rental reports, report numbers, owner confirmations, receipts and payment references.</li>
        <li>Messages you send to NestGH support.</li>
        <li>Device and usage information needed to run and protect the service. Hosting providers may record technical request details such as your IP address, browser or device type, pages requested and the time of a request.</li>
      </ul>
      <p>Paystack processes payments. We receive payment references and status information. We do not store your full card number or Mobile Money PIN.</p>

      <h2>How we use your information</h2>
      <p>We use it to run your account, publish and review listings, verify agents, process rental success fees and agent plans, prevent fraud, respond to reports, resolve payment disputes, improve the site and send service messages about your account or listing.</p>

      <h2>What other people can see</h2>
      <p>Renters can see the information and photos in a published listing. An owner’s phone number is shown to renters on that listing so they can make contact. We do not publish private identity documents. Keep private details out of a listing description and its photos.</p>

      <h2>Who we share information with</h2>
      <ul>
        <li><strong>Paystack</strong> processes payments and returns payment references and status.</li>
        <li><strong>Hosting, storage and infrastructure providers</strong> help us run the website, store listings and protect the service.</li>
        <li><strong>Google Fonts</strong> receives a request when your browser loads our fonts and may receive technical connection information.</li>
        <li><strong>Analytics providers:</strong> NestGH does not currently use an analytics provider.</li>
        <li>We may share information with public authorities when the law requires it or to respond to a valid legal request.</li>
      </ul>
      <p>We do not sell personal information.</p>

      <h2>How long we keep it</h2>
      <p>We keep account and listing information while it is needed to provide the service. After an account or listing is closed, we keep only what we need for payment records, legal duties, fraud prevention or a dispute, then delete or remove identifying details when we no longer need them. Payment records may need to be kept for the period required by law.</p>

      <h2>How we protect it</h2>
      <p>We use access controls and security measures to protect information. No website or online transfer can be guaranteed completely secure. Contact us if you think someone has accessed your account or information without permission.</p>

      <h2>Your rights in Ghana</h2>
      <p>Under the Ghana Data Protection Act, 2012 (Act 843), you can ask to access your personal information, correct it, request deletion where the law allows, and object to certain processing. Contact us using the details above. We may need to confirm your identity before responding.</p>
      <p>The Data Protection Commission is Ghana’s data protection regulator. You may contact the Commission if you have a concern about how your information is handled.</p>

      <h2>Children</h2>
      <p>NestGH is for adults aged 18 and over. We do not knowingly collect personal information from children.</p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy when our service or the law changes. We will post the current version here and change the date above.</p>

      <p>Read our <Link href="/terms">Terms and Conditions</Link> and <Link href="/cookies">Cookie Policy</Link>.</p>
      <Link className="info-link" href="/">Return to NestGH</Link>
    </main>
  );
}
