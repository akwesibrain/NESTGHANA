import { mkdir, copyFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const publicDir = resolve(root, "public");
const assets = [
  ["index.html", "index.html"],
  ["app.js", "app.js"],
  ["styles.css", "styles.css"],
  ["supabase-config.js", "supabase-config.js"],
  ["hero.jpg", "hero.jpg"],
  ["data/ghana-locations.json", "ghana-locations.json"],
  ["node_modules/@supabase/supabase-js/dist/umd/supabase.js", "supabase.js"],
  ["node_modules/@supabase/supabase-js/LICENSE", "supabase.LICENSE.txt"],
];

await mkdir(publicDir, { recursive: true });
await Promise.all(assets.map(([source, destination]) =>
  copyFile(resolve(root, source), resolve(publicDir, destination))));
