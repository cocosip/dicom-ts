import { Jpeg2000Marker } from "../codestream/Jpeg2000Markers.js";

const JP2_SIGNATURE_BOX_TYPE = 0x6a502020; // "jP  "
const JP2_FILE_TYPE_BOX_TYPE = 0x66747970; // "ftyp"
const JP2_CODESTREAM_BOX_TYPE = 0x6a703263; // "jp2c"

export type Jpeg2000CodestreamForm = "j2k" | "jp2";

export interface ResolvedJpeg2000Codestream {
  form: Jpeg2000CodestreamForm;
  codestream: Uint8Array;
}

export function resolveJpeg2000Codestream(frameData: Uint8Array): ResolvedJpeg2000Codestream {
  if (frameData.length < 2) {
    throw new Error("JPEG2000 frame is too short");
  }

  const firstMarker = (frameData[0]! << 8) | frameData[1]!;
  if (firstMarker === Jpeg2000Marker.SOC) {
    return {
      form: "j2k",
      codestream: frameData,
    };
  }

  if (looksLikeJp2(frameData)) {
    return {
      form: "jp2",
      codestream: extractJp2Codestream(frameData),
    };
  }

  throw new Error("Unsupported JPEG2000 stream form: expected J2K codestream or JP2 file");
}

export function looksLikeJp2(frameData: Uint8Array): boolean {
  if (frameData.length < 12) {
    return false;
  }
  const length = readU32(frameData, 0);
  const type = readU32(frameData, 4);
  if (length !== 12 || type !== JP2_SIGNATURE_BOX_TYPE) {
    return false;
  }

  return frameData[8] === 0x0d
    && frameData[9] === 0x0a
    && frameData[10] === 0x87
    && frameData[11] === 0x0a;
}

export function extractJp2Codestream(frameData: Uint8Array): Uint8Array {
  let offset = 0;
  let sawSignature = false;
  let sawFileType = false;

  while (offset + 8 <= frameData.length) {
    const boxStart = offset;
    const lBox = readU32(frameData, offset);
    const tBox = readU32(frameData, offset + 4);
    offset += 8;

    let boxLength = lBox;
    if (lBox === 1) {
      if (offset + 8 > frameData.length) {
        throw new Error("Invalid JP2 box header: truncated XLBox");
      }
      const xLBox = readU64AsSafeInteger(frameData, offset);
      offset += 8;
      boxLength = xLBox;
    } else if (lBox === 0) {
      boxLength = frameData.length - boxStart;
    }

    if (boxLength < 8) {
      throw new Error(`Invalid JP2 box length ${boxLength} at offset ${boxStart}`);
    }

    const boxEnd = boxStart + boxLength;
    if (boxEnd > frameData.length) {
      throw new Error(`JP2 box exceeds stream length [offset=${boxStart}, length=${boxLength}]`);
    }

    const headerLength = offset - boxStart;
    if (boxEnd < boxStart + headerLength) {
      throw new Error(`Invalid JP2 box header size at offset ${boxStart}`);
    }

    const payloadStart = boxStart + headerLength;
    const payloadEnd = boxEnd;

    if (tBox === JP2_SIGNATURE_BOX_TYPE) {
      sawSignature = true;
    } else if (tBox === JP2_FILE_TYPE_BOX_TYPE) {
      sawFileType = true;
    } else if (tBox === JP2_CODESTREAM_BOX_TYPE) {
      const codestream = frameData.slice(payloadStart, payloadEnd);
      if (codestream.length < 2) {
        throw new Error("Invalid JP2 codestream box: empty codestream payload");
      }
      const soc = (codestream[0]! << 8) | codestream[1]!;
      if (soc !== Jpeg2000Marker.SOC) {
        throw new Error("Invalid JP2 codestream box: payload does not start with SOC marker");
      }
      if (!sawSignature || !sawFileType) {
        // We still allow it to keep decoding permissive, but the stream is non-conformant.
      }
      return codestream;
    }

    offset = boxEnd;
  }

  throw new Error("JP2 stream does not contain a jp2c codestream box");
}

function readU32(data: Uint8Array, offset: number): number {
  if (offset + 3 >= data.length) {
    throw new Error(`Unexpected end of stream while reading uint32 at offset ${offset}`);
  }
  return (data[offset]! * 0x1000000)
    + ((data[offset + 1]! << 16) | (data[offset + 2]! << 8) | data[offset + 3]!);
}

function readU64AsSafeInteger(data: Uint8Array, offset: number): number {
  if (offset + 7 >= data.length) {
    throw new Error(`Unexpected end of stream while reading uint64 at offset ${offset}`);
  }

  const hi = readU32(data, offset);
  const lo = readU32(data, offset + 4);
  const value = hi * 0x100000000 + lo;

  if (!Number.isSafeInteger(value)) {
    throw new Error("JP2 XLBox length exceeds JavaScript safe integer range");
  }
  return value;
}

