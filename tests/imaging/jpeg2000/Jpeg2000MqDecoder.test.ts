import { describe, expect, it } from "vitest";
import {
  Jpeg2000MqDecoder,
  getNlpsTable,
  getNmpsTable,
  getQeTable,
  getSwitchTable,
} from "../../../src/imaging/codec/jpeg2000/core/index.js";

describe("Jpeg2000MqDecoder", () => {
  it("decodes bits without leaving binary domain", () => {
    const decoder = new Jpeg2000MqDecoder(new Uint8Array([0x00, 0x00, 0x00, 0x00]), 8);

    for (let i = 0; i < 64; i++) {
      const bit = decoder.decode(i % 8);
      expect(bit === 0 || bit === 1).toBe(true);
    }
  });

  it("supports RAW bypass decoding", () => {
    const decoder = Jpeg2000MqDecoder.createRawDecoder(new Uint8Array([0b1010_0101]));
    const bits = new Array<number>(8);
    for (let i = 0; i < 8; i++) {
      bits[i] = decoder.rawDecode();
    }

    expect(bits).toEqual([1, 0, 1, 0, 0, 1, 0, 1]);
  });

  it("exposes MQ state tables with expected sizes", () => {
    expect(getQeTable()).toHaveLength(47);
    expect(getNmpsTable()).toHaveLength(47);
    expect(getNlpsTable()).toHaveLength(47);
    expect(getSwitchTable()).toHaveLength(47);
  });
});