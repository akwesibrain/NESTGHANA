import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

// Private on-disk storage for listing photos (replaces the Supabase "listing-pending" bucket).
// Files live outside public/ and are only served through /api/images (approved photos of LIVE
// listings) or /api/admin/images (signed-in admins).

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export type ImageKind = { mime: "image/jpeg" | "image/png" | "image/webp"; ext: "jpg" | "png" | "webp" };

function storageRoot(): string {
  return path.resolve(process.env.IMAGE_STORAGE_DIR || path.join(process.cwd(), "storage", "listing-images"));
}

/** Identifies an image by its magic bytes; the browser-supplied MIME type is never trusted. */
export function detectImageKind(bytes: Uint8Array): ImageKind | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (bytes.length >= 8 && Buffer.from(bytes.subarray(0, 8)).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { mime: "image/png", ext: "png" };
  }
  if (bytes.length >= 12 && Buffer.from(bytes.subarray(0, 4)).toString("ascii") === "RIFF" && Buffer.from(bytes.subarray(8, 12)).toString("ascii") === "WEBP") {
    return { mime: "image/webp", ext: "webp" };
  }
  return null;
}

/** Resolves a stored key to an absolute path, refusing anything that escapes the storage root. */
function resolveKey(key: string): string {
  if (!/^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(key)) throw new Error("Invalid storage key.");
  const root = storageRoot();
  const full = path.resolve(root, key);
  if (!full.startsWith(root + path.sep)) throw new Error("Invalid storage key.");
  return full;
}

/** Saves an image under "<submissionId>/<random>.<ext>" and returns the storage key. */
export async function saveImage(submissionId: string, bytes: Uint8Array, kind: ImageKind): Promise<string> {
  const key = `${submissionId}/${randomUUID()}.${kind.ext}`;
  const full = resolveKey(key);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, bytes, { flag: "wx" });
  return key;
}

export async function readImage(key: string): Promise<Buffer> {
  return readFile(resolveKey(key));
}

export async function deleteImages(keys: string[]) {
  await Promise.all(keys.map(key => rm(resolveKey(key), { force: true }).catch(() => undefined)));
}

export function mimeForKey(key: string): string {
  return key.endsWith(".png") ? "image/png" : key.endsWith(".webp") ? "image/webp" : "image/jpeg";
}
