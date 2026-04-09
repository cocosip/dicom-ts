import type { IImageEncoder } from "./IImageEncoder.js";
import type { IImageSurface } from "./IImageSurface.js";

const encoders = new Map<string, IImageEncoder>();

function keyOf(format: string): string {
  return format.trim().toLowerCase();
}

export function registerImageEncoder(encoder: IImageEncoder): void {
  encoders.set(keyOf(encoder.format), encoder);
}

export function unregisterImageEncoder(format: string): void {
  encoders.delete(keyOf(format));
}

export function getImageEncoder(format: string): IImageEncoder | null {
  return encoders.get(keyOf(format)) ?? null;
}

export function listImageEncoders(): readonly IImageEncoder[] {
  return Array.from(encoders.values());
}

export function encodeImageSurface(
  surface: IImageSurface,
  format: string,
  options?: Record<string, unknown>,
): Uint8Array {
  const encoder = getImageEncoder(format);
  if (!encoder) {
    throw new Error(`No image encoder registered for format: ${format}`);
  }
  return encoder.encode(surface, options);
}

export async function encodeImageSurfaceAsync(
  surface: IImageSurface,
  format: string,
  options?: Record<string, unknown>,
): Promise<Uint8Array> {
  const encoder = getImageEncoder(format);
  if (!encoder) {
    throw new Error(`No image encoder registered for format: ${format}`);
  }
  if (typeof encoder.encodeAsync === "function") {
    return encoder.encodeAsync(surface, options);
  }
  return encoder.encode(surface, options);
}
