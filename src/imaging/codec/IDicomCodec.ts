import { DicomTransferSyntax } from "../../core/DicomTransferSyntax.js";
import type { DicomPixelData } from "../DicomPixelData.js";
import type { DicomCodecParams } from "./DicomCodecParams.js";

/**
 * Interface for DICOM codec implementations.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Codec/IDicomCodec.cs
 */
export interface IDicomCodec {
  readonly name: string;
  readonly transferSyntax: DicomTransferSyntax;
  getDefaultParameters(): DicomCodecParams | null;
  encode(oldPixelData: DicomPixelData, newPixelData: DicomPixelData, parameters: DicomCodecParams | null): void;
  decode(oldPixelData: DicomPixelData, newPixelData: DicomPixelData, parameters: DicomCodecParams | null): void;
}
