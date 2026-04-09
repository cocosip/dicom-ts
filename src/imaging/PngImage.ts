import UPNG from "upng-js";
import type { IImage } from "./IImage.js";
import type { IImageEncoder } from "./runtime/IImageEncoder.js";
import type { IImageSurface } from "./runtime/IImageSurface.js";
import { registerImageEncoder } from "./runtime/ImageEncoderRegistry.js";

export interface PngImageEncodeOptions {
  /**
   * Palette colors for quantization.
   * 0 means lossless RGBA output.
   */
  colors?: number;
}

export function encodePngImage(image: IImage, options: PngImageEncodeOptions = {}): Uint8Array {
  return encodeRgbaToPng(image.pixels, image.width, image.height, options);
}

export class ThirdPartyPngImageEncoder implements IImageEncoder {
  readonly id = "third-party-upng-encoder";
  readonly format = "png";

  encode(surface: IImageSurface, options?: Record<string, unknown>): Uint8Array {
    return encodeRgbaToPng(surface.pixels, surface.width, surface.height, (options ?? {}) as PngImageEncodeOptions);
  }
}

let registered = false;

export function registerThirdPartyPngImageEncoder(): void {
  if (registered) {
    return;
  }
  registerImageEncoder(new ThirdPartyPngImageEncoder());
  registered = true;
}

export function encodeRgbaToPng(
  rgba: Uint8Array,
  width: number,
  height: number,
  options: PngImageEncodeOptions = {},
): Uint8Array {
  if (width <= 0 || height <= 0) {
    throw new Error(`Invalid image dimensions: ${width}x${height}`);
  }

  const expectedLength = width * height * 4;
  if (rgba.length !== expectedLength) {
    throw new Error(`Expected RGBA buffer length ${expectedLength}, got ${rgba.length}`);
  }

  const colors = normalizeColors(options.colors ?? 0);
  const frame = sliceToExactBuffer(rgba);
  const png = UPNG.encode([frame], width, height, colors);
  return new Uint8Array(png);
}

function normalizeColors(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error(`PNG colors must be a finite number, got ${value}`);
  }
  return Math.max(0, Math.round(value));
}

function sliceToExactBuffer(data: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(data.byteLength);
  copy.set(data);
  return copy.buffer;
}
