import "server-only";
import { z } from "zod";
import type { ImageCategory, Prisma, RentPeriod, RoomType } from "@/generated/prisma/client";
import { getDb } from "./db";
import { CONTACT_CONSENT_KEY, ROOM_TYPE_LABEL } from "./public-listings";
import { transitionListingInTransaction } from "./listing-status";
import { deleteImages, detectImageKind, MAX_IMAGE_BYTES, saveImage } from "./image-storage";

// Owner listing submission (payment is started separately in payments.ts).
// Validates the "List your property" form, stores photos privately, and creates the owner,
// listing, private address, consent and image rows in one transaction, ending in PAYMENT_PENDING.

export class SubmissionError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}

const ROOM_PHOTOS = ["Exterior", "Bedroom", "Bathroom", "Kitchen", "Compound or common area"];
const COMMERCIAL_PHOTOS = ["Exterior", "Interior", "Frontage", "Facilities", "Surrounding area"];
const MAX_PHOTOS = 16;
const MAX_TOTAL_PHOTO_BYTES = 4_500_000;

/** The six declarations in app.js (CONS), in order. */
export const CONSENT_KEYS = [
  "authorized_to_list",
  "information_accurate",
  "room_available",
  "availability_contact_consent",
  CONTACT_CONSENT_KEY,
  "moderation_terms_accepted",
] as const;

const PHOTO_CATEGORY: Record<string, ImageCategory> = {
  Exterior: "EXTERIOR",
  Bedroom: "BEDROOM",
  Bathroom: "BATHROOM",
  Kitchen: "KITCHEN",
  "Compound or common area": "COMPOUND",
  Interior: "INTERIOR",
  Frontage: "FRONTAGE",
  Facilities: "FACILITIES",
  "Surrounding area": "SURROUNDING",
};
const PERIOD: Record<string, RentPeriod> = {
  Monthly: "MONTH",
  "3 Months": "THREE_MONTHS",
  "6 Months": "SIX_MONTHS",
  Yearly: "YEAR",
  Semester: "SEMESTER",
  Other: "OTHER",
};
const ROOM_TYPE_BY_LABEL = new Map(Object.entries(ROOM_TYPE_LABEL).map(([value, label]) => [label, value as RoomType]));
const ROOM_TYPES = ["Single Room", "Chamber & Hall", "Self-Contained", "1-in-a-Room", "2-in-a-Room", "4-in-a-Room", "Student Hostel"];
const COMMERCIAL_TYPES = ["Shop", "Store", "Office", "Showroom", "Warehouse", "Salon", "Restaurant", "Commercial Space", "Other"];
const CONDITION = { New: "NEW", "Newly Renovated": "NEWLY_RENOVATED", "Good Condition": "GOOD", "Fair Condition": "FAIR" } as const;

// ───────── Input schema (field names are the app.js form keys) ─────────

const text = (min: number, max: number) => z.string().trim().min(min).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional().default("");
/** Form numbers arrive as strings; blank means 0 for optional money fields. */
const money = z.union([z.string(), z.number()]).transform(v => (v === "" ? 0 : Number(v))).pipe(z.number().min(0).max(21_474_836));
const int = (min: number, max: number) => z.union([z.string(), z.number()]).transform(Number).pipe(z.number().int().min(min).max(max));
const yesNo = z.enum(["Yes", "No"]);
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => {
  const parsed = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === v;
}, "Invalid date");
const ghanaPhone = z.string().transform(v => {
  const digits = v.replace(/[\s-]/g, "");
  return digits.startsWith("0") ? `+233${digits.slice(1)}` : digits.startsWith("+") ? digits : `+${digits}`;
}).pipe(z.string().regex(/^\+233[235]\d{8}$/));
const shortChoice = z.string().trim().max(200).optional();
const stringMap = z.record(z.string().max(60), z.string().max(60)).refine(v => Object.keys(v).length <= 40);

const common = {
  title: text(8, 100),
  desc: text(100, 5000),
  cond: z.enum(["New", "Newly Renovated", "Good Condition", "Fair Condition"]),
  units: int(1, 500),
  aunits: int(1, 500),
  rent: z.union([z.string(), z.number()]).transform(Number).pipe(z.number().gt(0).max(21_474_836)),
  dep: money.optional().default(0),
  fee: money.optional().default(0),
  oth: money.optional().default(0),
  region: text(1, 100),
  town: text(1, 100),
  area: text(1, 100),
  addr: text(5, 1000),
  /** "Nearest landmark" — shown publicly. */
  lm: optionalText(200),
  mapLink: z.union([z.literal(""), z.url({ protocol: /^https?$/ }).max(2048)]).optional().default(""),
  lat: z.union([z.string(), z.number()]).transform(Number).pipe(z.number().min(-90).max(90)).optional(),
  lng: z.union([z.string(), z.number()]).transform(Number).pipe(z.number().min(-180).max(180)).optional(),
  avail: z.enum(["Yes, available now", "No, available from a later date"]),
  from: z.string().optional(),
  name: optionalText(120),
  rel: optionalText(250),
  role: optionalText(80),
  phone: ghanaPhone,
  wa: ghanaPhone,
  email: z.email().max(254).transform(v => v.toLowerCase()),
  cons: z.array(z.literal(true)).length(CONSENT_KEYS.length),
};

const roomSchema = z.object({
  ...common,
  /** The form sends "rooms" (Rooms & Hostels); "room" is accepted too. */
  category: z.enum(["rooms", "room"]),
  type: z.enum(ROOM_TYPES as [string, ...string[]]),
  furn: z.enum(["Furnished", "Unfurnished"]),
  beds: int(0, 100),
  period: z.enum(Object.keys(PERIOD) as [string, ...string[]]),
  periodOther: optionalText(80),
  adv: int(0, 120),
  maxOcc: int(1, 500),
  m: stringMap.optional().default({}),
  facOther: optionalText(500),
  who: z.array(z.string().max(40)).max(10).optional().default([]),
  bath: shortChoice, kit: shortChoice, size: shortChoice, floor: shortChoice, store: shortChoice,
  balc: shortChoice, feat: optionalText(500), notinc: optionalText(500), othNote: optionalText(500),
  cooking: shortChoice, visitors: shortChoice, pets: shortChoice, smoking: shortChoice,
  curfew: shortChoice, curfewTime: shortChoice, noise: shortChoice, otherRules: optionalText(1000),
});

const commercialSchema = z.object({
  ...common,
  category: z.literal("commercial"),
  type: z.enum(COMMERCIAL_TYPES as [string, ...string[]]),
  otherType: optionalText(60),
  size: z.union([z.string(), z.number()]).transform(Number).pipe(z.number().gt(0).max(1_000_000)),
  roadVisibility: yesNo,
  parking: yesNo,
  electricity: yesNo,
  water: yesNo,
  advanceAmount: money,
});

type RoomInput = z.infer<typeof roomSchema>;
type CommercialInput = z.infer<typeof commercialSchema>;
type ListingInput = RoomInput | CommercialInput;

export function parseListing(raw: unknown): ListingInput {
  const category = (raw as { category?: unknown } | null)?.category;
  const result = (category === "commercial" ? commercialSchema : roomSchema).safeParse(raw);
  if (!result.success) {
    const field = result.error.issues[0]?.path.join(".") || "listing";
    throw new SubmissionError(`Some listing details are invalid (${field}). Review the listing and try again.`);
  }
  const input = result.data;
  if (input.aunits > input.units) throw new SubmissionError("Units available cannot exceed the total number of units.");
  if ((input.lat === undefined) !== (input.lng === undefined)) throw new SubmissionError("Map coordinates are incomplete.");
  if (input.avail === "No, available from a later date" && !isoDate.safeParse(input.from).success) {
    throw new SubmissionError("Enter the date the property becomes available.");
  }
  if (input.category === "commercial") {
    if (input.type === "Other" && input.otherType.length < 2) throw new SubmissionError("Describe the commercial space type.");
  } else if (input.period === "Other" && input.periodOther.length < 2) {
    throw new SubmissionError("Describe the rent period.");
  }
  return input;
}

// ───────── Photos ─────────

export type PhotoFile = { field: string; bytes: Uint8Array };
type CheckedPhoto = { category: ImageCategory; bytes: Uint8Array; kind: NonNullable<ReturnType<typeof detectImageKind>> };

export function checkPhotos(photos: PhotoFile[], commercial: boolean): CheckedPhoto[] {
  if (photos.length > MAX_PHOTOS) throw new SubmissionError("Too many photos. Remove some extra photos and try again.");
  const required = commercial ? COMMERCIAL_PHOTOS : ROOM_PHOTOS;
  let total = 0;
  const checked = photos.map(({ field, bytes }) => {
    const kind = detectImageKind(bytes);
    if (!kind || bytes.length === 0 || bytes.length > MAX_IMAGE_BYTES) {
      throw new SubmissionError("Each compressed photo must be a JPG, PNG, or WebP image under 2 MB.");
    }
    total += bytes.length;
    let category: ImageCategory | undefined;
    if (field === "profile_photo") category = "PROFILE";
    else if (field.startsWith("photo:Extra ")) category = "EXTRA";
    else if (field.startsWith("photo:") && required.includes(field.slice(6))) category = PHOTO_CATEGORY[field.slice(6)];
    if (!category) throw new SubmissionError("The photo category is invalid.");
    return { category, bytes, kind };
  });
  if (total > MAX_TOTAL_PHOTO_BYTES) throw new SubmissionError("The compressed photos are too large to upload together.", 413);
  const received = new Set(checked.map(p => p.category));
  if (!received.has("PROFILE") || required.some(name => !received.has(PHOTO_CATEGORY[name]))) {
    throw new SubmissionError("Upload every required property photo and your profile photo.");
  }
  return checked;
}

// ───────── Locations ─────────

function slugify(value: string): string {
  return value.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100) || "place";
}

/** Region and town must come from the catalogue; a new area under a known town is created. */
async function resolveArea(tx: Prisma.TransactionClient, regionName: string, townName: string, areaName: string): Promise<string> {
  const region = await tx.location.findFirst({ where: { kind: "REGION", name: regionName } });
  if (!region) throw new SubmissionError("Choose a region from the list.");
  const town = await tx.location.findFirst({ where: { kind: "TOWN", parentId: region.id, name: townName } });
  if (!town) throw new SubmissionError("Choose a town from the list for the selected region.");
  const existing = await tx.location.findFirst({ where: { kind: "AREA", parentId: town.id, name: areaName } });
  if (existing) return existing.id;

  const base = slugify(areaName);
  for (let n = 1; n <= 50; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    const taken = await tx.location.findFirst({ where: { parentId: town.id, slug }, select: { id: true } });
    if (taken) continue;
    const created = await tx.location.create({ data: { kind: "AREA", parentId: town.id, name: areaName, slug, path: `${town.path}/${slug}` } });
    return created.id;
  }
  throw new SubmissionError("This area name could not be saved. Try a different spelling.");
}

// ───────── Create ─────────

export type SubmissionResult = { listingId: string; ownerEmail: string; created: boolean };

/**
 * Creates a listing from a validated submission. Re-submitting the same submissionId while the
 * listing is still awaiting payment returns the existing listing (no duplicate, photos ignored).
 */
export async function createSubmission(submissionId: string, raw: unknown, photos: PhotoFile[]): Promise<SubmissionResult> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)) {
    throw new SubmissionError("Listing details are incomplete. Please review and submit again.");
  }
  const db = getDb();
  const input = parseListing(raw);

  const existing = await db.listing.findUnique({ where: { submissionId }, select: { id: true, status: true, owner: { select: { email: true } } } });
  if (existing) {
    if (existing.owner.email !== input.email) throw new SubmissionError("This submission belongs to a different owner.", 409);
    if (existing.status !== "PAYMENT_PENDING") {
      throw new SubmissionError("This listing has already been paid or is being reviewed. Contact NestGH if you need help.", 409);
    }
    return { listingId: existing.id, ownerEmail: existing.owner.email, created: false };
  }

  const commercial = input.category === "commercial";
  const checked = checkPhotos(photos, commercial);
  const settings = await db.websiteSettings.findUniqueOrThrow({ where: { id: 1 }, select: { privacyPolicyVersion: true, termsVersion: true } });

  const savedKeys: string[] = [];
  try {
    for (const photo of checked) savedKeys.push(await saveImage(submissionId.toLowerCase(), photo.bytes, photo.kind));

    const today = new Date().toISOString().slice(0, 10);
    const availabilityDate = input.avail === "Yes, available now" ? today : input.from!;
    const roomType = ROOM_TYPE_BY_LABEL.get(input.type)!;

    const listingId = await db.$transaction(async tx => {
      const areaId = await resolveArea(tx, input.region, input.town, input.area);
      const owner = await tx.owner.create({
        data: {
          fullName: input.name.length >= 2 ? input.name : "Property contact",
          phoneE164: input.phone,
          whatsappE164: input.wa,
          email: input.email,
          relationship: input.rel.length >= 2 ? input.rel : input.role.length >= 2 ? input.role : "Property Owner",
        },
      });

      const shared = {
        submissionId,
        ownerId: owner.id,
        areaId,
        title: input.title,
        description: input.desc,
        roomType,
        condition: CONDITION[input.cond],
        unitsTotal: input.units,
        unitsAvailable: input.aunits,
        rentAmountPesewas: Math.round(input.rent * 100),
        depositPesewas: Math.round(input.dep * 100),
        agencyFeePesewas: Math.round(input.fee * 100),
        otherChargesPesewas: Math.round(input.oth * 100),
        landmark: input.lm,
        availabilityDate: new Date(`${availabilityDate}T00:00:00Z`),
      };
      const listing = await tx.listing.create({
        data: input.category === "commercial"
          ? {
              ...shared,
              propertyCategory: "COMMERCIAL",
              furnished: "NOT_APPLICABLE",
              rentPeriod: "MONTH",
              advancePayments: 0,
              advanceAmountPesewas: Math.round(input.advanceAmount * 100),
              commercialTypeOther: input.type === "Other" ? input.otherType : null,
              sizeSqm: input.size,
              roadVisibility: input.roadVisibility === "Yes",
              parking: input.parking === "Yes",
              electricity: input.electricity === "Yes",
              water: input.water === "Yes",
              estimatedMoveInCostPesewas: Math.round((input.advanceAmount + input.dep + input.fee + input.oth) * 100),
              facilities: {},
              rules: {},
            }
          : {
              ...shared,
              propertyCategory: "ROOM",
              furnished: input.furn === "Furnished" ? "FURNISHED" : "UNFURNISHED",
              bedrooms: input.beds,
              rentPeriod: PERIOD[input.period],
              rentPeriodOther: input.period === "Other" ? input.periodOther : null,
              advancePayments: input.adv,
              facilities: {
                selections: input.m,
                other: input.facOther,
                ...Object.fromEntries((["bath", "kit", "size", "floor", "store", "balc", "feat", "notinc", "othNote"] as const)
                  .filter(key => input[key]).map(key => [key, input[key]!])),
              },
              rules: {
                who: input.who,
                maxOcc: input.maxOcc,
                ...Object.fromEntries((["cooking", "visitors", "pets", "smoking", "curfew", "curfewTime", "noise", "otherRules"] as const)
                  .filter(key => input[key]).map(key => [key, input[key]!])),
              },
            },
      });

      await tx.listingPrivate.create({
        data: {
          listingId: listing.id,
          exactAddress: input.addr,
          directions: null,
          exactLatitude: input.lat ?? null,
          exactLongitude: input.lng ?? null,
          mapUrl: input.mapLink || null,
          moderationNotes: "",
        },
      });
      await tx.consent.create({
        data: {
          listingId: listing.id,
          privacyPolicyVersion: settings.privacyPolicyVersion,
          termsVersion: settings.termsVersion,
          checkboxValues: Object.fromEntries(CONSENT_KEYS.map(key => [key, true])),
          consentedAt: new Date(),
        },
      });
      await tx.listingImage.createMany({
        data: checked.map((photo, index) => ({
          listingId: listing.id,
          category: photo.category,
          storagePath: savedKeys[index],
          displayOrder: index,
        })),
      });
      await transitionListingInTransaction(tx, {
        listingId: listing.id,
        to: "PAYMENT_PENDING",
        actorType: "SYSTEM",
        actorId: null,
        source: "validated_submission",
      });
      return listing.id;
    });
    return { listingId, ownerEmail: input.email, created: true };
  } catch (error) {
    await deleteImages(savedKeys);
    throw error;
  }
}
