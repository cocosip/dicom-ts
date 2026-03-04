import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DicomFile } from "../../../src/DicomFile.js";
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
