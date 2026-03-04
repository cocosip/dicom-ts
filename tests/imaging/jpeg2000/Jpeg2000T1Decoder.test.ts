import { describe, expect, it } from "vitest";
import {
  Jpeg2000T1Decoder,
  getSignCodingLut,
  getSignPredictionLut,
  getZeroCodingLut,
} from "../../../src/imaging/codec/jpeg2000/core/index.js";

describe("Jpeg2000T1Decoder", () => {
  it("decodes a code-block from MQ coded payload into coefficient buffer", () => {
    const decoder = new Jpeg2000T1Decoder(4, 4, 0);
    decoder.setOrientation(0);
    decoder.decodeWithBitplane(new Uint8Array([0x11, 0x22, 0x33, 0x44]), 3, 6, 0);

    const coefficients = decoder.getData();
    expect(coefficients).toHaveLength(16);
  });

  it("supports layered decode path with pass boundaries", () => {
    const decoder = new Jpeg2000T1Decoder(2, 2, 0x04);
    decoder.setOrientation(0);
    decoder.decodeLayeredWithMode(new Uint8Array([0xaa, 0xbb, 0xcc]), [1, 2, 3], 5, 0, true, false);

    const coefficients = decoder.getData();
    expect(coefficients).toHaveLength(4);
  });

  it("loads context lookup tables with expected sizes", () => {
    expect(getZeroCodingLut()).toHaveLength(2048);
    expect(getSignCodingLut()).toHaveLength(256);
    expect(getSignPredictionLut()).toHaveLength(256);
  });
});