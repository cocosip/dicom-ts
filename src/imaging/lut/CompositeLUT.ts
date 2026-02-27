import { ILUT } from "./ILUT.js";

export class CompositeLUT implements ILUT {
  readonly luts: ILUT[];

  constructor(...luts: ILUT[]) {
    this.luts = luts;
  }

  map(value: number): number {
    let v = value;
    for (const lut of this.luts) {
      v = lut.map(v);
    }
    return v;
  }
}
