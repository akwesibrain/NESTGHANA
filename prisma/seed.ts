// Seeds reference data only (no demo listings): Ghana regions/towns from data/ghana-locations.json
// (GeoNames, CC BY 4.0), the curated areas and neighbour estimates the public site already uses,
// and the website settings row. Safe to re-run: existing rows are skipped.
import "dotenv/config";
import { readFileSync } from "node:fs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

type Catalog = {
  regions: { name: string; towns: string[] }[];
  supplemental_locations: { name: string; region: string }[];
};

// Areas within towns, with neighbour distances in km (mirrors NB in app.js).
const AREAS: Record<string, { region: string; areas: string[] }> = {
  Tema: { region: "Greater Accra", areas: ["Community 18", "Community 20", "Community 25", "Adjei Kojo", "Ashaiman", "Sakumono"] },
  Accra: { region: "Greater Accra", areas: ["Madina", "Kwabenya"] },
  Kumasi: { region: "Ashanti", areas: ["Ayeduase", "Bomso"] },
};
const NEIGHBORS: [town: string, area: string, neighborArea: string, km: number][] = [
  ["Tema", "Community 20", "Community 18", 2], ["Tema", "Community 20", "Community 25", 3],
  ["Tema", "Community 20", "Adjei Kojo", 4], ["Tema", "Community 20", "Sakumono", 5],
  ["Tema", "Community 20", "Ashaiman", 6], ["Tema", "Community 18", "Community 20", 2],
  ["Tema", "Community 18", "Community 25", 4], ["Tema", "Community 18", "Ashaiman", 5],
  ["Tema", "Community 25", "Community 20", 3], ["Tema", "Community 25", "Sakumono", 4],
  ["Tema", "Community 25", "Adjei Kojo", 5], ["Tema", "Adjei Kojo", "Community 20", 4],
  ["Tema", "Adjei Kojo", "Ashaiman", 5], ["Tema", "Adjei Kojo", "Community 25", 5],
  ["Tema", "Ashaiman", "Adjei Kojo", 5], ["Tema", "Ashaiman", "Community 20", 6],
  ["Tema", "Ashaiman", "Sakumono", 6], ["Tema", "Sakumono", "Community 25", 4],
  ["Tema", "Sakumono", "Community 20", 5], ["Tema", "Sakumono", "Ashaiman", 6],
  ["Accra", "Madina", "Kwabenya", 5], ["Accra", "Kwabenya", "Madina", 5],
  ["Kumasi", "Ayeduase", "Bomso", 3], ["Kumasi", "Bomso", "Ayeduase", 3],
];

function slugify(name: string): string {
  const slug = name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "place";
}

/** Assigns unique slugs within one parent (e.g. "ada", "ada-2"). */
function uniqueSlugger() {
  const used = new Set<string>();
  return (name: string) => {
    const base = slugify(name).slice(0, 100);
    let slug = base;
    for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
    used.add(slug);
    return slug;
  };
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set.");
  const prisma = new PrismaClient({ adapter: new PrismaMariaDb(url) });
  const catalog: Catalog = JSON.parse(readFileSync("data/ghana-locations.json", "utf8"));

  try {
    // Regions
    const regionSlug = uniqueSlugger();
    await prisma.location.createMany({
      data: catalog.regions.map(region => {
        const slug = regionSlug(region.name);
        return { kind: "REGION" as const, name: region.name, slug, path: slug };
      }),
      skipDuplicates: true,
    });
    const regions = new Map(
      (await prisma.location.findMany({ where: { kind: "REGION" } })).map(region => [region.name, region]),
    );

    // Towns (catalogue + supplemental + any town that the curated areas need)
    const townsByRegion = new Map<string, Set<string>>();
    const addTown = (regionName: string, town: string) => {
      if (!regions.has(regionName)) throw new Error(`Unknown region: ${regionName}`);
      const towns = townsByRegion.get(regionName) ?? new Set<string>();
      towns.add(town.trim());
      townsByRegion.set(regionName, towns);
    };
    for (const region of catalog.regions) for (const town of region.towns) addTown(region.name, town);
    for (const place of catalog.supplemental_locations) addTown(place.region, place.name);
    for (const [town, { region }] of Object.entries(AREAS)) addTown(region, town);

    let townCount = 0;
    for (const [regionName, towns] of townsByRegion) {
      const region = regions.get(regionName)!;
      const townSlug = uniqueSlugger();
      const rows = [...towns].sort().map(name => {
        const slug = townSlug(name);
        return { kind: "TOWN" as const, parentId: region.id, name, slug, path: `${region.path}/${slug}` };
      });
      for (let i = 0; i < rows.length; i += 1000) {
        const result = await prisma.location.createMany({ data: rows.slice(i, i + 1000), skipDuplicates: true });
        townCount += result.count;
      }
    }

    // Areas
    let areaCount = 0;
    const areaIds = new Map<string, string>();
    for (const [townName, { region: regionName, areas }] of Object.entries(AREAS)) {
      const town = await prisma.location.findFirstOrThrow({
        where: { kind: "TOWN", name: townName, parentId: regions.get(regionName)!.id },
      });
      const areaSlug = uniqueSlugger();
      const result = await prisma.location.createMany({
        data: areas.map(name => {
          const slug = areaSlug(name);
          return { kind: "AREA" as const, parentId: town.id, name, slug, path: `${town.path}/${slug}` };
        }),
        skipDuplicates: true,
      });
      areaCount += result.count;
      for (const area of await prisma.location.findMany({ where: { kind: "AREA", parentId: town.id } })) {
        areaIds.set(`${townName}|${area.name}`, area.id);
      }
    }

    const neighbors = await prisma.locationNeighbor.createMany({
      data: NEIGHBORS.map(([town, area, neighbor, km]) => ({
        locationId: areaIds.get(`${town}|${area}`)!,
        neighborId: areaIds.get(`${town}|${neighbor}`)!,
        estimatedKm: km,
      })),
      skipDuplicates: true,
    });

    // The settings row is created by the migration; this keeps a fresh/reset database consistent.
    await prisma.websiteSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, currency: "GHS", confirmationDays: 30, privacyPolicyVersion: "2026-10-01", termsVersion: "2026-10-01" },
    });

    console.log(
      `Seeded ${regions.size} regions, ${townCount} new towns, ${areaCount} new areas, ${neighbors.count} new neighbour links.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
