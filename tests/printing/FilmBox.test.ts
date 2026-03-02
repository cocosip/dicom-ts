import { describe, expect, it } from "vitest";
import * as DicomTags from "../../src/core/DicomTag.generated.js";
import * as DicomUIDs from "../../src/core/DicomUID.generated.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { DicomSequence } from "../../src/dataset/DicomSequence.js";
import { DicomUniqueIdentifier } from "../../src/dataset/DicomElement.js";
import { FilmBox } from "../../src/printing/FilmBox.js";
import { FilmSession } from "../../src/printing/FilmSession.js";

describe("Printing FilmBox", () => {
  it("presentationLut getter returns null when no referenced sequence exists", () => {
    const session = new FilmSession(DicomUIDs.BasicFilmSession);
    const box = new FilmBox(session, null);
    expect(box.presentationLut).toBeNull();
  });

  it("initialize STANDARD format creates expected number of image boxes", () => {
    const session = new FilmSession(DicomUIDs.BasicFilmSession);
    const box = new FilmBox(session, null);
    box.imageDisplayFormat = "STANDARD\\2,3";
    expect(box.initialize()).toBe(true);
    expect(box.basicImageBoxes).toHaveLength(6);
    expect(box.getSequence(DicomTags.ReferencedImageBoxSequence).items).toHaveLength(6);
  });

  it("initialize ROW format creates expected number of image boxes", () => {
    const session = new FilmSession(DicomUIDs.BasicFilmSession);
    const box = new FilmBox(session, null);
    box.imageDisplayFormat = "ROW\\1,2,3";
    expect(box.initialize()).toBe(true);
    expect(box.basicImageBoxes).toHaveLength(6);
  });

  it("resolves referenced presentation LUT from film session", () => {
    const session = new FilmSession(DicomUIDs.BasicFilmSession);
    const lut = session.createPresentationLut();
    const box = new FilmBox(session, null);
    box.referencedPresentationLutSequence = new DicomSequence(
      DicomTags.ReferencedPresentationLUTSequence,
      new DicomDataset().add(
        new DicomUniqueIdentifier(DicomTags.ReferencedSOPInstanceUID, lut.sopInstanceUID),
      ),
    );
    expect(box.presentationLut?.sopInstanceUID.uid).toBe(lut.sopInstanceUID.uid);
  });

  it("clone copies image boxes", () => {
    const session = new FilmSession(DicomUIDs.BasicFilmSession);
    const box = new FilmBox(session, null);
    box.imageDisplayFormat = "STANDARD\\1,2";
    box.initialize();
    const cloned = box.clone();
    expect(cloned.basicImageBoxes).toHaveLength(2);
    expect(cloned.sopInstanceUID.uid).toBe(box.sopInstanceUID.uid);
  });
});
