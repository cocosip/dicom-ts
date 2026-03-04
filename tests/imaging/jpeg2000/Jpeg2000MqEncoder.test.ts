import { describe, expect, it } from "vitest";
import { Jpeg2000MqDecoder, Jpeg2000MqEncoder } from "../../../src/imaging/codec/jpeg2000/core/index.js";

describe("Jpeg2000MqEncoder", () => {
  it("round-trips encoded bits through MQ decoder", () => {
    const vectors = [
      {
        bits: [0, 1, 0, 1, 1, 0, 1, 0],
        contexts: [0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        bits: [0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0],
        contexts: [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3],
      },
      {
        bits: [1, 1, 1, 1, 0, 0, 1, 0],
        contexts: [0, 1, 2, 3, 4, 5, 6, 7],
      },
    ];

    for (const vector of vectors) {
      const encoder = new Jpeg2000MqEncoder(19);
      for (let i = 0; i < vector.bits.length; i++) {
        encoder.encode(vector.bits[i]!, vector.contexts[i]!);
      }
      const encoded = encoder.flush();

      expect(encoded.length).toBeGreaterThan(0);

      const decoder = new Jpeg2000MqDecoder(encoded, 19);
      for (let i = 0; i < vector.bits.length; i++) {
        expect(decoder.decode(vector.contexts[i]!)).toBe(vector.bits[i]);
      }
    }
  });

  it("supports context state and reset lifecycle", () => {
    const encoder = new Jpeg2000MqEncoder(19);
    encoder.setContextState(5, 0x42);
    expect(encoder.getContextState(5)).toBe(0x42);

    encoder.resetContext(5);
    expect(encoder.getContextState(5)).toBe(0);

    encoder.encode(1, 0);
    encoder.encode(0, 0);
    expect(encoder.numBytes()).toBeGreaterThanOrEqual(0);

    encoder.reset();
    expect(encoder.getBuffer().length).toBe(0);
    expect(encoder.numBytes()).toBe(0);
  });

  it("keeps arithmetic interval in valid range after repeated LPS", () => {
    const encoder = new Jpeg2000MqEncoder(1);
    for (let i = 0; i < 200; i++) {
      encoder.encode(1, 0);
    }

    const encoded = encoder.flush();
    expect(encoded.length).toBeGreaterThan(0);

    const decoder = new Jpeg2000MqDecoder(encoded, 1);
    for (let i = 0; i < 200; i++) {
      expect(decoder.decode(0)).toBe(1);
    }
  });
});
