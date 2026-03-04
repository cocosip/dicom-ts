import { isEven, nextLowpassWindow } from "./Jpeg2000WaveletParity.js";

export function forward53_1dWithParity(data: Int32Array, even: boolean): void {
  const width = data.length;

  if (even) {
    if (width <= 1) {
      return;
    }

    const sn = (width + 1) >> 1;
    const dn = width - sn;
    const tmp = new Int32Array(width);

    let i = 0;
    for (; i < sn - 1; i++) {
      const oddIndex = (2 * i) + 1;
      tmp[sn + i] = (data[oddIndex] ?? 0) - (((data[2 * i] ?? 0) + (data[2 * (i + 1)] ?? 0)) >> 1);
    }
    if ((width % 2) === 0) {
      const oddIndex = (2 * i) + 1;
      tmp[sn + i] = (data[oddIndex] ?? 0) - (data[2 * i] ?? 0);
    }

    data[0] = (data[0] ?? 0) + (((tmp[sn] ?? 0) + (tmp[sn] ?? 0) + 2) >> 2);
    for (i = 1; i < dn; i++) {
      data[i] = (data[2 * i] ?? 0) + (((tmp[sn + i - 1] ?? 0) + (tmp[sn + i] ?? 0) + 2) >> 2);
    }
    if ((width % 2) === 1) {
      data[i] = (data[2 * i] ?? 0) + (((tmp[sn + i - 1] ?? 0) + (tmp[sn + i - 1] ?? 0) + 2) >> 2);
    }

    data.set(tmp.subarray(sn, sn + dn), sn);
    return;
  }

  if (width === 1) {
    data[0] = (data[0] ?? 0) * 2;
    return;
  }

  const sn = width >> 1;
  const dn = width - sn;
  const tmp = new Int32Array(width);

  tmp[sn] = (data[0] ?? 0) - (data[1] ?? 0);
  let i = 1;
  for (; i < sn; i++) {
    tmp[sn + i] = (data[2 * i] ?? 0) - (((data[(2 * i) + 1] ?? 0) + (data[(2 * (i - 1)) + 1] ?? 0)) >> 1);
  }
  if ((width % 2) === 1) {
    tmp[sn + i] = (data[2 * i] ?? 0) - (data[(2 * (i - 1)) + 1] ?? 0);
  }

  for (i = 0; i < dn - 1; i++) {
    data[i] = (data[(2 * i) + 1] ?? 0) + (((tmp[sn + i] ?? 0) + (tmp[sn + i + 1] ?? 0) + 2) >> 2);
  }
  if ((width % 2) === 0) {
    data[i] = (data[(2 * i) + 1] ?? 0) + (((tmp[sn + i] ?? 0) + (tmp[sn + i] ?? 0) + 2) >> 2);
  }

  data.set(tmp.subarray(sn, sn + dn), sn);
}

export function forward53_2dWithParity(
  data: Int32Array,
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
    const col = new Int32Array(height);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        col[y] = data[y * stride + x] ?? 0;
      }
      forward53_1dWithParity(col, evenCol);
      for (let y = 0; y < height; y++) {
        data[y * stride + x] = col[y] ?? 0;
      }
    }
  }

  if (width > 1) {
    const row = new Int32Array(width);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        row[x] = data[y * stride + x] ?? 0;
      }
      forward53_1dWithParity(row, evenRow);
      for (let x = 0; x < width; x++) {
        data[y * stride + x] = row[x] ?? 0;
      }
    }
  }
}

export function forwardMultilevel53WithParity(
  data: Int32Array,
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

    forward53_2dWithParity(
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

export function inverse53_1dWithParity(data: Int32Array, even: boolean): void {
  const width = data.length;
  if (even) {
    if (width <= 1) {
      return;
    }

    const sn = Math.floor((width + 1) / 2);
    const tmp = new Int32Array(width);

    let d1n = data[sn] ?? 0;
    let s1n = data[0] ?? 0;
    let s0n = s1n - ((d1n + 1) >> 1);

    let i = 0;
    let j = 1;
    while (i < width - 3) {
      const d1c = d1n;
      const s0c = s0n;

      s1n = data[j] ?? 0;
      d1n = data[sn + j] ?? 0;
      s0n = s1n - ((d1c + d1n + 2) >> 2);

      tmp[i] = s0c;
      tmp[i + 1] = d1c + ((s0c + s0n) >> 1);
      i += 2;
      j++;
    }

    tmp[i] = s0n;
    if ((width & 1) !== 0) {
      const tail = data[(width - 1) >> 1] ?? 0;
      tmp[width - 1] = tail - ((d1n + 1) >> 1);
      tmp[width - 2] = d1n + ((s0n + tmp[width - 1]!) >> 1);
    } else {
      tmp[width - 1] = d1n + s0n;
    }

    data.set(tmp);
    return;
  }

  if (width === 1) {
    data[0] = Math.trunc(data[0]! / 2);
    return;
  }

  if (width === 2) {
    const out1 = data[0]! - ((data[1]! + 1) >> 1);
    const out0 = data[1]! + out1;
    data[0] = out0;
    data[1] = out1;
    return;
  }

  const sn = width >> 1;
  const tmp = new Int32Array(width);

  let s1 = data[sn + 1] ?? 0;
  let dc = data[0]! - ((data[sn]! + s1 + 2) >> 2);
  tmp[0] = data[sn]! + dc;

  const notOdd = (width & 1) === 0 ? 1 : 0;
  const limit = width - 2 - notOdd;
  let i = 1;
  let j = 1;
  while (i < limit) {
    const s2 = data[sn + j + 1] ?? 0;
    const dn = data[j]! - ((s1 + s2 + 2) >> 2);
    tmp[i] = dc;
    tmp[i + 1] = s1 + ((dn + dc) >> 1);
    dc = dn;
    s1 = s2;
    i += 2;
    j++;
  }

  tmp[i] = dc;
  if ((width & 1) === 0) {
    const dn = data[Math.floor(width / 2) - 1]! - ((s1 + 1) >> 1);
    tmp[width - 2] = s1 + ((dn + dc) >> 1);
    tmp[width - 1] = dn;
  } else {
    tmp[width - 1] = s1 + dc;
  }

  data.set(tmp);
}

export function inverse53_2dWithParity(
  data: Int32Array,
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
    const row = new Int32Array(width);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        row[x] = data[y * stride + x] ?? 0;
      }
      inverse53_1dWithParity(row, evenRow);
      for (let x = 0; x < width; x++) {
        data[y * stride + x] = row[x] ?? 0;
      }
    }
  }

  if (height > 1) {
    const col = new Int32Array(height);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        col[y] = data[y * stride + x] ?? 0;
      }
      inverse53_1dWithParity(col, evenCol);
      for (let y = 0; y < height; y++) {
        data[y * stride + x] = col[y] ?? 0;
      }
    }
  }
}

export function inverseMultilevel53WithParity(
  data: Int32Array,
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
    inverse53_2dWithParity(
      data,
      levelWidths[level] ?? 0,
      levelHeights[level] ?? 0,
      stride,
      isEven(levelX0[level] ?? 0),
      isEven(levelY0[level] ?? 0),
    );
  }
}
