import { describe, expect, it } from "vitest";
import {
  Jpeg2000PacketDecoder,
  Jpeg2000ProgressionOrder,
} from "../../../src/imaging/codec/jpeg2000/core/index.js";

describe("Jpeg2000PacketDecoder", () => {
  it("decodes a single LRCP packet with one code-block contribution", () => {
    const data = new Uint8Array([
      0xe3, // header: present + first inclusion + zbp=0 + 1 pass + len=3
      0x11,
      0x22,
      0x33,
    ]);

    const decoder = new Jpeg2000PacketDecoder(
      data,
      1,
      1,
      1,
      Jpeg2000ProgressionOrder.LRCP,
      0,
    );
    decoder.setBandCodeBlockGrid(0, 0, 0, 0, 1, 1);

    const packets = decoder.decodePackets();
    expect(packets).toHaveLength(1);

    const packet = packets[0]!;
    expect(packet.headerPresent).toBe(true);
    expect(packet.layerIndex).toBe(0);
    expect(packet.resolutionLevel).toBe(0);
    expect(packet.componentIndex).toBe(0);
    expect(packet.precinctIndex).toBe(0);

    expect(packet.codeBlockInclusions).toHaveLength(1);
    const inclusion = packet.codeBlockInclusions[0]!;
    expect(inclusion.included).toBe(true);
    expect(inclusion.firstInclusion).toBe(true);
    expect(inclusion.numPasses).toBe(1);
    expect(inclusion.dataLength).toBe(3);
    expect([...inclusion.data]).toEqual([0x11, 0x22, 0x33]);
    expect([...packet.body]).toEqual([0x11, 0x22, 0x33]);
  });

  it("reuses packet header state across layers", () => {
    const data = new Uint8Array([
      0xe2, // layer 0 header: first inclusion + len=2
      0xaa,
      0xbb,
      0xc6, // layer 1 header: already included + len=3
      0xcc,
      0xdd,
      0xee,
    ]);

    const decoder = new Jpeg2000PacketDecoder(
      data,
      1,
      2,
      1,
      Jpeg2000ProgressionOrder.LRCP,
      0,
    );
    decoder.setBandCodeBlockGrid(0, 0, 0, 0, 1, 1);

    const packets = decoder.decodePackets();
    expect(packets).toHaveLength(2);

    expect(packets[0]!.codeBlockInclusions[0]!.firstInclusion).toBe(true);
    expect(packets[0]!.codeBlockInclusions[0]!.dataLength).toBe(2);
    expect([...packets[0]!.body]).toEqual([0xaa, 0xbb]);

    expect(packets[1]!.codeBlockInclusions[0]!.included).toBe(true);
    expect(packets[1]!.codeBlockInclusions[0]!.firstInclusion).toBe(false);
    expect(packets[1]!.codeBlockInclusions[0]!.dataLength).toBe(3);
    expect([...packets[1]!.body]).toEqual([0xcc, 0xdd, 0xee]);
  });

  it("iterates packets in RLCP order", () => {
    const decoder = new Jpeg2000PacketDecoder(
      new Uint8Array(0),
      2,
      1,
      2,
      Jpeg2000ProgressionOrder.RLCP,
      0,
    );

    decoder.setPrecinctIndices(0, 0, [0]);
    decoder.setPrecinctIndices(1, 0, [0]);
    decoder.setPrecinctIndices(0, 1, [0]);
    decoder.setPrecinctIndices(1, 1, [0]);

    const packets = decoder.decodePackets();
    expect(packets).toHaveLength(4);

    expect([packets[0]!.resolutionLevel, packets[0]!.componentIndex]).toEqual([0, 0]);
    expect([packets[1]!.resolutionLevel, packets[1]!.componentIndex]).toEqual([0, 1]);
    expect([packets[2]!.resolutionLevel, packets[2]!.componentIndex]).toEqual([1, 0]);
    expect([packets[3]!.resolutionLevel, packets[3]!.componentIndex]).toEqual([1, 1]);
  });

  it("iterates RPCL packets by precinct position instead of raw precinct index", () => {
    const decoder = new Jpeg2000PacketDecoder(
      new Uint8Array(0),
      2,
      1,
      1,
      Jpeg2000ProgressionOrder.RPCL,
      0,
    );

    decoder.setImageDimensions(64, 32, 16, 16);
    decoder.setPrecinctSize(32, 32);
    decoder.setComponentBounds(0, 0, 0, 64, 32);
    decoder.setComponentBounds(1, 32, 0, 64, 32);

    const packets = decoder.decodePackets();
    expect(packets).toHaveLength(3);
    expect(packets.map((packet) => [packet.componentIndex, packet.precinctIndex])).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
    ]);
  });

  it("iterates PCRL packets by precinct position instead of raw precinct index", () => {
    const decoder = new Jpeg2000PacketDecoder(
      new Uint8Array(0),
      2,
      1,
      1,
      Jpeg2000ProgressionOrder.PCRL,
      0,
    );

    decoder.setImageDimensions(64, 32, 16, 16);
    decoder.setPrecinctSize(32, 32);
    decoder.setComponentBounds(0, 0, 0, 64, 32);
    decoder.setComponentBounds(1, 32, 0, 64, 32);

    const packets = decoder.decodePackets();
    expect(packets).toHaveLength(3);
    expect(packets.map((packet) => [packet.componentIndex, packet.precinctIndex])).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
    ]);
  });

  it("builds precinct/code-block geometry from image settings", () => {
    const data = new Uint8Array([0xe2, 0xaa, 0xbb]);
    const decoder = new Jpeg2000PacketDecoder(
      data,
      1,
      1,
      1,
      Jpeg2000ProgressionOrder.LRCP,
      0,
    );

    decoder.setImageDimensions(16, 16, 16, 16);
    decoder.setComponentBounds(0, 0, 0, 16, 16);

    const packets = decoder.decodePackets();
    expect(packets).toHaveLength(1);
    expect(packets[0]!.headerPresent).toBe(true);
    expect(packets[0]!.codeBlockInclusions).toHaveLength(1);
    expect(packets[0]!.codeBlockInclusions[0]!.dataLength).toBe(2);
    expect([...packets[0]!.body]).toEqual([0xaa, 0xbb]);
  });
});
