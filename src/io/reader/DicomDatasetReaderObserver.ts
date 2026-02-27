import { Endian } from "../../core/DicomTransferSyntax.js";
import * as DicomEncoding from "../../core/DicomEncoding.js";
import * as DicomTags from "../../core/DicomTag.generated.js";
import { DicomTag } from "../../core/DicomTag.js";
import { DicomVR } from "../../core/DicomVR.js";
import type { IByteSource } from "../IByteSource.js";
import type { IByteBuffer } from "../buffer/IByteBuffer.js";
import { EmptyBuffer } from "../buffer/EmptyBuffer.js";
import { SwapByteBuffer } from "../buffer/SwapByteBuffer.js";
import { DicomDataset } from "../../dataset/DicomDataset.js";
import { DicomSequence } from "../../dataset/DicomSequence.js";
import {
  DicomFragmentSequence,
  DicomOtherByteFragment,
  DicomOtherWordFragment,
} from "../../dataset/DicomFragmentSequence.js";
import { createElement } from "../../dataset/DicomElement.js";
import type { IDicomReaderObserver } from "./IDicomReaderObserver.js";

type SequenceContext =
  | { sequence: DicomFragmentSequence; isFragment: true }
  | { sequence: DicomSequence; isFragment: false };

/**
 * Builds a DicomDataset from DicomReader callbacks.
 */
export class DicomDatasetReaderObserver implements IDicomReaderObserver {
  readonly dataset: DicomDataset;

  private readonly datasetStack: DicomDataset[] = [];
  private readonly encodingStack: string[][] = [];
  private readonly sequenceStack: SequenceContext[] = [];

  constructor(dataset?: DicomDataset, fallbackEncodings: readonly string[] = []) {
    const root = dataset ?? new DicomDataset();
    if (fallbackEncodings.length > 0) {
      root.fallbackEncodings = [...fallbackEncodings];
    }
    this.dataset = root;
    this.datasetStack.push(root);
    this.encodingStack.push([...root.fallbackEncodings]);
  }

  onBeginSequence(_source: IByteSource, tag: DicomTag, _length: number): void {
    const isFragment = isPixelData(tag);
    let sequence: DicomSequence | DicomFragmentSequence;
    if (isFragment) {
      const bits = this.tryGetBitsAllocated();
      sequence = bits !== undefined && bits > 8
        ? new DicomOtherWordFragment(tag)
        : new DicomOtherByteFragment(tag);
    } else {
      sequence = new DicomSequence(tag);
    }
    this.currentDataset().addOrUpdate(sequence);
    this.sequenceStack.push(
      isFragment
        ? { sequence: sequence as DicomFragmentSequence, isFragment: true }
        : { sequence: sequence as DicomSequence, isFragment: false }
    );
  }

  onEndSequence(): void {
    this.sequenceStack.pop();
  }

  onBeginSequenceItem(source: IByteSource, length: number): void {
    const current = this.sequenceStack[this.sequenceStack.length - 1];
    if (!current) return;

    if (current.isFragment) {
      const buffer = this.readBuffer(source, length);
      if (buffer) current.sequence.addRaw(buffer);
    } else {
      const ds = new DicomDataset(this.currentDataset().internalTransferSyntax);
      ds.fallbackEncodings = [...this.currentEncodings()];
      (current.sequence as DicomSequence).items.push(ds);
      this.datasetStack.push(ds);
      this.encodingStack.push([...this.currentEncodings()]);
    }
  }

  onEndSequenceItem(): void {
    const current = this.sequenceStack[this.sequenceStack.length - 1];
    if (!current) return;
    if (!current.isFragment) {
      this.datasetStack.pop();
      this.encodingStack.pop();
    }
  }

  onBeginTag(source: IByteSource, tag: DicomTag, vr: DicomVR, length: number): void {
    const buffer = this.readBuffer(source, length);
    const encodings = this.currentEncodings();

    if (tag.equals(DicomTags.SpecificCharacterSet)) {
      const raw = DicomEncoding.decodeBytes(buffer?.data ?? new Uint8Array(0), []);
      const parts = raw.split("\\").map((v) => v.trim());
      const next = parts.length === 1 && parts[0] === "" ? [] : parts;
      this.encodingStack[this.encodingStack.length - 1] = next;
      this.currentDataset().fallbackEncodings = [...next];
    }

    const elementBuffer = this.prepareBuffer(vr, buffer ?? EmptyBuffer, tag);
    const element = createElement(vr, tag, elementBuffer, encodings);
    this.currentDataset().addOrUpdate(element);
  }

  onEndTag(): void {
    // no-op
  }

  private currentDataset(): DicomDataset {
    return this.datasetStack[this.datasetStack.length - 1]!;
  }

  private currentEncodings(): string[] {
    return this.encodingStack[this.encodingStack.length - 1] ?? [];
  }

  private readBuffer(source: IByteSource, length: number): IByteBuffer | null {
    if (length === 0) return EmptyBuffer;
    return source.getBuffer(length);
  }

  private prepareBuffer(vr: DicomVR, buffer: IByteBuffer, tag: DicomTag): IByteBuffer {
    const syntax = this.currentDataset().internalTransferSyntax;
    if (syntax.swapPixelData && isPixelData(tag)) {
      // GE private hack: pixel data is big-endian even though dataset is little-endian.
      return vr.byteSwap > 1 ? new SwapByteBuffer(buffer, vr.byteSwap) : buffer;
    }
    if (syntax.endian === Endian.Big && vr.byteSwap > 1) {
      return new SwapByteBuffer(buffer, vr.byteSwap);
    }
    return buffer;
  }

  private tryGetBitsAllocated(): number | undefined {
    try {
      const v = this.currentDataset().tryGetValue<number>(DicomTags.BitsAllocated, 0);
      return typeof v === "number" ? v : undefined;
    } catch {
      return undefined;
    }
  }
}

function isPixelData(tag: DicomTag): boolean {
  return tag.group === 0x7fe0 && tag.element === 0x0010;
}
