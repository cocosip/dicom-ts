import type { IGraphic } from "./render/IGraphic.js";
import type { Color32 } from "./Color32.js";

/**
 * Image interface.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/IImage.cs
 */
export interface IImage {
  readonly width: number;
  readonly height: number;

  /** Raw pixel buffer (RGBA, 4 bytes per pixel). */
  readonly pixels: Uint8Array;

  /** Number of bytes per pixel (TypeScript extension; typically 4). */
  readonly bytesPerPixel: number;

  /**
   * Renders (transforms) the image with the given parameters.
   * Applies component selection, flip, and rotation in-place.
   */
  render(components: number, flipX: boolean, flipY: boolean, rotation: number): void;

  /**
   * Draws graphics onto the existing image pixels.
   * Note: In the TypeScript adaptation, graphics are primarily rendered via the
   * pipeline. This method is provided for interface completeness.
   */
  drawGraphics(graphics: Iterable<IGraphic>): void;

  /** Creates a deep copy of this image. */
  clone(): IImage;

  /** Returns the Color32 at pixel coordinates (x, y). */
  getPixel(x: number, y: number): Color32;

  /** Casts this image to the concrete implementation type T. */
  as<T>(): T;
}
