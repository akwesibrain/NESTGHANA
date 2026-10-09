"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authenticatePassword, createSession, logSecurityEvent, revokeSession, verifySessionMfa } from "@/lib/server/admin-auth";
import { clearSessionCookie, getAdminContext, readSessionToken, requestMeta, requireAdmin, setSessionCookie, siteBase } from "@/lib/server/admin-session";
import { hashPassword, PASSWORD_MIN_LENGTH } from "@/lib/server/admin-crypto";
import { revokeManageLinks } from "@/lib/server/manage-links";
import { containsManageLink, queueOwnerMessage, REDACTED } from "@/lib/server/notifications";
import { getDb } from "@/lib/server/db";
import { TransitionError, transitionListing } from "@/lib/server/listing-status";
import { consumeRateLimit, hashIp } from "@/lib/server/rate-limit";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { VERIFIED_CONTACT_TYPES } from "@/lib/server/listing-trust";

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

  if (!(await verifyTurnstile(formData.get("cf-turnstile-response"), ip))) redirect("/admin?error=bot_check");

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
  // Tell the owner (queued in Admin > Messages). A failure here must not undo or misreport the review.
  try {
    await queueOwnerMessage(getDb(), {
      listingId: parsed.data.listingId,
      template: parsed.data.decision === "approve" ? "approved" : parsed.data.decision === "changes" ? "changes_requested" : "rejected",
      baseUrl: await siteBase(),
      reason: parsed.data.reason,
    });
  } catch (error) {
    console.error("owner_notification_queue_failed", error instanceof Error ? error.message : "unknown");
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

// ───────────────────────── Listing management (detail page) ─────────────────────────

const statusInput = z.object({
  listingId: z.uuid(),
  to: z.enum(["UNAVAILABLE", "LIVE", "REMOVED", "RESTORE"]),
  reason: z.string().trim().max(1000).optional(),
});

/** Unpublish, re-publish, remove or restore a listing. Removal needs a reason; restore is SUPER_ADMIN only (enforced by transitionListing). */
export async function changeListingStatus(formData: FormData) {
  const admin = await requireAdmin(["SUPER_ADMIN", "ADMIN", "MODERATOR"]);
  const parsed = statusInput.safeParse({ listingId: formData.get("listingId"), to: formData.get("to"), reason: formData.get("reason") || undefined });
  if (!parsed.success) redirect("/admin/listings?review=invalid");
  const back = (code: string) => `/admin/listings/${parsed.data.listingId}?review=${code}`;
  if (parsed.data.to === "REMOVED" && (parsed.data.reason?.length ?? 0) < 3) redirect(back("reason_required"));
  try {
    await transitionListing({
      listingId: parsed.data.listingId,
      // For a REMOVED listing, transitionListing restores the status it had before removal.
      to: parsed.data.to === "RESTORE" ? "LIVE" : parsed.data.to,
      actorType: "ADMIN",
      actorId: admin.user.id,
      reason: parsed.data.reason,
      source: "admin_dashboard",
    });
  } catch (error) {
    if (error instanceof TransitionError) redirect(back("not_allowed"));
    console.error("admin_status_change_failed", error instanceof Error ? error.message : "unknown");
    redirect(back("failed"));
  }
  revalidatePath("/admin");
  redirect(back(`status_${parsed.data.to.toLowerCase()}`));
}

const verifyInput = z.object({
  listingId: z.uuid(),
  check: z.enum(["phone", "identity", "property", "price", "availability"]),
  value: z.enum(["on", "off"]),
});

/**
 * Records (or clears) a verification check. Phone, identity and property together make the public
 * "Verified" badge appear; property, price, availability and identity each also show their own badge.
 */
export async function setVerification(formData: FormData) {
  const admin = await requireAdmin(["SUPER_ADMIN", "ADMIN", "MODERATOR"]);
  const parsed = verifyInput.safeParse({ listingId: formData.get("listingId"), check: formData.get("check"), value: formData.get("value") });
  if (!parsed.success) redirect("/admin/listings?review=invalid");
  const { listingId, check, value } = parsed.data;
  const at = value === "on" ? new Date() : null;
  const by = value === "on" ? admin.user.id : null;
  const fields = {
    phone: { phoneVerifiedAt: at, phoneVerifiedById: by },
    identity: { identityVerifiedAt: at, identityVerifiedById: by },
    property: { propertyVerifiedAt: at, propertyVerifiedById: by },
    price: { priceVerifiedAt: at, priceVerifiedById: by },
    availability: { availabilityVerifiedAt: at, availabilityVerifiedById: by },
  }[check];
  await getDb().$transaction(async tx => {
    await tx.listingVerification.upsert({ where: { listingId }, create: { listingId, ...fields }, update: fields });
    await tx.adminActivityLog.create({
      data: {
        adminUserId: admin.user.id, action: "LISTING_VERIFICATION_CHANGED", resourceType: "LISTING", resourceId: listingId,
        newState: { check, verified: value === "on" }, source: "admin_dashboard", metadata: {},
      },
    });
  });
  revalidatePath(`/admin/listings/${listingId}`);
  redirect(`/admin/listings/${listingId}?review=verification_saved`);
}

const visitInput = z.object({
  listingId: z.uuid(),
  // A calendar date (YYYY-MM-DD) or empty to clear the visit.
  visitedOn: z.union([z.literal(""), z.iso.date()]),
});

/** Records the date a NestGH team member visited the property, or clears it. Future dates are refused. */
export async function setSiteVisit(formData: FormData) {
  const admin = await requireAdmin(["SUPER_ADMIN", "ADMIN", "MODERATOR"]);
  const parsed = visitInput.safeParse({ listingId: formData.get("listingId"), visitedOn: formData.get("visitedOn") ?? "" });
  if (!parsed.success) redirect("/admin/listings?review=invalid");
  const { listingId, visitedOn } = parsed.data;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Accra" }).format(new Date());
  if (visitedOn > today) redirect(`/admin/listings/${listingId}?review=visit_future`);
  const fields = visitedOn
    ? { visitedOn: new Date(`${visitedOn}T00:00:00Z`), visitedById: admin.user.id }
    : { visitedOn: null, visitedById: null };
  await getDb().$transaction(async tx => {
    await tx.listingVerification.upsert({ where: { listingId }, create: { listingId, ...fields }, update: fields });
    await tx.adminActivityLog.create({
      data: {
        adminUserId: admin.user.id, action: "LISTING_SITE_VISIT_CHANGED", resourceType: "LISTING", resourceId: listingId,
        newState: { visitedOn: visitedOn || null }, source: "admin_dashboard", metadata: {},
      },
    });
  });
  revalidatePath(`/admin/listings/${listingId}`);
  redirect(`/admin/listings/${listingId}?review=verification_saved`);
}

const trustInput = z.object({
  listingId: z.uuid(),
  availabilityLabel: z.enum(["", "AVAILABLE", "ALMOST_TAKEN", "RESERVED", "RENTED"]),
  contactType: z.enum(["", "DIRECT_OWNER", "VERIFIED_AGENT", "VERIFIED_PROPERTY_MANAGER", "CARETAKER"]),
});

/** Sets the availability label and confirmed contact type renters see ("" clears either). */
export async function setListingTrust(formData: FormData) {
  const admin = await requireAdmin(["SUPER_ADMIN", "ADMIN", "MODERATOR"]);
  const parsed = trustInput.safeParse({
    listingId: formData.get("listingId"),
    availabilityLabel: formData.get("availabilityLabel") ?? "",
    contactType: formData.get("contactType") ?? "",
  });
  if (!parsed.success) redirect("/admin/listings?review=invalid");
  const { listingId } = parsed.data;
  const availabilityLabel = parsed.data.availabilityLabel || null;
  const contactType = parsed.data.contactType || null;
  const db = getDb();
  if (contactType && VERIFIED_CONTACT_TYPES.has(contactType)) {
    // "Verified Agent/Property Manager" is a claim: it needs the identity check on record first.
    const v = await db.listingVerification.findUnique({ where: { listingId }, select: { identityVerifiedAt: true } });
    if (!v?.identityVerifiedAt) redirect(`/admin/listings/${listingId}?review=contact_needs_identity`);
  }
  await db.$transaction(async tx => {
    const updated = await tx.listing.update({ where: { id: listingId }, data: { availabilityLabel, contactType }, select: { id: true } });
    await tx.adminActivityLog.create({
      data: {
        adminUserId: admin.user.id, action: "LISTING_TRUST_CHANGED", resourceType: "LISTING", resourceId: updated.id,
        newState: { availabilityLabel, contactType }, source: "admin_dashboard", metadata: {},
      },
    });
  });
  revalidatePath(`/admin/listings/${listingId}`);
  redirect(`/admin/listings/${listingId}?review=trust_saved`);
}

/** Queues a WhatsApp message with a fresh manage link for the owner, or revokes all their links. */
export async function ownerLinkAction(formData: FormData) {
  const admin = await requireAdmin(["SUPER_ADMIN", "ADMIN", "MODERATOR"]);
  const listingId = z.uuid().safeParse(formData.get("listingId"));
  const action = formData.get("action");
  if (!listingId.success || (action !== "send" && action !== "revoke")) redirect("/admin/listings?review=invalid");
  const db = getDb();
  if (action === "send") {
    await queueOwnerMessage(db, { listingId: listingId.data, template: "manage_link", baseUrl: await siteBase() });
  } else {
    const count = await revokeManageLinks(listingId.data);
    await db.adminActivityLog.create({
      data: {
        adminUserId: admin.user.id, action: "MANAGE_LINKS_REVOKED", resourceType: "LISTING", resourceId: listingId.data,
        newState: { revoked: count }, source: "admin_dashboard", metadata: {},
      },
    });
  }
  redirect(action === "send" ? "/admin/messages?msg=queued" : `/admin/listings/${listingId.data}?review=links_revoked`);
}

// ───────────────────────── Messages (notification outbox) ─────────────────────────

const messageInput = z.object({ id: z.uuid(), status: z.enum(["SENT", "DISMISSED"]) });

export async function updateMessage(formData: FormData) {
  const admin = await requireAdmin(["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT"]);
  const parsed = messageInput.safeParse({ id: formData.get("id"), status: formData.get("status") });
  if (!parsed.success) redirect("/admin/messages?msg=invalid");
  const db = getDb();
  const message = await db.notification.findUnique({ where: { id: parsed.data.id }, select: { template: true, status: true } });
  if (!message || message.status !== "PENDING") redirect("/admin/messages?msg=invalid");
  await db.notification.update({
    where: { id: parsed.data.id },
    data: {
      status: parsed.data.status,
      sentById: admin.user.id,
      sentAt: parsed.data.status === "SENT" ? new Date() : null,
      // Do not keep live manage links in the database once handled.
      ...(containsManageLink(message.template) ? { message: REDACTED } : {}),
    },
  });
  revalidatePath("/admin/messages");
  redirect(`/admin/messages?msg=${parsed.data.status.toLowerCase()}`);
}

// ───────────────────────── Admin team (SUPER_ADMIN) ─────────────────────────

const newAdminInput = z.object({
  email: z.email().max(254).transform(v => v.toLowerCase()),
  name: z.string().trim().min(2).max(120),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT"]),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(256),
});

/** Creates an admin with a temporary password; they set up their authenticator at first sign-in. */
export async function createAdminAccount(formData: FormData) {
  const admin = await requireAdmin(["SUPER_ADMIN"]);
  const parsed = newAdminInput.safeParse({
    email: formData.get("email"), name: formData.get("name"), role: formData.get("role"), password: formData.get("password"),
  });
  if (!parsed.success) redirect("/admin/settings?team=invalid");
  const db = getDb();
  if (await db.adminUser.findUnique({ where: { email: parsed.data.email }, select: { id: true } })) redirect("/admin/settings?team=exists");
  const created = await db.adminUser.create({
    data: {
      email: parsed.data.email,
      displayName: parsed.data.name,
      passwordHash: await hashPassword(parsed.data.password),
      roles: { create: { role: parsed.data.role, grantedById: admin.user.id } },
    },
  });
  await db.adminActivityLog.create({
    data: {
      adminUserId: admin.user.id, action: "ADMIN_CREATED", resourceType: "ADMIN_USER", resourceId: created.id,
      newState: { email: created.email, role: parsed.data.role }, source: "admin_dashboard", metadata: {},
    },
  });
  revalidatePath("/admin/settings");
  redirect("/admin/settings?team=created");
}

const teamActionInput = z.object({ userId: z.uuid(), action: z.enum(["disable", "enable", "reset_mfa"]) });

/** Disable/enable an admin or force authenticator re-enrolment (signs them out everywhere). */
export async function updateAdminAccount(formData: FormData) {
  const admin = await requireAdmin(["SUPER_ADMIN"]);
  const parsed = teamActionInput.safeParse({ userId: formData.get("userId"), action: formData.get("action") });
  if (!parsed.success) redirect("/admin/settings?team=invalid");
  if (parsed.data.userId === admin.user.id) redirect("/admin/settings?team=self");
  const db = getDb();
  await db.$transaction([
    db.adminUser.update({
      where: { id: parsed.data.userId },
      data: parsed.data.action === "disable" ? { isActive: false }
        : parsed.data.action === "enable" ? { isActive: true, failedLoginCount: 0, lockedUntil: null }
        : { mfaSecretEnc: null, mfaEnabledAt: null, mfaLastStep: null },
    }),
    db.adminSession.updateMany({ where: { userId: parsed.data.userId, revokedAt: null }, data: { revokedAt: new Date() } }),
    db.adminActivityLog.create({
      data: {
        adminUserId: admin.user.id, action: `ADMIN_${parsed.data.action.toUpperCase()}`, resourceType: "ADMIN_USER",
        resourceId: parsed.data.userId, source: "admin_dashboard", metadata: {},
      },
    }),
  ]);
  revalidatePath("/admin/settings");
  redirect(`/admin/settings?team=${parsed.data.action}`);
}
