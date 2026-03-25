import type { ILUT } from "../lut/ILUT.js";
import type { Histogram } from "../math/Histogram.js";

/**
 * Range of minimum and maximum values (analogous to C# DicomRange<double>).
 */
export interface PixelDataRange {
  readonly minimum: number;
  readonly maximum: number;
}

/**
 * Pixel data interface implemented by various pixel format classes.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Render/PixelData.cs → IPixelData
 */
export interface IPixelData {
  /** Image width (columns) in pixels. */
  readonly width: number;

  /** Image height (rows) in pixels. */
  readonly height: number;

  /**
   * Number of pixel components.
   * 1 for grayscale/palette, 3 for RGB, 4 for RGBA-backed ARGB images.
   */
  readonly components: number;

  /**
   * Return the minimum and maximum pixel values from pixel data,
   * ignoring pixels equal to the given padding value.
   */
  getMinMax(padding: number): PixelDataRange;

  /** Return the minimum and maximum pixel values from pixel data. */
  getMinMax(): PixelDataRange;

  /** Gets the value of the pixel at the specified (x, y) coordinates. */
  getPixel(x: number, y: number): number;

  /**
   * Gets a rescaled copy of the pixel data using bilinear interpolation.
   * Returns `this` if scale factor produces the same dimensions.
   */
  rescale(scale: number): IPixelData;

  /**
   * Render the pixel data into an output array after applying `lut`.
   *
   * For grayscale images each element receives the LUT-transformed pixel value.
   * For color images each element receives a packed ARGB integer (0xAARRGGBB).
   *
   * Matches C# `void Render(ILUT lut, int[] output)`.
   */
  render(lut: ILUT | null, output: Int32Array): void;

  /**
   * Gets a histogram of the pixel data for the given channel.
   * Channel 0 = R (or gray), 1 = G, 2 = B.
   */
  getHistogram(channel: number): Histogram;
}
