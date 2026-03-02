import { describe, expect, it } from "vitest";
import * as DicomUIDs from "../../src/core/DicomUID.generated.js";
import { DicomUID } from "../../src/core/DicomUID.js";
import { FilmSession } from "../../src/printing/FilmSession.js";

describe("Printing FilmSession", () => {
  it("creates, finds and deletes film box", () => {
    const session = new FilmSession(DicomUIDs.BasicFilmSession);
    const box = session.createFilmBox();
    expect(session.findFilmBox(box.sopInstanceUID)?.sopInstanceUID.uid).toBe(box.sopInstanceUID.uid);
    expect(session.deleteFilmBox(box.sopInstanceUID)).toBe(true);
    expect(session.findFilmBox(box.sopInstanceUID)).toBeNull();
  });

  it("creates, finds and deletes presentation LUT", () => {
    const session = new FilmSession(DicomUIDs.BasicFilmSession);
    const lut = session.createPresentationLut();
    expect(session.findPresentationLut(lut.sopInstanceUid)?.sopInstanceUid.uid).toBe(lut.sopInstanceUid.uid);
    expect(session.deletePresentationLut(lut.sopInstanceUid)).toBe(true);
    expect(session.findPresentationLut(lut.sopInstanceUid)).toBeNull();
  });

  it("finds image box across film boxes", () => {
    const session = new FilmSession(DicomUIDs.BasicFilmSession);
    const first = session.createFilmBox();
    first.imageDisplayFormat = "STANDARD\\1,1";
    first.initialize();

    const second = session.createFilmBox();
    second.imageDisplayFormat = "STANDARD\\1,2";
    second.initialize();

    const target = second.basicImageBoxes[1];
    expect(target).toBeTruthy();
    expect(session.findImageBox(target!.sopInstanceUID)?.sopInstanceUID.uid).toBe(target!.sopInstanceUID.uid);
  });

  it("cloneFilmSession keeps identifiers and transfer syntax", () => {
    const sopInstance = DicomUID.generate();
    const session = new FilmSession(DicomUIDs.BasicFilmSession, sopInstance, true);
    const cloned = session.cloneFilmSession();
    expect(cloned.sopClassUID.uid).toBe(session.sopClassUID.uid);
    expect(cloned.sopInstanceUID.uid).toBe(session.sopInstanceUID.uid);
    expect(cloned.isColor).toBe(true);
    expect(cloned.internalTransferSyntax.uid.uid).toBe(session.internalTransferSyntax.uid.uid);
  });
});
