export type ImagePixelFormat = "rgba8";

export interface IImageSurface {
  readonly width: number;
  readonly height: number;
  readonly pixelFormat: ImagePixelFormat;
  readonly pixels: Uint8Array;
}
