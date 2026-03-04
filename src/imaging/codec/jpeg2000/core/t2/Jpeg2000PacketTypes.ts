export interface Jpeg2000CodeBlockPosition {
  x: number;
  y: number;
}

export interface Jpeg2000CodeBlockState {
  included: boolean;
  firstLayer: number;
  zeroBitPlanes: number;
  numPassesTotal: number;
  dataAccum: Uint8Array;
  numLenBits: number;
}

export function createCodeBlockState(): Jpeg2000CodeBlockState {
  return {
    included: false,
    firstLayer: -1,
    zeroBitPlanes: 0,
    numPassesTotal: 0,
    dataAccum: new Uint8Array(0),
    numLenBits: 0,
  };
}

export function createCodeBlockStates(numCodeBlocks: number): Jpeg2000CodeBlockState[] {
  const count = Number.isFinite(numCodeBlocks) && numCodeBlocks > 0 ? Math.floor(numCodeBlocks) : 0;
  const states = new Array<Jpeg2000CodeBlockState>(count);
  for (let i = 0; i < count; i++) {
    states[i] = createCodeBlockState();
  }
  return states;
}

export interface Jpeg2000CodeBlockInclusion {
  included: boolean;
  firstInclusion: boolean;
  numPasses: number;
  dataLength: number;
  data: Uint8Array;
  zeroBitplanes: number;
  passLengths: number[];
  useTermAll: boolean;
  corrupted: boolean;
}

export function createEmptyCodeBlockInclusion(): Jpeg2000CodeBlockInclusion {
  return {
    included: false,
    firstInclusion: false,
    numPasses: 0,
    dataLength: 0,
    data: new Uint8Array(0),
    zeroBitplanes: 0,
    passLengths: [],
    useTermAll: false,
    corrupted: false,
  };
}

export interface Jpeg2000Packet {
  headerPresent: boolean;
  header: Uint8Array;
  body: Uint8Array;
  layerIndex: number;
  resolutionLevel: number;
  componentIndex: number;
  precinctIndex: number;
  codeBlockInclusions: Jpeg2000CodeBlockInclusion[];
  partialBuffer: boolean;
}

export function createEmptyPacket(
  layerIndex: number,
  resolutionLevel: number,
  componentIndex: number,
  precinctIndex: number,
): Jpeg2000Packet {
  return {
    headerPresent: false,
    header: new Uint8Array(0),
    body: new Uint8Array(0),
    layerIndex,
    resolutionLevel,
    componentIndex,
    precinctIndex,
    codeBlockInclusions: [],
    partialBuffer: false,
  };
}

export enum Jpeg2000ProgressionOrder {
  LRCP = 0,
  RLCP = 1,
  RPCL = 2,
  PCRL = 3,
  CPRL = 4,
}

export function progressionOrderName(order: Jpeg2000ProgressionOrder | number): string {
  switch (order) {
    case Jpeg2000ProgressionOrder.LRCP:
      return "LRCP";
    case Jpeg2000ProgressionOrder.RLCP:
      return "RLCP";
    case Jpeg2000ProgressionOrder.RPCL:
      return "RPCL";
    case Jpeg2000ProgressionOrder.PCRL:
      return "PCRL";
    case Jpeg2000ProgressionOrder.CPRL:
      return "CPRL";
    default:
      return "UNKNOWN";
  }
}