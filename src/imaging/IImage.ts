export interface IImage {
  readonly width: number;
  readonly height: number;
  readonly bytesPerPixel: number;
  readonly pixels: Uint8Array;
}
