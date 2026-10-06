import "server-only";
import type { Furnishing, ListingCondition, Prisma, RentPeriod, RoomType } from "@/generated/prisma/client";
import { getDb } from "./db";
import { getListingFees } from "./listing-fees";
import { paystackConfigured } from "./paystack";

// Builds the `public_data` shape that the public site renders (app.js → mapPublicListing for rooms,
// commercial-listings.js → normalize for Shops & Spaces). Mirrors the Supabase public_listings view.
// Only LIVE listings whose owner consented to showing their contacts are exposed, and only
// allowlisted fields; listing_private, owner email and unapproved photos never leave the server.

export const LISTING_PAGE_MAX = 50;

/** Consent checkbox an owner ticks to have their name and contacts shown publicly. */
export const CONTACT_CONSENT_KEY = "profile_and_contact_display_consent";

const PERIOD_LABEL: Record<RentPeriod, string> = {
  MONTH: "Monthly",
  THREE_MONTHS: "3 Months",
  SIX_MONTHS: "6 Months",
  YEAR: "Yearly",
  SEMESTER: "Semester",
  OTHER: "Other",
};
export const ROOM_TYPE_LABEL: Record<RoomType, string> = {
  SINGLE_ROOM: "Single Room",
  CHAMBER_HALL: "Chamber & Hall",
  SELF_CONTAINED: "Self-Contained",
  ONE_IN_ROOM: "1-in-a-Room",
  TWO_IN_ROOM: "2-in-a-Room",
  FOUR_IN_ROOM: "4-in-a-Room",
  STUDENT_HOSTEL: "Student Hostel",
  SHOP: "Shop",
  STORE: "Store",
  OFFICE: "Office",
  SHOWROOM: "Showroom",
  WAREHOUSE: "Warehouse",
  SALON: "Salon",
  RESTAURANT: "Restaurant",
  COMMERCIAL_SPACE: "Commercial Space",
  OTHER: "Other",
};
const CONDITION_LABEL: Record<ListingCondition, string> = {
  NEW: "New",
  NEWLY_RENOVATED: "Newly Renovated",
  GOOD: "Good Condition",
  FAIR: "Fair Condition",
};
const FURNISHED_LABEL: Record<Furnishing, string> = {
  FURNISHED: "Furnished",
  UNFURNISHED: "Unfurnished",
  NOT_APPLICABLE: "Not Applicable",
};
const ROOM_TYPE_BY_LABEL = new Map(Object.entries(ROOM_TYPE_LABEL).map(([value, label]) => [label, value as RoomType]));

// Keys from the facilities / rules JSON columns that are safe to show publicly.
const PUBLIC_FACILITY_KEYS = ["bath", "kit", "size", "floor", "store", "balc", "feat", "notinc", "othNote"];
const PUBLIC_RULE_KEYS = ["cooking", "curfew", "curfewTime", "pets", "smoking", "visitors", "noise", "who", "maxOcc"];

function asRecord(source: unknown): Record<string, unknown> {
  return source && typeof source === "object" && !Array.isArray(source) ? (source as Record<string, unknown>) : {};
}

function pick(source: unknown, keys: string[]): Record<string, unknown> {
  const record = asRecord(source);
  return Object.fromEntries(keys.filter(key => key in record).map(key => [key, record[key]]));
}

const cedis = (pesewas: number) => pesewas / 100;
const toPesewas = (cedi: number) => Math.round(cedi * 100);
const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export type ListingCategory = "room" | "commercial";

export type CommercialFilters = {
  region?: string;
  town?: string;
  /** Free-text match on town or area. */
  location?: string;
  type?: string;
  minRent?: number;
  maxRent?: number;
  minSize?: number;
  maxSize?: number;
  roadVisibility?: boolean;
  parking?: boolean;
  electricity?: boolean;
  water?: boolean;
};

function commercialWhere(f: CommercialFilters): Prisma.ListingWhereInput {
  const and: Prisma.ListingWhereInput[] = [];
  if (f.region) and.push({ area: { parent: { parent: { name: f.region } } } });
  if (f.town) and.push({ area: { parent: { name: f.town } } });
  if (f.location) {
    and.push({ OR: [{ area: { name: { contains: f.location } } }, { area: { parent: { name: { contains: f.location } } } }] });
  }
  if (f.type) {
    const roomType = ROOM_TYPE_BY_LABEL.get(f.type);
    // An unknown type matches nothing rather than everything.
    and.push(roomType ? { roomType } : { id: "" });
  }
  if (f.minRent !== undefined) and.push({ rentAmountPesewas: { gte: toPesewas(f.minRent) } });
  if (f.maxRent !== undefined) and.push({ rentAmountPesewas: { lte: toPesewas(f.maxRent) } });
  if (f.minSize !== undefined) and.push({ sizeSqm: { gte: f.minSize } });
  if (f.maxSize !== undefined) and.push({ sizeSqm: { lte: f.maxSize } });
  for (const field of ["roadVisibility", "parking", "electricity", "water"] as const) {
    if (f[field] !== undefined) and.push({ [field]: f[field] });
  }
  return { AND: and };
}

export async function listPublicListings(
  category: ListingCategory,
  offset: number,
  limit: number,
  filters: CommercialFilters = {},
) {
  const rows = await getDb().listing.findMany({
    where: {
      status: "LIVE",
      propertyCategory: category === "commercial" ? "COMMERCIAL" : "ROOM",
      // Owner contacts are public by consent only, so listings without that consent are not published.
      consents: { some: { checkboxValues: { path: `$.${CONTACT_CONSENT_KEY}`, equals: true } } },
      ...(category === "commercial" ? commercialWhere(filters) : {}),
    },
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
      bedrooms: true,
      rentAmountPesewas: true,
      rentPeriod: true,
      rentPeriodOther: true,
      advancePayments: true,
      depositPesewas: true,
      agencyFeePesewas: true,
      otherChargesPesewas: true,
      facilities: true,
      rules: true,
      landmark: true,
      availabilityDate: true,
      lastConfirmedAt: true,
      createdAt: true,
      advanceAmountPesewas: true,
      commercialTypeOther: true,
      sizeSqm: true,
      roadVisibility: true,
      parking: true,
      electricity: true,
      water: true,
      estimatedMoveInCostPesewas: true,
      owner: { select: { phoneE164: true, whatsappE164: true, relationship: true } },
      area: { select: { name: true, parent: { select: { name: true, parent: { select: { name: true } } } } } },
      verification: { select: { phoneVerifiedAt: true, identityVerifiedAt: true, propertyVerifiedAt: true } },
      images: {
        where: { approvedForPublic: true, category: { not: "PROFILE" } },
        orderBy: { displayOrder: "asc" },
        select: { id: true },
      },
    },
  });

  const today = isoDate(new Date());
  return rows.map(row => {
    const availableFrom = isoDate(row.availabilityDate);
    const town = row.area.parent?.name ?? "";
    const region = row.area.parent?.parent?.name ?? "";
    const photoUrls = row.images.map(image => `/api/images/${image.id}`);
    const base = { id: row.id, status: "available" as const, created_at: row.createdAt.toISOString() };

    if (category === "commercial") {
      return {
        ...base,
        category: "COMMERCIAL" as const,
        public_data: {
          category: "commercial",
          type: ROOM_TYPE_LABEL[row.roomType],
          typeOther: row.commercialTypeOther,
          title: row.title,
          description: row.description,
          region,
          town,
          area: row.area.name,
          location: `${town}, ${row.area.name}`,
          rent: cedis(row.rentAmountPesewas),
          advance: row.advanceAmountPesewas === null ? null : cedis(row.advanceAmountPesewas),
          size: row.sizeSqm === null ? null : Number(row.sizeSqm),
          sizeUnit: "m²",
          roadVisibility: row.roadVisibility,
          parking: row.parking,
          electricity: row.electricity,
          water: row.water,
          estimatedMoveInCost: row.estimatedMoveInCostPesewas === null ? null : cedis(row.estimatedMoveInCostPesewas),
          availability: availableFrom,
          images: photoUrls,
          phone: row.owner.phoneE164,
          whatsapp: row.owner.whatsappE164,
        },
      };
    }

    const facilities = asRecord(row.facilities);
    const v = row.verification;
    return {
      ...base,
      category: "ROOM" as const,
      public_data: {
        ...pick(facilities, PUBLIC_FACILITY_KEYS),
        ...pick(row.rules, PUBLIC_RULE_KEYS),
        category: "room",
        title: row.title,
        description: row.description,
        type: ROOM_TYPE_LABEL[row.roomType],
        cond: CONDITION_LABEL[row.condition],
        furn: FURNISHED_LABEL[row.furnished],
        aunits: row.unitsAvailable,
        beds: row.bedrooms,
        rent: cedis(row.rentAmountPesewas),
        period: row.rentPeriod === "OTHER" ? (row.rentPeriodOther ?? "Other") : PERIOD_LABEL[row.rentPeriod],
        periodOther: row.rentPeriodOther ?? "",
        adv: row.advancePayments,
        dep: cedis(row.depositPesewas),
        fee: cedis(row.agencyFeePesewas),
        oth: cedis(row.otherChargesPesewas),
        // The listing form stores facility choices under "selections" and free text under "other".
        m: asRecord(facilities.selections ?? facilities.m),
        facOther: typeof facilities.other === "string" ? facilities.other : "",
        area: row.area.name,
        town,
        region,
        lm: row.landmark,
        phone: row.owner.phoneE164,
        wa: row.owner.whatsappE164,
        role: row.owner.relationship,
        verified: Boolean(v?.phoneVerifiedAt && v.identityVerifiedAt && v.propertyVerifiedAt),
        confirmed_at: (row.lastConfirmedAt ?? row.createdAt).toISOString(),
        avail: availableFrom > today ? "No, available from a later date" : "Yes, available now",
        from: availableFrom,
        photos: photoUrls,
      },
    };
  });
}

export async function getPublicSiteSettings() {
  const [fees, versions] = await Promise.all([
    getListingFees(),
    getDb().websiteSettings.findUniqueOrThrow({ where: { id: 1 }, select: { privacyPolicyVersion: true, termsVersion: true } }),
  ]);
  return {
    currency: fees.currency,
    /** Fees by listing type in pesewas (keys match listing-pricing.js). */
    listing_fees_pesewas: { room: fees.room, hostel: fees.hostel, space: fees.space },
    payments_enabled: paystackConfigured(),
    privacy_policy_version: versions.privacyPolicyVersion,
    terms_version: versions.termsVersion,
  };
}
