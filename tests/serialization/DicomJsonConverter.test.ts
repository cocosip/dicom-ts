import { describe, it, expect } from "vitest";
import { Buffer } from "node:buffer";
import { DicomDataset } from "../../src/dataset/DicomDataset.js";
import {
  DicomPersonName,
  DicomLongString,
  DicomOtherByte,
  DicomAgeString,
  DicomShortText,
} from "../../src/dataset/DicomElement.js";
import { DicomSequence } from "../../src/dataset/DicomSequence.js";
import * as DicomTags from "../../src/core/DicomTag.generated.js";
import {
  convertDicomToJson,
  convertJsonToDicom,
} from "../../src/serialization/DicomJson.js";

describe("DicomJsonConverter", () => {
  it("serializes PN values as person name objects", () => {
    const ds = new DicomDataset();
    ds.addOrUpdate(new DicomPersonName(DicomTags.PatientName, "Doe^John"));
    ds.addOrUpdate(new DicomLongString(DicomTags.PatientID, "P1"));

    const json = convertDicomToJson(ds);
    const obj = JSON.parse(json) as Record<string, any>;

    expect(obj["00100010"].vr).toBe("PN");
    expect(obj["00100010"].Value[0].Alphabetic).toBe("Doe^John");
    expect(obj["00100020"].Value[0]).toBe("P1");
  });

  it("round-trips sequences", () => {
    const child = new DicomDataset();
    child.addOrUpdate(new DicomShortText(DicomTags.StudyDescription, "Nested"));

    const ds = new DicomDataset();
    ds.addOrUpdate(new DicomPersonName(DicomTags.PatientName, "Doe^Jane"));
    ds.addOrUpdate(new DicomSequence(DicomTags.ReferencedSeriesSequence, child));

    const json = convertDicomToJson(ds);
    const roundTrip = convertJsonToDicom(json);

    expect(roundTrip.getString(DicomTags.PatientName)).toBe("Doe^Jane");
    const seq = roundTrip.getSequence(DicomTags.ReferencedSeriesSequence);
    expect(seq.items.length).toBe(1);
    expect(seq.items[0]!.getString(DicomTags.StudyDescription)).toBe("Nested");
  });

  it("serializes binary data as InlineBinary", () => {
    const bytes = new Uint8Array([1, 2, 3, 4]);
    const ds = new DicomDataset();
    ds.addOrUpdate(new DicomOtherByte(DicomTags.PixelData, bytes));

    const json = convertDicomToJson(ds);
    const obj = JSON.parse(json) as Record<string, any>;
    expect(obj["7FE00010"].InlineBinary).toBe(Buffer.from(bytes).toString("base64"));

    const roundTrip = convertJsonToDicom(json);
    const pixel = roundTrip.getDicomItem<DicomOtherByte>(DicomTags.PixelData)!;
    expect(Array.from(pixel.buffer.data)).toEqual([1, 2, 3, 4]);
  });

  it("accepts keywords as JSON keys", () => {
    const json = JSON.stringify({
      PatientName: {
        vr: "PN",
        Value: [{ Alphabetic: "Kalle" }],
      },
    });

    const ds = convertJsonToDicom(json);
    expect(ds.getString(DicomTags.PatientName)).toBe("Kalle");
  });

  it("serializes empty strings as null", () => {
    const ds = new DicomDataset();
    ds.validateItems = false;
    ds.addOrUpdate(new DicomAgeString(DicomTags.PatientAge, "1Y", "", "3Y"));

    const json = convertDicomToJson(ds);
    const obj = JSON.parse(json) as Record<string, any>;
    const values = obj["00101010"].Value as Array<string | null>;

    expect(values[0]).toBe("1Y");
    expect(values[1]).toBeNull();
    expect(values[2]).toBe("3Y");
  });
});
