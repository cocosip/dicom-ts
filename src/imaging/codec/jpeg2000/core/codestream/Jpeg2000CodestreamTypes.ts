import type { Jpeg2000MarkerCode } from "./Jpeg2000Markers.js";

export interface Jpeg2000MarkerSegment {
  marker: number;
  markerName: string;
  markerOffset: number;
  segmentLength: number | null;
  payloadOffset: number | null;
  payload: Uint8Array | null;
}

export interface Jpeg2000ComponentSize {
  ssiz: number;
  xRsiz: number;
  yRsiz: number;
}

export function componentBitDepth(component: Jpeg2000ComponentSize): number {
  return (component.ssiz & 0x7f) + 1;
}

export function componentIsSigned(component: Jpeg2000ComponentSize): boolean {
  return (component.ssiz & 0x80) !== 0;
}

export interface Jpeg2000SizSegment {
  rSiz: number;
  xSiz: number;
  ySiz: number;
  xOSiz: number;
  yOSiz: number;
  xTSiz: number;
  yTSiz: number;
  xTOSiz: number;
  yTOSiz: number;
  cSiz: number;
  components: Jpeg2000ComponentSize[];
}

export interface Jpeg2000PrecinctSize {
  pPx: number;
  pPy: number;
}

export interface Jpeg2000CodSegment {
  sCod: number;
  progressionOrder: number;
  numberOfLayers: number;
  multipleComponentTransform: number;
  numberOfDecompositionLevels: number;
  codeBlockWidth: number;
  codeBlockHeight: number;
  codeBlockStyle: number;
  transformation: number;
  precinctSizes: Jpeg2000PrecinctSize[];
}

export function codCodeBlockSize(cod: Jpeg2000CodSegment): { width: number; height: number } {
  return {
    width: 1 << (cod.codeBlockWidth + 2),
    height: 1 << (cod.codeBlockHeight + 2),
  };
}

export interface Jpeg2000QcdSegment {
  sQcd: number;
  spQcd: Uint8Array;
}

export interface Jpeg2000ComSegment {
  registration: number;
  data: Uint8Array;
}

export interface Jpeg2000CocSegment {
  component: number;
  sCoc: number;
  numberOfDecompositionLevels: number;
  codeBlockWidth: number;
  codeBlockHeight: number;
  codeBlockStyle: number;
  transformation: number;
  precinctSizes: Jpeg2000PrecinctSize[];
}

export interface Jpeg2000QccSegment {
  component: number;
  sQcc: number;
  spQcc: Uint8Array;
}

export interface Jpeg2000PocEntry {
  rSpoc: number;
  cSpoc: number;
  lYEpoc: number;
  rEpoc: number;
  cEpoc: number;
  pPoc: number;
}

export interface Jpeg2000PocSegment {
  entries: Jpeg2000PocEntry[];
}

export interface Jpeg2000RgnSegment {
  component: number;
  style: number;
  shift: number;
}

export type Jpeg2000MctArrayType = 0 | 1 | 2;
export type Jpeg2000MctElementType = 0 | 1 | 2 | 3;

export interface Jpeg2000MctSegment {
  index: number;
  elementType: Jpeg2000MctElementType;
  arrayType: Jpeg2000MctArrayType;
  data: Uint8Array;
}

export interface Jpeg2000MccSegment {
  index: number;
  collectionType: number;
  numComponents: number;
  componentIds: number[];
  outputComponentIds: number[];
  decorrelateIndex: number;
  offsetIndex: number;
  reversible: boolean;
}

export interface Jpeg2000McoSegment {
  numStages: number;
  stageIndices: number[];
}

export interface Jpeg2000SotSegment {
  iSot: number;
  pSot: number;
  tPSot: number;
  tNsot: number;
}

export interface Jpeg2000Tile {
  index: number;
  sot: Jpeg2000SotSegment;
  cod?: Jpeg2000CodSegment;
  qcd?: Jpeg2000QcdSegment;
  coc: Map<number, Jpeg2000CocSegment>;
  qcc: Map<number, Jpeg2000QccSegment>;
  poc: Jpeg2000PocSegment[];
  rgn: Jpeg2000RgnSegment[];
  data: Uint8Array;
}

export interface Jpeg2000Codestream {
  data: Uint8Array;
  mainHeaderSegments: Jpeg2000MarkerSegment[];
  tileHeaderSegments: Jpeg2000MarkerSegment[];
  siz?: Jpeg2000SizSegment;
  cod?: Jpeg2000CodSegment;
  qcd?: Jpeg2000QcdSegment;
  com: Jpeg2000ComSegment[];
  coc: Map<number, Jpeg2000CocSegment>;
  qcc: Map<number, Jpeg2000QccSegment>;
  poc: Jpeg2000PocSegment[];
  rgn: Jpeg2000RgnSegment[];
  mct: Jpeg2000MctSegment[];
  mcc: Jpeg2000MccSegment[];
  mco: Jpeg2000McoSegment[];
  tiles: Jpeg2000Tile[];
}

export interface ParsedJpeg2000Marker {
  marker: Jpeg2000MarkerCode | number;
  markerOffset: number;
}
