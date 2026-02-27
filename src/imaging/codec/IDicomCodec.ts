import { DicomTransferSyntax } from "../../core/DicomTransferSyntax.js";
import type { DicomPixelData } from "../DicomPixelData.js";
import type { IByteBuffer } from "../../io/buffer/IByteBuffer.js";

export interface IDicomCodec {
  readonly transferSyntax: DicomTransferSyntax;
  decode(pixelData: DicomPixelData, frame: number): IByteBuffer;
  encode?(pixelData: DicomPixelData, frame: number, buffer: IByteBuffer): IByteBuffer;
}
