export function splitLengths(length: number, evenStart: boolean): number {
  if (evenStart) {
    return Math.floor((length + 1) / 2);
  }
  return Math.floor(length / 2);
}

export function isEven(value: number): boolean {
  return (value & 1) === 0;
}

export function nextCoord(value: number): number {
  return (value + 1) >> 1;
}

export function nextLowpassWindow(
  width: number,
  height: number,
  x0: number,
  y0: number,
): { width: number; height: number; x0: number; y0: number } {
  const evenRow = isEven(x0);
  const evenCol = isEven(y0);
  return {
    width: splitLengths(width, evenRow),
    height: splitLengths(height, evenCol),
    x0: nextCoord(x0),
    y0: nextCoord(y0),
  };
}
