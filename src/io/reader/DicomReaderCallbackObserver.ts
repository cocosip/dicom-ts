import type { IByteSource } from "../IByteSource.js";
import type { DicomTag } from "../../core/DicomTag.js";
import type { DicomVR } from "../../core/DicomVR.js";
import type { IDicomReaderObserver } from "./IDicomReaderObserver.js";

export interface DicomReaderCallbacks {
  onBeginSequence?: (source: IByteSource, tag: DicomTag, length: number) => void;
  onEndSequence?: () => void;
  onBeginSequenceItem?: (source: IByteSource, length: number) => void;
  onEndSequenceItem?: () => void;
  onBeginTag?: (source: IByteSource, tag: DicomTag, vr: DicomVR, length: number) => void;
  onEndTag?: () => void;
}

/**
 * Adapter that forwards DicomReader events to callback functions.
 */
export class DicomReaderCallbackObserver implements IDicomReaderObserver {
  private readonly callbacks: DicomReaderCallbacks;

  constructor(callbacks: DicomReaderCallbacks) {
    this.callbacks = callbacks;
  }

  onBeginSequence(source: IByteSource, tag: DicomTag, length: number): void {
    this.callbacks.onBeginSequence?.(source, tag, length);
  }

  onEndSequence(): void {
    this.callbacks.onEndSequence?.();
  }

  onBeginSequenceItem(source: IByteSource, length: number): void {
    this.callbacks.onBeginSequenceItem?.(source, length);
  }

  onEndSequenceItem(): void {
    this.callbacks.onEndSequenceItem?.();
  }

  onBeginTag(source: IByteSource, tag: DicomTag, vr: DicomVR, length: number): void {
    this.callbacks.onBeginTag?.(source, tag, vr, length);
  }

  onEndTag(): void {
    this.callbacks.onEndTag?.();
  }
}
