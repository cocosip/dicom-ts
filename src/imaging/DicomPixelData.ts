import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomElement, DicomOtherByte, DicomOtherWord } from "../dataset/DicomElement.js";
import { DicomFragmentSequence, DicomOtherByteFragment, DicomOtherWordFragment } from "../dataset/DicomFragmentSequence.js";
import * as Tags from "../core/DicomTag.generated.js";
import { DicomTransferSyntax } from "../core/DicomTransferSyntax.js";
import { CompositeByteBuffer } from "../io/buffer/CompositeByteBuffer.js";
import { EndianByteBuffer } from "../io/buffer/EndianByteBuffer.js";
import { MemoryByteBuffer } from "../io/buffer/MemoryByteBuffer.js";
import { RangeByteBuffer } from "../io/buffer/RangeByteBuffer.js";
import { SwapByteBuffer } from "../io/buffer/SwapByteBuffer.js";
import type { IByteBuffer } from "../io/buffer/IByteBuffer.js";
import { BitDepth } from "./BitDepth.js";
import { Color32 } from "./Color32.js";
import { PhotometricInterpretation, parsePhotometricInterpretation } from "./PhotometricInterpretation.js";
import { PixelRepresentation, parsePixelRepresentation } from "./PixelRepresentation.js";
import { PlanarConfiguration, parsePlanarConfiguration } from "./PlanarConfiguration.js";

/**
 * DICOM Pixel Data abstract class for reading and writing DICOM image pixel data
 * according to the specified transfer syntax.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/DicomPixelData.cs
 */
export abstract class DicomPixelData {
  readonly dataset: DicomDataset;
  readonly syntax: DicomTransferSyntax;

  /** Whether pixel values are floating-point (TypeScript extension, not in fo-dicom base). */
  readonly isFloat: boolean = false;

  /** Frame cache (TypeScript extension used by DicomImage). */
  private _frameCache: Map<number, IByteBuffer> | null = null;

  protected constructor(dataset: DicomDataset) {
    this.dataset = dataset;
    this.syntax = dataset.internalTransferSyntax;
  }

  // ---------------------------------------------------------------------------
  // Mutable dataset properties
  // ---------------------------------------------------------------------------

  get width(): number {
    return this.dataset.getSingleValueOrDefault<number>(Tags.Columns, 0);
  }
  set width(v: number) {
    this.dataset.addOrUpdateValue(Tags.Columns, v);
  }

  /** Alias for width (maps to DICOM tag Columns). */
  get columns(): number { return this.width; }
  set columns(v: number) { this.width = v; }

  get height(): number {
    return this.dataset.getSingleValueOrDefault<number>(Tags.Rows, 0);
  }
  set height(v: number) {
    this.dataset.addOrUpdateValue(Tags.Rows, v);
  }

  /** Alias for height (maps to DICOM tag Rows). */
  get rows(): number { return this.height; }
  set rows(v: number) { this.height = v; }

  get numberOfFrames(): number {
    return parseNumberOfFrames(this.dataset.tryGetValue<string>(Tags.NumberOfFrames));
  }
  set numberOfFrames(v: number) {
    this.dataset.addOrUpdateValue(Tags.NumberOfFrames, String(v));
  }

  /** Number of bits allocated per pixel sample (0028,0100). Read-only. */
  get bitsAllocated(): number {
    return this.dataset.getSingleValueOrDefault<number>(Tags.BitsAllocated, 8);
  }

  get bitsStored(): number {
    return this.dataset.getSingleValueOrDefault<number>(Tags.BitsStored, this.bitsAllocated);
  }
  set bitsStored(v: number) {
    if (v > this.bitsAllocated) {
      throw new Error(`BitsStored ${v} > BitsAllocated ${this.bitsAllocated}`);
    }
    this.dataset.addOrUpdateValue(Tags.BitsStored, v);
  }

  get highBit(): number {
    return this.dataset.getSingleValueOrDefault<number>(Tags.HighBit, this.bitsStored - 1);
  }
  set highBit(v: number) {
    if (v >= this.bitsAllocated) {
      throw new Error(`HighBit ${v} >= BitsAllocated ${this.bitsAllocated}`);
    }
    this.dataset.addOrUpdateValue(Tags.HighBit, v);
  }

  get samplesPerPixel(): number {
    return this.dataset.getSingleValueOrDefault<number>(Tags.SamplesPerPixel, 1);
  }
  set samplesPerPixel(v: number) {
    this.dataset.addOrUpdateValue(Tags.SamplesPerPixel, v);
  }

  get pixelRepresentation(): PixelRepresentation {
    return parsePixelRepresentation(
      this.dataset.getSingleValueOrDefault<number>(Tags.PixelRepresentation, 0)
    );
  }
  set pixelRepresentation(v: PixelRepresentation) {
    this.dataset.addOrUpdateValue(Tags.PixelRepresentation, v as number);
  }

  get planarConfiguration(): PlanarConfiguration {
    return parsePlanarConfiguration(
      this.dataset.getSingleValueOrDefault<number>(Tags.PlanarConfiguration, 0)
    );
  }
  set planarConfiguration(v: PlanarConfiguration) {
    this.dataset.addOrUpdateValue(Tags.PlanarConfiguration, v as number);
  }

  get photometricInterpretation(): PhotometricInterpretation | null {
    return parsePhotometricInterpretation(
      this.dataset.tryGetString(Tags.PhotometricInterpretation)
    );
  }
  set photometricInterpretation(v: PhotometricInterpretation | null) {
    if (v !== null) {
      this.dataset.addOrUpdateValue(Tags.PhotometricInterpretation, v as string);
    }
  }

  // ---------------------------------------------------------------------------
  // Computed / derived properties
  // ---------------------------------------------------------------------------

  get bitDepth(): BitDepth {
    return new BitDepth(this.bitsAllocated, this.bitsStored, this.highBit, this.pixelRepresentation);
  }

  /** Number of bytes allocated per pixel sample. */
  get bytesAllocated(): number {
    return Math.floor((this.bitsAllocated - 1) / 8) + 1;
  }

  /**
   * Uncompressed frame size in bytes.
   * Handles special cases for 1-bit images and YBR chroma-subsampled formats.
   */
  get uncompressedFrameSize(): number {
    const ba = this.bitsAllocated;
    if (ba === 1) {
      return Math.floor((this.width * this.height - 1) / 8) + 1;
    }

    // Issue #471: handle special case with invalid uneven width for YBR_*_422 and YBR_PARTIAL_420
    let actualWidth = this.width;
    const pi = this.photometricInterpretation;
    if (
      actualWidth % 2 !== 0 &&
      (pi === PhotometricInterpretation.YBR_FULL_422 ||
        pi === PhotometricInterpretation.YBR_PARTIAL_422 ||
        pi === PhotometricInterpretation.YBR_PARTIAL_420)
    ) {
      actualWidth++;
    }

    // Issue #645: uncompressed YBR_FULL_422 chrominance channels are downsampled to 2
    if (pi === PhotometricInterpretation.YBR_FULL_422) {
      const s = this.syntax;
      if (
        s === DicomTransferSyntax.ExplicitVRBigEndian ||
        s === DicomTransferSyntax.ExplicitVRLittleEndian ||
        s === DicomTransferSyntax.ImplicitVRLittleEndian ||
        s === DicomTransferSyntax.ImplicitVRBigEndian
      ) {
        return this.bytesAllocated * 2 * actualWidth * this.height;
      }
    }

    return this.bytesAllocated * this.samplesPerPixel * actualWidth * this.height;
  }

  /** True if the image has been lossy-compressed (0028,2110 == "01"). */
  get isLossy(): boolean {
    return this.dataset.tryGetValue<string>(Tags.LossyImageCompression) === "01";
  }

  /** Lossy compression method (0028,2114), or undefined if absent. */
  get lossyCompressionMethod(): string | undefined {
    return this.dataset.tryGetValue<string>(Tags.LossyImageCompressionMethod);
  }

  /** Lossy compression ratio (0028,2112), or undefined if absent. */
  get lossyCompressionRatio(): number | undefined {
    return this.dataset.tryGetValue<number>(Tags.LossyImageCompressionRatio);
  }

  /**
   * Palette color LUT. Only valid when PhotometricInterpretation is PALETTE COLOR.
   * @throws if photometric interpretation is not PALETTE COLOR or LUT is missing.
   */
  get paletteColorLUT(): Color32[] {
    return getPaletteColorLUT(this.dataset);
  }

  /** Whether the pixel data is encapsulated (compressed). */
  get isEncapsulated(): boolean {
    return this.syntax.isEncapsulated;
  }

  // ---------------------------------------------------------------------------
  // Frame cache (TypeScript extension, used by DicomImage)
  // ---------------------------------------------------------------------------

  enableFrameCache(): void {
    if (!this._frameCache) this._frameCache = new Map();
  }

  clearFrameCache(): void {
    this._frameCache?.clear();
  }

  protected getCachedFrame(index: number): IByteBuffer | undefined {
    return this._frameCache?.get(index);
  }

  protected setCachedFrame(index: number, frame: IByteBuffer): void {
    this._frameCache?.set(index, frame);
  }

  // ---------------------------------------------------------------------------
  // Abstract interface
  // ---------------------------------------------------------------------------

  abstract getFrame(frame: number): IByteBuffer;
  abstract addFrame(data: IByteBuffer): void;

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Factory method that returns the appropriate concrete DicomPixelData subclass.
   *
   * @param dataset - Source DICOM dataset.
   * @param newPixelData - Pass `true` to create new (empty) pixel data in the dataset;
   *                       `false` (default) reads existing pixel data.
   */
  static create(dataset: DicomDataset, newPixelData = false): DicomPixelData {
    if (newPixelData) {
      const syntax = dataset.internalTransferSyntax;
      const bitsAllocated = dataset.getSingleValueOrDefault<number>(Tags.BitsAllocated, 8);

      if (syntax.isEncapsulated) {
        if (bitsAllocated > 16) {
          throw new Error(
            `Cannot represent pixel data with BitsAllocated: ${bitsAllocated} > 16`
          );
        }
        return new EncapsulatedPixelData(dataset, bitsAllocated);
      } else if (syntax === DicomTransferSyntax.ImplicitVRLittleEndian) {
        // DICOM 3.5 A.1 — implicit VR always uses OW
        return new OtherWordPixelData(dataset, true);
      } else {
        // DICOM 3.5 A.2 — explicit VR: OW for >8-bit, OB for 8-bit
        return bitsAllocated > 8
          ? new OtherWordPixelData(dataset, true)
          : new OtherBytePixelData(dataset, true);
      }
    }

    const item = dataset.getDicomItem<DicomElement>(Tags.PixelData);
    if (!item) {
      throw new Error("DICOM dataset is missing pixel data element.");
    }
    if (item instanceof DicomOtherByte) {
      return new OtherBytePixelData(dataset, false);
    }
    if (item instanceof DicomOtherWord) {
      return new OtherWordPixelData(dataset, false);
    }
    if (item instanceof DicomOtherByteFragment || item instanceof DicomOtherWordFragment) {
      return new EncapsulatedPixelData(dataset);
    }
    throw new Error(`Unexpected pixel data element type: ${item.constructor.name}`);
  }
}

// =============================================================================
// OtherBytePixelData — OB uncompressed pixel data
// =============================================================================

class OtherBytePixelData extends DicomPixelData {
  private readonly _element: DicomOtherByte;
  private readonly _paddingBuffer: IByteBuffer = new MemoryByteBuffer(new Uint8Array([0x00]));

  constructor(dataset: DicomDataset, newPixelData: boolean) {
    super(dataset);
    if (newPixelData) {
      this.numberOfFrames = 0;
      this._element = new DicomOtherByte(Tags.PixelData, new CompositeByteBuffer());
      dataset.addOrUpdate(this._element);
    } else {
      const el = dataset.getDicomItem<DicomOtherByte>(Tags.PixelData);
      if (!(el instanceof DicomOtherByte)) throw new Error("Expected DicomOtherByte pixel data element.");
      this._element = el;
    }
  }

  override getFrame(frame: number): IByteBuffer {
    const cached = this.getCachedFrame(frame);
    if (cached) return cached;
    if (frame < 0 || frame >= this.numberOfFrames) {
      throw new RangeError(`Frame index ${frame} out of range (count=${this.numberOfFrames})`);
    }
    const frameSize = this.uncompressedFrameSize;
    const offset = frameSize * frame;
    const result = new RangeByteBuffer(this._element.buffer, offset, frameSize);
    this.setCachedFrame(frame, result);
    return result;
  }

  override addFrame(data: IByteBuffer): void {
    const composite = this._element.buffer as CompositeByteBuffer;
    if (!(composite instanceof CompositeByteBuffer)) {
      throw new Error("Expected pixel data element to have a CompositeByteBuffer.");
    }
    // Remove trailing padding byte if present
    const last = composite.buffers[composite.buffers.length - 1];
    if (last === this._paddingBuffer) composite.buffers.pop();
    composite.buffers.push(data);
    // Re-add even-length padding if needed
    if (composite.size % 2 === 1) composite.buffers.push(this._paddingBuffer);
    this.numberOfFrames++;
    this.clearFrameCache();
  }
}

// =============================================================================
// OtherWordPixelData — OW uncompressed pixel data
// =============================================================================

class OtherWordPixelData extends DicomPixelData {
  private readonly _element: DicomOtherWord;
  private readonly _paddingBuffer: IByteBuffer = new MemoryByteBuffer(new Uint8Array([0x00]));

  constructor(dataset: DicomDataset, newPixelData: boolean) {
    super(dataset);
    if (newPixelData) {
      this.numberOfFrames = 0;
      this._element = new DicomOtherWord(Tags.PixelData, new CompositeByteBuffer());
      dataset.addOrUpdate(this._element);
    } else {
      const el = dataset.getDicomItem<DicomOtherWord>(Tags.PixelData);
      if (!(el instanceof DicomOtherWord)) throw new Error("Expected DicomOtherWord pixel data element.");
      this._element = el;
    }
  }

  override getFrame(frame: number): IByteBuffer {
    const cached = this.getCachedFrame(frame);
    if (cached) return cached;
    if (frame < 0 || frame >= this.numberOfFrames) {
      throw new RangeError(`Frame index ${frame} out of range (count=${this.numberOfFrames})`);
    }
    const frameSize = this.uncompressedFrameSize;
    const offset = frameSize * frame;
    let buffer: IByteBuffer = new RangeByteBuffer(this._element.buffer, offset, frameSize);
    // Mainly for GE Private Implicit VR Big Endian
    if (this.syntax.swapPixelData) {
      buffer = new SwapByteBuffer(buffer, 2);
    }
    this.setCachedFrame(frame, buffer);
    return buffer;
  }

  override addFrame(data: IByteBuffer): void {
    const composite = this._element.buffer as CompositeByteBuffer;
    if (!(composite instanceof CompositeByteBuffer)) {
      throw new Error("Expected pixel data element to have a CompositeByteBuffer.");
    }
    if (this.syntax.swapPixelData) {
      data = new SwapByteBuffer(data, 2);
    }
    // Remove trailing padding byte if present
    const last = composite.buffers[composite.buffers.length - 1];
    if (last === this._paddingBuffer) composite.buffers.pop();
    composite.buffers.push(data);
    // Re-add even-length padding if needed
    if (composite.size % 2 === 1) composite.buffers.push(this._paddingBuffer);
    this.numberOfFrames++;
    this.clearFrameCache();
  }
}

// =============================================================================
// EncapsulatedPixelData — OB/OW fragment sequence (compressed pixel data)
// =============================================================================

class EncapsulatedPixelData extends DicomPixelData {
  private readonly _element: DicomFragmentSequence;

  /** Create new, empty encapsulated pixel data. */
  constructor(dataset: DicomDataset, bitsAllocated: number);
  /** Read encapsulated pixel data from an existing dataset. */
  constructor(dataset: DicomDataset);
  constructor(dataset: DicomDataset, bitsAllocated?: number) {
    super(dataset);
    if (bitsAllocated !== undefined) {
      // New pixel data
      this.numberOfFrames = 0;
      this._element = bitsAllocated > 8
        ? new DicomOtherWordFragment(Tags.PixelData)
        : new DicomOtherByteFragment(Tags.PixelData);
      dataset.addOrUpdate(this._element);
    } else {
      // Read existing
      const el = dataset.getDicomItem<DicomFragmentSequence>(Tags.PixelData);
      if (!(el instanceof DicomFragmentSequence)) {
        throw new Error("Expected DicomFragmentSequence pixel data element.");
      }
      this._element = el;
    }
  }

  override getFrame(frame: number): IByteBuffer {
    const cached = this.getCachedFrame(frame);
    if (cached) return cached;
    if (frame < 0 || frame >= this.numberOfFrames) {
      throw new RangeError(`Frame index ${frame} out of range (count=${this.numberOfFrames})`);
    }

    const fragments = this._element.fragments;

    // GH-1586: ignore last fragment if it is empty
    while (fragments.length > 0 && fragments[fragments.length - 1]!.size === 0) {
      fragments.pop();
    }

    let buffer: IByteBuffer;

    if (this.numberOfFrames === 1) {
      buffer = fragments.length === 1
        ? fragments[0]!
        : new CompositeByteBuffer(fragments);
    } else if (fragments.length === this.numberOfFrames) {
      buffer = fragments[frame]!;
    } else if (this._element.offsetTable.length === this.numberOfFrames) {
      const start = this._element.offsetTable[frame]!;
      const stop =
        frame + 1 === this._element.offsetTable.length
          ? 0xffffffff
          : this._element.offsetTable[frame + 1]!;

      const composite = new CompositeByteBuffer();
      let pos = 0;
      let frag = 0;

      // Skip fragments before start (each fragment item occupies 8 header bytes + data)
      while (pos < start && frag < fragments.length) {
        pos += 8;
        pos += fragments[frag]!.size;
        frag++;
      }
      if (pos !== start) {
        throw new Error("Fragment start position does not match offset table.");
      }

      // Collect fragments belonging to this frame
      while (pos < stop && frag < fragments.length) {
        composite.buffers.push(fragments[frag]!);
        pos += 8;
        pos += fragments[frag]!.size;
        frag++;
      }
      if (pos < stop && stop !== 0xffffffff) {
        throw new Error("Image frame truncated while reading fragments from offset table.");
      }

      buffer = composite;
    } else {
      throw new Error(
        "Support for multi-frame images with varying fragment sizes and no offset table has not been implemented."
      );
    }

    // Mainly for GE Private Implicit VR Little Endian
    if (!this.syntax.isEncapsulated && this.bitsAllocated === 16 && this.syntax.swapPixelData) {
      buffer = new SwapByteBuffer(buffer, 2);
    }

    buffer = EndianByteBuffer.create(buffer, this.syntax.endian, this.bytesAllocated);
    this.setCachedFrame(frame, buffer);
    return buffer;
  }

  override addFrame(data: IByteBuffer): void {
    this.numberOfFrames++;

    // Calculate byte position for offset table entry
    let pos = 0;
    if (this._element.fragments.length > 0) {
      const lastOffset = this._element.offsetTable[this._element.offsetTable.length - 1] ?? 0;
      const lastFragSize = this._element.fragments[this._element.fragments.length - 1]!.size;
      pos = lastOffset + lastFragSize + 8;
    }

    if (pos < 0xffffffff) {
      this._element.offsetTable.push(pos);
    } else {
      // Do not create an offset table for very large datasets
      this._element.offsetTable.splice(0);
    }

    data = EndianByteBuffer.create(data, this.syntax.endian, this.bytesAllocated);
    this._element.fragments.push(data);
    this.clearFrameCache();
  }
}

// =============================================================================
// Module-level helpers
// =============================================================================

function parseNumberOfFrames(raw?: string): number {
  if (!raw) return 1;
  const parsed = parseInt(raw.trim(), 10);
  // Allow 0 (explicit "no frames yet" state used when building new pixel data).
  // Fall back to 1 only for absent/invalid values.
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 1;
}

function getPaletteColorLUT(dataset: DicomDataset): Color32[] {
  if (
    parsePhotometricInterpretation(dataset.tryGetString(Tags.PhotometricInterpretation)) !==
    PhotometricInterpretation.PALETTE_COLOR
  ) {
    throw new Error(
      "Attempted to get Palette Color LUT from image with invalid photometric interpretation."
    );
  }

  if (!dataset.contains(Tags.RedPaletteColorLookupTableDescriptor)) {
    throw new Error("Palette Color LUT missing from dataset.");
  }

  const size0 = dataset.getValueOrDefault<number>(Tags.RedPaletteColorLookupTableDescriptor, 0, 0);
  const bits = dataset.getValueOrDefault<number>(Tags.RedPaletteColorLookupTableDescriptor, 2, 8);
  const size = size0 === 0 ? 65536 : size0;

  const r = dataset.getValues<number>(Tags.RedPaletteColorLookupTableData);
  const g = dataset.getValues<number>(Tags.GreenPaletteColorLookupTableData);
  const b = dataset.getValues<number>(Tags.BluePaletteColorLookupTableData);

  const lut: Color32[] = new Array<Color32>(size);

  if (r.length === size) {
    // 8-bit LUT entries
    for (let i = 0; i < size; i++) {
      lut[i] = new Color32(r[i]!, g[i]!, b[i]!);
    }
  } else {
    // 16-bit LUT entries — extract high byte
    let offset = 0;
    if (bits === 16) offset = 1; // 16-bit entries with 8-bit stored
    for (let i = 0; i < size; i++, offset += 2) {
      lut[i] = new Color32(r[offset]!, g[offset]!, b[offset]!);
    }
  }

  return lut;
}
