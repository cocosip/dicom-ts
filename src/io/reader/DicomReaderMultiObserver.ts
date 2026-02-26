import type { IByteSource } from "../IByteSource.js";
import type { DicomTag } from "../../core/DicomTag.js";
import type { DicomVR } from "../../core/DicomVR.js";
import type { IDicomReaderObserver } from "./IDicomReaderObserver.js";

/**
 * Observer that forwards events to multiple observers.
 */
export class DicomReaderMultiObserver implements IDicomReaderObserver {
  private readonly observers: IDicomReaderObserver[];

  constructor(observers: Iterable<IDicomReaderObserver>) {
    this.observers = [...observers];
  }

  onBeginSequence(source: IByteSource, tag: DicomTag, length: number): void {
    for (const obs of this.observers) obs.onBeginSequence(source, tag, length);
  }

  onEndSequence(): void {
    for (const obs of this.observers) obs.onEndSequence();
  }

  onBeginSequenceItem(source: IByteSource, length: number): void {
    for (const obs of this.observers) obs.onBeginSequenceItem(source, length);
  }

  onEndSequenceItem(): void {
    for (const obs of this.observers) obs.onEndSequenceItem();
  }

  onBeginTag(source: IByteSource, tag: DicomTag, vr: DicomVR, length: number): void {
    for (const obs of this.observers) obs.onBeginTag(source, tag, vr, length);
  }

  onEndTag(): void {
    for (const obs of this.observers) obs.onEndTag();
  }
}
