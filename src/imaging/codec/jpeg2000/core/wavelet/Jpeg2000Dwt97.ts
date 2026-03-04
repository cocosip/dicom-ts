import { isEven, nextLowpassWindow } from "./Jpeg2000WaveletParity.js";

const ALPHA_97 = -1.586134342;
const BETA_97 = -0.052980118;
const GAMMA_97 = 0.882911075;
const DELTA_97 = 0.443506852;
const K_97 = 1.230174105;
const INV_K_97 = 0.812893066;

export function forward97_1dWithParity(data: Float64Array, even: boolean): void {
  const width = data.length;
  if (width <= 1) {
    return;
  }

  let sn: number;
  let dn: number;
  if (even) {
    sn = (width + 1) >> 1;
    dn = width - sn;
  } else {
    sn = width >> 1;
    dn = width - sn;
  }

  const a = even ? 0 : 1;
  const b = even ? 1 : 0;

  encodeStep2_97(data, a, b + 1, dn, min(dn, sn - b), ALPHA_97);
  encodeStep2_97(data, b, a + 1, sn, min(sn, dn - a), BETA_97);
  encodeStep2_97(data, a, b + 1, dn, min(dn, sn - b), GAMMA_97);
  encodeStep2_97(data, b, a + 1, sn, min(sn, dn - a), DELTA_97);

  if (a === 0) {
    encodeStep1Combined97(data, sn, dn, INV_K_97, K_97);
  } else {
    encodeStep1Combined97(data, dn, sn, K_97, INV_K_97);
  }

  deinterleave97(data, dn, sn, even);
}

export function forward97_2dWithParity(
  data: Float64Array,
  width: number,
  height: number,
  stride: number,
  evenRow: boolean,
  evenCol: boolean,
): void {
  if (width <= 1 && height <= 1) {
    return;
  }

  // OpenJPEG-compatible order: vertical pass first, then horizontal pass.
  if (height > 1) {
    const col = new Float64Array(height);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        col[y] = data[y * stride + x] ?? 0;
      }
      forward97_1dWithParity(col, evenCol);
      for (let y = 0; y < height; y++) {
        data[y * stride + x] = col[y] ?? 0;
      }
    }
  }

  if (width > 1) {
    const row = new Float64Array(width);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        row[x] = data[y * stride + x] ?? 0;
      }
      forward97_1dWithParity(row, evenRow);
      for (let x = 0; x < width; x++) {
        data[y * stride + x] = row[x] ?? 0;
      }
    }
  }
}

export function forwardMultilevel97WithParity(
  data: Float64Array,
  width: number,
  height: number,
  levels: number,
  x0: number,
  y0: number,
): void {
  if (levels <= 0) {
    return;
  }

  const stride = width;
  let currentWidth = width;
  let currentHeight = height;
  let currentX0 = x0;
  let currentY0 = y0;

  for (let level = 0; level < levels; level++) {
    if (currentWidth <= 1 && currentHeight <= 1) {
      break;
    }

    forward97_2dWithParity(
      data,
      currentWidth,
      currentHeight,
      stride,
      isEven(currentX0),
      isEven(currentY0),
    );

    const next = nextLowpassWindow(currentWidth, currentHeight, currentX0, currentY0);
    currentWidth = next.width;
    currentHeight = next.height;
    currentX0 = next.x0;
    currentY0 = next.y0;
  }
}

export function inverse97_1dWithParity(data: Float64Array, even: boolean): void {
  const width = data.length;
  if (width <= 1) {
    return;
  }

  let sn: number;
  let dn: number;
  if (even) {
    sn = (width + 1) >> 1;
    dn = width - sn;
  } else {
    sn = width >> 1;
    dn = width - sn;
  }

  const a = even ? 0 : 1;
  const b = even ? 1 : 0;

  interleave97(data, dn, sn, even);

  if (a === 0) {
    decodeStep1Combined97(data, sn, dn, INV_K_97, K_97);
  } else {
    decodeStep1Combined97(data, dn, sn, K_97, INV_K_97);
  }

  decodeStep2_97(data, b, a + 1, sn, min(sn, dn - a), DELTA_97);
  decodeStep2_97(data, a, b + 1, dn, min(dn, sn - b), GAMMA_97);
  decodeStep2_97(data, b, a + 1, sn, min(sn, dn - a), BETA_97);
  decodeStep2_97(data, a, b + 1, dn, min(dn, sn - b), ALPHA_97);
}

export function inverse97_2dWithParity(
  data: Float64Array,
  width: number,
  height: number,
  stride: number,
  evenRow: boolean,
  evenCol: boolean,
): void {
  if (width <= 1 && height <= 1) {
    return;
  }

  if (width > 1) {
    const row = new Float64Array(width);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        row[x] = data[y * stride + x] ?? 0;
      }
      inverse97_1dWithParity(row, evenRow);
      for (let x = 0; x < width; x++) {
        data[y * stride + x] = row[x] ?? 0;
      }
    }
  }

  if (height > 1) {
    const col = new Float64Array(height);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        col[y] = data[y * stride + x] ?? 0;
      }
      inverse97_1dWithParity(col, evenCol);
      for (let y = 0; y < height; y++) {
        data[y * stride + x] = col[y] ?? 0;
      }
    }
  }
}

export function inverseMultilevel97WithParity(
  data: Float64Array,
  width: number,
  height: number,
  levels: number,
  x0: number,
  y0: number,
): void {
  if (levels <= 0) {
    return;
  }

  const levelWidths = new Array<number>(levels + 1);
  const levelHeights = new Array<number>(levels + 1);
  const levelX0 = new Array<number>(levels + 1);
  const levelY0 = new Array<number>(levels + 1);
  levelWidths[0] = width;
  levelHeights[0] = height;
  levelX0[0] = x0;
  levelY0[0] = y0;

  for (let i = 1; i <= levels; i++) {
    const next = nextLowpassWindow(levelWidths[i - 1]!, levelHeights[i - 1]!, levelX0[i - 1]!, levelY0[i - 1]!);
    levelWidths[i] = next.width;
    levelHeights[i] = next.height;
    levelX0[i] = next.x0;
    levelY0[i] = next.y0;
  }

  const stride = width;
  for (let level = levels - 1; level >= 0; level--) {
    inverse97_2dWithParity(
      data,
      levelWidths[level] ?? 0,
      levelHeights[level] ?? 0,
      stride,
      isEven(levelX0[level] ?? 0),
      isEven(levelY0[level] ?? 0),
    );
  }
}

export function int32ToFloat64(data: Int32Array): Float64Array {
  const converted = new Float64Array(data.length);
  for (let i = 0; i < data.length; i++) {
    converted[i] = data[i] ?? 0;
  }
  return converted;
}

export function float64ToInt32(data: Float64Array): Int32Array {
  const converted = new Int32Array(data.length);
  for (let i = 0; i < data.length; i++) {
    const value = data[i] ?? 0;
    converted[i] = value >= 0 ? Math.trunc(value + 0.5) : Math.trunc(value - 0.5);
  }
  return converted;
}

function decodeStep2_97(
  data: Float64Array,
  flStart: number,
  fwStart: number,
  end: number,
  m: number,
  coefficient: number,
): void {
  encodeStep2_97(data, flStart, fwStart, end, m, -coefficient);
}

function encodeStep1Combined97(
  data: Float64Array,
  itersC1: number,
  itersC2: number,
  c1: number,
  c2: number,
): void {
  const common = min(itersC1, itersC2);
  let i = 0;
  let fw = 0;
  for (; i < common; i++) {
    data[fw] = (data[fw] ?? 0) * c1;
    data[fw + 1] = (data[fw + 1] ?? 0) * c2;
    fw += 2;
  }

  if (i < itersC1) {
    data[fw] = (data[fw] ?? 0) * c1;
  } else if (i < itersC2) {
    data[fw + 1] = (data[fw + 1] ?? 0) * c2;
  }
}

function encodeStep2_97(
  data: Float64Array,
  flStart: number,
  fwStart: number,
  end: number,
  m: number,
  coefficient: number,
): void {
  const imax = min(end, m);
  if (imax > 0) {
    let fw = fwStart;
    let fl = flStart;
    data[fw - 1] = (data[fw - 1] ?? 0) + ((data[fl] ?? 0) + (data[fw] ?? 0)) * coefficient;
    fw += 2;

    for (let i = 1; i < imax; i++) {
      data[fw - 1] = (data[fw - 1] ?? 0) + ((data[fw - 2] ?? 0) + (data[fw] ?? 0)) * coefficient;
      fw += 2;
    }
  }

  if (m < end) {
    const fw = fwStart + (2 * m);
    data[fw - 1] = (data[fw - 1] ?? 0) + (2 * (data[fw - 2] ?? 0)) * coefficient;
  }
}

function decodeStep1Combined97(
  data: Float64Array,
  itersC1: number,
  itersC2: number,
  c1: number,
  c2: number,
): void {
  const common = min(itersC1, itersC2);
  let i = 0;
  let fw = 0;
  for (; i < common; i++) {
    data[fw] = (data[fw] ?? 0) / c1;
    data[fw + 1] = (data[fw + 1] ?? 0) / c2;
    fw += 2;
  }

  if (i < itersC1) {
    data[fw] = (data[fw] ?? 0) / c1;
  } else if (i < itersC2) {
    data[fw + 1] = (data[fw + 1] ?? 0) / c2;
  }
}

function interleave97(data: Float64Array, dn: number, sn: number, even: boolean): void {
  const width = dn + sn;
  const tmp = new Float64Array(width);

  if (even) {
    for (let i = 0; i < sn; i++) {
      tmp[2 * i] = data[i] ?? 0;
    }
    for (let i = 0; i < dn; i++) {
      tmp[(2 * i) + 1] = data[sn + i] ?? 0;
    }
  } else {
    for (let i = 0; i < sn; i++) {
      tmp[(2 * i) + 1] = data[i] ?? 0;
    }
    for (let i = 0; i < dn; i++) {
      tmp[2 * i] = data[sn + i] ?? 0;
    }
  }

  data.set(tmp);
}

function deinterleave97(data: Float64Array, dn: number, sn: number, even: boolean): void {
  const width = dn + sn;
  const tmp = new Float64Array(width);

  if (even) {
    for (let i = 0; i < sn; i++) {
      tmp[i] = data[2 * i] ?? 0;
    }
    for (let i = 0; i < dn; i++) {
      tmp[sn + i] = data[(2 * i) + 1] ?? 0;
    }
  } else {
    for (let i = 0; i < sn; i++) {
      tmp[i] = data[(2 * i) + 1] ?? 0;
    }
    for (let i = 0; i < dn; i++) {
      tmp[sn + i] = data[2 * i] ?? 0;
    }
  }

  data.set(tmp);
}

function min(a: number, b: number): number {
  return a < b ? a : b;
}
