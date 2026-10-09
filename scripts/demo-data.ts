// Demo data for local testing.
//
//   npm run demo:add      creates demo listings (LIVE rooms and shops, some awaiting review/payment)
//   npm run demo:remove   deletes every demo listing, owner, payment, photo and audit row
//
// Everything demo is tied to owners with an @demo.nestgh.test email (a reserved, never-real domain)
// and titles starting with "Demo". Listings are created through the real submission, payment and
// review code paths, so they behave exactly like real ones. Phone numbers are placeholders.
import "dotenv/config";
import { randomBytes, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
import mariadb from "mariadb";

const DEMO_DOMAIN = "@demo.nestgh.test";
const REVIEWER_EMAIL = `reviewer${DEMO_DOMAIN}`;

// ───────── Placeholder photos (solid-colour PNGs; exterior uses the site hero image) ─────────

function crc32(bytes: Buffer): number {
  let crc = ~0;
  for (const byte of bytes) {
    crc ^= byte;
    for (let k = 0; k < 8; k++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return ~crc >>> 0;
}

function png(width: number, height: number, [r, g, b]: [number, number, number]): Uint8Array {
  const chunk = (type: string, data: Buffer) => {
    const head = Buffer.alloc(8);
    head.writeUInt32BE(data.length, 0);
    head.write(type, 4, "ascii");
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
    return Buffer.concat([head, data, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.set([8, 2, 0, 0, 0], 8);
  const rows = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    const shade = 1 - (y / height) * 0.25; // gentle vertical gradient
    for (let x = 0; x < width; x++) {
      const at = y * (width * 3 + 1) + 1 + x * 3;
      rows[at] = Math.round(r * shade);
      rows[at + 1] = Math.round(g * shade);
      rows[at + 2] = Math.round(b * shade);
    }
  }
  return new Uint8Array(Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(rows)),
    chunk("IEND", Buffer.alloc(0)),
  ]));
}

const HERO = new Uint8Array(readFileSync("public/hero.jpg"));
const COLOURS: Record<string, [number, number, number]> = {
  Bedroom: [214, 196, 168], Bathroom: [176, 206, 214], Kitchen: [222, 206, 170], "Compound or common area": [186, 206, 172],
  Interior: [210, 200, 186], Frontage: [196, 180, 160], Facilities: [184, 196, 214], "Surrounding area": [178, 200, 170],
  profile: [150, 120, 70],
};
function photos(commercial: boolean) {
  const names = commercial
    ? ["Interior", "Frontage", "Facilities", "Surrounding area"]
    : ["Bedroom", "Bathroom", "Kitchen", "Compound or common area"];
  return [
    { field: "photo:Exterior", bytes: HERO },
    ...names.map(name => ({ field: `photo:${name}`, bytes: png(640, 420, COLOURS[name]) })),
    { field: "profile_photo", bytes: png(200, 200, COLOURS.profile) },
  ];
}

// ───────── Demo listings ─────────

type Outcome = "LIVE" | "PENDING_APPROVAL" | "PAYMENT_PENDING";
const consents = [true, true, true, true, true, true];
let ownerNo = 0;
const owner = (name: string, rel = "Property Owner") => {
  ownerNo++;
  const phone = `05000000${String(ownerNo).padStart(2, "0")}`; // placeholder, not a real line
  return { name, rel, phone, wa: phone, email: `owner${ownerNo}${DEMO_DOMAIN}`, cons: consents };
};
const room = (o: Record<string, unknown>) => ({
  category: "rooms", cond: "Good Condition", furn: "Unfurnished", units: "2", aunits: "1", beds: "1",
  period: "Monthly", adv: "6", dep: "0", fee: "0", oth: "0", maxOcc: "2", avail: "Yes, available now",
  m: { Water: "Included", Electricity: "Separate Charge", Security: "Shared" }, who: ["Students", "Workers"],
  cooking: "Allowed", visitors: "Allowed until 9 pm", pets: "No", smoking: "No", noise: "Quiet after 10 pm",
  ...o,
});
const space = (o: Record<string, unknown>) => ({
  category: "commercial", cond: "Good Condition", units: "1", aunits: "1", dep: "0", fee: "0", oth: "0",
  avail: "Yes, available now", roadVisibility: "Yes", parking: "Yes", electricity: "Yes", water: "Yes",
  ...o,
});
const describe = (text: string) =>
  `${text} This is demo data for testing NestGH; the owner, phone number and address are not real.`;

const LISTINGS: { outcome: Outcome; form: Record<string, unknown> }[] = [
  { outcome: "LIVE", form: room({ ...owner("Ama Mensah"), title: "Demo: Bright single room in Madina", type: "Single Room", rent: "650",
    desc: describe("Bright single room with tiled floors and good ventilation, five minutes from Madina market and the main trotro station."),
    region: "Greater Accra", town: "Accra", area: "Madina", addr: "Demo address 1, Madina", lm: "Madina Zongo junction" }) },
  { outcome: "LIVE", form: room({ ...owner("Kwame Boateng"), title: "Demo: Chamber and hall at Community 20", type: "Chamber & Hall", rent: "1400",
    beds: "1", adv: "12", fee: "200", furn: "Furnished", m: { Water: "Included", Electricity: "Included", "Wi-Fi": "Separate Charge", Kitchen: "Private" },
    desc: describe("Spacious chamber and hall with a private kitchen and bathroom in a quiet gated compound near Community 20 market."),
    region: "Greater Accra", town: "Tema", area: "Community 20", addr: "Demo address 2, Community 20", lm: "Community 20 market" }) },
  { outcome: "LIVE", form: room({ ...owner("Akosua Owusu", "Caretaker"), title: "Demo: Self-contained near KNUST", type: "Self-Contained", rent: "1100",
    desc: describe("Self-contained room with a private bathroom and kitchenette, a short walk to the KNUST campus gate."),
    region: "Ashanti", town: "Kumasi", area: "Ayeduase", addr: "Demo address 3, Ayeduase", lm: "Ayeduase gate", who: ["Students"] }) },
  { outcome: "LIVE", form: room({ ...owner("Kofi Asare", "Hostel Manager"), title: "Demo: Student hostel rooms in Bomso", type: "Student Hostel", rent: "3600",
    period: "Semester", adv: "1", units: "40", aunits: "12", beds: "2", maxOcc: "2", who: ["Students"],
    desc: describe("Student hostel with 2-in-a-room units, study area, reliable water and 24-hour security, close to KNUST."),
    region: "Ashanti", town: "Kumasi", area: "Bomso", addr: "Demo address 4, Bomso", lm: "Bomso clinic" }) },
  { outcome: "LIVE", form: room({ ...owner("Abena Osei"), title: "Demo: 2-in-a-room at Community 18", type: "2-in-a-Room", rent: "500",
    avail: "No, available from a later date", from: "2026-11-15", maxOcc: "2",
    desc: describe("Shared 2-in-a-room for workers or students, with a shared kitchen and bathroom in a family compound."),
    region: "Greater Accra", town: "Tema", area: "Community 18", addr: "Demo address 5, Community 18", lm: "Community 18 police station" }) },
  { outcome: "LIVE", form: space({ ...owner("Yaw Darko"), title: "Demo: Roadside shop in Kwabenya", type: "Shop", rent: "1500", size: "24",
    advanceAmount: "9000", water: "No",
    desc: describe("Ground-floor roadside shop with good visibility on the main Kwabenya road, suitable for retail or a provision store."),
    region: "Greater Accra", town: "Accra", area: "Kwabenya", addr: "Demo address 6, Kwabenya", lm: "Kwabenya junction" }) },
  { outcome: "LIVE", form: space({ ...owner("Efua Addo"), title: "Demo: Office space at Community 25", type: "Office", rent: "3200", size: "60",
    advanceAmount: "19200", fee: "500",
    desc: describe("Air-conditioned office space on the first floor with parking, prepaid electricity and a shared washroom."),
    region: "Greater Accra", town: "Tema", area: "Community 25", addr: "Demo address 7, Community 25", lm: "Community 25 mall" }) },
  { outcome: "LIVE", form: space({ ...owner("Nana Agyeman"), title: "Demo: Warehouse in Ashaiman", type: "Warehouse", rent: "6500", size: "350",
    advanceAmount: "39000", roadVisibility: "No",
    desc: describe("Secure warehouse with high ceilings, truck access and three-phase electricity, close to the Ashaiman motorway roundabout."),
    region: "Greater Accra", town: "Tema", area: "Ashaiman", addr: "Demo address 8, Ashaiman", lm: "Ashaiman roundabout" }) },
  { outcome: "PENDING_APPROVAL", form: room({ ...owner("Esi Quaye"), title: "Demo: Single room at Sakumono (awaiting review)", type: "Single Room", rent: "700",
    desc: describe("Neat single room in a new building near Sakumono beach road, with a shared kitchen and a private balcony."),
    region: "Greater Accra", town: "Tema", area: "Sakumono", addr: "Demo address 9, Sakumono", lm: "Sakumono beach road" }) },
  { outcome: "PENDING_APPROVAL", form: space({ ...owner("Kojo Mensah"), title: "Demo: Salon space in Madina (awaiting review)", type: "Salon", rent: "1200", size: "18",
    advanceAmount: "7200", parking: "No",
    desc: describe("Fitted salon space with water connection, mirrors and sinks already installed, on a busy street in Madina."),
    region: "Greater Accra", town: "Accra", area: "Madina", addr: "Demo address 10, Madina", lm: "Madina estate" }) },
  { outcome: "PAYMENT_PENDING", form: room({ ...owner("Adwoa Badu"), title: "Demo: Room in Adjei Kojo (payment not made)", type: "Single Room", rent: "550",
    desc: describe("Single room in a quiet compound at Adjei Kojo. The owner submitted it but has not paid the listing fee yet."),
    region: "Greater Accra", town: "Tema", area: "Adjei Kojo", addr: "Demo address 11, Adjei Kojo", lm: "Adjei Kojo market" }) },
];

async function add() {
  const { getDb } = await import("@/lib/server/db");
  const { createSubmission } = await import("@/lib/server/listing-submission");
  const { finalizePayment } = await import("@/lib/server/payments");
  const { feeFor, getListingFees, listingFeeType } = await import("@/lib/server/listing-fees");
  const { transitionListing } = await import("@/lib/server/listing-status");
  const db = getDb();

  if (await db.owner.count({ where: { email: { endsWith: DEMO_DOMAIN } } })) {
    console.log("Demo data already exists. Run `npm run demo:remove` first to recreate it.");
    return;
  }

  // A reviewer account that approves the demo listings, then is deactivated (it can never sign in).
  const reviewer = await db.adminUser.create({
    data: { email: REVIEWER_EMAIL, displayName: "Demo reviewer", passwordHash: `disabled$${randomBytes(16).toString("hex")}`, roles: { create: { role: "MODERATOR" } } },
  });

  const fees = await getListingFees();
  const created: { title: string; outcome: Outcome; id: string }[] = [];
  for (const { outcome, form } of LISTINGS) {
    const { listingId } = await createSubmission(randomUUID(), form, photos(form.category === "commercial"));
    if (outcome !== "PAYMENT_PENDING") {
      const listing = await db.listing.findUniqueOrThrow({ where: { id: listingId }, select: { propertyCategory: true, roomType: true } });
      const type = listingFeeType(listing.propertyCategory, listing.roomType);
      const amount = feeFor(fees, type);
      const reference = `NGH-${randomUUID().replaceAll("-", "").toUpperCase()}`;
      await db.payment.create({ data: { listingId, listingType: type, reference, amountPesewas: amount, currency: "GHS", status: "PENDING" } });
      // Same code path as a Paystack-verified payment (demo transaction, no money involved).
      await finalizePayment(reference, { id: Number(`9${Date.now() % 1e8}${created.length}`), status: "success", reference, amount, currency: "GHS" }, "demo.payment");
    }
    if (outcome === "LIVE") {
      await transitionListing({ listingId, to: "LIVE", actorType: "ADMIN", actorId: reviewer.id, source: "demo_data" });
      await db.listingImage.updateMany({ where: { listingId, category: { not: "PROFILE" } }, data: { approvedForPublic: true } });
    }
    created.push({ title: String(form.title), outcome, id: listingId });
  }

  const reported = created.find(listing => listing.outcome === "LIVE")!;
  await db.report.create({ data: { listingId: reported.id, reason: "Demo report: the owner says the room is already taken." } });
  await db.adminUser.update({ where: { id: reviewer.id }, data: { isActive: false } });
  await db.$disconnect();

  console.log(`Created ${created.length} demo listings:`);
  for (const listing of created) console.log(`  ${listing.outcome.padEnd(16)} ${listing.title}`);
  console.log("Remove them any time with: npm run demo:remove");
}

// ───────── Removal ─────────

// Audit tables are append-only (triggers). Removing demo rows needs the privileged CLI user to lift
// those triggers briefly, so this runs as DATABASE_URL and restores them in `finally`.
const TRIGGERS: [name: string, table: string, op: string][] = [
  ["listing_status_history_no_delete", "listing_status_history", "DELETE"],
  ["payment_events_no_delete", "payment_events", "DELETE"],
  ["admin_activity_logs_no_delete", "admin_activity_logs", "DELETE"],
];

async function remove() {
  const url = new URL(process.env.DATABASE_URL!);
  const conn = await mariadb.createConnection({
    host: url.hostname, port: Number(url.port || 3306), user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password), database: url.pathname.slice(1),
  });
  try {
    const listings: { id: string }[] = await conn.query(
      "SELECT l.id FROM listings l JOIN owners o ON o.id = l.owner_id WHERE o.email LIKE ?", [`%${DEMO_DOMAIN}`]);
    const ids = listings.map(row => row.id);
    const [reviewer]: { id: string }[] = await conn.query("SELECT id FROM admin_users WHERE email = ?", [REVIEWER_EMAIL]);
    if (!ids.length && !reviewer) {
      console.log("No demo data found.");
      return;
    }

    const images: { storage_path: string }[] = ids.length
      ? await conn.query("SELECT storage_path FROM listing_images WHERE listing_id IN (?)", [ids]) : [];

    for (const [name] of TRIGGERS) await conn.query(`DROP TRIGGER IF EXISTS \`${name}\``);
    try {
      await conn.beginTransaction();
      if (ids.length) {
        await conn.query("DELETE FROM payment_events WHERE payment_reference IN (SELECT reference FROM payments WHERE listing_id IN (?))", [ids]);
        await conn.query("DELETE FROM payments WHERE listing_id IN (?)", [ids]);
        await conn.query("DELETE FROM reports WHERE listing_id IN (?)", [ids]);
        await conn.query("DELETE FROM notifications WHERE listing_id IN (?)", [ids]);
        await conn.query("DELETE FROM listing_status_history WHERE listing_id IN (?)", [ids]);
        await conn.query("DELETE FROM admin_activity_logs WHERE resource_type = 'LISTING' AND resource_id IN (?)", [ids]);
        await conn.query("DELETE FROM listings WHERE id IN (?)", [ids]); // images, private, consents… cascade
      }
      await conn.query("DELETE FROM owners WHERE email LIKE ?", [`%${DEMO_DOMAIN}`]);
      if (reviewer) {
        await conn.query("DELETE FROM security_events WHERE actor_id = ?", [reviewer.id]);
        await conn.query("DELETE FROM admin_users WHERE id = ?", [reviewer.id]);
      }
      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      for (const [name, table, op] of TRIGGERS) {
        await conn.query(`CREATE TRIGGER \`${name}\` BEFORE ${op} ON \`${table}\` FOR EACH ROW SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Audit history is append-only'`);
      }
    }

    const { deleteImages } = await import("@/lib/server/image-storage");
    await deleteImages(images.map(image => image.storage_path));
    console.log(`Removed ${ids.length} demo listings, their owners, payments, photos and audit rows.`);
  } finally {
    await conn.end();
  }
}

const command = process.argv[2];
(command === "remove" ? remove() : command === "add" ? add() : Promise.reject(new Error("Use: add | remove")))
  .catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });

