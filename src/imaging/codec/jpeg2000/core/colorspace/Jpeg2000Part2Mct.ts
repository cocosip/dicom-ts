import type {
  Jpeg2000Codestream,
  Jpeg2000MccSegment,
  Jpeg2000MctElementType,
  Jpeg2000MctSegment,
} from "../codestream/index.js";

export interface Jpeg2000Part2MctBinding {
  componentIds: number[];
  reversible: boolean;
  matrixFloat?: number[][];
  matrixInt?: Int32Array[];
  offsets?: Int32Array;
}

export interface Jpeg2000Part2MctPlan {
  bindings: Jpeg2000Part2MctBinding[];
  fallbackMatrix?: number[][];
  fallbackOffsets?: Int32Array;
}

export function resolvePart2MctPlan(codestream: Jpeg2000Codestream, componentCount: number): Jpeg2000Part2MctPlan {
  const bindings = resolveBindings(codestream, componentCount);
  if (bindings.length > 0) {
    return { bindings };
  }

  if (codestream.mcc.length === 0 && codestream.mct.length > 0 && componentCount > 0) {
    const fallback = resolveLegacyFallback(codestream.mct, componentCount);
    if (fallback.fallbackMatrix || fallback.fallbackOffsets) {
      const plan: Jpeg2000Part2MctPlan = {
        bindings: [],
      };
      if (fallback.fallbackMatrix) {
        plan.fallbackMatrix = fallback.fallbackMatrix;
      }
      if (fallback.fallbackOffsets) {
        plan.fallbackOffsets = fallback.fallbackOffsets;
      }
      return plan;
    }
  }

  return { bindings: [] };
}

export function applyPart2MctToPixel(
  samples: number[],
  plan: Jpeg2000Part2MctPlan,
): void {
  if (samples.length === 0) {
    return;
  }

  if (plan.bindings.length > 0) {
    for (const binding of plan.bindings) {
      applyBinding(samples, binding);
    }
    return;
  }

  if (plan.fallbackMatrix && plan.fallbackMatrix.length > 0) {
    applyFallbackMatrix(samples, plan.fallbackMatrix);
  }

  if (plan.fallbackOffsets && plan.fallbackOffsets.length > 0) {
    const count = Math.min(samples.length, plan.fallbackOffsets.length);
    for (let i = 0; i < count; i++) {
      samples[i] = (samples[i] ?? 0) + (plan.fallbackOffsets[i] ?? 0);
    }
  }
}

function resolveBindings(codestream: Jpeg2000Codestream, componentCount: number): Jpeg2000Part2MctBinding[] {
  if (codestream.mcc.length === 0) {
    return [];
  }

  const mctByIndex = new Map<number, Jpeg2000MctSegment>();
  for (const segment of codestream.mct) {
    mctByIndex.set(segment.index, segment);
  }

  const mccByIndex = new Map<number, Jpeg2000MccSegment>();
  for (const segment of codestream.mcc) {
    mccByIndex.set(segment.index, segment);
  }

  const stageOrder = resolveStageOrder(codestream.mco, codestream.mcc);
  const bindings: Jpeg2000Part2MctBinding[] = [];

  for (const stageIndex of stageOrder) {
    const segment = mccByIndex.get(stageIndex);
    if (!segment) {
      continue;
    }
    if (segment.collectionType !== 0 && segment.collectionType !== 1) {
      continue;
    }

    const componentIds = resolveComponentIds(segment, componentCount);
    if (componentIds.length === 0) {
      continue;
    }
    if (!isOutputComponentsIdentity(segment, componentIds)) {
      continue;
    }

    let matrixFloat: number[][] | undefined;
    let matrixInt: Int32Array[] | undefined;
    if (segment.decorrelateIndex !== 0) {
      const matrixSegment = mctByIndex.get(segment.decorrelateIndex);
      if (matrixSegment && matrixSegment.arrayType === 1) {
        const decoded = decodeMatrix(matrixSegment, componentIds.length);
        matrixFloat = decoded.matrixFloat;
        matrixInt = decoded.matrixInt;
      }
    }

    let offsets: Int32Array | undefined;
    if (segment.offsetIndex !== 0) {
      const offsetSegment = mctByIndex.get(segment.offsetIndex);
      if (offsetSegment && offsetSegment.arrayType === 2) {
        offsets = decodeOffsets(offsetSegment, componentIds.length);
      }
    }

    if (!matrixFloat && !matrixInt && !offsets) {
      continue;
    }

    const binding: Jpeg2000Part2MctBinding = {
      componentIds,
      reversible: segment.reversible,
    };
    if (matrixFloat) {
      binding.matrixFloat = matrixFloat;
    }
    if (matrixInt) {
      binding.matrixInt = matrixInt;
    }
    if (offsets) {
      binding.offsets = offsets;
    }

    bindings.push(binding);
  }

  return bindings;
}

function resolveLegacyFallback(
  segments: readonly Jpeg2000MctSegment[],
  componentCount: number,
): Pick<Jpeg2000Part2MctPlan, "fallbackMatrix" | "fallbackOffsets"> {
  let fallbackMatrix: number[][] | undefined;
  let fallbackOffsets: Int32Array | undefined;

  for (const segment of segments) {
    if (!fallbackMatrix && segment.arrayType === 1) {
      const decoded = decodeMatrix(segment, componentCount);
      fallbackMatrix = decoded.matrixFloat;
    }
    if (!fallbackOffsets && segment.arrayType === 2) {
      fallbackOffsets = decodeOffsets(segment, componentCount);
    }
    if (fallbackMatrix && fallbackOffsets) {
      break;
    }
  }

  const result: Pick<Jpeg2000Part2MctPlan, "fallbackMatrix" | "fallbackOffsets"> = {};
  if (fallbackMatrix) {
    result.fallbackMatrix = fallbackMatrix;
  }
  if (fallbackOffsets) {
    result.fallbackOffsets = fallbackOffsets;
  }

  return result;
}

function resolveStageOrder(
  mcoSegments: readonly { stageIndices: number[] }[],
  mccSegments: readonly Jpeg2000MccSegment[],
): number[] {
  if (mcoSegments.length > 0 && mcoSegments[0] && mcoSegments[0].stageIndices.length > 0) {
    return [...mcoSegments[0].stageIndices];
  }
  return mccSegments.map((segment) => segment.index);
}

function resolveComponentIds(segment: Jpeg2000MccSegment, componentCount: number): number[] {
  if (segment.componentIds.length > 0) {
    return segment.componentIds.filter((id) => id >= 0 && id < componentCount);
  }
  if (segment.numComponents <= 0) {
    return [];
  }
  const count = Math.min(segment.numComponents, componentCount);
  return Array.from({ length: count }, (_, i) => i);
}

function isOutputComponentsIdentity(segment: Jpeg2000MccSegment, inputIds: readonly number[]): boolean {
  if (segment.outputComponentIds.length === 0) {
    return true;
  }
  if (segment.outputComponentIds.length !== inputIds.length) {
    return false;
  }
  for (let i = 0; i < inputIds.length; i++) {
    if (segment.outputComponentIds[i] !== inputIds[i]) {
      return false;
    }
  }
  return true;
}

function decodeMatrix(
  segment: Jpeg2000MctSegment,
  components: number,
): { matrixFloat?: number[][]; matrixInt?: Int32Array[] } {
  const elementSize = mctElementSize(segment.elementType);
  if (components <= 0 || elementSize <= 0) {
    return {};
  }

  const expectedLength = components * components * elementSize;
  if (segment.data.length < expectedLength) {
    return {};
  }

  const matrixFloat: number[][] = new Array(components);
  const matrixInt: Int32Array[] = new Array(components);
  let offset = 0;

  for (let row = 0; row < components; row++) {
    const rowFloat = new Array<number>(components);
    const rowInt = new Int32Array(components);

    for (let col = 0; col < components; col++) {
      const decoded = decodeElement(segment.data, offset, segment.elementType);
      rowFloat[col] = decoded.floatValue;
      rowInt[col] = decoded.intValue;
      offset += elementSize;
    }

    matrixFloat[row] = rowFloat;
    matrixInt[row] = rowInt;
  }

  if (segment.elementType === 0 || segment.elementType === 1) {
    return {
      matrixFloat,
      matrixInt,
    };
  }

  return {
    matrixFloat,
  };
}

function decodeOffsets(segment: Jpeg2000MctSegment, components: number): Int32Array | undefined {
  const elementSize = mctElementSize(segment.elementType);
  if (components <= 0 || elementSize <= 0) {
    return undefined;
  }

  const expectedLength = components * elementSize;
  if (segment.data.length < expectedLength) {
    return undefined;
  }

  const offsets = new Int32Array(components);
  let offset = 0;
  for (let i = 0; i < components; i++) {
    const decoded = decodeElement(segment.data, offset, segment.elementType);
    offsets[i] = decoded.intValue;
    offset += elementSize;
  }
  return offsets;
}

function applyBinding(samples: number[], binding: Jpeg2000Part2MctBinding): void {
  const componentCount = binding.componentIds.length;
  if (componentCount === 0) {
    return;
  }

  if (binding.reversible && binding.matrixInt && binding.matrixInt.length === componentCount) {
    const out = new Int32Array(componentCount);
    for (let row = 0; row < componentCount; row++) {
      const matrixRow = binding.matrixInt[row]!;
      let sum = 0;
      for (let col = 0; col < componentCount; col++) {
        const componentIndex = binding.componentIds[col]!;
        sum += (matrixRow[col] ?? 0) * (samples[componentIndex] ?? 0);
      }
      out[row] = sum;
    }
    for (let row = 0; row < componentCount; row++) {
      samples[binding.componentIds[row]!] = out[row] ?? 0;
    }
  } else if (binding.matrixFloat && binding.matrixFloat.length === componentCount) {
    const out = new Int32Array(componentCount);
    for (let row = 0; row < componentCount; row++) {
      const matrixRow = binding.matrixFloat[row]!;
      let sum = 0;
      for (let col = 0; col < componentCount; col++) {
        const componentIndex = binding.componentIds[col]!;
        sum += (matrixRow[col] ?? 0) * (samples[componentIndex] ?? 0);
      }
      out[row] = Math.round(sum);
    }
    for (let row = 0; row < componentCount; row++) {
      samples[binding.componentIds[row]!] = out[row] ?? 0;
    }
  }

  if (binding.offsets && binding.offsets.length === componentCount) {
    for (let i = 0; i < componentCount; i++) {
      const componentIndex = binding.componentIds[i]!;
      samples[componentIndex] = (samples[componentIndex] ?? 0) + (binding.offsets[i] ?? 0);
    }
  }
}

function applyFallbackMatrix(samples: number[], matrix: readonly number[][]): void {
  const count = Math.min(samples.length, matrix.length);
  if (count <= 0) {
    return;
  }

  const out = new Int32Array(count);
  for (let row = 0; row < count; row++) {
    const matrixRow = matrix[row] ?? [];
    let sum = 0;
    for (let col = 0; col < count; col++) {
      sum += (matrixRow[col] ?? 0) * (samples[col] ?? 0);
    }
    out[row] = Math.round(sum);
  }

  for (let row = 0; row < count; row++) {
    samples[row] = out[row] ?? 0;
  }
}

function mctElementSize(elementType: Jpeg2000MctElementType): number {
  switch (elementType) {
    case 0:
      return 2;
    case 1:
    case 2:
      return 4;
    case 3:
      return 8;
    default:
      return 0;
  }
}

function decodeElement(
  data: Uint8Array,
  offset: number,
  elementType: Jpeg2000MctElementType,
): { floatValue: number; intValue: number } {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  switch (elementType) {
    case 0: {
      const value = view.getInt16(offset, false);
      return { floatValue: value, intValue: value };
    }
    case 1: {
      const value = view.getInt32(offset, false);
      return { floatValue: value, intValue: value };
    }
    case 2: {
      const value = view.getFloat32(offset, false);
      return { floatValue: value, intValue: Math.round(value) };
    }
    case 3: {
      const value = view.getFloat64(offset, false);
      return { floatValue: value, intValue: Math.round(value) };
    }
    default:
      return { floatValue: 0, intValue: 0 };
  }
}
