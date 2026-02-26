import type { IByteSource } from "../IByteSource.js";
import type { DicomTag } from "../../core/DicomTag.js";
import type { DicomVR } from "../../core/DicomVR.js";

/**
 * Event arguments for DicomReader callbacks.
 */
export class DicomReaderEventArgs {
  readonly source: IByteSource;
  readonly tag: DicomTag | null;
  readonly vr: DicomVR | null;
  readonly length: number;

  constructor(source: IByteSource, tag: DicomTag | null = null, vr: DicomVR | null = null, length = 0) {
    this.source = source;
    this.tag = tag;
    this.vr = vr;
    this.length = length;
  }
}
