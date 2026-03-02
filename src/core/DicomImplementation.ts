/**
 * Implementation metadata for dicom-ts.
 *
 * Ported from fo-dicom/FO-DICOM.Core/DicomImplementation.cs
 */
import { DicomUID, DicomUidType } from "./DicomUID.js";

export class DicomImplementation {
  private static _classUID: DicomUID = new DicomUID(
    "1.3.6.1.4.1.30071.8",
    "Implementation Class UID",
    DicomUidType.Unknown,
  );
  private static _version: string = DicomImplementation.getImplementationVersion();

  static get ClassUID(): DicomUID {
    return this._classUID;
  }

  static set ClassUID(value: DicomUID) {
    this._classUID = value;
  }

  static get Version(): string {
    return this._version;
  }

  static set Version(value: string) {
    this._version = value;
  }

  private static getImplementationVersion(): string {
    return "dicom-ts 0.1.0";
  }
}
