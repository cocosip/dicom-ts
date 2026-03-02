import { describe, expect, it } from "vitest";
import * as DicomTags from "../../src/core/DicomTag.generated.js";
import { DicomUID } from "../../src/core/DicomUID.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomSequence } from "../../src/dataset/DicomSequence.js";
import { PresentationLut } from "../../src/printing/PresentationLut.js";

function createPresentationLuts(): PresentationLut[] {
  return [
    new PresentationLut(),
    new PresentationLut(null, new DicomDataset()),
    new PresentationLut(
      null,
      new DicomDataset().add(new DicomSequence(DicomTags.PresentationLUTSequence, new DicomDataset())),
    ),
  ];
}

describe("Printing PresentationLut", () => {
  it("always has a LUT sequence", () => {
    for (const lut of createPresentationLuts()) {
      expect(lut.lutSequence).toBeTruthy();
    }
  });

  it("starts with empty descriptor and data", () => {
    for (const lut of createPresentationLuts()) {
      expect(lut.lutDescriptor).toEqual([]);
      expect(lut.lutData).toEqual([]);
    }
  });

  it("supports setting descriptor/explanation/data", () => {
    const lut = new PresentationLut();
    lut.lutDescriptor = [10, 0, 12];
    lut.lutExplanation = "Explanation";
    lut.lutData = [1, 2, 3, 4];

    expect(lut.lutDescriptor).toEqual([10, 0, 12]);
    expect(lut.lutExplanation).toBe("Explanation");
    expect(lut.lutData).toEqual([1, 2, 3, 4]);
  });

  it("keeps specified SOP instance UID", () => {
    const expected = DicomUID.generate();
    const lut = new PresentationLut(expected, new DicomDataset());
    expect(lut.sopInstanceUID.uid).toBe(expected.uid);
  });

  it("generates SOP instance UID when null is provided", () => {
    const lut = new PresentationLut(null, new DicomDataset());
    expect(lut.sopInstanceUID.uid.length).toBeGreaterThan(0);
  });
});
