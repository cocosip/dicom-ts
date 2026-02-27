/**
 * DICOMDIR directory file support.
 *
 * Ported from fo-dicom/FO-DICOM.Core/Media/DicomDirectory.cs
 */
import { readFileSync } from "node:fs";
import type { Readable } from "node:stream";
import { inflateRawSync, inflateSync } from "node:zlib";
import { DicomFile } from "../DicomFile.js";
import { DicomFileMetaInformation } from "../DicomFileMetaInformation.js";
import { DicomFileFormat } from "../DicomFileFormat.js";
import { DicomTransferSyntax } from "../core/DicomTransferSyntax.js";
import { DicomImplementation } from "../core/DicomImplementation.js";
import { DicomUID, DicomStorageCategory } from "../core/DicomUID.js";
import * as DicomUIDs from "../core/DicomUID.generated.js";
import * as DicomTags from "../core/DicomTag.generated.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomItem } from "../dataset/DicomItem.js";
import {
  DicomCodeString,
  DicomPersonName,
  DicomUniqueIdentifier,
  DicomUnsignedLong,
  DicomUnsignedShort,
} from "../dataset/DicomElement.js";
import { DicomSequence } from "../dataset/DicomSequence.js";
import { ByteBufferByteSource } from "../io/ByteBufferByteSource.js";
import { FileByteSource } from "../io/FileByteSource.js";
import { StreamByteSource } from "../io/StreamByteSource.js";
import { MemoryByteBuffer } from "../io/buffer/MemoryByteBuffer.js";
import { DicomReader } from "../io/reader/DicomReader.js";
import { DicomDatasetReaderObserver } from "../io/reader/DicomDatasetReaderObserver.js";
import { DicomReaderMultiObserver } from "../io/reader/DicomReaderMultiObserver.js";
import { DicomWriteLengthCalculator } from "../io/writer/DicomWriteLengthCalculator.js";
import { recalculateGroupLength } from "../io/writer/DicomDatasetExtensions.js";
import { DicomWriteOptions } from "../io/writer/DicomWriteOptions.js";
import { FileReadOption } from "../io/FileReadOption.js";
import { DicomDirectoryEntry } from "./DicomDirectoryEntry.js";
import { DicomDirectoryReaderObserver } from "./DicomDirectoryReaderObserver.js";
import { DicomDirectoryRecord } from "./DicomDirectoryRecord.js";
import { DicomDirectoryRecordCollection } from "./DicomDirectoryRecordCollection.js";
import { DicomDirectoryRecordType } from "./DicomDirectoryRecordType.js";

export interface DicomDirectoryOpenOptions {
  readOption?: FileReadOption;
  largeObjectSize?: number;
}

/**
 * DICOM directory (DICOMDIR) container.
 */
export class DicomDirectory extends DicomFile {
  private directoryRecordSequence: DicomSequence;
  private fileOffset = 0;

  rootDirectoryRecord: DicomDirectoryRecord | null = null;
  validateItems = true;

  constructor(explicitVr = true) {
    super();

    this.fileMetaInfo.version = new Uint8Array([0x00, 0x01]);
    this.fileMetaInfo.mediaStorageSOPClassUID = DicomUIDs.MediaStorageDirectoryStorage;
    this.fileMetaInfo.mediaStorageSOPInstanceUID = DicomUID.generate();
    this.fileMetaInfo.transferSyntaxUID = explicitVr
      ? DicomTransferSyntax.ExplicitVRLittleEndian
      : DicomTransferSyntax.ImplicitVRLittleEndian;
    this.fileMetaInfo.implementationClassUID = DicomImplementation.ClassUID;
    this.fileMetaInfo.implementationVersionName = DicomImplementation.Version;

    this.dataset.internalTransferSyntax = this.fileMetaInfo.transferSyntaxUID
      ?? DicomTransferSyntax.ExplicitVRLittleEndian;

    this.directoryRecordSequence = new DicomSequence(DicomTags.DirectoryRecordSequence);

    this.dataset.addOrUpdate(
      new DicomCodeString(DicomTags.FileSetID, ""),
      new DicomUnsignedShort(DicomTags.FileSetConsistencyFlag, 0),
      new DicomUnsignedLong(DicomTags.OffsetOfTheFirstDirectoryRecordOfTheRootDirectoryEntity, 0),
      new DicomUnsignedLong(DicomTags.OffsetOfTheLastDirectoryRecordOfTheRootDirectoryEntity, 0),
      this.directoryRecordSequence
    );
  }

  get rootDirectoryRecordCollection(): DicomDirectoryRecordCollection {
    return new DicomDirectoryRecordCollection(this.rootDirectoryRecord);
  }

  get fileSetID(): string {
    return this.dataset.getSingleValueOrDefault(DicomTags.FileSetID, "");
  }

  set fileSetID(value: string) {
    if (value && value.trim().length > 0) {
      this.dataset.addOrUpdate(new DicomCodeString(DicomTags.FileSetID, value));
    } else {
      throw new Error("File Set ID must not be null or empty.");
    }
  }

  get sourceApplicationEntityTitle(): string | null {
    return this.fileMetaInfo.sourceApplicationEntityTitle;
  }

  set sourceApplicationEntityTitle(value: string | null) {
    this.fileMetaInfo.sourceApplicationEntityTitle = value;
  }

  get mediaStorageSOPInstanceUID(): DicomUID | null {
    return this.fileMetaInfo.mediaStorageSOPInstanceUID;
  }

  set mediaStorageSOPInstanceUID(value: DicomUID | null) {
    this.fileMetaInfo.mediaStorageSOPInstanceUID = value;
  }

  get autoValidate(): boolean {
    return this.validateItems;
  }

  set autoValidate(value: boolean) {
    this.validateItems = value;
  }

  static override async open(path: string, options?: DicomDirectoryOpenOptions): Promise<DicomDirectory>;
  static override async open(stream: Readable, options?: DicomDirectoryOpenOptions): Promise<DicomDirectory>;
  static override async open(
    source: string | Readable,
    options: DicomDirectoryOpenOptions = {}
  ): Promise<DicomDirectory> {
    if (typeof source === "string") {
      const fileSource = new FileByteSource(source, options.readOption, options.largeObjectSize ?? 0);
      try {
        return DicomDirectory.readFromSource(fileSource);
      } finally {
        fileSource.close();
      }
    }

    const streamSource = new StreamByteSource(source, options.readOption, options.largeObjectSize ?? 0);
    return DicomDirectory.readFromSource(streamSource);
  }

  static override async openAsync(path: string, options?: DicomDirectoryOpenOptions): Promise<DicomDirectory>;
  static override async openAsync(stream: Readable, options?: DicomDirectoryOpenOptions): Promise<DicomDirectory>;
  static override async openAsync(
    source: string | Readable,
    options: DicomDirectoryOpenOptions = {}
  ): Promise<DicomDirectory> {
    return this.open(source as any, options);
  }

  addFile(dicomFile: DicomFile, referencedFileId = ""): DicomDirectoryEntry {
    if (!dicomFile) {
      throw new Error("dicomFile must not be null.");
    }
    return this.addNewRecord(dicomFile.fileMetaInfo, dicomFile.dataset, referencedFileId);
  }

  protected override onSave(): void {
    if (!this.rootDirectoryRecord) {
      throw new Error("No DICOM files added, cannot save DICOM directory");
    }

    this.directoryRecordSequence.items.length = 0;

    const transferSyntax = this.fileMetaInfo.transferSyntaxUID
      ?? this.dataset.internalTransferSyntax
      ?? DicomTransferSyntax.ExplicitVRLittleEndian;
    this.dataset.internalTransferSyntax = transferSyntax;

    this.fileOffset = this.calculateBaseOffset(transferSyntax);

    this.addDirectoryRecordsToSequenceItem(this.rootDirectoryRecord);
    const calculator = new DicomWriteLengthCalculator(transferSyntax, DicomWriteOptions.Default);

    this.calculateOffsets(calculator);
    this.setOffsets();

    let lastRoot = this.rootDirectoryRecord;
    while (lastRoot?.nextDirectoryRecord) {
      lastRoot = lastRoot.nextDirectoryRecord;
    }

    this.dataset.addOrUpdate(
      new DicomUnsignedLong(DicomTags.OffsetOfTheFirstDirectoryRecordOfTheRootDirectoryEntity, this.rootDirectoryRecord.offset),
      new DicomUnsignedLong(DicomTags.OffsetOfTheLastDirectoryRecordOfTheRootDirectoryEntity, lastRoot?.offset ?? 0)
    );
  }

  private addNewRecord(
    metaFileInfo: DicomFileMetaInformation,
    dataset: DicomDataset,
    referencedFileId: string
  ): DicomDirectoryEntry {
    const patientRecord = this.createPatientRecord(dataset);
    const studyRecord = this.createStudyRecord(dataset, patientRecord);
    const seriesRecord = this.createSeriesRecord(dataset, studyRecord);
    const imageRecord = this.createImageRecord(metaFileInfo, dataset, seriesRecord, referencedFileId);

    return new DicomDirectoryEntry({
      patientRecord,
      studyRecord,
      seriesRecord,
      instanceRecord: imageRecord,
    });
  }

  private createImageRecord(
    metaFileInfo: DicomFileMetaInformation,
    dataset: DicomDataset,
    seriesRecord: DicomDirectoryRecord,
    referencedFileId: string
  ): DicomDirectoryRecord {
    let currentImage = seriesRecord.lowerLevelDirectoryRecord;
    const imageInstanceUid = dataset.getSingleValue<string>(DicomTags.SOPInstanceUID);

    while (currentImage) {
      if (currentImage.key === imageInstanceUid) {
        return currentImage;
      }
      if (currentImage.nextDirectoryRecord) {
        currentImage = currentImage.nextDirectoryRecord;
      } else {
        break;
      }
    }

    const storageCategory = metaFileInfo.mediaStorageSOPClassUID?.storageCategory ?? DicomStorageCategory.None;
    let recordType = DicomDirectoryRecordType.Image;
    if (storageCategory === DicomStorageCategory.StructuredReport) {
      recordType = DicomDirectoryRecordType.Report;
    } else if (storageCategory === DicomStorageCategory.PresentationState) {
      recordType = DicomDirectoryRecordType.PresentationState;
    }

    const newImage = this.createRecordSequenceItem(recordType, dataset, imageInstanceUid);
    newImage.addOrUpdate(new DicomCodeString(DicomTags.ReferencedFileID, referencedFileId));

    withValidationSuppressed(newImage, () => {
      if (metaFileInfo.mediaStorageSOPClassUID) {
        newImage.addOrUpdate(new DicomUniqueIdentifier(
          DicomTags.ReferencedSOPClassUIDInFile,
          metaFileInfo.mediaStorageSOPClassUID
        ));
      }
      if (metaFileInfo.mediaStorageSOPInstanceUID) {
        newImage.addOrUpdate(new DicomUniqueIdentifier(
          DicomTags.ReferencedSOPInstanceUIDInFile,
          metaFileInfo.mediaStorageSOPInstanceUID
        ));
      }
      if (metaFileInfo.transferSyntaxUID) {
        newImage.addOrUpdate(new DicomUniqueIdentifier(
          DicomTags.ReferencedTransferSyntaxUIDInFile,
          metaFileInfo.transferSyntaxUID
        ));
      }
    });

    if (currentImage) {
      currentImage.nextDirectoryRecord = newImage;
    } else {
      seriesRecord.lowerLevelDirectoryRecord = newImage;
    }

    return newImage;
  }

  private createSeriesRecord(dataset: DicomDataset, studyRecord: DicomDirectoryRecord): DicomDirectoryRecord {
    let currentSeries = studyRecord.lowerLevelDirectoryRecord;
    const seriesInstanceUid = dataset.getSingleValue<string>(DicomTags.SeriesInstanceUID);

    while (currentSeries) {
      if (currentSeries.key === seriesInstanceUid) {
        return currentSeries;
      }
      if (currentSeries.nextDirectoryRecord) {
        currentSeries = currentSeries.nextDirectoryRecord;
      } else {
        break;
      }
    }

    const newSeries = this.createRecordSequenceItem(DicomDirectoryRecordType.Series, dataset, seriesInstanceUid);

    if (currentSeries) {
      currentSeries.nextDirectoryRecord = newSeries;
    } else {
      studyRecord.lowerLevelDirectoryRecord = newSeries;
    }

    return newSeries;
  }

  private createStudyRecord(dataset: DicomDataset, patientRecord: DicomDirectoryRecord): DicomDirectoryRecord {
    let currentStudy = patientRecord.lowerLevelDirectoryRecord;
    const studyInstanceUid = dataset.getSingleValue<string>(DicomTags.StudyInstanceUID);

    while (currentStudy) {
      if (currentStudy.key === studyInstanceUid) {
        return currentStudy;
      }
      if (currentStudy.nextDirectoryRecord) {
        currentStudy = currentStudy.nextDirectoryRecord;
      } else {
        break;
      }
    }

    const newStudy = this.createRecordSequenceItem(DicomDirectoryRecordType.Study, dataset, studyInstanceUid);

    if (currentStudy) {
      currentStudy.nextDirectoryRecord = newStudy;
    } else {
      patientRecord.lowerLevelDirectoryRecord = newStudy;
    }

    return newStudy;
  }

  private createPatientRecord(dataset: DicomDataset): DicomDirectoryRecord {
    const patientId = dataset.getSingleValueOrDefault(DicomTags.PatientID, "");
    const patientName = dataset.getDicomItem<DicomPersonName>(DicomTags.PatientName);

    let currentPatient = this.rootDirectoryRecord;

    while (currentPatient) {
      const currentId = currentPatient.key;
      const currentName = currentPatient.getDicomItem<DicomPersonName>(DicomTags.PatientName);

      if (currentId === patientId && DicomPersonName.haveSameContent(currentName, patientName)) {
        return currentPatient;
      }
      if (currentPatient.nextDirectoryRecord) {
        currentPatient = currentPatient.nextDirectoryRecord;
      } else {
        break;
      }
    }

    const newPatient = this.createRecordSequenceItem(DicomDirectoryRecordType.Patient, dataset, patientId);

    if (currentPatient) {
      currentPatient.nextDirectoryRecord = newPatient;
    } else {
      this.rootDirectoryRecord = newPatient;
    }

    return newPatient;
  }

  private createRecordSequenceItem(
    recordType: DicomDirectoryRecordType,
    dataset: DicomDataset,
    key: string
  ): DicomDirectoryRecord {
    if (!recordType) throw new Error("recordType must not be null.");
    if (!dataset) throw new Error("dataset must not be null.");

    const items: DicomItem[] = [
      new DicomUnsignedLong(DicomTags.OffsetOfTheNextDirectoryRecord, 0),
      new DicomUnsignedShort(DicomTags.RecordInUseFlag, 0xffff),
      new DicomUnsignedLong(DicomTags.OffsetOfReferencedLowerLevelDirectoryEntity, 0),
      new DicomCodeString(DicomTags.DirectoryRecordType, recordType.toString()),
    ];

    const charset = dataset.getDicomItem<DicomItem>(DicomTags.SpecificCharacterSet);
    if (charset) {
      items.push(charset);
    }

    const sequenceItem = new DicomDirectoryRecord(items, this.validateItems);
    sequenceItem.key = key;

    withValidationSuppressed(sequenceItem, () => {
      for (const tag of recordType.tags) {
        const item = dataset.getDicomItem<DicomItem>(tag);
        if (item) {
          sequenceItem.addOrUpdate(item);
        }
      }
    });

    return sequenceItem;
  }

  private addDirectoryRecordsToSequenceItem(recordItem: DicomDirectoryRecord): void {
    let currentItem: DicomDirectoryRecord | null = recordItem;
    while (currentItem) {
      this.directoryRecordSequence.items.push(currentItem);

      if (currentItem.lowerLevelDirectoryRecord) {
        this.addDirectoryRecordsToSequenceItem(currentItem.lowerLevelDirectoryRecord);
      }

      currentItem = currentItem.nextDirectoryRecord;
    }
  }

  private calculateOffsets(calculator: DicomWriteLengthCalculator): void {
    for (const item of this.directoryRecordSequence.items) {
      if (!(item instanceof DicomDirectoryRecord)) {
        throw new Error(`Unexpected type for directory record: ${item.constructor?.name ?? "unknown"}`);
      }

      item.offset = this.fileOffset;
      this.fileOffset += 4 + 4; // sequence item tag + length
      this.fileOffset += calculator.calculateItems(item);
      this.fileOffset += 4 + 4; // sequence item delimitation item
    }

    this.fileOffset += 4 + 4; // sequence delimitation item
  }

  private setOffsets(): void {
    for (const record of this.directoryRecordSequence.items) {
      if (!(record instanceof DicomDirectoryRecord)) continue;
      record.addOrUpdate(
        new DicomUnsignedLong(DicomTags.OffsetOfTheNextDirectoryRecord, record.nextDirectoryRecord?.offset ?? 0),
        new DicomUnsignedLong(
          DicomTags.OffsetOfReferencedLowerLevelDirectoryEntity,
          record.lowerLevelDirectoryRecord?.offset ?? 0
        )
      );
    }
  }

  private calculateBaseOffset(transferSyntax: DicomTransferSyntax): number {
    recalculateGroupLength(this.fileMetaInfo, 0x0002, true);
    const metaOptions = new DicomWriteOptions(DicomWriteOptions.Default);
    metaOptions.keepGroupLengths = true;

    const metaCalculator = new DicomWriteLengthCalculator(DicomTransferSyntax.ExplicitVRLittleEndian, metaOptions);
    const datasetCalculator = new DicomWriteLengthCalculator(transferSyntax, DicomWriteOptions.Default);

    let offset = 132; // preamble + DICM
    offset += metaCalculator.calculateItems(this.fileMetaInfo);

    for (const item of this.dataset) {
      if (item.tag.equals(DicomTags.DirectoryRecordSequence)) {
        break;
      }
      offset += datasetCalculator.calculateItem(item);
    }

    offset += sequenceHeaderLength(transferSyntax);
    return offset;
  }

  private static readFromSource(source: FileByteSource | StreamByteSource): DicomDirectory {
    const preamble = readPreamble(source);

    const metaInfo = new DicomDataset(DicomTransferSyntax.ExplicitVRLittleEndian);
    const metaObserver = new DicomDatasetReaderObserver(metaInfo);
    const reader = new DicomReader();

    reader.read(source, metaObserver, {
      transferSyntax: DicomTransferSyntax.ExplicitVRLittleEndian,
      stop: (tag) => tag.group !== 0x0002,
    });

    const tsUid = metaInfo.tryGetValue<string>(DicomTags.TransferSyntaxUID, 0);
    const transferSyntax = tsUid
      ? DicomTransferSyntax.parse(tsUid)
      : DicomTransferSyntax.ExplicitVRLittleEndian;

    let dataset: DicomDataset;
    let dirObserver: DicomDirectoryReaderObserver;

    if (transferSyntax.isDeflate) {
      if (!(source instanceof FileByteSource)) {
        throw new Error("Deflated transfer syntax requires file-backed source for synchronous read.");
      }
      const remaining = readRemainingFileBytes(source);
      const inflated = inflateDeflated(remaining);
      const inflatedSource = new ByteBufferByteSource([new MemoryByteBuffer(inflated)]);
      dataset = new DicomDataset(transferSyntax);
      const dsObserver = new DicomDatasetReaderObserver(dataset, metaInfo.fallbackEncodings);
      dirObserver = new DicomDirectoryReaderObserver(dataset);
      reader.read(inflatedSource, new DicomReaderMultiObserver([dsObserver, dirObserver]), { transferSyntax });
    } else {
      dataset = new DicomDataset(transferSyntax);
      const dsObserver = new DicomDatasetReaderObserver(dataset, metaInfo.fallbackEncodings);
      dirObserver = new DicomDirectoryReaderObserver(dataset);
      reader.read(source, new DicomReaderMultiObserver([dsObserver, dirObserver]), { transferSyntax });
    }

    const dir = new DicomDirectory();
    dir.dataset = dataset;
    dir.dataset.internalTransferSyntax = transferSyntax;
    dir.fileMetaInfo = new DicomFileMetaInformation(metaInfo);
    dir.fileMetaInfo.transferSyntaxUID = transferSyntax;
    dir.directoryRecordSequence = dir.dataset.getDicomItem<DicomSequence>(DicomTags.DirectoryRecordSequence)
      ?? new DicomSequence(DicomTags.DirectoryRecordSequence);
    dir.rootDirectoryRecord = dirObserver.buildDirectoryRecords();
    dir.format = inferFormat(preamble, metaInfo);
    dir.isPartial = false;

    return dir;
  }
}

function sequenceHeaderLength(syntax: DicomTransferSyntax): number {
  return syntax.isExplicitVR ? 12 : 8;
}

function readPreamble(source: FileByteSource | StreamByteSource): Uint8Array | null {
  const start = source.position;
  try {
    if (!source.require(132)) {
      source.goTo(start);
      return null;
    }
  } catch {
    source.goTo(start);
    return null;
  }
  const preamble = source.getBytes(128);
  const magic = source.getBytes(4);
  if (magic[0] === 0x44 && magic[1] === 0x49 && magic[2] === 0x43 && magic[3] === 0x4d) {
    return preamble;
  }
  source.goTo(start);
  return null;
}

function inferFormat(preamble: Uint8Array | null, metaInfo: DicomDataset): DicomFileFormat {
  if (preamble) return DicomFileFormat.DICOM3;
  if (metaInfo.count > 0) return DicomFileFormat.DICOM3NoPreamble;
  return DicomFileFormat.DICOM3NoFileMetaInfo;
}

function inflateDeflated(bytes: Uint8Array): Uint8Array {
  try {
    return inflateRawSync(bytes);
  } catch {
    return inflateSync(bytes);
  }
}

function readRemainingFileBytes(source: FileByteSource): Uint8Array {
  const fileBytes = readFileSync(source.filePath);
  const start = Math.max(0, source.position);
  if (start >= fileBytes.length) return new Uint8Array(0);
  return new Uint8Array(fileBytes.buffer, fileBytes.byteOffset + start, fileBytes.length - start);
}

function withValidationSuppressed(dataset: DicomDataset, fn: () => void): void {
  const prev = dataset.validateItems;
  dataset.validateItems = false;
  try {
    fn();
  } finally {
    dataset.validateItems = prev;
  }
}
