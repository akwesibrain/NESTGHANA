// Phase 1 listing trust metadata (frontend-data-contract.md): what renters see about availability,
// NestGH's completed checks and the contact's role. Every field is optional and only published when a
// recorded value supports it; a missing check is omitted, never sent as false.
import type { AvailabilityLabel, ContactType } from "@/generated/prisma/client";

export const AVAILABILITY_LABEL: Record<AvailabilityLabel, string> = {
  AVAILABLE: "Available",
  ALMOST_TAKEN: "Almost taken",
  RESERVED: "Reserved",
  RENTED: "Rented",
};

export const CONTACT_TYPE_LABEL: Record<ContactType, string> = {
  DIRECT_OWNER: "Direct Owner",
  VERIFIED_AGENT: "Verified Agent",
  VERIFIED_PROPERTY_MANAGER: "Verified Property Manager",
  CARETAKER: "Caretaker",
};

/** Contact types that claim a NestGH check; they need the owner-identity check on record. */
export const VERIFIED_CONTACT_TYPES: ReadonlySet<ContactType> = new Set(["VERIFIED_AGENT", "VERIFIED_PROPERTY_MANAGER"]);

export type TrustVerification = {
  identityVerifiedAt: Date | null;
  propertyVerifiedAt: Date | null;
  priceVerifiedAt: Date | null;
  availabilityVerifiedAt: Date | null;
  visitedOn: Date | null;
} | null;

export type PublicTrust = {
  availabilityStatus?: string;
  lastVerifiedAt?: string;
  verifications: {
    property?: true;
    price?: true;
    availability?: true;
    ownerIdentity?: true;
    visitedByNestGH?: { date: string };
  };
  contactType?: string;
};

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export function publicTrust(
  listing: { availabilityLabel: AvailabilityLabel | null; contactType: ContactType | null },
  v: TrustVerification,
): PublicTrust {
  const verifications: PublicTrust["verifications"] = {};
  if (v?.propertyVerifiedAt) verifications.property = true;
  if (v?.priceVerifiedAt) verifications.price = true;
  if (v?.availabilityVerifiedAt) verifications.availability = true;
  if (v?.identityVerifiedAt) verifications.ownerIdentity = true;
  if (v?.visitedOn) verifications.visitedByNestGH = { date: isoDate(v.visitedOn) };

  // The most recent recorded NestGH check (a visit counts from the start of its day).
  const times = [v?.propertyVerifiedAt, v?.priceVerifiedAt, v?.availabilityVerifiedAt, v?.identityVerifiedAt, v?.visitedOn]
    .filter((d): d is Date => d instanceof Date)
    .map(d => d.getTime());
  const out: PublicTrust = { verifications };
  if (times.length) out.lastVerifiedAt = new Date(Math.max(...times)).toISOString();
  if (listing.availabilityLabel) out.availabilityStatus = AVAILABILITY_LABEL[listing.availabilityLabel];
  if (listing.contactType && (!VERIFIED_CONTACT_TYPES.has(listing.contactType) || v?.identityVerifiedAt)) {
    out.contactType = CONTACT_TYPE_LABEL[listing.contactType];
  }
  return out;
}
