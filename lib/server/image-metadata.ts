// Removes embedded metadata (EXIF incl. GPS location, XMP, IPTC, comments, text chunks) from
// JPEG, PNG and WebP files without re-encoding the pixels. Listing photos can carry the exact
// coordinates of the property in EXIF; the exact address must stay private.
// Throws on a structurally invalid file so it is rejected instead of stored as-is.

export class ImageMetadataError extends Error {}

/** JPEG: keep APP0 (JFIF), APP2 (ICC colour profile) and APP14 (Adobe colour transform); drop other APPn and comments. */
function stripJpeg(b: Uint8Array): Uint8Array {
  if (b[0] !== 0xff || b[1] !== 0xd8) throw new ImageMetadataError("Not a JPEG.");
  const parts: Uint8Array[] = [b.subarray(0, 2)];
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) throw new ImageMetadataError("Malformed JPEG.");
    const marker = b[i + 1];
    if (marker === 0xff) { i++; continue; } // fill byte
    if (marker === 0xda) { parts.push(b.subarray(i)); return concat(parts); } // start of scan: copy the rest
    if (marker === 0xd9) { parts.push(b.subarray(i, i + 2)); return concat(parts); }
    if ((marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) { parts.push(b.subarray(i, i + 2)); i += 2; continue; }
    if (i + 4 > b.length) throw new ImageMetadataError("Truncated JPEG.");
    const end = i + 2 + ((b[i + 2] << 8) | b[i + 3]);
    if (end > b.length) throw new ImageMetadataError("Truncated JPEG.");
    const isMetadata = (marker >= 0xe1 && marker <= 0xef && marker !== 0xe2 && marker !== 0xee) || marker === 0xfe;
    if (!isMetadata) parts.push(b.subarray(i, end));
    i = end;
  }
  throw new ImageMetadataError("JPEG has no image data.");
}

const PNG_DROP = new Set(["eXIf", "tEXt", "zTXt", "iTXt", "tIME"]);

function stripPng(b: Uint8Array): Uint8Array {
  const parts: Uint8Array[] = [b.subarray(0, 8)];
  const view = new DataView(b.buffer, b.byteOffset, b.byteLength);
  let i = 8;
  while (i < b.length) {
    if (i + 12 > b.length) throw new ImageMetadataError("Truncated PNG.");
    const length = view.getUint32(i);
    const type = String.fromCharCode(...b.subarray(i + 4, i + 8));
    const end = i + 12 + length;
    if (end > b.length) throw new ImageMetadataError("Truncated PNG.");
    if (!PNG_DROP.has(type)) parts.push(b.subarray(i, end));
    i = end;
    if (type === "IEND") return concat(parts);
  }
  throw new ImageMetadataError("PNG has no end chunk.");
}

function stripWebp(b: Uint8Array): Uint8Array {
  const view = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const chunks: Uint8Array[] = [];
  let i = 12;
  while (i < b.length) {
    if (i + 8 > b.length) throw new ImageMetadataError("Truncated WebP.");
    const type = String.fromCharCode(...b.subarray(i, i + 4));
    const size = view.getUint32(i + 4, true);
    const end = i + 8 + size + (size % 2);
    if (i + 8 + size > b.length) throw new ImageMetadataError("Truncated WebP.");
    if (type !== "EXIF" && type !== "XMP ") {
      const chunk = b.slice(i, Math.min(end, b.length));
      if (type === "VP8X" && chunk.length > 8) chunk[8] &= ~(0x08 | 0x04); // clear the EXIF and XMP flags
      chunks.push(chunk);
    }
    i = end;
  }
  const body = concat(chunks);
  const out = new Uint8Array(12 + body.length);
  out.set(b.subarray(0, 12));
  new DataView(out.buffer).setUint32(4, 4 + body.length, true); // RIFF size = "WEBP" + chunks
  out.set(body, 12);
  return out;
}

function concat(parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const part of parts) { out.set(part, at); at += part.length; }
  return out;
}

export function stripImageMetadata(bytes: Uint8Array, mime: "image/jpeg" | "image/png" | "image/webp"): Uint8Array<ArrayBuffer> {
  const stripped = mime === "image/jpeg" ? stripJpeg(bytes) : mime === "image/png" ? stripPng(bytes) : stripWebp(bytes);
  return new Uint8Array(stripped);
}
