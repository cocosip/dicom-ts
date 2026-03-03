import type { DicomTransferSyntax } from "../../../../core/DicomTransferSyntax.js";
import type { DicomJpegParams } from "../DicomJpegParams.js";

/**
 * Per-frame context passed to a DicomJpegAdapter during encode/decode.
 *
 * The built-in codec sets all fields from the DicomPixelData metadata.
 * Custom adapters can use any subset they need.
 */
export interface DicomJpegFrameContext {
  /** Transfer syntax of the source JPEG stream (decode) or target (encode). */
  transferSyntax: DicomTransferSyntax;
  /** Codec parameters (quality, colorspace conversion, etc.). */
  parameters: DicomJpegParams;
  /** Samples per pixel: 1 = grayscale, 3 = colour. */
  samplesPerPixel: number;
  /** Image width in pixels. */
  columns: number;
  /** Image height in pixels. */
  rows: number;
  /** Bits stored per sample (e.g. 8 or 12). */
  bitsStored: number;
  /** Zero-based index of this frame within the pixel data. */
  frameIndex: number;
}

/**
 * Plug-in interface for JPEG encode/decode implementations.
 *
 * Pass a custom adapter to DicomJpegProcess1Codec or DicomJpegProcess2_4Codec
 * to replace the built-in pure-TypeScript DCT engine with a native library.
 */
export interface DicomJpegAdapter {
  decode(frameData: Uint8Array, context: DicomJpegFrameContext): Uint8Array;
  encode(frameData: Uint8Array, context: DicomJpegFrameContext): Uint8Array;
}
