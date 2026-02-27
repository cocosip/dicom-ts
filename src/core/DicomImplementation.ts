/**
 * Implementation metadata for dicom-ts.
 *
 * Ported from fo-dicom/FO-DICOM.Core/DicomImplementation.cs
 */
import { DicomUID, DicomUidType } from "./DicomUID.js";

export class DicomImplementation {
  static ClassUID: DicomUID = new DicomUID(
    "1.3.6.1.4.1.30071.8",
    "Implementation Class UID",
    DicomUidType.Unknown
  );

  static Version: string = "dicom-ts 0.0.0";
}
