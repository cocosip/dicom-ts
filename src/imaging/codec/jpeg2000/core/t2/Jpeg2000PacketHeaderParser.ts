import {
  Jpeg2000PacketHeaderBitReader,
  floorLog2,
} from "./Jpeg2000PacketHeaderBitIo.js";
import {
  createCodeBlockStates,
  createEmptyCodeBlockInclusion,
  createEmptyPacket,
  type Jpeg2000CodeBlockInclusion,
  type Jpeg2000CodeBlockPosition,
  type Jpeg2000CodeBlockState,
  type Jpeg2000Packet,
} from "./Jpeg2000PacketTypes.js";
import { Jpeg2000TagTree } from "./Jpeg2000TagTree.js";

export interface Jpeg2000PacketHeaderBandState {
  numCodeBlocksX: number;
  numCodeBlocksY: number;
  codeBlockPositions?: Jpeg2000CodeBlockPosition[];
  inclusionTagTree?: Jpeg2000TagTree;
  zeroBitplaneTagTree?: Jpeg2000TagTree;
  codeBlockStates?: Jpeg2000CodeBlockState[];
}

export interface Jpeg2000ParsePacketHeaderResult {
  header: Uint8Array;
  codeBlockInclusions: Jpeg2000CodeBlockInclusion[];
  bytesRead: number;
  headerPresent: boolean;
}

export class Jpeg2000PacketHeaderParser {
  private reader: Jpeg2000PacketHeaderBitReader;
  private readonly numCodeBlocksX: number;
  private readonly numCodeBlocksY: number;
  private readonly codeBlockPositions: Jpeg2000CodeBlockPosition[];
  private readonly inclusionTagTree: Jpeg2000TagTree;
  private readonly zeroBitplaneTagTree: Jpeg2000TagTree;
  private readonly codeBlockStates: Jpeg2000CodeBlockState[];
  private readonly termAll: boolean;

  private currentLayer = 0;

  constructor(
    private readonly data: Uint8Array,
    numCodeBlocksX: number,
    numCodeBlocksY: number,
    options?: {
      codeBlockStates?: Jpeg2000CodeBlockState[];
      inclusionTagTree?: Jpeg2000TagTree;
      zeroBitplaneTagTree?: Jpeg2000TagTree;
      codeBlockPositions?: Jpeg2000CodeBlockPosition[];
      termAll?: boolean;
    },
  ) {
    this.reader = new Jpeg2000PacketHeaderBitReader(data);
    this.numCodeBlocksX = Math.max(1, Math.floor(numCodeBlocksX));
    this.numCodeBlocksY = Math.max(1, Math.floor(numCodeBlocksY));

    this.codeBlockPositions = options?.codeBlockPositions?.slice()
      ?? defaultCodeBlockPositions(this.numCodeBlocksX, this.numCodeBlocksY);

    this.inclusionTagTree = options?.inclusionTagTree
      ?? new Jpeg2000TagTree(this.numCodeBlocksX, this.numCodeBlocksY);

    this.zeroBitplaneTagTree = options?.zeroBitplaneTagTree
      ?? new Jpeg2000TagTree(this.numCodeBlocksX, this.numCodeBlocksY);

    const expectedStates = this.numCodeBlocksX * this.numCodeBlocksY;
    this.codeBlockStates = options?.codeBlockStates?.length === expectedStates
      ? options.codeBlockStates
      : createCodeBlockStates(expectedStates);

    this.termAll = options?.termAll ?? false;
  }

  parseHeader(): Jpeg2000Packet {
    const packet = createEmptyPacket(this.currentLayer, 0, 0, 0);

    if (this.reader.bytesRead() >= this.data.length) {
      return packet;
    }

    const emptyBit = this.reader.readBit();
    packet.headerPresent = emptyBit === 1;
    if (!packet.headerPresent) {
      return packet;
    }

    const headerStart = this.reader.bytesRead();

    for (const position of this.codeBlockPositions) {
      if (!isCodeBlockPositionValid(position, this.numCodeBlocksX, this.numCodeBlocksY)) {
        continue;
      }

      const inclusion = this.decodeCodeBlock(
        position,
        this.numCodeBlocksX,
        this.codeBlockStates,
        this.inclusionTagTree,
        this.zeroBitplaneTagTree,
      );
      packet.codeBlockInclusions.push(inclusion);
    }

    this.reader.alignToByte();
    packet.header = this.data.slice(headerStart, this.reader.bytesRead());
    return packet;
  }

  setLayer(layer: number): void {
    this.currentLayer = Math.max(0, Math.floor(layer));
  }

  reset(): void {
    this.reader = new Jpeg2000PacketHeaderBitReader(this.data);
    this.currentLayer = 0;
    this.inclusionTagTree.reset();
    this.zeroBitplaneTagTree.reset();
    for (const state of this.codeBlockStates) {
      resetCodeBlockState(state);
    }
  }

  position(): number {
    return this.reader.bytesRead();
  }

  readBit(): number {
    return this.reader.readBit();
  }

  readBits(bitCount: number): number {
    return this.reader.readBits(bitCount);
  }

  alignToByte(): void {
    this.reader.alignToByte();
  }

  decodeNumPasses(): number {
    return decodeNumPassesWithReader(this.reader);
  }

  decodeDataLength(numPasses: number, state: Jpeg2000CodeBlockState): { dataLength: number; passLengths: number[] } {
    return decodeDataLengthWithReader(this.reader, numPasses, state, this.termAll);
  }

  private decodeCodeBlock(
    position: Jpeg2000CodeBlockPosition,
    numCodeBlocksX: number,
    states: Jpeg2000CodeBlockState[],
    inclusionTree: Jpeg2000TagTree,
    zeroBitplaneTree: Jpeg2000TagTree,
  ): Jpeg2000CodeBlockInclusion {
    const inclusion = createEmptyCodeBlockInclusion();
    const index = position.y * numCodeBlocksX + position.x;
    const state = states[index]!;

    if (!state.included) {
      const decoded = inclusionTree.decodeInclusion(position.x, position.y, this.currentLayer, () => this.reader.readBit());
      inclusion.included = decoded.included;

      if (!inclusion.included) {
        return inclusion;
      }

      inclusion.firstInclusion = true;
      state.included = true;
      state.firstLayer = decoded.firstLayer;
      state.numLenBits = 3;

      const zbp = zeroBitplaneTree.decodeZeroBitplanes(position.x, position.y, () => this.reader.readBit());
      state.zeroBitPlanes = zbp;
      inclusion.zeroBitplanes = zbp;
    } else {
      inclusion.included = this.reader.readBit() === 1;
      if (!inclusion.included) {
        return inclusion;
      }

      inclusion.firstInclusion = false;
      inclusion.zeroBitplanes = state.zeroBitPlanes;
    }

    const numPasses = decodeNumPassesWithReader(this.reader);
    inclusion.numPasses = numPasses;
    state.numPassesTotal += numPasses;

    const length = decodeDataLengthWithReader(this.reader, numPasses, state, this.termAll);
    inclusion.dataLength = length.dataLength;
    if (length.passLengths.length > 0) {
      inclusion.passLengths = length.passLengths;
      inclusion.useTermAll = this.termAll;
    }

    return inclusion;
  }
}

export function parsePacketHeaderMulti(
  data: Uint8Array,
  layer: number,
  bands: Jpeg2000PacketHeaderBandState[],
  termAll: boolean,
): Jpeg2000ParsePacketHeaderResult {
  const reader = new Jpeg2000PacketHeaderBitReader(data);

  if (reader.bytesRead() >= data.length) {
    return {
      header: new Uint8Array(0),
      codeBlockInclusions: [],
      bytesRead: 0,
      headerPresent: false,
    };
  }

  const headerStart = reader.bytesRead();
  const emptyBit = reader.readBit();
  const headerPresent = emptyBit === 1;

  if (!headerPresent) {
    return {
      header: data.slice(headerStart, reader.bytesRead()),
      codeBlockInclusions: [],
      bytesRead: reader.bytesRead(),
      headerPresent,
    };
  }

  const codeBlockInclusions: Jpeg2000CodeBlockInclusion[] = [];

  for (const band of bands) {
    if (band.numCodeBlocksX <= 0 || band.numCodeBlocksY <= 0) {
      continue;
    }

    normalizePacketHeaderBand(band);

    const positions = band.codeBlockPositions?.length
      ? band.codeBlockPositions
      : defaultCodeBlockPositions(band.numCodeBlocksX, band.numCodeBlocksY);

    for (const position of positions) {
      if (!isCodeBlockPositionValid(position, band.numCodeBlocksX, band.numCodeBlocksY)) {
        continue;
      }

      const inclusion = createEmptyCodeBlockInclusion();
      const index = position.y * band.numCodeBlocksX + position.x;
      const state = band.codeBlockStates![index]!;

      if (!state.included) {
        const decoded = band.inclusionTagTree!.decodeInclusion(position.x, position.y, layer, () => reader.readBit());
        inclusion.included = decoded.included;

        if (!inclusion.included) {
          codeBlockInclusions.push(inclusion);
          continue;
        }

        inclusion.firstInclusion = true;
        state.included = true;
        state.firstLayer = decoded.firstLayer;
        state.numLenBits = 3;

        const zbp = band.zeroBitplaneTagTree!.decodeZeroBitplanes(position.x, position.y, () => reader.readBit());
        state.zeroBitPlanes = zbp;
        inclusion.zeroBitplanes = zbp;
      } else {
        inclusion.included = reader.readBit() === 1;

        if (!inclusion.included) {
          codeBlockInclusions.push(inclusion);
          continue;
        }

        inclusion.firstInclusion = false;
        inclusion.zeroBitplanes = state.zeroBitPlanes;
      }

      const numPasses = decodeNumPassesWithReader(reader);
      inclusion.numPasses = numPasses;
      state.numPassesTotal += numPasses;

      const length = decodeDataLengthWithReader(reader, numPasses, state, termAll);
      inclusion.dataLength = length.dataLength;
      if (length.passLengths.length > 0) {
        inclusion.passLengths = length.passLengths;
        inclusion.useTermAll = termAll;
      }

      codeBlockInclusions.push(inclusion);
    }
  }

  reader.alignToByte();

  return {
    header: data.slice(headerStart, reader.bytesRead()),
    codeBlockInclusions,
    bytesRead: reader.bytesRead(),
    headerPresent,
  };
}

export function decodeNumPassesWithReader(reader: Pick<Jpeg2000PacketHeaderBitReader, "readBit" | "readBits">): number {
  const bit1 = reader.readBit();
  if (bit1 === 0) {
    return 1;
  }

  const bit2 = reader.readBit();
  if (bit2 === 0) {
    return 2;
  }

  const value2 = reader.readBits(2);
  if (value2 !== 3) {
    return 3 + value2;
  }

  const value5 = reader.readBits(5);
  if (value5 !== 31) {
    return 6 + value5;
  }

  const value7 = reader.readBits(7);
  return 37 + value7;
}

export function decodeDataLengthWithReader(
  reader: Pick<Jpeg2000PacketHeaderBitReader, "readBit" | "readBits">,
  numPasses: number,
  state: Jpeg2000CodeBlockState,
  termAll: boolean,
): { dataLength: number; passLengths: number[] } {
  if (numPasses <= 0) {
    return { dataLength: 0, passLengths: [] };
  }

  if (state.numLenBits <= 0) {
    state.numLenBits = 3;
  }

  const increment = decodeCommaCodeWithReader(reader);
  state.numLenBits += increment;

  if (termAll) {
    const passLengths = new Array<number>(numPasses);
    let totalLength = 0;

    for (let i = 0; i < numPasses; i++) {
      const segmentLength = reader.readBits(state.numLenBits);
      passLengths[i] = segmentLength;
      totalLength += segmentLength;
    }

    return {
      dataLength: totalLength,
      passLengths,
    };
  }

  const bitCount = state.numLenBits + floorLog2(numPasses);
  const segmentLength = reader.readBits(bitCount);
  return {
    dataLength: segmentLength,
    passLengths: [],
  };
}

export function decodeCommaCodeWithReader(reader: Pick<Jpeg2000PacketHeaderBitReader, "readBit">): number {
  let value = 0;
  for (;;) {
    const bit = reader.readBit();
    if (bit === 0) {
      return value;
    }
    value++;
  }
}

export function normalizePacketHeaderBand(band: Jpeg2000PacketHeaderBandState): void {
  if (band.numCodeBlocksX <= 0 || band.numCodeBlocksY <= 0) {
    return;
  }

  const numCodeBlocks = band.numCodeBlocksX * band.numCodeBlocksY;

  if (
    !band.inclusionTagTree
    || band.inclusionTagTree.getWidth() !== band.numCodeBlocksX
    || band.inclusionTagTree.getHeight() !== band.numCodeBlocksY
  ) {
    band.inclusionTagTree = new Jpeg2000TagTree(band.numCodeBlocksX, band.numCodeBlocksY);
  }

  if (
    !band.zeroBitplaneTagTree
    || band.zeroBitplaneTagTree.getWidth() !== band.numCodeBlocksX
    || band.zeroBitplaneTagTree.getHeight() !== band.numCodeBlocksY
  ) {
    band.zeroBitplaneTagTree = new Jpeg2000TagTree(band.numCodeBlocksX, band.numCodeBlocksY);
  }

  if (!band.codeBlockStates || band.codeBlockStates.length !== numCodeBlocks) {
    band.codeBlockStates = createCodeBlockStates(numCodeBlocks);
  }
}

function isCodeBlockPositionValid(position: Jpeg2000CodeBlockPosition, numCodeBlocksX: number, numCodeBlocksY: number): boolean {
  return position.x >= 0
    && position.x < numCodeBlocksX
    && position.y >= 0
    && position.y < numCodeBlocksY;
}

function defaultCodeBlockPositions(numCodeBlocksX: number, numCodeBlocksY: number): Jpeg2000CodeBlockPosition[] {
  const positions: Jpeg2000CodeBlockPosition[] = [];
  for (let y = 0; y < numCodeBlocksY; y++) {
    for (let x = 0; x < numCodeBlocksX; x++) {
      positions.push({ x, y });
    }
  }
  return positions;
}

function resetCodeBlockState(state: Jpeg2000CodeBlockState): void {
  state.included = false;
  state.firstLayer = -1;
  state.zeroBitPlanes = 0;
  state.numPassesTotal = 0;
  state.dataAccum = new Uint8Array(0);
  state.numLenBits = 0;
}
