import { DicomDataset } from "../dataset/DicomDataset.js";
import { DicomOtherWord } from "../dataset/DicomElement.js";
import * as Tags from "../core/DicomTag.generated.js";
import { Color32 } from "./Color32.js";

/**
 * Palette color lookup table (RGB).
 */
export class ColorTable {
  readonly red: Uint16Array;
  readonly green: Uint16Array;
  readonly blue: Uint16Array;
  readonly bitsPerEntry: number;
  readonly firstIndex: number;

  constructor(
    red: Uint16Array,
    green: Uint16Array,
    blue: Uint16Array,
    bitsPerEntry: number,
    firstIndex: number = 0
  ) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.bitsPerEntry = bitsPerEntry;
    this.firstIndex = firstIndex;
  }

  get length(): number {
    return Math.min(this.red.length, this.green.length, this.blue.length);
  }

  getColor(index: number): Color32 {
    const idx = index - this.firstIndex;
    if (idx < 0 || idx >= this.length) return new Color32(0, 0, 0, 255);
    const r = scaleTo8(this.red[idx] ?? 0, this.bitsPerEntry);
    const g = scaleTo8(this.green[idx] ?? 0, this.bitsPerEntry);
    const b = scaleTo8(this.blue[idx] ?? 0, this.bitsPerEntry);
    return new Color32(r, g, b, 255);
  }

  static fromDataset(dataset: DicomDataset): ColorTable | null {
    const desc = tryGetDescriptor(dataset, Tags.RedPaletteColorLookupTableDescriptor);
    const redData = tryGetLutData(dataset, Tags.RedPaletteColorLookupTableData);
    const greenData = tryGetLutData(dataset, Tags.GreenPaletteColorLookupTableData);
    const blueData = tryGetLutData(dataset, Tags.BluePaletteColorLookupTableData);
    if (!desc || !redData || !greenData || !blueData) return null;

    const [entries, firstIndex, bitsPerEntry] = desc;
    const expected = entries === 0 ? 65536 : entries;
    const r = redData.slice(0, expected);
    const g = greenData.slice(0, expected);
    const b = blueData.slice(0, expected);
    return new ColorTable(r, g, b, bitsPerEntry, firstIndex);
  }
}

function tryGetDescriptor(dataset: DicomDataset, tag: import("../core/DicomTag.js").DicomTag): [number, number, number] | null {
  const values = dataset.tryGetValues<number>(tag);
  if (!values || values.length < 3) return null;
  return [values[0] ?? 0, values[1] ?? 0, values[2] ?? 8];
}

function tryGetLutData(
  dataset: DicomDataset,
  tag: import("../core/DicomTag.js").DicomTag
): Uint16Array | null {
  const item = dataset.getDicomItem<DicomOtherWord>(tag);
  if (!item) return null;
  const bytes = item.buffer.data;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const count = Math.floor(bytes.byteLength / 2);
  const out = new Uint16Array(count);
  for (let i = 0; i < count; i++) {
    out[i] = view.getUint16(i * 2, true);
  }
  return out;
}

function scaleTo8(value: number, bits: number): number {
  if (bits <= 8) return (value << (8 - bits)) & 0xFF;
  return (value >> (bits - 8)) & 0xFF;
}
