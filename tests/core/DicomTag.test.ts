import { describe, it, expect } from "vitest";
import { DicomTag, DicomMaskedTag } from "../../src/core/DicomTag.js";

describe("DicomTag", () => {
  it("constructs with group and element", () => {
    const tag = new DicomTag(0x0028, 0x0010);
    expect(tag.group).toBe(0x0028);
    expect(tag.element).toBe(0x0010);
  });

  it("detects private tags (odd group)", () => {
    expect(new DicomTag(0x0009, 0x0010).isPrivate).toBe(true);
    expect(new DicomTag(0x0008, 0x0010).isPrivate).toBe(false);
  });

  it("detects group-length elements", () => {
    expect(new DicomTag(0x0008, 0x0000).isGroupLength).toBe(true);
    expect(new DicomTag(0x0008, 0x0010).isGroupLength).toBe(false);
  });

  it("rounds-trips to uint32", () => {
    const tag = new DicomTag(0x0028, 0x0010);
    const u32 = tag.toUint32();
    const back = DicomTag.fromUint32(u32);
    expect(back.group).toBe(0x0028);
    expect(back.element).toBe(0x0010);
  });

  it("compareTo orders correctly", () => {
    const a = new DicomTag(0x0008, 0x0010);
    const b = new DicomTag(0x0028, 0x0010);
    const c = new DicomTag(0x0028, 0x0010);
    expect(a.compareTo(b)).toBeLessThan(0);
    expect(b.compareTo(a)).toBeGreaterThan(0);
    expect(b.compareTo(c)).toBe(0);
  });

  it("equals is symmetric", () => {
    const a = new DicomTag(0x0008, 0x0010);
    const b = new DicomTag(0x0008, 0x0010);
    const c = new DicomTag(0x0008, 0x0011);
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('toString("G") formats public tag correctly', () => {
    const tag = new DicomTag(0x0028, 0x0010);
    expect(tag.toString("G")).toBe("(0028,0010)");
  });

  it('toString("J") formats as 8-char hex', () => {
    const tag = new DicomTag(0x0028, 0x0010);
    expect(tag.toString("J")).toBe("00280010");
  });

  it("DicomTag.Unknown has correct value", () => {
    expect(DicomTag.Unknown.group).toBe(0xffff);
    expect(DicomTag.Unknown.element).toBe(0xffff);
  });

  it("clamps values to uint16", () => {
    const tag = new DicomTag(0x10028, 0x10010);
    expect(tag.group).toBe(0x0028);
    expect(tag.element).toBe(0x0010);
  });
});

describe("DicomMaskedTag", () => {
  it("parses and matches overlay data range (60xx,3000)", () => {
    const masked = DicomMaskedTag.parse("(6000,3000)");
    expect(masked.isMatch(new DicomTag(0x6000, 0x3000))).toBe(true);
  });

  it("parses fully masked tag (xxxx,xxxx)", () => {
    const masked = DicomMaskedTag.parse("(xxxx,xxxx)");
    expect(masked.isMatch(new DicomTag(0x0008, 0x0010))).toBe(true);
    expect(masked.isMatch(new DicomTag(0xffff, 0xffff))).toBe(true);
  });

  it("exact tag mask only matches that tag", () => {
    const masked = DicomMaskedTag.parse("(0028,0010)");
    expect(masked.isMatch(new DicomTag(0x0028, 0x0010))).toBe(true);
    expect(masked.isMatch(new DicomTag(0x0028, 0x0011))).toBe(false);
  });
});
