import { PixelRepresentation } from "../../../../PixelRepresentation.js";
import type { DicomJpeg2000MctBinding, DicomJpeg2000Params } from "../../DicomJpeg2000Params.js";
import { writeJpeg2000SingleTileCodestream } from "../codestream/index.js";
import { forwardIct, forwardRct } from "../colorspace/index.js";
import { buildPart2MctMainHeaderSegments } from "../mct/index.js";
import { CBLK_STYLE_TERMALL, Jpeg2000T1Encoder } from "../t1/index.js";
import { bandInfosForResolution, encodePacketsLrcp, type Jpeg2000PacketBandPlan, type Jpeg2000PacketCodeBlockContribution, type Jpeg2000PacketPlan } from "../t2/index.js";
import {
  forwardMultilevel53WithParity,
  forwardMultilevel97WithParity,
  int32ToFloat64,
} from "../wavelet/index.js";

export interface Jpeg2000EncoderAnalyzeOptions {
  frameData: Uint8Array;
  width: number;
  height: number;
  components: number;
  bitsAllocated: number;
  bitsStored: number;
  pixelRepresentation: PixelRepresentation;
  parameters: DicomJpeg2000Params;
  isPart2: boolean;
}

export interface Jpeg2000AnalyzedComponent {
  componentIndex: number;
  width: number;
  height: number;
  samples: Int32Array;
  transformedInt?: Int32Array;
  transformedFloat?: Float64Array;
}

export interface Jpeg2000AnalyzeResult {
  width: number;
  height: number;
  components: number;
  bitsStored: number;
  bytesPerSample: number;
  irreversible: boolean;
  isPart2: boolean;
  appliedMct: "none" | "rct" | "ict";
  numLevels: number;
  analyzedComponents: Jpeg2000AnalyzedComponent[];
}

interface Jpeg2000CodeBlockDescriptor {
  componentIndex: number;
  resolutionLevel: number;
  band: number;
  globalCodeBlockIndex: number;
  cbx: number;
  cby: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  width: number;
  height: number;
}

interface Jpeg2000LayerConfig {
  numberOfLayers: number;
  useTermAll: boolean;
}

interface Jpeg2000EncodedCodeBlock {
  numPasses: number;
  data: Uint8Array;
  passEndOffsets: number[];
}

/**
 * Phase 3 encoding foundation:
 * - unpack interleaved frame into signed component sample buffers,
 * - apply Part1 forward color transform when enabled,
 * - run forward multilevel wavelet transforms per component.
 *
 * Baseline single-layer LRCP pipeline is wired:
 * - T1/MQ code-block encoding,
 * - T2 packet header/body assembly,
 * - single-tile codestream writing.
 */
export class Jpeg2000Encoder {
  analyzeFrame(options: Jpeg2000EncoderAnalyzeOptions): Jpeg2000AnalyzeResult {
    const {
      frameData,
      width,
      height,
      components,
      bitsAllocated,
      bitsStored,
      pixelRepresentation,
      parameters,
      isPart2,
    } = options;

    if (width <= 0 || height <= 0 || components <= 0) {
      throw new Error(`Invalid JPEG2000 analyze dimensions: ${width}x${height}x${components}`);
    }
    if (bitsStored <= 0 || bitsStored > 16) {
      throw new Error(`Invalid JPEG2000 analyze bitsStored: ${bitsStored}`);
    }

    const bytesPerSample = bitsAllocated <= 8 ? 1 : 2;
    const samplesPerComponent = width * height;
    const expectedLength = samplesPerComponent * components * bytesPerSample;
    if (frameData.length < expectedLength) {
      throw new Error(
        `JPEG2000 analyze frame is too short: actual=${frameData.length}, expected=${expectedLength}`,
      );
    }

    const componentSamples = unpackInterleavedSamples(
      frameData,
      width,
      height,
      components,
      bytesPerSample,
      bitsStored,
      pixelRepresentation === 1,
    );

    if (isPart2) {
      applyPart2ForwardMct(componentSamples, parameters);
    }

    const appliedMct = applyPart1ForwardMct(componentSamples, parameters.irreversible, parameters.allowMct, isPart2);
    const numLevels = clampNumLevels(parameters.numLevels, width, height);
    const analyzedComponents = transformComponents(componentSamples, width, height, numLevels, parameters.irreversible);

    return {
      width,
      height,
      components,
      bitsStored,
      bytesPerSample,
      irreversible: parameters.irreversible,
      isPart2,
      appliedMct,
      numLevels,
      analyzedComponents,
    };
  }

  encodeFrame(options: Jpeg2000EncoderAnalyzeOptions): Uint8Array {
    const analyzed = this.analyzeFrame(options);
    if (options.parameters.progressionOrder !== 0) {
      throw new Error(`JPEG2000 encode currently supports LRCP only; got progressionOrder=${options.parameters.progressionOrder}`);
    }

    const layerConfig = resolveLayerConfig(options.parameters);
    const numberOfLayers = layerConfig.numberOfLayers;
    const codeBlockWidth = 64;
    const codeBlockHeight = 64;
    const codeBlockWidthExponent = 4;
    const codeBlockHeightExponent = 4;
    const codeBlockStyle = layerConfig.useTermAll ? CBLK_STYLE_TERMALL : 0;
    const numLevels = analyzed.numLevels;

    const descriptorsByComponent = new Map<number, Jpeg2000CodeBlockDescriptor[]>();
    const packetPlansByComponent = new Map<number, Map<number, Jpeg2000PacketPlan>>();

    for (let componentIndex = 0; componentIndex < analyzed.analyzedComponents.length; componentIndex++) {
      const component = analyzed.analyzedComponents[componentIndex]!;
      const plan = buildComponentCodeBlockPlan(
        component.componentIndex,
        component.width,
        component.height,
        numLevels,
        codeBlockWidth,
        codeBlockHeight,
      );
      descriptorsByComponent.set(component.componentIndex, plan.descriptors);
      packetPlansByComponent.set(component.componentIndex, plan.packetsByResolution);
    }

    const contributions = new Map<string, Jpeg2000PacketCodeBlockContribution>();
    for (const component of analyzed.analyzedComponents) {
      const descriptors = descriptorsByComponent.get(component.componentIndex) ?? [];
      const coefficients = resolveAnalyzedComponentCoefficients(component, analyzed.irreversible);
      for (const descriptor of descriptors) {
        const block = extractCodeBlock(
          coefficients,
          component.width,
          descriptor.x0,
          descriptor.y0,
          descriptor.width,
          descriptor.height,
        );
        scaleCodeBlockForT1(block);

        const rawMaxBitplane = findMaxBitplane(block);
        if (rawMaxBitplane < 0) {
          continue;
        }

        const codeBlockNumBps = Math.max(0, (rawMaxBitplane + 1) - 6);
        const numPasses = codeBlockNumBps > 0
          ? ((codeBlockNumBps * 3) - 2)
          : 1;
        const t1Encoder = new Jpeg2000T1Encoder(descriptor.width, descriptor.height, codeBlockStyle);
        t1Encoder.setOrientation(descriptor.band);
        const encodedBlock = encodeCodeBlockForT1(t1Encoder, block, numPasses, layerConfig.useTermAll);
        if (encodedBlock.numPasses <= 0 || encodedBlock.data.length === 0) {
          continue;
        }

        const layerBoundaries = allocateLayerPasses(encodedBlock.numPasses, numberOfLayers);
        let previousPasses = 0;
        let previousOffset = 0;

        for (let layerIndex = 0; layerIndex < numberOfLayers; layerIndex++) {
          const cumulativePasses = layerBoundaries[layerIndex] ?? previousPasses;
          if (cumulativePasses <= previousPasses) {
            continue;
          }

          const endOffset = resolvePassEndOffset(encodedBlock, cumulativePasses);
          if (endOffset <= previousOffset) {
            previousPasses = cumulativePasses;
            continue;
          }

          const key = codeBlockKey(
            layerIndex,
            descriptor.componentIndex,
            descriptor.resolutionLevel,
            descriptor.globalCodeBlockIndex,
          );
          contributions.set(key, {
            layerIndex,
            componentIndex: descriptor.componentIndex,
            resolutionLevel: descriptor.resolutionLevel,
            band: descriptor.band,
            globalCodeBlockIndex: descriptor.globalCodeBlockIndex,
            numPasses: cumulativePasses - previousPasses,
            zeroBitplanes: 0,
            data: encodedBlock.data.slice(previousOffset, endOffset),
            passLengths: layerConfig.useTermAll
              ? buildLayerPassLengths(encodedBlock.passEndOffsets, previousPasses, cumulativePasses, previousOffset)
              : [],
            useTermAll: layerConfig.useTermAll,
          });

          previousPasses = cumulativePasses;
          previousOffset = endOffset;
        }
      }
    }

    const packetPlans = buildLrcpPacketPlanList(
      packetPlansByComponent,
      analyzed.components,
      analyzed.numLevels,
      numberOfLayers,
    );
    const tileData = encodePacketsLrcp(packetPlans, contributions);

    const part2Segments = analyzed.isPart2
      ? buildPart2MctMainHeaderSegments(options.parameters, analyzed.components, analyzed.irreversible)
      : [];

    return writeJpeg2000SingleTileCodestream({
      width: analyzed.width,
      height: analyzed.height,
      components: analyzed.components,
      bitsStored: analyzed.bitsStored,
      isSigned: options.pixelRepresentation === PixelRepresentation.Signed,
      rSiz: analyzed.isPart2 ? 2 : 0,
      numLevels: analyzed.numLevels,
      progressionOrder: 0,
      numberOfLayers,
      multipleComponentTransform: analyzed.isPart2
        ? (part2Segments.length > 0 ? 1 : 0)
        : (analyzed.appliedMct === "none" ? 0 : 1),
      codeBlockWidthExponent,
      codeBlockHeightExponent,
      codeBlockStyle,
      transformation: analyzed.irreversible ? 0 : 1,
      tileData,
      extraMainHeaderSegments: part2Segments,
    });
  }
}

function unpackInterleavedSamples(
  frameData: Uint8Array,
  width: number,
  height: number,
  components: number,
  bytesPerSample: number,
  bitsStored: number,
  signed: boolean,
): Int32Array[] {
  const pixels = width * height;
  const outputs = new Array<Int32Array>(components);
  for (let c = 0; c < components; c++) {
    outputs[c] = new Int32Array(pixels);
  }

  let offset = 0;
  for (let i = 0; i < pixels; i++) {
    for (let c = 0; c < components; c++) {
      let stored: number;
      if (bytesPerSample === 1) {
        stored = frameData[offset] ?? 0;
        offset += 1;
      } else {
        const lo = frameData[offset] ?? 0;
        const hi = frameData[offset + 1] ?? 0;
        stored = lo | (hi << 8);
        offset += 2;
      }

      outputs[c]![i] = normalizeStoredSample(stored, bitsStored, signed);
    }
  }

  return outputs;
}

function normalizeStoredSample(stored: number, bitsStored: number, signed: boolean): number {
  if (bitsStored <= 0) {
    return 0;
  }

  const mask = (1 << bitsStored) - 1;
  const value = stored & mask;

  if (signed) {
    const signBit = 1 << (bitsStored - 1);
    return (value & signBit) !== 0 ? value - (1 << bitsStored) : value;
  }

  return value - (1 << (bitsStored - 1));
}

function applyPart1ForwardMct(
  componentSamples: Int32Array[],
  irreversible: boolean,
  allowMct: boolean,
  isPart2: boolean,
): "none" | "rct" | "ict" {
  if (!allowMct || isPart2 || componentSamples.length < 3) {
    return "none";
  }

  const r = componentSamples[0]!;
  const g = componentSamples[1]!;
  const b = componentSamples[2]!;
  const pixelCount = Math.min(r.length, g.length, b.length);

  for (let i = 0; i < pixelCount; i++) {
    const converted = irreversible
      ? forwardIct(r[i] ?? 0, g[i] ?? 0, b[i] ?? 0)
      : forwardRct(r[i] ?? 0, g[i] ?? 0, b[i] ?? 0);
    r[i] = converted.y;
    g[i] = converted.cb;
    b[i] = converted.cr;
  }

  return irreversible ? "ict" : "rct";
}

function applyPart2ForwardMct(componentSamples: Int32Array[], parameters: DicomJpeg2000Params): void {
  if (!parameters.allowMct || componentSamples.length === 0) {
    return;
  }

  const bindings = resolveEncodePart2Bindings(parameters, componentSamples.length);
  if (bindings.length === 0) {
    return;
  }

  const pixelCount = componentSamples[0]?.length ?? 0;
  for (const binding of bindings) {
    const componentIds = resolveBindingComponentIds(binding, componentSamples.length);
    const componentCount = componentIds.length;
    if (componentCount <= 0) {
      continue;
    }

    const inverseMatrix = resolvePart2Matrix(binding.inverse ?? parameters.inverseMctMatrix, componentCount)
      ?? resolvePart2Matrix(binding.matrix ?? parameters.mctMatrix, componentCount);
    if (!inverseMatrix) {
      continue;
    }

    const offsets = resolvePart2Offsets(binding.offsets ?? parameters.mctOffsets, componentCount);

    for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex++) {
      const y = new Array<number>(componentCount);
      for (let i = 0; i < componentCount; i++) {
        const componentIndex = componentIds[i]!;
        const sample = componentSamples[componentIndex]?.[pixelIndex] ?? 0;
        y[i] = sample - (offsets?.[i] ?? 0);
      }

      const x = new Array<number>(componentCount).fill(0);
      for (let row = 0; row < componentCount; row++) {
        let sum = 0;
        const matrixRow = inverseMatrix[row] ?? [];
        for (let col = 0; col < componentCount; col++) {
          sum += (matrixRow[col] ?? 0) * (y[col] ?? 0);
        }
        x[row] = Math.round(sum);
      }

      for (let i = 0; i < componentCount; i++) {
        const componentIndex = componentIds[i]!;
        if (componentSamples[componentIndex]) {
          componentSamples[componentIndex]![pixelIndex] = x[i] ?? 0;
        }
      }
    }
  }
}

function resolveEncodePart2Bindings(parameters: DicomJpeg2000Params, componentCount: number): DicomJpeg2000MctBinding[] {
  if (Array.isArray(parameters.mctBindings) && parameters.mctBindings.length > 0) {
    return parameters.mctBindings;
  }

  if (parameters.mctMatrix || parameters.inverseMctMatrix || parameters.mctOffsets) {
    const fallback: DicomJpeg2000MctBinding = {
      componentIds: Array.from({ length: componentCount }, (_, i) => i),
    };
    if (parameters.mctMatrix) {
      fallback.matrix = parameters.mctMatrix;
    }
    if (parameters.inverseMctMatrix) {
      fallback.inverse = parameters.inverseMctMatrix;
    }
    if (parameters.mctOffsets) {
      fallback.offsets = parameters.mctOffsets;
    }
    return [fallback];
  }

  return [];
}

function resolveBindingComponentIds(binding: DicomJpeg2000MctBinding, componentCount: number): number[] {
  if (Array.isArray(binding.componentIds) && binding.componentIds.length > 0) {
    const filtered = binding.componentIds
      .filter((id) => Number.isInteger(id) && id >= 0 && id < componentCount)
      .map((id) => Math.trunc(id));
    if (filtered.length > 0) {
      return [...new Set(filtered)];
    }
  }

  return Array.from({ length: componentCount }, (_, i) => i);
}

function resolvePart2Matrix(matrix: number[][] | undefined, size: number): number[][] | undefined {
  if (!Array.isArray(matrix) || matrix.length !== size) {
    return undefined;
  }

  const normalized: number[][] = [];
  for (let row = 0; row < size; row++) {
    const sourceRow = matrix[row];
    if (!Array.isArray(sourceRow) || sourceRow.length !== size) {
      return undefined;
    }

    const outputRow = new Array<number>(size);
    for (let col = 0; col < size; col++) {
      const rawValue = sourceRow[col];
      const value = typeof rawValue === "number" ? rawValue : Number.NaN;
      if (!Number.isFinite(value)) {
        return undefined;
      }
      outputRow[col] = value;
    }
    normalized.push(outputRow);
  }

  return normalized;
}

function resolvePart2Offsets(offsets: number[] | undefined, size: number): number[] | undefined {
  if (!Array.isArray(offsets) || offsets.length !== size) {
    return undefined;
  }

  const normalized = new Array<number>(size);
  for (let i = 0; i < size; i++) {
    const rawValue = offsets[i];
    const value = typeof rawValue === "number" ? rawValue : Number.NaN;
    if (!Number.isFinite(value)) {
      return undefined;
    }
    normalized[i] = value;
  }

  return normalized;
}

function transformComponents(
  componentSamples: Int32Array[],
  width: number,
  height: number,
  numLevels: number,
  irreversible: boolean,
): Jpeg2000AnalyzedComponent[] {
  const components: Jpeg2000AnalyzedComponent[] = [];

  for (let c = 0; c < componentSamples.length; c++) {
    const samples = componentSamples[c]!;
    const analyzed: Jpeg2000AnalyzedComponent = {
      componentIndex: c,
      width,
      height,
      samples,
    };

    if (irreversible) {
      const transformed = int32ToFloat64(samples);
      if (numLevels > 0) {
        forwardMultilevel97WithParity(transformed, width, height, numLevels, 0, 0);
      }
      analyzed.transformedFloat = transformed;
    } else {
      const transformed = samples.slice();
      if (numLevels > 0) {
        forwardMultilevel53WithParity(transformed, width, height, numLevels, 0, 0);
      }
      analyzed.transformedInt = transformed;
    }

    components.push(analyzed);
  }

  return components;
}

function clampNumLevels(numLevels: number, width: number, height: number): number {
  const requested = Number.isFinite(numLevels) ? Math.max(0, Math.trunc(numLevels)) : 0;
  let maxLevels = 0;
  let w = width;
  let h = height;
  while (w > 1 || h > 1) {
    w = Math.max(1, Math.floor((w + 1) / 2));
    h = Math.max(1, Math.floor((h + 1) / 2));
    maxLevels++;
    if (maxLevels >= 32) {
      break;
    }
  }
  return Math.min(requested, maxLevels);
}

function resolveAnalyzedComponentCoefficients(component: Jpeg2000AnalyzedComponent, irreversible: boolean): Int32Array | Float64Array {
  if (!irreversible) {
    return component.transformedInt ?? component.samples;
  }
  if (component.transformedFloat) {
    return component.transformedFloat;
  }
  return int32ToFloat64(component.samples);
}

function buildComponentCodeBlockPlan(
  componentIndex: number,
  width: number,
  height: number,
  numLevels: number,
  codeBlockWidth: number,
  codeBlockHeight: number,
): {
  descriptors: Jpeg2000CodeBlockDescriptor[];
  packetsByResolution: Map<number, Jpeg2000PacketPlan>;
} {
  const descriptors: Jpeg2000CodeBlockDescriptor[] = [];
  const packetsByResolution = new Map<number, Jpeg2000PacketPlan>();

  let globalCodeBlockIndex = 0;
  for (let resolution = 0; resolution <= numLevels; resolution++) {
    const info = bandInfosForResolution(width, height, 0, 0, numLevels, resolution);
    const bands: Jpeg2000PacketBandPlan[] = [];

    for (const bandInfo of info.bands) {
      if (bandInfo.width <= 0 || bandInfo.height <= 0) {
        continue;
      }

      const numCodeBlocksX = Math.floor((bandInfo.width + codeBlockWidth - 1) / codeBlockWidth);
      const numCodeBlocksY = Math.floor((bandInfo.height + codeBlockHeight - 1) / codeBlockHeight);
      const entries = [];

      for (let cby = 0; cby < numCodeBlocksY; cby++) {
        for (let cbx = 0; cbx < numCodeBlocksX; cbx++) {
          const localX0 = cbx * codeBlockWidth;
          const localY0 = cby * codeBlockHeight;
          const localX1 = Math.min(localX0 + codeBlockWidth, bandInfo.width);
          const localY1 = Math.min(localY0 + codeBlockHeight, bandInfo.height);
          const x0 = bandInfo.offsetX + localX0;
          const y0 = bandInfo.offsetY + localY0;
          const x1 = bandInfo.offsetX + localX1;
          const y1 = bandInfo.offsetY + localY1;

          descriptors.push({
            componentIndex,
            resolutionLevel: resolution,
            band: bandInfo.band,
            globalCodeBlockIndex,
            cbx,
            cby,
            x0,
            y0,
            x1,
            y1,
            width: x1 - x0,
            height: y1 - y0,
          });

          entries.push({
            cbx,
            cby,
            globalCodeBlockIndex,
          });
          globalCodeBlockIndex++;
        }
      }

      bands.push({
        band: bandInfo.band,
        numCodeBlocksX,
        numCodeBlocksY,
        entries,
      });
    }

    if (bands.length > 0) {
      packetsByResolution.set(resolution, {
        layerIndex: 0,
        resolutionLevel: resolution,
        componentIndex,
        precinctIndex: 0,
        bands,
      });
    }
  }

  return {
    descriptors,
    packetsByResolution,
  };
}

function buildLrcpPacketPlanList(
  packetsByComponent: Map<number, Map<number, Jpeg2000PacketPlan>>,
  components: number,
  numLevels: number,
  numberOfLayers: number,
): Jpeg2000PacketPlan[] {
  const plans: Jpeg2000PacketPlan[] = [];
  for (let layerIndex = 0; layerIndex < numberOfLayers; layerIndex++) {
    for (let resolution = 0; resolution <= numLevels; resolution++) {
      for (let component = 0; component < components; component++) {
        const plan = packetsByComponent.get(component)?.get(resolution);
        if (!plan) {
          continue;
        }
        plans.push({
          ...plan,
          layerIndex,
          bands: plan.bands.map((band) => ({
            ...band,
            entries: band.entries.map((entry) => ({ ...entry })),
          })),
        });
      }
    }
  }
  return plans;
}

function extractCodeBlock(
  source: Int32Array | Float64Array,
  sourceWidth: number,
  x0: number,
  y0: number,
  width: number,
  height: number,
): Int32Array {
  const output = new Int32Array(width * height);
  let offset = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y0 + y) * sourceWidth + (x0 + x);
      const value = source[index] ?? 0;
      output[offset] = value >= 0 ? Math.trunc(value + 0.5) : Math.trunc(value - 0.5);
      offset++;
    }
  }
  return output;
}

function scaleCodeBlockForT1(block: Int32Array): void {
  for (let i = 0; i < block.length; i++) {
    const scaled = (block[i] ?? 0) * 64;
    block[i] = clampToInt32(scaled);
  }
}

function findMaxBitplane(values: Int32Array): number {
  let maxAbs = 0;
  for (let i = 0; i < values.length; i++) {
    const value = values[i] ?? 0;
    const abs = value < 0 ? -value : value;
    if (abs > maxAbs) {
      maxAbs = abs;
    }
  }

  if (maxAbs === 0) {
    return -1;
  }

  let bitplane = 0;
  while (maxAbs > 0) {
    maxAbs = Math.floor(maxAbs / 2);
    bitplane++;
  }
  return bitplane - 1;
}

function clampToInt32(value: number): number {
  if (value > 2147483647) {
    return 2147483647;
  }
  if (value < -2147483648) {
    return -2147483648;
  }
  return value | 0;
}

function resolveLayerConfig(parameters: DicomJpeg2000Params): Jpeg2000LayerConfig {
  let numberOfLayers = Number.isFinite(parameters.numLayers)
    ? Math.max(1, Math.trunc(parameters.numLayers))
    : 1;

  if (numberOfLayers <= 1 && parameters.targetRatio > 0) {
    const derivedLayers = layersFromRateLevels(parameters.rate, parameters.rateLevels);
    if (derivedLayers > 1) {
      numberOfLayers = derivedLayers;
    }
  }

  if (numberOfLayers > 32) {
    numberOfLayers = 32;
  }

  return {
    numberOfLayers,
    useTermAll: numberOfLayers > 1 || parameters.targetRatio > 0,
  };
}

function layersFromRateLevels(rate: number, rateLevels: number[]): number {
  if (!Number.isFinite(rate) || rate <= 0 || !Array.isArray(rateLevels) || rateLevels.length === 0) {
    return 1;
  }

  let layers = 1;
  for (let i = 0; i < rateLevels.length; i++) {
    const threshold = rateLevels[i]!;
    if (Number.isFinite(threshold) && threshold > rate) {
      layers++;
    }
  }
  return Math.max(1, layers);
}

function allocateLayerPasses(totalPasses: number, numberOfLayers: number): number[] {
  const safePasses = Math.max(0, Math.trunc(totalPasses));
  const safeLayers = Math.max(1, Math.trunc(numberOfLayers));
  const boundaries = new Array<number>(safeLayers).fill(0);

  if (safePasses <= 0) {
    return boundaries;
  }
  if (safeLayers === 1) {
    boundaries[0] = safePasses;
    return boundaries;
  }

  for (let layer = 0; layer < safeLayers; layer++) {
    if (layer === safeLayers - 1) {
      boundaries[layer] = safePasses;
      continue;
    }

    const fraction = Math.pow((layer + 1) / safeLayers, 0.7);
    let passes = Math.ceil(safePasses * fraction);
    if (passes < layer + 1) {
      passes = layer + 1;
    }
    if (layer > 0 && passes < boundaries[layer - 1]!) {
      passes = boundaries[layer - 1]!;
    }
    if (passes > safePasses) {
      passes = safePasses;
    }
    boundaries[layer] = passes;
  }

  return boundaries;
}

function encodeCodeBlockForT1(
  encoder: Jpeg2000T1Encoder,
  block: Int32Array,
  numPasses: number,
  useTermAll: boolean,
): Jpeg2000EncodedCodeBlock {
  if (useTermAll) {
    const encoded = encoder.encodeWithPasses(block, numPasses, 0);
    return {
      numPasses,
      data: encoded.data,
      passEndOffsets: encoded.passEndOffsets,
    };
  }

  const data = encoder.encode(block, numPasses, 0);
  return {
    numPasses,
    data,
    passEndOffsets: [],
  };
}

function resolvePassEndOffset(encoded: Jpeg2000EncodedCodeBlock, cumulativePasses: number): number {
  if (cumulativePasses <= 0) {
    return 0;
  }
  if (encoded.passEndOffsets.length >= cumulativePasses) {
    const offset = encoded.passEndOffsets[cumulativePasses - 1] ?? encoded.data.length;
    return clamp(Math.trunc(offset), 0, encoded.data.length);
  }
  return encoded.data.length;
}

function buildLayerPassLengths(
  passEndOffsets: number[],
  previousPasses: number,
  cumulativePasses: number,
  baseOffset: number,
): number[] {
  if (cumulativePasses <= previousPasses) {
    return [];
  }

  const lengths: number[] = [];
  let previousOffset = baseOffset;
  for (let pass = previousPasses; pass < cumulativePasses; pass++) {
    const endOffset = passEndOffsets[pass] ?? previousOffset;
    const safeEndOffset = endOffset < previousOffset ? previousOffset : endOffset;
    lengths.push(safeEndOffset - previousOffset);
    previousOffset = safeEndOffset;
  }
  return lengths;
}

function codeBlockKey(layerIndex: number, componentIndex: number, resolutionLevel: number, globalCodeBlockIndex: number): string {
  return `${layerIndex}:${componentIndex}:${resolutionLevel}:${globalCodeBlockIndex}`;
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
