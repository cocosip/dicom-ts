/**
 * DICOM file format marker.
 */
export enum DicomFileFormat {
  /** Parser unable to determine structure. */
  Unknown = "Unknown",
  /** Valid DICOM file containing preamble and file meta info. */
  DICOM3 = "DICOM3",
  /** DICOM file without preamble but with file meta info. */
  DICOM3NoPreamble = "DICOM3NoPreamble",
  /** DICOM file without preamble or file meta info. */
  DICOM3NoFileMetaInfo = "DICOM3NoFileMetaInfo",
  /** ACR-NEMA 1.0 */
  ACRNEMA1 = "ACRNEMA1",
  /** ACR-NEMA 2.0 */
  ACRNEMA2 = "ACRNEMA2",
}
