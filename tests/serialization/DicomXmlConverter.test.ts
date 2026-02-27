import { describe, it, expect } from "vitest";
import { Buffer } from "node:buffer";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import {
  DicomPersonName,
  DicomLongString,
  DicomOtherByte,
  DicomShortText,
} from "../../src/dataset/DicomElement.js";
import { DicomSequence } from "../../src/dataset/DicomSequence.js";
import * as DicomTags from "../../src/core/DicomTag.generated.js";
import { convertDicomToXml } from "../../src/serialization/DicomXml.js";

describe("DicomXmlConverter", () => {
  it("serializes a basic dataset", () => {
    const ds = new DicomDataset();
    ds.addOrUpdate(new DicomPersonName(DicomTags.PatientName, "Doe^John"));
    ds.addOrUpdate(new DicomLongString(DicomTags.PatientID, "P1"));

    const xml = convertDicomToXml(ds);
    expect(xml).toContain("<NativeDicomModel>");
    expect(xml).toContain('tag="00100010"');
    expect(xml).toContain("<FamilyName>Doe</FamilyName>");
    expect(xml).toContain("<GivenName>John</GivenName>");
  });

  it("serializes sequences with items", () => {
    const child = new DicomDataset();
    child.addOrUpdate(new DicomShortText(DicomTags.StudyDescription, "Nested"));

    const ds = new DicomDataset();
    ds.addOrUpdate(new DicomSequence(DicomTags.ReferencedSeriesSequence, child));

    const xml = convertDicomToXml(ds);
    expect(xml).toContain("<Item number=\"1\">");
    expect(xml).toContain('tag="00081115"');
    expect(xml).toContain("<Value number=\"1\">Nested</Value>");
  });

  it("serializes binary values as InlineBinary", () => {
    const bytes = new Uint8Array([1, 2, 3, 4]);
    const ds = new DicomDataset();
    ds.addOrUpdate(new DicomOtherByte(DicomTags.PixelData, bytes));

    const xml = convertDicomToXml(ds);
    const base64 = Buffer.from(bytes).toString("base64");
    expect(xml).toContain(`<InlineBinary>${base64}</InlineBinary>`);
  });
});
