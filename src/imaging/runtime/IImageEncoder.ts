import type { IImageSurface } from "./IImageSurface.js";

export interface IImageEncoder {
  readonly id: string;
  readonly format: string;
  encode(surface: IImageSurface, options?: Record<string, unknown>): Uint8Array;
  encodeAsync?(surface: IImageSurface, options?: Record<string, unknown>): Promise<Uint8Array>;
}
