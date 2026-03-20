import { describe, expect, it } from "vitest";
import {
  Jpeg2000PacketDecoder,
  Jpeg2000ProgressionOrder,
  encodePackets,
  encodePacketsLrcp,
  encodePacketsSingleLayerLrcp,
  type Jpeg2000PacketPlan,
} from "../../../src/imaging/codec/jpeg2000/core/index.js";

describe("Jpeg2000PacketEncoder", () => {
  it("encodes single-layer LRCP packet header/body that decoder can parse", () => {
    const packetPlans: Jpeg2000PacketPlan[] = [
      {
        layerIndex: 0,
        resolutionLevel: 0,
        componentIndex: 0,
        precinctIndex: 0,
        bands: [
          {
            band: 0,
            numCodeBlocksX: 1,
            numCodeBlocksY: 1,
            entries: [{ cbx: 0, cby: 0, globalCodeBlockIndex: 0 }],
          },
        ],
      },
    ];

    const encoded = encodePacketsSingleLayerLrcp(
      packetPlans,
      new Map([
        ["0:0:0", {
          componentIndex: 0,
          resolutionLevel: 0,
          band: 0,
          globalCodeBlockIndex: 0,
          numPasses: 1,
          zeroBitplanes: 0,
          data: new Uint8Array([0x11, 0x22, 0x33]),
        }],
      ]),
    );

    const decoder = new Jpeg2000PacketDecoder(
      encoded,
      1,
      1,
      1,
      Jpeg2000ProgressionOrder.LRCP,
      0,
    );
    decoder.setBandCodeBlockGrid(0, 0, 0, 0, 1, 1);

    const packets = decoder.decodePackets();
    expect(packets).toHaveLength(1);
    expect(packets[0]!.headerPresent).toBe(true);
    expect(packets[0]!.codeBlockInclusions).toHaveLength(1);
    expect(packets[0]!.codeBlockInclusions[0]!.included).toBe(true);
    expect(packets[0]!.codeBlockInclusions[0]!.numPasses).toBe(1);
    expect([...packets[0]!.body]).toEqual([0x11, 0x22, 0x33]);
  });

  it("encodes layered LRCP packet data with TERMALL pass lengths", () => {
    const packetPlans: Jpeg2000PacketPlan[] = [
      {
        layerIndex: 0,
        resolutionLevel: 0,
        componentIndex: 0,
        precinctIndex: 0,
        bands: [
          {
            band: 0,
            numCodeBlocksX: 1,
            numCodeBlocksY: 1,
            entries: [{ cbx: 0, cby: 0, globalCodeBlockIndex: 0 }],
          },
        ],
      },
      {
        layerIndex: 1,
        resolutionLevel: 0,
        componentIndex: 0,
        precinctIndex: 0,
        bands: [
          {
            band: 0,
            numCodeBlocksX: 1,
            numCodeBlocksY: 1,
            entries: [{ cbx: 0, cby: 0, globalCodeBlockIndex: 0 }],
          },
        ],
      },
    ];

    const encoded = encodePacketsLrcp(
      packetPlans,
      new Map([
        ["0:0:0:0", {
          layerIndex: 0,
          componentIndex: 0,
          resolutionLevel: 0,
          band: 0,
          globalCodeBlockIndex: 0,
          numPasses: 1,
          zeroBitplanes: 0,
          data: new Uint8Array([0xaa, 0xbb]),
          passLengths: [2],
          useTermAll: true,
        }],
        ["1:0:0:0", {
          layerIndex: 1,
          componentIndex: 0,
          resolutionLevel: 0,
          band: 0,
          globalCodeBlockIndex: 0,
          numPasses: 1,
          zeroBitplanes: 0,
          data: new Uint8Array([0xcc, 0xdd]),
          passLengths: [2],
          useTermAll: true,
        }],
      ]),
    );

    const decoder = new Jpeg2000PacketDecoder(
      encoded,
      1,
      2,
      1,
      Jpeg2000ProgressionOrder.LRCP,
      0x04,
    );
    decoder.setBandCodeBlockGrid(0, 0, 0, 0, 1, 1);

    const packets = decoder.decodePackets();
    expect(packets).toHaveLength(2);
    expect(packets[0]!.headerPresent).toBe(true);
    expect(packets[1]!.headerPresent).toBe(true);
    expect(packets[0]!.codeBlockInclusions[0]!.numPasses).toBe(1);
    expect(packets[1]!.codeBlockInclusions[0]!.numPasses).toBe(1);
    expect([...packets[0]!.body]).toEqual([0xaa, 0xbb]);
    expect([...packets[1]!.body]).toEqual([0xcc, 0xdd]);
  });

  it("encodes packet bodies in the requested progression order", () => {
    const packetPlans: Jpeg2000PacketPlan[] = [];
    const contributions = new Map();

    for (let layerIndex = 0; layerIndex < 2; layerIndex++) {
      for (let resolutionLevel = 0; resolutionLevel < 2; resolutionLevel++) {
        for (let componentIndex = 0; componentIndex < 2; componentIndex++) {
          const band = resolutionLevel === 0 ? 0 : 1;
          packetPlans.push({
            layerIndex,
            resolutionLevel,
            componentIndex,
            precinctIndex: 0,
            bands: [
              {
                band,
                numCodeBlocksX: 1,
                numCodeBlocksY: 1,
                entries: [{ cbx: 0, cby: 0, globalCodeBlockIndex: 0 }],
              },
            ],
          });

          const id = packetId(layerIndex, resolutionLevel, componentIndex);
          contributions.set(`${layerIndex}:${componentIndex}:${resolutionLevel}:0`, {
            layerIndex,
            componentIndex,
            resolutionLevel,
            band,
            globalCodeBlockIndex: 0,
            numPasses: 1,
            zeroBitplanes: 0,
            data: new Uint8Array([id]),
          });
        }
      }
    }

    const cases = [
      {
        order: Jpeg2000ProgressionOrder.RLCP,
        expected: [
          [0, 0, 0],
          [0, 0, 1],
          [1, 0, 0],
          [1, 0, 1],
          [0, 1, 0],
          [0, 1, 1],
          [1, 1, 0],
          [1, 1, 1],
        ],
      },
      {
        order: Jpeg2000ProgressionOrder.RPCL,
        expected: [
          [0, 0, 0],
          [1, 0, 0],
          [0, 0, 1],
          [1, 0, 1],
          [0, 1, 0],
          [1, 1, 0],
          [0, 1, 1],
          [1, 1, 1],
        ],
      },
      {
        order: Jpeg2000ProgressionOrder.PCRL,
        expected: [
          [0, 0, 0],
          [1, 0, 0],
          [0, 1, 0],
          [1, 1, 0],
          [0, 0, 1],
          [1, 0, 1],
          [0, 1, 1],
          [1, 1, 1],
        ],
      },
      {
        order: Jpeg2000ProgressionOrder.CPRL,
        expected: [
          [0, 0, 0],
          [1, 0, 0],
          [0, 1, 0],
          [1, 1, 0],
          [0, 0, 1],
          [1, 0, 1],
          [0, 1, 1],
          [1, 1, 1],
        ],
      },
    ] as const;

    for (const testCase of cases) {
      const encoded = encodePackets(packetPlans, contributions, testCase.order);
      const decoder = new Jpeg2000PacketDecoder(
        encoded,
        2,
        2,
        2,
        testCase.order,
        0,
      );
      decoder.setBandCodeBlockGrid(0, 0, 0, 0, 1, 1);
      decoder.setBandCodeBlockGrid(1, 0, 0, 0, 1, 1);
      decoder.setBandCodeBlockGrid(0, 1, 0, 1, 1, 1);
      decoder.setBandCodeBlockGrid(1, 1, 0, 1, 1, 1);

      const packets = decoder.decodePackets();
      expect(packets).toHaveLength(testCase.expected.length);

      const actual = packets.map((packet) => [
        packet.layerIndex,
        packet.resolutionLevel,
        packet.componentIndex,
      ]);
      expect(actual, `progression=${testCase.order} packet order`).toEqual(testCase.expected);

      for (const packet of packets) {
        expect(packet.body[0], `progression=${testCase.order} body id`).toBe(
          packetId(packet.layerIndex, packet.resolutionLevel, packet.componentIndex),
        );
      }
    }
  });
});

function packetId(layerIndex: number, resolutionLevel: number, componentIndex: number): number {
  return (layerIndex * 16) + (resolutionLevel * 4) + componentIndex;
}
