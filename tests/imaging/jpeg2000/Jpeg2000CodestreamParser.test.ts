import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DicomFile } from "../../../src/node/DicomFile.js";
import { DicomPixelData } from "../../../src/imaging/DicomPixelData.js";
import {
  Jpeg2000Marker,
  codCodeBlockSize,
  componentBitDepth,
  componentIsSigned,
  markerHasLength,
  markerName,
  parseJpeg2000Codestream,
} from "../../../src/imaging/codec/jpeg2000/core/codestream/index.js";

const ACCEPTANCE_DIR = "source-code/fo-dicom.Codecs/Tests/Acceptance";

describe("Jpeg2000CodestreamParser", () => {
  it("exposes marker metadata helpers", () => {
    expect(markerName(Jpeg2000Marker.SOC)).toBe("SOC");
    expect(markerName(Jpeg2000Marker.SIZ)).toBe("SIZ");
    expect(markerName(0xffff)).toBe("UNKNOWN");

    expect(markerHasLength(Jpeg2000Marker.SOC)).toBe(false);
    expect(markerHasLength(Jpeg2000Marker.SOD)).toBe(false);
    expect(markerHasLength(Jpeg2000Marker.EOC)).toBe(false);
    expect(markerHasLength(Jpeg2000Marker.SIZ)).toBe(true);
    expect(markerHasLength(Jpeg2000Marker.COD)).toBe(true);
  });

  it("parses a minimal codestream main header", () => {
    const codestream = parseJpeg2000Codestream(buildMinimalCodestream());
    expect(codestream.siz).toBeDefined();
    expect(codestream.cod).toBeDefined();
    expect(codestream.qcd).toBeDefined();

    const siz = codestream.siz!;
    expect(siz.xSiz).toBe(256);
    expect(siz.ySiz).toBe(256);
    expect(siz.cSiz).toBe(1);
    expect(componentBitDepth(siz.components[0]!)).toBe(8);
    expect(componentIsSigned(siz.components[0]!)).toBe(false);

    const cod = codestream.cod!;
    const block = codCodeBlockSize(cod);
    expect(block.width).toBe(16);
    expect(block.height).toBe(16);
    expect(cod.numberOfDecompositionLevels).toBe(5);
    expect(cod.transformation).toBe(1);
  });

  it("concatenates multi-tile-part payload for the same tile index", () => {
    const codestream = parseJpeg2000Codestream(buildMultiTilePartCodestream());
    expect(codestream.tiles.length).toBe(1);
    expect(codestream.tiles[0]!.index).toBe(0);
    expect(codestream.tiles[0]!.sot.tNsot).toBe(2);
    expect(Array.from(codestream.tiles[0]!.data)).toEqual([0x01, 0x02, 0x03, 0x04, 0x05]);
  });

  it("rejects conflicting COD/QCD/COC/QCC/POC tile-part headers for the same tile", () => {
    const cases = [
      {
        name: "COD conflict",
        data: buildTilePartConflictCodestream("cod"),
        pattern: /tile 0: COD differs between tile-parts/,
      },
      {
        name: "QCD conflict",
        data: buildTilePartConflictCodestream("qcd"),
        pattern: /tile 0: QCD differs between tile-parts/,
      },
      {
        name: "COC conflict",
        data: buildTilePartConflictCodestream("coc"),
        pattern: /tile 0: COC differs for component 1/,
      },
      {
        name: "QCC conflict",
        data: buildTilePartConflictCodestream("qcc"),
        pattern: /tile 0: QCC differs for component 1/,
      },
      {
        name: "POC conflict",
        data: buildTilePartConflictCodestream("poc"),
        pattern: /tile 0: POC differs between tile-parts/,
      },
      {
        name: "RGN conflict",
        data: buildTilePartConflictCodestream("rgn"),
        pattern: /tile 0: RGN differs between tile-parts/,
      },
    ] as const;

    for (const testCase of cases) {
      expect(() => parseJpeg2000Codestream(testCase.data), testCase.name).toThrow(testCase.pattern);
    }
  });

  it("rejects invalid tile-part ordering and TNsot consistency", () => {
    const cases = [
      {
        name: "first tile-part index is not zero",
        data: buildTilePartSequenceCodestream([
          { tilePartIndex: 1, totalTileParts: 2, payload: [0x01] },
        ]),
        pattern: /tile 0: first tile-part index is 1/,
      },
      {
        name: "unexpected tile-part index gap",
        data: buildTilePartSequenceCodestream([
          { tilePartIndex: 0, totalTileParts: 3, payload: [0x01] },
          { tilePartIndex: 2, totalTileParts: 3, payload: [0x02] },
        ]),
        pattern: /tile 0: unexpected tile-part index 2 \(expected 1\)/,
      },
      {
        name: "mismatched TNsot",
        data: buildTilePartSequenceCodestream([
          { tilePartIndex: 0, totalTileParts: 2, payload: [0x01] },
          { tilePartIndex: 1, totalTileParts: 3, payload: [0x02] },
        ]),
        pattern: /tile 0: mismatched TNsot 3 \(expected 2\)/,
      },
      {
        name: "tile-part count exceeded",
        data: buildTilePartSequenceCodestream([
          { tilePartIndex: 0, totalTileParts: 2, payload: [0x01] },
          { tilePartIndex: 1, totalTileParts: 2, payload: [0x02] },
          { tilePartIndex: 2, totalTileParts: 2, payload: [0x03] },
        ]),
        pattern: /tile 0: tile-part count exceeded \(TNsot=2\)/,
      },
    ] as const;

    for (const testCase of cases) {
      expect(() => parseJpeg2000Codestream(testCase.data), testCase.name).toThrow(testCase.pattern);
    }
  });

  it("parses real JPEG2000 acceptance fixture main metadata", async () => {
    const file = await DicomFile.open(join(ACCEPTANCE_DIR, "PM5644-960x540_JPEG2000-Lossless.dcm"));
    const frame = DicomPixelData.create(file.dataset).getFrame(0).data;

    const codestream = parseJpeg2000Codestream(frame);
    expect(codestream.siz).toBeDefined();
    expect(codestream.cod).toBeDefined();
    expect(codestream.qcd).toBeDefined();
    expect(codestream.siz!.xSiz).toBe(960);
    expect(codestream.siz!.ySiz).toBe(540);
    expect(codestream.siz!.cSiz).toBe(3);
    expect(codestream.tiles.length).toBeGreaterThan(0);
  });

  it("parses Part2 MCT/MCC/MCO marker segments from main header", () => {
    const codestream = parseJpeg2000Codestream(buildPart2MarkerCodestream());
    expect(codestream.mct).toHaveLength(2);
    expect(codestream.mct[0]!.index).toBe(1);
    expect(codestream.mct[0]!.arrayType).toBe(1);
    expect(codestream.mct[0]!.elementType).toBe(1);
    expect(codestream.mct[1]!.index).toBe(2);
    expect(codestream.mct[1]!.arrayType).toBe(2);

    expect(codestream.mcc).toHaveLength(1);
    expect(codestream.mcc[0]!.index).toBe(1);
    expect(codestream.mcc[0]!.componentIds).toEqual([0, 1, 2]);
    expect(codestream.mcc[0]!.decorrelateIndex).toBe(1);
    expect(codestream.mcc[0]!.offsetIndex).toBe(2);
    expect(codestream.mcc[0]!.reversible).toBe(true);

    expect(codestream.mco).toHaveLength(1);
    expect(codestream.mco[0]!.stageIndices).toEqual([1]);
  });

  it("parses RGN marker segments from main and tile headers", () => {
    const codestream = parseJpeg2000Codestream(buildRgnCodestream());

    expect(codestream.rgn).toHaveLength(1);
    expect(codestream.rgn[0]).toEqual({
      component: 0,
      style: 0,
      shift: 3,
    });

    expect(codestream.tiles).toHaveLength(1);
    expect(codestream.tiles[0]!.rgn).toHaveLength(1);
    expect(codestream.tiles[0]!.rgn[0]).toEqual({
      component: 1,
      style: 1,
      shift: 2,
    });
  });

  it("rejects conflicting duplicate tile-header COC/QCC segments for the same component", () => {
    const cases = [
      {
        name: "tile COC conflict",
        data: buildDuplicateTileHeaderComponentSegmentCodestream("coc", true),
        pattern: /duplicate tile COC for component 1/,
      },
      {
        name: "tile QCC conflict",
        data: buildDuplicateTileHeaderComponentSegmentCodestream("qcc", true),
        pattern: /duplicate tile QCC for component 1/,
      },
    ] as const;

    for (const testCase of cases) {
      expect(() => parseJpeg2000Codestream(testCase.data), testCase.name).toThrow(testCase.pattern);
    }
  });

  it("allows byte-equivalent duplicate tile-header COC/QCC segments for the same component", () => {
    const cocCodestream = parseJpeg2000Codestream(buildDuplicateTileHeaderComponentSegmentCodestream("coc", false));
    expect(cocCodestream.tiles).toHaveLength(1);
    expect(cocCodestream.tiles[0]!.coc.size).toBe(1);
    expect(cocCodestream.tiles[0]!.coc.get(1)?.codeBlockWidth).toBe(3);

    const qccCodestream = parseJpeg2000Codestream(buildDuplicateTileHeaderComponentSegmentCodestream("qcc", false));
    expect(qccCodestream.tiles).toHaveLength(1);
    expect(qccCodestream.tiles[0]!.qcc.size).toBe(1);
    expect(Array.from(qccCodestream.tiles[0]!.qcc.get(1)?.spQcc ?? [])).toEqual([0x12, 0x34]);
  });

  it("allows duplicate tile-header COD/QCD segments and keeps the last segment", () => {
    const codCodestream = parseJpeg2000Codestream(buildDuplicateTileHeaderCodQcdCodestream("cod"));
    expect(codCodestream.tiles).toHaveLength(1);
    expect(codCodestream.tiles[0]!.cod?.numberOfLayers).toBe(2);

    const qcdCodestream = parseJpeg2000Codestream(buildDuplicateTileHeaderCodQcdCodestream("qcd"));
    expect(qcdCodestream.tiles).toHaveLength(1);
    expect(Array.from(qcdCodestream.tiles[0]!.qcd?.spQcd ?? [])).toEqual([0x00, 0x01]);
  });

  it("parses COM marker segments from the main header", () => {
    const codestream = parseJpeg2000Codestream(buildComCodestream());

    expect(codestream.com).toHaveLength(1);
    expect(codestream.com[0]!.registration).toBe(0);
    expect(new TextDecoder().decode(codestream.com[0]!.data)).toBe("JP2ROI\x01\x00\x00");
  });

  it("parses COC/QCC/POC marker segments from main header", () => {
    const codestream = parseJpeg2000Codestream(buildCocQccPocCodestream());

    expect(codestream.coc.size).toBe(1);
    expect(codestream.qcc.size).toBe(1);
    expect(codestream.poc).toHaveLength(1);

    const coc = codestream.coc.get(1);
    expect(coc).toBeDefined();
    expect(coc!.component).toBe(1);
    expect(coc!.numberOfDecompositionLevels).toBe(2);
    expect(coc!.codeBlockWidth).toBe(3);
    expect(coc!.codeBlockHeight).toBe(4);
    expect(coc!.transformation).toBe(1);

    const qcc = codestream.qcc.get(1);
    expect(qcc).toBeDefined();
    expect(qcc!.component).toBe(1);
    expect(qcc!.sQcc).toBe(2);
    expect(Array.from(qcc!.spQcc)).toEqual([0x12, 0x34]);

    const poc = codestream.poc[0];
    expect(poc).toBeDefined();
    expect(poc!.entries).toHaveLength(1);
    expect(poc!.entries[0]).toEqual({
      rSpoc: 0,
      cSpoc: 0,
      lYEpoc: 1,
      rEpoc: 1,
      cEpoc: 2,
      pPoc: 0,
    });
  });

  it("enforces Go-aligned main-header marker ordering", () => {
    const cases = [
      {
        name: "COD before SIZ",
        data: buildMainHeaderOrderingCodestream("cod-before-siz"),
        pattern: /COD encountered before SIZ/,
      },
      {
        name: "QCD before SIZ",
        data: buildMainHeaderOrderingCodestream("qcd-before-siz"),
        pattern: /QCD encountered before SIZ/,
      },
      {
        name: "COC before SIZ",
        data: buildMainHeaderOrderingCodestream("coc-before-siz"),
        pattern: /COC encountered before SIZ/,
      },
      {
        name: "COC before COD",
        data: buildMainHeaderOrderingCodestream("coc-before-cod"),
        pattern: /COC encountered before COD/,
      },
      {
        name: "QCC before SIZ",
        data: buildMainHeaderOrderingCodestream("qcc-before-siz"),
        pattern: /QCC encountered before SIZ/,
      },
      {
        name: "QCC before QCD",
        data: buildMainHeaderOrderingCodestream("qcc-before-qcd"),
        pattern: /QCC encountered before QCD/,
      },
      {
        name: "POC before SIZ",
        data: buildMainHeaderOrderingCodestream("poc-before-siz"),
        pattern: /POC encountered before SIZ/,
      },
      {
        name: "POC before COD",
        data: buildMainHeaderOrderingCodestream("poc-before-cod"),
        pattern: /POC encountered before COD/,
      },
      {
        name: "RGN before SIZ",
        data: buildMainHeaderOrderingCodestream("rgn-before-siz"),
        pattern: /RGN encountered before SIZ/,
      },
      {
        name: "MCT before SIZ",
        data: buildMainHeaderOrderingCodestream("mct-before-siz"),
        pattern: /MCT encountered before SIZ/,
      },
      {
        name: "MCC before SIZ",
        data: buildMainHeaderOrderingCodestream("mcc-before-siz"),
        pattern: /MCC encountered before SIZ/,
      },
      {
        name: "MCO before SIZ",
        data: buildMainHeaderOrderingCodestream("mco-before-siz"),
        pattern: /MCO encountered before SIZ/,
      },
      {
        name: "unknown segment before SIZ",
        data: buildMainHeaderOrderingCodestream("unknown-before-siz"),
        pattern: /Unexpected marker before SIZ: 0xFF55 \(TLM\)/,
      },
    ] as const;

    for (const testCase of cases) {
      expect(() => parseJpeg2000Codestream(testCase.data), testCase.name).toThrow(testCase.pattern);
    }
  });

  it("rejects conflicting duplicate main-header COC/QCC segments for the same component", () => {
    const cases = [
      {
        name: "COC conflict",
        data: buildDuplicateMainHeaderComponentSegmentCodestream("coc", true),
        pattern: /Duplicate COC for component 1/,
      },
      {
        name: "QCC conflict",
        data: buildDuplicateMainHeaderComponentSegmentCodestream("qcc", true),
        pattern: /Duplicate QCC for component 1/,
      },
    ] as const;

    for (const testCase of cases) {
      expect(() => parseJpeg2000Codestream(testCase.data), testCase.name).toThrow(testCase.pattern);
    }
  });

  it("allows byte-equivalent duplicate main-header COC/QCC segments for the same component", () => {
    const cocCodestream = parseJpeg2000Codestream(buildDuplicateMainHeaderComponentSegmentCodestream("coc", false));
    expect(cocCodestream.coc.size).toBe(1);
    expect(cocCodestream.coc.get(1)?.codeBlockWidth).toBe(3);

    const qccCodestream = parseJpeg2000Codestream(buildDuplicateMainHeaderComponentSegmentCodestream("qcc", false));
    expect(qccCodestream.qcc.size).toBe(1);
    expect(Array.from(qccCodestream.qcc.get(1)?.spQcc ?? [])).toEqual([0x12, 0x34]);
  });

  it("rejects malformed codestream inputs", () => {
    const cases = [
      {
        name: "empty data",
        data: new Uint8Array(0),
        pattern: /Unexpected end of codestream while peeking marker|Expected SOC marker/,
      },
      {
        name: "only SOC",
        data: new Uint8Array([0xff, 0x4f]),
        pattern: /Unexpected end of codestream while peeking marker/,
      },
      {
        name: "missing EOC",
        data: buildIncompleteCodestream(),
        pattern: /missing EOC marker|Unexpected end of codestream while peeking marker/,
      },
      {
        name: "invalid marker after SOC",
        data: new Uint8Array([0xff, 0x4f, 0xff, 0xff]),
        pattern: /Unexpected marker before SIZ|Unexpected marker in main header|Unexpected end of codestream while reading uint16/,
      },
      {
        name: "truncated SIZ",
        data: buildTruncatedSizCodestream(),
        pattern: /SIZ segment exceeds codestream length|Unexpected end of codestream/,
      },
      {
        name: "COM before SIZ",
        data: buildComBeforeSizCodestream(),
        pattern: /COM encountered before SIZ/,
      },
    ] as const;

    for (const testCase of cases) {
      expect(() => parseJpeg2000Codestream(testCase.data), testCase.name).toThrow(testCase.pattern);
    }
  });
});

function buildMinimalCodestream(): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);

  // SIZ: Lsiz=41 (38 + 3 * 1)
  pushU16(bytes, Jpeg2000Marker.SIZ);
  pushU16(bytes, 41);
  pushU16(bytes, 0); // Rsiz
  pushU32(bytes, 256); // Xsiz
  pushU32(bytes, 256); // Ysiz
  pushU32(bytes, 0); // XOsiz
  pushU32(bytes, 0); // YOsiz
  pushU32(bytes, 256); // XTsiz
  pushU32(bytes, 256); // YTsiz
  pushU32(bytes, 0); // XTOsiz
  pushU32(bytes, 0); // YTOsiz
  pushU16(bytes, 1); // Csiz
  bytes.push(7, 1, 1); // Ssiz, XRsiz, YRsiz

  // COD: Lcod=12
  pushU16(bytes, Jpeg2000Marker.COD);
  pushU16(bytes, 12);
  bytes.push(
    0, // Scod
    0, // ProgressionOrder
  );
  pushU16(bytes, 1); // NumberOfLayers
  bytes.push(
    0, // MCT
    5, // NumDecompositionLevels
    2, // Cblk width exponent
    2, // Cblk height exponent
    0, // Cblk style
    1, // Transform (5/3)
  );

  // QCD: Lqcd=5
  pushU16(bytes, Jpeg2000Marker.QCD);
  pushU16(bytes, 5);
  bytes.push(0, 0, 0);

  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function buildMultiTilePartCodestream(): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);

  // Reuse same minimal SIZ/COD/QCD setup.
  const mainHeader = buildMinimalCodestream();
  bytes.push(...mainHeader.subarray(2, mainHeader.length - 2));

  writeTilePart(bytes, 0, 0, 2, new Uint8Array([0x01, 0x02]));
  writeTilePart(bytes, 0, 1, 2, new Uint8Array([0x03, 0x04, 0x05]));

  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function buildPart2MarkerCodestream(): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);
  bytes.push(...buildMinimalCodestream().subarray(2, -2));

  // MCT #1: decorrelation matrix, int32, index=1.
  pushU16(bytes, Jpeg2000Marker.MCT);
  const matrixData = new Uint8Array(36);
  const matrixView = new DataView(matrixData.buffer);
  matrixView.setInt32(0, 1, false);
  matrixView.setInt32(16, 1, false);
  matrixView.setInt32(32, 1, false);
  const mct1PayloadLength = 6 + matrixData.length;
  pushU16(bytes, mct1PayloadLength + 2);
  pushU16(bytes, 0); // Zmct
  pushU16(bytes, 0x0501); // index=1, arrayType=1, elementType=1
  pushU16(bytes, 0); // Ymct
  bytes.push(...matrixData);

  // MCT #2: offsets, int32, index=2.
  pushU16(bytes, Jpeg2000Marker.MCT);
  const offsetData = new Uint8Array(12);
  const offsetView = new DataView(offsetData.buffer);
  offsetView.setInt32(0, 10, false);
  offsetView.setInt32(4, -5, false);
  offsetView.setInt32(8, 2, false);
  const mct2PayloadLength = 6 + offsetData.length;
  pushU16(bytes, mct2PayloadLength + 2);
  pushU16(bytes, 0); // Zmct
  pushU16(bytes, 0x0602); // index=2, arrayType=2, elementType=1
  pushU16(bytes, 0); // Ymct
  bytes.push(...offsetData);

  // MCC: bind components [0,1,2] with decorrelation index 1 and offset index 2.
  pushU16(bytes, Jpeg2000Marker.MCC);
  pushU16(bytes, 23);
  pushU16(bytes, 0); // Zmcc
  bytes.push(1); // Imcc
  pushU16(bytes, 0); // Ymcc
  pushU16(bytes, 1); // Qmcc
  bytes.push(0); // collectionType
  pushU16(bytes, 3); // Nmcci
  bytes.push(0, 1, 2); // component IDs
  pushU16(bytes, 3); // Mmcci
  bytes.push(0, 1, 2); // output component IDs
  bytes.push(0x01, 0x02, 0x01); // Tmcc: reversible=1, offset=2, decorrelate=1

  // MCO: one stage (index 1).
  pushU16(bytes, Jpeg2000Marker.MCO);
  pushU16(bytes, 4);
  bytes.push(1, 1);

  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function buildTilePartConflictCodestream(kind: "cod" | "qcd" | "coc" | "qcc" | "poc" | "rgn"): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);

  pushU16(bytes, Jpeg2000Marker.SIZ);
  pushU16(bytes, 44);
  pushU16(bytes, 0);
  pushU32(bytes, 256);
  pushU32(bytes, 256);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU32(bytes, 256);
  pushU32(bytes, 256);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU16(bytes, 2);
  bytes.push(7, 1, 1);
  bytes.push(7, 1, 1);

  pushU16(bytes, Jpeg2000Marker.COD);
  pushU16(bytes, 12);
  bytes.push(0, 0);
  pushU16(bytes, 1);
  bytes.push(0, 1, 2, 2, 0, 1);

  pushU16(bytes, Jpeg2000Marker.QCD);
  pushU16(bytes, 5);
  bytes.push(0, 0, 0);

  const firstHeader = new Uint8Array(buildConflictTileHeader(kind, false));
  const secondHeader = new Uint8Array(buildConflictTileHeader(kind, true));
  writeTilePartWithHeader(bytes, 0, 0, 2, firstHeader, new Uint8Array([0x01]));
  writeTilePartWithHeader(bytes, 0, 1, 2, secondHeader, new Uint8Array([0x02]));

  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function buildTilePartSequenceCodestream(
  parts: readonly { tilePartIndex: number; totalTileParts: number; payload: readonly number[] }[],
): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);
  bytes.push(...buildMinimalCodestream().subarray(2, buildMinimalCodestream().length - 2));

  for (const part of parts) {
    writeTilePart(bytes, 0, part.tilePartIndex, part.totalTileParts, new Uint8Array(part.payload));
  }

  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function buildRgnCodestream(): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);

  pushU16(bytes, Jpeg2000Marker.SIZ);
  pushU16(bytes, 44);
  pushU16(bytes, 0);
  pushU32(bytes, 256);
  pushU32(bytes, 256);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU32(bytes, 256);
  pushU32(bytes, 256);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU16(bytes, 2);
  bytes.push(7, 1, 1);
  bytes.push(7, 1, 1);

  pushU16(bytes, Jpeg2000Marker.COD);
  pushU16(bytes, 12);
  bytes.push(0, 0);
  pushU16(bytes, 1);
  bytes.push(0, 1, 2, 2, 0, 1);

  pushU16(bytes, Jpeg2000Marker.QCD);
  pushU16(bytes, 5);
  bytes.push(0, 0, 0);

  pushU16(bytes, Jpeg2000Marker.RGN);
  pushU16(bytes, 5);
  bytes.push(0, 0, 3);

  const tileHeader = new Uint8Array([
    0xff, 0x5e,
    0x00, 0x05,
    0x01, 0x01, 0x02,
  ]);
  writeTilePartWithHeader(bytes, 0, 0, 1, tileHeader, new Uint8Array([0x00]));

  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function buildComCodestream(): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);
  bytes.push(...buildMinimalCodestream().subarray(2, buildMinimalCodestream().length - 2));

  pushU16(bytes, Jpeg2000Marker.COM);
  pushU16(bytes, 13);
  pushU16(bytes, 0);
  bytes.push(
    0x4a, 0x50, 0x32, 0x52, 0x4f, 0x49,
    0x01,
    0x00, 0x00,
  );

  pushU16(bytes, Jpeg2000Marker.EOC);

  return new Uint8Array(bytes);
}

function buildCocQccPocCodestream(): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);

  pushU16(bytes, Jpeg2000Marker.SIZ);
  pushU16(bytes, 44);
  pushU16(bytes, 0);
  pushU32(bytes, 256);
  pushU32(bytes, 256);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU32(bytes, 256);
  pushU32(bytes, 256);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU16(bytes, 2);
  bytes.push(7, 1, 1);
  bytes.push(7, 1, 1);

  pushU16(bytes, Jpeg2000Marker.COD);
  pushU16(bytes, 12);
  bytes.push(0, 0);
  pushU16(bytes, 1);
  bytes.push(0, 1, 2, 2, 0, 1);

  pushU16(bytes, Jpeg2000Marker.QCD);
  pushU16(bytes, 5);
  bytes.push(0, 0, 0);

  pushU16(bytes, Jpeg2000Marker.COC);
  pushU16(bytes, 9);
  bytes.push(
    1, // component
    0, // Scoc
    2, // levels
    3, // cblk width exp
    4, // cblk height exp
    0, // cblk style
    1, // transform
  );

  pushU16(bytes, Jpeg2000Marker.QCC);
  pushU16(bytes, 6);
  bytes.push(
    1, // component
    2, // Sqcc
    0x12,
    0x34,
  );

  pushU16(bytes, Jpeg2000Marker.POC);
  pushU16(bytes, 9);
  bytes.push(
    0, // RSpoc
    0, // CSpoc
    0x00, 0x01, // LYEpoc
    1, // REpoc
    2, // CEpoc
    0, // PPoc
  );

  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function buildConflictTileHeader(kind: "cod" | "qcd" | "coc" | "qcc" | "poc" | "rgn", conflicting: boolean): number[] {
  const bytes: number[] = [];

  switch (kind) {
    case "cod":
      pushU16(bytes, Jpeg2000Marker.COD);
      pushU16(bytes, 12);
      bytes.push(0, 0);
      pushU16(bytes, conflicting ? 2 : 1);
      bytes.push(0, 1, 2, 2, 0, 1);
      break;
    case "qcd":
      pushU16(bytes, Jpeg2000Marker.QCD);
      pushU16(bytes, 5);
      bytes.push(0, 0, conflicting ? 1 : 0);
      break;
    case "coc":
      pushU16(bytes, Jpeg2000Marker.COC);
      pushU16(bytes, 9);
      bytes.push(
        1,
        0,
        2,
        conflicting ? 4 : 3,
        4,
        0,
        1,
      );
      break;
    case "qcc":
      pushU16(bytes, Jpeg2000Marker.QCC);
      pushU16(bytes, 6);
      bytes.push(
        1,
        2,
        0x12,
        conflicting ? 0x35 : 0x34,
      );
      break;
    case "poc":
      pushU16(bytes, Jpeg2000Marker.POC);
      pushU16(bytes, 9);
      bytes.push(
        0,
        0,
        0x00, 0x01,
        1,
        2,
        conflicting ? 1 : 0,
      );
      break;
    case "rgn":
      pushU16(bytes, Jpeg2000Marker.RGN);
      pushU16(bytes, 5);
      bytes.push(
        1,
        0,
        conflicting ? 4 : 3,
      );
      break;
  }

  return bytes;
}

function buildIncompleteCodestream(): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);
  bytes.push(...buildMinimalCodestream().subarray(2, buildMinimalCodestream().length - 2));
  return new Uint8Array(bytes);
}

function buildTruncatedSizCodestream(): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);
  pushU16(bytes, Jpeg2000Marker.SIZ);
  pushU16(bytes, 10);
  return new Uint8Array(bytes);
}

function buildComBeforeSizCodestream(): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);
  pushU16(bytes, Jpeg2000Marker.COM);
  pushU16(bytes, 4);
  pushU16(bytes, 0);
  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function buildDuplicateTileHeaderComponentSegmentCodestream(
  kind: "coc" | "qcc",
  conflicting: boolean,
): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);
  appendTwoComponentSizSegment(bytes);
  appendCodSegment(bytes);
  appendQcdSegment(bytes);

  const tileHeader = new Uint8Array([
    ...buildConflictTileHeader(kind, false),
    ...buildConflictTileHeader(kind, conflicting),
  ]);
  writeTilePartWithHeader(bytes, 0, 0, 1, tileHeader, new Uint8Array([0x00]));

  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function buildDuplicateTileHeaderCodQcdCodestream(kind: "cod" | "qcd"): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);
  appendTwoComponentSizSegment(bytes);
  appendCodSegment(bytes);
  appendQcdSegment(bytes);

  const tileHeader = new Uint8Array([
    ...buildConflictTileHeader(kind, false),
    ...buildConflictTileHeader(kind, true),
  ]);
  writeTilePartWithHeader(bytes, 0, 0, 1, tileHeader, new Uint8Array([0x00]));

  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function buildMainHeaderOrderingCodestream(
  kind:
    | "cod-before-siz"
    | "qcd-before-siz"
    | "coc-before-siz"
    | "coc-before-cod"
    | "qcc-before-siz"
    | "qcc-before-qcd"
    | "poc-before-siz"
    | "poc-before-cod"
    | "rgn-before-siz"
    | "mct-before-siz"
    | "mcc-before-siz"
    | "mco-before-siz"
    | "unknown-before-siz",
): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);

  switch (kind) {
    case "cod-before-siz":
      appendCodSegment(bytes);
      appendTwoComponentSizSegment(bytes);
      appendQcdSegment(bytes);
      break;
    case "qcd-before-siz":
      appendQcdSegment(bytes);
      appendTwoComponentSizSegment(bytes);
      appendCodSegment(bytes);
      break;
    case "coc-before-siz":
      appendCocSegment(bytes, false);
      appendTwoComponentSizSegment(bytes);
      appendCodSegment(bytes);
      appendQcdSegment(bytes);
      break;
    case "coc-before-cod":
      appendTwoComponentSizSegment(bytes);
      appendCocSegment(bytes, false);
      appendCodSegment(bytes);
      appendQcdSegment(bytes);
      break;
    case "qcc-before-siz":
      appendQccSegment(bytes, false);
      appendTwoComponentSizSegment(bytes);
      appendCodSegment(bytes);
      appendQcdSegment(bytes);
      break;
    case "qcc-before-qcd":
      appendTwoComponentSizSegment(bytes);
      appendCodSegment(bytes);
      appendQccSegment(bytes, false);
      appendQcdSegment(bytes);
      break;
    case "poc-before-siz":
      appendPocSegment(bytes);
      appendTwoComponentSizSegment(bytes);
      appendCodSegment(bytes);
      appendQcdSegment(bytes);
      break;
    case "poc-before-cod":
      appendTwoComponentSizSegment(bytes);
      appendPocSegment(bytes);
      appendCodSegment(bytes);
      appendQcdSegment(bytes);
      break;
    case "rgn-before-siz":
      appendRgnSegment(bytes);
      appendTwoComponentSizSegment(bytes);
      appendCodSegment(bytes);
      appendQcdSegment(bytes);
      break;
    case "mct-before-siz":
      appendMctSegment(bytes);
      appendTwoComponentSizSegment(bytes);
      appendCodSegment(bytes);
      appendQcdSegment(bytes);
      break;
    case "mcc-before-siz":
      appendMccSegment(bytes);
      appendTwoComponentSizSegment(bytes);
      appendCodSegment(bytes);
      appendQcdSegment(bytes);
      break;
    case "mco-before-siz":
      appendMcoSegment(bytes);
      appendTwoComponentSizSegment(bytes);
      appendCodSegment(bytes);
      appendQcdSegment(bytes);
      break;
    case "unknown-before-siz":
      appendUnknownMainHeaderSegment(bytes);
      appendTwoComponentSizSegment(bytes);
      appendCodSegment(bytes);
      appendQcdSegment(bytes);
      break;
  }

  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function buildDuplicateMainHeaderComponentSegmentCodestream(
  kind: "coc" | "qcc",
  conflicting: boolean,
): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);
  appendTwoComponentSizSegment(bytes);
  appendCodSegment(bytes);
  appendQcdSegment(bytes);

  if (kind === "coc") {
    appendCocSegment(bytes, false);
    appendCocSegment(bytes, conflicting);
  } else {
    appendQccSegment(bytes, false);
    appendQccSegment(bytes, conflicting);
  }

  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function appendTwoComponentSizSegment(target: number[]): void {
  pushU16(target, Jpeg2000Marker.SIZ);
  pushU16(target, 44);
  pushU16(target, 0);
  pushU32(target, 256);
  pushU32(target, 256);
  pushU32(target, 0);
  pushU32(target, 0);
  pushU32(target, 256);
  pushU32(target, 256);
  pushU32(target, 0);
  pushU32(target, 0);
  pushU16(target, 2);
  target.push(7, 1, 1);
  target.push(7, 1, 1);
}

function appendCodSegment(target: number[]): void {
  pushU16(target, Jpeg2000Marker.COD);
  pushU16(target, 12);
  target.push(0, 0);
  pushU16(target, 1);
  target.push(0, 1, 2, 2, 0, 1);
}

function appendQcdSegment(target: number[]): void {
  pushU16(target, Jpeg2000Marker.QCD);
  pushU16(target, 5);
  target.push(0, 0, 0);
}

function appendCocSegment(target: number[], conflicting: boolean): void {
  pushU16(target, Jpeg2000Marker.COC);
  pushU16(target, 9);
  target.push(
    1,
    0,
    2,
    conflicting ? 4 : 3,
    4,
    0,
    1,
  );
}

function appendQccSegment(target: number[], conflicting: boolean): void {
  pushU16(target, Jpeg2000Marker.QCC);
  pushU16(target, 6);
  target.push(
    1,
    2,
    0x12,
    conflicting ? 0x35 : 0x34,
  );
}

function appendPocSegment(target: number[]): void {
  pushU16(target, Jpeg2000Marker.POC);
  pushU16(target, 9);
  target.push(
    0,
    0,
    0x00, 0x01,
    1,
    2,
    0,
  );
}

function appendRgnSegment(target: number[]): void {
  pushU16(target, Jpeg2000Marker.RGN);
  pushU16(target, 5);
  target.push(0, 0, 3);
}

function appendMctSegment(target: number[]): void {
  pushU16(target, Jpeg2000Marker.MCT);
  pushU16(target, 12);
  pushU16(target, 0);
  pushU16(target, 0x0501);
  pushU16(target, 0);
  target.push(0x00, 0x00, 0x00, 0x01);
}

function appendMccSegment(target: number[]): void {
  pushU16(target, Jpeg2000Marker.MCC);
  pushU16(target, 23);
  pushU16(target, 0);
  target.push(1);
  pushU16(target, 0);
  pushU16(target, 1);
  target.push(0);
  pushU16(target, 3);
  target.push(0, 1, 2);
  pushU16(target, 3);
  target.push(0, 1, 2);
  target.push(0x01, 0x02, 0x01);
}

function appendMcoSegment(target: number[]): void {
  pushU16(target, Jpeg2000Marker.MCO);
  pushU16(target, 4);
  target.push(1, 1);
}

function appendUnknownMainHeaderSegment(target: number[]): void {
  pushU16(target, Jpeg2000Marker.TLM);
  pushU16(target, 4);
  target.push(0, 0);
}

function writeTilePart(
  target: number[],
  tileIndex: number,
  tilePartIndex: number,
  totalTileParts: number,
  payload: Uint8Array,
): void {
  pushU16(target, Jpeg2000Marker.SOT);
  pushU16(target, 10); // Lsot
  pushU16(target, tileIndex);
  pushU32(target, 14 + payload.length); // Psot = SOT segment + SOD marker + payload
  target.push(tilePartIndex & 0xff, totalTileParts & 0xff);
  pushU16(target, Jpeg2000Marker.SOD);
  target.push(...payload);
}

function writeTilePartWithHeader(
  target: number[],
  tileIndex: number,
  tilePartIndex: number,
  totalTileParts: number,
  header: Uint8Array,
  payload: Uint8Array,
): void {
  pushU16(target, Jpeg2000Marker.SOT);
  pushU16(target, 10);
  pushU16(target, tileIndex);
  pushU32(target, 14 + header.length + payload.length);
  target.push(tilePartIndex & 0xff, totalTileParts & 0xff);
  target.push(...header);
  pushU16(target, Jpeg2000Marker.SOD);
  target.push(...payload);
}

function pushU16(target: number[], value: number): void {
  target.push((value >>> 8) & 0xff, value & 0xff);
}

function pushU32(target: number[], value: number): void {
  target.push(
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 8) & 0xff,
    value & 0xff,
  );
}
