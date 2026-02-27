import { DicomDataset } from "../../dataset/DicomDataset.js";
import * as Tags from "../../core/DicomTag.generated.js";
import { ILUT } from "./ILUT.js";
import { DicomSequence } from "../../dataset/DicomSequence.js";

/**
 * Modality LUT defined via Modality LUT Sequence.
 */
export class ModalitySequenceLUT implements ILUT {
  readonly numberOfEntries: number;
  readonly firstValue: number;
  readonly bitsPerEntry: number;
  readonly data: Uint16Array;

  constructor(numberOfEntries: number, firstValue: number, bitsPerEntry: number, data: Uint16Array) {
    this.numberOfEntries = numberOfEntries;
    this.firstValue = firstValue;
    this.bitsPerEntry = bitsPerEntry;
    this.data = data;
  }

  map(value: number): number {
    if (this.numberOfEntries <= 0 || this.data.length === 0) return value;
    const idx = Math.round(value) - this.firstValue;
    if (idx <= 0) return this.data[0] ?? value;
    if (idx >= this.numberOfEntries) return this.data[this.numberOfEntries - 1] ?? value;
    return this.data[idx] ?? value;
  }

  static fromDataset(dataset: DicomDataset, index: number = 0): ModalitySequenceLUT | null {
    const item = getSequenceItem(dataset, Tags.ModalityLUTSequence, index);
    if (!item) return null;
    return buildFromItem(item);
  }
}

function getSequenceItem(dataset: DicomDataset, tag: import("../../core/DicomTag.js").DicomTag, index: number): DicomDataset | null {
  const seq = dataset.tryGetSequence(tag);
  if (!seq || !(seq instanceof DicomSequence) || seq.items.length === 0) return null;
  const idx = Math.max(0, Math.min(index, seq.items.length - 1));
  return seq.items[idx] ?? null;
}

function buildFromItem(item: DicomDataset): ModalitySequenceLUT | null {
  const desc = item.tryGetValues<number>(Tags.LUTDescriptor);
  if (!desc || desc.length < 3) return null;
  let entries = desc[0] ?? 0;
  if (entries === 0) entries = 65536;
  const first = desc[1] ?? 0;
  const bits = desc[2] ?? 16;

  const values = item.tryGetValues<number>(Tags.LUTData) ?? [];
  if (values.length === 0) return null;
  const data = new Uint16Array(Math.min(values.length, entries));
  for (let i = 0; i < data.length; i++) data[i] = values[i] ?? 0;
  return new ModalitySequenceLUT(entries, first, bits, data);
}
