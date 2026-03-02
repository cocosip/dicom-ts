/**
 * 2D interpolation methods using the nearest neighbor algorithm.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Algorithms/NearestNeighborInterpolation.cs
 */
export class NearestNeighborInterpolation {

  /**
   * Rescale a 2D 8-bit grayscale image using nearest neighbor interpolation.
   */
  static rescaleGrayscale(
    input: Uint8Array,
    inputWidth: number,
    inputHeight: number,
    outputWidth: number,
    outputHeight: number,
  ): Uint8Array {
    const output = new Uint8Array(outputWidth * outputHeight);
    if (outputWidth === 1 && outputHeight === 1) { output[0] = input[0] ?? 0; return output; }
    const xF = (inputWidth - 1) / (outputWidth - 1 || 1);
    const yF = (inputHeight - 1) / (outputHeight - 1 || 1);
    const xMax = inputWidth - 1;
    const yMax = inputHeight - 1;
    for (let y = 0; y < outputHeight; y++) {
      const iy0 = y * yF;
      const iy1 = iy0 | 0;
      const iy2 = iy1 === yMax ? iy1 : iy1 + 1;
      const iyx0 = inputWidth * (iy0 - iy1 < 0.5 ? iy1 : iy2);
      for (let x = 0, yx = outputWidth * y; x < outputWidth; x++, yx++) {
        const ix0 = x * xF;
        const ix1 = ix0 | 0;
        const ix2 = ix1 === xMax ? ix1 : ix1 + 1;
        const ix = ix0 - ix1 < 0.5 ? ix1 : ix2;
        output[yx] = input[iyx0 + ix] ?? 0;
      }
    }
    return output;
  }
}
