import { DicomTransferSyntax } from "../../../core/DicomTransferSyntax.js";
import type { DicomCodecParams } from "../DicomCodecParams.js";
import type { IDicomTranscoder } from "../IDicomTranscoder.js";

export interface IDicomTranscoderFactory {
  create(
    inputSyntax: DicomTransferSyntax,
    outputSyntax: DicomTransferSyntax,
    inputParams?: DicomCodecParams | null,
    outputParams?: DicomCodecParams | null,
  ): IDicomTranscoder;
}
