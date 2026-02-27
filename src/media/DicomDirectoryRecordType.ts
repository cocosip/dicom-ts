/**
 * Directory record type definition for DICOMDIR entries.
 *
 * Ported from fo-dicom/FO-DICOM.Core/Media/DicomDirectoryRecordType.cs
 */
import { DicomTag } from "../core/DicomTag.js";
import * as DicomTags from "../core/DicomTag.generated.js";

export class DicomDirectoryRecordType {
  private readonly recordName: string;
  readonly tags: Set<DicomTag> = new Set();

  static readonly Patient = new DicomDirectoryRecordType("PATIENT");
  static readonly Study = new DicomDirectoryRecordType("STUDY");
  static readonly Series = new DicomDirectoryRecordType("SERIES");
  static readonly Image = new DicomDirectoryRecordType("IMAGE");
  static readonly Report = new DicomDirectoryRecordType("SR DOCUMENT");
  static readonly PresentationState = new DicomDirectoryRecordType("PRESENTATION");

  constructor(recordName: string) {
    this.recordName = recordName;

    switch (recordName) {
      case "PATIENT":
        this.tags.add(DicomTags.PatientID);
        this.tags.add(DicomTags.PatientName);
        this.tags.add(DicomTags.PatientBirthDate);
        this.tags.add(DicomTags.PatientSex);
        break;
      case "STUDY":
        this.tags.add(DicomTags.StudyInstanceUID);
        this.tags.add(DicomTags.StudyID);
        this.tags.add(DicomTags.StudyDate);
        this.tags.add(DicomTags.StudyTime);
        this.tags.add(DicomTags.AccessionNumber);
        this.tags.add(DicomTags.StudyDescription);
        break;
      case "SERIES":
        this.tags.add(DicomTags.SeriesInstanceUID);
        this.tags.add(DicomTags.Modality);
        this.tags.add(DicomTags.SeriesDate);
        this.tags.add(DicomTags.SeriesTime);
        this.tags.add(DicomTags.SeriesNumber);
        this.tags.add(DicomTags.SeriesDescription);
        break;
      case "IMAGE":
        this.tags.add(DicomTags.InstanceNumber);
        break;
      case "SR DOCUMENT":
        this.tags.add(DicomTags.InstanceNumber);
        this.tags.add(DicomTags.CompletionFlag);
        this.tags.add(DicomTags.VerificationFlag);
        this.tags.add(DicomTags.ContentDate);
        this.tags.add(DicomTags.ContentTime);
        this.tags.add(DicomTags.VerificationDateTime);
        this.tags.add(DicomTags.ConceptNameCodeSequence);
        break;
      case "PRESENTATION":
        this.tags.add(DicomTags.InstanceNumber);
        this.tags.add(DicomTags.PresentationCreationDate);
        this.tags.add(DicomTags.PresentationCreationTime);
        this.tags.add(DicomTags.ReferencedSeriesSequence);
        break;
      default:
        break;
    }
  }

  toString(): string {
    return this.recordName;
  }
}
