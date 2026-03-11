import { Jpeg2000Marker, markerHasLength, markerName } from "./Jpeg2000Markers.js";
import type {
  Jpeg2000CocSegment,
  Jpeg2000CodSegment,
  Jpeg2000Codestream,
  Jpeg2000MccSegment,
  Jpeg2000McoSegment,
  Jpeg2000MctSegment,
  Jpeg2000MarkerSegment,
  Jpeg2000PocEntry,
  Jpeg2000PocSegment,
  Jpeg2000QccSegment,
  Jpeg2000QcdSegment,
  Jpeg2000SizSegment,
  Jpeg2000SotSegment,
  Jpeg2000Tile,
  ParsedJpeg2000Marker,
} from "./Jpeg2000CodestreamTypes.js";

export class Jpeg2000CodestreamParser {
  private offset = 0;

  constructor(private readonly data: Uint8Array) {}

  parse(): Jpeg2000Codestream {
    const codestream: Jpeg2000Codestream = {
      data: this.data,
      mainHeaderSegments: [],
      tileHeaderSegments: [],
      coc: new Map(),
      qcc: new Map(),
      poc: [],
      mct: [],
      mcc: [],
      mco: [],
      tiles: [],
    };

    const soc = this.readMarker();
    if (soc.marker !== Jpeg2000Marker.SOC) {
      throw new Error(`Expected SOC marker (0x${toHex(Jpeg2000Marker.SOC)}), got 0x${toHex(soc.marker)}`);
    }

    this.parseMainHeader(codestream);
    this.parseTiles(codestream);

    if (!codestream.siz) {
      throw new Error("JPEG2000 codestream is missing required SIZ segment");
    }
    if (!codestream.cod) {
      throw new Error("JPEG2000 codestream is missing required COD segment");
    }
    if (!codestream.qcd) {
      throw new Error("JPEG2000 codestream is missing required QCD segment");
    }

    return codestream;
  }

  private parseMainHeader(codestream: Jpeg2000Codestream): void {
    for (;;) {
      const marker = this.peekMarker();
      if (marker.marker === Jpeg2000Marker.SOT || marker.marker === Jpeg2000Marker.EOC) {
        return;
      }

      const current = this.readMarker();
      if (!markerHasLength(current.marker)) {
        throw new Error(`Unexpected marker in main header: 0x${toHex(current.marker)} (${markerName(current.marker)})`);
      }

      const segment = this.readSegment(current);
      codestream.mainHeaderSegments.push(segment);

      this.applyMainHeaderSegment(codestream, current.marker, segment.payload ?? new Uint8Array(0));
    }
  }

  private applyMainHeaderSegment(codestream: Jpeg2000Codestream, marker: number, payload: Uint8Array): void {
    switch (marker) {
      case Jpeg2000Marker.SIZ:
        if (codestream.siz) {
          throw new Error("Duplicate SIZ segment in main header");
        }
        codestream.siz = parseSizSegment(payload);
        return;
      case Jpeg2000Marker.COD:
        if (codestream.cod) {
          throw new Error("Duplicate COD segment in main header");
        }
        codestream.cod = parseCodSegment(payload);
        return;
      case Jpeg2000Marker.QCD:
        if (codestream.qcd) {
          throw new Error("Duplicate QCD segment in main header");
        }
        codestream.qcd = parseQcdSegment(payload);
        return;
      case Jpeg2000Marker.COC: {
        const coc = parseCocSegment(payload, codestream.siz?.cSiz);
        codestream.coc.set(coc.component, coc);
        return;
      }
      case Jpeg2000Marker.QCC: {
        const qcc = parseQccSegment(payload, codestream.siz?.cSiz);
        codestream.qcc.set(qcc.component, qcc);
        return;
      }
      case Jpeg2000Marker.POC:
        codestream.poc.push(parsePocSegment(payload, codestream.siz?.cSiz));
        return;
      case Jpeg2000Marker.MCT:
        codestream.mct.push(parseMctSegment(payload));
        return;
      case Jpeg2000Marker.MCC:
        codestream.mcc.push(parseMccSegment(payload));
        return;
      case Jpeg2000Marker.MCO:
        codestream.mco.push(parseMcoSegment(payload));
        return;
      default:
        // Unknown/unsupported marker segments are preserved in raw list only.
        return;
    }
  }

  private parseTiles(codestream: Jpeg2000Codestream): void {
    const tilesByIndex = new Map<number, Jpeg2000Tile>();

    while (this.offset < this.data.length) {
      const marker = this.peekMarker();
      if (marker.marker === Jpeg2000Marker.EOC) {
        this.readMarker();
        codestream.tiles = [...tilesByIndex.values()].sort((a, b) => a.index - b.index);
        return;
      }
      if (marker.marker !== Jpeg2000Marker.SOT) {
        throw new Error(
          `Unexpected marker in tile sequence: 0x${toHex(marker.marker)} (${markerName(marker.marker)})`,
        );
      }

      const sotMarker = this.readMarker();
      const tilePart = this.parseTilePart(codestream, sotMarker.markerOffset);
      mergeTilePart(tilesByIndex, tilePart);
    }

    throw new Error("JPEG2000 codestream is missing EOC marker");
  }

  private parseTilePart(codestream: Jpeg2000Codestream, tilePartStart: number): Jpeg2000Tile {
    const sotSegmentRecord = this.readSegment({
      marker: Jpeg2000Marker.SOT,
      markerOffset: tilePartStart,
    });
    const sotPayload = sotSegmentRecord.payload;
    if (!sotPayload) {
      throw new Error("Invalid SOT segment: missing payload");
    }
    const sot = parseSotSegment(sotPayload);

    const tile: Jpeg2000Tile = {
      index: sot.iSot,
      sot,
      coc: new Map(),
      qcc: new Map(),
      poc: [],
      data: new Uint8Array(0),
    };

    for (;;) {
      const marker = this.peekMarker();
      if (marker.marker === Jpeg2000Marker.SOD) {
        this.readMarker();
        break;
      }
      if (marker.marker === Jpeg2000Marker.EOC || marker.marker === Jpeg2000Marker.SOT) {
        throw new Error(
          `Tile-part header ended before SOD marker [tile=${sot.iSot}, marker=0x${toHex(marker.marker)} ${markerName(marker.marker)}]`,
        );
      }

      const current = this.readMarker();
      if (!markerHasLength(current.marker)) {
        throw new Error(
          `Unexpected non-segment marker in tile-part header: 0x${toHex(current.marker)} (${markerName(current.marker)})`,
        );
      }
      const segment = this.readSegment(current);
      codestream.tileHeaderSegments.push(segment);
      this.applyTileHeaderSegment(
        codestream,
        tile,
        current.marker,
        segment.payload ?? new Uint8Array(0),
        codestream.siz?.cSiz,
      );
    }

    const dataEnd = sot.pSot > 0
      ? resolveTileDataEndFromPsot(tilePartStart, sot.pSot, this.offset, this.data.length)
      : this.findNextTileBoundary(this.offset);

    tile.data = this.data.slice(this.offset, dataEnd);
    this.offset = dataEnd;
    return tile;
  }

  private applyTileHeaderSegment(
    codestream: Jpeg2000Codestream,
    tile: Jpeg2000Tile,
    marker: number,
    payload: Uint8Array,
    cSiz: number | undefined,
  ): void {
    switch (marker) {
      case Jpeg2000Marker.COD:
        tile.cod = parseCodSegment(payload);
        return;
      case Jpeg2000Marker.QCD:
        tile.qcd = parseQcdSegment(payload);
        return;
      case Jpeg2000Marker.COC: {
        const coc = parseCocSegment(payload, cSiz);
        tile.coc.set(coc.component, coc);
        return;
      }
      case Jpeg2000Marker.QCC: {
        const qcc = parseQccSegment(payload, cSiz);
        tile.qcc.set(qcc.component, qcc);
        return;
      }
      case Jpeg2000Marker.POC:
        tile.poc.push(parsePocSegment(payload, cSiz));
        return;
      case Jpeg2000Marker.MCT:
        codestream.mct.push(parseMctSegment(payload));
        return;
      case Jpeg2000Marker.MCC:
        codestream.mcc.push(parseMccSegment(payload));
        return;
      case Jpeg2000Marker.MCO:
        codestream.mco.push(parseMcoSegment(payload));
        return;
      default:
        return;
    }
  }

  private findNextTileBoundary(start: number): number {
    for (let i = start; i + 1 < this.data.length; i++) {
      if (this.data[i] !== 0xff) {
        continue;
      }
      const next = this.data[i + 1]!;
      if (next === 0x00) {
        i++;
        continue;
      }
      if (next === 0x90 || next === 0xd9) {
        return i;
      }
    }
    return this.data.length;
  }

  private peekMarker(): ParsedJpeg2000Marker {
    if (this.offset + 1 >= this.data.length) {
      throw new Error("Unexpected end of codestream while peeking marker");
    }

    return {
      marker: (this.data[this.offset]! << 8) | this.data[this.offset + 1]!,
      markerOffset: this.offset,
    };
  }

  private readMarker(): ParsedJpeg2000Marker {
    const marker = this.peekMarker();
    this.offset += 2;
    return marker;
  }

  private readSegment(marker: ParsedJpeg2000Marker): Jpeg2000MarkerSegment {
    const length = this.readUint16();
    if (length < 2) {
      throw new Error(
        `Invalid ${markerName(marker.marker)} segment length ${length} at offset ${marker.markerOffset}`,
      );
    }

    const payloadLength = length - 2;
    if (this.offset + payloadLength > this.data.length) {
      throw new Error(
        `${markerName(marker.marker)} segment exceeds codestream length [offset=${marker.markerOffset}, length=${length}]`,
      );
    }

    const payloadOffset = this.offset;
    const payload = this.data.slice(payloadOffset, payloadOffset + payloadLength);
    this.offset += payloadLength;

    return {
      marker: marker.marker,
      markerName: markerName(marker.marker),
      markerOffset: marker.markerOffset,
      segmentLength: length,
      payloadOffset,
      payload,
    };
  }

  private readUint16(): number {
    if (this.offset + 1 >= this.data.length) {
      throw new Error("Unexpected end of codestream while reading uint16");
    }
    const value = (this.data[this.offset]! << 8) | this.data[this.offset + 1]!;
    this.offset += 2;
    return value;
  }
}

export function parseJpeg2000Codestream(data: Uint8Array): Jpeg2000Codestream {
  return new Jpeg2000CodestreamParser(data).parse();
}

function parseSizSegment(payload: Uint8Array): Jpeg2000SizSegment {
  if (payload.length < 36) {
    throw new Error(`Invalid SIZ segment payload length: ${payload.length}`);
  }

  let p = 0;
  const rSiz = readU16(payload, p); p += 2;
  const xSiz = readU32(payload, p); p += 4;
  const ySiz = readU32(payload, p); p += 4;
  const xOSiz = readU32(payload, p); p += 4;
  const yOSiz = readU32(payload, p); p += 4;
  const xTSiz = readU32(payload, p); p += 4;
  const yTSiz = readU32(payload, p); p += 4;
  const xTOSiz = readU32(payload, p); p += 4;
  const yTOSiz = readU32(payload, p); p += 4;
  const cSiz = readU16(payload, p); p += 2;

  const expectedLength = 36 + cSiz * 3;
  if (payload.length !== expectedLength) {
    throw new Error(
      `Invalid SIZ segment payload length: expected=${expectedLength}, actual=${payload.length}, components=${cSiz}`,
    );
  }

  const components = new Array(cSiz);
  for (let i = 0; i < cSiz; i++) {
    components[i] = {
      ssiz: payload[p]!,
      xRsiz: payload[p + 1]!,
      yRsiz: payload[p + 2]!,
    };
    p += 3;
  }

  return {
    rSiz,
    xSiz,
    ySiz,
    xOSiz,
    yOSiz,
    xTSiz,
    yTSiz,
    xTOSiz,
    yTOSiz,
    cSiz,
    components,
  };
}

function parseCodSegment(payload: Uint8Array): Jpeg2000CodSegment {
  if (payload.length < 10) {
    throw new Error(`Invalid COD segment payload length: ${payload.length}`);
  }

  const sCod = payload[0]!;
  const progressionOrder = payload[1]!;
  const numberOfLayers = readU16(payload, 2);
  const multipleComponentTransform = payload[4]!;
  const numberOfDecompositionLevels = payload[5]!;
  const codeBlockWidth = payload[6]!;
  const codeBlockHeight = payload[7]!;
  const codeBlockStyle = payload[8]!;
  const transformation = payload[9]!;

  const precinctSizes = [];
  if ((sCod & 0x01) !== 0) {
    const expectedCount = numberOfDecompositionLevels + 1;
    if (payload.length !== 10 + expectedCount) {
      throw new Error(
        `Invalid COD precinct payload length: expected=${10 + expectedCount}, actual=${payload.length}`,
      );
    }
    for (let i = 0; i < expectedCount; i++) {
      const v = payload[10 + i]!;
      precinctSizes.push({
        pPx: v & 0x0f,
        pPy: (v >> 4) & 0x0f,
      });
    }
  } else if (payload.length !== 10) {
    throw new Error(`Invalid COD segment payload length: expected=10, actual=${payload.length}`);
  }

  return {
    sCod,
    progressionOrder,
    numberOfLayers,
    multipleComponentTransform,
    numberOfDecompositionLevels,
    codeBlockWidth,
    codeBlockHeight,
    codeBlockStyle,
    transformation,
    precinctSizes,
  };
}

function parseQcdSegment(payload: Uint8Array): Jpeg2000QcdSegment {
  if (payload.length < 1) {
    throw new Error("Invalid QCD segment payload length: 0");
  }
  return {
    sQcd: payload[0]!,
    spQcd: payload.slice(1),
  };
}

function parseCocSegment(payload: Uint8Array, cSiz: number | undefined): Jpeg2000CocSegment {
  const useTwoByteComponent = (cSiz ?? 0) > 256;
  const compLength = useTwoByteComponent ? 2 : 1;
  const minLength = compLength + 6;
  if (payload.length < minLength) {
    throw new Error(`Invalid COC segment payload length: ${payload.length}`);
  }

  let p = 0;
  const component = useTwoByteComponent ? readU16(payload, p) : payload[p]!;
  p += compLength;

  const sCoc = payload[p]!;
  p++;
  const numberOfDecompositionLevels = payload[p]!;
  p++;
  const codeBlockWidth = payload[p]!;
  p++;
  const codeBlockHeight = payload[p]!;
  p++;
  const codeBlockStyle = payload[p]!;
  p++;
  const transformation = payload[p]!;
  p++;

  const precinctSizes = [];
  if ((sCoc & 0x01) !== 0) {
    const expectedCount = numberOfDecompositionLevels + 1;
    if (payload.length !== minLength + expectedCount) {
      throw new Error(
        `Invalid COC precinct payload length: expected=${minLength + expectedCount}, actual=${payload.length}`,
      );
    }
    for (let i = 0; i < expectedCount; i++) {
      const v = payload[p + i]!;
      precinctSizes.push({
        pPx: v & 0x0f,
        pPy: (v >> 4) & 0x0f,
      });
    }
  } else if (payload.length !== minLength) {
    throw new Error(`Invalid COC segment payload length: expected=${minLength}, actual=${payload.length}`);
  }

  return {
    component,
    sCoc,
    numberOfDecompositionLevels,
    codeBlockWidth,
    codeBlockHeight,
    codeBlockStyle,
    transformation,
    precinctSizes,
  };
}

function parseQccSegment(payload: Uint8Array, cSiz: number | undefined): Jpeg2000QccSegment {
  const useTwoByteComponent = (cSiz ?? 0) > 256;
  const compLength = useTwoByteComponent ? 2 : 1;
  if (payload.length < compLength + 1) {
    throw new Error(`Invalid QCC segment payload length: ${payload.length}`);
  }

  const component = useTwoByteComponent ? readU16(payload, 0) : payload[0]!;
  const sQcc = payload[compLength]!;
  const spQcc = payload.slice(compLength + 1);

  return {
    component,
    sQcc,
    spQcc,
  };
}

function parsePocSegment(payload: Uint8Array, cSiz: number | undefined): Jpeg2000PocSegment {
  const useTwoByteComponent = (cSiz ?? 0) > 256;
  const entryLength = useTwoByteComponent ? 9 : 7;
  if (payload.length === 0 || payload.length % entryLength !== 0) {
    throw new Error(
      `Invalid POC segment payload length: ${payload.length} (entryLength=${entryLength})`,
    );
  }

  const entries: Jpeg2000PocEntry[] = [];
  let p = 0;
  while (p < payload.length) {
    const rSpoc = payload[p]!;
    p++;
    const cSpoc = useTwoByteComponent ? readU16(payload, p) : payload[p]!;
    p += useTwoByteComponent ? 2 : 1;
    const lYEpoc = readU16(payload, p);
    p += 2;
    const rEpoc = payload[p]!;
    p++;
    const cEpoc = useTwoByteComponent ? readU16(payload, p) : payload[p]!;
    p += useTwoByteComponent ? 2 : 1;
    const pPoc = payload[p]!;
    p++;

    entries.push({
      rSpoc,
      cSpoc,
      lYEpoc,
      rEpoc,
      cEpoc,
      pPoc,
    });
  }

  return { entries };
}

function parseSotSegment(payload: Uint8Array): Jpeg2000SotSegment {
  if (payload.length !== 8) {
    throw new Error(`Invalid SOT segment payload length: ${payload.length}`);
  }
  return {
    iSot: readU16(payload, 0),
    pSot: readU32(payload, 2),
    tPSot: payload[6]!,
    tNsot: payload[7]!,
  };
}

function parseMctSegment(payload: Uint8Array): Jpeg2000MctSegment {
  if (payload.length < 6) {
    throw new Error(`Invalid MCT segment payload length: ${payload.length}`);
  }

  const zMct = readU16(payload, 0);
  if (zMct !== 0) {
    throw new Error(`Unsupported MCT Zmct value: ${zMct}`);
  }

  const iMct = readU16(payload, 2);
  const yMct = readU16(payload, 4);
  if (yMct !== 0) {
    throw new Error(`Unsupported MCT Ymct value: ${yMct}`);
  }

  const index = iMct & 0xff;
  const arrayType = (iMct >> 8) & 0x03;
  const elementType = (iMct >> 10) & 0x03;

  return {
    index,
    arrayType: arrayType as 0 | 1 | 2,
    elementType: elementType as 0 | 1 | 2 | 3,
    data: payload.slice(6),
  };
}

function parseMccSegment(payload: Uint8Array): Jpeg2000MccSegment {
  if (payload.length < 7) {
    throw new Error(`Invalid MCC segment payload length: ${payload.length}`);
  }

  let p = 0;
  const zMcc = readU16(payload, p); p += 2;
  if (zMcc !== 0) {
    throw new Error(`Unsupported MCC Zmcc value: ${zMcc}`);
  }
  const index = payload[p]!;
  p++;

  const yMcc = readU16(payload, p); p += 2;
  if (yMcc !== 0) {
    throw new Error(`Unsupported MCC Ymcc value: ${yMcc}`);
  }

  const qMcc = readU16(payload, p); p += 2;
  if (qMcc === 0) {
    throw new Error("Invalid MCC payload: no collections");
  }

  const collectionType = payload[p]!;
  p++;

  const nmcci = readU16(payload, p); p += 2;
  const componentBytes = (nmcci & 0x8000) !== 0 ? 2 : 1;
  const numComponents = nmcci & 0x7fff;
  const componentIds: number[] = [];
  for (let i = 0; i < numComponents; i++) {
    ensurePayloadRemaining(payload, p, componentBytes, "MCC component IDs");
    componentIds.push(componentBytes === 1 ? payload[p]! : readU16(payload, p));
    p += componentBytes;
  }

  ensurePayloadRemaining(payload, p, 2, "MCC output component count");
  const mmcci = readU16(payload, p); p += 2;
  const outputComponentBytes = (mmcci & 0x8000) !== 0 ? 2 : 1;
  const outputCount = mmcci & 0x7fff;
  const outputComponentIds: number[] = [];
  for (let i = 0; i < outputCount; i++) {
    ensurePayloadRemaining(payload, p, outputComponentBytes, "MCC output component IDs");
    outputComponentIds.push(outputComponentBytes === 1 ? payload[p]! : readU16(payload, p));
    p += outputComponentBytes;
  }

  ensurePayloadRemaining(payload, p, 3, "MCC transform descriptor");
  const tMcc = (payload[p]! << 16) | (payload[p + 1]! << 8) | payload[p + 2]!;
  p += 3;

  return {
    index,
    collectionType,
    numComponents,
    componentIds,
    outputComponentIds,
    reversible: ((tMcc >> 16) & 0x1) !== 0,
    decorrelateIndex: tMcc & 0xff,
    offsetIndex: (tMcc >> 8) & 0xff,
  };
}

function parseMcoSegment(payload: Uint8Array): Jpeg2000McoSegment {
  if (payload.length < 1) {
    throw new Error(`Invalid MCO segment payload length: ${payload.length}`);
  }

  const numStages = payload[0]!;
  if (payload.length < 1 + numStages) {
    throw new Error(
      `Invalid MCO segment payload length: expected at least ${1 + numStages}, actual=${payload.length}`,
    );
  }

  const stageIndices = Array.from(payload.slice(1, 1 + numStages));
  return {
    numStages,
    stageIndices,
  };
}

function resolveTileDataEndFromPsot(
  tilePartStart: number,
  pSot: number,
  dataStart: number,
  streamLength: number,
): number {
  const tilePartEnd = tilePartStart + pSot;
  if (tilePartEnd > streamLength) {
    throw new Error(
      `Invalid SOT Psot: tile-part exceeds codestream [tilePartStart=${tilePartStart}, psot=${pSot}, streamLength=${streamLength}]`,
    );
  }
  if (tilePartEnd < dataStart) {
    throw new Error(
      `Invalid SOT Psot: tile-part end precedes SOD data [tilePartStart=${tilePartStart}, psot=${pSot}, dataStart=${dataStart}]`,
    );
  }
  return tilePartEnd;
}

function mergeTilePart(tilesByIndex: Map<number, Jpeg2000Tile>, tilePart: Jpeg2000Tile): void {
  const existing = tilesByIndex.get(tilePart.index);
  if (!existing) {
    tilesByIndex.set(tilePart.index, tilePart);
    return;
  }

  if (tilePart.cod) {
    existing.cod = tilePart.cod;
  }
  if (tilePart.qcd) {
    existing.qcd = tilePart.qcd;
  }
  for (const [key, value] of tilePart.coc) {
    existing.coc.set(key, value);
  }
  for (const [key, value] of tilePart.qcc) {
    existing.qcc.set(key, value);
  }
  if (tilePart.poc.length > 0) {
    existing.poc.push(...tilePart.poc);
  }
  if (tilePart.data.length > 0) {
    const merged = new Uint8Array(existing.data.length + tilePart.data.length);
    merged.set(existing.data, 0);
    merged.set(tilePart.data, existing.data.length);
    existing.data = merged;
  }

  if (tilePart.sot.tNsot > existing.sot.tNsot) {
    existing.sot.tNsot = tilePart.sot.tNsot;
  }
  if (tilePart.sot.tPSot > existing.sot.tPSot) {
    existing.sot.tPSot = tilePart.sot.tPSot;
  }
}

function ensurePayloadRemaining(data: Uint8Array, offset: number, needed: number, context: string): void {
  if (offset + needed > data.length) {
    throw new Error(
      `Invalid ${context}: expected ${needed} bytes at offset ${offset}, payloadLength=${data.length}`,
    );
  }
}

function readU16(data: Uint8Array, offset: number): number {
  if (offset + 1 >= data.length) {
    throw new Error(`Unexpected end of payload while reading uint16 at offset ${offset}`);
  }
  return (data[offset]! << 8) | data[offset + 1]!;
}

function readU32(data: Uint8Array, offset: number): number {
  if (offset + 3 >= data.length) {
    throw new Error(`Unexpected end of payload while reading uint32 at offset ${offset}`);
  }
  return (data[offset]! * 0x1000000)
    + ((data[offset + 1]! << 16) | (data[offset + 2]! << 8) | data[offset + 3]!);
}

function toHex(value: number): string {
  return value.toString(16).toUpperCase().padStart(4, "0");
}
