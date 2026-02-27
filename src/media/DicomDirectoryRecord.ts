/**
 * Directory record item for DICOMDIR.
 *
 * Ported from fo-dicom/FO-DICOM.Core/Media/DicomDirectoryRecord.cs
 */
import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomItem } from "../dataset/DicomItem.js";
import * as DicomTags from "../core/DicomTag.generated.js";
import { DicomDirectoryRecordCollection } from "./DicomDirectoryRecordCollection.js";

export class DicomDirectoryRecord extends DicomDataset {
  lowerLevelDirectoryRecord: DicomDirectoryRecord | null = null;
  nextDirectoryRecord: DicomDirectoryRecord | null = null;
  offset: number = 0;
  key: string = "";

  constructor();
  constructor(dataset: DicomDataset);
  constructor(items: Iterable<DicomItem>, validateItems?: boolean);
  constructor(arg?: DicomDataset | Iterable<DicomItem>, validateItems?: boolean) {
    const isDataset = arg instanceof DicomDataset;
    super(arg as any);
    if (isDataset) {
      const dataset = arg as DicomDataset;
      this.internalTransferSyntax = dataset.internalTransferSyntax;
      this.fallbackEncodings = [...dataset.fallbackEncodings];
      this.validateItems = dataset.validateItems;
    } else if (arg) {
      if (validateItems !== undefined) {
        this.validateItems = validateItems;
      }
    }
  }

  get lowerLevelDirectoryRecordCollection(): DicomDirectoryRecordCollection {
    return new DicomDirectoryRecordCollection(this.lowerLevelDirectoryRecord);
  }

  get directoryRecordType(): string {
    return this.getSingleValue<string>(DicomTags.DirectoryRecordType);
  }

  override toString(): string {
    const count = this.lowerLevelDirectoryRecordCollection.count;
    return `Directory Record Type: ${this.directoryRecordType}, Lower level items: ${count}`;
  }
}
