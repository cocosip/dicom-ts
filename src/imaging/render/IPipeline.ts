import type { ILUT } from "../lut/ILUT.js";

/**
 * Pipeline interface — provides the ILUT and cache lifecycle.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Render/IPipeline.cs
 */
export interface IPipeline {
  /** The LUT produced by this pipeline. Null for RGB (no LUT needed). */
  readonly lut: ILUT | null;

  /** Remove all cached data to reduce memory consumption. */
  clearCache(): void;
}
