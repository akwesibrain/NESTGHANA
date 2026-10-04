import "server-only";
import type { ActorType, AdminRole, ListingStatus } from "@/generated/prisma/client";
import { getDb } from "./db";

// The only way a listing's status may change (port of the Supabase transition_listing function).
// The listings_guard_status_upd trigger rejects any status update made without
// @nestgh_status_transition = 1, which this function sets inside its own transaction.

export class TransitionError extends Error {}

type Transition = {
  listingId: string;
  to: ListingStatus;
  actorType: ActorType;
  /** Admin user id for ADMIN transitions; null for SYSTEM and OWNER. */
  actorId: string | null;
  reason?: string | null;
  source: string;
};

const REASON_REQUIRED: ListingStatus[] = ["CHANGES_REQUESTED", "REJECTED", "REMOVED"];
const MODERATOR_ROLES: AdminRole[] = ["SUPER_ADMIN", "ADMIN", "MODERATOR"];

function isAllowed(from: ListingStatus, t: Transition, adminRoles: AdminRole[]): boolean {
  const { to, actorType: actor, source } = t;
  const admin = actor === "ADMIN";
  switch (from) {
    case "DRAFT":
      return to === "PAYMENT_PENDING" && actor === "SYSTEM" && source === "validated_submission";
    case "PAYMENT_PENDING":
      if (to === "PENDING_APPROVAL") return actor === "SYSTEM" && source === "verified_payment";
      if (to === "REMOVED") return admin || (actor === "SYSTEM" && ["draft_purge", "payment_abandoned"].includes(source));
      return false;
    case "PENDING_APPROVAL":
      return admin && ["LIVE", "CHANGES_REQUESTED", "REJECTED"].includes(to);
    case "CHANGES_REQUESTED":
      return to === "PENDING_APPROVAL" && actor === "OWNER" && source === "owner_manage";
    case "LIVE":
      if (to === "UNAVAILABLE") return admin || (actor === "OWNER" && source === "owner_manage");
      if (to === "NEEDS_CONFIRMATION") return actor === "SYSTEM" && source === "availability_job";
      return to === "REMOVED" && admin;
    case "NEEDS_CONFIRMATION":
    case "UNAVAILABLE":
      if (to === "LIVE") return admin || (actor === "OWNER" && source === "owner_manage");
      if (to === "UNAVAILABLE") return from === "NEEDS_CONFIRMATION" && (admin || (actor === "OWNER" && source === "owner_manage"));
      return to === "REMOVED" && admin;
    case "REJECTED":
      return to === "REMOVED" && admin;
    case "REMOVED":
      // Restoring is handled separately: only a SUPER_ADMIN may, and only to the pre-removal status.
      return admin && adminRoles.includes("SUPER_ADMIN");
  }
}

export async function transitionListing(t: Transition) {
  if (t.source.length < 1 || t.source.length > 100) throw new TransitionError("Invalid transition source.");
  const reason = t.reason?.trim() || null;

  return getDb().$transaction(async tx => {
    let adminRoles: AdminRole[] = [];
    if (t.actorType === "ADMIN") {
      if (!t.actorId) throw new TransitionError("Admin identity is required.");
      const admin = await tx.adminUser.findFirst({
        where: { id: t.actorId, isActive: true },
        select: { roles: { select: { role: true } } },
      });
      adminRoles = admin?.roles.map(r => r.role) ?? [];
      if (!adminRoles.some(role => MODERATOR_ROLES.includes(role))) throw new TransitionError("Admin role required.");
    } else if (t.actorId) {
      throw new TransitionError("System and owner transitions do not take an actor id.");
    }

    // Lock the listing row for the rest of the transaction.
    const [locked] = await tx.$queryRaw<{ status: ListingStatus; approved_at: Date | null }[]>`
      SELECT status, approved_at FROM listings WHERE id = ${t.listingId} FOR UPDATE`;
    if (!locked) throw new TransitionError("Listing not found.");
    const from = locked.status;

    let to = t.to;
    if (!isAllowed(from, t, adminRoles)) throw new TransitionError("Status transition is not allowed.");
    if (from === "REMOVED") {
      const last = await tx.listingStatusHistory.findFirst({
        where: { listingId: t.listingId, newStatus: "REMOVED" },
        orderBy: { createdAt: "desc" },
        select: { previousStatus: true },
      });
      if (!last?.previousStatus) throw new TransitionError("No status to restore.");
      to = last.previousStatus;
    }

    if (REASON_REQUIRED.includes(to) && (reason?.length ?? 0) < 3) {
      throw new TransitionError("A reason is required for this transition.");
    }
    if (to === "LIVE") {
      const paid = await tx.payment.count({ where: { listingId: t.listingId, status: "PAID" } });
      if (!paid) throw new TransitionError("A listing needs a paid fee before going live.");
      if (!locked.approved_at && t.actorType !== "ADMIN") throw new TransitionError("First publication requires admin approval.");
    }

    const now = new Date();
    const approving = to === "LIVE" && t.actorType === "ADMIN";
    await tx.$executeRaw`SET @nestgh_status_transition = 1`;
    try {
      await tx.listing.update({
        where: { id: t.listingId },
        data: {
          status: to,
          ...(approving ? { approvedById: t.actorId, approvedAt: now } : {}),
          ...(to === "LIVE" ? { lastConfirmedAt: now } : {}),
        },
      });
    } finally {
      await tx.$executeRaw`SET @nestgh_status_transition = NULL`;
    }

    await tx.listingStatusHistory.create({
      data: { listingId: t.listingId, previousStatus: from, newStatus: to, actorType: t.actorType, actorId: t.actorId, reason, source: t.source },
    });
    if (t.actorType === "ADMIN") {
      await tx.adminActivityLog.create({
        data: {
          adminUserId: t.actorId,
          action: "LISTING_STATUS_CHANGED",
          resourceType: "LISTING",
          resourceId: t.listingId,
          previousState: { status: from },
          newState: { status: to },
          reason,
          source: t.source,
          metadata: {},
        },
      });
    }
    return { from, to };
  });
}
