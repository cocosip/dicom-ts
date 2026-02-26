import { describe, it, expect } from "vitest";
import { DicomDictionary, UnknownTag } from "../../src/core/DicomDictionary.js";
import { DicomTag } from "../../src/core/DicomTag.js";
import { DicomVR } from "../../src/core/DicomVR.js";

describe("DicomDictionary", () => {
  const dict = DicomDictionary.default;

  it("looks up PatientName (0010,0010)", () => {
    const entry = dict.lookup(new DicomTag(0x0010, 0x0010));
    expect(entry).not.toBe(UnknownTag);
    expect(entry.keyword).toBe("PatientName");
    expect(entry.vr).toBe(DicomVR.PN);
  });

  it("looks up Rows (0028,0010)", () => {
    const entry = dict.lookup(new DicomTag(0x0028, 0x0010));
    expect(entry).not.toBe(UnknownTag);
    expect(entry.keyword).toBe("Rows");
    expect(entry.vr).toBe(DicomVR.US);
  });

  it("returns UnknownTag for unregistered tag", () => {
    const entry = dict.lookup(new DicomTag(0x9999, 0x9999));
    expect(entry).toBe(UnknownTag);
  });

  it("lookupKeyword works for known keyword", () => {
    const tag = dict.lookupKeyword("PatientName");
    expect(tag).not.toBeNull();
    expect(tag!.group).toBe(0x0010);
    expect(tag!.element).toBe(0x0010);
  });

  it("lookupKeyword returns null for unknown keyword", () => {
    expect(dict.lookupKeyword("NonExistentKeyword")).toBeNull();
  });

  it("singleton is the same instance", () => {
    expect(DicomDictionary.default).toBe(DicomDictionary.default);
  });

  it("private creator element returns PrivateCreatorTag", () => {
    // (0009,0010) is a private creator element
    const tag = new DicomTag(0x0009, 0x0010);
    const entry = dict.lookup(tag);
    expect(entry.keyword).toBe("PrivateCreator");
  });
});
