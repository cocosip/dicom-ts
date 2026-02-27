/**
 * Container for directory records across different levels.
 *
 * Ported from fo-dicom/FO-DICOM.Core/Media/DicomDirectory.cs (DicomDirectoryEntry)
 */
import { DicomDirectoryRecord } from "./DicomDirectoryRecord.js";

export class DicomDirectoryEntry {
  patientRecord: DicomDirectoryRecord;
  studyRecord: DicomDirectoryRecord;
  seriesRecord: DicomDirectoryRecord;
  instanceRecord: DicomDirectoryRecord;

  constructor(args: {
    patientRecord: DicomDirectoryRecord;
    studyRecord: DicomDirectoryRecord;
    seriesRecord: DicomDirectoryRecord;
    instanceRecord: DicomDirectoryRecord;
  }) {
    this.patientRecord = args.patientRecord;
    this.studyRecord = args.studyRecord;
    this.seriesRecord = args.seriesRecord;
    this.instanceRecord = args.instanceRecord;
  }
}
