import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, env, isAllowedBrowserOrigin, jsonResponse } from "../_shared/http.ts";
import { getPaystackTransaction, recordVerifiedPayment } from "../_shared/payment.ts";

const requiredPhotos = ["Exterior", "Bedroom", "Bathroom", "Kitchen", "Compound or common area"];
const supportedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const roomTypes = new Set(["Single Room", "Chamber & Hall", "Self-Contained", "1-in-a-Room", "2-in-a-Room", "4-in-a-Room", "Student Hostel"]);
const conditions = new Set(["New", "Newly Renovated", "Good Condition", "Fair Condition"]);
const policyLabels = [
  "authorized_to_list",
  "information_accurate",
  "room_available",
  "availability_contact_consent",
  "profile_and_contact_display_consent",
  "moderation_terms_accepted",
];

type ListingInput = Record<string, unknown>;
type PhotoUpload = { category: string; path: string; display_order: number; file: File };

function numberValue(value: unknown): number {
  return Number(value);
}

function normalizePhone(value: string): string {
  const digits = value.replace(/[\s-]/g, "");
  return digits.startsWith("0") ? `+233${digits.slice(1)}` : digits.startsWith("+") ? digits : `+${digits}`;
}

function slugify(value: string): string {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100);
}

async function findOrCreateLocation(
  supabase: ReturnType<typeof createClient>,
  kind: "REGION" | "TOWN" | "AREA",
  name: string,
  parentId?: string,
): Promise<string> {
  let query = supabase.from("locations").select("id").eq("kind", kind).ilike("name", name);
  query = parentId ? query.eq("parent_id", parentId) : query.is("parent_id", null);
  const { data: existing, error: lookupError } = await query.maybeSingle();
  if (lookupError) throw lookupError;
  if (existing) return existing.id;

  const row = { kind, name, slug: slugify(name), ...(parentId ? { parent_id: parentId } : {}) };
  const { data: created, error: insertError } = await supabase.from("locations").insert(row).select("id").single();
  if (!insertError) return created.id;

  let retry = supabase.from("locations").select("id").eq("kind", kind).ilike("name", name);
  retry = parentId ? retry.eq("parent_id", parentId) : retry.is("parent_id", null);
  const { data: raced, error: retryError } = await retry.maybeSingle();
  if (retryError) throw retryError;
  if (raced) return raced.id;
  throw insertError;
}

function rentPeriod(value: unknown): string | null {
  const periods: Record<string, string> = {
    Monthly: "MONTH",
    "3 Months": "THREE_MONTHS",
    "6 Months": "SIX_MONTHS",
    Yearly: "YEAR",
    Semester: "SEMESTER",
    Other: "OTHER",
  };
  return typeof value === "string" ? periods[value] ?? null : null;
}

function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders(request) });
  if (!isAllowedBrowserOrigin(request)) return jsonResponse({ error: "Origin is not allowed." }, 403, request);
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405, request);

  try {
    const form = await request.formData();
    const listingText = form.get("listing");
    const submissionId = String(form.get("submission_id") ?? "");
    if (typeof listingText !== "string" || !listingText || listingText.length > 100_000
      || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)) {
      return jsonResponse({ error: "Listing details are incomplete. Please review and submit again." }, 400, request);
    }

    const listing = JSON.parse(listingText) as ListingInput;
    const callback = new URL(env("PUBLIC_SITE_URL"));
    if (callback.protocol !== "https:") throw new Error("Payment callback must use HTTPS.");
    const consents = listing.cons;
    if (!Array.isArray(consents) || cons.length !== policyLabels.length || cons.some((value) => value !== true)) {
      return jsonResponse({ error: "All owner and listing declarations must be accepted." }, 400, request);
    }
    const supabase = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const clientIp = request.headers.get("cf-connecting-ip")
      ?? request.headers.get("x-real-ip")
      ?? request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
    if (!clientIp) return jsonResponse({ error: "This request could not be safely validated. Please try again later." }, 503, request);
    const ipDigest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(clientIp));
    const ipHash = `\\x${[...new Uint8Array(ipDigest)].map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
    const { data: limitRows, error: limitError } = await supabase.rpc("consume_rate_limit", {
      p_endpoint: "start-listing-payment",
      p_key_sha256: ipHash,
      p_max_requests: 10,
      p_window_seconds: 3600,
    });
    if (limitError) throw limitError;
    if (!limitRows?.[0]?.allowed) {
      return jsonResponse({ error: "Too many listing submissions from this connection. Please try again later." }, 429, request);
    }

    const [{ data: setting, error: settingsError }, { data: existing, error: existingError }] = await Promise.all([
      supabase.from("website_settings").select("listing_fee_pesewas, currency, privacy_policy_version, terms_version")
        .eq("id", 1).single(),
      supabase.from("listings").select("id, status, owner_id").eq("submission_id", submissionId).maybeSingle(),
    ]);
    if (settingsError) throw settingsError;
    if (existingError) throw existingError;
    const expectedFeePesewas = Number(form.get("expected_fee_pesewas"));
    if (!Number.isSafeInteger(expectedFeePesewas) || expectedFeePesewas <= 0) {
      return jsonResponse({ error: "The current listing fee is missing. Refresh the page and review the fee before paying." }, 400, request);
    }
    if (expectedFeePesewas !== Number(setting.listing_fee_pesewas)) {
      return jsonResponse({ error: "The listing fee changed. Refresh the page and review the updated fee before paying." }, 409, request);
    }
    if (existing && existing.status !== "PAYMENT_PENDING") {
      return jsonResponse({ error: "This listing has already been paid or is already being reviewed. Contact NestGH if you need help." }, 409, request);
    }

    let ownerEmail = typeof listing.email === "string" ? listing.email.trim().toLowerCase() : "";
    if (existing) {
      const { data: owner, error: ownerLookupError } = await supabase.from("owners").select("email")
        .eq("id", existing.owner_id).single();
      if (ownerLookupError) throw ownerLookupError;
      ownerEmail = owner.email;
    } else {
      const phone = typeof listing.phone === "string" ? normalizePhone(listing.phone) : "";
      const whatsapp = typeof listing.wa === "string" ? normalizePhone(listing.wa) : "";
      if (
        typeof listing.title !== "string" || listing.title.trim().length < 8 || listing.title.length > 100
        || typeof listing.town !== "string" || !listing.town.trim() || listing.town.length > 100
        || typeof listing.area !== "string" || !listing.area.trim() || listing.area.length > 100
        || typeof listing.region !== "string" || !listing.region.trim() || listing.region.length > 100
        || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail) || ownerEmail.length > 254
        || (typeof listing.name === "string" && listing.name.trim().length > 120)
        || (typeof listing.rel === "string" && listing.rel.trim().length > 250)
        || !/^\+233[235]\d{8}$/.test(phone) || !/^\+233[235]\d{8}$/.test(whatsapp)
      ) {
        return jsonResponse({ error: "Some owner or location details are invalid. Review the listing and try again." }, 400, request);
      }
    }

    let listingId = existing?.id as string | undefined;
    if (!listingId) {
      const phone = normalizePhone(String(listing.phone));
      const whatsapp = normalizePhone(String(listing.wa));
      const rentPeriodValue = rentPeriod(listing.period);
      const rentCedis = numberValue(listing.rent);
      const units = numberValue(listing.units);
      const bedrooms = numberValue(listing.beds);
      const advance = numberValue(listing.adv);
      const rentPesewas = Math.round(rentCedis * 100);
      const depositPesewas = Math.round(numberValue(listing.dep) * 100);
      const agencyFeePesewas = Math.round(numberValue(listing.fee) * 100);
      const otherChargesPesewas = Math.round(numberValue(listing.oth) * 100);
      const maxOccupants = numberValue(listing.maxOcc);
      const exactAddress = typeof listing.addr === "string" ? listing.addr.trim() : "";
      const availability = listing.avail === "Yes, available now" ? new Date().toISOString().slice(0, 10) : listing.from;
      const unitsAvailable = numberValue(listing.aunits);
      const latitude = listing.lat === undefined ? null : numberValue(listing.lat);
      const longitude = listing.lng === undefined ? null : numberValue(listing.lng);
      if (
        typeof listing.desc !== "string" || listing.desc.trim().length < 100 || listing.desc.length > 5000
        || typeof listing.type !== "string" || !roomTypes.has(listing.type)
        || typeof listing.cond !== "string" || !conditions.has(listing.cond)
        || !["Furnished", "Unfurnished"].includes(String(listing.furn))
        || !Number.isSafeInteger(units) || units < 1 || units > 500
        || !Number.isSafeInteger(bedrooms) || bedrooms < 0 || bedrooms > 100
        || !Number.isSafeInteger(advance) || advance < 0 || advance > 120
        || !Number.isSafeInteger(rentPesewas) || rentPesewas <= 0 || rentPesewas > 2_147_483_647
        || !Number.isSafeInteger(depositPesewas) || depositPesewas < 0 || depositPesewas > 2_147_483_647
        || !Number.isSafeInteger(agencyFeePesewas) || agencyFeePesewas < 0 || agencyFeePesewas > 2_147_483_647
        || !Number.isSafeInteger(otherChargesPesewas) || otherChargesPesewas < 0 || otherChargesPesewas > 2_147_483_647
        || !Number.isSafeInteger(maxOccupants) || maxOccupants < 1 || maxOccupants > 500
        || !rentPeriodValue || (rentPeriodValue === "OTHER" && (typeof listing.periodOther !== "string" || listing.periodOther.trim().length < 2))
        || exactAddress.length < 5 || exactAddress.length > 1000
        || !["Yes, available now", "No, available from a later date"].includes(String(listing.avail))
        || !validDate(availability) || !Number.isSafeInteger(unitsAvailable) || unitsAvailable < 1 || unitsAvailable > units
        || (latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90))
        || (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180))
        || ((latitude === null) !== (longitude === null))
        || !slugify(String(listing.region).trim()) || !slugify(String(listing.town).trim()) || !slugify(String(listing.area).trim())
      ) {
        return jsonResponse({ error: "Some listing details are invalid. Check the description, room details, rent, address, and availability." }, 400, request);
      }

      const photoUploads: PhotoUpload[] = [];
      let totalBytes = 0;
      for (const [key, value] of form.entries()) {
        if (!key.startsWith("photo:") && key !== "profile_photo") continue;
        if (!(value instanceof File) || !supportedTypes.has(value.type) || value.size <= 0 || value.size > 2 * 1024 * 1024) {
          return jsonResponse({ error: "Each compressed photo must be a JPG, PNG, or WebP image under 2 MB." }, 400, request);
        }
        totalBytes += value.size;
        if (totalBytes > 4_500_000) return jsonResponse({ error: "The compressed photos are too large to upload together." }, 413, request);
        const rawCategory = key === "profile_photo" ? "Profile" : key.slice("photo:".length);
        const category = requiredPhotos.includes(rawCategory) ? rawCategory : rawCategory.startsWith("Extra ") ? "Extra" : "";
        if (!category) return jsonResponse({ error: "The photo category is invalid." }, 400, request);
        const extension = value.type === "image/png" ? "png" : value.type === "image/webp" ? "webp" : "jpg";
        photoUploads.push({
          category,
          path: `${submissionId}/${crypto.randomUUID()}.${extension}`,
          display_order: photoUploads.length,
          file: value,
        });
      }
      const received = new Set(photoUploads.map((upload) => upload.category));
      if (photoUploads.length > 16 || requiredPhotos.some((category) => !received.has(category)) || !received.has("Profile")) {
        return jsonResponse({ error: "Upload all five required property photos and your profile photo." }, 400, request);
      }

      const regionId = await findOrCreateLocation(supabase, "REGION", String(listing.region).trim());
      const townId = await findOrCreateLocation(supabase, "TOWN", String(listing.town).trim(), regionId);
      const areaId = await findOrCreateLocation(supabase, "AREA", String(listing.area).trim(), townId);
      const relationship = typeof listing.rel === "string" && listing.rel.trim().length >= 2
        ? listing.rel.trim() : String(listing.role ?? "Property Owner");
      const ownerName = typeof listing.name === "string" && listing.name.trim().length >= 2
        ? listing.name.trim() : "Property contact";
      const { data: owner, error: ownerError } = await supabase.from("owners").insert({
        full_name: ownerName,
        phone_e164: phone,
        whatsapp_e164: whatsapp,
        email: ownerEmail,
        relationship,
      }).select("id").single();
      if (ownerError) throw ownerError;

      const { data: created, error: listingError } = await supabase.from("listings").insert({
        submission_id: submissionId,
        owner_id: owner.id,
        area_id: areaId,
        title: listing.title.trim(),
        description: listing.desc.trim(),
        room_type: listing.type,
        condition: listing.cond,
        furnished: listing.furn,
        units_total: units,
        bedrooms,
        rent_amount_pesewas: rentPesewas,
        rent_period: rentPeriodValue,
        rent_period_other: rentPeriodValue === "OTHER" ? String(listing.periodOther).trim() : null,
        advance_payments: advance,
        deposit_pesewas: depositPesewas,
        agency_fee_pesewas: agencyFeePesewas,
        other_charges_pesewas: otherChargesPesewas,
        facilities: { selections: listing.m ?? {}, other: listing.facOther ?? "" },
        rules: {
          eligible: listing.who ?? [],
          max_occupants: maxOccupants,
          cooking: listing.cooking,
          visitors: listing.visitors,
          pets: listing.pets,
          smoking: listing.smoking,
          curfew: listing.curfew,
          curfew_time: listing.curfewTime ?? null,
          noise: listing.noise,
          other: listing.otherRules ?? "",
        },
        availability_date: availability,
        units_available: unitsAvailable,
      }).select("id").single();
      if (listingError) throw listingError;
      listingId = created.id;

      const { error: privateError } = await supabase.from("listing_private").insert({
        listing_id: listingId,
        exact_address: exactAddress,
        directions: typeof listing.lm === "string" ? listing.lm.slice(0, 2000) : null,
        exact_latitude: Number.isFinite(latitude) ? latitude : null,
        exact_longitude: Number.isFinite(longitude) ? longitude : null,
        map_url: typeof listing.mapLink === "string" ? listing.mapLink.slice(0, 2048) : null,
      });
      if (privateError) throw privateError;

      const { data: consentSettings, error: consentSettingsError } = await supabase.from("website_settings")
        .select("privacy_policy_version, terms_version").eq("id", 1).single();
      if (consentSettingsError) throw consentSettingsError;
      const { error: consentError } = await supabase.from("consents").insert({
        listing_id: listingId,
        privacy_policy_version: consentSettings.privacy_policy_version,
        terms_version: consentSettings.terms_version,
        checkbox_values: Object.fromEntries(policyLabels.map((label, index) => [label, consents[index]])),
        consented_at: new Date().toISOString(),
      });
      if (consentError) throw consentError;

      for (const photo of photoUploads) {
        const { error: storageError } = await supabase.storage.from("listing-pending").upload(photo.path, photo.file, {
          contentType: photo.file.type,
          upsert: false,
        });
        if (storageError) throw storageError;
      }
      const { error: imagesError } = await supabase.from("listing_images").insert(photoUploads.map((photo) => ({
        listing_id: listingId,
        category: photo.category,
        storage_path: photo.path,
        display_order: photo.display_order,
      })));
      if (imagesError) throw imagesError;

      const { error: transitionError } = await supabase.rpc("transition_listing", {
        p_listing_id: listingId,
        p_new_status: "PAYMENT_PENDING",
        p_actor_type: "SYSTEM",
        p_actor_id: null,
        p_reason: null,
        p_source: "validated_submission",
      });
      if (transitionError) throw transitionError;
    }

    const { data: openPayments, error: openPaymentsError } = await supabase.from("payments")
      .select("reference, status")
      .eq("listing_id", listingId)
      .in("status", ["PENDING", "PROCESSING"]);
    if (openPaymentsError) throw openPaymentsError;
    for (const previous of openPayments ?? []) {
      const transaction = await getPaystackTransaction(previous.reference);
      if (transaction.status === "success") {
        await recordVerifiedPayment(previous.reference, transaction);
        return jsonResponse({ error: "Your earlier payment was verified. Refresh the page before trying again." }, 409, request);
      }
      if (["abandoned", "failed", "reversed"].includes(transaction.status)) {
        const { error: closeError } = await supabase.from("payments").update({ status: "FAILED" })
          .eq("reference", previous.reference);
        if (closeError) throw closeError;
      } else {
        return jsonResponse({ error: "Your earlier Paystack attempt is still processing. Wait for confirmation before starting another payment." }, 409, request);
      }
    }

    const reference = `NGH-${crypto.randomUUID().replaceAll("-", "").toUpperCase()}`;
    const amountPesewas = Number(setting.listing_fee_pesewas);
    if (!Number.isSafeInteger(amountPesewas) || amountPesewas <= 0 || amountPesewas > 2_147_483_647) {
      throw new Error("Listing fee configuration is invalid.");
    }
    const { error: paymentError } = await supabase.from("payments").insert({
      listing_id: listingId,
      reference,
      amount_pesewas: amountPesewas,
      currency: setting.currency,
      status: "PENDING",
    });
    if (paymentError) throw paymentError;

    callback.searchParams.set("payment_reference", reference);
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env("PAYSTACK_SECRET_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: ownerEmail,
        amount: amountPesewas,
        currency: setting.currency,
        reference,
        callback_url: callback.toString(),
        metadata: { listing_id: listingId },
      }),
    });
    const checkout = await paystackResponse.json();
    if (!paystackResponse.ok || checkout.status !== true || !checkout.data?.authorization_url) {
      await supabase.from("payments").update({ status: "FAILED" }).eq("reference", reference);
      throw new Error("Paystack could not start checkout. Your submission is saved and you can retry.");
    }
    return jsonResponse({ authorization_url: checkout.data.authorization_url, reference }, 200, request);
  } catch (error) {
    console.error("start-listing-payment failed:", error);
    const message = error instanceof Error && error.message.startsWith("Paystack could not start checkout")
      ? error.message : "Unable to submit this listing right now. Please try again later.";
    return jsonResponse({ error: message }, 500, request);
  }
});
