import { describe, it, expect } from "vitest";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import { DicomOtherWord } from "../../src/dataset/DicomElement.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { ColorTable } from "../../src/imaging/ColorTable.js";
import { PaletteColorLUT } from "../../src/imaging/lut/PaletteColorLUT.js";

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
  it("loads palette from dataset and maps colors", () => {
    const ds = makePaletteDataset();
    const table = ColorTable.fromDataset(ds)!;
    expect(table.length).toBe(2);

    const black = table.getColor(0);
    expect([black.r, black.g, black.b]).toEqual([0, 0, 0]);

    const red = table.getColor(1);
    expect([red.r, red.g, red.b]).toEqual([255, 0, 0]);
  });

  it("respects first index", () => {
    const ds = makePaletteDataset();
    ds.addOrUpdateElement(DicomVR.US, Tags.RedPaletteColorLookupTableDescriptor, 2, 1, 16);
    ds.addOrUpdateElement(DicomVR.US, Tags.GreenPaletteColorLookupTableDescriptor, 2, 1, 16);
    ds.addOrUpdateElement(DicomVR.US, Tags.BluePaletteColorLookupTableDescriptor, 2, 1, 16);

    const table = ColorTable.fromDataset(ds)!;
    const outOfRange = table.getColor(0);
    expect([outOfRange.r, outOfRange.g, outOfRange.b]).toEqual([0, 0, 0]);
    const red = table.getColor(1);
    expect([red.r, red.g, red.b]).toEqual([0, 0, 0]);
    const red2 = table.getColor(2);
    expect([red2.r, red2.g, red2.b]).toEqual([255, 0, 0]);
  });

  it("creates palette LUT wrapper", () => {
    const ds = makePaletteDataset();
    const lut = PaletteColorLUT.fromDataset(ds)!;
    const c = lut.getColor(1);
    expect([c.r, c.g, c.b]).toEqual([255, 0, 0]);
  });
});
