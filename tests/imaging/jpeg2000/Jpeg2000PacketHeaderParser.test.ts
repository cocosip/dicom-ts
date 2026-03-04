import { describe, expect, it } from "vitest";
import {
  Jpeg2000PacketHeaderBitReader,
  Jpeg2000PacketHeaderBitWriter,
  Jpeg2000PacketHeaderParser,
  decodeDataLengthWithReader,
  decodeNumPassesWithReader,
  floorLog2,
  parsePacketHeaderMulti,
  type Jpeg2000PacketHeaderBandState,
} from "../../../src/imaging/codec/jpeg2000/core/index.js";

describe("Jpeg2000PacketHeaderParser", () => {
  it("parses empty packet header", () => {
    const parser = new Jpeg2000PacketHeaderParser(new Uint8Array([0x00]), 2, 2);
    const packet = parser.parseHeader();

    expect(packet.headerPresent).toBe(false);
    expect(packet.codeBlockInclusions).toHaveLength(0);
  });

  it("decodes number of passes using JPEG2000 variable-length coding", () => {
    const cases: Array<{ bits: number[]; expected: number }> = [
      { bits: [0x00], expected: 1 },
      { bits: [0x80], expected: 2 },
      { bits: [0xc0], expected: 3 },
      { bits: [0xe0], expected: 5 },
      { bits: [0xf0, 0x00], expected: 6 },
      { bits: [0xf2, 0x00], expected: 10 },
    ];

    for (const testCase of cases) {
      const reader = new Jpeg2000PacketHeaderBitReader(Uint8Array.from(testCase.bits));
      expect(decodeNumPassesWithReader(reader)).toBe(testCase.expected);
    }
  });

  it("decodes code-block data length statefully", () => {
    const expectedLengths = [10, 100, 254, 255];

    for (const expectedLength of expectedLengths) {
      const writer = new Jpeg2000PacketHeaderBitWriter();
      let numLenBits = 3;
      const increment = Math.max(0, (floorLog2(expectedLength) + 1) - (numLenBits + floorLog2(1)));
      encodeCommaCode(writer, increment);
      numLenBits += increment;
      writer.writeBits(expectedLength, numLenBits);

      const reader = new Jpeg2000PacketHeaderBitReader(writer.flush());
      const state = {
        included: false,
        firstLayer: -1,
        zeroBitPlanes: 0,
        numPassesTotal: 0,
        dataAccum: new Uint8Array(0),
        numLenBits: 3,
      };

      const decoded = decodeDataLengthWithReader(reader, 1, state, false);
      expect(decoded.dataLength).toBe(expectedLength);
    }
  });

  it("parses a simple first-inclusion packet header", () => {
    const parser = new Jpeg2000PacketHeaderParser(new Uint8Array([0xea, 0x80]), 1, 1);
    const packet = parser.parseHeader();

    expect(packet.headerPresent).toBe(true);
    expect(packet.codeBlockInclusions).toHaveLength(1);

    const inclusion = packet.codeBlockInclusions[0]!;
    expect(inclusion.included).toBe(true);
    expect(inclusion.firstInclusion).toBe(true);
    expect(inclusion.zeroBitplanes).toBe(0);
    expect(inclusion.numPasses).toBe(1);
    expect(inclusion.dataLength).toBe(10);
  });

  it("keeps inclusion and length state across layers for the same band", () => {
    const band: Jpeg2000PacketHeaderBandState = {
      numCodeBlocksX: 1,
      numCodeBlocksY: 1,
    };

    const layer0 = parsePacketHeaderMulti(new Uint8Array([0xea, 0x80]), 0, [band], false);
    expect(layer0.headerPresent).toBe(true);
    expect(layer0.codeBlockInclusions).toHaveLength(1);
    expect(layer0.codeBlockInclusions[0]!.firstInclusion).toBe(true);
    expect(layer0.codeBlockInclusions[0]!.dataLength).toBe(10);

    const layer1 = parsePacketHeaderMulti(new Uint8Array([0xca]), 1, [band], false);
    expect(layer1.headerPresent).toBe(true);
    expect(layer1.codeBlockInclusions).toHaveLength(1);
    expect(layer1.codeBlockInclusions[0]!.included).toBe(true);
    expect(layer1.codeBlockInclusions[0]!.firstInclusion).toBe(false);
    expect(layer1.codeBlockInclusions[0]!.dataLength).toBe(10);
  });

  it("resets parser position and inclusion state", () => {
    const parser = new Jpeg2000PacketHeaderParser(new Uint8Array([0xea, 0x80]), 1, 1);
    const first = parser.parseHeader();
    expect(first.codeBlockInclusions).toHaveLength(1);

    parser.reset();
    expect(parser.position()).toBe(0);

    const second = parser.parseHeader();
    expect(second.headerPresent).toBe(true);
    expect(second.codeBlockInclusions).toHaveLength(1);
    expect(second.codeBlockInclusions[0]!.firstInclusion).toBe(true);
  });
});

function encodeCommaCode(writer: Jpeg2000PacketHeaderBitWriter, value: number): void {
  for (let i = 0; i < value; i++) {
    writer.writeBit(1);
  }
  writer.writeBit(0);
}
