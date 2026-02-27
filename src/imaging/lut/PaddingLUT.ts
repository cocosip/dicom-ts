import { ILUT } from "./ILUT.js";

export class PaddingLUT implements ILUT {
  readonly paddingValue: number;
  readonly replacement: number;

  constructor(paddingValue: number, replacement: number = 0) {
    this.paddingValue = paddingValue;
    this.replacement = replacement;
  }

  map(value: number): number {
    return value === this.paddingValue ? this.replacement : value;
  }
}
