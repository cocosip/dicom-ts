import type { IByteSource } from "../IByteSource.js";
import type { DicomTransferSyntax } from "../../core/DicomTransferSyntax.js";
import type { DicomTag } from "../../core/DicomTag.js";
import type { IDicomReaderObserver } from "./IDicomReaderObserver.js";

export interface DicomReaderOptions {
  /** Transfer syntax used for the dataset. Defaults to Explicit VR Little Endian. */
  transferSyntax?: DicomTransferSyntax;
  /** Stop condition; returning true stops before the given tag. */
  stop?: (tag: DicomTag) => boolean;
}

/**
 * Binary DICOM reader interface.
 */
export interface IDicomReader {
  read(source: IByteSource, observer: IDicomReaderObserver, options?: DicomReaderOptions): void;
  readAsync(source: IByteSource, observer: IDicomReaderObserver, options?: DicomReaderOptions): Promise<void>;
}
