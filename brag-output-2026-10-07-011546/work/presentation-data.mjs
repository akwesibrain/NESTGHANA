// Presentation-only listings for the launch video. Served to the real NestGH page inside the
// capture browser (request interception); nothing is written to the database.
const now = new Date().toISOString();
const phone = n => `+23350000000${n}`; // placeholders, never shown on screen

const room = (n, d) => ({
  id: `video-room-${n}`,
  status: d.taken ? "unavailable" : "available",
  category: "ROOM",
  created_at: now,
  public_data: {
    category: "room",
    period: "Monthly",
    adv: 6,
    dep: 0,
    fee: 0,
    oth: 0,
    verified: false,
    confirmed_at: now,
    avail: "Yes, available now",
    photos: [],
    phone: phone(n),
    wa: phone(n),
    role: "Property Owner",
    ...d,
  },
});

export const ROOMS = [
  room(1, { title: "Student hostel room near KNUST", type: "Student Hostel", rent: 4200, period: "Semester", adv: 1,
    region: "Ashanti", town: "Kumasi", area: "Ayeduase", lm: "Ayeduase gate",
    description: "2-in-a-room with a study desk, reliable water and 24-hour security, a short walk to the KNUST campus.",
    m: { Water: "Included", Security: "Included", "Wi-Fi": "Shared" }, verified: true }),
  room(2, { title: "Single room with shared kitchen", type: "Single Room", rent: 650, adv: 12,
    region: "Ashanti", town: "Kumasi", area: "Bomso", lm: "Bomso clinic",
    description: "Tiled single room in a quiet family compound, close to transport and the market.",
    m: { Water: "Included", Kitchen: "Shared", Security: "Shared" } }),
  room(3, { title: "Self-contained near Ahodwo roundabout", type: "Self-Contained", rent: 1600,
    region: "Ashanti", town: "Kumasi", area: "Ahodwo", lm: "Ahodwo roundabout",
    description: "Self-contained unit with its own bathroom and kitchenette, prepaid electricity and parking.",
    m: { Water: "Included", Kitchen: "Private", Bathroom: "Private", Parking: "Included" }, verified: true }),
  room(4, { title: "Chamber and hall in East Legon", type: "Chamber & Hall", rent: 2800,
    region: "Greater Accra", town: "Accra", area: "East Legon", lm: "A&C Mall",
    description: "Spacious chamber and hall with a private kitchen and bathroom in a gated compound.",
    m: { Water: "Included", Kitchen: "Private", Security: "Included" }, verified: true }),
  room(5, { title: "Bright single room in Madina", type: "Single Room", rent: 800,
    region: "Greater Accra", town: "Accra", area: "Madina", lm: "Madina Zongo junction",
    description: "Single room with good ventilation, five minutes from Madina market.",
    m: { Water: "Included", Security: "Shared" } }),
  room(6, { title: "Self-contained at Community 25", type: "Self-Contained", rent: 1800,
    region: "Greater Accra", town: "Tema", area: "Community 25", lm: "Community 25 mall",
    description: "Newly renovated self-contained apartment with a private kitchen in a secure estate.",
    m: { Water: "Included", Kitchen: "Private", Security: "Included" } }),
  room(7, { title: "UCC student hostel, Amamoma", type: "Student Hostel", rent: 3600, period: "Semester", adv: 1,
    region: "Central", town: "Cape Coast", area: "Amamoma", lm: "UCC main gate",
    description: "Hostel rooms for UCC students with a study room, water and security.",
    m: { Water: "Included", Security: "Included" } }),
  room(8, { title: "Chamber and hall in Anaji", type: "Chamber & Hall", rent: 1700,
    region: "Western", town: "Takoradi", area: "Anaji", lm: "Anaji junction",
    description: "Chamber and hall with a porch, private kitchen and prepaid meter.",
    m: { Water: "Included", Kitchen: "Private" } }),
];

const space = (n, d) => ({
  id: `video-space-${n}`,
  status: "available",
  category: "COMMERCIAL",
  created_at: now,
  public_data: {
    category: "commercial",
    sizeUnit: "m²",
    images: [],
    availability: now.slice(0, 10),
    phone: phone(n),
    whatsapp: phone(n),
    location: `${d.town}, ${d.area}`,
    ...d,
  },
});

export const SPACES = [
  space(1, { title: "Roadside shop at Community 1", type: "Shop", region: "Greater Accra", town: "Tema", area: "Community 1",
    rent: 1500, advance: 9000, size: 24, roadVisibility: true, parking: true, electricity: true, water: true, estimatedMoveInCost: 9000,
    description: "Ground-floor shop on a busy road, ideal for retail or a provision store." }),
  space(2, { title: "Shop space near Market Circle", type: "Shop", region: "Western", town: "Takoradi", area: "Market Circle",
    rent: 2000, advance: 12000, size: 30, roadVisibility: true, parking: false, electricity: true, water: true, estimatedMoveInCost: 12000,
    description: "Lockable shop with good foot traffic beside Market Circle." }),
  space(3, { title: "Office space in Osu", type: "Office", region: "Greater Accra", town: "Accra", area: "Osu",
    rent: 6500, advance: 39000, size: 80, roadVisibility: true, parking: true, electricity: true, water: true, estimatedMoveInCost: 39000,
    description: "First-floor office with parking, air conditioning points and a shared washroom." }),
  space(4, { title: "Commercial space in Adum", type: "Commercial Space", region: "Ashanti", town: "Kumasi", area: "Adum",
    rent: 3000, advance: 18000, size: 45, roadVisibility: true, parking: false, electricity: true, water: true, estimatedMoveInCost: 18000,
    description: "Open-plan commercial space in central Adum, suitable for a showroom or salon." }),
];

export const SETTINGS = {
  currency: "GHS",
  listing_fees_pesewas: { room: 3000, hostel: 3500, space: 4000 },
  payments_enabled: false,
  turnstile_site_key: null,
  privacy_policy_version: "2026-10-01",
  terms_version: "2026-10-01",
};
