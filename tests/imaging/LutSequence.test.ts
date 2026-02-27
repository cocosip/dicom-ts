import { describe, it, expect } from "vitest";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomSequence } from "../../src/dataset/DicomSequence.js";
import { DicomVR } from "../../src/core/DicomVR.js";
import * as Tags from "../../src/core/DicomTag.generated.js";
import { ModalitySequenceLUT } from "../../src/imaging/lut/ModalitySequenceLUT.js";
import { VOISequenceLUT } from "../../src/imaging/lut/VOISequenceLUT.js";

function makeLutItem(): DicomDataset {
  const item = new DicomDataset();
  item.addOrUpdateElement(DicomVR.US, Tags.LUTDescriptor, 4, 0, 8);
  item.addOrUpdateElement(DicomVR.US, Tags.LUTData, 0, 10, 20, 30);
  return item;
}

describe("Sequence LUTs", () => {
  it("ModalitySequenceLUT maps values", () => {
    const ds = new DicomDataset();
    ds.addOrUpdate(new DicomSequence(Tags.ModalityLUTSequence, makeLutItem()));

    const lut = ModalitySequenceLUT.fromDataset(ds)!;
    expect(lut.map(0)).toBe(0);
    expect(lut.map(2)).toBe(20);
    expect(lut.map(10)).toBe(30);
  });

  it("VOISequenceLUT maps values", () => {
    const ds = new DicomDataset();
    ds.addOrUpdate(new DicomSequence(Tags.VOILUTSequence, makeLutItem()));

    const lut = VOISequenceLUT.fromDataset(ds)!;
    expect(lut.map(1)).toBe(10);
    expect(lut.map(3)).toBe(30);
  });
});
