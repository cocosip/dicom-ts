import type { IPipeline } from "./IPipeline.js";
import type { ILUT } from "../lut/ILUT.js";

/**
 * RGB color pipeline — no LUT required; pixel data is rendered directly.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Render/RgbColorPipeline.cs
 */
export class RgbColorPipeline implements IPipeline {
  readonly lut: ILUT | null = null;

  clearCache(): void {
    // nothing to clear
  }
}
