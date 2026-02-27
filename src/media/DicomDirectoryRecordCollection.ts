/**
 * Iterable collection over linked DicomDirectoryRecord items.
 *
 * Ported from fo-dicom/FO-DICOM.Core/Media/DicomDirectoryRecordCollection.cs
 */
import { DicomDirectoryRecord } from "./DicomDirectoryRecord.js";

export class DicomDirectoryRecordCollection implements Iterable<DicomDirectoryRecord> {
  private readonly head: DicomDirectoryRecord | null;

  constructor(firstRecord: DicomDirectoryRecord | null) {
    this.head = firstRecord;
  }

  get count(): number {
    let total = 0;
    for (const _ of this) total += 1;
    return total;
  }

  *[Symbol.iterator](): Iterator<DicomDirectoryRecord> {
    let current = this.head;
    while (current) {
      yield current;
      current = current.nextDirectoryRecord;
    }
  }
}
