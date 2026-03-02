import type { DicomTransferSyntax } from "../../core/DicomTransferSyntax.js";
import type { IDicomCodec } from "./IDicomCodec.js";

/**
 * Codec manager contract.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Codec/TranscoderManager.cs (ITranscoderManager)
 */
export interface ITranscoderManager {
  hasCodec(syntax: DicomTransferSyntax): boolean;
  canTranscode(inSyntax: DicomTransferSyntax, outSyntax: DicomTransferSyntax): boolean;
  getCodec(syntax: DicomTransferSyntax): IDicomCodec;
  loadCodecs(path?: string | null, search?: string | null): void;
}
