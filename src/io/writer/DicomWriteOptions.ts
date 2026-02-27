/**
 * Options controlling DICOM write behavior.
 *
 * Ported from fo-dicom/FO-DICOM.Core/IO/Writer/DicomWriteOptions.cs
 */
export class DicomWriteOptions {
  explicitLengthSequences: boolean;
  explicitLengthSequenceItems: boolean;
  keepGroupLengths: boolean;
  largeObjectSize: number;

  constructor(options?: DicomWriteOptions) {
    if (options) {
      this.explicitLengthSequences = options.explicitLengthSequences;
      this.explicitLengthSequenceItems = options.explicitLengthSequenceItems;
      this.keepGroupLengths = options.keepGroupLengths;
      this.largeObjectSize = options.largeObjectSize;
    } else {
      this.explicitLengthSequences = false;
      this.explicitLengthSequenceItems = false;
      this.keepGroupLengths = false;
      this.largeObjectSize = 1024 * 1024;
    }
  }

  private static _default: DicomWriteOptions | null = null;

  static get Default(): DicomWriteOptions {
    if (!this._default) this._default = new DicomWriteOptions();
    return this._default;
  }
}

