import { DicomTag } from "../../core/DicomTag.js";
import { DicomVR } from "../../core/DicomVR.js";
import { DicomDictionary } from "../../core/DicomDictionary.js";
import { DicomTransferSyntax } from "../../core/DicomTransferSyntax.js";
import { Endian } from "../../core/DicomTransferSyntax.js";
import * as DicomTags from "../../core/DicomTag.generated.js";
import type { IByteSource } from "../IByteSource.js";
import type { DicomReaderOptions, IDicomReader } from "./IDicomReader.js";
import type { IDicomReaderObserver } from "./IDicomReaderObserver.js";

const UNDEFINED_LENGTH = 0xffffffff;

type ReadResult = "ok" | "stop" | "item-end" | "sequence-end";

/**
 * Binary DICOM reader (dataset-level).
 */
export class DicomReader implements IDicomReader {
  read(source: IByteSource, observer: IDicomReaderObserver, options: DicomReaderOptions = {}): void {
    const syntax = options.transferSyntax ?? DicomTransferSyntax.ExplicitVRLittleEndian;
    source.endian = syntax.endian;
    this.readDataset(source, observer, syntax, options, undefined, true);
  }

  async readAsync(source: IByteSource, observer: IDicomReaderObserver, options: DicomReaderOptions = {}): Promise<void> {
    this.read(source, observer, options);
  }

  static read(source: IByteSource, observer: IDicomReaderObserver, options: DicomReaderOptions = {}): void {
    new DicomReader().read(source, observer, options);
  }

  private readDataset(
    source: IByteSource,
    observer: IDicomReaderObserver,
    syntax: DicomTransferSyntax,
    options: DicomReaderOptions,
    limitPosition?: number,
    allowItemDelimiter = false,
  ): ReadResult {
    while (!source.isEOF) {
      if (limitPosition !== undefined && source.position >= limitPosition) {
        return "ok";
      }

      const tagPos = source.position;
      const tag = this.readTag(source);

      if (allowItemDelimiter && isItemDelimitation(tag)) {
        const _len = source.getUInt32();
        return "item-end";
      }

      if (isSequenceDelimitation(tag)) {
        const _len = source.getUInt32();
        return "sequence-end";
      }

      if (options.stop?.(tag)) {
        source.goTo(tagPos);
        return "stop";
      }

      const elementResult = this.readElement(source, observer, syntax, options, tag);
      if (elementResult !== "ok") return elementResult;
    }
    return "ok";
  }

  private readElement(
    source: IByteSource,
    observer: IDicomReaderObserver,
    syntax: DicomTransferSyntax,
    options: DicomReaderOptions,
    tag: DicomTag
  ): ReadResult {
    if (isItem(tag) || isItemDelimitation(tag) || isSequenceDelimitation(tag)) {
      return "ok";
    }

    const { vr, length } = this.readVRAndLength(source, tag, syntax);

    if (length === UNDEFINED_LENGTH) {
      const isSequence = vr === DicomVR.SQ;
      const isFragment = !isSequence;
      return this.readSequence(source, observer, syntax, options, tag, length, isFragment);
    }

    if (vr === DicomVR.SQ) {
      return this.readSequence(source, observer, syntax, options, tag, length, false);
    }

    const valueStart = source.position;
    observer.onBeginTag(source, tag, vr, length);
    const consumed = source.position - valueStart;
    if (consumed < length) {
      source.skip(length - consumed);
    } else if (consumed > length) {
      throw new Error(`Observer consumed ${consumed} bytes for ${tag}; expected ${length}.`);
    }
    observer.onEndTag();
    return "ok";
  }

  private readSequence(
    source: IByteSource,
    observer: IDicomReaderObserver,
    syntax: DicomTransferSyntax,
    options: DicomReaderOptions,
    tag: DicomTag,
    length: number,
    isFragment: boolean,
  ): ReadResult {
    observer.onBeginSequence(source, tag, length);

    const start = source.position;
    const end = length === UNDEFINED_LENGTH ? undefined : start + length;

    while (!source.isEOF) {
      if (end !== undefined && source.position >= end) break;

      const itemTag = this.readTag(source);
      if (isSequenceDelimitation(itemTag)) {
        const _len = source.getUInt32();
        break;
      }
      if (!isItem(itemTag)) {
        // Unexpected tag inside sequence; stop parsing this sequence.
        break;
      }

      const itemLength = source.getUInt32();
      const itemStart = source.position;
      observer.onBeginSequenceItem(source, itemLength);

      if (isFragment) {
        if (itemLength === UNDEFINED_LENGTH) {
          const result = this.readDataset(source, observer, syntax, options, undefined, true);
          if (result === "stop") return "stop";
        } else {
          const consumed = source.position - itemStart;
          if (consumed < itemLength) {
            source.skip(itemLength - consumed);
          } else if (consumed > itemLength) {
            throw new Error(`Observer consumed ${consumed} bytes for item; expected ${itemLength}.`);
          }
        }
        observer.onEndSequenceItem();
        continue;
      }

      if (itemLength === UNDEFINED_LENGTH) {
        const result = this.readDataset(source, observer, syntax, options, undefined, true);
        if (result === "stop") return "stop";
        if (result === "sequence-end") {
          observer.onEndSequenceItem();
          break;
        }
      } else {
        const itemEnd = source.position + itemLength;
        const result = this.readDataset(source, observer, syntax, options, itemEnd, false);
        if (result === "stop") return "stop";
        if (source.position < itemEnd) source.skip(itemEnd - source.position);
      }

      observer.onEndSequenceItem();
    }

    if (end !== undefined && source.position < end) {
      source.skip(end - source.position);
    }

    observer.onEndSequence();
    return "ok";
  }

  private readTag(source: IByteSource): DicomTag {
    const group = source.getUInt16();
    const element = source.getUInt16();
    return new DicomTag(group, element);
  }

  private readVRAndLength(
    source: IByteSource,
    tag: DicomTag,
    syntax: DicomTransferSyntax
  ): { vr: DicomVR; length: number } {
    if (!syntax.isExplicitVR) {
      const vr = DicomDictionary.default.lookup(tag).vr;
      const length = source.getUInt32();
      return { vr, length };
    }

    const b0 = source.getUInt8();
    const b1 = source.getUInt8();
    const parsed = DicomVR.tryParseBytes(b0, b1);
    if (!parsed) {
      // Implicit VR fallback: treat the two bytes as part of a 32-bit length.
      const b2 = source.getUInt8();
      const b3 = source.getUInt8();
      const length = uint32FromBytes(b0, b1, b2, b3, source.endian);
      const vr = DicomDictionary.default.lookup(tag).vr;
      return { vr, length };
    }

    const vr = parsed;
    if (vr.is16bitLength) {
      const length = source.getUInt16();
      return { vr, length };
    }

    source.skip(2); // reserved
    const length = source.getUInt32();
    return { vr, length };
  }
}

function uint32FromBytes(b0: number, b1: number, b2: number, b3: number, endian: Endian): number {
  if (endian === Endian.Little) {
    return (b0 | (b1 << 8) | (b2 << 16) | (b3 << 24)) >>> 0;
  }
  return (b3 | (b2 << 8) | (b1 << 16) | (b0 << 24)) >>> 0;
}

function isItem(tag: DicomTag): boolean {
  return tag.group === DicomTags.Item.group && tag.element === DicomTags.Item.element;
}

function isItemDelimitation(tag: DicomTag): boolean {
  return tag.group === DicomTags.ItemDelimitationItem.group
    && tag.element === DicomTags.ItemDelimitationItem.element;
}

function isSequenceDelimitation(tag: DicomTag): boolean {
  return tag.group === DicomTags.SequenceDelimitationItem.group
    && tag.element === DicomTags.SequenceDelimitationItem.element;
}
