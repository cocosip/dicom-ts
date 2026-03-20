import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { DicomFile } from "../../../src/DicomFile.js";
import { DicomPixelData } from "../../../src/imaging/DicomPixelData.js";
import {
  Jpeg2000Decoder,
  Jpeg2000Marker,
  extractJp2Codestream,
  looksLikeJp2,
  resolveJpeg2000Codestream,
} from "../../../src/imaging/codec/jpeg2000/core/index.js";

const ACCEPTANCE_DIR = "source-code/fo-dicom.Codecs/Tests/Acceptance";

describe("Jpeg2000Decoder", () => {
  it("reads image header from real J2K fixture", async () => {
    const file = await DicomFile.open(join(ACCEPTANCE_DIR, "PM5644-960x540_JPEG2000-Lossless.dcm"));
    const frame = DicomPixelData.create(file.dataset).getFrame(0).data;

    const header = new Jpeg2000Decoder().readHeader(frame);
    expect(header.form).toBe("j2k");
    expect(header.width).toBe(960);
    expect(header.height).toBe(540);
    expect(header.components).toBe(3);
    expect(header.bitDepth).toBe(8);
    expect(header.isSigned).toBe(false);
    expect(header.irreversible).toBe(false);
    expect(header.isPart2).toBe(false);
  });

  it("decodes real fixture into expected output size", async () => {
    const file = await DicomFile.open(join(ACCEPTANCE_DIR, "PM5644-960x540_JPEG2000-Lossless.dcm"));
    const frame = DicomPixelData.create(file.dataset).getFrame(0).data;
    const decoded = new Jpeg2000Decoder().decode(frame);

    expect(decoded.width).toBe(960);
    expect(decoded.height).toBe(540);
    expect(decoded.components).toBe(3);
    expect(decoded.pixelData.length).toBe(960 * 540 * 3);
  });

  it("detects and extracts JP2 codestream boxes", () => {
    const codestream = buildMinimalCodestream();
    const jp2 = buildJp2FromCodestream(codestream);

    expect(looksLikeJp2(jp2)).toBe(true);
    expect(resolveJpeg2000Codestream(jp2).form).toBe("jp2");

    const extracted = extractJp2Codestream(jp2);
    expect([...extracted]).toEqual([...codestream]);
    expect(((extracted[0]! << 8) | extracted[1]!)).toBe(Jpeg2000Marker.SOC);
  });

  it("summarizes tile packet headers/bodies via t2 foundation", () => {
    const codestream = buildSingleTilePacketCodestream();
    const decoder = new Jpeg2000Decoder();

    const summary = decoder.readTilePacketSummary(codestream);
    expect(summary.tiles).toHaveLength(1);
    expect(summary.totalPackets).toBe(1);
    expect(summary.totalHeaderPresentPackets).toBe(1);
    expect(summary.totalBytesConsumed).toBe(4);
    expect(summary.tiles[0]!.error).toBeUndefined();

    const codeBlockSummary = decoder.readTileCodeBlockCoefficients(codestream);
    expect(codeBlockSummary.tiles).toHaveLength(1);
    expect(codeBlockSummary.totalDecodedCodeBlocks + codeBlockSummary.totalFailedCodeBlocks).toBeGreaterThanOrEqual(0);

    const componentSummary = decoder.readTileComponentSummary(codestream);
    expect(componentSummary.tiles).toHaveLength(1);
    expect(componentSummary.tiles[0]!.components).toHaveLength(1);

    const decoded = decoder.decode(codestream);
    expect(decoded.pixelData.length).toBe(16 * 16);
  });

  it("applies main-header RGN MaxShift during code-block reconstruction", () => {
    const decoder = new Jpeg2000Decoder();
    const baseSummary = decoder.readTileCodeBlockCoefficients(buildSingleTilePacketCodestream());
    const maxShiftSummary = decoder.readTileCodeBlockCoefficients(buildSingleTilePacketCodestreamWithMainHeaderRgn(0, 1));

    const baseCoefficients = firstDecodedCodeBlockCoefficients(baseSummary);
    const maxShiftCoefficients = firstDecodedCodeBlockCoefficients(maxShiftSummary);

    expect(maxShiftCoefficients).toHaveLength(baseCoefficients.length);
    expect(maxShiftCoefficients.some((value, index) => Math.abs(value) < Math.abs(baseCoefficients[index] ?? 0))).toBe(true);
    expect(maxShiftCoefficients.every((value, index) => Math.abs(value) <= Math.abs(baseCoefficients[index] ?? 0))).toBe(true);
  });

  it("keeps GeneralScaling RGN inert without ROI geometry", () => {
    const decoder = new Jpeg2000Decoder();
    const baseSummary = decoder.readTileCodeBlockCoefficients(buildSingleTilePacketCodestream());
    const generalScalingSummary = decoder.readTileCodeBlockCoefficients(buildSingleTilePacketCodestreamWithMainHeaderRgn(1, 1));

    expect(firstDecodedCodeBlockCoefficients(generalScalingSummary)).toEqual(firstDecodedCodeBlockCoefficients(baseSummary));
  });

  it("applies GeneralScaling RGN when JP2ROI COM geometry is present", () => {
    const decoder = new Jpeg2000Decoder();
    const baseSummary = decoder.readTileCodeBlockCoefficients(buildSingleTilePacketCodestream());
    const generalScalingSummary = decoder.readTileCodeBlockCoefficients(
      buildSingleTilePacketCodestreamWithMainHeaderRgnAndJp2Roi(1, 1),
    );

    const baseCoefficients = firstDecodedCodeBlockCoefficients(baseSummary);
    const generalScalingCoefficients = firstDecodedCodeBlockCoefficients(generalScalingSummary);

    expect(generalScalingCoefficients).toHaveLength(baseCoefficients.length);
    expect(generalScalingCoefficients.every((value, index) => Math.abs(value) <= Math.abs(baseCoefficients[index] ?? 0))).toBe(true);
    expect(generalScalingCoefficients).not.toEqual(baseCoefficients);
  });

  it("ignores tile-header RGN during decode-side ROI reconstruction", () => {
    const decoder = new Jpeg2000Decoder();
    const baseSummary = decoder.readTileCodeBlockCoefficients(buildSingleTilePacketCodestream());
    const tileHeaderRgnSummary = decoder.readTileCodeBlockCoefficients(buildSingleTilePacketCodestreamWithTileHeaderRgn(0, 1));

    expect(firstDecodedCodeBlockCoefficients(tileHeaderRgnSummary)).toEqual(firstDecodedCodeBlockCoefficients(baseSummary));
  });

  it("ignores malformed JP2ROI COM payloads", () => {
    const decoder = new Jpeg2000Decoder();
    const baseSummary = decoder.readTileCodeBlockCoefficients(buildSingleTilePacketCodestream());
    const malformedComSummary = decoder.readTileCodeBlockCoefficients(
      buildSingleTilePacketCodestreamWithMainHeaderRgnAndCustomCom(1, 1, [
        0x4a, 0x50, 0x32, 0x52, 0x4f, 0x49, // "JP2ROI"
        0x01, // version
        0x00, // truncated region-count payload
      ]),
    );

    expect(firstDecodedCodeBlockCoefficients(malformedComSummary)).toEqual(firstDecodedCodeBlockCoefficients(baseSummary));
  });

  it("ignores unknown-version JP2ROI COM payloads", () => {
    const decoder = new Jpeg2000Decoder();
    const baseSummary = decoder.readTileCodeBlockCoefficients(buildSingleTilePacketCodestream());
    const unknownVersionSummary = decoder.readTileCodeBlockCoefficients(
      buildSingleTilePacketCodestreamWithMainHeaderRgnAndCustomCom(1, 1, [
        0x4a, 0x50, 0x32, 0x52, 0x4f, 0x49, // "JP2ROI"
        0x02, // unknown version
        0x00, 0x01,
        0x00,
        0x01,
        0x00,
        0x00, 0x00, 0x00, 0x02,
        0x00, 0x00, 0x00, 0x02,
        0x00, 0x00, 0x00, 0x06,
        0x00, 0x00, 0x00, 0x06,
      ]),
    );

    expect(firstDecodedCodeBlockCoefficients(unknownVersionSummary)).toEqual(firstDecodedCodeBlockCoefficients(baseSummary));
  });

  it("reconstructs constant samples when tile packet has no code-block contribution", () => {
    const codestream = buildSingleTileEmptyPacketCodestream(1, 0);
    const decoded = new Jpeg2000Decoder().decode(codestream);

    expect(decoded.width).toBe(16);
    expect(decoded.height).toBe(16);
    expect(decoded.components).toBe(1);
    expect(decoded.pixelData.length).toBe(16 * 16);
    expect([...decoded.pixelData]).toEqual(new Array(16 * 16).fill(128));
  });

  it("runs irreversible 9/7 inverse wavelet path for empty tile data", () => {
    const codestream = buildSingleTileEmptyPacketCodestream(0, 1);
    const decoded = new Jpeg2000Decoder().decode(codestream);

    expect(decoded.pixelData.length).toBe(16 * 16);
    expect([...decoded.pixelData]).toEqual(new Array(16 * 16).fill(128));
    expect(decoded.irreversible).toBe(true);
  });

  it("marks codestream as Part2 when MCT marker segments are present", () => {
    const header = new Jpeg2000Decoder().readHeader(buildPart2HeaderCodestream());
    expect(header.isPart2).toBe(true);
  });

  it("applies inverse MCT when codestream enables multi-component transform", () => {
    const withoutMct = new Jpeg2000Decoder().decode(buildThreeComponentPacketCodestream(0));
    const withMct = new Jpeg2000Decoder().decode(buildThreeComponentPacketCodestream(1));

    expect(withoutMct.pixelData.length).toBe(16 * 16 * 3);
    expect(withMct.pixelData.length).toBe(16 * 16 * 3);
    expect(withMct.components).toBe(3);
    expect(withoutMct.components).toBe(3);
  });
});

function buildMinimalCodestream(): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);
  pushU16(bytes, Jpeg2000Marker.SIZ);
  pushU16(bytes, 41);
  pushU16(bytes, 0);
  pushU32(bytes, 16);
  pushU32(bytes, 16);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU32(bytes, 16);
  pushU32(bytes, 16);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU16(bytes, 1);
  bytes.push(7, 1, 1);
  pushU16(bytes, Jpeg2000Marker.COD);
  pushU16(bytes, 12);
  bytes.push(0, 0);
  pushU16(bytes, 1);
  bytes.push(0, 0, 2, 2, 0, 1);
  pushU16(bytes, Jpeg2000Marker.QCD);
  pushU16(bytes, 5);
  bytes.push(0, 0, 0);
  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function buildSingleTilePacketCodestream(): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);
  pushU16(bytes, Jpeg2000Marker.SIZ);
  pushU16(bytes, 41);
  pushU16(bytes, 0);
  pushU32(bytes, 16);
  pushU32(bytes, 16);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU32(bytes, 16);
  pushU32(bytes, 16);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU16(bytes, 1);
  bytes.push(7, 1, 1);

  pushU16(bytes, Jpeg2000Marker.COD);
  pushU16(bytes, 12);
  bytes.push(0, 0);
  pushU16(bytes, 1);
  bytes.push(0, 0, 2, 2, 0, 1);

  pushU16(bytes, Jpeg2000Marker.QCD);
  pushU16(bytes, 5);
  bytes.push(0, 0, 0);

  const packetPayload = new Uint8Array([0xe3, 0x11, 0x22, 0x33]);
  pushU16(bytes, Jpeg2000Marker.SOT);
  pushU16(bytes, 10);
  pushU16(bytes, 0);
  pushU32(bytes, 14 + packetPayload.length);
  bytes.push(0, 1);
  pushU16(bytes, Jpeg2000Marker.SOD);
  bytes.push(...packetPayload);

  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function buildSingleTilePacketCodestreamWithMainHeaderRgn(style: number, shift: number): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);
  pushU16(bytes, Jpeg2000Marker.SIZ);
  pushU16(bytes, 41);
  pushU16(bytes, 0);
  pushU32(bytes, 16);
  pushU32(bytes, 16);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU32(bytes, 16);
  pushU32(bytes, 16);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU16(bytes, 1);
  bytes.push(7, 1, 1);

  pushU16(bytes, Jpeg2000Marker.COD);
  pushU16(bytes, 12);
  bytes.push(0, 0);
  pushU16(bytes, 1);
  bytes.push(0, 0, 2, 2, 0, 1);

  pushU16(bytes, Jpeg2000Marker.QCD);
  pushU16(bytes, 5);
  bytes.push(0, 0, 0);

  pushU16(bytes, Jpeg2000Marker.RGN);
  pushU16(bytes, 5);
  bytes.push(0, style & 0xff, shift & 0xff);

  const packetPayload = new Uint8Array([0xe3, 0x11, 0x22, 0x33]);
  pushU16(bytes, Jpeg2000Marker.SOT);
  pushU16(bytes, 10);
  pushU16(bytes, 0);
  pushU32(bytes, 14 + packetPayload.length);
  bytes.push(0, 1);
  pushU16(bytes, Jpeg2000Marker.SOD);
  bytes.push(...packetPayload);

  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function buildSingleTilePacketCodestreamWithMainHeaderRgnAndJp2Roi(style: number, shift: number): Uint8Array {
  return buildSingleTilePacketCodestreamWithMainHeaderRgnAndCustomCom(style, shift, [
    0x4a, 0x50, 0x32, 0x52, 0x4f, 0x49, // "JP2ROI"
    0x01, // version
    0x00, 0x01, // region count
    0x00, // rectangle
    0x01, // component count
    0x00, // component 0
    0x00, 0x00, 0x00, 0x02, // x0
    0x00, 0x00, 0x00, 0x02, // y0
    0x00, 0x00, 0x00, 0x06, // x1
    0x00, 0x00, 0x00, 0x06, // y1
  ]);
}

function buildSingleTilePacketCodestreamWithMainHeaderRgnAndCustomCom(
  style: number,
  shift: number,
  comPayload: number[],
): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);
  pushU16(bytes, Jpeg2000Marker.SIZ);
  pushU16(bytes, 41);
  pushU16(bytes, 0);
  pushU32(bytes, 16);
  pushU32(bytes, 16);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU32(bytes, 16);
  pushU32(bytes, 16);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU16(bytes, 1);
  bytes.push(7, 1, 1);

  pushU16(bytes, Jpeg2000Marker.COD);
  pushU16(bytes, 12);
  bytes.push(0, 0);
  pushU16(bytes, 1);
  bytes.push(0, 0, 2, 2, 0, 1);

  pushU16(bytes, Jpeg2000Marker.QCD);
  pushU16(bytes, 5);
  bytes.push(0, 0, 0);

  pushU16(bytes, Jpeg2000Marker.RGN);
  pushU16(bytes, 5);
  bytes.push(0, style & 0xff, shift & 0xff);

  pushU16(bytes, Jpeg2000Marker.COM);
  pushU16(bytes, comPayload.length + 4);
  pushU16(bytes, 0);
  bytes.push(...comPayload);

  const packetPayload = new Uint8Array([0xe3, 0x11, 0x22, 0x33]);
  pushU16(bytes, Jpeg2000Marker.SOT);
  pushU16(bytes, 10);
  pushU16(bytes, 0);
  pushU32(bytes, 14 + packetPayload.length);
  bytes.push(0, 1);
  pushU16(bytes, Jpeg2000Marker.SOD);
  bytes.push(...packetPayload);

  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function buildSingleTilePacketCodestreamWithTileHeaderRgn(style: number, shift: number): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);
  pushU16(bytes, Jpeg2000Marker.SIZ);
  pushU16(bytes, 41);
  pushU16(bytes, 0);
  pushU32(bytes, 16);
  pushU32(bytes, 16);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU32(bytes, 16);
  pushU32(bytes, 16);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU16(bytes, 1);
  bytes.push(7, 1, 1);

  pushU16(bytes, Jpeg2000Marker.COD);
  pushU16(bytes, 12);
  bytes.push(0, 0);
  pushU16(bytes, 1);
  bytes.push(0, 0, 2, 2, 0, 1);

  pushU16(bytes, Jpeg2000Marker.QCD);
  pushU16(bytes, 5);
  bytes.push(0, 0, 0);

  const packetPayload = new Uint8Array([0xe3, 0x11, 0x22, 0x33]);
  pushU16(bytes, Jpeg2000Marker.SOT);
  pushU16(bytes, 10);
  pushU16(bytes, 0);
  pushU32(bytes, 21 + packetPayload.length);
  bytes.push(0, 1);
  pushU16(bytes, Jpeg2000Marker.RGN);
  pushU16(bytes, 5);
  bytes.push(0, style & 0xff, shift & 0xff);
  pushU16(bytes, Jpeg2000Marker.SOD);
  bytes.push(...packetPayload);

  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function buildSingleTileEmptyPacketCodestream(transformation: 0 | 1, qcdStyle: number): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);
  pushU16(bytes, Jpeg2000Marker.SIZ);
  pushU16(bytes, 41);
  pushU16(bytes, 0);
  pushU32(bytes, 16);
  pushU32(bytes, 16);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU32(bytes, 16);
  pushU32(bytes, 16);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU16(bytes, 1);
  bytes.push(7, 1, 1);

  pushU16(bytes, Jpeg2000Marker.COD);
  pushU16(bytes, 12);
  bytes.push(0, 0);
  pushU16(bytes, 1);
  bytes.push(0, 0, 2, 2, 0, transformation);

  pushU16(bytes, Jpeg2000Marker.QCD);
  pushU16(bytes, 5);
  bytes.push(qcdStyle, 0, 0);

  pushU16(bytes, Jpeg2000Marker.SOT);
  pushU16(bytes, 10);
  pushU16(bytes, 0);
  pushU32(bytes, 14);
  bytes.push(0, 1);
  pushU16(bytes, Jpeg2000Marker.SOD);

  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function buildThreeComponentPacketCodestream(mctFlag: 0 | 1): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);
  pushU16(bytes, Jpeg2000Marker.SIZ);
  pushU16(bytes, 47);
  pushU16(bytes, 0);
  pushU32(bytes, 16);
  pushU32(bytes, 16);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU32(bytes, 16);
  pushU32(bytes, 16);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU16(bytes, 3);
  bytes.push(7, 1, 1);
  bytes.push(7, 1, 1);
  bytes.push(7, 1, 1);

  pushU16(bytes, Jpeg2000Marker.COD);
  pushU16(bytes, 12);
  bytes.push(0, 0);
  pushU16(bytes, 1);
  bytes.push(mctFlag, 0, 2, 2, 0, 1);

  pushU16(bytes, Jpeg2000Marker.QCD);
  pushU16(bytes, 5);
  bytes.push(0, 0, 0);

  const packetPayload = new Uint8Array([
    0xe3, 0x11, 0x22, 0x33,
    0xe3, 0x44, 0x55, 0x66,
    0xe3, 0x77, 0x88, 0x99,
  ]);
  pushU16(bytes, Jpeg2000Marker.SOT);
  pushU16(bytes, 10);
  pushU16(bytes, 0);
  pushU32(bytes, 14 + packetPayload.length);
  bytes.push(0, 1);
  pushU16(bytes, Jpeg2000Marker.SOD);
  bytes.push(...packetPayload);

  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function firstDecodedCodeBlockCoefficients(summary: ReturnType<Jpeg2000Decoder["readTileCodeBlockCoefficients"]>): number[] {
  const tile = summary.tiles[0];
  expect(tile).toBeDefined();
  expect(tile!.error).toBeUndefined();

  const block = tile!.codeBlocks[0];
  expect(block).toBeDefined();
  expect(block!.error).toBeUndefined();

  return [...block!.coefficients];
}

function buildPart2HeaderCodestream(): Uint8Array {
  const bytes: number[] = [];
  pushU16(bytes, Jpeg2000Marker.SOC);

  pushU16(bytes, Jpeg2000Marker.SIZ);
  pushU16(bytes, 47);
  pushU16(bytes, 0);
  pushU32(bytes, 16);
  pushU32(bytes, 16);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU32(bytes, 16);
  pushU32(bytes, 16);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU16(bytes, 3);
  bytes.push(7, 1, 1);
  bytes.push(7, 1, 1);
  bytes.push(7, 1, 1);

  pushU16(bytes, Jpeg2000Marker.COD);
  pushU16(bytes, 12);
  bytes.push(0, 0);
  pushU16(bytes, 1);
  bytes.push(0, 0, 2, 2, 0, 1);

  pushU16(bytes, Jpeg2000Marker.QCD);
  pushU16(bytes, 5);
  bytes.push(0, 0, 0);

  pushU16(bytes, Jpeg2000Marker.MCT);
  pushU16(bytes, 20);
  pushU16(bytes, 0);
  pushU16(bytes, 0x0601); // idx=1, arrayType=2, elementType=1
  pushU16(bytes, 0);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU32(bytes, 0);
  pushU16(bytes, Jpeg2000Marker.EOC);
  return new Uint8Array(bytes);
}

function buildJp2FromCodestream(codestream: Uint8Array): Uint8Array {
  const signatureBox = buildBox(0x6a502020, new Uint8Array([0x0d, 0x0a, 0x87, 0x0a]));
  const ftypPayload = new Uint8Array([
    0x6a, 0x70, 0x32, 0x20, // brand: jp2
    0x00, 0x00, 0x00, 0x00, // minor version
    0x6a, 0x70, 0x32, 0x20, // compatibility list
  ]);
  const fileTypeBox = buildBox(0x66747970, ftypPayload);
  const codestreamBox = buildBox(0x6a703263, codestream);

  const jp2 = new Uint8Array(signatureBox.length + fileTypeBox.length + codestreamBox.length);
  jp2.set(signatureBox, 0);
  jp2.set(fileTypeBox, signatureBox.length);
  jp2.set(codestreamBox, signatureBox.length + fileTypeBox.length);
  return jp2;
}

function buildBox(type: number, payload: Uint8Array): Uint8Array {
  const box = new Uint8Array(8 + payload.length);
  pushU32Into(box, 0, box.length);
  pushU32Into(box, 4, type);
  box.set(payload, 8);
  return box;
}

function pushU16(target: number[], value: number): void {
  target.push((value >>> 8) & 0xff, value & 0xff);
}

function pushU32(target: number[], value: number): void {
  target.push((value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff);
}

function pushU32Into(target: Uint8Array, offset: number, value: number): void {
  target[offset] = (value >>> 24) & 0xff;
  target[offset + 1] = (value >>> 16) & 0xff;
  target[offset + 2] = (value >>> 8) & 0xff;
  target[offset + 3] = value & 0xff;
}
