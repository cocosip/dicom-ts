function roundToInt32(value: number): number {
  return value >= 0 ? Math.trunc(value + 0.5) : Math.trunc(value - 0.5);
}

export function forwardRct(r: number, g: number, b: number): { y: number; cb: number; cr: number } {
  const y = (r + (2 * g) + b) >> 2;
  const cb = b - g;
  const cr = r - g;
  return { y, cb, cr };
}

export function forwardIct(r: number, g: number, b: number): { y: number; cb: number; cr: number } {
  const y = roundToInt32((0.299 * r) + (0.587 * g) + (0.114 * b));
  const cb = roundToInt32((-0.16875 * r) - (0.33126 * g) + (0.5 * b));
  const cr = roundToInt32((0.5 * r) - (0.41869 * g) - (0.08131 * b));
  return { y, cb, cr };
}

export function inverseRct(y: number, cb: number, cr: number): { r: number; g: number; b: number } {
  const g = y - ((cb + cr) >> 2);
  const r = cr + g;
  const b = cb + g;
  return { r, g, b };
}

export function inverseIct(y: number, cb: number, cr: number): { r: number; g: number; b: number } {
  const r = roundToInt32(y + (1.402 * cr));
  const g = roundToInt32(y - (0.34413 * cb) - (0.71414 * cr));
  const b = roundToInt32(y + (1.772 * cb));
  return { r, g, b };
}
