import { Jpeg2000PacketHeaderBitWriter, floorLog2 } from "./Jpeg2000PacketHeaderBitIo.js";
import { Jpeg2000TagTree } from "./Jpeg2000TagTree.js";
import {
  Jpeg2000ProgressionOrder,
  createCodeBlockStates,
  type Jpeg2000CodeBlockState,
} from "./Jpeg2000PacketTypes.js";

export interface Jpeg2000PacketCodeBlockContribution {
  layerIndex?: number;
  componentIndex: number;
  resolutionLevel: number;
  band: number;
  globalCodeBlockIndex: number;
  numPasses: number;
  zeroBitplanes: number;
  data: Uint8Array;
  passLengths?: number[];
  useTermAll?: boolean;
}

export interface Jpeg2000PacketBandEntry {
  cbx: number;
  cby: number;
  globalCodeBlockIndex: number;
}

export interface Jpeg2000PacketBandPlan {
  band: number;
  numCodeBlocksX: number;
  numCodeBlocksY: number;
  entries: Jpeg2000PacketBandEntry[];
}

export interface Jpeg2000PacketPlan {
  layerIndex: number;
  resolutionLevel: number;
  componentIndex: number;
  precinctIndex: number;
  bands: Jpeg2000PacketBandPlan[];
}

interface Jpeg2000PacketBandContext {
  inclusionTagTree: Jpeg2000TagTree;
  zeroBitplaneTagTree: Jpeg2000TagTree;
  codeBlockStates: Jpeg2000CodeBlockState[];
  numCodeBlocksX: number;
  numCodeBlocksY: number;
}

export function encodePacketsSingleLayerLrcp(
  packetPlans: Jpeg2000PacketPlan[],
  contributions: Map<string, Jpeg2000PacketCodeBlockContribution>,
): Uint8Array {
  return encodePackets(packetPlans, contributions, Jpeg2000ProgressionOrder.LRCP);
}

export function encodePacketsLrcp(
  packetPlans: Jpeg2000PacketPlan[],
  contributions: Map<string, Jpeg2000PacketCodeBlockContribution>,
): Uint8Array {
  return encodePackets(packetPlans, contributions, Jpeg2000ProgressionOrder.LRCP);
}

export function encodePackets(
  packetPlans: Jpeg2000PacketPlan[],
  contributions: Map<string, Jpeg2000PacketCodeBlockContribution>,
  progressionOrder: Jpeg2000ProgressionOrder = Jpeg2000ProgressionOrder.LRCP,
): Uint8Array {
  const bytes: number[] = [];
  const bandContexts = new Map<string, Jpeg2000PacketBandContext>();
  const orderedPlans = orderPacketPlans(packetPlans, progressionOrder);

  for (const packet of orderedPlans) {
    const encoded = encodeSinglePacket(packet, contributions, bandContexts);
    append(bytes, encoded.header);
    append(bytes, encoded.body);
  }

  return Uint8Array.from(bytes);
}

function orderPacketPlans(
  packetPlans: Jpeg2000PacketPlan[],
  progressionOrder: Jpeg2000ProgressionOrder,
): Jpeg2000PacketPlan[] {
  const ordered = packetPlans.slice();
  ordered.sort((a, b) => comparePacketPlans(a, b, progressionOrder));
  return ordered;
}

function comparePacketPlans(
  left: Jpeg2000PacketPlan,
  right: Jpeg2000PacketPlan,
  progressionOrder: Jpeg2000ProgressionOrder,
): number {
  switch (progressionOrder) {
    case Jpeg2000ProgressionOrder.LRCP:
      return comparePlanDimensions(left, right, ["layer", "resolution", "component", "precinct"]);
    case Jpeg2000ProgressionOrder.RLCP:
      return comparePlanDimensions(left, right, ["resolution", "layer", "component", "precinct"]);
    case Jpeg2000ProgressionOrder.RPCL:
      return comparePlanDimensions(left, right, ["resolution", "precinct", "component", "layer"]);
    case Jpeg2000ProgressionOrder.PCRL:
      return comparePlanDimensions(left, right, ["precinct", "component", "resolution", "layer"]);
    case Jpeg2000ProgressionOrder.CPRL:
      return comparePlanDimensions(left, right, ["component", "precinct", "resolution", "layer"]);
    default:
      throw new Error(`unsupported progression order: ${progressionOrder}`);
  }
}

function comparePlanDimensions(
  left: Jpeg2000PacketPlan,
  right: Jpeg2000PacketPlan,
  order: Array<"layer" | "resolution" | "component" | "precinct">,
): number {
  for (let i = 0; i < order.length; i++) {
    const dimension = order[i]!;
    const delta = planDimensionValue(left, dimension) - planDimensionValue(right, dimension);
    if (delta !== 0) {
      return delta;
    }
  }

  return 0;
}

function planDimensionValue(plan: Jpeg2000PacketPlan, dimension: "layer" | "resolution" | "component" | "precinct"): number {
  switch (dimension) {
    case "layer":
      return plan.layerIndex;
    case "resolution":
      return plan.resolutionLevel;
    case "component":
      return plan.componentIndex;
    case "precinct":
      return plan.precinctIndex;
  }
}

function encodeSinglePacket(
  packet: Jpeg2000PacketPlan,
  contributions: Map<string, Jpeg2000PacketCodeBlockContribution>,
  bandContexts: Map<string, Jpeg2000PacketBandContext>,
): { header: Uint8Array; body: Uint8Array } {
  const writer = new Jpeg2000PacketHeaderBitWriter();
  const perBand = new Array<{
    plan: Jpeg2000PacketBandPlan;
    context: Jpeg2000PacketBandContext;
    included: boolean[];
    blockData: Array<Jpeg2000PacketCodeBlockContribution | undefined>;
  }>(packet.bands.length);

  let hasIncludedBlock = false;

  for (let i = 0; i < packet.bands.length; i++) {
    const bandPlan = packet.bands[i]!;
    const context = getOrCreateBandContext(packet, bandPlan, bandContexts);
    if (packet.layerIndex === 0) {
      context.inclusionTagTree.resetEncoding();
      context.zeroBitplaneTagTree.resetEncoding();
    }

    const included = new Array<boolean>(bandPlan.entries.length).fill(false);
    const blockData = new Array<Jpeg2000PacketCodeBlockContribution | undefined>(bandPlan.entries.length);

    for (let entryIndex = 0; entryIndex < bandPlan.entries.length; entryIndex++) {
      const entry = bandPlan.entries[entryIndex]!;
      const stateIndex = entry.cby * context.numCodeBlocksX + entry.cbx;
      const state = context.codeBlockStates[stateIndex]!;
      const layeredKey = codeBlockContributionKey(
        packet.layerIndex,
        packet.componentIndex,
        packet.resolutionLevel,
        entry.globalCodeBlockIndex,
      );
      const fallbackKey = legacyCodeBlockContributionKey(
        packet.componentIndex,
        packet.resolutionLevel,
        entry.globalCodeBlockIndex,
      );
      const contribution = contributions.get(layeredKey) ?? contributions.get(fallbackKey);
      const include = contribution !== undefined && contribution.numPasses > 0 && contribution.data.length > 0;
      included[entryIndex] = include;
      blockData[entryIndex] = contribution;

      if (!state.included && include) {
        context.inclusionTagTree.setValue(entry.cbx, entry.cby, packet.layerIndex);
      }

      if (packet.layerIndex === 0) {
        const zeroBitplanes = contribution?.zeroBitplanes ?? 0;
        context.zeroBitplaneTagTree.setValue(entry.cbx, entry.cby, zeroBitplanes);
      }

      if (include) {
        hasIncludedBlock = true;
      }
    }

    perBand[i] = {
      plan: bandPlan,
      context,
      included,
      blockData,
    };
  }

  if (!hasIncludedBlock) {
    writer.writeBit(0);
    return {
      header: writer.flush(),
      body: new Uint8Array(0),
    };
  }

  writer.writeBit(1);
  const bodyParts: Uint8Array[] = [];
  let bodyLength = 0;

  for (let bandIndex = 0; bandIndex < perBand.length; bandIndex++) {
    const band = perBand[bandIndex]!;
    for (let entryIndex = 0; entryIndex < band.plan.entries.length; entryIndex++) {
      const entry = band.plan.entries[entryIndex]!;
      const include = band.included[entryIndex]!;
      const contribution = band.blockData[entryIndex];
      const stateIndex = entry.cby * band.context.numCodeBlocksX + entry.cbx;
      const state = band.context.codeBlockStates[stateIndex]!;

      if (!state.included) {
        band.context.inclusionTagTree.encode(writer, entry.cbx, entry.cby, packet.layerIndex + 1);
        if (!include || !contribution) {
          continue;
        }

        band.context.zeroBitplaneTagTree.encode(writer, entry.cbx, entry.cby, 999);
        state.included = true;
        state.firstLayer = packet.layerIndex;
        if (state.numLenBits <= 0) {
          state.numLenBits = 3;
        }
      } else {
        writer.writeBit(include ? 1 : 0);
        if (!include || !contribution) {
          continue;
        }
      }

      encodeNumPasses(writer, contribution.numPasses);
      encodeCodeBlockLength(
        writer,
        state,
        contribution.numPasses,
        contribution.data.length,
        contribution.useTermAll === true,
        contribution.passLengths,
      );
      bodyParts.push(contribution.data);
      bodyLength += contribution.data.length;
      state.numPassesTotal += contribution.numPasses;
    }
  }

  const body = join(bodyParts, bodyLength);
  return {
    header: writer.flush(),
    body,
  };
}

function encodeNumPasses(writer: Jpeg2000PacketHeaderBitWriter, numPasses: number): void {
  if (numPasses <= 0) {
    throw new Error(`invalid number of coding passes: ${numPasses}`);
  }
  if (numPasses === 1) {
    writer.writeBit(0);
    return;
  }
  if (numPasses === 2) {
    writer.writeBits(0x02, 2);
    return;
  }
  if (numPasses <= 5) {
    writer.writeBits(0x0c | (numPasses - 3), 4);
    return;
  }
  if (numPasses <= 36) {
    writer.writeBits(0x1e0 | (numPasses - 6), 9);
    return;
  }
  if (numPasses <= 164) {
    writer.writeBits(0xff80 | (numPasses - 37), 16);
    return;
  }

  throw new Error(`number of coding passes exceeds JPEG2000 limit: ${numPasses} > 164`);
}

function encodeCodeBlockLength(
  writer: Jpeg2000PacketHeaderBitWriter,
  state: Jpeg2000CodeBlockState,
  numPasses: number,
  dataLength: number,
  useTermAll: boolean,
  passLengths?: number[],
): void {
  if (state.numLenBits <= 0) {
    state.numLenBits = 3;
  }

  if (useTermAll) {
    const lengths = normalizePassLengths(passLengths, numPasses, dataLength);
    let increment = 0;
    for (let i = 0; i < lengths.length; i++) {
      const required = (floorLog2(lengths[i]!) + 1) - state.numLenBits;
      if (required > increment) {
        increment = required;
      }
    }
    if (increment < 0) {
      increment = 0;
    }
    encodeCommaCode(writer, increment);
    state.numLenBits += increment;

    for (let i = 0; i < lengths.length; i++) {
      writer.writeBits(lengths[i]!, state.numLenBits);
    }
    return;
  }

  const increment = Math.max(0, (floorLog2(dataLength) + 1) - (state.numLenBits + floorLog2(numPasses)));
  encodeCommaCode(writer, increment);
  state.numLenBits += increment;

  const bitCount = state.numLenBits + floorLog2(numPasses);
  writer.writeBits(dataLength, bitCount);
}

function encodeCommaCode(writer: Jpeg2000PacketHeaderBitWriter, value: number): void {
  for (let i = 0; i < value; i++) {
    writer.writeBit(1);
  }
  writer.writeBit(0);
}

function getOrCreateBandContext(
  packet: Jpeg2000PacketPlan,
  bandPlan: Jpeg2000PacketBandPlan,
  contexts: Map<string, Jpeg2000PacketBandContext>,
): Jpeg2000PacketBandContext {
  const key = bandContextKey(
    packet.componentIndex,
    packet.resolutionLevel,
    packet.precinctIndex,
    bandPlan.band,
  );

  const current = contexts.get(key);
  if (current) {
    if (
      current.numCodeBlocksX !== bandPlan.numCodeBlocksX
      || current.numCodeBlocksY !== bandPlan.numCodeBlocksY
    ) {
      throw new Error(
        `band context dimensions changed for ${key}: ${current.numCodeBlocksX}x${current.numCodeBlocksY} -> ${bandPlan.numCodeBlocksX}x${bandPlan.numCodeBlocksY}`,
      );
    }
    return current;
  }

  const codeBlockCount = bandPlan.numCodeBlocksX * bandPlan.numCodeBlocksY;
  const created: Jpeg2000PacketBandContext = {
    inclusionTagTree: new Jpeg2000TagTree(bandPlan.numCodeBlocksX, bandPlan.numCodeBlocksY),
    zeroBitplaneTagTree: new Jpeg2000TagTree(bandPlan.numCodeBlocksX, bandPlan.numCodeBlocksY),
    codeBlockStates: createCodeBlockStates(codeBlockCount),
    numCodeBlocksX: bandPlan.numCodeBlocksX,
    numCodeBlocksY: bandPlan.numCodeBlocksY,
  };
  contexts.set(key, created);
  return created;
}

function bandContextKey(component: number, resolution: number, precinct: number, band: number): string {
  return `${component}:${resolution}:${precinct}:${band}`;
}

function codeBlockContributionKey(layer: number, component: number, resolution: number, globalCodeBlockIndex: number): string {
  return `${layer}:${component}:${resolution}:${globalCodeBlockIndex}`;
}

function legacyCodeBlockContributionKey(component: number, resolution: number, globalCodeBlockIndex: number): string {
  return `${component}:${resolution}:${globalCodeBlockIndex}`;
}

function normalizePassLengths(passLengths: number[] | undefined, numPasses: number, dataLength: number): number[] {
  if (numPasses <= 0) {
    return [];
  }

  if (passLengths && passLengths.length >= numPasses) {
    const normalized = passLengths
      .slice(0, numPasses)
      .map((value) => Math.max(0, Math.trunc(value)));
    const total = normalized.reduce((sum, value) => sum + value, 0);
    if (total !== dataLength) {
      const adjusted = normalized.slice();
      adjusted[adjusted.length - 1] = Math.max(0, adjusted[adjusted.length - 1]! + (dataLength - total));
      return adjusted;
    }
    return normalized;
  }

  const fallback = new Array<number>(numPasses).fill(0);
  fallback[fallback.length - 1] = Math.max(0, dataLength);
  return fallback;
}

function append(target: number[], source: Uint8Array): void {
  for (let i = 0; i < source.length; i++) {
    target.push(source[i]!);
  }
}

function join(parts: Uint8Array[], totalLength: number): Uint8Array {
  if (parts.length === 0 || totalLength <= 0) {
    return new Uint8Array(0);
  }
  if (parts.length === 1) {
    return parts[0]!;
  }
  const out = new Uint8Array(totalLength);
  let offset = 0;
  for (let i = 0; i < parts.length; i++) {
    out.set(parts[i]!, offset);
    offset += parts[i]!.length;
  }
  return out;
}
