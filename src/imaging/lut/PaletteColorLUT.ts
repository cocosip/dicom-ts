import { DicomDataset } from "../../dataset/DicomDataset.js";
import { ColorTable } from "../ColorTable.js";
import { Color32 } from "../Color32.js";

/**
 * Palette color LUT (RGB lookup table).
 */
export class PaletteColorLUT {
  readonly table: ColorTable;

  constructor(table: ColorTable) {
    this.table = table;
  }

  getColor(index: number): Color32 {
    return this.table.getColor(index);
  }

  static fromDataset(dataset: DicomDataset): PaletteColorLUT | null {
    const table = ColorTable.fromDataset(dataset);
    return table ? new PaletteColorLUT(table) : null;
  }
}
