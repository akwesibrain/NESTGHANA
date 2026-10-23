import Link from "next/link";

export const metadata = { title: "Terms and Conditions" };

export default function TermsPage() {
  return (
    <main className="info-page">
      <Link className="logo" href="/">NestGH</Link>
      <p className="eyebrow">Using NestGH</p>
      <h1>Terms and Conditions</h1>
      <p><strong>Last updated: 23 October 2026</strong></p>

      <h2>1. What NestGH is</h2>
      <p>NestGH is a platform that connects renters with property owners and agents in Ghana. We help people find properties and help owners and agents advertise them. NestGH is not a landlord, estate agent, property manager or party to a tenancy agreement. Any rental agreement is between the renter and the owner or authorised agent.</p>
      <p>NestGH does not hold rent or deposits paid under a tenancy agreement. Check a property and the person offering it before you pay them.</p>

      <h2>2. Accounts</h2>
      <p>You must be at least 18 to create an account or submit a listing. Sign up with a phone number. Each person may have one account. Give accurate information and keep it up to date. Do not use another person’s account or phone number without permission. Keep your sign-in details private and tell us if you think someone else has used your account.</p>

      <h2>3. Renters</h2>
      <p>Browsing listings is free. Check the property in person and confirm its availability and terms with the owner before you agree to rent it.</p>
      <p>A success fee is due only after a rental has been confirmed through NestGH. The process is:</p>
      <ol>
        <li>You report that you have rented the property and receive a rental report number.</li>
        <li>The owner reviews and confirms the report.</li>
        <li>You pay the fee shown at the time of payment through the available checkout.</li>
        <li>After payment is confirmed, NestGH marks the listing as rented.</li>
      </ol>
      <p>Do not pay twice for the same rental report number. Keep the report number and payment receipt. If the details are wrong or a payment appears more than once, contact us so we can check it.</p>

      <h2>4. Property owners</h2>
      <p>A listing fee is required to publish an owner listing. NestGH reviews listings before they go live. Paying the fee does not guarantee approval.</p>
      <p>You must have the right to advertise the property. Keep the photos, rent, location, availability and other details accurate and current. Use photos of the actual property that you have permission to share. Tell NestGH when a property is rented so we can update the listing.</p>
      <p>We may reject, hide or remove a listing that is false, duplicated, abusive, outdated or otherwise breaks these Terms. A fee may not be refunded where a listing is removed because you broke these Terms. Contact us if you think a listing decision or payment record is wrong.</p>

      <h2>5. Agents</h2>
      <p>Anyone can apply to become an agent using <Link href="/account/agent">Become an Agent</Link>. Applying does not make you a Verified Agent. We check agents before showing that label and may ask for identity details.</p>
      <p>Agents pay a monthly plan instead of a fee for each listing. The plan covers all of an agent’s listings. The plan price shown when you subscribe is the price that applies to that subscription.</p>
      <ul>
        <li>You may only list a property if its owner has given you permission to advertise it. Show us that permission if we ask.</li>
        <li>Keep each listing accurate and current, and respond to renters who contact you.</li>
        <li>Never charge renters a viewing fee through NestGH or because they found the property on NestGH.</li>
        <li>Do not mislead renters about your identity, authority or the property.</li>
      </ul>
      <p>We may remove Verified Agent status for fraud, fake listings, charging viewing fees or a complaint we have reviewed and upheld. If a plan lapses, the agent’s listings may be paused or hidden until the plan is active again. If an agent is suspended, we may hide the agent’s listings while we review the matter. We may remove listings that break these Terms.</p>

      <h2>6. Payments, corrections and refunds</h2>
      <p>NestGH payments are processed through Paystack. Depending on the checkout, payment methods may include MTN MoMo, Telecel Cash, AirtelTigo Money, card and bank transfer. Paystack handles payment credentials. NestGH does not store card numbers or Mobile Money PINs.</p>
      <p>We use the payment reference and status to check a payment. NestGH will not intentionally charge twice for the same rental report number. If a payment is missing, duplicated or incorrect, contact us with the rental report number, payment reference and receipt. We will compare our records with Paystack’s and correct the record or arrange a refund if a charge was made in error. Do not retry a payment until you have checked its status.</p>
      <p>For an owner listing fee or agent plan payment, contact us with the listing or account details and payment reference if the payment did not complete or the service was not updated.</p>

      <h2>7. Reports and disputes</h2>
      <p>Report a suspicious, inaccurate or abusive listing through the report option on the site, or contact NestGH. For a rental or payment dispute, include the rental report number and receipt. We will review the information available, which may include the listing, report number, owner confirmation, payment reference and support messages. We may contact the people involved and update or hide a listing while we check.</p>
      <p>We keep the records needed to review reports, confirm payments and handle disputes. We cannot decide or enforce a tenancy dispute between a renter and an owner.</p>

      <h2>8. Things you must not do</h2>
      <p>Do not post fake or duplicate listings, run scams, harass people, use someone’s personal information without permission, collect NestGH fees outside the agreed payment process, charge viewing fees as an agent, or scrape listings or other site data. Do not interfere with the site or try to bypass its safety and payment checks.</p>

      <h2>9. Suspension and ending your account</h2>
      <p>We may limit or suspend access, remove a listing or end an account if we reasonably believe there is fraud, abuse, a serious breach of these Terms, a risk to users or a legal requirement. We will review reports and may ask you for information. You can stop using NestGH at any time. Any fees already due and records we must keep remain subject to these Terms and the law.</p>

      <h2>10. Liability</h2>
      <p>We work to keep listings and payment records useful, but we do not guarantee that a property is available, that listing details are correct, or that a renter or advertiser will act as promised. You are responsible for checking the property and the person you deal with.</p>
      <p>To the extent the law allows, NestGH is not responsible for indirect loss or for a tenancy, payment or dispute between a renter and an owner. Our total liability for a claim about the service is limited to the fees you paid NestGH in the 12 months before the claim. This does not limit liability or rights that cannot lawfully be limited under Ghanaian law.</p>

      <h2>11. Changes to these Terms</h2>
      <p>We may update these Terms when the service or the law changes. We will post the new version and update the date above. If a change affects how you use NestGH, read the new Terms before continuing.</p>

      <h2>12. Governing law and contact</h2>
      <p>These Terms are governed by the laws of the Republic of Ghana. Contact NestGH first if you have a question or complaint. We will try to review it and respond.</p>
      <p><strong>Service operator:</strong> [REGISTERED BUSINESS NAME AND ADDRESS]<br />
        <strong>Email:</strong> <a href="mailto:amponsahbrain2007@gmail.com">amponsahbrain2007@gmail.com</a><br />
        <strong>Phone / WhatsApp:</strong> <a href="tel:+23354030637">054 030 9637</a></p>
      <p>Read our <Link href="/privacy">Privacy Policy</Link> and <Link href="/cookies">Cookie Policy</Link>.</p>
      <Link className="info-link" href="/">Return to NestGH</Link>
    </main>
  );
}
