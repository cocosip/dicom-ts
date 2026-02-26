import type { IByteSource } from "../IByteSource.js";
import type { DicomTag } from "../../core/DicomTag.js";
import type { DicomVR } from "../../core/DicomVR.js";

/**
 * Observer interface for the binary DICOM reader.
 *
 * Callbacks are invoked as the reader walks the dataset stream.
 * The observer may consume value bytes directly from the source.
 */
export interface IDicomReaderObserver {
  onBeginSequence(source: IByteSource, tag: DicomTag, length: number): void;
  onEndSequence(): void;
  onBeginSequenceItem(source: IByteSource, length: number): void;
  onEndSequenceItem(): void;
  onBeginTag(source: IByteSource, tag: DicomTag, vr: DicomVR, length: number): void;
  onEndTag(): void;
}
