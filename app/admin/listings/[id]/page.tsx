import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { changeListingStatus, ownerLinkAction, reviewListing, setListingTrust, setSiteVisit, setVerification } from "@/app/admin/actions";
import { hasRole } from "@/lib/server/admin-auth";
import { requireAdmin } from "@/lib/server/admin-session";
import { getDb } from "@/lib/server/db";
import { AVAILABILITY_LABEL, CONTACT_TYPE_LABEL, VERIFIED_CONTACT_TYPES } from "@/lib/server/listing-trust";
import { ROOM_TYPE_LABEL } from "@/lib/server/public-listings";
import { AdminFrame } from "@/app/admin/admin-ui";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ review?: string }> };

const reviewMessages: Record<string, { kind: "success" | "error"; text: string }> = {
  approve: { kind: "success", text: "Listing approved and published with its photos." },
  changes: { kind: "success", text: "Changes requested from the owner." },
  reject: { kind: "success", text: "Listing rejected." },
  reason_required: { kind: "error", text: "Give a reason (at least 3 characters) when requesting changes or rejecting." },
  not_allowed: { kind: "error", text: "That action is not allowed for this listing in its current status." },
  failed: { kind: "error", text: "The review could not be saved. Please try again." },
  status_unavailable: { kind: "success", text: "Listing unpublished (shows as unavailable)." },
  status_live: { kind: "success", text: "Listing is live again." },
  status_removed: { kind: "success", text: "Listing removed from the website." },
  status_restore: { kind: "success", text: "Listing restored to its previous status." },
  verification_saved: { kind: "success", text: "Verification updated." },
  trust_saved: { kind: "success", text: "What renters see was updated." },
  visit_future: { kind: "error", text: "A site visit date cannot be in the future." },
  contact_needs_identity: { kind: "error", text: "Record the identity check before marking the contact as a verified agent or property manager." },
  links_revoked: { kind: "success", text: "All manage links for this listing were revoked." },
  invalid: { kind: "error", text: "That request was not valid." },
};

const money = (pesewas: number | null | undefined) =>
  pesewas === null || pesewas === undefined
    ? "—"
    : new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(pesewas / 100);
const date = (value: Date | null | undefined) =>
  value ? value.toLocaleString("en-GH", { timeZone: "Africa/Accra", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
const yesNo = (value: boolean | null) => (value === null ? "—" : value ? "Yes" : "No");

function Facts({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="admin-facts">
      {rows.map(([label, value]) => (
        <div key={label}><dt>{label}</dt><dd>{value === "" || value === null || value === undefined ? "—" : value}</dd></div>
      ))}
    </dl>
  );
}

/** Renders the free-form facilities/rules JSON as label/value rows. */
function JsonFacts({ value }: { value: unknown }) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return <p className="admin-empty">None provided.</p>;
  const rows = Object.entries(value as Record<string, unknown>).flatMap(([key, v]): [string, React.ReactNode][] => {
    if (v && typeof v === "object" && !Array.isArray(v)) return Object.entries(v as Record<string, unknown>).map(([k, x]) => [`${key} · ${k}`, String(x)]);
    return [[key, Array.isArray(v) ? v.join(", ") : String(v ?? "")]];
  });
  return rows.length ? <Facts rows={rows} /> : <p className="admin-empty">None provided.</p>;
}

export default async function AdminListingPage({ params, searchParams }: Props) {
  const admin = await requireAdmin();
  const { id } = await params;
  const { review } = await searchParams;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();

  const listing = await getDb().listing.findUnique({
    where: { id },
    include: {
      owner: true,
      area: { include: { parent: { include: { parent: true } } } },
      private: true,
      verification: true,
      images: { orderBy: { displayOrder: "asc" } },
      payments: { orderBy: { createdAt: "desc" } },
      statusHistory: { orderBy: { createdAt: "desc" } },
      consents: { orderBy: { createdAt: "desc" } },
      reports: { orderBy: { createdAt: "desc" } },
      approvedBy: { select: { email: true, displayName: true } },
    },
  });
  if (!listing) notFound();

  const canReview = hasRole(admin, ["SUPER_ADMIN", "ADMIN", "MODERATOR"]);
  const commercial = listing.propertyCategory === "COMMERCIAL";
  const message = review ? reviewMessages[review] : undefined;
  const town = listing.area.parent;
  const region = town?.parent;

  return (
    <AdminFrame admin={admin} active="/admin/listings">
      <section className="admin-detail">
          <p><Link className="admin-text-link" href="/admin/listings">← Back to listings</Link></p>
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">{commercial ? "SHOP / SPACE" : "ROOM"} · {listing.id}</p>
              <h1>{listing.title}</h1>
              <p>{[listing.area.name, town?.name, region?.name].filter(Boolean).join(", ")}</p>
            </div>
            <span className={`admin-status status-${listing.status.toLowerCase()}`}>{listing.status.replaceAll("_", " ")}</span>
          </div>
          {message ? <p className="status-banner" data-kind={message.kind} role={message.kind === "error" ? "alert" : "status"}>{message.text}</p> : null}

          {canReview && listing.status === "PENDING_APPROVAL" ? (
            <section className="admin-panel" aria-labelledby="review-heading">
              <h2 id="review-heading">Review this listing</h2>
              <p>Check the details and photos below. Approving publishes the listing and its property photos (the profile photo stays private).</p>
              <form className="admin-review-form" action={reviewListing}>
                <input type="hidden" name="listingId" value={listing.id} />
                <input type="hidden" name="from" value="detail" />
                <input type="text" name="reason" aria-label="Reason" placeholder="Reason (required for changes / reject; sent to the audit log)" maxLength={1000} />
                <button className="primary-button" type="submit" name="decision" value="approve">Approve and publish</button>
                <button className="secondary-button" type="submit" name="decision" value="changes">Request changes</button>
                <button className="secondary-button" type="submit" name="decision" value="reject">Reject</button>
              </form>
            </section>
          ) : null}

          {canReview ? (
            <section className="admin-panel ngd-manage" aria-labelledby="manage-heading">
              <h2 id="manage-heading">Manage this listing</h2>
              <div className="ngd-manage-row">
                {listing.status === "LIVE" || listing.status === "NEEDS_CONFIRMATION" ? (
                  <form action={changeListingStatus}>
                    <input type="hidden" name="listingId" value={listing.id} />
                    <button className="ngd-btn" name="to" value="UNAVAILABLE">Unpublish (mark unavailable)</button>
                  </form>
                ) : null}
                {listing.status === "UNAVAILABLE" || listing.status === "NEEDS_CONFIRMATION" ? (
                  <form action={changeListingStatus}>
                    <input type="hidden" name="listingId" value={listing.id} />
                    <button className="ngd-btn is-primary" name="to" value="LIVE">Make live again</button>
                  </form>
                ) : null}
                {["LIVE", "NEEDS_CONFIRMATION", "UNAVAILABLE", "REJECTED", "PAYMENT_PENDING"].includes(listing.status) ? (
                  <form action={changeListingStatus}>
                    <input type="hidden" name="listingId" value={listing.id} />
                    <input type="text" name="reason" placeholder="Reason for removal (required)" maxLength={1000} aria-label="Reason for removal" />
                    <button className="ngd-btn is-danger" name="to" value="REMOVED">Remove from website</button>
                  </form>
                ) : null}
                {listing.status === "REMOVED" && admin.roles.includes("SUPER_ADMIN") ? (
                  <form action={changeListingStatus}>
                    <input type="hidden" name="listingId" value={listing.id} />
                    <button className="ngd-btn" name="to" value="RESTORE">Restore (super admin)</button>
                  </form>
                ) : null}
              </div>
              <div>
                <h3>Verification checks</h3>
                <p className="ngd-note">
                  Record only checks that were actually done. Phone, identity and property together show the “Verified” badge;
                  identity, property, price and availability each also show their own badge to renters.
                </p>
                <div className="ngd-checks">
                  {([
                    ["phone", "Phone confirmed", listing.verification?.phoneVerifiedAt],
                    ["identity", "Owner identity checked", listing.verification?.identityVerifiedAt],
                    ["property", "Property inspected", listing.verification?.propertyVerifiedAt],
                    ["price", "Price checked", listing.verification?.priceVerifiedAt],
                    ["availability", "Availability checked", listing.verification?.availabilityVerifiedAt],
                  ] as const).map(([check, label, at]) => (
                    <form key={check} action={setVerification}>
                      <input type="hidden" name="listingId" value={listing.id} />
                      <input type="hidden" name="check" value={check} />
                      <button className={`ngd-btn ngd-check${at ? " is-primary" : ""}`} name="value" value={at ? "off" : "on"} aria-pressed={Boolean(at)}>
                        {at ? "✓ " : ""}{label}
                      </button>
                    </form>
                  ))}
                </div>
              </div>
              <div>
                <h3>NestGH site visit</h3>
                <p className="ngd-note">
                  {listing.verification?.visitedOn
                    ? `Visited on ${listing.verification.visitedOn.toISOString().slice(0, 10)}. Renters see “Visited by NestGH” with this date.`
                    : "No visit recorded."}
                </p>
                <form action={setSiteVisit} className="ngd-manage-row">
                  <input type="hidden" name="listingId" value={listing.id} />
                  <input type="date" name="visitedOn" aria-label="Visit date" defaultValue={listing.verification?.visitedOn?.toISOString().slice(0, 10) ?? ""} />
                  <button className="ngd-btn">Save visit date</button>
                  {listing.verification?.visitedOn ? <button className="ngd-btn" name="visitedOn" value="">Clear</button> : null}
                </form>
              </div>
              <div>
                <h3>What renters see</h3>
                <p className="ngd-note">Leave a field on “Not shown” unless it has been confirmed. Nothing is inferred from the listing’s age.</p>
                <form action={setListingTrust} className="ngd-manage-row">
                  <input type="hidden" name="listingId" value={listing.id} />
                  <label>
                    Availability{" "}
                    <select name="availabilityLabel" defaultValue={listing.availabilityLabel ?? ""}>
                      <option value="">Not shown</option>
                      {Object.entries(AVAILABILITY_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </label>
                  <label>
                    Contact{" "}
                    <select name="contactType" defaultValue={listing.contactType ?? ""}>
                      <option value="">Not shown</option>
                      {Object.entries(CONTACT_TYPE_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </label>
                  <button className="ngd-btn is-primary">Save</button>
                </form>
                {listing.contactType && VERIFIED_CONTACT_TYPES.has(listing.contactType) && !listing.verification?.identityVerifiedAt ? (
                  <p className="ngd-note">“{CONTACT_TYPE_LABEL[listing.contactType]}” is hidden from renters until the identity check is recorded.</p>
                ) : null}
                <p className="ngd-note">The owner’s own description of their role (“{listing.owner.relationship}”) is not shown as a confirmed contact type.</p>
              </div>
              <div>
                <h3>Owner manage link</h3>
                <p className="ngd-note">Owners use a private link to confirm availability, mark the listing taken, or fix and resubmit it.</p>
                <div className="ngd-manage-row">
                  <form action={ownerLinkAction}>
                    <input type="hidden" name="listingId" value={listing.id} />
                    <button className="ngd-btn" name="action" value="send">Send a new link on WhatsApp</button>
                    <button className="ngd-btn is-danger" name="action" value="revoke">Revoke all links</button>
                  </form>
                </div>
              </div>
            </section>
          ) : null}

          <section className="admin-panel" aria-labelledby="photos-heading">
            <h2 id="photos-heading">Photos ({listing.images.length})</h2>
            <div className="admin-photo-grid">
              {listing.images.map(image => (
                <figure key={image.id}>
                  <a href={`/api/admin/images/${image.id}`} target="_blank" rel="noopener">
                    <Image src={`/api/admin/images/${image.id}`} alt={`${image.category} photo`} width={320} height={220} unoptimized />
                  </a>
                  <figcaption>{image.category.replaceAll("_", " ").toLowerCase()} {image.approvedForPublic ? "· public" : "· private"}</figcaption>
                </figure>
              ))}
              {!listing.images.length ? <p className="admin-empty">No photos.</p> : null}
            </div>
          </section>

          <div className="admin-detail-grid">
            <section className="admin-panel" aria-labelledby="details-heading">
              <h2 id="details-heading">Property</h2>
              <Facts rows={[
                ["Type", ROOM_TYPE_LABEL[listing.roomType] + (listing.commercialTypeOther ? ` (${listing.commercialTypeOther})` : "")],
                ["Condition", listing.condition.replaceAll("_", " ").toLowerCase()],
                ["Furnished", listing.furnished.replaceAll("_", " ").toLowerCase()],
                ["Units (available / total)", `${listing.unitsAvailable} / ${listing.unitsTotal}`],
                ...(commercial
                  ? ([
                      ["Size", listing.sizeSqm ? `${Number(listing.sizeSqm)} m²` : "—"],
                      ["Road visibility", yesNo(listing.roadVisibility)],
                      ["Parking", yesNo(listing.parking)],
                      ["Electricity", yesNo(listing.electricity)],
                      ["Water", yesNo(listing.water)],
                    ] as [string, string][])
                  : ([["Bedrooms", String(listing.bedrooms ?? "—")]] as [string, string][])),
                ["Available from", listing.availabilityDate.toISOString().slice(0, 10)],
                ["Landmark (public)", listing.landmark],
              ]} />
              <h3>Description</h3>
              <p className="admin-description">{listing.description}</p>
            </section>

            <section className="admin-panel" aria-labelledby="money-heading">
              <h2 id="money-heading">Rent and charges</h2>
              <Facts rows={[
                ["Rent", `${money(listing.rentAmountPesewas)} · ${listing.rentPeriod === "OTHER" ? listing.rentPeriodOther : listing.rentPeriod.replaceAll("_", " ").toLowerCase()}`],
                commercial ? ["Advance (amount)", money(listing.advanceAmountPesewas)] : ["Advance (months)", String(listing.advancePayments)],
                ["Deposit", money(listing.depositPesewas)],
                ["Agency fee", money(listing.agencyFeePesewas)],
                ["Other charges", money(listing.otherChargesPesewas)],
                ...(commercial ? ([["Estimated move-in cost", money(listing.estimatedMoveInCostPesewas)]] as [string, string][]) : []),
              ]} />
            </section>

            <section className="admin-panel" aria-labelledby="owner-heading">
              <h2 id="owner-heading">Owner (private)</h2>
              <Facts rows={[
                ["Name", listing.owner.fullName],
                ["Relationship", listing.owner.relationship],
                ["Phone", <a key="p" href={`tel:${listing.owner.phoneE164}`}>{listing.owner.phoneE164}</a>],
                ["WhatsApp", <a key="w" href={`https://wa.me/${listing.owner.whatsappE164.replace("+", "")}`} target="_blank" rel="noopener">{listing.owner.whatsappE164}</a>],
                ["Email", <a key="e" href={`mailto:${listing.owner.email}`}>{listing.owner.email}</a>],
              ]} />
            </section>

            <section className="admin-panel" aria-labelledby="address-heading">
              <h2 id="address-heading">Exact location (private)</h2>
              <Facts rows={[
                ["Address / directions", listing.private?.exactAddress ?? "—"],
                ["Coordinates", listing.private?.exactLatitude ? `${listing.private.exactLatitude}, ${listing.private.exactLongitude}` : "—"],
                ["Map link", listing.private?.mapUrl ? <a key="m" href={listing.private.mapUrl} target="_blank" rel="noopener noreferrer">Open map</a> : "—"],
              ]} />
            </section>

            {!commercial ? (
              <>
                <section className="admin-panel" aria-labelledby="facilities-heading"><h2 id="facilities-heading">Facilities</h2><JsonFacts value={listing.facilities} /></section>
                <section className="admin-panel" aria-labelledby="rules-heading"><h2 id="rules-heading">House rules</h2><JsonFacts value={listing.rules} /></section>
              </>
            ) : null}

            <section className="admin-panel" aria-labelledby="payments-heading">
              <h2 id="payments-heading">Payments</h2>
              {listing.payments.length ? (
                <table className="admin-table">
                  <thead><tr><th>REFERENCE</th><th>TYPE</th><th>AMOUNT</th><th>STATUS</th><th>PAID</th></tr></thead>
                  <tbody>
                    {listing.payments.map(p => (
                      <tr key={p.id}><td><code>{p.reference}</code></td><td>{p.listingType}</td><td>{money(p.amountPesewas)}</td><td>{p.status}</td><td>{date(p.paidAt)}</td></tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="admin-empty">No payment attempts.</p>}
            </section>

            <section className="admin-panel" aria-labelledby="history-heading">
              <h2 id="history-heading">Status history</h2>
              <ol className="admin-history">
                {listing.statusHistory.map(h => (
                  <li key={h.id}><strong>{h.previousStatus ?? "—"} → {h.newStatus}</strong> · {h.actorType.toLowerCase()} · {date(h.createdAt)}{h.reason ? ` · “${h.reason}”` : ""}</li>
                ))}
              </ol>
              {listing.approvedBy ? <p>Approved by {listing.approvedBy.displayName || listing.approvedBy.email} on {date(listing.approvedAt)}.</p> : null}
            </section>

            <section className="admin-panel" aria-labelledby="consent-heading">
              <h2 id="consent-heading">Owner declarations</h2>
              {listing.consents.map(c => (
                <div key={c.id}>
                  <p>Accepted {date(c.consentedAt)} (privacy {c.privacyPolicyVersion}, terms {c.termsVersion})</p>
                  <JsonFacts value={c.checkboxValues} />
                </div>
              ))}
            </section>

            {listing.reports.length ? (
              <section className="admin-panel" aria-labelledby="reports-heading">
                <h2 id="reports-heading">Reports from visitors ({listing.reports.length})</h2>
                <ul>{listing.reports.map(r => <li key={r.id}>{date(r.createdAt)} · {r.status} · {r.reason}</li>)}</ul>
              </section>
            ) : null}
          </div>
      </section>
    </AdminFrame>
  );
}
