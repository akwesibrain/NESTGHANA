import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import { getDb } from "./db";
import { createManageLink, manageUrl } from "./manage-links";

// Owner notifications. Messages are queued in the `notifications` outbox; admins send them from
// Admin → Messages with one click (opens WhatsApp with the text filled in). When a WhatsApp or
// email provider is added, a sender can drain the same outbox automatically.

type Db = Prisma.TransactionClient | ReturnType<typeof getDb>;

export type OwnerTemplate = "approved" | "changes_requested" | "rejected" | "needs_confirmation" | "manage_link";

const LINK_TEMPLATES: OwnerTemplate[] = ["approved", "changes_requested", "needs_confirmation", "manage_link"];
export const REDACTED = "[Message sent. The manage link it contained is not stored.]";

function compose(template: OwnerTemplate, title: string, ownerName: string, link: string | null, reason?: string | null) {
  const hello = `Hello ${ownerName}, this is NestGH about your listing "${title}".`;
  switch (template) {
    case "approved":
      return `${hello}\n\nGood news: it has been approved and is now live on NestGH.\n\nUse this private link to confirm availability or mark it as taken later (keep it safe, do not share it):\n${link}`;
    case "changes_requested":
      return `${hello}\n\nPlease update it before we can publish it.\nWhat to change: ${reason ?? "see the note in your listing"}\n\nUpdate and resubmit here (private link, do not share it):\n${link}`;
    case "rejected":
      return `${hello}\n\nUnfortunately it was not approved.\nReason: ${reason ?? "it did not meet the NestGH listing rules"}\n\nReply to this message if you have questions.`;
    case "needs_confirmation":
      return `${hello}\n\nIs it still available? Please confirm, or mark it as taken, using your private link:\n${link}\n\nUnconfirmed listings show as "needs confirmation" to renters.`;
    case "manage_link":
      return `${hello}\n\nHere is your private link to manage it (confirm availability, mark it as taken, or update it when we ask for changes). Keep it safe and do not share it:\n${link}`;
  }
}

/** Queues a WhatsApp message to the listing's owner. Templates that need a manage link get a fresh one. */
export async function queueOwnerMessage(
  db: Db,
  input: { listingId: string; template: OwnerTemplate; baseUrl: string; reason?: string | null },
) {
  const listing = await db.listing.findUniqueOrThrow({
    where: { id: input.listingId },
    select: { title: true, owner: { select: { fullName: true, whatsappE164: true } } },
  });
  const link = LINK_TEMPLATES.includes(input.template) ? manageUrl(input.baseUrl, await createManageLink(input.listingId, db)) : null;
  return db.notification.create({
    data: {
      listingId: input.listingId,
      channel: "WHATSAPP",
      recipient: listing.owner.whatsappE164,
      template: input.template,
      message: compose(input.template, listing.title, listing.owner.fullName, link, input.reason),
    },
  });
}

/** WhatsApp click-to-chat URL with the message prefilled. */
export function whatsappUrl(recipientE164: string, message: string) {
  return `https://wa.me/${recipientE164.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function containsManageLink(template: string) {
  return LINK_TEMPLATES.includes(template as OwnerTemplate);
}
