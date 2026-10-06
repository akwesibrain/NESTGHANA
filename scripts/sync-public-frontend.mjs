import { mkdir, copyFile, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { transform } from "esbuild";

const root = process.cwd();
const publicDir = resolve(root, "public");
const minified = [
  ["app.js", "js"],
  ["commercial-listings.js", "js"],
  ["font-loader.js", "js"],
  ["styles.css", "css"],
];
const assets = [
  ["index.html", "index.html"],
  ["hero.jpg", "hero.jpg"],
  ["hero.webp", "hero.webp"],
  ["hero-480.webp", "hero-480.webp"],
  ["logo.png", "logo.png"],
  ["logo-80.webp", "logo-80.webp"],
  ["logo-192.png", "logo-192.png"],
  ["listing-pricing.js", "listing-pricing.js"],
  ["data/ghana-locations.json", "ghana-locations.json"],
];

await mkdir(publicDir, { recursive: true });
await Promise.all(assets.map(([source, destination]) =>
  copyFile(resolve(root, source), resolve(publicDir, destination))));

await Promise.all(minified.map(async ([name, loader]) => {
  const source = await readFile(resolve(root, name), "utf8");
  const { code } = await transform(source, { loader, minify: true, target: "es2020", legalComments: "none" });
  await writeFile(resolve(publicDir, name), code);
}));

const locationCatalog = JSON.parse(
  await readFile(resolve(root, "data/ghana-locations.json"), "utf8"),
);
await writeFile(
  resolve(publicDir, "ghana-locations.js"),
  `window.NESTGH_LOCATION_CATALOG=${JSON.stringify(locationCatalog)};\n`,
);
