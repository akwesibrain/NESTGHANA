import "server-only";
import { z } from "zod";
import { getDb } from "./db";
import { transitionListing, transitionListingInTransaction, TransitionError } from "./listing-status";

// What an owner can do through their manage link. Every status change still goes through
// transitionListing (actor OWNER, source owner_manage), so the same rules apply as everywhere else.

/** Owner-facing failure. Only the code travels in the URL; the page maps it to fixed text. */
export class OwnerActionError extends Error {
  constructor(readonly code: "not_live" | "cannot_mark_taken" | "units_not_live" | "units_range" | "invalid_field" | "not_waiting") {
    super(code);
  }
}

export async function getOwnerView(listingId: string) {
  const listing = await getDb().listing.findUniqueOrThrow({
    where: { id: listingId },
    select: {
      id: true, title: true, description: true, status: true, propertyCategory: true, roomType: true,
      rentAmountPesewas: true, unitsTotal: true, unitsAvailable: true, landmark: true, availabilityDate: true,
      lastConfirmedAt: true, createdAt: true,
      area: { select: { name: true, parent: { select: { name: true } } } },
      owner: { select: { fullName: true } },
      statusHistory: {
        where: { newStatus: { in: ["CHANGES_REQUESTED", "REJECTED", "REMOVED"] } },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { reason: true, newStatus: true },
      },
    },
  });
  return listing;
}

/** "Still available": refreshes the confirmation date, or brings a listing that needed confirmation back live. */
export async function confirmAvailable(listingId: string) {
  const db = getDb();
  const { status } = await db.listing.findUniqueOrThrow({ where: { id: listingId }, select: { status: true } });
  if (status === "LIVE") {
    const now = new Date();
    await db.listing.update({ where: { id: listingId }, data: { lastConfirmedAt: now } });
  } else if (status === "NEEDS_CONFIRMATION" || status === "UNAVAILABLE") {
    await transitionListing({ listingId, to: "LIVE", actorType: "OWNER", actorId: null, source: "owner_manage" });
  } else {
    throw new OwnerActionError("not_live");
  }
  await db.listingAvailability.upsert({
    where: { listingId },
    create: { listingId, lastConfirmedAt: new Date(), confirmedBy: "OWNER" },
    update: { lastConfirmedAt: new Date(), confirmedBy: "OWNER" },
  });
}

export async function markTaken(listingId: string) {
  try {
    await transitionListing({ listingId, to: "UNAVAILABLE", actorType: "OWNER", actorId: null, source: "owner_manage" });
  } catch (error) {
    if (error instanceof TransitionError) throw new OwnerActionError("cannot_mark_taken");
    throw error;
  }
}

export async function updateUnitsAvailable(listingId: string, units: number) {
  const db = getDb();
  const listing = await db.listing.findUniqueOrThrow({ where: { id: listingId }, select: { status: true, unitsTotal: true } });
  if (!["LIVE", "NEEDS_CONFIRMATION"].includes(listing.status)) throw new OwnerActionError("units_not_live");
  if (!Number.isInteger(units) || units < 0 || units > listing.unitsTotal) throw new OwnerActionError("units_range");
  if (units === 0) return markTaken(listingId);
  await db.listing.update({ where: { id: listingId }, data: { unitsAvailable: units, lastConfirmedAt: new Date() } });
}

export const resubmitInput = z.object({
  title: z.string().trim().min(8).max(100),
  description: z.string().trim().min(100).max(5000),
  rent: z.coerce.number().gt(0).max(21_474_836),
  unitsAvailable: z.coerce.number().int().min(1).max(500),
  landmark: z.string().trim().max(200).optional().default(""),
  availabilityDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

/** Applies the owner's corrections and sends the listing back for review. */
export async function resubmit(listingId: string, raw: unknown) {
  const parsed = resubmitInput.safeParse(raw);
  if (!parsed.success) throw new OwnerActionError("invalid_field");
  const input = parsed.data;
  const db = getDb();
  const listing = await db.listing.findUniqueOrThrow({ where: { id: listingId }, select: { status: true, unitsTotal: true } });
  if (listing.status !== "CHANGES_REQUESTED") throw new OwnerActionError("not_waiting");
  if (input.unitsAvailable > listing.unitsTotal) throw new OwnerActionError("units_range");

  await db.$transaction(async tx => {
    await tx.listing.update({
      where: { id: listingId },
      data: {
        title: input.title,
        description: input.description,
        rentAmountPesewas: Math.round(input.rent * 100),
        unitsAvailable: input.unitsAvailable,
        landmark: input.landmark,
        availabilityDate: new Date(`${input.availabilityDate}T00:00:00Z`),
      },
    });
    await transitionListingInTransaction(tx, { listingId, to: "PENDING_APPROVAL", actorType: "OWNER", actorId: null, source: "owner_manage" });
  });
}
