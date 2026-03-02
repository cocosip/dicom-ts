import { DicomTransferSyntax } from "../../core/DicomTransferSyntax.js";
import type { DicomFile } from "../../DicomFile.js";
import type { DicomDataset } from "../../dataset/DicomDataset.js";
import type { IByteBuffer } from "../../io/buffer/IByteBuffer.js";
import type { DicomPixelData } from "../DicomPixelData.js";

export interface IDicomTranscoder {
  readonly inputSyntax: DicomTransferSyntax;
  readonly inputCodecParams: unknown;
  readonly outputSyntax: DicomTransferSyntax;
  readonly outputCodecParams: unknown;

  transcode(file: DicomFile): DicomFile;
  transcode(dataset: DicomDataset): DicomDataset;
  decodeFrame(dataset: DicomDataset, frame: number): IByteBuffer;
  decodePixelData(dataset: DicomDataset, frame: number): DicomPixelData;
}
