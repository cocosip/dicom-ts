/**
 * Adapter contract for plugin-path JPEG Baseline and Extended codecs.
 *
 * Because JPEG Baseline / Extended require a native or third-party codec
 * (e.g. libjpeg), the library exposes a callback adapter pattern: the caller
 * registers an object that performs the actual decode/encode and the codec
 * wrapper handles DICOM pixel-data framing and metadata.
 */

import type { DicomTransferSyntax } from "../../../../core/DicomTransferSyntax.js";
import type { DicomJpegParams } from "../DicomJpegParams.js";

/** Context provided to both decode and encode callbacks. */
export interface DicomJpegFrameContext {
  /** The DICOM transfer syntax of the encapsulated stream. */
  transferSyntax: DicomTransferSyntax;
  /**
   * Full JPEG codec parameters.  For the convenience single-frame API the
   * codec populates `convertColorspaceToRgb = true`; for the `IDicomCodec`
   * path the caller-supplied `DicomJpegParams` instance is used as-is.
   */
  parameters: DicomJpegParams;
  /** Samples per pixel for the current frame. */
  samplesPerPixel: number;
  /** Bit depth (bits stored) for the frame. */
  bitsStored: number;
  /** Image width in pixels. */
  columns: number;
  /** Image height in pixels. */
  rows: number;
}

/**
 * Adapter interface that callers must implement and pass to the codec
 * constructor. The library calls these methods per-frame.
 */
export interface DicomJpegAdapter {
  /**
   * Decode one JPEG frame.
   * @param frameData Raw JPEG compressed bytes for a single frame.
   * @param context   Metadata describing the pixel format and codec parameters.
   * @returns Decoded raw pixel bytes (uncompressed, one or two bytes per sample).
   */
  decode(frameData: Uint8Array, context: DicomJpegFrameContext): Uint8Array;

  /**
   * Encode one frame of raw pixel data.
   * @param frameData Uncompressed pixel bytes (one or two bytes per sample).
   * @param context   Metadata describing the pixel format and codec parameters.
   * @returns JPEG compressed bytes.
   */
  encode(frameData: Uint8Array, context: DicomJpegFrameContext): Uint8Array;
}
