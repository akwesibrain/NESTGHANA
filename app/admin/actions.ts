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

export async function updateListingFee(formData: FormData) {
  const admin = await requireAdmin(["SUPER_ADMIN", "ADMIN"]);
  const amount = String(formData.get("feeGhs") || "").trim();
  const reason = String(formData.get("reason") || "").trim();
  if (!/^\d{1,8}(?:\.\d{1,2})?$/.test(amount) || reason.length < 3 || reason.length > 1000) {
    redirect("/admin?fee=invalid");
  }
  const [whole, fraction = ""] = amount.split(".");
  const listingFeePesewas = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(listingFeePesewas) || listingFeePesewas <= 0 || listingFeePesewas > 2_147_483_647) {
    redirect("/admin?fee=invalid");
  }

  try {
    await getDb().$transaction(async tx => {
      const previous = await tx.websiteSettings.findUniqueOrThrow({ where: { id: 1 } });
      const updated = await tx.websiteSettings.update({
        where: { id: 1 },
        data: { listingFeePesewas, updatedById: admin.user.id },
      });
      await tx.websiteSettingsHistory.create({
        data: {
          settingId: 1,
          listingFeePesewas: updated.listingFeePesewas,
          currency: updated.currency,
          confirmationDays: updated.confirmationDays,
          changedById: admin.user.id,
          reason,
        },
      });
      await tx.adminActivityLog.create({
        data: {
          adminUserId: admin.user.id,
          action: "LISTING_FEE_UPDATED",
          resourceType: "WEBSITE_SETTINGS",
          previousState: { listingFeePesewas: previous.listingFeePesewas },
          newState: { listingFeePesewas: updated.listingFeePesewas },
          reason,
          source: "admin_dashboard",
          metadata: {},
        },
      });
    });
  } catch (error) {
    console.error("admin_listing_fee_update_failed", error instanceof Error ? error.message : "unknown");
    redirect("/admin?fee=save_failed");
  }
  revalidatePath("/admin");
  redirect("/admin?fee=saved#website-settings");
}

const reviewInput = z.object({
  listingId: z.uuid(),
  decision: z.enum(["approve", "changes", "reject"]),
  reason: z.string().trim().max(1000).optional(),
});
const DECISION_STATUS = { approve: "LIVE", changes: "CHANGES_REQUESTED", reject: "REJECTED" } as const;

export async function reviewListing(formData: FormData) {
  const admin = await requireAdmin(["SUPER_ADMIN", "ADMIN", "MODERATOR"]);
  const parsed = reviewInput.safeParse({
    listingId: formData.get("listingId"),
    decision: formData.get("decision"),
    reason: formData.get("reason") || undefined,
  });
  if (!parsed.success) redirect("/admin?review=invalid#listings");
  if (parsed.data.decision !== "approve" && (parsed.data.reason?.length ?? 0) < 3) {
    redirect("/admin?review=reason_required#listings");
  }

  try {
    await transitionListing({
      listingId: parsed.data.listingId,
      to: DECISION_STATUS[parsed.data.decision],
      actorType: "ADMIN",
      actorId: admin.user.id,
      reason: parsed.data.reason,
      source: "admin_dashboard",
    });
  } catch (error) {
    if (error instanceof TransitionError) redirect("/admin?review=not_allowed#listings");
    console.error("admin_review_failed", error instanceof Error ? error.message : "unknown");
    redirect("/admin?review=failed#listings");
  }
  revalidatePath("/admin");
  redirect(`/admin?review=${parsed.data.decision}#listings`);
}
