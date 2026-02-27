/**
 * File-level DICOM writer (preamble + file meta info + dataset).
 *
 * Ported from fo-dicom/FO-DICOM.Core/IO/Writer/DicomFileWriter.cs
 */
import { DicomTransferSyntax } from "../../core/DicomTransferSyntax.js";
import * as DicomTags from "../../core/DicomTag.generated.js";
import { DicomDataset } from "../../dataset/DicomDataset.js";
import type { IByteTarget } from "../IByteTarget.js";
import { DicomWriteOptions } from "./DicomWriteOptions.js";
import { recalculateGroupLength, write as writeDataset } from "./DicomDatasetExtensions.js";

/**
 * Writer for DICOM Part 10 objects.
 */
export class DicomFileWriter {
  private readonly options: DicomWriteOptions;

  constructor(options?: DicomWriteOptions) {
    this.options = options ?? DicomWriteOptions.Default;
  }

  /**
   * Write DICOM Part 10 object to target.
   */
  write(target: IByteTarget, fileMetaInfo: DicomDataset, dataset: DicomDataset): void {
    DicomFileWriter.writePreamble(target);
    this.writeFileMetaInfo(target, fileMetaInfo);

    const transferSyntax = this.resolveTransferSyntax(fileMetaInfo, dataset);
    this.writeDataset(target, transferSyntax, dataset);
  }

  private static writePreamble(target: IByteTarget): void {
    const preamble = new Uint8Array(132);
    preamble[128] = 0x44; // D
    preamble[129] = 0x49; // I
    preamble[130] = 0x43; // C
    preamble[131] = 0x4d; // M
    target.writeBytes(preamble);
  }

  private resolveTransferSyntax(fileMetaInfo: DicomDataset, dataset: DicomDataset): DicomTransferSyntax {
    const tsUid = fileMetaInfo.tryGetValue<string>(DicomTags.TransferSyntaxUID, 0);
    if (tsUid) return DicomTransferSyntax.parse(tsUid);
    return dataset.internalTransferSyntax ?? DicomTransferSyntax.ExplicitVRLittleEndian;
  }

  private writeFileMetaInfo(target: IByteTarget, fileMetaInfo: DicomDataset): void {
    fileMetaInfo.internalTransferSyntax = DicomTransferSyntax.ExplicitVRLittleEndian;
    recalculateGroupLength(fileMetaInfo, 0x0002, true);

    const metaOptions = new DicomWriteOptions(this.options);
    metaOptions.keepGroupLengths = true;
    writeDataset(fileMetaInfo, target, DicomTransferSyntax.ExplicitVRLittleEndian, metaOptions);
  }

  private writeDataset(target: IByteTarget, syntax: DicomTransferSyntax, dataset: DicomDataset): void {
    writeDataset(dataset, target, syntax, this.options);
  }
}
