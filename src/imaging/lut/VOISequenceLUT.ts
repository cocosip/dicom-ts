import { DicomDataset } from "../../dataset/DicomDataset.js";
import { DicomSequence } from "../../dataset/DicomSequence.js";
import { DicomSignedShort, DicomUnsignedShort, DicomOtherWord } from "../../dataset/DicomElement.js";
import * as Tags from "../../core/DicomTag.generated.js";
import type { ILUT } from "./ILUT.js";

/**
 * VOI Sequence LUT — implements ILUT via VOILUTSequence item.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/LUT/VOISequenceLUT.cs
 */
export class VOISequenceLUT implements ILUT {
  private readonly _item: DicomDataset;
  private _nrOfEntries: number = 0;
  private _firstInputValue: number = 0;
  private _nrOfBitsPerEntry: number = 16;
  private _lutData: Int32Array = new Int32Array(0);

  constructor(voiLutSequenceItem: DicomDataset) {
    this._item = voiLutSequenceItem;
    this.recalculate();
  }

  /** Always recalculate. */
  get isValid(): boolean {
    return false;
  }

  get numberOfBitsPerEntry(): number {
    return this._nrOfBitsPerEntry;
  }

  get numberOfEntries(): number {
    return this._nrOfEntries;
  }

  get minimumOutputValue(): number {
    return this._lutData[0] ?? 0;
  }

  get maximumOutputValue(): number {
    return this._lutData[this._nrOfEntries - 1] ?? 0;
  }

  apply(value: number): number {
    if (value < this._firstInputValue) return this._lutData[0] ?? 0;
    if (value > this._firstInputValue + this._nrOfEntries - 1)
      return this._lutData[this._nrOfEntries - 1] ?? 0;
    return this._lutData[(value - this._firstInputValue) | 0] ?? 0;
  }

  static fromDataset(dataset: DicomDataset): VOISequenceLUT | null {
    const sequence = dataset.tryGetSequence(Tags.VOILUTSequence);
    if (!sequence || sequence.items.length === 0) return null;

    return new VOISequenceLUT(sequence.items[0]!);
  }

  recalculate(): void {
    this._getLutDescriptor();

    const lutDataElement = this._item.getDicomItem<DicomOtherWord | DicomUnsignedShort | DicomSignedShort>(Tags.LUTData);
    if (!lutDataElement) return;
    const vr = lutDataElement.valueRepresentation?.code ?? "";

    if (vr === "OW" || vr === "US") {
      const raw = getRawUInt16(lutDataElement as DicomOtherWord | DicomUnsignedShort);
      this._lutData = new Int32Array(raw.length);
      for (let i = 0; i < raw.length; i++) this._lutData[i] = raw[i]!;
    } else if (vr === "SS") {
      const raw = getRawInt16(lutDataElement as DicomSignedShort);
      this._lutData = new Int32Array(raw.length);
      for (let i = 0; i < raw.length; i++) this._lutData[i] = raw[i]!;
    }
  }

  private _getLutDescriptor(): void {
    const el = this._item.getDicomItem<DicomSignedShort | DicomUnsignedShort>(Tags.LUTDescriptor);
    if (!el) return;
    const vr = el.valueRepresentation?.code ?? "";

    if (vr === "SS") {
      const ss = el as DicomSignedShort;
      this._nrOfEntries = Math.abs(getInt16At(ss, 0));
      this._firstInputValue = getInt16At(ss, 1);
      this._nrOfBitsPerEntry = getInt16At(ss, 2);
    } else {
      const us = el as DicomUnsignedShort;
      this._nrOfEntries = getUInt16At(us, 0);
      this._firstInputValue = getUInt16At(us, 1);
      this._nrOfBitsPerEntry = getUInt16At(us, 2);
    }

    // DICOM C.11.2.1.1: 0 means 2^16 = 65536
    if (this._nrOfEntries === 0) this._nrOfEntries = 65536;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInt16At(el: DicomSignedShort, index: number): number {
  const bytes = el.buffer?.data;
  if (!bytes) return 0;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return view.getInt16(index * 2, true);
}

function getUInt16At(el: DicomUnsignedShort, index: number): number {
  const bytes = el.buffer?.data;
  if (!bytes) return 0;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return view.getUint16(index * 2, true);
}

function getRawUInt16(el: DicomOtherWord | DicomUnsignedShort): Uint16Array {
  const bytes = el.buffer?.data;
  if (!bytes) return new Uint16Array(0);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const count = Math.floor(bytes.byteLength / 2);
  const out = new Uint16Array(count);
  for (let i = 0; i < count; i++) out[i] = view.getUint16(i * 2, true);
  return out;
}

function getRawInt16(el: DicomSignedShort): Int16Array {
  const bytes = el.buffer?.data;
  if (!bytes) return new Int16Array(0);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const count = Math.floor(bytes.byteLength / 2);
  const out = new Int16Array(count);
  for (let i = 0; i < count; i++) out[i] = view.getInt16(i * 2, true);
  return out;
}
