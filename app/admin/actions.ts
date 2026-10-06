"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authenticatePassword, createSession, logSecurityEvent, revokeSession, verifySessionMfa } from "@/lib/server/admin-auth";
import { clearSessionCookie, getAdminContext, readSessionToken, requestMeta, requireAdmin, setSessionCookie } from "@/lib/server/admin-session";
import { getDb } from "@/lib/server/db";
import { TransitionError, transitionListing } from "@/lib/server/listing-status";
import { consumeRateLimit, hashIp } from "@/lib/server/rate-limit";

const signInInput = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(256),
});

export async function signInAdmin(formData: FormData) {
  const parsed = signInInput.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) redirect("/admin?error=invalid");

  const { ip, userAgent } = await requestMeta();
  const ipHash = hashIp(ip);
  const limit = await consumeRateLimit("admin_login", ipHash, 10, 15 * 60);
  if (!limit.allowed) {
    await logSecurityEvent("ADMIN_LOGIN_RATE_LIMITED", "WARN", { ipHash });
    redirect("/admin?error=rate_limited");
  }

  const result = await authenticatePassword(parsed.data.email, parsed.data.password, ipHash);
  if (!result.ok) redirect(`/admin?error=${result.reason}`);

  // A fresh session on every sign-in (no session fixation); MFA is still required before access.
  await revokeSession(await readSessionToken());
  await setSessionCookie(await createSession(result.userId, ipHash, userAgent));
  redirect("/admin/verify");
}

export async function verifyAdminMfa(formData: FormData) {
  const context = await getAdminContext();
  if (!context) redirect("/admin");
  if (context.mfaVerified) redirect("/admin");

  const code = String(formData.get("code") || "").replace(/\s/g, "");
  if (!/^\d{6}$/.test(code)) redirect("/admin/verify?error=code");

  const limit = await consumeRateLimit("admin_mfa", hashIp(`session:${context.sessionId}`), 6, 5 * 60);
  if (!limit.allowed) redirect("/admin/verify?error=rate_limited");

  if (!(await verifySessionMfa(context, code))) redirect("/admin/verify?error=code");
  redirect("/admin");
}

export async function signOutAdmin() {
  await revokeSession(await readSessionToken());
  await clearSessionCookie();
  redirect("/admin");
}

function parseCedis(value: FormDataEntryValue | null): number | null {
  const amount = String(value || "").trim();
  if (!/^d{1,8}(?:.d{1,2})?$/.test(amount)) return null;
  const [whole, fraction = ""] = amount.split(".");
  const pesewas = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(pesewas) && pesewas > 0 && pesewas <= 2_147_483_647 ? pesewas : null;
}

/** Updates the Room / Hostel / Space listing fees (audited). New checkouts use the new amounts. */
export async function updateListingFees(formData: FormData) {
  const admin = await requireAdmin(["SUPER_ADMIN", "ADMIN"]);
  const roomFeePesewas = parseCedis(formData.get("roomFee"));
  const hostelFeePesewas = parseCedis(formData.get("hostelFee"));
  const spaceFeePesewas = parseCedis(formData.get("spaceFee"));
  const reason = String(formData.get("reason") || "").trim();
  if (!roomFeePesewas || !hostelFeePesewas || !spaceFeePesewas || reason.length < 3 || reason.length > 1000) {
    redirect("/admin/settings?fee=invalid");
  }

  try {
    await getDb().$transaction(async tx => {
      const previous = await tx.websiteSettings.findUniqueOrThrow({ where: { id: 1 } });
      const updated = await tx.websiteSettings.update({
        where: { id: 1 },
        data: { roomFeePesewas, hostelFeePesewas, spaceFeePesewas, updatedById: admin.user.id },
      });
      await tx.websiteSettingsHistory.create({
        data: {
          settingId: 1,
          roomFeePesewas: updated.roomFeePesewas,
          hostelFeePesewas: updated.hostelFeePesewas,
          spaceFeePesewas: updated.spaceFeePesewas,
          currency: updated.currency,
          confirmationDays: updated.confirmationDays,
          changedById: admin.user.id,
          reason,
        },
      });
      const fees = (row: typeof previous) => ({ room: row.roomFeePesewas, hostel: row.hostelFeePesewas, space: row.spaceFeePesewas });
      await tx.adminActivityLog.create({
        data: {
          adminUserId: admin.user.id,
          action: "LISTING_FEES_UPDATED",
          resourceType: "WEBSITE_SETTINGS",
          previousState: fees(previous),
          newState: fees(updated),
          reason,
          source: "admin_dashboard",
          metadata: {},
        },
      });
    });
  } catch (error) {
    console.error("admin_listing_fee_update_failed", error instanceof Error ? error.message : "unknown");
    redirect("/admin/settings?fee=save_failed");
  }
  revalidatePath("/admin");
  redirect("/admin/settings?fee=saved");
}

const reviewInput = z.object({
  listingId: z.uuid(),
  decision: z.enum(["approve", "changes", "reject"]),
  reason: z.string().trim().max(1000).optional(),
  from: z.enum(["dashboard", "detail", "listings"]).optional(),
});
const DECISION_STATUS = { approve: "LIVE", changes: "CHANGES_REQUESTED", reject: "REJECTED" } as const;

export async function reviewListing(formData: FormData) {
  const admin = await requireAdmin(["SUPER_ADMIN", "ADMIN", "MODERATOR"]);
  const parsed = reviewInput.safeParse({
    listingId: formData.get("listingId"),
    decision: formData.get("decision"),
    reason: formData.get("reason") || undefined,
    from: formData.get("from") || undefined,
  });
  if (!parsed.success) redirect("/admin?review=invalid#listings");
  const back = (code: string) =>
    parsed.data.from === "detail" ? `/admin/listings/${parsed.data.listingId}?review=${code}`
      : parsed.data.from === "listings" ? `/admin/listings?review=${code}`
      : `/admin?review=${code}`;
  if (parsed.data.decision !== "approve" && (parsed.data.reason?.length ?? 0) < 3) redirect(back("reason_required"));

  try {
    await transitionListing({
      listingId: parsed.data.listingId,
      to: DECISION_STATUS[parsed.data.decision],
      actorType: "ADMIN",
      actorId: admin.user.id,
      reason: parsed.data.reason,
      source: "admin_dashboard",
    });
    if (parsed.data.decision === "approve") {
      // The reviewer has seen the photos: publish them with the listing (profile photos stay private).
      await getDb().listingImage.updateMany({
        where: { listingId: parsed.data.listingId, category: { not: "PROFILE" } },
        data: { approvedForPublic: true },
      });
    }
  } catch (error) {
    if (error instanceof TransitionError) redirect(back("not_allowed"));
    console.error("admin_review_failed", error instanceof Error ? error.message : "unknown");
    redirect(back("failed"));
  }
  revalidatePath("/admin");
  redirect(back(parsed.data.decision));
}

const reportInput = z.object({
  reportId: z.uuid(),
  status: z.enum(["REVIEWING", "RESOLVED", "DISMISSED"]),
});

/** Moves a visitor report through the review queue (audited). */
export async function updateReportStatus(formData: FormData) {
  const admin = await requireAdmin(["SUPER_ADMIN", "ADMIN", "MODERATOR"]);
  const parsed = reportInput.safeParse({ reportId: formData.get("reportId"), status: formData.get("status") });
  if (!parsed.success) redirect("/admin/reports?report=invalid");

  try {
    await getDb().$transaction(async tx => {
      const previous = await tx.report.findUniqueOrThrow({ where: { id: parsed.data.reportId }, select: { status: true, listingId: true } });
      await tx.report.update({
        where: { id: parsed.data.reportId },
        data: { status: parsed.data.status, reviewedById: admin.user.id, reviewedAt: new Date() },
      });
      await tx.adminActivityLog.create({
        data: {
          adminUserId: admin.user.id,
          action: "REPORT_STATUS_CHANGED",
          resourceType: "REPORT",
          resourceId: parsed.data.reportId,
          previousState: { status: previous.status },
          newState: { status: parsed.data.status },
          source: "admin_dashboard",
          metadata: { listingId: previous.listingId },
        },
      });
    });
  } catch (error) {
    console.error("admin_report_update_failed", error instanceof Error ? error.message : "unknown");
    redirect("/admin/reports?report=failed");
  }
  revalidatePath("/admin/reports");
  redirect("/admin/reports?report=saved");
}
