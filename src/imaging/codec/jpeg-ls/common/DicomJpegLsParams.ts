import { DicomCodecParams } from "../../DicomCodecParams.js";

/**
 * JPEG-LS interleave mode.
 *
 * 0: non-interleaved
 * 1: line-interleaved
 * 2: sample-interleaved
 */
export enum DicomJpegLsInterleaveMode {
  None = 0,
  Line = 1,
  Sample = 2,
}

/**
 * JPEG-LS color transform selector.
 */
export enum DicomJpegLsColorTransform {
  None = 0,
  HP1 = 1,
  HP2 = 2,
  HP3 = 3,
}

/**
 * Parameters shared by JPEG-LS Lossless and Near-Lossless codecs.
 */
export class DicomJpegLsParams extends DicomCodecParams {
  /** NEAR parameter (0 = lossless). */
  allowedError = 0;

  /** Interleave mode hint. Current in-tree implementation supports None and Line. */
  interleaveMode = DicomJpegLsInterleaveMode.None;

  /** Color transform hint for callers/adapters. */
  colorTransform = DicomJpegLsColorTransform.HP1;

  /** Ask decoder to return RGB pixels when possible. */
  convertColorspaceToRgb = true;

  /** JPEG-LS RESET interval (defaults to 64). */
  resetInterval = 64;
}
