import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomElement, DicomOtherWord } from "../dataset/DicomElement.js";
import { DicomTag } from "../core/DicomTag.js";
import { DicomVR } from "../core/DicomVR.js";
import { MemoryByteBuffer } from "../io/buffer/MemoryByteBuffer.js";
import type { IByteBuffer } from "../io/buffer/IByteBuffer.js";
import { Color32 } from "./Color32.js";
import { RawImage } from "./RawImage.js";
import { DicomPixelData } from "./DicomPixelData.js";

export enum DicomOverlayType {
  Graphics = "Graphics",
  ROI = "ROI",
}

/**
 * Overlay plane data (60xx group).
 */
export class DicomOverlayData {
  readonly dataset: DicomDataset;
  readonly group: number;

  constructor(dataset: DicomDataset, group: number) {
    this.dataset = dataset;
    this.group = group;
  }

  // -------------------------------------------------------------------------
  // Core properties (matching fo-dicom semantics)
  // -------------------------------------------------------------------------

  get rows(): number {
    return this.dataset.getSingleValue<number>(this.overlayTag(0x0010));
  }
  set rows(value: number) {
    this.dataset.addOrUpdateElement(DicomVR.US, this.overlayTag(0x0010), value);
  }

  get columns(): number {
    return this.dataset.getSingleValue<number>(this.overlayTag(0x0011));
  }
  set columns(value: number) {
    this.dataset.addOrUpdateElement(DicomVR.US, this.overlayTag(0x0011), value);
  }

  get type(): DicomOverlayType {
    const raw = this.dataset.getSingleValue<string>(this.overlayTag(0x0040));
    if (raw.startsWith("R")) return DicomOverlayType.ROI;
    if (raw.startsWith("G")) return DicomOverlayType.Graphics;
    throw new Error(`Unsupported overlay type: ${raw}`);
  }
  set type(value: DicomOverlayType) {
    const code = value.toString().substring(0, 1).toUpperCase();
    this.dataset.addOrUpdateElement(DicomVR.CS, this.overlayTag(0x0040), code);
  }

  get bitsAllocated(): number {
    return this.dataset.getValueOrDefault<number>(this.overlayTag(0x0100), 0, 1);
  }
  set bitsAllocated(value: number) {
    this.dataset.addOrUpdateElement(DicomVR.US, this.overlayTag(0x0100), value);
  }

  get bitPosition(): number {
    return this.dataset.getValueOrDefault<number>(this.overlayTag(0x0102), 0, 0);
  }
  set bitPosition(value: number) {
    this.dataset.addOrUpdateElement(DicomVR.US, this.overlayTag(0x0102), value);
  }

  get description(): string {
    return this.dataset.getSingleValueOrDefault<string>(this.overlayTag(0x0022), "");
  }
  set description(value: string) {
    this.dataset.addOrUpdateElement(DicomVR.LO, this.overlayTag(0x0022), value);
  }

  get subtype(): string {
    return this.dataset.getSingleValueOrDefault<string>(this.overlayTag(0x0045), "");
  }
  set subtype(value: string) {
    this.dataset.addOrUpdateElement(DicomVR.LO, this.overlayTag(0x0045), value);
  }

  get label(): string {
    return this.dataset.getSingleValueOrDefault<string>(this.overlayTag(0x1500), "");
  }
  set label(value: string) {
    this.dataset.addOrUpdateElement(DicomVR.LO, this.overlayTag(0x1500), value);
  }

  get numberOfFrames(): number {
    return this.dataset.getValueOrDefault<number>(this.overlayTag(0x0015), 0, 1);
  }
  set numberOfFrames(value: number) {
    this.dataset.addOrUpdateElement(DicomVR.IS, this.overlayTag(0x0015), value);
  }

  // Image Frame Origin (60xx,0051)
  get originFrame(): number {
    return this.dataset.getValueOrDefault<number>(this.overlayTag(0x0051), 0, 1);
  }
  set originFrame(value: number) {
    this.dataset.addOrUpdateElement(DicomVR.US, this.overlayTag(0x0051), value);
  }

  get originX(): number {
    return this.dataset.getValueOrDefault<number>(this.overlayTag(0x0050), 1, 1);
  }
  set originX(value: number) {
    const y = this.originY;
    this.dataset.addOrUpdateElement(DicomVR.SS, this.overlayTag(0x0050), y, value);
  }

  get originY(): number {
    return this.dataset.getValueOrDefault<number>(this.overlayTag(0x0050), 0, 1);
  }
  set originY(value: number) {
    const x = this.originX;
    this.dataset.addOrUpdateElement(DicomVR.SS, this.overlayTag(0x0050), value, x);
  }

  get bitsGrouped(): number {
    return this.dataset.getValueOrDefault<number>(this.overlayTag(0x0069), 0, 8);
  }

  get activationLayer(): string {
    return this.dataset.getSingleValueOrDefault<string>(this.overlayTag(0x1001), "");
  }

  get preferredColor(): Color32 | null {
    return readOverlayColor(this.dataset, this.group);
  }

  get data(): IByteBuffer {
    return this.load();
  }
  set data(value: IByteBuffer) {
    this.dataset.addOrUpdate(new DicomOtherWord(this.overlayTag(0x3000), value));
  }

  get hasData(): boolean {
    return this.dataset.contains(this.overlayTag(0x3000)) || this.hasEmbeddedOverlay;
  }

  get hasEmbeddedOverlay(): boolean {
    return !this.dataset.contains(this.overlayTag(0x3000)) && this.dataset.contains(this.overlayTag(0x0102));
  }

  // -------------------------------------------------------------------------
  // Public helpers
  // -------------------------------------------------------------------------

  getMask(frame: number = 0): Uint8Array {
    const count = this.rows * this.columns;
    const out = new Uint8Array(count);
    if (!this.hasData) return out;

    const overlayFrame = this.resolveFrameIndex(frame);
    if (overlayFrame < 0) return out;

    if (this.dataset.contains(this.overlayTag(0x3000))) {
      const bytes = this.getOverlayFrameBytes(this.data.data, overlayFrame);
      if (this.bitsAllocated === 1) {
        return extractPackedMask(bytes, count, this.bitsGrouped);
      }
      return extractSampleMask(bytes, count, this.bitsAllocated, this.bitPosition);
    }

    return extractEmbeddedMask(this, this.dataset);
  }

  getMaskForImage(imageRows: number, imageColumns: number, frame: number = 0): Uint8Array {
    const out = new Uint8Array(imageRows * imageColumns);
    if (!this.hasData) return out;
    const mask = this.getMask(frame);
    const rowOffset = this.originY - 1;
    const colOffset = this.originX - 1;

    for (let r = 0; r < this.rows; r++) {
      const dstRow = rowOffset + r;
      if (dstRow < 0 || dstRow >= imageRows) continue;
      for (let c = 0; c < this.columns; c++) {
        const dstCol = colOffset + c;
        if (dstCol < 0 || dstCol >= imageColumns) continue;
        const srcIdx = r * this.columns + c;
        if (mask[srcIdx] === 0) continue;
        out[dstRow * imageColumns + dstCol] = 1;
      }
    }

    return out;
  }

  applyTo(image: RawImage, color: Color32 = new Color32(255, 0, 0, 255), frame: number = 0): RawImage {
    const mask = this.getMaskForImage(image.height, image.width, frame);
    const pixels = new Uint8Array(image.pixels);
    const count = Math.min(mask.length, image.width * image.height);
    for (let i = 0; i < count; i++) {
      if (mask[i] === 0) continue;
      const o = i * 4;
      pixels[o] = color.r;
      pixels[o + 1] = color.g;
      pixels[o + 2] = color.b;
      pixels[o + 3] = color.a;
    }
    return new RawImage(image.width, image.height, pixels, image.bytesPerPixel);
  }

  getOverlayDataS32(bg: number, fg: number): number[] {
    const overlay = new Array<number>(this.rows * this.columns);
    const bytes = this.data.data;
    const bitLength = bytes.length * 8;
    if (bitLength < overlay.length) {
      throw new Error(`Invalid overlay length: ${bitLength}`);
    }

    for (let i = 0; i < overlay.length; i++) {
      const byteIndex = i >> 3;
      const bitIndex = i & 7;
      const bit = ((bytes[byteIndex] ?? 0) >> bitIndex) & 1;
      overlay[i] = bit ? fg : bg;
    }
    return overlay;
  }

  // -------------------------------------------------------------------------
  // Static helpers (matching fo-dicom)
  // -------------------------------------------------------------------------

  static readonly isOverlaySequence = (item: import("../dataset/DicomItem.js").DicomItem): boolean => {
    const g = item.tag.group;
    return g >= 0x6000 && g <= 0x60FF && (g & 1) === 0;
  };

  static fromDataset(dataset: DicomDataset): DicomOverlayData[] {
    const groups = new Set<number>();
    for (const item of dataset) {
      if (!DicomOverlayData.isOverlaySequence(item)) continue;
      if (item.tag.element === 0x0010) groups.add(item.tag.group);
    }

    const overlays: DicomOverlayData[] = [];
    for (const group of groups) {
      const rowsTag = new DicomTag(group, 0x0010);
      const rowsItem = dataset.getDicomItem<DicomElement>(rowsTag);
      if (!rowsItem || rowsItem.valueRepresentation !== DicomVR.US) continue;
      const type = dataset.getSingleValueOrDefault<string>(new DicomTag(group, 0x0040), "");
      const cols = dataset.getValueOrDefault<number>(new DicomTag(group, 0x0011), 0, 0);
      const rows = dataset.getValueOrDefault<number>(rowsTag, 0, 0);
      if (!type || cols === 0 || rows === 0) continue;
      overlays.push(new DicomOverlayData(dataset, group));
    }

    return overlays;
  }

  static hasEmbeddedOverlays(dataset: DicomDataset): boolean {
    const groups = new Set<number>();
    for (const item of dataset) {
      if (!DicomOverlayData.isOverlaySequence(item)) continue;
      if (item.tag.element === 0x0010) groups.add(item.tag.group);
    }

    for (const group of groups) {
      if (!dataset.contains(new DicomTag(group, 0x3000))) return true;
    }
    return false;
  }

  // -------------------------------------------------------------------------
  // Internals
  // -------------------------------------------------------------------------

  private overlayTag(element: number): DicomTag {
    return new DicomTag(this.group, element);
  }

  private resolveFrameIndex(imageFrame: number): number {
    const frames = Math.max(1, this.numberOfFrames);
    if (frames <= 1) return 0;
    const origin = Math.max(1, this.originFrame);
    const idx = imageFrame - (origin - 1);
    if (idx < 0 || idx >= frames) return -1;
    return idx;
  }

  private getOverlayFrameBytes(all: Uint8Array, frame: number): Uint8Array {
    const count = this.rows * this.columns;
    const bytesPerFrame = this.bitsAllocated === 1
      ? Math.ceil(count / 8)
      : count * Math.ceil(this.bitsAllocated / 8);
    const totalFrames = Math.max(1, this.numberOfFrames);
    const idx = Math.max(0, Math.min(frame, totalFrames - 1));
    const offset = idx * bytesPerFrame;
    return all.subarray(offset, offset + bytesPerFrame);
  }

  private load(): IByteBuffer {
    const tag = this.overlayTag(0x3000);
    if (this.dataset.contains(tag)) {
      const elem = this.dataset.getDicomItem<DicomElement>(tag);
      if (elem) return elem.buffer;
    }

    // overlay embedded in high bits of pixel data
    if (this.dataset.internalTransferSyntax.isEncapsulated) {
      throw new Error("Attempted to extract embedded overlay from compressed pixel data. Decompress pixel data before attempting this operation.");
    }

    return extractEmbeddedOverlayBuffer(this, this.dataset);
  }
}

function extractEmbeddedMask(overlay: DicomOverlayData, dataset: DicomDataset): Uint8Array {
  const pixels = DicomPixelData.create(dataset);
  const count = overlay.rows * overlay.columns;
  const out = new Uint8Array(count);

  if (pixels.isEncapsulated) return out;

  // Sanity check: do not collect overlay if BitPosition is within used pixel range.
  if (overlay.bitPosition <= pixels.highBit && overlay.bitPosition > pixels.highBit - pixels.bitsStored) {
    return out;
  }

  if (pixels.bitsAllocated !== 8 && pixels.bitsAllocated !== 16) {
    throw new Error("Unable to extract embedded overlay from pixel data with bits stored greater than 16.");
  }

  const ox = Math.max(0, overlay.originX - 1);
  const oy = Math.max(0, overlay.originY - 1);
  const ow = overlay.columns;
  const oh = overlay.rows;
  const frameData = pixels.getFrame(0).data;
  const mask = 1 << overlay.bitPosition;

  if (pixels.bitsAllocated === 8) {
    for (let y = 0; y < oh; y++) {
      let n = (y + oy) * pixels.columns + ox;
      let i = y * ow;
      for (let x = 0; x < ow; x++) {
        const value = frameData[n] ?? 0;
        if ((value & mask) !== 0) out[i] = 1;
        n++;
        i++;
      }
    }
  } else {
    const view = new DataView(frameData.buffer, frameData.byteOffset, frameData.byteLength);
    const little = dataset.internalTransferSyntax.swapPixelData
      ? false
      : dataset.internalTransferSyntax.endian === 0;
    for (let y = 0; y < oh; y++) {
      let n = (y + oy) * pixels.columns + ox;
      let i = y * ow;
      for (let x = 0; x < ow; x++) {
        const value = view.getUint16(n * 2, little);
        if ((value & mask) !== 0) out[i] = 1;
        n++;
        i++;
      }
    }
  }

  return out;
}

function extractEmbeddedOverlayBuffer(overlay: DicomOverlayData, dataset: DicomDataset): IByteBuffer {
  const mask = extractEmbeddedMask(overlay, dataset);
  const bytes = packBits(mask);
  return new MemoryByteBuffer(bytes);
}

function packBits(mask: Uint8Array): Uint8Array {
  const out = new Uint8Array(Math.ceil(mask.length / 8));
  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === 0) continue;
    const byteIndex = i >> 3;
    const bitIndex = i & 7;
    out[byteIndex] = (out[byteIndex] ?? 0) | (1 << bitIndex);
  }
  return out;
}

function readOverlayColor(dataset: DicomDataset, group: number): Color32 | null {
  const gray = dataset.tryGetValue<number>(new DicomTag(group, 0x1100));
  const r = dataset.tryGetValue<number>(new DicomTag(group, 0x1101));
  const g = dataset.tryGetValue<number>(new DicomTag(group, 0x1102));
  const b = dataset.tryGetValue<number>(new DicomTag(group, 0x1103));
  if (r !== undefined && g !== undefined && b !== undefined) {
    return new Color32(scaleTo8(r), scaleTo8(g), scaleTo8(b), 255);
  }
  if (gray !== undefined) {
    const v = scaleTo8(gray);
    return new Color32(v, v, v, 255);
  }
  return null;
}

function scaleTo8(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0xFF) return value & 0xFF;
  const scaled = Math.round(value / 257);
  return Math.max(0, Math.min(255, scaled));
}

function extractPackedMask(bytes: Uint8Array, count: number, bitsGrouped: number): Uint8Array {
  const out = new Uint8Array(count);
  let groupBits = bitsGrouped > 0 ? bitsGrouped : 8;
  if (groupBits % 8 !== 0) groupBits = 8;
  const groupBytes = Math.max(1, groupBits / 8);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  for (let i = 0; i < count; i++) {
    const groupIndex = Math.floor(i / groupBits);
    const bitIndex = i % groupBits;
    const offset = groupIndex * groupBytes;
    if (offset + groupBytes > bytes.length) break;
    let value = 0;
    if (groupBytes === 1) value = bytes[offset] ?? 0;
    else if (groupBytes === 2) value = view.getUint16(offset, true);
    else if (groupBytes === 4) value = view.getUint32(offset, true);
    else value = bytes[offset] ?? 0;
    out[i] = ((value >> bitIndex) & 1) as 0 | 1;
  }
  return out;
}

function extractSampleMask(bytes: Uint8Array, count: number, bitsAllocated: number, bitPosition: number): Uint8Array {
  const out = new Uint8Array(count);
  const bytesPerSample = Math.ceil(bitsAllocated / 8);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const bitPos = Math.max(0, Math.min(bitPosition, bitsAllocated - 1));

  for (let i = 0; i < count; i++) {
    const offset = i * bytesPerSample;
    if (offset + bytesPerSample > bytes.length) break;
    let sample = 0;
    if (bytesPerSample === 1) sample = bytes[offset] ?? 0;
    else if (bytesPerSample === 2) sample = view.getUint16(offset, true);
    else if (bytesPerSample === 4) sample = view.getUint32(offset, true);
    else sample = bytes[offset] ?? 0;

    if (bitPosition === 0) {
      out[i] = sample !== 0 ? 1 : 0;
    } else {
      out[i] = ((sample >> bitPos) & 1) as 0 | 1;
    }
  }
  return out;
}
