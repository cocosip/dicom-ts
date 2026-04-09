import type { IImageSurface } from "./IImageSurface.js";

export interface IImageBackend<T = unknown> {
  readonly id: string;
  readonly target: string;
  convert(surface: IImageSurface): T;
}
