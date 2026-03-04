export interface Jpeg2000BandInfo {
  band: number;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}

export function ceilDivPow2(value: number, shift: number): number {
  if (shift <= 0) {
    return value;
  }
  const divisor = 1 << shift;
  return Math.floor((value + divisor - 1) / divisor);
}

export function ceilDiv(a: number, b: number): number {
  if (b <= 0) {
    return 0;
  }
  if (a >= 0) {
    return Math.floor((a + b - 1) / b);
  }
  return Math.floor(a / b);
}

export function floorDiv(a: number, b: number): number {
  if (b <= 0) {
    return 0;
  }
  if (a >= 0) {
    return Math.floor(a / b);
  }
  return -Math.floor(((-a) + b - 1) / b);
}

function splitLengths(value: number, even: boolean): number {
  if (even) {
    return Math.floor((value + 1) / 2);
  }
  return Math.floor(value / 2);
}

function isEven(value: number): boolean {
  return (value & 1) === 0;
}

function nextCoord(value: number): number {
  return Math.floor((value + 1) / 2);
}

export function resolutionDimsWithOrigin(
  width: number,
  height: number,
  x0: number,
  y0: number,
  numLevels: number,
  resolution: number,
): { width: number; height: number; x0: number; y0: number } {
  let level = numLevels - resolution;
  if (level < 0) {
    level = 0;
  }

  let currentWidth = width;
  let currentHeight = height;
  let currentX0 = x0;
  let currentY0 = y0;

  for (let i = 0; i < level; i++) {
    currentWidth = splitLengths(currentWidth, isEven(currentX0));
    currentHeight = splitLengths(currentHeight, isEven(currentY0));
    currentX0 = nextCoord(currentX0);
    currentY0 = nextCoord(currentY0);
  }

  return {
    width: currentWidth,
    height: currentHeight,
    x0: currentX0,
    y0: currentY0,
  };
}

export function bandInfosForResolution(
  width: number,
  height: number,
  x0: number,
  y0: number,
  numLevels: number,
  resolution: number,
): { width: number; height: number; x0: number; y0: number; bands: Jpeg2000BandInfo[] } {
  const dims = resolutionDimsWithOrigin(width, height, x0, y0, numLevels, resolution);

  if (resolution === 0) {
    return {
      width: dims.width,
      height: dims.height,
      x0: dims.x0,
      y0: dims.y0,
      bands: [{ band: 0, width: dims.width, height: dims.height, offsetX: 0, offsetY: 0 }],
    };
  }

  const low = resolutionDimsWithOrigin(width, height, x0, y0, numLevels, resolution - 1);
  const highWidth = dims.width - low.width;
  const highHeight = dims.height - low.height;

  return {
    width: dims.width,
    height: dims.height,
    x0: dims.x0,
    y0: dims.y0,
    bands: [
      { band: 1, width: highWidth, height: low.height, offsetX: low.width, offsetY: 0 },
      { band: 2, width: low.width, height: highHeight, offsetX: 0, offsetY: low.height },
      { band: 3, width: highWidth, height: highHeight, offsetX: low.width, offsetY: low.height },
    ],
  };
}