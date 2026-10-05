import sharp from "sharp";
import { resolve } from "node:path";

const root = process.cwd();
const jobs = [
  ["hero.jpg", "hero.webp", { width: 800 }, { quality: 55 }],
  ["hero.jpg", "hero-480.webp", { width: 480 }, { quality: 60 }],
  ["logo.png", "logo-80.webp", { width: 80 }, { quality: 85 }],
];
for (const [src, out, size, opts] of jobs) {
  await sharp(resolve(root, src)).resize(size).webp(opts).toFile(resolve(root, out));
}
await sharp(resolve(root, "logo.png")).resize(192).png({ compressionLevel: 9, palette: true }).toFile(resolve(root, "logo-192.png"));

