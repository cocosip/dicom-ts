import { Jpeg2000Marker } from "./Jpeg2000Markers.js";

export interface Jpeg2000CodestreamWriteOptions {
  width: number;
  height: number;
  components: number;
  bitsStored: number;
  isSigned: boolean;
  numLevels: number;
  progressionOrder: number;
  numberOfLayers: number;
  multipleComponentTransform: number;
  codeBlockWidthExponent: number;
  codeBlockHeightExponent: number;
  codeBlockStyle: number;
  transformation: number;
  tileData: Uint8Array;
}

export function writeJpeg2000SingleTileCodestream(options: Jpeg2000CodestreamWriteOptions): Uint8Array {
  const writer = new ByteWriter();

  writer.writeU16(Jpeg2000Marker.SOC);
  writer.writeSegment(Jpeg2000Marker.SIZ, buildSizPayload(options));
  writer.writeSegment(Jpeg2000Marker.COD, buildCodPayload(options));
  writer.writeSegment(Jpeg2000Marker.QCD, buildQcdPayload(options.numLevels));

  const psot = 14 + options.tileData.length;
  const sotPayload = new Uint8Array(8);
  writeU16At(sotPayload, 0, 0); // tile index
  writeU32At(sotPayload, 2, psot);
  sotPayload[6] = 0; // tile-part index
  sotPayload[7] = 1; // number of tile-parts
  writer.writeSegment(Jpeg2000Marker.SOT, sotPayload);

  writer.writeU16(Jpeg2000Marker.SOD);
  writer.writeBytes(options.tileData);
  writer.writeU16(Jpeg2000Marker.EOC);

  return writer.toUint8Array();
}

function buildSizPayload(options: Jpeg2000CodestreamWriteOptions): Uint8Array {
  const componentCount = options.components;
  const payload = new Uint8Array(36 + (componentCount * 3));

  writeU16At(payload, 0, 0); // Rsiz
  writeU32At(payload, 2, options.width);
  writeU32At(payload, 6, options.height);
  writeU32At(payload, 10, 0); // XOsiz
  writeU32At(payload, 14, 0); // YOsiz
  writeU32At(payload, 18, options.width); // XTsiz
  writeU32At(payload, 22, options.height); // YTsiz
  writeU32At(payload, 26, 0); // XTOsiz
  writeU32At(payload, 30, 0); // YTOsiz
  writeU16At(payload, 34, componentCount);

  const ssiz = ((options.bitsStored - 1) & 0x7f) | (options.isSigned ? 0x80 : 0x00);
  let offset = 36;
  for (let i = 0; i < componentCount; i++) {
    payload[offset] = ssiz;
    payload[offset + 1] = 1; // XRsiz
    payload[offset + 2] = 1; // YRsiz
    offset += 3;
  }

  return payload;
}

function buildCodPayload(options: Jpeg2000CodestreamWriteOptions): Uint8Array {
  const payload = new Uint8Array(10);
  payload[0] = 0; // Scod
  payload[1] = options.progressionOrder & 0xff;
  writeU16At(payload, 2, options.numberOfLayers);
  payload[4] = options.multipleComponentTransform & 0xff;
  payload[5] = options.numLevels & 0xff;
  payload[6] = options.codeBlockWidthExponent & 0xff;
  payload[7] = options.codeBlockHeightExponent & 0xff;
  payload[8] = options.codeBlockStyle & 0xff;
  payload[9] = options.transformation & 0xff;
  return payload;
}

function buildQcdPayload(numLevels: number): Uint8Array {
  const subbandCount = (3 * numLevels) + 1;
  const payload = new Uint8Array(1 + subbandCount);
  payload[0] = 0; // Sqcd: no quantization (reconstruction uses pass-derived bitplane)
  return payload;
}

class ByteWriter {
  private readonly bytes: number[] = [];

  writeU16(value: number): void {
    this.bytes.push((value >>> 8) & 0xff, value & 0xff);
  }

  writeBytes(data: Uint8Array): void {
    for (let i = 0; i < data.length; i++) {
      this.bytes.push(data[i]!);
    }
  }

  writeSegment(marker: number, payload: Uint8Array): void {
    this.writeU16(marker);
    this.writeU16(payload.length + 2);
    this.writeBytes(payload);
  }

  toUint8Array(): Uint8Array {
    return Uint8Array.from(this.bytes);
  }
}

function writeU16At(target: Uint8Array, offset: number, value: number): void {
  target[offset] = (value >>> 8) & 0xff;
  target[offset + 1] = value & 0xff;
}

function writeU32At(target: Uint8Array, offset: number, value: number): void {
  target[offset] = (value >>> 24) & 0xff;
  target[offset + 1] = (value >>> 16) & 0xff;
  target[offset + 2] = (value >>> 8) & 0xff;
  target[offset + 3] = value & 0xff;
}
