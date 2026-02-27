import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomElement, DicomOtherByte, DicomOtherDouble, DicomOtherFloat, DicomOtherWord } from "../dataset/DicomElement.js";
import { DicomFragmentSequence, DicomOtherByteFragment, DicomOtherWordFragment } from "../dataset/DicomFragmentSequence.js";
import { DicomTag } from "../core/DicomTag.js";
import * as Tags from "../core/DicomTag.generated.js";
import { CompositeByteBuffer } from "../io/buffer/CompositeByteBuffer.js";
import { MemoryByteBuffer } from "../io/buffer/MemoryByteBuffer.js";
import { RangeByteBuffer } from "../io/buffer/RangeByteBuffer.js";
import type { IByteBuffer } from "../io/buffer/IByteBuffer.js";
import { BitDepth } from "./BitDepth.js";
import { PhotometricInterpretation, parsePhotometricInterpretation } from "./PhotometricInterpretation.js";
import { PixelRepresentation, parsePixelRepresentation } from "./PixelRepresentation.js";
import { PlanarConfiguration, parsePlanarConfiguration } from "./PlanarConfiguration.js";

/**
 * Accessor for DICOM pixel data (compressed or uncompressed).
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/DicomPixelData.cs
 */
export class DicomPixelData {
  readonly dataset: DicomDataset;
  readonly photometricInterpretation: PhotometricInterpretation | null;
  readonly planarConfiguration: PlanarConfiguration;
  readonly pixelRepresentation: PixelRepresentation;
  readonly bitsAllocated: number;
  readonly bitsStored: number;
  readonly highBit: number;
  readonly samplesPerPixel: number;
  readonly rows: number;
  readonly columns: number;
  readonly numberOfFrames: number;
  readonly isEncapsulated: boolean;
  readonly isFloat: boolean;
  readonly pixelDataTag: DicomTag;
  private _frameCache: Map<number, IByteBuffer> | null = null;

  constructor(dataset: DicomDataset) {
    this.dataset = dataset;

    const floatTag = dataset.contains(Tags.FloatPixelData) ? Tags.FloatPixelData : null;
    const doubleTag = dataset.contains(Tags.DoubleFloatPixelData) ? Tags.DoubleFloatPixelData : null;
    if (floatTag) {
      this.pixelDataTag = floatTag;
      this.isFloat = true;
    } else if (doubleTag) {
      this.pixelDataTag = doubleTag;
      this.isFloat = true;
    } else {
      this.pixelDataTag = Tags.PixelData;
      this.isFloat = false;
    }

    this.bitsAllocated = dataset.getValueOrDefault<number>(Tags.BitsAllocated, 0, floatTag ? 32 : doubleTag ? 64 : 8);
    this.bitsStored = dataset.getValueOrDefault<number>(Tags.BitsStored, 0, this.bitsAllocated);
    this.highBit = dataset.getValueOrDefault<number>(Tags.HighBit, 0, this.bitsStored - 1);
    this.samplesPerPixel = dataset.getValueOrDefault<number>(Tags.SamplesPerPixel, 0, 1);
    this.rows = dataset.getValueOrDefault<number>(Tags.Rows, 0, 0);
    this.columns = dataset.getValueOrDefault<number>(Tags.Columns, 0, 0);
    this.pixelRepresentation = parsePixelRepresentation(
      dataset.getValueOrDefault<number>(Tags.PixelRepresentation, 0, 0)
    );
    this.planarConfiguration = parsePlanarConfiguration(
      dataset.getValueOrDefault<number>(Tags.PlanarConfiguration, 0, 0)
    );
    this.photometricInterpretation = parsePhotometricInterpretation(
      dataset.tryGetString(Tags.PhotometricInterpretation)
    );

    this.numberOfFrames = parseNumberOfFrames(dataset.tryGetValue<string>(Tags.NumberOfFrames));
    this.isEncapsulated = dataset.internalTransferSyntax.isEncapsulated
      || dataset.getDicomItem<DicomFragmentSequence>(this.pixelDataTag) instanceof DicomFragmentSequence;
  }

  static create(dataset: DicomDataset): DicomPixelData {
    return new DicomPixelData(dataset);
  }

  enableFrameCache(): void {
    if (!this._frameCache) this._frameCache = new Map();
  }

  clearFrameCache(): void {
    this._frameCache?.clear();
  }

  get bitDepth(): BitDepth {
    return new BitDepth(this.bitsAllocated, this.bitsStored, this.highBit, this.pixelRepresentation);
  }

  getFrame(index: number): IByteBuffer {
    const cached = this._frameCache?.get(index);
    if (cached) return cached;
    if (index < 0 || index >= this.numberOfFrames) {
      throw new RangeError(`Frame index ${index} out of range (count=${this.numberOfFrames})`);
    }
    const frame = this.isEncapsulated
      ? this.getEncapsulatedFrame(index)
      : this.getUncompressedFrame(index);
    this._frameCache?.set(index, frame);
    return frame;
  }

  addFrame(buffer: IByteBuffer): void {
    if (this.isEncapsulated) {
      const seq = this.getOrCreateFragmentSequence();
      seq.addRaw(buffer);
    } else {
      const element = this.getPixelDataElement();
      const existing = element ? element.buffer : new MemoryByteBuffer(new Uint8Array(0));
      const merged = new CompositeByteBuffer(existing, buffer);
      const combined = new MemoryByteBuffer(merged.data);
      const next = createPixelDataElement(this.pixelDataTag, combined, this.bitsAllocated);
      this.dataset.addOrUpdate(next);
    }
    this.clearFrameCache();
    const currentFrames = parseNumberOfFrames(this.dataset.tryGetValue<string>(Tags.NumberOfFrames));
    const nextFrames = currentFrames + 1;
    this.dataset.addOrUpdateValue(Tags.NumberOfFrames, String(nextFrames));
  }

  // -------------------------------------------------------------------------
  // Internal helpers
  // -------------------------------------------------------------------------

  private getUncompressedFrame(index: number): IByteBuffer {
    const element = this.getPixelDataElement();
    if (!element) throw new Error("Pixel data element not found");
    const buffer = element.buffer;
    const frameSize = this.getFrameSize();
    if (frameSize <= 0 || this.numberOfFrames <= 1) return buffer;
    const offset = index * frameSize;
    if (offset + frameSize > buffer.size) {
      throw new Error(`Frame ${index} exceeds pixel data length`);
    }
    return new RangeByteBuffer(buffer, offset, frameSize);
  }

  private getEncapsulatedFrame(index: number): IByteBuffer {
    const seq = this.getFragmentSequence();
    if (!seq) throw new Error("Encapsulated pixel data not found");
    if (seq.offsetTable.length > 0) {
      const composite = new CompositeByteBuffer(seq.fragments);
      const start = seq.offsetTable[index] ?? 0;
      const end = seq.offsetTable[index + 1] ?? composite.size;
      return new RangeByteBuffer(composite, start, Math.max(0, end - start));
    }
    if (seq.fragments.length === this.numberOfFrames) {
      return seq.fragments[index]!;
    }
    if (this.numberOfFrames <= 1) {
      return new CompositeByteBuffer(seq.fragments);
    }
    const fallback = seq.fragments[index];
    if (fallback) return fallback;
    throw new Error("Unable to map encapsulated fragments to frames");
  }

  private getFrameSize(): number {
    if (this.rows <= 0 || this.columns <= 0) return 0;
    const bytesPerSample = Math.max(1, Math.ceil(this.bitsAllocated / 8));
    return this.rows * this.columns * this.samplesPerPixel * bytesPerSample;
  }

  private getPixelDataElement(): DicomElement | null {
    const item = this.dataset.getDicomItem<DicomElement>(this.pixelDataTag);
    if (!item) return null;
    if (item instanceof DicomFragmentSequence) return null;
    return item;
  }

  private getFragmentSequence(): DicomFragmentSequence | null {
    const item = this.dataset.getDicomItem<DicomFragmentSequence>(this.pixelDataTag);
    return item instanceof DicomFragmentSequence ? item : null;
  }

  private getOrCreateFragmentSequence(): DicomFragmentSequence {
    const existing = this.getFragmentSequence();
    if (existing) return existing;
    const seq = this.bitsAllocated > 8
      ? new DicomOtherWordFragment(this.pixelDataTag)
      : new DicomOtherByteFragment(this.pixelDataTag);
    seq.addRaw(new MemoryByteBuffer(new Uint8Array(0)));
    this.dataset.addOrUpdate(seq);
    return seq;
  }
}

function parseNumberOfFrames(raw?: string): number {
  if (!raw) return 1;
  const parsed = parseInt(raw.trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function createPixelDataElement(tag: DicomTag, buffer: IByteBuffer, bitsAllocated: number): DicomElement {
  if (tag.equals(Tags.FloatPixelData)) return new DicomOtherFloat(tag, buffer);
  if (tag.equals(Tags.DoubleFloatPixelData)) return new DicomOtherDouble(tag, buffer);
  if (tag.equals(Tags.PixelData)) {
    if (bitsAllocated > 8) {
      return new DicomOtherWord(tag, buffer);
    }
    return new DicomOtherByte(tag, buffer);
  }
  return new DicomOtherByte(tag, buffer);
}
