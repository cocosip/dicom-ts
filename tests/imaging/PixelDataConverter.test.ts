import { describe, it, expect } from "vitest";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomOtherByte, DicomOtherWord } from "../../src/dataset/DicomElement.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { DicomPixelData } from "../../src/imaging/DicomPixelData.js";
import { PixelDataConverter } from "../../src/imaging/PixelDataConverter.js";
import { ColorSpace } from "../../src/imaging/ColorSpace.js";
import { ColorTable } from "../../src/imaging/ColorTable.js";

function makeDataset(options: {
  rows: number;
  columns: number;
  samplesPerPixel: number;
  photometric: string;
  planarConfiguration?: number;
  bitsAllocated?: number;
  pixelRepresentation?: number;
  data: Uint8Array;
}): DicomDataset {
  const ds = new DicomDataset();
  const bits = options.bitsAllocated ?? 8;
  ds.addOrUpdateElement(DicomVR.US, Tags.Rows, options.rows);
  ds.addOrUpdateElement(DicomVR.US, Tags.Columns, options.columns);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsAllocated, bits);
  ds.addOrUpdateElement(DicomVR.US, Tags.BitsStored, bits);
  ds.addOrUpdateElement(DicomVR.US, Tags.HighBit, bits - 1);
  ds.addOrUpdateElement(DicomVR.US, Tags.SamplesPerPixel, options.samplesPerPixel);
  ds.addOrUpdateElement(DicomVR.US, Tags.PixelRepresentation, options.pixelRepresentation ?? 0);
  ds.addOrUpdateElement(DicomVR.CS, Tags.PhotometricInterpretation, options.photometric);
  ds.addOrUpdateElement(DicomVR.US, Tags.PlanarConfiguration, options.planarConfiguration ?? 0);
  ds.addOrUpdate(new DicomOtherByte(Tags.PixelData, options.data));
  return ds;
}

function makePaletteTable(): ColorTable {
  const ds = new DicomDataset();
  ds.addOrUpdateElement(DicomVR.US, Tags.RedPaletteColorLookupTableDescriptor, 2, 0, 8);
  ds.addOrUpdateElement(DicomVR.US, Tags.GreenPaletteColorLookupTableDescriptor, 2, 0, 8);
  ds.addOrUpdateElement(DicomVR.US, Tags.BluePaletteColorLookupTableDescriptor, 2, 0, 8);

  ds.addOrUpdate(new DicomOtherWord(Tags.RedPaletteColorLookupTableData, new Uint16Array([0, 255])));
  ds.addOrUpdate(new DicomOtherWord(Tags.GreenPaletteColorLookupTableData, new Uint16Array([0, 0])));
  ds.addOrUpdate(new DicomOtherWord(Tags.BluePaletteColorLookupTableData, new Uint16Array([0, 0])));

  return ColorTable.fromDataset(ds)!;
}

describe("PixelDataConverter", () => {
  it("converts monochrome pixels with LUT", () => {
    const ds = makeDataset({
      rows: 1,
      columns: 3,
      samplesPerPixel: 1,
      photometric: "MONOCHROME2",
      data: new Uint8Array([0, 128, 255]),
    });
    const pixelData = DicomPixelData.create(ds);
    const lut = { map: (v: number) => 255 - v };
    const rgba = PixelDataConverter.convertMonochrome(pixelData, 0, lut);
    expect([...rgba]).toEqual([
      255, 255, 255, 255,
      127, 127, 127, 255,
      0, 0, 0, 255,
    ]);
  });

  it("converts interleaved RGB", () => {
    const ds = makeDataset({
      rows: 1,
      columns: 2,
      samplesPerPixel: 3,
      photometric: "RGB",
      data: new Uint8Array([255, 0, 0, 0, 255, 0]),
    });
    const pixelData = DicomPixelData.create(ds);
    const rgba = PixelDataConverter.convertRgb(pixelData, 0);
    expect([...rgba]).toEqual([
      255, 0, 0, 255,
      0, 255, 0, 255,
    ]);
  });

  it("converts planar RGB", () => {
    const ds = makeDataset({
      rows: 1,
      columns: 2,
      samplesPerPixel: 3,
      photometric: "RGB",
      planarConfiguration: 1,
      data: new Uint8Array([
        255, 0,  // R plane
        0, 255,  // G plane
        0, 0,    // B plane
      ]),
    });
    const pixelData = DicomPixelData.create(ds);
    const rgba = PixelDataConverter.convertRgb(pixelData, 0);
    expect([...rgba]).toEqual([
      255, 0, 0, 255,
      0, 255, 0, 255,
    ]);
  });

  it("converts YBR_FULL", () => {
    const ds = makeDataset({
      rows: 1,
      columns: 1,
      samplesPerPixel: 3,
      photometric: "YBR_FULL",
      data: new Uint8Array([0, 128, 128]),
    });
    const pixelData = DicomPixelData.create(ds);
    const rgba = PixelDataConverter.convertYbrFull(pixelData, 0);
    const expected = ColorSpace.ybrFullToRgb(0, 128, 128);
    expect([...rgba]).toEqual([expected.r, expected.g, expected.b, 255]);
  });

  it("converts YBR_FULL_422", () => {
    const ds = makeDataset({
      rows: 1,
      columns: 2,
      samplesPerPixel: 3,
      photometric: "YBR_FULL_422",
      data: new Uint8Array([0, 255, 128, 128]),
    });
    const pixelData = DicomPixelData.create(ds);
    const rgba = PixelDataConverter.convertYbrFull422(pixelData, 0);
    expect([...rgba]).toEqual([
      0, 0, 0, 255,
      255, 255, 255, 255,
    ]);
  });

  it("converts palette color", () => {
    const ds = makeDataset({
      rows: 1,
      columns: 2,
      samplesPerPixel: 1,
      photometric: "PALETTE COLOR",
      data: new Uint8Array([0, 1]),
    });
    const pixelData = DicomPixelData.create(ds);
    const table = makePaletteTable();
    const rgba = PixelDataConverter.convertPalette(pixelData, 0, table);
    expect([...rgba]).toEqual([
      0, 0, 0, 255,
      255, 0, 0, 255,
    ]);
  });
});
