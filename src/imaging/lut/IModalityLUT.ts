import type { ILUT } from "./ILUT.js";

/**
 * Interface for Modality lookup tables.
 * Either Modality Rescale LUT or Modality Sequence LUT.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/LUT/IModalityLUT.cs
 */
export interface IModalityLUT extends ILUT {}
