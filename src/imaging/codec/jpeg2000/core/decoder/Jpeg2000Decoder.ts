import { parseJpeg2000Codestream } from "../codestream/Jpeg2000CodestreamParser.js";
import type {
  Jpeg2000CodSegment,
  Jpeg2000Codestream,
  Jpeg2000QcdSegment,
  Jpeg2000SizSegment,
  Jpeg2000Tile,
} from "../codestream/Jpeg2000CodestreamTypes.js";
import {
  codCodeBlockSize,
  componentBitDepth,
  componentIsSigned,
} from "../codestream/Jpeg2000CodestreamTypes.js";
import { Jpeg2000T1Decoder } from "../t1/index.js";
import {
  Jpeg2000PacketDecoder,
  Jpeg2000ProgressionOrder,
  bandInfosForResolution,
  type Jpeg2000Packet,
} from "../t2/index.js";
import {
  float64ToInt32,
  int32ToFloat64,
  inverseMultilevel53WithParity,
  inverseMultilevel97WithParity,
} from "../wavelet/index.js";
import {
  applyPart2MctToPixel,
  inverseIct,
  inverseRct,
  resolvePart2MctPlan,
  type Jpeg2000Part2MctPlan,
} from "../colorspace/index.js";
import { resolveJpeg2000Codestream, type Jpeg2000CodestreamForm } from "./Jpeg2000Container.js";

const T1_NMSEDEC_FRACBITS = 6;

export interface Jpeg2000ImageHeader {
  width: number;
  height: number;
  components: number;
  bitDepth: number;
  isSigned: boolean;
  irreversible: boolean;
  isPart2: boolean;
  form: Jpeg2000CodestreamForm;
}

export interface Jpeg2000DecodedImage extends Jpeg2000ImageHeader {
  pixelData: Uint8Array;
}

export interface Jpeg2000TilePacketSummary {
  tileIndex: number;
  packetCount: number;
  headerPresentPackets: number;
  bytesConsumed: number;
  error?: string;
}

export interface Jpeg2000PacketSummary {
  tiles: Jpeg2000TilePacketSummary[];
  totalPackets: number;
  totalHeaderPresentPackets: number;
  totalBytesConsumed: number;
}

export interface Jpeg2000DecodedCodeBlock {
  componentIndex: number;
  resolutionLevel: number;
  band: number;
  globalCodeBlockIndex: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  width: number;
  height: number;
  numPasses: number;
  maxBitplane: number;
  coefficients: Int32Array;
  error?: string;
}

export interface Jpeg2000TileCodeBlockSummary {
  tileIndex: number;
  packetCount: number;
  headerPresentPackets: number;
  bytesConsumed: number;
  decodedCodeBlocks: number;
  failedCodeBlocks: number;
  codeBlocks: Jpeg2000DecodedCodeBlock[];
  error?: string;
}

export interface Jpeg2000CodeBlockDecodeSummary {
  tiles: Jpeg2000TileCodeBlockSummary[];
  totalPackets: number;
  totalHeaderPresentPackets: number;
  totalBytesConsumed: number;
  totalDecodedCodeBlocks: number;
  totalFailedCodeBlocks: number;
}

export interface Jpeg2000DecodedTileComponent {
  componentIndex: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  width: number;
  height: number;
  dx: number;
  dy: number;
  bitDepth: number;
  isSigned: boolean;
  numLevels: number;
  transformation: number;
  coefficients: Int32Array;
  samples: Int32Array;
}

export interface Jpeg2000TileComponentSummary {
  tileIndex: number;
  decodedCodeBlocks: number;
  failedCodeBlocks: number;
  components: Jpeg2000DecodedTileComponent[];
  error?: string;
}

export interface Jpeg2000ComponentDecodeSummary {
  tiles: Jpeg2000TileComponentSummary[];
  totalDecodedCodeBlocks: number;
  totalFailedCodeBlocks: number;
}

interface Jpeg2000TileBounds {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

interface Jpeg2000CodeBlockDescriptor {
  componentIndex: number;
  resolutionLevel: number;
  band: number;
  globalCodeBlockIndex: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  width: number;
  height: number;
}

interface Jpeg2000CodeBlockPacketData {
  totalPasses: number;
  zeroBitplanes: number;
  zeroBitplanesKnown: boolean;
  passLengths: number[];
  useTermAll: boolean;
  chunks: Uint8Array[];
  byteLength: number;
}

interface Jpeg2000TileComponentGeometry {
  componentIndex: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  width: number;
  height: number;
  dx: number;
  dy: number;
  bitDepth: number;
  isSigned: boolean;
}

interface Jpeg2000ImageComponentGeometry {
  componentIndex: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  width: number;
  height: number;
  dx: number;
  dy: number;
  bitDepth: number;
  isSigned: boolean;
}

interface Jpeg2000DecodedImageComponents {
  x0: number;
  y0: number;
  width: number;
  height: number;
  components: Jpeg2000ImageComponentData[];
}

interface Jpeg2000ImageComponentData extends Jpeg2000ImageComponentGeometry {
  samples: Int32Array;
}

type Jpeg2000MctMode = "none" | "rct" | "ict";

/**
 * Phase 2 decode pipeline:
 * - resolves codestream form (J2K / JP2),
 * - parses codestream headers,
 * - decodes packet headers/bodies and code-block coefficients via T2 + MQC/T1,
 * - reconstructs tile components through inverse wavelet (5/3, 9/7),
 * - assembles components and packs interleaved output samples.
 */
export class Jpeg2000Decoder {
  readHeader(frameData: Uint8Array): Jpeg2000ImageHeader {
    const resolved = resolveJpeg2000Codestream(frameData);
    const codestream = parseJpeg2000Codestream(resolved.codestream);
    return extractImageHeader(codestream, resolved.form);
  }

  readTilePacketSummary(frameData: Uint8Array): Jpeg2000PacketSummary {
    const resolved = resolveJpeg2000Codestream(frameData);
    const codestream = parseJpeg2000Codestream(resolved.codestream);
    if (!codestream.siz) {
      throw new Error("JPEG2000 codestream is missing SIZ segment");
    }

    return summarizeTilePackets(codestream, codestream.siz);
  }

  readTileCodeBlockCoefficients(frameData: Uint8Array): Jpeg2000CodeBlockDecodeSummary {
    const resolved = resolveJpeg2000Codestream(frameData);
    const codestream = parseJpeg2000Codestream(resolved.codestream);
    if (!codestream.siz) {
      throw new Error("JPEG2000 codestream is missing SIZ segment");
    }

    return decodeTileCodeBlocks(codestream, codestream.siz);
  }

  readTileComponentSummary(frameData: Uint8Array): Jpeg2000ComponentDecodeSummary {
    const resolved = resolveJpeg2000Codestream(frameData);
    const codestream = parseJpeg2000Codestream(resolved.codestream);
    if (!codestream.siz) {
      throw new Error("JPEG2000 codestream is missing SIZ segment");
    }

    return decodeTileComponents(codestream, codestream.siz);
  }

  decode(frameData: Uint8Array): Jpeg2000DecodedImage {
    const resolved = resolveJpeg2000Codestream(frameData);
    const codestream = parseJpeg2000Codestream(resolved.codestream);
    const header = extractImageHeader(codestream, resolved.form);
    if (!codestream.siz) {
      throw new Error("JPEG2000 codestream is missing SIZ segment");
    }

    const componentSummary = decodeTileComponents(codestream, codestream.siz);
    const imageComponents = assembleImageComponents(codestream.siz, componentSummary.tiles);
    const part2MctPlan = resolvePart2MctPlan(codestream, imageComponents.components.length);
    const mctMode = resolveMctMode(codestream, imageComponents.components.length);

    return {
      ...header,
      pixelData: packImageComponents(imageComponents, mctMode, part2MctPlan),
    };
  }
}

function extractImageHeader(codestream: Jpeg2000Codestream, form: Jpeg2000CodestreamForm): Jpeg2000ImageHeader {
  if (!codestream.siz) {
    throw new Error("JPEG2000 codestream is missing SIZ segment");
  }

  return fromSiz(codestream.siz, codestream, form);
}

function fromSiz(
  siz: Jpeg2000SizSegment,
  codestream: Jpeg2000Codestream,
  form: Jpeg2000CodestreamForm,
): Jpeg2000ImageHeader {
  const width = siz.xSiz - siz.xOSiz;
  const height = siz.ySiz - siz.yOSiz;
  const components = siz.cSiz;

  if (width <= 0 || height <= 0) {
    throw new Error(`Invalid JPEG2000 image dimensions: ${width}x${height}`);
  }
  if (components <= 0 || siz.components.length !== components) {
    throw new Error(`Invalid JPEG2000 component metadata: cSiz=${components}, componentCount=${siz.components.length}`);
  }

  const first = siz.components[0]!;
  const bitDepth = componentBitDepth(first);
  const isSigned = componentIsSigned(first);

  return {
    width,
    height,
    components,
    bitDepth,
    isSigned,
    irreversible: isIrreversibleCodestream(codestream),
    isPart2: isPart2Codestream(codestream),
    form,
  };
}

function summarizeTilePackets(codestream: Jpeg2000Codestream, siz: Jpeg2000SizSegment): Jpeg2000PacketSummary {
  const tileSummaries: Jpeg2000TilePacketSummary[] = [];

  for (const tile of codestream.tiles) {
    tileSummaries.push(summarizeSingleTilePackets(tile, codestream, siz));
  }

  let totalPackets = 0;
  let totalHeaderPresentPackets = 0;
  let totalBytesConsumed = 0;

  for (const tile of tileSummaries) {
    totalPackets += tile.packetCount;
    totalHeaderPresentPackets += tile.headerPresentPackets;
    totalBytesConsumed += tile.bytesConsumed;
  }

  return {
    tiles: tileSummaries,
    totalPackets,
    totalHeaderPresentPackets,
    totalBytesConsumed,
  };
}

function summarizeSingleTilePackets(
  tile: Jpeg2000Tile,
  codestream: Jpeg2000Codestream,
  siz: Jpeg2000SizSegment,
): Jpeg2000TilePacketSummary {
  const cod = resolveTileCod(codestream, tile);
  if (!cod) {
    return {
      tileIndex: tile.index,
      packetCount: 0,
      headerPresentPackets: 0,
      bytesConsumed: 0,
      error: "missing COD segment for tile",
    };
  }

  if (!isKnownProgressionOrder(cod.progressionOrder)) {
    return {
      tileIndex: tile.index,
      packetCount: 0,
      headerPresentPackets: 0,
      bytesConsumed: 0,
      error: `unsupported progression order: ${cod.progressionOrder}`,
    };
  }

  try {
    const packetDecoder = createPacketDecoderForTile(tile, codestream, siz, cod);
    const packets = packetDecoder.decodePackets();
    const qcd = tile.qcd ?? codestream.qcd;

    let headerPresentPackets = 0;
    for (const packet of packets) {
      if (packet.headerPresent) {
        headerPresentPackets++;
      }
    }

    return {
      tileIndex: tile.index,
      packetCount: packets.length,
      headerPresentPackets,
      bytesConsumed: packetDecoder.getOffset(),
    };
  } catch (error) {
    return {
      tileIndex: tile.index,
      packetCount: 0,
      headerPresentPackets: 0,
      bytesConsumed: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function decodeTileCodeBlocks(codestream: Jpeg2000Codestream, siz: Jpeg2000SizSegment): Jpeg2000CodeBlockDecodeSummary {
  const tiles: Jpeg2000TileCodeBlockSummary[] = [];

  for (const tile of codestream.tiles) {
    tiles.push(decodeSingleTileCodeBlocks(tile, codestream, siz));
  }

  let totalPackets = 0;
  let totalHeaderPresentPackets = 0;
  let totalBytesConsumed = 0;
  let totalDecodedCodeBlocks = 0;
  let totalFailedCodeBlocks = 0;

  for (const tile of tiles) {
    totalPackets += tile.packetCount;
    totalHeaderPresentPackets += tile.headerPresentPackets;
    totalBytesConsumed += tile.bytesConsumed;
    totalDecodedCodeBlocks += tile.decodedCodeBlocks;
    totalFailedCodeBlocks += tile.failedCodeBlocks;
  }

  return {
    tiles,
    totalPackets,
    totalHeaderPresentPackets,
    totalBytesConsumed,
    totalDecodedCodeBlocks,
    totalFailedCodeBlocks,
  };
}

function decodeTileComponents(codestream: Jpeg2000Codestream, siz: Jpeg2000SizSegment): Jpeg2000ComponentDecodeSummary {
  const codeBlockSummary = decodeTileCodeBlocks(codestream, siz);
  const tiles: Jpeg2000TileComponentSummary[] = [];

  for (const tileSummary of codeBlockSummary.tiles) {
    const tile = codestream.tiles.find((candidate) => candidate.index === tileSummary.tileIndex);
    if (!tile) {
      tiles.push({
        tileIndex: tileSummary.tileIndex,
        decodedCodeBlocks: tileSummary.decodedCodeBlocks,
        failedCodeBlocks: tileSummary.failedCodeBlocks,
        components: [],
        error: `tile ${tileSummary.tileIndex} not found in codestream`,
      });
      continue;
    }

    const cod = resolveTileCod(codestream, tile);
    if (!cod) {
      tiles.push({
        tileIndex: tileSummary.tileIndex,
        decodedCodeBlocks: tileSummary.decodedCodeBlocks,
        failedCodeBlocks: tileSummary.failedCodeBlocks,
        components: [],
        error: "missing COD segment for tile",
      });
      continue;
    }

    const qcd = tile.qcd ?? codestream.qcd;
    const componentGeometries = buildTileComponentGeometries(siz, tileSummary.tileIndex);
    const components = reconstructTileComponents(tileSummary.codeBlocks, componentGeometries, cod, qcd);

    const reconstructedTile: Jpeg2000TileComponentSummary = {
      tileIndex: tileSummary.tileIndex,
      decodedCodeBlocks: tileSummary.decodedCodeBlocks,
      failedCodeBlocks: tileSummary.failedCodeBlocks,
      components,
    };
    if (tileSummary.error !== undefined) {
      reconstructedTile.error = tileSummary.error;
    }

    tiles.push(reconstructedTile);
  }

  return {
    tiles,
    totalDecodedCodeBlocks: codeBlockSummary.totalDecodedCodeBlocks,
    totalFailedCodeBlocks: codeBlockSummary.totalFailedCodeBlocks,
  };
}

function reconstructTileComponents(
  decodedBlocks: readonly Jpeg2000DecodedCodeBlock[],
  componentGeometries: readonly Jpeg2000TileComponentGeometry[],
  cod: Jpeg2000CodSegment,
  qcd: Jpeg2000QcdSegment | undefined,
): Jpeg2000DecodedTileComponent[] {
  const components: Jpeg2000DecodedTileComponent[] = [];
  const blocksByComponent = new Map<number, Jpeg2000DecodedCodeBlock[]>();

  for (const block of decodedBlocks) {
    if (block.error) {
      continue;
    }
    const list = blocksByComponent.get(block.componentIndex);
    if (list) {
      list.push(block);
    } else {
      blocksByComponent.set(block.componentIndex, [block]);
    }
  }

  for (const geometry of componentGeometries) {
    const coefficients = new Int32Array(geometry.width * geometry.height);
    const blocks = blocksByComponent.get(geometry.componentIndex) ?? [];

    for (const block of blocks) {
      if (block.width <= 0 || block.height <= 0) {
        continue;
      }
      copyCodeBlockIntoComponent(coefficients, geometry.width, block);
    }

    const samples = applyInverseWaveletTransform(
      coefficients,
      geometry.width,
      geometry.height,
      cod.numberOfDecompositionLevels,
      geometry.x0,
      geometry.y0,
      cod.transformation,
      qcd,
      geometry.bitDepth,
    );

    components.push({
      componentIndex: geometry.componentIndex,
      x0: geometry.x0,
      y0: geometry.y0,
      x1: geometry.x1,
      y1: geometry.y1,
      width: geometry.width,
      height: geometry.height,
      dx: geometry.dx,
      dy: geometry.dy,
      bitDepth: geometry.bitDepth,
      isSigned: geometry.isSigned,
      numLevels: cod.numberOfDecompositionLevels,
      transformation: cod.transformation,
      coefficients,
      samples,
    });
  }

  return components;
}

function decodeSingleTileCodeBlocks(
  tile: Jpeg2000Tile,
  codestream: Jpeg2000Codestream,
  siz: Jpeg2000SizSegment,
): Jpeg2000TileCodeBlockSummary {
  const cod = resolveTileCod(codestream, tile);
  if (!cod) {
    return {
      tileIndex: tile.index,
      packetCount: 0,
      headerPresentPackets: 0,
      bytesConsumed: 0,
      decodedCodeBlocks: 0,
      failedCodeBlocks: 0,
      codeBlocks: [],
      error: "missing COD segment for tile",
    };
  }

  if (!isKnownProgressionOrder(cod.progressionOrder)) {
    return {
      tileIndex: tile.index,
      packetCount: 0,
      headerPresentPackets: 0,
      bytesConsumed: 0,
      decodedCodeBlocks: 0,
      failedCodeBlocks: 0,
      codeBlocks: [],
      error: `unsupported progression order: ${cod.progressionOrder}`,
    };
  }

  try {
    const packetDecoder = createPacketDecoderForTile(tile, codestream, siz, cod);
    const packets = packetDecoder.decodePackets();
    const qcd = tile.qcd ?? codestream.qcd;

    let headerPresentPackets = 0;
    for (const packet of packets) {
      if (packet.headerPresent) {
        headerPresentPackets++;
      }
    }

    const descriptors = buildCodeBlockDescriptorsForTile(siz, cod, tile.index);
    const packetData = collectCodeBlockPacketData(packetDecoder, packets);
    const decodedBlocks: Jpeg2000DecodedCodeBlock[] = [];

    for (const descriptor of descriptors) {
      const key = codeBlockKey(descriptor.componentIndex, descriptor.resolutionLevel, descriptor.globalCodeBlockIndex);
      const blockData = packetData.get(key);
      if (!blockData || blockData.byteLength === 0 || blockData.totalPasses <= 0) {
        continue;
      }

      const componentInfo = siz.components[descriptor.componentIndex];
      const componentBitDepthValue = componentInfo ? componentBitDepth(componentInfo) : 0;
      const maxBitplane = estimateMaxBitplane(
        blockData,
        qcd,
        cod.numberOfDecompositionLevels,
        descriptor.resolutionLevel,
        descriptor.band,
        componentBitDepthValue,
      );
      if (maxBitplane < 0) {
        continue;
      }

      const compressedData = joinChunks(blockData.chunks, blockData.byteLength);
      const decoded = decodeSingleCodeBlock(descriptor, cod, blockData, compressedData, maxBitplane);
      decodedBlocks.push(decoded);
    }

    let failedCodeBlocks = 0;
    for (const block of decodedBlocks) {
      if (block.error) {
        failedCodeBlocks++;
      }
    }

    return {
      tileIndex: tile.index,
      packetCount: packets.length,
      headerPresentPackets,
      bytesConsumed: packetDecoder.getOffset(),
      decodedCodeBlocks: decodedBlocks.length - failedCodeBlocks,
      failedCodeBlocks,
      codeBlocks: decodedBlocks,
    };
  } catch (error) {
    return {
      tileIndex: tile.index,
      packetCount: 0,
      headerPresentPackets: 0,
      bytesConsumed: 0,
      decodedCodeBlocks: 0,
      failedCodeBlocks: 0,
      codeBlocks: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function decodeSingleCodeBlock(
  descriptor: Jpeg2000CodeBlockDescriptor,
  cod: Jpeg2000CodSegment,
  blockData: Jpeg2000CodeBlockPacketData,
  compressedData: Uint8Array,
  maxBitplane: number,
): Jpeg2000DecodedCodeBlock {
  try {
    const decoder = new Jpeg2000T1Decoder(descriptor.width, descriptor.height, cod.codeBlockStyle);
    decoder.setOrientation(descriptor.band);

    if (blockData.useTermAll && blockData.passLengths.length > 0) {
      decoder.decodeLayeredWithMode(
        compressedData,
        blockData.passLengths,
        maxBitplane,
        0,
        true,
        (cod.codeBlockStyle & 0x02) !== 0,
      );
    } else {
      decoder.decodeWithBitplane(compressedData, blockData.totalPasses, maxBitplane, 0);
    }

    return {
      componentIndex: descriptor.componentIndex,
      resolutionLevel: descriptor.resolutionLevel,
      band: descriptor.band,
      globalCodeBlockIndex: descriptor.globalCodeBlockIndex,
      x0: descriptor.x0,
      y0: descriptor.y0,
      x1: descriptor.x1,
      y1: descriptor.y1,
      width: descriptor.width,
      height: descriptor.height,
      numPasses: blockData.totalPasses,
      maxBitplane,
      coefficients: normalizeT1Coefficients(decoder.getData()),
    };
  } catch (error) {
    return {
      componentIndex: descriptor.componentIndex,
      resolutionLevel: descriptor.resolutionLevel,
      band: descriptor.band,
      globalCodeBlockIndex: descriptor.globalCodeBlockIndex,
      x0: descriptor.x0,
      y0: descriptor.y0,
      x1: descriptor.x1,
      y1: descriptor.y1,
      width: descriptor.width,
      height: descriptor.height,
      numPasses: blockData.totalPasses,
      maxBitplane,
      coefficients: new Int32Array(descriptor.width * descriptor.height),
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function normalizeT1Coefficients(coefficients: Int32Array): Int32Array {
  const normalized = new Int32Array(coefficients.length);
  for (let i = 0; i < coefficients.length; i++) {
    normalized[i] = (coefficients[i] ?? 0) >> T1_NMSEDEC_FRACBITS;
  }
  return normalized;
}

function createPacketDecoderForTile(
  tile: Jpeg2000Tile,
  codestream: Jpeg2000Codestream,
  siz: Jpeg2000SizSegment,
  cod: Jpeg2000CodSegment,
): Jpeg2000PacketDecoder {
  const packetDecoder = new Jpeg2000PacketDecoder(
    tile.data,
    siz.cSiz,
    cod.numberOfLayers,
    cod.numberOfDecompositionLevels + 1,
    cod.progressionOrder,
    cod.codeBlockStyle,
  );

  const imageWidth = siz.xSiz - siz.xOSiz;
  const imageHeight = siz.ySiz - siz.yOSiz;
  const codeBlockSize = codCodeBlockSize(cod);
  packetDecoder.setImageDimensions(imageWidth, imageHeight, codeBlockSize.width, codeBlockSize.height);

  const tileBounds = resolveTileBounds(siz, tile.index);
  for (let component = 0; component < siz.cSiz; component++) {
    const componentInfo = siz.components[component]!;
    const dx = componentInfo.xRsiz > 0 ? componentInfo.xRsiz : 1;
    const dy = componentInfo.yRsiz > 0 ? componentInfo.yRsiz : 1;

    const componentX0 = ceilDiv(tileBounds.x0, dx);
    const componentY0 = ceilDiv(tileBounds.y0, dy);
    const componentX1 = ceilDiv(tileBounds.x1, dx);
    const componentY1 = ceilDiv(tileBounds.y1, dy);

    packetDecoder.setComponentBounds(component, componentX0, componentY0, componentX1, componentY1);
    packetDecoder.setComponentSampling(component, dx, dy);
  }

  if (cod.precinctSizes.length > 0) {
    const widths = cod.precinctSizes.map((value) => 1 << value.pPx);
    const heights = cod.precinctSizes.map((value) => 1 << value.pPy);
    packetDecoder.setPrecinctSizes(widths, heights);
  }

  packetDecoder.setResilient(false);
  return packetDecoder;
}

function collectCodeBlockPacketData(
  packetDecoder: Jpeg2000PacketDecoder,
  packets: readonly Jpeg2000Packet[],
): Map<string, Jpeg2000CodeBlockPacketData> {
  const map = new Map<string, Jpeg2000CodeBlockPacketData>();

  for (const packet of packets) {
    const order = packetDecoder.getPrecinctCodeBlockOrder(
      packet.componentIndex,
      packet.resolutionLevel,
      packet.precinctIndex,
    );

    if (order.length === 0) {
      continue;
    }

    for (let i = 0; i < packet.codeBlockInclusions.length; i++) {
      const inclusion = packet.codeBlockInclusions[i]!;
      if (!inclusion.included || inclusion.dataLength <= 0) {
        continue;
      }

      if (i >= order.length) {
        continue;
      }

      const globalCodeBlockIndex = order[i]!;
      const key = codeBlockKey(packet.componentIndex, packet.resolutionLevel, globalCodeBlockIndex);
      let entry = map.get(key);
      if (!entry) {
        entry = {
          totalPasses: 0,
          zeroBitplanes: 0,
          zeroBitplanesKnown: false,
          passLengths: [],
          useTermAll: false,
          chunks: [],
          byteLength: 0,
        };
        map.set(key, entry);
      }

      entry.totalPasses += inclusion.numPasses;
      if (!entry.zeroBitplanesKnown) {
        entry.zeroBitplanes = inclusion.zeroBitplanes;
        entry.zeroBitplanesKnown = true;
      }
      if (inclusion.useTermAll && inclusion.passLengths.length > 0) {
        entry.useTermAll = true;
        let passEndOffset = entry.passLengths.length > 0
          ? entry.passLengths[entry.passLengths.length - 1]!
          : 0;
        for (let passIndex = 0; passIndex < inclusion.passLengths.length; passIndex++) {
          passEndOffset += inclusion.passLengths[passIndex]!;
          entry.passLengths.push(passEndOffset);
        }
      }

      if (inclusion.data.length > 0) {
        entry.chunks.push(inclusion.data);
        entry.byteLength += inclusion.data.length;
      }
    }
  }

  return map;
}

function buildCodeBlockDescriptorsForTile(
  siz: Jpeg2000SizSegment,
  cod: Jpeg2000CodSegment,
  tileIndex: number,
): Jpeg2000CodeBlockDescriptor[] {
  const descriptors: Jpeg2000CodeBlockDescriptor[] = [];
  const tileBounds = resolveTileBounds(siz, tileIndex);
  const codeBlockSize = codCodeBlockSize(cod);
  const numLevels = cod.numberOfDecompositionLevels;

  for (let component = 0; component < siz.cSiz; component++) {
    const componentInfo = siz.components[component]!;
    const dx = componentInfo.xRsiz > 0 ? componentInfo.xRsiz : 1;
    const dy = componentInfo.yRsiz > 0 ? componentInfo.yRsiz : 1;

    const componentX0 = ceilDiv(tileBounds.x0, dx);
    const componentY0 = ceilDiv(tileBounds.y0, dy);
    const componentX1 = ceilDiv(tileBounds.x1, dx);
    const componentY1 = ceilDiv(tileBounds.y1, dy);
    const componentWidth = componentX1 - componentX0;
    const componentHeight = componentY1 - componentY0;

    if (componentWidth <= 0 || componentHeight <= 0) {
      continue;
    }

    let globalCodeBlockIndex = 0;
    for (let resolution = 0; resolution <= numLevels; resolution++) {
      const info = bandInfosForResolution(
        componentWidth,
        componentHeight,
        componentX0,
        componentY0,
        numLevels,
        resolution,
      );

      for (const band of info.bands) {
        if (band.width <= 0 || band.height <= 0) {
          continue;
        }

        const numCodeBlocksX = Math.floor((band.width + codeBlockSize.width - 1) / codeBlockSize.width);
        const numCodeBlocksY = Math.floor((band.height + codeBlockSize.height - 1) / codeBlockSize.height);

        for (let codeBlockY = 0; codeBlockY < numCodeBlocksY; codeBlockY++) {
          for (let codeBlockX = 0; codeBlockX < numCodeBlocksX; codeBlockX++) {
            const localX0 = codeBlockX * codeBlockSize.width;
            const localY0 = codeBlockY * codeBlockSize.height;
            const localX1 = Math.min(localX0 + codeBlockSize.width, band.width);
            const localY1 = Math.min(localY0 + codeBlockSize.height, band.height);
            const x0 = band.offsetX + localX0;
            const y0 = band.offsetY + localY0;
            const x1 = band.offsetX + localX1;
            const y1 = band.offsetY + localY1;

            descriptors.push({
              componentIndex: component,
              resolutionLevel: resolution,
              band: band.band,
              globalCodeBlockIndex,
              x0,
              y0,
              x1,
              y1,
              width: x1 - x0,
              height: y1 - y0,
            });

            globalCodeBlockIndex++;
          }
        }
      }
    }
  }

  return descriptors;
}

function buildTileComponentGeometries(siz: Jpeg2000SizSegment, tileIndex: number): Jpeg2000TileComponentGeometry[] {
  const geometries: Jpeg2000TileComponentGeometry[] = [];
  const tileBounds = resolveTileBounds(siz, tileIndex);

  for (let component = 0; component < siz.cSiz; component++) {
    const componentInfo = siz.components[component]!;
    const dx = componentInfo.xRsiz > 0 ? componentInfo.xRsiz : 1;
    const dy = componentInfo.yRsiz > 0 ? componentInfo.yRsiz : 1;

    const x0 = ceilDiv(tileBounds.x0, dx);
    const y0 = ceilDiv(tileBounds.y0, dy);
    const x1 = ceilDiv(tileBounds.x1, dx);
    const y1 = ceilDiv(tileBounds.y1, dy);

    if (x1 <= x0 || y1 <= y0) {
      continue;
    }

    geometries.push({
      componentIndex: component,
      x0,
      y0,
      x1,
      y1,
      width: x1 - x0,
      height: y1 - y0,
      dx,
      dy,
      bitDepth: componentBitDepth(componentInfo),
      isSigned: componentIsSigned(componentInfo),
    });
  }

  return geometries;
}

function buildImageComponentGeometries(siz: Jpeg2000SizSegment): Jpeg2000ImageComponentGeometry[] {
  const geometries: Jpeg2000ImageComponentGeometry[] = [];

  for (let component = 0; component < siz.cSiz; component++) {
    const componentInfo = siz.components[component]!;
    const dx = componentInfo.xRsiz > 0 ? componentInfo.xRsiz : 1;
    const dy = componentInfo.yRsiz > 0 ? componentInfo.yRsiz : 1;
    const x0 = ceilDiv(siz.xOSiz, dx);
    const y0 = ceilDiv(siz.yOSiz, dy);
    const x1 = ceilDiv(siz.xSiz, dx);
    const y1 = ceilDiv(siz.ySiz, dy);

    geometries.push({
      componentIndex: component,
      x0,
      y0,
      x1,
      y1,
      width: Math.max(0, x1 - x0),
      height: Math.max(0, y1 - y0),
      dx,
      dy,
      bitDepth: componentBitDepth(componentInfo),
      isSigned: componentIsSigned(componentInfo),
    });
  }

  return geometries;
}

function copyCodeBlockIntoComponent(
  destination: Int32Array,
  destinationWidth: number,
  block: Jpeg2000DecodedCodeBlock,
): void {
  if (destinationWidth <= 0 || block.width <= 0 || block.height <= 0 || block.coefficients.length === 0) {
    return;
  }

  let srcIndex = 0;
  for (let y = block.y0; y < block.y1; y++) {
    for (let x = block.x0; x < block.x1; x++) {
      const dstIndex = (y * destinationWidth) + x;
      if (dstIndex >= 0 && dstIndex < destination.length && srcIndex < block.coefficients.length) {
        destination[dstIndex] = block.coefficients[srcIndex] ?? 0;
      }
      srcIndex++;
    }
  }
}

function applyInverseWaveletTransform(
  coefficients: Int32Array,
  width: number,
  height: number,
  levels: number,
  x0: number,
  y0: number,
  transformation: number,
  qcd: Jpeg2000QcdSegment | undefined,
  bitDepth: number,
): Int32Array {
  if (levels <= 0) {
    return coefficients.slice();
  }

  if (transformation === 1) {
    const reconstructed = coefficients.slice();
    inverseMultilevel53WithParity(reconstructed, width, height, levels, x0, y0);
    return reconstructed;
  }

  if (transformation === 0) {
    const reconstructed = int32ToFloat64(coefficients);
    const quantizationType = qcd ? (qcd.sQcd & 0x1f) : 0;
    if (qcd && (quantizationType === 1 || quantizationType === 2)) {
      const steps = decodeQuantizationSteps(qcd, levels, bitDepth, transformation);
      if (steps.length > 0) {
        dequantizeBySubband(reconstructed, width, height, levels, x0, y0, steps);
      }
    }
    inverseMultilevel97WithParity(reconstructed, width, height, levels, x0, y0);
    return float64ToInt32(reconstructed);
  }

  throw new Error(`unsupported wavelet transformation type: ${transformation}`);
}

function decodeQuantizationSteps(
  qcd: Jpeg2000QcdSegment,
  levels: number,
  bitDepth: number,
  transformation: number,
): number[] {
  if (qcd.spQcd.length === 0) {
    return [];
  }

  const quantizationType = qcd.sQcd & 0x1f;
  if (quantizationType !== 1 && quantizationType !== 2) {
    return [];
  }

  const numSubbands = (3 * levels) + 1;
  const steps = new Array<number>(numSubbands).fill(1);

  if (quantizationType === 1) {
    if (qcd.spQcd.length < 2) {
      return [];
    }
    const encoded = (qcd.spQcd[0]! << 8) | qcd.spQcd[1]!;
    const baseExponent = (encoded >> 11) & 0x1f;
    const baseMantissa = encoded & 0x7ff;

    for (let index = 0; index < numSubbands; index++) {
      let exponent = baseExponent;
      if (index > 0) {
        exponent -= Math.floor((index - 1) / 3);
        if (exponent < 0) {
          exponent = 0;
        }
      }
      steps[index] = decodeQuantizationStep(exponent, baseMantissa, bitDepth, subbandLog2Gain(index, transformation));
    }

    return steps;
  }

  const availableBands = Math.floor(qcd.spQcd.length / 2);
  const count = Math.min(numSubbands, availableBands);
  if (count <= 0) {
    return [];
  }

  for (let index = 0; index < count; index++) {
    const offset = index * 2;
    const encoded = (qcd.spQcd[offset]! << 8) | qcd.spQcd[offset + 1]!;
    const exponent = (encoded >> 11) & 0x1f;
    const mantissa = encoded & 0x7ff;
    steps[index] = decodeQuantizationStep(exponent, mantissa, bitDepth, subbandLog2Gain(index, transformation));
  }

  return steps.slice(0, count);
}

function subbandLog2Gain(subbandIndex: number, transformation: number): number {
  if (transformation === 0) {
    return 0;
  }
  if (subbandIndex === 0) {
    return 0;
  }
  const orientation = ((subbandIndex - 1) % 3) + 1;
  return orientation === 3 ? 2 : 1;
}

function decodeQuantizationStep(exponent: number, mantissa: number, bitDepth: number, log2Gain: number): number {
  const rb = bitDepth + log2Gain;
  return (1 + (mantissa / 2048)) * (2 ** (rb - exponent));
}

function dequantizeBySubband(
  coefficients: Float64Array,
  width: number,
  height: number,
  levels: number,
  x0: number,
  y0: number,
  steps: readonly number[],
): void {
  let subbandIndex = 0;

  let info = bandInfosForResolution(width, height, x0, y0, levels, 0);
  if (info.bands.length > 0 && subbandIndex < steps.length) {
    const band = info.bands[0]!;
    applySubbandScale(coefficients, width, band.offsetX, band.offsetY, band.width, band.height, steps[subbandIndex]!);
  }
  subbandIndex++;

  for (let resolution = 1; resolution <= levels; resolution++) {
    info = bandInfosForResolution(width, height, x0, y0, levels, resolution);
    for (const band of info.bands) {
      if (subbandIndex >= steps.length) {
        return;
      }
      applySubbandScale(coefficients, width, band.offsetX, band.offsetY, band.width, band.height, steps[subbandIndex]!);
      subbandIndex++;
    }
  }
}

function applySubbandScale(
  coefficients: Float64Array,
  stride: number,
  x0: number,
  y0: number,
  width: number,
  height: number,
  scale: number,
): void {
  if (width <= 0 || height <= 0 || scale <= 0) {
    return;
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = ((y0 + y) * stride) + (x0 + x);
      if (index >= 0 && index < coefficients.length) {
        coefficients[index] = (coefficients[index] ?? 0) * scale;
      }
    }
  }
}

function assembleImageComponents(
  siz: Jpeg2000SizSegment,
  tiles: readonly Jpeg2000TileComponentSummary[],
): Jpeg2000DecodedImageComponents {
  const imageWidth = siz.xSiz - siz.xOSiz;
  const imageHeight = siz.ySiz - siz.yOSiz;
  const geometries = buildImageComponentGeometries(siz);

  const components: Jpeg2000ImageComponentData[] = geometries.map((geometry) => ({
    ...geometry,
    samples: new Int32Array(geometry.width * geometry.height),
  }));

  const componentByIndex = new Map<number, Jpeg2000ImageComponentData>();
  for (const component of components) {
    componentByIndex.set(component.componentIndex, component);
  }

  for (const tile of tiles) {
    for (const component of tile.components) {
      const imageComponent = componentByIndex.get(component.componentIndex);
      if (!imageComponent || imageComponent.width <= 0 || imageComponent.height <= 0) {
        continue;
      }

      const destX0 = component.x0 - imageComponent.x0;
      const destY0 = component.y0 - imageComponent.y0;
      for (let y = 0; y < component.height; y++) {
        const srcRowStart = y * component.width;
        const srcRowEnd = srcRowStart + component.width;
        const dstRowStart = ((destY0 + y) * imageComponent.width) + destX0;
        if (dstRowStart < 0 || dstRowStart + component.width > imageComponent.samples.length) {
          continue;
        }

        imageComponent.samples.set(component.samples.subarray(srcRowStart, srcRowEnd), dstRowStart);
      }
    }
  }

  return {
    x0: siz.xOSiz,
    y0: siz.yOSiz,
    width: imageWidth,
    height: imageHeight,
    components,
  };
}

function resolveMctMode(codestream: Jpeg2000Codestream, componentCount: number): Jpeg2000MctMode {
  if (componentCount < 3) {
    return "none";
  }

  const cod = codestream.cod ?? codestream.tiles.find((tile) => tile.cod)?.cod;
  if (!cod || cod.multipleComponentTransform !== 1) {
    return "none";
  }

  return cod.transformation === 1 ? "rct" : "ict";
}

function isIrreversibleCodestream(codestream: Jpeg2000Codestream): boolean {
  const cod = codestream.cod ?? codestream.tiles.find((tile) => tile.cod)?.cod;
  if (!cod) {
    return false;
  }
  return cod.transformation === 0;
}

function isPart2Codestream(codestream: Jpeg2000Codestream): boolean {
  return codestream.mct.length > 0 || codestream.mcc.length > 0 || codestream.mco.length > 0;
}

function packImageComponents(
  image: Jpeg2000DecodedImageComponents,
  mctMode: Jpeg2000MctMode,
  part2MctPlan: Jpeg2000Part2MctPlan,
): Uint8Array {
  const componentCount = image.components.length;
  if (componentCount === 0 || image.width <= 0 || image.height <= 0) {
    return new Uint8Array(0);
  }

  const maxBitDepth = image.components.reduce((current, component) => Math.max(current, component.bitDepth), 0);
  const bytesPerSample = maxBitDepth <= 8 ? 1 : 2;
  const out = new Uint8Array(image.width * image.height * componentCount * bytesPerSample);

  let offset = 0;
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const absX = image.x0 + x;
      const absY = image.y0 + y;
      const perPixelSamples = sampleAllComponentsAtImagePosition(image.components, absX, absY);
      if (hasPart2MctPlan(part2MctPlan)) {
        applyPart2MctToPixel(perPixelSamples, part2MctPlan);
      } else {
        applyInverseMctToPixel(perPixelSamples, mctMode);
      }

      for (let componentIndex = 0; componentIndex < image.components.length; componentIndex++) {
        const component = image.components[componentIndex]!;
        const sample = perPixelSamples[componentIndex] ?? 0;
        const stored = normalizeForStorage(sample, component.bitDepth, component.isSigned);

        if (bytesPerSample === 1) {
          out[offset] = stored & 0xff;
          offset++;
        } else {
          out[offset] = stored & 0xff;
          out[offset + 1] = (stored >> 8) & 0xff;
          offset += 2;
        }
      }
    }
  }

  return out;
}

function sampleAllComponentsAtImagePosition(
  components: readonly Jpeg2000ImageComponentData[],
  absX: number,
  absY: number,
): number[] {
  const samples = new Array<number>(components.length);
  for (let i = 0; i < components.length; i++) {
    samples[i] = sampleComponentAtImagePosition(components[i]!, absX, absY);
  }
  return samples;
}

function applyInverseMctToPixel(samples: number[], mode: Jpeg2000MctMode): void {
  if (mode === "none" || samples.length < 3) {
    return;
  }

  const y = samples[0] ?? 0;
  const cb = samples[1] ?? 0;
  const cr = samples[2] ?? 0;

  const converted = mode === "rct"
    ? inverseRct(y, cb, cr)
    : inverseIct(y, cb, cr);

  samples[0] = converted.r;
  samples[1] = converted.g;
  samples[2] = converted.b;
}

function hasPart2MctPlan(plan: Jpeg2000Part2MctPlan): boolean {
  return plan.bindings.length > 0
    || (plan.fallbackMatrix !== undefined && plan.fallbackMatrix.length > 0)
    || (plan.fallbackOffsets !== undefined && plan.fallbackOffsets.length > 0);
}

function sampleComponentAtImagePosition(component: Jpeg2000ImageComponentData, absX: number, absY: number): number {
  if (component.width <= 0 || component.height <= 0 || component.samples.length === 0) {
    return 0;
  }

  const x = ceilDiv(absX, component.dx) - component.x0;
  const y = ceilDiv(absY, component.dy) - component.y0;
  const clampedX = clamp(x, 0, component.width - 1);
  const clampedY = clamp(y, 0, component.height - 1);
  const index = (clampedY * component.width) + clampedX;
  return component.samples[index] ?? 0;
}

function normalizeForStorage(value: number, bitDepth: number, isSigned: boolean): number {
  if (bitDepth <= 0) {
    return 0;
  }

  if (isSigned) {
    const min = -(1 << (bitDepth - 1));
    const max = (1 << (bitDepth - 1)) - 1;
    let clamped = clamp(value, min, max);
    if (clamped < 0) {
      clamped += 1 << bitDepth;
    }
    return clamped;
  }

  const shifted = value + (1 << (bitDepth - 1));
  return clamp(shifted, 0, (1 << bitDepth) - 1);
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function estimateMaxBitplane(
  data: Jpeg2000CodeBlockPacketData,
  qcd: Jpeg2000QcdSegment | undefined,
  numLevels: number,
  resolution: number,
  band: number,
  bitDepth: number,
): number {
  const zeroBitplanes = data.zeroBitplanesKnown ? data.zeroBitplanes : 0;

  let maxFromPass = -1;
  if (data.totalPasses > 0) {
    const codeBlockNumBps = Math.floor((data.totalPasses + 2) / 3);
    if (codeBlockNumBps > 0) {
      maxFromPass = (codeBlockNumBps - 1) + T1_NMSEDEC_FRACBITS;
    }
  }

  let maxFromQcd = -1;
  const bandNumBps = bandNumBpsFromQcd(qcd, numLevels, resolution, band);
  if (bandNumBps > 0) {
    const codeBlockNumBps = bandNumBps - zeroBitplanes;
    if (codeBlockNumBps > 0) {
      maxFromQcd = (codeBlockNumBps - 1) + T1_NMSEDEC_FRACBITS;
    }
  }

  let maxBitplane = -1;
  if (maxFromPass >= 0 && maxFromQcd >= 0) {
    maxBitplane = Math.max(maxFromPass, maxFromQcd);
  } else if (maxFromQcd >= 0) {
    maxBitplane = maxFromQcd;
  } else if (maxFromPass >= 0) {
    maxBitplane = maxFromPass;
  } else if (bitDepth > 0) {
    maxBitplane = ((bitDepth + numLevels + T1_NMSEDEC_FRACBITS) - 1) - zeroBitplanes;
  }

  return Math.max(-1, maxBitplane);
}

function bandNumBpsFromQcd(
  qcd: Jpeg2000QcdSegment | undefined,
  numLevels: number,
  resolution: number,
  band: number,
): number {
  if (!qcd) {
    return -1;
  }

  const index = subbandIndex(numLevels, resolution, band);
  if (index < 0) {
    return -1;
  }

  const guardBits = qcd.sQcd >> 5;
  const quantizationType = qcd.sQcd & 0x1f;

  switch (quantizationType) {
    case 0: {
      if (index >= qcd.spQcd.length) {
        return -1;
      }
      const exponent = (qcd.spQcd[index] ?? 0) >> 3;
      return exponent + guardBits - 1;
    }
    case 1: {
      if (qcd.spQcd.length < 2) {
        return -1;
      }
      const encoded = ((qcd.spQcd[0] ?? 0) << 8) | (qcd.spQcd[1] ?? 0);
      let exponent = (encoded >> 11) & 0x1f;
      if (index > 0) {
        exponent -= Math.floor((index - 1) / 3);
        if (exponent < 0) {
          exponent = 0;
        }
      }
      return exponent + guardBits - 1;
    }
    case 2: {
      const offset = index * 2;
      if (offset + 1 >= qcd.spQcd.length) {
        return -1;
      }
      const encoded = ((qcd.spQcd[offset] ?? 0) << 8) | (qcd.spQcd[offset + 1] ?? 0);
      const exponent = (encoded >> 11) & 0x1f;
      return exponent + guardBits - 1;
    }
    default:
      return -1;
  }
}

function subbandIndex(numLevels: number, resolution: number, band: number): number {
  if (resolution < 0 || resolution > numLevels) {
    return -1;
  }
  if (resolution === 0) {
    return band === 0 ? 0 : -1;
  }
  if (band < 1 || band > 3) {
    return -1;
  }
  return 1 + ((resolution - 1) * 3) + (band - 1);
}

function joinChunks(chunks: Uint8Array[], totalLength: number): Uint8Array {
  if (chunks.length === 1) {
    return chunks[0]!;
  }

  const output = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
}

function resolveTileCod(codestream: Jpeg2000Codestream, tile: Jpeg2000Tile): Jpeg2000CodSegment | undefined {
  return tile.cod ?? codestream.cod;
}

function resolveTileBounds(siz: Jpeg2000SizSegment, tileIndex: number): Jpeg2000TileBounds {
  const numTilesX = Math.max(1, Math.floor((siz.xSiz - siz.xTOSiz + siz.xTSiz - 1) / siz.xTSiz));
  const tileX = tileIndex % numTilesX;
  const tileY = Math.floor(tileIndex / numTilesX);

  const tileGridX0 = siz.xTOSiz + tileX * siz.xTSiz;
  const tileGridY0 = siz.yTOSiz + tileY * siz.yTSiz;
  const tileGridX1 = tileGridX0 + siz.xTSiz;
  const tileGridY1 = tileGridY0 + siz.yTSiz;

  return {
    x0: Math.max(tileGridX0, siz.xOSiz),
    y0: Math.max(tileGridY0, siz.yOSiz),
    x1: Math.min(tileGridX1, siz.xSiz),
    y1: Math.min(tileGridY1, siz.ySiz),
  };
}

function codeBlockKey(component: number, resolution: number, globalCodeBlockIndex: number): string {
  return `${component}:${resolution}:${globalCodeBlockIndex}`;
}

function ceilDiv(a: number, b: number): number {
  if (b <= 0) {
    return 0;
  }
  return Math.floor((a + b - 1) / b);
}

function isKnownProgressionOrder(value: number): value is Jpeg2000ProgressionOrder {
  return value === Jpeg2000ProgressionOrder.LRCP
    || value === Jpeg2000ProgressionOrder.RLCP
    || value === Jpeg2000ProgressionOrder.RPCL
    || value === Jpeg2000ProgressionOrder.PCRL
    || value === Jpeg2000ProgressionOrder.CPRL;
}
