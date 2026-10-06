"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { findManageToken, logManageUse } from "@/lib/server/manage-links";
import { confirmAvailable, markTaken, OwnerActionError, resubmit, updateUnitsAvailable } from "@/lib/server/owner-manage";
import { consumeRateLimit, hashIp } from "@/lib/server/rate-limit";

async function ipHash() {
  const h = await headers();
  return hashIp(h.get("x-nf-client-connection-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown");
}

/** Resolves the token, rate-limits, runs the owner action and logs it. */
async function run(formData: FormData, action: string, work: (listingId: string) => Promise<unknown>) {
  const token = String(formData.get("token") ?? "");
  const ip = await ipHash();
  const limit = await consumeRateLimit("owner_manage", ip, 30, 600);
  if (!limit.allowed) redirect(`/manage/${encodeURIComponent(token)}?msg=rate_limited`);

  const found = await findManageToken(token);
  if (!found) {
    await logManageUse({ tokenId: null, listingId: null, action, succeeded: false, ipHash: ip });
    redirect(`/manage/${encodeURIComponent(token)}`);
  }

  let message = `${action}_ok`;
  try {
    await work(found.listingId);
    await logManageUse({ tokenId: found.tokenId, listingId: found.listingId, action, succeeded: true, ipHash: ip });
  } catch (error) {
    await logManageUse({ tokenId: found.tokenId, listingId: found.listingId, action, succeeded: false, ipHash: ip });
    if (error instanceof OwnerActionError) {
      message = error.code;
    } else {
      console.error("owner_manage_failed", error instanceof Error ? error.message : "unknown");
      message = "failed";
    }
  }
  revalidatePath("/admin");
  redirect(`/manage/${token}?msg=${message}`);
}

export async function ownerConfirm(formData: FormData) {
  await run(formData, "confirm", listingId => confirmAvailable(listingId));
}

export async function ownerMarkTaken(formData: FormData) {
  await run(formData, "taken", listingId => markTaken(listingId));
}

export async function ownerUpdateUnits(formData: FormData) {
  await run(formData, "units", listingId => updateUnitsAvailable(listingId, Number(formData.get("units"))));
}

export async function ownerResubmit(formData: FormData) {
  await run(formData, "resubmit", listingId =>
    resubmit(listingId, {
      title: formData.get("title"),
      description: formData.get("description"),
      rent: formData.get("rent"),
      unitsAvailable: formData.get("unitsAvailable"),
      landmark: formData.get("landmark") || "",
      availabilityDate: formData.get("availabilityDate"),
    }),
  );
}
