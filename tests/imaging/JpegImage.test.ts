import { describe, expect, it } from "vitest";
import { RawImage } from "../../src/imaging/RawImage.js";
import { encodeJpegImage } from "../../src/imaging/JpegImage.js";
import { decodeDctJpeg } from "../../src/imaging/codec/jpeg/common/JpegBaselineCommon.js";

describe("JpegImage", () => {
  it("encodes grayscale IImage output to a JPEG bitstream", () => {
    const image = new RawImage(
      8,
      8,
      createSolidRgba(8, 8, [180, 180, 180, 255]),
      4,
    );

    const jpeg = encodeJpegImage(image, { quality: 100 });
    const decoded = decodeDctJpeg(stripJfif(jpeg));

    expect(jpeg[0]).toBe(0xff);
    expect(jpeg[1]).toBe(0xd8);
    expect(jpeg[2]).toBe(0xff);
    expect(jpeg[3]).toBe(0xe0);
    expect(decoded.width).toBe(8);
    expect(decoded.height).toBe(8);
    expect(decoded.components === 1 || decoded.components === 3).toBe(true);
    expect(decoded.pixels[0]).toBeGreaterThan(150);
  });

  it("keeps colored IImage output as RGB JPEG", () => {
    const image = new RawImage(
      8,
      8,
      createSolidRgba(8, 8, [220, 30, 20, 255]),
      4,
    );

    const jpeg = encodeJpegImage(image, { quality: 100 });

    expect(readSofComponentCount(jpeg)).toBe(3);
  });
});

function createSolidRgba(width: number, height: number, [r, g, b, a]: [number, number, number, number]): Uint8Array {
  const pixels = new Uint8Array(width * height * 4);
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = r;
    pixels[i + 1] = g;
    pixels[i + 2] = b;
    pixels[i + 3] = a;
  }
  return pixels;
}

function stripJfif(jpeg: Uint8Array): Uint8Array {
  if (jpeg.length < 20 || jpeg[0] !== 0xff || jpeg[1] !== 0xd8 || jpeg[2] !== 0xff || jpeg[3] !== 0xe0) {
    return jpeg;
  }

  const segmentLength = ((jpeg[4] ?? 0) << 8) | (jpeg[5] ?? 0);
  const headerSize = 2 + 2 + segmentLength;
  const stripped = new Uint8Array(jpeg.length - (headerSize - 2));
  stripped[0] = 0xff;
  stripped[1] = 0xd8;
  stripped.set(jpeg.subarray(headerSize), 2);
  return stripped;
}

function readSofComponentCount(jpeg: Uint8Array): number {
  let offset = 2;
  while (offset + 4 < jpeg.length) {
    if (jpeg[offset] !== 0xff) {
      offset++;
      continue;
    }

    const marker = ((jpeg[offset] ?? 0) << 8) | (jpeg[offset + 1] ?? 0);
    if (marker === 0xffc0 || marker === 0xffc1) {
      return jpeg[offset + 9] ?? 0;
    }

    if (marker === 0xffd8 || marker === 0xffd9) {
      offset += 2;
      continue;
    }

    const segmentLength = (((jpeg[offset + 2] ?? 0) << 8) | (jpeg[offset + 3] ?? 0));
    if (segmentLength < 2) {
      break;
    }
    offset += 2 + segmentLength;
  }

  throw new Error("Unable to find JPEG SOF marker");
}
