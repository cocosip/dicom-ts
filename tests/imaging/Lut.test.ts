import { describe, it, expect } from "vitest";
import { CompositeLUT } from "../../src/imaging/lut/CompositeLUT.js";
import { InvertLUT } from "../../src/imaging/lut/InvertLUT.js";
import { OutputLUT } from "../../src/imaging/lut/OutputLUT.js";
import { PaddingLUT } from "../../src/imaging/lut/PaddingLUT.js";
import { PrecalculatedLUT } from "../../src/imaging/lut/PrecalculatedLUT.js";
import { ModalityRescaleLUT } from "../../src/imaging/lut/ModalityRescaleLUT.js";
import { VOILUT } from "../../src/imaging/lut/VOILUT.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import type { ILUT } from "../../src/imaging/lut/ILUT.js";

class AddOneLUT implements ILUT {
  map(value: number): number {
    return value + 1;
  }
}

describe("LUTs", () => {
  it("composes LUTs in order", () => {
    const lut = new CompositeLUT(new AddOneLUT(), new AddOneLUT());
    expect(lut.map(1)).toBe(3);
  });

  it("inverts and clamps values", () => {
    const lut = new InvertLUT();
    expect(lut.map(0)).toBe(255);
    expect(lut.map(255)).toBe(0);
  });

  it("pads values", () => {
    const lut = new PaddingLUT(0, 42);
    expect(lut.map(0)).toBe(42);
    expect(lut.map(5)).toBe(5);
  });

  it("clamps output range", () => {
    const lut = new OutputLUT();
    expect(lut.map(-10)).toBe(0);
    expect(lut.map(300)).toBe(255);
  });

  it("precalculates lookups", () => {
    const lut = new PrecalculatedLUT(new InvertLUT(), 0, 2);
    expect(lut.map(0)).toBe(255);
    expect(lut.map(1)).toBe(254);
    expect(lut.map(3)).toBe(253);
  });

  it("creates modality rescale LUT from dataset", () => {
    const ds = new DicomDataset();
    ds.addOrUpdateElement(DicomVR.DS, Tags.RescaleSlope, "2");
    ds.addOrUpdateElement(DicomVR.DS, Tags.RescaleIntercept, "10");
    const lut = ModalityRescaleLUT.fromDataset(ds);
    expect(lut.map(5)).toBe(20);
  });

  it("VOI LUT uses window center/width", () => {
    const lut = new VOILUT(1, 1, false);
    expect(lut.map(0)).toBe(0);
    expect(lut.map(1)).toBe(255);

    const inverted = new VOILUT(1, 1, true);
    expect(inverted.map(1)).toBe(0);
  });
});
