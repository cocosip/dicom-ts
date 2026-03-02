import { describe, it, expect } from "vitest";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import { DicomOtherWord } from "../../src/dataset/DicomElement.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { ColorTable } from "../../src/imaging/ColorTable.js";
import { PaletteColorLUT } from "../../src/imaging/lut/PaletteColorLUT.js";
import { Color32 } from "../../src/imaging/Color32.js";

function makePaletteDataset(): DicomDataset {
  const ds = new DicomDataset();
  ds.addOrUpdateElement(DicomVR.US, Tags.RedPaletteColorLookupTableDescriptor, 2, 0, 16);
  ds.addOrUpdateElement(DicomVR.US, Tags.GreenPaletteColorLookupTableDescriptor, 2, 0, 16);
  ds.addOrUpdateElement(DicomVR.US, Tags.BluePaletteColorLookupTableDescriptor, 2, 0, 16);

  const red = new Uint16Array([0x0000, 0xFFFF]);
  const green = new Uint16Array([0x0000, 0x0000]);
  const blue = new Uint16Array([0x0000, 0x0000]);

  ds.addOrUpdate(new DicomOtherWord(Tags.RedPaletteColorLookupTableData, red));
  ds.addOrUpdate(new DicomOtherWord(Tags.GreenPaletteColorLookupTableData, green));
  ds.addOrUpdate(new DicomOtherWord(Tags.BluePaletteColorLookupTableData, blue));
  return ds;
}

describe("ColorTable", () => {
  it("has Monochrome1 (inverted) and Monochrome2 (normal) grayscale LUTs", () => {
    expect(ColorTable.Monochrome1.length).toBe(256);
    expect(ColorTable.Monochrome2.length).toBe(256);

    // Monochrome2: index 0 → black, index 255 → white
    expect([ColorTable.Monochrome2[0]!.r, ColorTable.Monochrome2[0]!.g, ColorTable.Monochrome2[0]!.b]).toEqual([0, 0, 0]);
    expect([ColorTable.Monochrome2[255]!.r, ColorTable.Monochrome2[255]!.g, ColorTable.Monochrome2[255]!.b]).toEqual([255, 255, 255]);

    // Monochrome1: index 0 → white, index 255 → black
    expect([ColorTable.Monochrome1[0]!.r, ColorTable.Monochrome1[0]!.g, ColorTable.Monochrome1[0]!.b]).toEqual([255, 255, 255]);
    expect([ColorTable.Monochrome1[255]!.r, ColorTable.Monochrome1[255]!.g, ColorTable.Monochrome1[255]!.b]).toEqual([0, 0, 0]);
  });

  it("reverses a LUT", () => {
    const reversed = ColorTable.reverse(ColorTable.Monochrome2);
    expect([reversed[0]!.r, reversed[0]!.g, reversed[0]!.b]).toEqual([255, 255, 255]);
    expect([reversed[255]!.r, reversed[255]!.g, reversed[255]!.b]).toEqual([0, 0, 0]);
  });

  it("loads palette from dataset and maps colors via PaletteColorLUT", () => {
    const ds = makePaletteDataset();
    const lut = PaletteColorLUT.fromDataset(ds)!;
    expect(lut.colorMap.length).toBe(2);

    // Color32.value is packed ARGB.
    // Index 0 -> Red=0x0000 -> 0. Green=0x0000 -> 0. Blue=0x0000 -> 0. Alpha=255.
    // Expected Black (0,0,0,255) -> 0xFF000000
    const blackValue = lut.apply(0);
    expect(blackValue >>> 0).toBe(0xFF000000);

    // Index 1 -> Red=0xFFFF -> 255. Green=0x0000 -> 0. Blue=0x0000 -> 0. Alpha=255.
    // Expected Red (255,0,0,255) -> 0xFFFF0000
    const redValue = lut.apply(1);
    expect(redValue >>> 0).toBe(0xFFFF0000);
  });

  it("respects first index offset", () => {
    const ds = makePaletteDataset();
    ds.addOrUpdateElement(DicomVR.US, Tags.RedPaletteColorLookupTableDescriptor, 2, 1, 16);
    ds.addOrUpdateElement(DicomVR.US, Tags.GreenPaletteColorLookupTableDescriptor, 2, 1, 16);
    ds.addOrUpdateElement(DicomVR.US, Tags.BluePaletteColorLookupTableDescriptor, 2, 1, 16);

    const lut = PaletteColorLUT.fromDataset(ds)!;
    
    // Index 0 -> below first entry (1). Should map to first entry? 
    // PaletteColorLUT.apply implementation:
    // const idx = value - this._first;
    // return (idx > 0 ? this.colorMap[idx | 0] : this.colorMap[0])?.value ?? 0;
    
    // If value=0, first=1 => idx = -1.
    // idx > 0 is false. Returns colorMap[0].
    // colorMap[0] is Black (from makePaletteDataset).
    const outOfRangeValue = lut.apply(0);
    expect(outOfRangeValue >>> 0).toBe(0xFF000000); // Black

    // Index 1 -> value=1, first=1 => idx = 0.
    // idx > 0 is false. Returns colorMap[0].
    // colorMap[0] is Black.
    const stillBlackValue = lut.apply(1);
    expect(stillBlackValue >>> 0).toBe(0xFF000000); // Black

    // Index 2 -> value=2, first=1 => idx = 1.
    // idx > 0 is true. Returns colorMap[1].
    // colorMap[1] is Red.
    const redValue = lut.apply(2);
    expect(redValue >>> 0).toBe(0xFFFF0000); // Red
  });
});
