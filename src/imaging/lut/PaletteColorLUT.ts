import { DicomDataset } from "../../dataset/DicomDataset.js";
import { Color32 } from "../Color32.js";
import * as Tags from "../../core/DicomTag.generated.js";
import type { ILUT } from "./ILUT.js";

/**
 * Palette color LUT — maps PALETTE COLOR pixel values to packed ARGB Color32 values.
 * Implements ILUT: apply() returns Color32.value (packed ARGB uint32).
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/LUT/PaletteColorLUT.cs
 */
export class PaletteColorLUT implements ILUT {
  private readonly _first: number;
  colorMap: Color32[];

  constructor(firstEntry: number, colorMap: Color32[]) {
    this._first = firstEntry;
    this.colorMap = colorMap;
  }

  get minimumOutputValue(): number {
    return -2147483648; // int.MinValue
  }

  get maximumOutputValue(): number {
    return 2147483647; // int.MaxValue
  }

  get isValid(): boolean {
    return this.colorMap != null && this.colorMap.length > 0;
  }

  /** Returns packed ARGB Color32.value for the given pixel index. */
  apply(value: number): number {
    const idx = value - this._first;
    return (idx > 0 ? this.colorMap[idx | 0] : this.colorMap[0])?.value ?? 0;
  }

  recalculate(): void {}

  /**
   * Extract the palette color LUT from a DICOM dataset.
   * Returns null if the required tags are absent.
   */
  static fromDataset(dataset: DicomDataset): PaletteColorLUT | null {
    if (!dataset.contains(Tags.RedPaletteColorLookupTableDescriptor)) return null;

    const size0 = dataset.getValueOrDefault<number>(Tags.RedPaletteColorLookupTableDescriptor, 0, 0);
    const firstEntry = dataset.getValueOrDefault<number>(Tags.RedPaletteColorLookupTableDescriptor, 1, 0);
    const bits = dataset.getValueOrDefault<number>(Tags.RedPaletteColorLookupTableDescriptor, 2, 8);
    const size = size0 === 0 ? 65536 : size0;

    const r = dataset.tryGetValues<number>(Tags.RedPaletteColorLookupTableData);
    const g = dataset.tryGetValues<number>(Tags.GreenPaletteColorLookupTableData);
    const b = dataset.tryGetValues<number>(Tags.BluePaletteColorLookupTableData);

    if (!r || !g || !b) return null;

    const colorMap: Color32[] = new Array<Color32>(size);

    if (r.length === size) {
      for (let i = 0; i < size; i++) {
        colorMap[i] = new Color32(scaleTo8(r[i]!, bits), scaleTo8(g[i]!, bits), scaleTo8(b[i]!, bits), 255);
      }
    } else {
      let offset = bits === 16 ? 1 : 0;
      for (let i = 0; i < size; i++, offset += 2) {
        colorMap[i] = new Color32(r[offset]!, g[offset]!, b[offset]!, 255);
      }
    }

    return new PaletteColorLUT(firstEntry, colorMap);
  }
}

function scaleTo8(value: number, bits: number): number {
  if (bits <= 8) return (value << (8 - bits)) & 0xff;
  return (value >> (bits - 8)) & 0xff;
}
