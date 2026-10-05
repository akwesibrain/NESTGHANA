import { mkdir, copyFile, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const publicDir = resolve(root, "public");
const assets = [
  ["index.html", "index.html"],
  ["app.js", "app.js"],
  ["commercial-listings.js", "commercial-listings.js"],
  ["font-loader.js", "font-loader.js"],
  ["styles.css", "styles.css"],
  ["supabase-config.js", "supabase-config.js"],
  ["hero.jpg", "hero.jpg"],
  ["logo.png", "logo.png"],
  ["data/ghana-locations.json", "ghana-locations.json"],
  ["node_modules/@supabase/supabase-js/dist/umd/supabase.js", "supabase.js"],
  ["node_modules/@supabase/supabase-js/LICENSE", "supabase.LICENSE.txt"],
];

await mkdir(publicDir, { recursive: true });
await Promise.all(assets.map(([source, destination]) =>
  copyFile(resolve(root, source), resolve(publicDir, destination))));

const locationCatalog = JSON.parse(
  await readFile(resolve(root, "data/ghana-locations.json"), "utf8"),
);
await writeFile(
  resolve(publicDir, "ghana-locations.js"),
  `window.NESTGH_LOCATION_CATALOG=${JSON.stringify(locationCatalog)};\n`,
);
