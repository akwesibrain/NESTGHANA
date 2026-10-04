import "server-only";
import type { RentPeriod, RoomType, ListingCondition, Furnishing } from "@/generated/prisma/client";
import { getDb } from "./db";

// Builds the `public_data` shape that the public site (app.js → mapPublicListing) renders.
// Only LIVE listings are exposed, and only allowlisted fields; listing_private, owner email and
// unapproved photos never leave the server.

export const LISTING_PAGE_MAX = 50;

const PERIOD_LABEL: Record<RentPeriod, string> = {
  MONTH: "Monthly",
  THREE_MONTHS: "3 Months",
  SIX_MONTHS: "6 Months",
  YEAR: "Yearly",
  SEMESTER: "Semester",
  OTHER: "Other",
};
const ROOM_TYPE_LABEL: Record<RoomType, string> = {
  SINGLE_ROOM: "Single Room",
  CHAMBER_HALL: "Chamber & Hall",
  SELF_CONTAINED: "Self-Contained",
  ONE_IN_ROOM: "1-in-a-Room",
  TWO_IN_ROOM: "2-in-a-Room",
  FOUR_IN_ROOM: "4-in-a-Room",
  STUDENT_HOSTEL: "Student Hostel",
};
const CONDITION_LABEL: Record<ListingCondition, string> = {
  NEW: "New",
  NEWLY_RENOVATED: "Newly Renovated",
  GOOD: "Good Condition",
  FAIR: "Fair Condition",
};
const FURNISHED_LABEL: Record<Furnishing, string> = { FURNISHED: "Furnished", UNFURNISHED: "Unfurnished" };

// Keys from the facilities / rules JSON columns that are safe to show publicly.
const PUBLIC_FACILITY_KEYS = ["m", "bath", "kit", "size", "floor", "store", "balc", "feat", "facOther", "notinc", "oth", "othNote"];
const PUBLIC_RULE_KEYS = ["cooking", "curfew", "curfewTime", "pets", "smoking", "visitors", "noise", "who", "maxOcc"];

function pick(source: unknown, keys: string[]): Record<string, unknown> {
  if (!source || typeof source !== "object" || Array.isArray(source)) return {};
  const record = source as Record<string, unknown>;
  return Object.fromEntries(keys.filter(key => key in record).map(key => [key, record[key]]));
}

const cedis = (pesewas: number) => pesewas / 100;

export async function listPublicListings(offset: number, limit: number) {
  const rows = await getDb().listing.findMany({
    where: { status: "LIVE" },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    skip: offset,
    take: Math.min(limit, LISTING_PAGE_MAX),
    select: {
      id: true,
      title: true,
      description: true,
      roomType: true,
      condition: true,
      furnished: true,
      unitsAvailable: true,
      rentAmountPesewas: true,
      rentPeriod: true,
      rentPeriodOther: true,
      advancePayments: true,
      depositPesewas: true,
      agencyFeePesewas: true,
      facilities: true,
      rules: true,
      landmark: true,
      availabilityDate: true,
      lastConfirmedAt: true,
      createdAt: true,
      owner: { select: { phoneE164: true, whatsappE164: true, relationship: true } },
      area: { select: { name: true, parent: { select: { name: true, parent: { select: { name: true } } } } } },
      verification: { select: { phoneVerifiedAt: true, identityVerifiedAt: true, propertyVerifiedAt: true } },
    },
  });

  const today = new Date().toISOString().slice(0, 10);
  return rows.map(row => {
    const availableFrom = row.availabilityDate.toISOString().slice(0, 10);
    const v = row.verification;
    return {
      id: row.id,
      status: "available" as const,
      created_at: row.createdAt.toISOString(),
      public_data: {
        ...pick(row.facilities, PUBLIC_FACILITY_KEYS),
        ...pick(row.rules, PUBLIC_RULE_KEYS),
        title: row.title,
        description: row.description,
        type: ROOM_TYPE_LABEL[row.roomType],
        cond: CONDITION_LABEL[row.condition],
        furn: FURNISHED_LABEL[row.furnished],
        aunits: row.unitsAvailable,
        rent: cedis(row.rentAmountPesewas),
        period: PERIOD_LABEL[row.rentPeriod],
        periodOther: row.rentPeriodOther ?? "",
        adv: row.advancePayments,
        dep: cedis(row.depositPesewas),
        fee: cedis(row.agencyFeePesewas),
        area: row.area.name,
        town: row.area.parent?.name ?? "",
        region: row.area.parent?.parent?.name ?? "",
        lm: row.landmark,
        phone: row.owner.phoneE164,
        wa: row.owner.whatsappE164,
        role: row.owner.relationship,
        verified: Boolean(v?.phoneVerifiedAt && v.identityVerifiedAt && v.propertyVerifiedAt),
        confirmed_at: (row.lastConfirmedAt ?? row.createdAt).toISOString(),
        avail: availableFrom > today ? "No, available from a later date" : "Yes, available now",
        from: availableFrom > today ? availableFrom : "",
        // Approved photos are served once image storage (workflow step 4) is in place.
        photos: [] as string[],
      },
    };
  });
}

export async function getPublicSiteSettings() {
  const settings = await getDb().websiteSettings.findUnique({
    where: { id: 1 },
    select: { listingFeePesewas: true, currency: true, privacyPolicyVersion: true, termsVersion: true },
  });
  if (!settings) return null;
  return {
    listing_fee_pesewas: settings.listingFeePesewas,
    currency: settings.currency,
    privacy_policy_version: settings.privacyPolicyVersion,
    terms_version: settings.termsVersion,
  };
}
