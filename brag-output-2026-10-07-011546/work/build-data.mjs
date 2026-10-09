// Bundles the captured element rectangles into comp/data.js (file:// pages cannot fetch JSON).
import { readdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
const out = {};
for (const mode of ["desktop", "mobile"]) {
  out[mode] = {};
  for (const f of readdirSync(`shots-${mode}`).filter(f => f.endsWith(".json"))) out[mode][f.replace(".json", "")] = JSON.parse(readFileSync(`shots-${mode}/${f}`, "utf8"));
}
writeFileSync("comp/data.js", `window.SHOTS = ${JSON.stringify(out)};\n`);
copyFileSync("../../public/logo.png", "comp/logo.png");
console.log("ok", Object.keys(out.desktop).length, Object.keys(out.mobile).length);
