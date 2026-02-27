import { DicomTransferSyntax } from "../../core/DicomTransferSyntax.js";
import type { IDicomCodec } from "./IDicomCodec.js";
import type { DicomPixelData } from "../DicomPixelData.js";
import type { IByteBuffer } from "../../io/buffer/IByteBuffer.js";

/**
 * JPEG Lossless Process 14 decoder (not yet implemented).
 */
export class DicomJpegLosslessDecoder implements IDicomCodec {
  readonly transferSyntax: DicomTransferSyntax;

  constructor(transferSyntax: DicomTransferSyntax = DicomTransferSyntax.JPEGProcess14) {
    this.transferSyntax = transferSyntax;
  }

  decode(_pixelData: DicomPixelData, _frame: number): IByteBuffer {
    throw new Error("JPEG Lossless decoder not implemented in dicom-ts yet");
  }
}
