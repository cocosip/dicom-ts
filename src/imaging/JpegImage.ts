import type { IImage } from "./IImage.js";
import { encodeDctJpeg } from "./codec/jpeg/common/JpegBaselineCommon.js";

export interface JpegImageEncodeOptions {
  quality?: number;
  colorspace?: "auto" | "grayscale" | "rgb";
  includeJfifHeader?: boolean;
}

export function encodeJpegImage(image: IImage, options: JpegImageEncodeOptions = {}): Uint8Array {
  return encodeRgbaToJpeg(image.pixels, image.width, image.height, options);
}

export function encodeRgbaToJpeg(
  rgba: Uint8Array,
  width: number,
  height: number,
  options: JpegImageEncodeOptions = {},
): Uint8Array {
  if (width <= 0 || height <= 0) {
    throw new Error(`Invalid image dimensions: ${width}x${height}`);
  }

  const expectedLength = width * height * 4;
  if (rgba.length !== expectedLength) {
    throw new Error(`Expected RGBA buffer length ${expectedLength}, got ${rgba.length}`);
  }

  const quality = normalizeQuality(options.quality ?? 90);
  const colorspace = resolveColorspace(rgba, options.colorspace ?? "auto");
  const pixels = colorspace === "grayscale" ? rgbaToGrayscale(rgba) : rgbaToRgb(rgba);
  const encoded = encodeDctJpeg(pixels, width, height, colorspace === "grayscale" ? 1 : 3, quality);

  return options.includeJfifHeader === false ? encoded : withJfifHeader(encoded);
}

function normalizeQuality(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error(`JPEG quality must be a finite number, got ${value}`);
  }

  return Math.max(1, Math.min(100, Math.round(value)));
}

function resolveColorspace(rgba: Uint8Array, requested: JpegImageEncodeOptions["colorspace"]): "grayscale" | "rgb" {
  if (requested === "grayscale" || requested === "rgb") {
    return requested;
  }

  for (let i = 0; i < rgba.length; i += 4) {
    if (rgba[i] !== rgba[i + 1] || rgba[i] !== rgba[i + 2]) {
      return "rgb";
    }
  }

  return "grayscale";
}

function rgbaToGrayscale(rgba: Uint8Array): Uint8Array {
  const out = new Uint8Array(rgba.length >> 2);
  for (let src = 0, dst = 0; src < rgba.length; src += 4, dst++) {
    out[dst] = rgba[src] ?? 0;
  }
  return out;
}

function rgbaToRgb(rgba: Uint8Array): Uint8Array {
  const out = new Uint8Array((rgba.length >> 2) * 3);
  for (let src = 0, dst = 0; src < rgba.length; src += 4) {
    out[dst++] = rgba[src] ?? 0;
    out[dst++] = rgba[src + 1] ?? 0;
    out[dst++] = rgba[src + 2] ?? 0;
  }
  return out;
}

function withJfifHeader(jpeg: Uint8Array): Uint8Array {
  if (hasJfifHeader(jpeg)) {
    return jpeg;
  }
  if (jpeg.length < 2 || jpeg[0] !== 0xff || jpeg[1] !== 0xd8) {
    throw new Error("JPEG output is missing SOI marker");
  }

  const app0 = createJfifApp0Segment();
  const out = new Uint8Array(jpeg.length + app0.length);
  out[0] = 0xff;
  out[1] = 0xd8;
  out.set(app0, 2);
  out.set(jpeg.subarray(2), 2 + app0.length);
  return out;
}

function hasJfifHeader(jpeg: Uint8Array): boolean {
  return (
    jpeg.length >= 11
    && jpeg[0] === 0xff
    && jpeg[1] === 0xd8
    && jpeg[2] === 0xff
    && jpeg[3] === 0xe0
    && jpeg[6] === 0x4a
    && jpeg[7] === 0x46
    && jpeg[8] === 0x49
    && jpeg[9] === 0x46
    && jpeg[10] === 0x00
  );
}

function createJfifApp0Segment(): Uint8Array {
  return new Uint8Array([
    0xff, 0xe0,
    0x00, 0x10,
    0x4a, 0x46, 0x49, 0x46, 0x00,
    0x01, 0x01,
    0x00,
    0x00, 0x01,
    0x00, 0x01,
    0x00, 0x00,
  ]);
}
