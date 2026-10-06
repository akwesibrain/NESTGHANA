import "server-only";
import { getDb } from "./db";
import { transitionListing } from "./listing-status";
import { queueOwnerMessage } from "./notifications";

// Daily availability check: LIVE listings not confirmed within website_settings.confirmation_days
// become NEEDS_CONFIRMATION (still visible, flagged for renters) and the owner is asked to confirm
// through their manage link. Run with `npm run jobs:availability` (e.g. once a day on a schedule).

export async function runAvailabilityCheck(baseUrl: string, now = new Date()) {
  const db = getDb();
  const settings = await db.websiteSettings.findUniqueOrThrow({ where: { id: 1 }, select: { confirmationDays: true } });
  const cutoff = new Date(now.getTime() - settings.confirmationDays * 86_400_000);
  const stale = await db.listing.findMany({
    where: { status: "LIVE", OR: [{ lastConfirmedAt: null }, { lastConfirmedAt: { lt: cutoff } }] },
    select: { id: true },
    take: 500,
  });

  let flagged = 0;
  const failures: string[] = [];
  for (const { id } of stale) {
    try {
      await transitionListing({ listingId: id, to: "NEEDS_CONFIRMATION", actorType: "SYSTEM", actorId: null, source: "availability_job" });
      await queueOwnerMessage(db, { listingId: id, template: "needs_confirmation", baseUrl });
      flagged++;
    } catch (error) {
      failures.push(id);
      console.error("availability_check_failed", id, error instanceof Error ? error.message : "unknown");
    }
  }
  return { checked: stale.length, flagged, failures, confirmationDays: settings.confirmationDays };
}
