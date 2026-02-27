/**
 * DICOM dataset writer.
 *
 * Ported from fo-dicom/FO-DICOM.Core/IO/Writer/DicomWriter.cs
 */
import { DicomTag } from "../../core/DicomTag.js";
import { DicomVR } from "../../core/DicomVR.js";
import { DicomTransferSyntax, Endian } from "../../core/DicomTransferSyntax.js";
import * as DicomTags from "../../core/DicomTag.generated.js";
import { DicomDataset } from "../../dataset/DicomDataset.js";
import { DicomElement } from "../../dataset/DicomElement.js";
import { DicomSequence } from "../../dataset/DicomSequence.js";
import { DicomFragmentSequence } from "../../dataset/DicomFragmentSequence.js";
import { DicomDatasetWalker, IDicomDatasetWalker } from "../../dataset/DicomDatasetWalker.js";
import type { IByteTarget } from "../IByteTarget.js";
import type { IByteBuffer } from "../buffer/IByteBuffer.js";
import { EndianByteBuffer } from "../buffer/EndianByteBuffer.js";
import { SwapByteBuffer } from "../buffer/SwapByteBuffer.js";
import { LocalEndian } from "../buffer/byteSwap.js";
import { DicomWriteOptions } from "./DicomWriteOptions.js";
import { DicomWriteLengthCalculator } from "./DicomWriteLengthCalculator.js";

const UNDEFINED_LENGTH = 0xffffffff;
const CHUNK_SIZE = 64 * 1024;

export class DicomWriter implements IDicomDatasetWalker {
  syntax: DicomTransferSyntax;
  private readonly options: DicomWriteOptions;
  private readonly target: IByteTarget;
  private sequenceStack: DicomSequence[] = [];
  private datasetDepth = 0;

  constructor(
    syntax: DicomTransferSyntax,
    options: DicomWriteOptions | undefined,
    target: IByteTarget
  ) {
    this.syntax = syntax;
    this.options = options ?? DicomWriteOptions.Default;
    this.target = target;
  }

  static write(
    dataset: DicomDataset,
    target: IByteTarget,
    syntax: DicomTransferSyntax = DicomTransferSyntax.ExplicitVRLittleEndian,
    options?: DicomWriteOptions
  ): void {
    new DicomWriter(syntax, options, target).write(dataset);
  }

  write(dataset: DicomDataset): void {
    DicomDatasetWalker.walk(dataset, this);
  }

  onBeginDataset(_dataset: DicomDataset): void {
    if (this.datasetDepth === 0) {
      this.target.endian = this.syntax.endian;
      this.sequenceStack = [];
    }
    this.datasetDepth += 1;
  }

  onEndDataset(): void {
    this.datasetDepth = Math.max(0, this.datasetDepth - 1);
    if (this.datasetDepth === 0) {
      this.sequenceStack = [];
    }
  }

  onElement(element: DicomElement): void {
    if (!this.options.keepGroupLengths && element.tag.element === 0x0000) return;

    this.writeTagHeader(element.tag, element.valueRepresentation, element.length);

    let buffer: IByteBuffer = element.buffer;
    if (buffer instanceof EndianByteBuffer) {
      if (buffer.endian !== LocalEndian && buffer.endian === this.target.endian) {
        buffer = buffer.internal;
      }
    } else if (this.target.endian !== LocalEndian && element.valueRepresentation.unitSize > 1) {
      buffer = new SwapByteBuffer(buffer, element.valueRepresentation.unitSize);
    }

    this.writeBuffer(buffer);
  }

  onBeginSequence(sequence: DicomSequence): void {
    let length = UNDEFINED_LENGTH;
    if (this.options.explicitLengthSequences || sequence.tag.isPrivate) {
      const calc = new DicomWriteLengthCalculator(this.syntax, this.options);
      length = calc.calculateSequence(sequence);
    }
    this.sequenceStack.push(sequence);
    this.writeTagHeader(sequence.tag, DicomVR.SQ, length);
  }

  onBeginSequenceItem(dataset: DicomDataset): void {
    let length = UNDEFINED_LENGTH;
    if (this.options.explicitLengthSequenceItems) {
      const calc = new DicomWriteLengthCalculator(this.syntax, this.options);
      length = calc.calculateItems(dataset);
    }
    this.writeTagHeader(DicomTags.Item, DicomVR.NONE, length);
  }

  onEndSequenceItem(): void {
    if (!this.options.explicitLengthSequenceItems) {
      this.writeTagHeader(DicomTags.ItemDelimitationItem, DicomVR.NONE, 0);
    }
  }

  onEndSequence(): void {
    const sequence = this.sequenceStack.pop();
    if (!sequence) return;
    if (!this.options.explicitLengthSequences && !sequence.tag.isPrivate) {
      this.writeTagHeader(DicomTags.SequenceDelimitationItem, DicomVR.NONE, 0);
    }
  }

  onFragmentSequence(fragment: DicomFragmentSequence): void {
    this.writeTagHeader(fragment.tag, fragment.valueRepresentation, UNDEFINED_LENGTH);

    const offsetLength = fragment.offsetTable.length * 4;
    this.writeTagHeader(DicomTags.Item, DicomVR.NONE, offsetLength);
    for (const offset of fragment.offsetTable) {
      this.target.writeUInt32(offset >>> 0);
    }

    for (const item of fragment) {
      this.writeTagHeader(DicomTags.Item, DicomVR.NONE, item.size);
      let buffer: IByteBuffer = item;
      if (buffer instanceof EndianByteBuffer) {
        if (buffer.endian !== LocalEndian && buffer.endian === this.target.endian) {
          buffer = buffer.internal;
        }
      }
      this.writeBuffer(buffer);
    }

    this.writeTagHeader(DicomTags.SequenceDelimitationItem, DicomVR.NONE, 0);
  }

  private writeTagHeader(tag: DicomTag, vr: DicomVR, length: number): void {
    this.target.writeUInt16(tag.group);
    this.target.writeUInt16(tag.element);

    const len = length >>> 0;

    if (this.syntax.isExplicitVR && vr !== DicomVR.NONE) {
      let writeVr = vr;
      if (writeVr.is16bitLength && len > 0xfffe) {
        writeVr = DicomVR.UN;
      }

      this.target.writeUInt8(writeVr.code.charCodeAt(0));
      this.target.writeUInt8(writeVr.code.charCodeAt(1));

      if (writeVr.is16bitLength) {
        this.target.writeUInt16(len);
      } else {
        this.target.writeUInt16(0);
        this.target.writeUInt32(len);
      }
      return;
    }

    this.target.writeUInt32(len);
  }

  private writeBuffer(buffer: IByteBuffer): void {
    if (buffer.size === 0) return;
    if (buffer.isMemory) {
      this.target.writeBytes(buffer.data);
      return;
    }
    let offset = 0;
    while (offset < buffer.size) {
      const count = Math.min(CHUNK_SIZE, buffer.size - offset);
      const chunk = buffer.getByteRange(offset, count);
      this.target.writeBytes(chunk);
      offset += count;
    }
  }
}
