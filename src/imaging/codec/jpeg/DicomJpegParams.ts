/**
 * JPEG codec parameters for all four DICOM JPEG transfer syntaxes.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Codec/DicomJpegCodec.cs
 *            fo-dicom.Codecs/Codec/DicomJpegCodec.cs
 */
import { DicomCodecParams } from "../DicomCodecParams.js";

/**
 * Chroma sub-sampling factor for lossy JPEG encoding.
 *
 * Reference: `DicomJpegSampleFactor` enum in fo-dicom.
 */
export enum DicomJpegSampleFactor {
  /** 4:4:4 — no chroma sub-sampling (highest quality). */
  SF444    = "SF444",
  /** 4:2:2 — horizontal chroma sub-sampling. */
  SF422    = "SF422",
  /** Unknown / not applicable. */
  Unknown  = "Unknown",
}

/**
 * Parameters shared by all DICOM JPEG codec variants.
 *
 * `DicomJpegParams` covers all four JPEG transfer syntaxes:
 *   • Baseline  (4.50)  — uses `quality`, `smoothingFactor`, `sampleFactor`, `convertColorspaceToRgb`
 *   • Extended  (4.51)  — same as Baseline; also valid for 12-bit
 *   • Lossless  (4.57)  — uses `predictor`, `pointTransform`
 *   • SV1       (4.70)  — uses `pointTransform` (predictor is always 1)
 *
 * Reference: `DicomJpegParams` in fo-dicom/FO-DICOM.Core/Imaging/Codec/DicomJpegCodec.cs
 */
export class DicomJpegParams extends DicomCodecParams {
  /**
   * Encoding quality for lossy JPEG (1 = lowest, 100 = highest).
   *
   * Default: 90.
   * Applies to: Baseline (4.50), Extended (4.51).
   */
  quality = 90;

  /**
   * Encoder smoothing factor (0 = no smoothing, 100 = maximum).
   *
   * Reduces compression artefacts at the cost of sharpness.
   * Default: 0.
   * Applies to: Baseline (4.50), Extended (4.51).
   */
  smoothingFactor = 0;

  /**
   * When `true`, instruct the adapter to convert the decoded YCbCr JPEG image
   * into an RGB pixel buffer.  For grayscale images the flag is a no-op.
   *
   * Default: `false` (matches fo-dicom).
   * Applies to: Baseline (4.50), Extended (4.51) — passed through to the adapter context.
   *
   * Note: when the codec builds the adapter context without explicit params
   * (convenience `decode(pixelData, frame)` API), it overrides this to `true`
   * so that plugin adapters receive a sensible default instruction.
   */
  convertColorspaceToRgb = false;

  /**
   * Chroma sub-sampling factor for lossy color encoding.
   *
   * Default: `SF444` (no sub-sampling).
   * Applies to: Baseline (4.50), Extended (4.51).
   */
  sampleFactor = DicomJpegSampleFactor.SF444;

  /**
   * Lossless predictor selection value (1–7, or 0 = auto-select).
   *
   * • 1 — left pixel (first-order; used by SV1)
   * • 2 — pixel above
   * • 3 — pixel above-left
   * • 4 — Ra + Rb − Rc
   * • 5 — Ra + ((Rb − Rc) >> 1)
   * • 6 — Rb + ((Ra − Rc) >> 1)
   * • 7 — (Ra + Rb) >> 1
   * • 0 — auto-select (minimum-variance predictor)
   *
   * Default: 1.
   * Applies to: Lossless (4.57).  Ignored by SV1 (always 1).
   */
  predictor = 1;

  /**
   * Lossless point transform (0–15).
   *
   * Divides each sample by 2^n before encoding, effectively reducing
   * precision by n bits.  Zero means no transform (true lossless).
   *
   * Default: 0.
   * Applies to: Lossless (4.57), SV1 (4.70).
   */
  pointTransform = 0;
}
