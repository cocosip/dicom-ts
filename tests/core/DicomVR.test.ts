import { describe, it, expect } from "vitest";
import { DicomVR } from "../../src/core/DicomVR.js";

describe("DicomVR", () => {
  it("parse returns known VRs", () => {
    expect(DicomVR.parse("US")).toBe(DicomVR.US);
    expect(DicomVR.parse("OW")).toBe(DicomVR.OW);
    expect(DicomVR.parse("SQ")).toBe(DicomVR.SQ);
    expect(DicomVR.parse("NONE")).toBe(DicomVR.NONE);
  });

  it("parse throws for unknown code", () => {
    expect(() => DicomVR.parse("ZZ")).toThrow();
  });

  it("tryParse returns null for unknown code", () => {
    expect(DicomVR.tryParse("ZZ")).toBeNull();
    expect(DicomVR.tryParse("US")).toBe(DicomVR.US);
  });

  it("string VRs have isString=true", () => {
    for (const vr of [DicomVR.LO, DicomVR.SH, DicomVR.PN, DicomVR.UI, DicomVR.CS]) {
      expect(vr.isString).toBe(true);
    }
  });

  it("binary VRs have isString=false", () => {
    for (const vr of [DicomVR.US, DicomVR.UL, DicomVR.FD, DicomVR.OW]) {
      expect(vr.isString).toBe(false);
    }
  });

  it("16-bit length VRs", () => {
    expect(DicomVR.US.is16bitLength).toBe(true);
    expect(DicomVR.OB.is16bitLength).toBe(false);
    expect(DicomVR.SQ.is16bitLength).toBe(false);
    expect(DicomVR.UN.is16bitLength).toBe(false);
  });

  it("US has correct unitSize and byteSwap", () => {
    expect(DicomVR.US.unitSize).toBe(2);
    expect(DicomVR.US.byteSwap).toBe(2);
  });

  it("FD has correct unitSize and byteSwap", () => {
    expect(DicomVR.FD.unitSize).toBe(8);
    expect(DicomVR.FD.byteSwap).toBe(8);
  });

  it("tryParseBytes works for known VRs", () => {
    // US = 0x55, 0x53
    expect(DicomVR.tryParseBytes(0x55, 0x53)).toBe(DicomVR.US);
    // OW = 0x4f, 0x57
    expect(DicomVR.tryParseBytes(0x4f, 0x57)).toBe(DicomVR.OW);
  });

  it("toString returns the code", () => {
    expect(DicomVR.US.toString()).toBe("US");
    expect(DicomVR.SQ.toString()).toBe("SQ");
  });

  it("CS validator rejects invalid characters", () => {
    expect(() => DicomVR.CS.validateString("VALID_CODE")).not.toThrow();
    expect(() => DicomVR.CS.validateString("invalid lower")).toThrow();
  });

  it("UI validator rejects non-UID characters", () => {
    expect(() => DicomVR.UI.validateString("1.2.3.4")).not.toThrow();
    expect(() => DicomVR.UI.validateString("1.2.3.a")).toThrow();
  });

  it("AS validator enforces format nnnW|M|D|Y", () => {
    expect(() => DicomVR.AS.validateString("010Y")).not.toThrow();
    expect(() => DicomVR.AS.validateString("010X")).toThrow();
    expect(() => DicomVR.AS.validateString("10Y")).toThrow();
  });
});
