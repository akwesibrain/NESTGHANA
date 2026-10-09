import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ListingStatus } from "@/generated/prisma/client";
import { ownerConfirm, ownerMarkTaken, ownerResubmit, ownerUpdateUnits } from "@/app/manage/actions";
import { findManageToken } from "@/lib/server/manage-links";
import { getOwnerView } from "@/lib/server/owner-manage";
import "../manage.css";

export const metadata: Metadata = { title: "Manage your listing", robots: { index: false, follow: false } };

type Props = { params: Promise<{ token: string }>; searchParams: Promise<{ msg?: string }> };

const STATUS: Record<ListingStatus, { label: string; tone: string; help: string }> = {
  DRAFT: { label: "Draft", tone: "neutral", help: "Your submission is not complete yet." },
  PAYMENT_PENDING: { label: "Waiting for payment", tone: "warning", help: "We have your details, but the listing fee has not been paid yet." },
  PENDING_APPROVAL: { label: "Being reviewed", tone: "warning", help: "NestGH is checking your listing. You will hear from us when it is approved." },
  CHANGES_REQUESTED: { label: "Changes needed", tone: "warning", help: "Please update the details below and resubmit." },
  LIVE: { label: "Live", tone: "good", help: "Renters can see your listing. Confirm it regularly so it stays trusted." },
  NEEDS_CONFIRMATION: { label: "Needs confirmation", tone: "warning", help: "Please confirm the property is still available, or mark it as taken." },
  UNAVAILABLE: { label: "Taken / unavailable", tone: "neutral", help: "Renters see it as taken. Make it available again when a unit is free." },
  REJECTED: { label: "Not approved", tone: "critical", help: "This listing was not approved." },
  REMOVED: { label: "Removed", tone: "critical", help: "This listing was removed by NestGH." },
};
const MESSAGES: Record<string, string> = {
  confirm_ok: "Thank you. Your listing is confirmed as available.",
  taken_ok: "Done. Your listing now shows as taken.",
  units_ok: "Units available updated.",
  resubmit_ok: "Thank you. Your updated listing has been sent for review.",
  rate_limited: "Too many actions in a short time. Please wait a few minutes.",
  not_live: "This listing is not live, so its availability cannot be confirmed yet.",
  cannot_mark_taken: "This listing cannot be marked as taken in its current state.",
  units_not_live: "Units can only be updated on a live listing.",
  units_range: "That number of units is not possible for this listing.",
  invalid_field: "Please check the form: the title needs at least 8 characters and the description at least 100.",
  not_waiting: "This listing is not waiting for changes.",
  failed: "Something went wrong. Please try again.",
};

export default async function ManageListingPage({ params, searchParams }: Props) {
  const { token } = await params;
  const { msg } = await searchParams;
  const found = await findManageToken(token);

  if (!found) {
    return (
      <main className="mg-shell">
        <section className="mg-card">
          <Brand />
          <h1>This link is not valid</h1>
          <p>The link may have expired or been replaced. Contact NestGH on WhatsApp and we will send you a new one.</p>
          <Link className="mg-btn" href="/">Go to NestGH</Link>
        </section>
      </main>
    );
  }

  const listing = await getOwnerView(found.listingId);
  const status = STATUS[listing.status];
  const note = listing.statusHistory[0];
  const message = msg ? MESSAGES[msg] : undefined;
  const isError = Boolean(message) && !msg?.endsWith("_ok");
  const place = [listing.area.name, listing.area.parent?.name].filter(Boolean).join(", ");

  return (
    <main className="mg-shell">
      <section className="mg-card">
        <Brand />
        <p className="mg-eyebrow">Manage your listing</p>
        <h1>{listing.title}</h1>
        <p className="mg-muted">{place} · Hello {listing.owner.fullName}</p>
        <div className={`mg-status is-${status.tone}`}><strong>{status.label}</strong><span>{status.help}</span></div>
        {message ? <p className={`mg-flash ${isError ? "is-error" : ""}`} role={isError ? "alert" : "status"}>{message}</p> : null}
        {note?.reason && (listing.status === "CHANGES_REQUESTED" || listing.status === "REJECTED" || listing.status === "REMOVED") ? (
          <div className="mg-note"><strong>Note from NestGH</strong><p>{note.reason}</p></div>
        ) : null}

        {listing.status === "LIVE" || listing.status === "NEEDS_CONFIRMATION" || listing.status === "UNAVAILABLE" ? (
          <div className="mg-actions">
            <form action={ownerConfirm}>
              <input type="hidden" name="token" value={token} />
              <button className="mg-btn is-primary" type="submit">{listing.status === "UNAVAILABLE" ? "It’s available again" : "Yes, still available"}</button>
            </form>
            {listing.status !== "UNAVAILABLE" ? (
              <form action={ownerMarkTaken}>
                <input type="hidden" name="token" value={token} />
                <button className="mg-btn" type="submit">It’s taken</button>
              </form>
            ) : null}
          </div>
        ) : null}

        {listing.status === "LIVE" || listing.status === "NEEDS_CONFIRMATION" ? (
          <form className="mg-inline" action={ownerUpdateUnits}>
            <input type="hidden" name="token" value={token} />
            <label>Units still available (of {listing.unitsTotal})
              <input name="units" type="number" min={0} max={listing.unitsTotal} defaultValue={listing.unitsAvailable} required />
            </label>
            <button className="mg-btn" type="submit">Update</button>
          </form>
        ) : null}

        {listing.status === "CHANGES_REQUESTED" ? (
          <form className="mg-form" action={ownerResubmit}>
            <input type="hidden" name="token" value={token} />
            <label>Title<input name="title" defaultValue={listing.title} minLength={8} maxLength={100} required /></label>
            <label>Description (at least 100 characters)<textarea name="description" rows={6} defaultValue={listing.description} minLength={100} maxLength={5000} required /></label>
            <div className="mg-grid">
              <label>Rent (GH₵)<input name="rent" type="number" min="1" step="0.01" defaultValue={(listing.rentAmountPesewas / 100).toFixed(2)} required /></label>
              <label>Units available<input name="unitsAvailable" type="number" min={1} max={listing.unitsTotal} defaultValue={Math.max(1, listing.unitsAvailable)} required /></label>
              <label>Available from<input name="availabilityDate" type="date" defaultValue={listing.availabilityDate.toISOString().slice(0, 10)} required /></label>
              <label>Nearest landmark<input name="landmark" defaultValue={listing.landmark} maxLength={200} /></label>
            </div>
            <p className="mg-muted">To change photos, the address or contact details, reply to NestGH on WhatsApp.</p>
            <button className="mg-btn is-primary" type="submit">Save and resubmit for review</button>
          </form>
        ) : null}

        <p className="mg-footer">
          {listing.lastConfirmedAt ? `Last confirmed ${listing.lastConfirmedAt.toLocaleDateString("en-GH", { timeZone: "Africa/Accra", day: "numeric", month: "short", year: "numeric" })}. ` : ""}
          Keep this link private: anyone with it can manage your listing.
        </p>
      </section>
    </main>
  );
}

function Brand() {
  return (
    <Link className="mg-brand" href="/">
      <Image src="/logo-192.png" alt="" width={36} height={36} />
      <span>NestGH</span>
    </Link>
  );
}
