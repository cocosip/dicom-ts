import { encode as encodeJpegJs } from "jpeg-js";
import type { IImage } from "./IImage.js";
import type { IImageEncoder } from "./runtime/IImageEncoder.js";
import type { IImageSurface } from "./runtime/IImageSurface.js";
import { registerImageEncoder } from "./runtime/ImageEncoderRegistry.js";

export interface JpegImageEncodeOptions {
  quality?: number;
  colorspace?: "auto" | "grayscale" | "rgb";
  includeJfifHeader?: boolean;
}

export function encodeJpegImage(image: IImage, options: JpegImageEncodeOptions = {}): Uint8Array {
  return encodeRgbaToJpeg(image.pixels, image.width, image.height, options);
}

export class ThirdPartyJpegImageEncoder implements IImageEncoder {
  readonly id = "third-party-jpeg-js-encoder";
  readonly format = "jpeg";

  encode(surface: IImageSurface, options?: Record<string, unknown>): Uint8Array {
    return encodeRgbaToJpeg(surface.pixels, surface.width, surface.height, (options ?? {}) as JpegImageEncodeOptions);
  }
}

/**
 * Backward-compat alias (the implementation is now third-party based).
 */
export class LegacyJpegImageEncoder extends ThirdPartyJpegImageEncoder {}

let registered = false;

export function registerThirdPartyJpegImageEncoder(): void {
  if (registered) {
    return;
  }
  registerImageEncoder(new ThirdPartyJpegImageEncoder());
  registered = true;
}

/**
 * Backward-compat alias.
 */
export function registerLegacyJpegImageEncoder(): void {
  registerThirdPartyJpegImageEncoder();
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
  const input = colorspace === "grayscale" ? toGrayscaleRgba(rgba) : rgba;

  const encoded = encodeJpegJs({
    data: input,
    width,
    height,
  }, quality).data;

  const bytes = new Uint8Array(encoded.buffer, encoded.byteOffset, encoded.byteLength);
  if (options.includeJfifHeader === false) {
    return stripJfifHeader(bytes);
  }
  return bytes;
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

function toGrayscaleRgba(rgba: Uint8Array): Uint8Array {
  const out = new Uint8Array(rgba.length);
  for (let i = 0; i < rgba.length; i += 4) {
    const y = rgba[i] ?? 0;
    out[i] = y;
    out[i + 1] = y;
    out[i + 2] = y;
    out[i + 3] = rgba[i + 3] ?? 255;
  }
  return out;
}

function stripJfifHeader(jpeg: Uint8Array): Uint8Array {
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
