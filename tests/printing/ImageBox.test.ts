import { describe, expect, it } from "vitest";
import * as DicomUIDs from "../../src/core/DicomUID.generated.js";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import { FilmBox } from "../../src/printing/FilmBox.js";
import { FilmSession } from "../../src/printing/FilmSession.js";
import { ImageBox } from "../../src/printing/ImageBox.js";

describe("Printing ImageBox", () => {
  it.each([
    ["gray", ImageBox.GraySOPClassUID],
    ["color", ImageBox.ColorSOPClassUID],
  ])("returns null image sequence when no sequence exists (%s)", (_, sopClassUid) => {
    const session = new FilmSession(DicomUIDs.BasicFilmSession);
    const filmBox = new FilmBox(session, null);
    const imageBox = new ImageBox(filmBox, sopClassUid, null);
    expect(imageBox.imageSequence).toBeNull();
  });

  it("writes to grayscale sequence for gray SOP class", () => {
    const session = new FilmSession(DicomUIDs.BasicFilmSession);
    const filmBox = new FilmBox(session, null);
    const imageBox = new ImageBox(filmBox, DicomUIDs.BasicGrayscaleImageBox, null);
    const payload = new DicomDataset();
    imageBox.imageSequence = payload;
    expect(imageBox.imageSequence).toBe(payload);
  });

  it("writes to color sequence for color SOP class", () => {
    const session = new FilmSession(DicomUIDs.BasicFilmSession, null, true);
    const filmBox = new FilmBox(session, null);
    const imageBox = new ImageBox(filmBox, DicomUIDs.BasicColorImageBox, null);
    const payload = new DicomDataset();
    imageBox.imageSequence = payload;
    expect(imageBox.imageSequence).toBe(payload);
  });
});
