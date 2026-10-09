// Photos must not leak the property's location through embedded metadata (lib/server/image-metadata.ts).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { deflateSync } from "node:zlib";
import { ImageMetadataError, stripImageMetadata } from "@/lib/server/image-metadata";

const ascii = (s: string) => Buffer.from(s, "latin1");
const has = (bytes: Uint8Array, text: string) => Buffer.from(bytes).includes(ascii(text));

function jpegSegment(marker: number, payload: Buffer) {
  const head = Buffer.from([0xff, marker, 0, 0]);
  head.writeUInt16BE(payload.length + 2, 2);
  return Buffer.concat([head, payload]);
}

test("JPEG: EXIF (with GPS), XMP and comments are removed; image data is unchanged", () => {
  const hero = readFileSync("public/hero.jpg");
  const withMeta = Buffer.concat([
    hero.subarray(0, 2),
    jpegSegment(0xe1, ascii("Exif\0\0GPSLatitude 5.6037N GPSLongitude 0.1870W")),
    jpegSegment(0xe1, ascii("http://ns.adobe.com/xap/1.0/\0<x:xmpmeta>secret</x:xmpmeta>")),
    jpegSegment(0xfe, ascii("House 12, Secret Street")),
    hero.subarray(2),
  ]);
  const clean = stripImageMetadata(new Uint8Array(withMeta), "image/jpeg");
  assert.ok(!has(clean, "GPSLatitude"));
  assert.ok(!has(clean, "xmpmeta"));
  assert.ok(!has(clean, "Secret Street"));
  const sos = (b: Uint8Array) => Buffer.from(b).indexOf(Buffer.from([0xff, 0xda]));
  assert.deepEqual(Buffer.from(clean).subarray(sos(clean)), withMeta.subarray(sos(withMeta)), "compressed pixels untouched");
  assert.ok(clean.length < withMeta.length);
});

test("PNG: text and EXIF chunks are removed", () => {
  const chunk = (type: string, data: Buffer) => {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    return Buffer.concat([length, ascii(type), data, Buffer.alloc(4)]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(1, 0);
  ihdr.writeUInt32BE(1, 4);
  ihdr.set([8, 2, 0, 0, 0], 8);
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("tEXt", ascii("Location\0House 12, Secret Street")),
    chunk("eXIf", ascii("GPSLatitude 5.6")),
    chunk("IDAT", deflateSync(Buffer.from([0, 255, 0, 0]))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  const clean = stripImageMetadata(new Uint8Array(png), "image/png");
  assert.ok(!has(clean, "Secret Street"));
  assert.ok(!has(clean, "GPSLatitude"));
  assert.ok(has(clean, "IHDR") && has(clean, "IDAT") && has(clean, "IEND"));
});

test("WebP: EXIF/XMP chunks are removed and their flags cleared", () => {
  const chunk = (type: string, data: Buffer) => {
    const size = Buffer.alloc(4);
    size.writeUInt32LE(data.length);
    return Buffer.concat([ascii(type), size, data, data.length % 2 ? Buffer.alloc(1) : Buffer.alloc(0)]);
  };
  const vp8x = Buffer.alloc(10);
  vp8x[0] = 0x08 | 0x04; // EXIF + XMP present
  const body = Buffer.concat([
    ascii("WEBP"),
    chunk("VP8X", vp8x),
    chunk("VP8L", Buffer.from([0x2f, 0, 0, 0, 0])),
    chunk("EXIF", ascii("GPSLatitude 5.6")),
    chunk("XMP ", ascii("<x:xmpmeta>secret</x:xmpmeta>")),
  ]);
  const size = Buffer.alloc(4);
  size.writeUInt32LE(body.length);
  const webp = Buffer.concat([ascii("RIFF"), size, body]);
  const clean = Buffer.from(stripImageMetadata(new Uint8Array(webp), "image/webp"));
  assert.ok(!has(clean, "GPSLatitude") && !has(clean, "xmpmeta"));
  assert.equal(clean.readUInt32LE(4), clean.length - 8, "RIFF size updated");
  assert.equal(clean[20] & 0x0c, 0, "EXIF/XMP flags cleared");
});

test("structurally broken images are rejected, not stored", () => {
  assert.throws(() => stripImageMetadata(new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 1, 2, 3]), "image/jpeg"), ImageMetadataError);
  assert.throws(() => stripImageMetadata(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]), "image/png"), ImageMetadataError);
});
