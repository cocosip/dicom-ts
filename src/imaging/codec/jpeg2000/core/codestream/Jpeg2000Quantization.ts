const DWT_NORMS_97: number[][] = [
  [1.000, 1.965, 4.177, 8.403, 16.90, 33.84, 67.69, 135.3, 270.6, 540.9],
  [2.022, 3.989, 8.355, 17.04, 34.27, 68.63, 137.3, 274.6, 549.0, 0.0],
  [2.022, 3.989, 8.355, 17.04, 34.27, 68.63, 137.3, 274.6, 549.0, 0.0],
  [2.080, 3.865, 8.307, 17.18, 34.71, 69.59, 139.3, 278.6, 557.2, 0.0],
];

function dwtNorm97(level: number, orient: number): number {
  if (level < 0) {
    level = 0;
  }
  if (orient === 0 && level >= 10) {
    level = 9;
  } else if (orient > 0 && level >= 9) {
    level = 8;
  }
  if (orient < 0 || orient > 3) {
    return 1.0;
  }
  return DWT_NORMS_97[orient]?.[level] ?? 1.0;
}

function qualityScale(quality: number): number {
  if (quality < 1) {
    quality = 1;
  }
  if (quality > 100) {
    quality = 100;
  }
  let scale = Math.pow(2.0, (100.0 - quality) / 12.5);
  if (scale < 0.01) {
    scale = 0.01;
  }
  return scale * 0.9 * 0.2;
}

function subbandParams(idx: number, numLevels: number): { resno: number; orient: number; level: number } {
  let resno: number;
  let orient: number;
  if (idx === 0) {
    resno = 0;
    orient = 0;
  } else {
    resno = Math.floor((idx - 1) / 3) + 1;
    orient = ((idx - 1) % 3) + 1;
  }
  let level = numLevels - resno;
  if (level < 0) {
    level = 0;
  }
  return { resno, orient, level };
}

function calcOpenjpegStepSizes97(numLevels: number, scale: number): number[] {
  if (numLevels <= 0) {
    return [scale];
  }
  const numSubbands = 3 * numLevels + 1;
  const steps: number[] = [];
  for (let idx = 0; idx < numSubbands; idx++) {
    const { orient, level } = subbandParams(idx, numLevels);
    const norm = dwtNorm97(level, orient);
    if (norm <= 0) {
      steps.push(scale);
    } else {
      steps.push(scale / norm);
    }
  }
  return steps;
}

export function encodeQuantizationStep(stepSize: number, numbps: number): number {
  if (stepSize <= 0) {
    return 0;
  }
  let fixed = Math.floor(stepSize * 8192.0);
  if (fixed <= 0) {
    fixed = 1;
  }
  const log2 = Math.floor(Math.log2(fixed));
  const p = log2 - 13;
  const n = 11 - log2;
  let mant = 0;
  if (n < 0) {
    mant = fixed >> -n;
  } else {
    mant = fixed << n;
  }
  mant &= 0x7ff;
  let expn = numbps - p;
  if (expn < 0) {
    expn = 0;
  }
  if (expn > 0x1f) {
    expn = 0x1f;
  }
  return (expn << 11) | mant;
}

export interface Jpeg2000QuantizationParams {
  style: number;
  guardBits: number;
  stepSizes: number[];
  encodedSteps: number[];
}

export function calculateQuantizationParams(
  quality: number,
  numLevels: number,
  bitDepth: number,
): Jpeg2000QuantizationParams {
  if (quality < 1) {
    quality = 1;
  }
  if (quality > 100) {
    quality = 100;
  }

  const numSubbands = 3 * numLevels + 1;

  const params: Jpeg2000QuantizationParams = {
    style: 2,
    guardBits: 2,
    stepSizes: [],
    encodedSteps: [],
  };

  const scale = qualityScale(quality);
  params.stepSizes = calcOpenjpegStepSizes97(numLevels, scale);

  for (let i = 0; i < params.stepSizes.length && i < numSubbands; i++) {
    params.encodedSteps.push(encodeQuantizationStep(params.stepSizes[i] ?? 0, bitDepth));
  }

  return params;
}