import {
  bandInfosForResolution,
  ceilDiv,
  floorDiv,
} from "./Jpeg2000PacketGeometry.js";
import {
  parsePacketHeaderMulti,
  type Jpeg2000PacketHeaderBandState,
} from "./Jpeg2000PacketHeaderParser.js";
import { Jpeg2000TagTree } from "./Jpeg2000TagTree.js";
import {
  Jpeg2000ProgressionOrder,
  createEmptyPacket,
  type Jpeg2000CodeBlockPosition,
  type Jpeg2000CodeBlockState,
  type Jpeg2000Packet,
} from "./Jpeg2000PacketTypes.js";

interface Jpeg2000ComponentBounds {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface Jpeg2000CodeBlockGridDimension {
  numCodeBlocksX: number;
  numCodeBlocksY: number;
}

interface Jpeg2000CodeBlockEntry {
  cbx: number;
  cby: number;
  global: number;
}

interface Jpeg2000PacketHeaderContext {
  inclusionTagTree: Jpeg2000TagTree | undefined;
  zeroBitplaneTagTree: Jpeg2000TagTree | undefined;
  codeBlockStates: Jpeg2000CodeBlockState[] | undefined;
}

interface Jpeg2000PrecinctPosition {
  x: number;
  y: number;
}

interface Jpeg2000PrecinctPositionMaps {
  byComponentResolution: Map<number, Map<number, Map<string, number>>>;
  byResolution: Map<number, Jpeg2000PrecinctPosition[]>;
  byComponent: Map<number, Jpeg2000PrecinctPosition[]>;
  all: Jpeg2000PrecinctPosition[];
}

export class Jpeg2000PacketDecoder {
  private offset = 0;
  private readonly packets: Jpeg2000Packet[] = [];

  private imageWidth = 0;
  private imageHeight = 0;
  private cbWidth = 64;
  private cbHeight = 64;
  private readonly numLevels: number;

  private readonly componentBounds: Jpeg2000ComponentBounds[];
  private readonly componentDx: number[];
  private readonly componentDy: number[];

  private precinctWidth = 0;
  private precinctHeight = 0;
  private precinctWidths: number[] = [];
  private precinctHeights: number[] = [];

  private readonly explicitPrecinctIndices = new Map<number, Map<number, number[]>>();
  private readonly configuredPrecinctDims = new Map<number, Map<number, Map<number, Map<number, Jpeg2000CodeBlockGridDimension>>>>();
  private readonly configuredPrecinctPositions = new Map<number, Map<number, Map<number, Map<number, Jpeg2000CodeBlockPosition[]>>>>();

  private readonly generatedPrecinctOrder = new Map<number, Map<number, Map<number, number[]>>>();
  private readonly generatedPrecinctDims = new Map<number, Map<number, Map<number, Map<number, Jpeg2000CodeBlockGridDimension>>>>();
  private readonly generatedPrecinctPositions = new Map<number, Map<number, Map<number, Map<number, Jpeg2000CodeBlockPosition[]>>>>();

  private readonly packetHeaderContexts = new Map<string, Jpeg2000PacketHeaderContext>();

  private precinctOrderBuilt = false;
  private precinctPositionMaps: Jpeg2000PrecinctPositionMaps | undefined;
  private resilient = false;
  private strict = false;

  constructor(
    private readonly data: Uint8Array,
    private readonly numComponents: number,
    private readonly numLayers: number,
    private readonly numResolutions: number,
    private readonly progression: Jpeg2000ProgressionOrder,
    private readonly codeBlockStyle: number,
  ) {
    this.numLevels = Math.max(0, numResolutions - 1);
    this.componentBounds = new Array<Jpeg2000ComponentBounds>(numComponents);
    this.componentDx = new Array<number>(numComponents).fill(1);
    this.componentDy = new Array<number>(numComponents).fill(1);

    for (let i = 0; i < numComponents; i++) {
      this.componentBounds[i] = {
        x0: 0,
        y0: 0,
        x1: 0,
        y1: 0,
      };
    }
  }

  setResilient(resilient: boolean): void {
    this.resilient = resilient;
  }

  setStrict(strict: boolean): void {
    this.strict = strict;
    if (strict) {
      this.resilient = false;
    }
  }

  setImageDimensions(width: number, height: number, cbWidth: number, cbHeight: number): void {
    this.imageWidth = Math.max(0, Math.floor(width));
    this.imageHeight = Math.max(0, Math.floor(height));
    this.cbWidth = Math.max(1, Math.floor(cbWidth));
    this.cbHeight = Math.max(1, Math.floor(cbHeight));

    for (let i = 0; i < this.componentBounds.length; i++) {
      const bounds = this.componentBounds[i]!;
      if (bounds.x1 === 0 && bounds.y1 === 0) {
        this.componentBounds[i] = {
          x0: 0,
          y0: 0,
          x1: this.imageWidth,
          y1: this.imageHeight,
        };
      }
    }

    this.precinctOrderBuilt = false;
  }

  setComponentBounds(component: number, x0: number, y0: number, x1: number, y1: number): void {
    if (component < 0 || component >= this.numComponents) {
      return;
    }

    this.componentBounds[component] = {
      x0: Math.floor(x0),
      y0: Math.floor(y0),
      x1: Math.floor(x1),
      y1: Math.floor(y1),
    };
    this.precinctOrderBuilt = false;
  }

  setComponentSampling(component: number, dx: number, dy: number): void {
    if (component < 0 || component >= this.numComponents) {
      return;
    }

    this.componentDx[component] = dx > 0 ? Math.floor(dx) : 1;
    this.componentDy[component] = dy > 0 ? Math.floor(dy) : 1;
  }

  setPrecinctSize(width: number, height: number): void {
    this.precinctWidth = width > 0 ? Math.floor(width) : 0;
    this.precinctHeight = height > 0 ? Math.floor(height) : 0;
    this.precinctWidths = [];
    this.precinctHeights = [];
    this.precinctOrderBuilt = false;
  }

  setPrecinctSizes(widths: number[], heights: number[]): void {
    this.precinctWidths = widths.map((value) => (value > 0 ? Math.floor(value) : 0));
    this.precinctHeights = heights.map((value) => (value > 0 ? Math.floor(value) : 0));
    this.precinctOrderBuilt = false;
  }

  setPrecinctIndices(component: number, resolution: number, indices: number[]): void {
    if (component < 0 || component >= this.numComponents || resolution < 0 || resolution >= this.numResolutions) {
      return;
    }

    const normalized = [...new Set(indices.map((index) => Math.floor(index)).filter((index) => index >= 0))]
      .sort((a, b) => a - b);

    const byResolution = getOrCreate(this.explicitPrecinctIndices, component, () => new Map<number, number[]>());
    byResolution.set(resolution, normalized.length > 0 ? normalized : [0]);
  }

  setBandCodeBlockGrid(
    component: number,
    resolution: number,
    precinctIndex: number,
    band: number,
    numCodeBlocksX: number,
    numCodeBlocksY: number,
    codeBlockPositions?: Jpeg2000CodeBlockPosition[],
  ): void {
    if (
      component < 0
      || component >= this.numComponents
      || resolution < 0
      || resolution >= this.numResolutions
      || precinctIndex < 0
    ) {
      return;
    }

    const dimsByResolution = getOrCreate(this.configuredPrecinctDims, component, () => new Map<number, Map<number, Map<number, Jpeg2000CodeBlockGridDimension>>>());
    const dimsByPrecinct = getOrCreate(dimsByResolution, resolution, () => new Map<number, Map<number, Jpeg2000CodeBlockGridDimension>>());
    const dimsByBand = getOrCreate(dimsByPrecinct, precinctIndex, () => new Map<number, Jpeg2000CodeBlockGridDimension>());
    dimsByBand.set(band, {
      numCodeBlocksX: Math.max(1, Math.floor(numCodeBlocksX)),
      numCodeBlocksY: Math.max(1, Math.floor(numCodeBlocksY)),
    });

    if (codeBlockPositions && codeBlockPositions.length > 0) {
      const positionsByResolution = getOrCreate(this.configuredPrecinctPositions, component, () => new Map<number, Map<number, Map<number, Jpeg2000CodeBlockPosition[]>>>());
      const positionsByPrecinct = getOrCreate(positionsByResolution, resolution, () => new Map<number, Map<number, Jpeg2000CodeBlockPosition[]>>());
      const positionsByBand = getOrCreate(positionsByPrecinct, precinctIndex, () => new Map<number, Jpeg2000CodeBlockPosition[]>());
      positionsByBand.set(band, codeBlockPositions.map((position) => ({ x: position.x, y: position.y })));
    }

    this.ensureExplicitPrecinctIndex(component, resolution, precinctIndex);
  }

  decodePackets(): Jpeg2000Packet[] {
    this.offset = 0;
    this.packets.length = 0;

    if (!this.precinctOrderBuilt) {
      this.buildPrecinctOrder();
    }
    this.precinctPositionMaps = this.buildPrecinctPositionMaps();

    switch (this.progression) {
      case Jpeg2000ProgressionOrder.LRCP:
        this.decodeLRCP();
        break;
      case Jpeg2000ProgressionOrder.RLCP:
        this.decodeRLCP();
        break;
      case Jpeg2000ProgressionOrder.RPCL:
        this.decodeRPCL();
        break;
      case Jpeg2000ProgressionOrder.PCRL:
        this.decodePCRL();
        break;
      case Jpeg2000ProgressionOrder.CPRL:
        this.decodeCPRL();
        break;
      default:
        throw new Error(`unsupported progression order: ${this.progression}`);
    }

    return this.packets;
  }

  getPackets(): readonly Jpeg2000Packet[] {
    return this.packets;
  }

  getOffset(): number {
    return this.offset;
  }

  getPrecinctCodeBlockOrder(component: number, resolution: number, precinctIndex: number): readonly number[] {
    return this.generatedPrecinctOrder.get(component)?.get(resolution)?.get(precinctIndex) ?? [];
  }

  getBandCodeBlockDimensions(
    component: number,
    resolution: number,
    precinctIndex: number,
    band: number,
  ): Jpeg2000CodeBlockGridDimension | undefined {
    return this.precinctCBDimensions(component, resolution, precinctIndex, band);
  }

  getBandCodeBlockPositions(
    component: number,
    resolution: number,
    precinctIndex: number,
    band: number,
  ): readonly Jpeg2000CodeBlockPosition[] {
    return this.precinctCBPositions(component, resolution, precinctIndex, band) ?? [];
  }

  private decodeLRCP(): void {
    for (let layer = 0; layer < this.numLayers; layer++) {
      for (let resolution = 0; resolution < this.numResolutions; resolution++) {
        for (let component = 0; component < this.numComponents; component++) {
          for (const precinctIndex of this.precinctIndicesForResolution(component, resolution)) {
            this.packets.push(this.decodePacket(layer, resolution, component, precinctIndex));
          }
        }
      }
    }
  }

  private decodeRLCP(): void {
    for (let resolution = 0; resolution < this.numResolutions; resolution++) {
      for (let layer = 0; layer < this.numLayers; layer++) {
        for (let component = 0; component < this.numComponents; component++) {
          for (const precinctIndex of this.precinctIndicesForResolution(component, resolution)) {
            this.packets.push(this.decodePacket(layer, resolution, component, precinctIndex));
          }
        }
      }
    }
  }

  private decodeRPCL(): void {
    const positionMaps = this.precinctPositionMaps;
    for (let resolution = 0; resolution < this.numResolutions; resolution++) {
      const positions = positionMaps?.byResolution.get(resolution) ?? [];
      if (positions.length === 0) {
        for (const precinctIndex of this.allPrecinctIndicesForResolution(resolution)) {
          for (let component = 0; component < this.numComponents; component++) {
            if (!this.hasPrecinct(component, resolution, precinctIndex)) {
              continue;
            }

            for (let layer = 0; layer < this.numLayers; layer++) {
              this.packets.push(this.decodePacket(layer, resolution, component, precinctIndex));
            }
          }
        }
        continue;
      }

      for (const position of positions) {
        const positionKey = precinctPositionKey(position);
        for (let component = 0; component < this.numComponents; component++) {
          const precinctIndex = positionMaps
            ?.byComponentResolution
            .get(component)
            ?.get(resolution)
            ?.get(positionKey);
          if (precinctIndex === undefined) {
            continue;
          }

          for (let layer = 0; layer < this.numLayers; layer++) {
            this.packets.push(this.decodePacket(layer, resolution, component, precinctIndex));
          }
        }
      }
    }
  }

  private decodePCRL(): void {
    const positionMaps = this.precinctPositionMaps;
    const positions = positionMaps?.all ?? [];
    if (positions.length === 0) {
      for (const precinctIndex of this.allPrecinctIndices()) {
        for (let component = 0; component < this.numComponents; component++) {
          for (let resolution = 0; resolution < this.numResolutions; resolution++) {
            if (!this.hasPrecinct(component, resolution, precinctIndex)) {
              continue;
            }

            for (let layer = 0; layer < this.numLayers; layer++) {
              this.packets.push(this.decodePacket(layer, resolution, component, precinctIndex));
            }
          }
        }
      }
      return;
    }

    for (const position of positions) {
      const positionKey = precinctPositionKey(position);
      for (let component = 0; component < this.numComponents; component++) {
        for (let resolution = 0; resolution < this.numResolutions; resolution++) {
          const precinctIndex = positionMaps
            ?.byComponentResolution
            .get(component)
            ?.get(resolution)
            ?.get(positionKey);
          if (precinctIndex === undefined) {
            continue;
          }

          for (let layer = 0; layer < this.numLayers; layer++) {
            this.packets.push(this.decodePacket(layer, resolution, component, precinctIndex));
          }
        }
      }
    }
  }

  private decodeCPRL(): void {
    const positionMaps = this.precinctPositionMaps;
    for (let component = 0; component < this.numComponents; component++) {
      const positions = positionMaps?.byComponent.get(component) ?? [];
      if (positions.length === 0) {
        for (const precinctIndex of this.allPrecinctIndicesForComponent(component)) {
          for (let resolution = 0; resolution < this.numResolutions; resolution++) {
            if (!this.hasPrecinct(component, resolution, precinctIndex)) {
              continue;
            }

            for (let layer = 0; layer < this.numLayers; layer++) {
              this.packets.push(this.decodePacket(layer, resolution, component, precinctIndex));
            }
          }
        }
        continue;
      }

      for (const position of positions) {
        const positionKey = precinctPositionKey(position);
        for (let resolution = 0; resolution < this.numResolutions; resolution++) {
          const precinctIndex = positionMaps
            ?.byComponentResolution
            .get(component)
            ?.get(resolution)
            ?.get(positionKey);
          if (precinctIndex === undefined) {
            continue;
          }

          for (let layer = 0; layer < this.numLayers; layer++) {
            this.packets.push(this.decodePacket(layer, resolution, component, precinctIndex));
          }
        }
      }
    }
  }

  private decodePacket(layer: number, resolution: number, component: number, precinctIndex: number): Jpeg2000Packet {
    const packet = createEmptyPacket(layer, resolution, component, precinctIndex);

    if (this.offset >= this.data.length) {
      return packet;
    }

    const bandStates: Array<{ context: Jpeg2000PacketHeaderContext; state: Jpeg2000PacketHeaderBandState }> = [];

    for (const band of this.bandsForResolution(resolution)) {
      const dims = this.precinctCBDimensions(component, resolution, precinctIndex, band);
      if (!dims || dims.numCodeBlocksX <= 0 || dims.numCodeBlocksY <= 0) {
        continue;
      }

      const stateKey = packetHeaderContextKey(component, resolution, precinctIndex, band);
      const context = getOrCreate(this.packetHeaderContexts, stateKey, () => ({
        inclusionTagTree: undefined,
        zeroBitplaneTagTree: undefined,
        codeBlockStates: undefined,
      }));
      const state: Jpeg2000PacketHeaderBandState = {
        numCodeBlocksX: dims.numCodeBlocksX,
        numCodeBlocksY: dims.numCodeBlocksY,
      };

      const positions = this.precinctCBPositions(component, resolution, precinctIndex, band);
      if (positions) {
        state.codeBlockPositions = positions;
      }
      if (context.inclusionTagTree) {
        state.inclusionTagTree = context.inclusionTagTree;
      }
      if (context.zeroBitplaneTagTree) {
        state.zeroBitplaneTagTree = context.zeroBitplaneTagTree;
      }
      if (context.codeBlockStates) {
        state.codeBlockStates = context.codeBlockStates;
      }

      bandStates.push({ context, state });
    }

    const termAll = (this.codeBlockStyle & 0x04) !== 0;
    const parsed = parsePacketHeaderMulti(this.data.subarray(this.offset), layer, bandStates.map((value) => value.state), termAll);

    this.offset += parsed.bytesRead;
    packet.headerPresent = parsed.headerPresent;

    for (const bandState of bandStates) {
      bandState.context.inclusionTagTree = bandState.state.inclusionTagTree;
      bandState.context.zeroBitplaneTagTree = bandState.state.zeroBitplaneTagTree;
      bandState.context.codeBlockStates = bandState.state.codeBlockStates;
    }

    if (!packet.headerPresent) {
      return packet;
    }

    packet.header = parsed.header;
    packet.codeBlockInclusions = parsed.codeBlockInclusions;

    const bodyParts: Uint8Array[] = [];
    let totalBodyLength = 0;

    for (const inclusion of packet.codeBlockInclusions) {
      if (!inclusion.included || inclusion.dataLength <= 0) {
        continue;
      }

      if (this.offset >= this.data.length) {
        packet.partialBuffer = true;
        inclusion.corrupted = true;
        break;
      }

      let segmentLength = inclusion.dataLength;
      if (segmentLength > 65535) {
        if (this.strict) {
          throw new Error(`segment length exceeds limit: ${segmentLength} > 65535`);
        }
        segmentLength = 65535;
      }

      if (this.offset + segmentLength < this.offset) {
        throw new Error("segment length overflow detected");
      }

      if (this.offset + segmentLength > this.data.length) {
        const remaining = this.data.length - this.offset;

        if (this.strict) {
          throw new Error(
            `segment length exceeds available data: offset=${this.offset}, length=${segmentLength}, total=${this.data.length}`,
          );
        }

        if (this.resilient) {
          packet.partialBuffer = true;
        }

        segmentLength = Math.max(0, remaining);
      }

      const blockData = this.data.slice(this.offset, this.offset + segmentLength);
      inclusion.data = blockData;
      if (segmentLength !== inclusion.dataLength) {
        inclusion.dataLength = segmentLength;
        inclusion.corrupted = true;
        packet.partialBuffer = true;
      }

      bodyParts.push(blockData);
      totalBodyLength += blockData.length;
      this.offset += segmentLength;
    }

    if (totalBodyLength > 0) {
      const body = new Uint8Array(totalBodyLength);
      let bodyOffset = 0;
      for (const bodyPart of bodyParts) {
        body.set(bodyPart, bodyOffset);
        bodyOffset += bodyPart.length;
      }
      packet.body = body;
    }

    return packet;
  }

  private buildPrecinctOrder(): void {
    this.generatedPrecinctOrder.clear();
    this.generatedPrecinctDims.clear();
    this.generatedPrecinctPositions.clear();
    this.precinctPositionMaps = undefined;

    if (this.imageWidth <= 0 || this.imageHeight <= 0 || this.cbWidth <= 0 || this.cbHeight <= 0) {
      this.precinctOrderBuilt = true;
      return;
    }

    for (let component = 0; component < this.numComponents; component++) {
      this.buildComponentPrecinctOrder(component, this.cbWidth, this.cbHeight);
    }

    this.precinctOrderBuilt = true;
  }

  private buildPrecinctPositionMaps(): Jpeg2000PrecinctPositionMaps {
    const byComponentResolution = new Map<number, Map<number, Map<string, number>>>();
    const resolutionSets = new Map<number, Map<string, Jpeg2000PrecinctPosition>>();
    const componentSets = new Map<number, Map<string, Jpeg2000PrecinctPosition>>();
    const allSet = new Map<string, Jpeg2000PrecinctPosition>();

    for (let component = 0; component < this.numComponents; component++) {
      const bounds = this.componentBoundsFor(component);
      const dx = this.componentDx[component] && this.componentDx[component]! > 0 ? this.componentDx[component]! : 1;
      const dy = this.componentDy[component] && this.componentDy[component]! > 0 ? this.componentDy[component]! : 1;

      for (let resolution = 0; resolution < this.numResolutions; resolution++) {
        const precinctIndices = this.precinctIndicesForResolution(component, resolution);
        if (precinctIndices.length === 0) {
          continue;
        }

        const { width: precinctWidth, height: precinctHeight } = this.precinctSizeForResolution(resolution);
        for (const precinctIndex of precinctIndices) {
          const position = this.precinctPosition(bounds, dx, dy, resolution, precinctWidth, precinctHeight, precinctIndex);
          if (!position) {
            continue;
          }

          const key = precinctPositionKey(position);
          const byResolution = getOrCreate(byComponentResolution, component, () => new Map<number, Map<string, number>>());
          const byPosition = getOrCreate(byResolution, resolution, () => new Map<string, number>());
          byPosition.set(key, precinctIndex);

          getOrCreate(resolutionSets, resolution, () => new Map<string, Jpeg2000PrecinctPosition>()).set(key, position);
          getOrCreate(componentSets, component, () => new Map<string, Jpeg2000PrecinctPosition>()).set(key, position);
          allSet.set(key, position);
        }
      }
    }

    const byResolution = new Map<number, Jpeg2000PrecinctPosition[]>();
    for (const [resolution, positions] of resolutionSets) {
      byResolution.set(resolution, sortPrecinctPositions(positions));
    }

    const byComponent = new Map<number, Jpeg2000PrecinctPosition[]>();
    for (const [component, positions] of componentSets) {
      byComponent.set(component, sortPrecinctPositions(positions));
    }

    return {
      byComponentResolution,
      byResolution,
      byComponent,
      all: sortPrecinctPositions(allSet),
    };
  }

  private precinctPosition(
    bounds: Jpeg2000ComponentBounds,
    dx: number,
    dy: number,
    resolution: number,
    precinctWidth: number,
    precinctHeight: number,
    precinctIndex: number,
  ): Jpeg2000PrecinctPosition | undefined {
    if (precinctWidth <= 0 || precinctHeight <= 0) {
      return undefined;
    }

    const width = bounds.x1 - bounds.x0;
    const height = bounds.y1 - bounds.y0;
    if (width <= 0 || height <= 0) {
      return undefined;
    }

    const dims = bandInfosForResolution(width, height, bounds.x0, bounds.y0, this.numLevels, resolution);
    const startX = floorDiv(dims.x0, precinctWidth) * precinctWidth;
    const startY = floorDiv(dims.y0, precinctHeight) * precinctHeight;
    const endX = ceilDiv(dims.x0 + dims.width, precinctWidth) * precinctWidth;
    const endY = ceilDiv(dims.y0 + dims.height, precinctHeight) * precinctHeight;

    let numPrecinctX = Math.floor((endX - startX) / precinctWidth);
    let numPrecinctY = Math.floor((endY - startY) / precinctHeight);
    if (numPrecinctX < 1) {
      numPrecinctX = 1;
    }
    if (numPrecinctY < 1) {
      numPrecinctY = 1;
    }

    if (precinctIndex < 0 || precinctIndex >= numPrecinctX * numPrecinctY) {
      return undefined;
    }

    const precinctX = precinctIndex % numPrecinctX;
    const precinctY = Math.floor(precinctIndex / numPrecinctX);
    const originResX = startX + (precinctX * precinctWidth);
    const originResY = startY + (precinctY * precinctHeight);

    let levelNo = this.numLevels - resolution;
    if (levelNo < 0) {
      levelNo = 0;
    }

    const scaleX = dx * (2 ** levelNo);
    const scaleY = dy * (2 ** levelNo);
    return {
      x: originResX * scaleX,
      y: originResY * scaleY,
    };
  }

  private buildComponentPrecinctOrder(component: number, cbWidth: number, cbHeight: number): void {
    const bounds = this.componentBoundsFor(component);
    const componentWidth = bounds.x1 - bounds.x0;
    const componentHeight = bounds.y1 - bounds.y0;

    if (componentWidth <= 0 || componentHeight <= 0) {
      return;
    }

    let globalCodeBlockIndex = 0;
    for (let resolution = 0; resolution < this.numResolutions; resolution++) {
      globalCodeBlockIndex = this.buildResolutionPrecinctOrder(
        component,
        resolution,
        bounds,
        componentWidth,
        componentHeight,
        cbWidth,
        cbHeight,
        globalCodeBlockIndex,
      );
    }
  }

  private buildResolutionPrecinctOrder(
    component: number,
    resolution: number,
    bounds: Jpeg2000ComponentBounds,
    componentWidth: number,
    componentHeight: number,
    cbWidth: number,
    cbHeight: number,
    globalCodeBlockIndex: number,
  ): number {
    const { width: precinctWidth, height: precinctHeight } = this.precinctSizeForResolution(resolution);
    const resolutionOrders = getOrCreate(this.generatedPrecinctOrder, component, () => new Map<number, Map<number, number[]>>());
    getOrCreate(resolutionOrders, resolution, () => new Map<number, number[]>());

    const precinctBands = new Map<number, Map<number, Jpeg2000CodeBlockEntry[]>>();
    const bandInfo = bandInfosForResolution(
      componentWidth,
      componentHeight,
      bounds.x0,
      bounds.y0,
      this.numLevels,
      resolution,
    );

    if (bandInfo.width <= 0 || bandInfo.height <= 0) {
      return globalCodeBlockIndex;
    }

    const startX = floorDiv(bandInfo.x0, precinctWidth) * precinctWidth;
    const startY = floorDiv(bandInfo.y0, precinctHeight) * precinctHeight;
    const endX = ceilDiv(bandInfo.x0 + bandInfo.width, precinctWidth) * precinctWidth;
    let numPrecinctX = Math.floor((endX - startX) / precinctWidth);
    if (numPrecinctX < 1) {
      numPrecinctX = 1;
    }

    globalCodeBlockIndex = this.collectCodeBlockEntries(
      bandInfo.bands,
      cbWidth,
      cbHeight,
      bandInfo.x0,
      bandInfo.y0,
      startX,
      startY,
      precinctWidth,
      precinctHeight,
      numPrecinctX,
      precinctBands,
      globalCodeBlockIndex,
    );

    this.storePrecinctBands(component, resolution, precinctBands, resolution === 0 ? [0] : [1, 2, 3]);
    return globalCodeBlockIndex;
  }

  private collectCodeBlockEntries(
    bands: Array<{ band: number; width: number; height: number }>,
    cbWidth: number,
    cbHeight: number,
    resX0: number,
    resY0: number,
    startX: number,
    startY: number,
    precinctWidth: number,
    precinctHeight: number,
    numPrecinctX: number,
    precinctBands: Map<number, Map<number, Jpeg2000CodeBlockEntry[]>>,
    globalCodeBlockIndex: number,
  ): number {
    for (const band of bands) {
      if (band.width <= 0 || band.height <= 0) {
        continue;
      }

      const numCodeBlocksX = Math.floor((band.width + cbWidth - 1) / cbWidth);
      const numCodeBlocksY = Math.floor((band.height + cbHeight - 1) / cbHeight);

      for (let codeBlockY = 0; codeBlockY < numCodeBlocksY; codeBlockY++) {
        for (let codeBlockX = 0; codeBlockX < numCodeBlocksX; codeBlockX++) {
          const blockX0 = codeBlockX * cbWidth;
          const blockY0 = codeBlockY * cbHeight;
          const absResX0 = resX0 + blockX0;
          const absResY0 = resY0 + blockY0;
          const precinctX = Math.floor((absResX0 - startX) / precinctWidth);
          const precinctY = Math.floor((absResY0 - startY) / precinctHeight);
          const precinctIndex = precinctY * numPrecinctX + precinctX;

          const localX = absResX0 - (startX + precinctX * precinctWidth);
          const localY = absResY0 - (startY + precinctY * precinctHeight);
          const codeBlockLocalX = Math.floor(localX / cbWidth);
          const codeBlockLocalY = Math.floor(localY / cbHeight);

          const byBand = getOrCreate(precinctBands, precinctIndex, () => new Map<number, Jpeg2000CodeBlockEntry[]>());
          const entries = getOrCreate(byBand, band.band, () => []);
          entries.push({
            cbx: codeBlockLocalX,
            cby: codeBlockLocalY,
            global: globalCodeBlockIndex,
          });

          globalCodeBlockIndex++;
        }
      }
    }

    return globalCodeBlockIndex;
  }

  private storePrecinctBands(
    component: number,
    resolution: number,
    precinctBands: Map<number, Map<number, Jpeg2000CodeBlockEntry[]>>,
    bandOrder: number[],
  ): void {
    for (const [precinctIndex, byBand] of precinctBands) {
      for (const band of bandOrder) {
        const entries = byBand.get(band);
        if (!entries || entries.length === 0) {
          continue;
        }

        entries.sort((a, b) => {
          if (a.cby !== b.cby) {
            return a.cby - b.cby;
          }
          return a.cbx - b.cbx;
        });

        this.storeCodeBlockEntries(component, resolution, precinctIndex, band, entries);
      }
    }
  }

  private storeCodeBlockEntries(
    component: number,
    resolution: number,
    precinctIndex: number,
    band: number,
    entries: Jpeg2000CodeBlockEntry[],
  ): void {
    let maxX = 0;
    let maxY = 0;
    const positions: Jpeg2000CodeBlockPosition[] = [];

    for (const entry of entries) {
      const resolutionOrders = getOrCreate(this.generatedPrecinctOrder, component, () => new Map<number, Map<number, number[]>>());
      const precinctOrders = getOrCreate(resolutionOrders, resolution, () => new Map<number, number[]>());
      const order = getOrCreate(precinctOrders, precinctIndex, () => [] as number[]);
      order.push(entry.global);

      positions.push({ x: entry.cbx, y: entry.cby });
      if (entry.cbx + 1 > maxX) {
        maxX = entry.cbx + 1;
      }
      if (entry.cby + 1 > maxY) {
        maxY = entry.cby + 1;
      }
    }

    const dimsByResolution = getOrCreate(this.generatedPrecinctDims, component, () => new Map<number, Map<number, Map<number, Jpeg2000CodeBlockGridDimension>>>());
    const dimsByPrecinct = getOrCreate(dimsByResolution, resolution, () => new Map<number, Map<number, Jpeg2000CodeBlockGridDimension>>());
    const dimsByBand = getOrCreate(dimsByPrecinct, precinctIndex, () => new Map<number, Jpeg2000CodeBlockGridDimension>());
    dimsByBand.set(band, {
      numCodeBlocksX: maxX,
      numCodeBlocksY: maxY,
    });

    const positionsByResolution = getOrCreate(this.generatedPrecinctPositions, component, () => new Map<number, Map<number, Map<number, Jpeg2000CodeBlockPosition[]>>>());
    const positionsByPrecinct = getOrCreate(positionsByResolution, resolution, () => new Map<number, Map<number, Jpeg2000CodeBlockPosition[]>>());
    const positionsByBand = getOrCreate(positionsByPrecinct, precinctIndex, () => new Map<number, Jpeg2000CodeBlockPosition[]>());
    positionsByBand.set(band, positions);
  }

  private bandsForResolution(resolution: number): number[] {
    if (resolution === 0) {
      return [0];
    }
    return [1, 2, 3];
  }

  private componentBoundsFor(component: number): Jpeg2000ComponentBounds {
    const bounds = this.componentBounds[component];
    if (bounds && (bounds.x1 !== 0 || bounds.y1 !== 0)) {
      return bounds;
    }

    return {
      x0: 0,
      y0: 0,
      x1: this.imageWidth,
      y1: this.imageHeight,
    };
  }

  private precinctSizeForResolution(resolution: number): { width: number; height: number } {
    let width = 0;
    let height = 0;

    if (resolution >= 0) {
      if (resolution < this.precinctWidths.length) {
        width = this.precinctWidths[resolution]!;
      }
      if (resolution < this.precinctHeights.length) {
        height = this.precinctHeights[resolution]!;
      }
    }

    if (width === 0) {
      width = this.precinctWidth;
    }
    if (height === 0) {
      height = this.precinctHeight;
    }
    if (width === 0) {
      width = 1 << 15;
    }
    if (height === 0) {
      height = 1 << 15;
    }

    return { width, height };
  }

  private precinctIndicesForResolution(component: number, resolution: number): number[] {
    const explicit = this.explicitPrecinctIndices.get(component)?.get(resolution);
    if (explicit && explicit.length > 0) {
      return explicit;
    }

    const generated = this.generatedPrecinctOrder.get(component)?.get(resolution);
    if (!generated || generated.size === 0) {
      return [];
    }

    return [...generated.keys()].sort((a, b) => a - b);
  }

  private precinctCBDimensions(
    component: number,
    resolution: number,
    precinctIndex: number,
    band: number,
  ): Jpeg2000CodeBlockGridDimension | undefined {
    const configured = this.configuredPrecinctDims
      .get(component)
      ?.get(resolution)
      ?.get(precinctIndex)
      ?.get(band);
    if (configured) {
      return configured;
    }

    return this.generatedPrecinctDims
      .get(component)
      ?.get(resolution)
      ?.get(precinctIndex)
      ?.get(band);
  }

  private precinctCBPositions(
    component: number,
    resolution: number,
    precinctIndex: number,
    band: number,
  ): Jpeg2000CodeBlockPosition[] | undefined {
    const configured = this.configuredPrecinctPositions
      .get(component)
      ?.get(resolution)
      ?.get(precinctIndex)
      ?.get(band);
    if (configured) {
      return configured;
    }

    return this.generatedPrecinctPositions
      .get(component)
      ?.get(resolution)
      ?.get(precinctIndex)
      ?.get(band);
  }

  private allPrecinctIndicesForResolution(resolution: number): number[] {
    const merged = new Set<number>();
    for (let component = 0; component < this.numComponents; component++) {
      for (const precinctIndex of this.precinctIndicesForResolution(component, resolution)) {
        merged.add(precinctIndex);
      }
    }

    return [...merged].sort((a, b) => a - b);
  }

  private allPrecinctIndicesForComponent(component: number): number[] {
    const merged = new Set<number>();
    for (let resolution = 0; resolution < this.numResolutions; resolution++) {
      for (const precinctIndex of this.precinctIndicesForResolution(component, resolution)) {
        merged.add(precinctIndex);
      }
    }

    return [...merged].sort((a, b) => a - b);
  }

  private allPrecinctIndices(): number[] {
    const merged = new Set<number>();
    for (let component = 0; component < this.numComponents; component++) {
      for (let resolution = 0; resolution < this.numResolutions; resolution++) {
        for (const precinctIndex of this.precinctIndicesForResolution(component, resolution)) {
          merged.add(precinctIndex);
        }
      }
    }

    return [...merged].sort((a, b) => a - b);
  }

  private hasPrecinct(component: number, resolution: number, precinctIndex: number): boolean {
    return this.precinctIndicesForResolution(component, resolution).includes(precinctIndex);
  }

  private ensureExplicitPrecinctIndex(component: number, resolution: number, precinctIndex: number): void {
    const byResolution = getOrCreate(this.explicitPrecinctIndices, component, () => new Map<number, number[]>());
    const indices = byResolution.get(resolution);

    if (!indices) {
      byResolution.set(resolution, [precinctIndex]);
      return;
    }

    if (!indices.includes(precinctIndex)) {
      indices.push(precinctIndex);
      indices.sort((a, b) => a - b);
    }
  }
}

function getOrCreate<K, V>(map: Map<K, V>, key: K, create: () => V): V {
  const current = map.get(key);
  if (current !== undefined) {
    return current;
  }

  const created = create();
  map.set(key, created);
  return created;
}

function packetHeaderContextKey(component: number, resolution: number, precinctIndex: number, band: number): string {
  return `${component}:${resolution}:${precinctIndex}:${band}`;
}

function precinctPositionKey(position: Jpeg2000PrecinctPosition): string {
  return `${position.x}:${position.y}`;
}

function sortPrecinctPositions(positions: Map<string, Jpeg2000PrecinctPosition>): Jpeg2000PrecinctPosition[] {
  return [...positions.values()].sort((left, right) => {
    if (left.y !== right.y) {
      return left.y - right.y;
    }
    return left.x - right.x;
  });
}
