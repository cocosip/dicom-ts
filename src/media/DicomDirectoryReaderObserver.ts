/**
 * Observer that collects directory record offsets while reading a DICOMDIR.
 *
 * Ported from fo-dicom/FO-DICOM.Core/Media/DicomDirectoryReaderObserver.cs
 */
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomSequence } from "../dataset/DicomSequence.js";
import { DicomDirectoryRecord } from "./DicomDirectoryRecord.js";
import type { IByteSource } from "../io/IByteSource.js";
import type { DicomTag } from "../core/DicomTag.js";
import type { DicomVR } from "../core/DicomVR.js";
import type { IDicomReaderObserver } from "../io/reader/IDicomReaderObserver.js";
import * as DicomTags from "../core/DicomTag.generated.js";

export class DicomDirectoryReaderObserver implements IDicomReaderObserver {
  private directoryRecordSequence: DicomSequence | null = null;
  private readonly currentSequenceTag: DicomTag[] = [];
  private readonly lookup = new Map<number, DicomDataset>();
  private readonly dataset: DicomDataset;

  constructor(dataset: DicomDataset) {
    this.dataset = dataset;
  }

  buildDirectoryRecords(): DicomDirectoryRecord | null {
    const notFoundOffsets: number[] = [];
    const offset = this.dataset.getSingleValueOrDefault<number>(
      DicomTags.OffsetOfTheFirstDirectoryRecordOfTheRootDirectoryEntity,
      0
    );
    let root = this.parseDirectoryRecord(offset, notFoundOffsets);

    if (this.lookup.size > 0 && (notFoundOffsets.length > 0 || root === null)) {
      root = this.parseDirectoryRecordNotExact(root, offset);
    }

    return root;
  }

  private parseDirectoryRecord(offset: number, notFoundOffsets: number[]): DicomDirectoryRecord | null {
    if (offset === 0) return null;

    const dataset = this.lookup.get(offset);
    if (!dataset) {
      if (offset !== 0) notFoundOffsets.push(offset);
      return null;
    }

    const record = new DicomDirectoryRecord(dataset);
    record.offset = offset >>> 0;
    this.lookup.delete(offset);

    record.nextDirectoryRecord = this.parseDirectoryRecord(
      record.getSingleValueOrDefault<number>(DicomTags.OffsetOfTheNextDirectoryRecord, 0),
      notFoundOffsets
    );

    record.lowerLevelDirectoryRecord = this.parseDirectoryRecord(
      record.getSingleValueOrDefault<number>(DicomTags.OffsetOfReferencedLowerLevelDirectoryEntity, 0),
      notFoundOffsets
    );

    return record;
  }

  private parseDirectoryRecordNotExact(record: DicomDirectoryRecord | null, offset: number): DicomDirectoryRecord | null {
    if (record === null) {
      if (this.lookup.size === 0) return null;
      let bestOffset: number | null = null;
      let bestDistance = Number.MAX_SAFE_INTEGER;

      for (const key of this.lookup.keys()) {
        const distance = Math.abs(key - offset);
        if (bestOffset === null || distance < bestDistance) {
          bestOffset = key;
          bestDistance = distance;
        }
      }

      const chosen = bestOffset ?? this.lookup.keys().next().value;
      if (chosen === undefined) return null;

      const dataset = this.lookup.get(chosen);
      if (!dataset) return null;

      record = new DicomDirectoryRecord(dataset);
      record.offset = chosen >>> 0;
      this.lookup.delete(chosen);
    }

    const nextOffset = record.getSingleValueOrDefault<number>(DicomTags.OffsetOfTheNextDirectoryRecord, 0);
    if (nextOffset > 0) {
      record.nextDirectoryRecord = this.parseDirectoryRecordNotExact(record.nextDirectoryRecord, nextOffset);
    }

    const lowerOffset = record.getSingleValueOrDefault<number>(DicomTags.OffsetOfReferencedLowerLevelDirectoryEntity, 0);
    if (lowerOffset > 0) {
      record.lowerLevelDirectoryRecord = this.parseDirectoryRecordNotExact(record.lowerLevelDirectoryRecord, lowerOffset);
    }

    return record;
  }

  onBeginSequence(_source: IByteSource, tag: DicomTag, _length: number): void {
    this.currentSequenceTag.push(tag);
    if (tag.equals(DicomTags.DirectoryRecordSequence)) {
      this.directoryRecordSequence = this.dataset.getDicomItem<DicomSequence>(tag);
    }
  }

  onEndSequence(): void {
    this.currentSequenceTag.pop();
  }

  onBeginSequenceItem(source: IByteSource, _length: number): void {
    const current = this.currentSequenceTag[this.currentSequenceTag.length - 1];
    if (!current) return;
    if (current.equals(DicomTags.DirectoryRecordSequence) && this.directoryRecordSequence) {
      const items = this.directoryRecordSequence.items;
      const last = items[items.length - 1];
      if (last) {
        this.lookup.set(source.position - 8, last);
      }
    }
  }

  onEndSequenceItem(): void {
    // no-op
  }

  onBeginTag(_source: IByteSource, _tag: DicomTag, _vr: DicomVR, _length: number): void {
    // no-op
  }

  onEndTag(): void {
    // no-op
  }
}
