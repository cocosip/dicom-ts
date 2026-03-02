/**
 * 2D interpolation methods using the bilinear algorithm.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Algorithms/BilinearInterpolation.cs
 */
export class BilinearInterpolation {

  static rescaleGrayscaleU8(
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
      const oy0 = y * yF;
      const oy1 = oy0 | 0;
      const oy2 = oy1 === yMax ? oy1 : oy1 + 1;
      const dy1 = oy0 - oy1;
      const dy2 = 1.0 - dy1;
      const yo0 = outputWidth * y;
      const yo1 = inputWidth * oy1;
      const yo2 = inputWidth * oy2;
      for (let x = 0; x < outputWidth; x++) {
        const ox0 = x * xF;
        const ox1 = ox0 | 0;
        const ox2 = ox1 === xMax ? ox1 : ox1 + 1;
        const dx1 = ox0 - ox1;
        const dx2 = 1.0 - dx1;
        output[yo0 + x] =
          (dy2 * ((dx2 * (input[yo1 + ox1] ?? 0)) + (dx1 * (input[yo1 + ox2] ?? 0))))
          + (dy1 * ((dx2 * (input[yo2 + ox1] ?? 0)) + (dx1 * (input[yo2 + ox2] ?? 0))));
      }
    }
    return output;
  }

  static rescaleGrayscaleS16(
    input: Int16Array,
    inputWidth: number,
    inputHeight: number,
    outputWidth: number,
    outputHeight: number,
  ): Int16Array {
    const output = new Int16Array(outputWidth * outputHeight);
    if (outputWidth === 1 && outputHeight === 1) { output[0] = input[0] ?? 0; return output; }
    const xF = (inputWidth - 1) / (outputWidth - 1 || 1);
    const yF = (inputHeight - 1) / (outputHeight - 1 || 1);
    const xMax = inputWidth - 1;
    const yMax = inputHeight - 1;
    for (let y = 0; y < outputHeight; y++) {
      const oy0 = y * yF;
      const oy1 = oy0 | 0;
      const oy2 = oy1 === yMax ? oy1 : oy1 + 1;
      const dy1 = oy0 - oy1;
      const dy2 = 1.0 - dy1;
      const yo0 = outputWidth * y;
      const yo1 = inputWidth * oy1;
      const yo2 = inputWidth * oy2;
      for (let x = 0; x < outputWidth; x++) {
        const ox0 = x * xF;
        const ox1 = ox0 | 0;
        const ox2 = ox1 === xMax ? ox1 : ox1 + 1;
        const dx1 = ox0 - ox1;
        const dx2 = 1.0 - dx1;
        output[yo0 + x] =
          (dy2 * ((dx2 * (input[yo1 + ox1] ?? 0)) + (dx1 * (input[yo1 + ox2] ?? 0))))
          + (dy1 * ((dx2 * (input[yo2 + ox1] ?? 0)) + (dx1 * (input[yo2 + ox2] ?? 0))));
      }
    }
    return output;
  }

  static rescaleGrayscaleU16(
    input: Uint16Array,
    inputWidth: number,
    inputHeight: number,
    outputWidth: number,
    outputHeight: number,
  ): Uint16Array {
    const output = new Uint16Array(outputWidth * outputHeight);
    if (outputWidth === 1 && outputHeight === 1) { output[0] = input[0] ?? 0; return output; }
    const xF = (inputWidth - 1) / (outputWidth - 1 || 1);
    const yF = (inputHeight - 1) / (outputHeight - 1 || 1);
    const xMax = inputWidth - 1;
    const yMax = inputHeight - 1;
    for (let y = 0; y < outputHeight; y++) {
      const oy0 = y * yF;
      const oy1 = oy0 | 0;
      const oy2 = oy1 === yMax ? oy1 : oy1 + 1;
      const dy1 = oy0 - oy1;
      const dy2 = 1.0 - dy1;
      const yo0 = outputWidth * y;
      const yo1 = inputWidth * oy1;
      const yo2 = inputWidth * oy2;
      for (let x = 0; x < outputWidth; x++) {
        const ox0 = x * xF;
        const ox1 = ox0 | 0;
        const ox2 = ox1 === xMax ? ox1 : ox1 + 1;
        const dx1 = ox0 - ox1;
        const dx2 = 1.0 - dx1;
        output[yo0 + x] =
          (dy2 * ((dx2 * (input[yo1 + ox1] ?? 0)) + (dx1 * (input[yo1 + ox2] ?? 0))))
          + (dy1 * ((dx2 * (input[yo2 + ox1] ?? 0)) + (dx1 * (input[yo2 + ox2] ?? 0))));
      }
    }
    return output;
  }

  static rescaleGrayscaleS32(
    input: Int32Array,
    inputWidth: number,
    inputHeight: number,
    outputWidth: number,
    outputHeight: number,
  ): Int32Array {
    const output = new Int32Array(outputWidth * outputHeight);
    if (outputWidth === 1 && outputHeight === 1) { output[0] = input[0] ?? 0; return output; }
    const xF = (inputWidth - 1) / (outputWidth - 1 || 1);
    const yF = (inputHeight - 1) / (outputHeight - 1 || 1);
    const xMax = inputWidth - 1;
    const yMax = inputHeight - 1;
    for (let y = 0; y < outputHeight; y++) {
      const oy0 = y * yF;
      const oy1 = oy0 | 0;
      const oy2 = oy1 === yMax ? oy1 : oy1 + 1;
      const dy1 = oy0 - oy1;
      const dy2 = 1.0 - dy1;
      const yo0 = outputWidth * y;
      const yo1 = inputWidth * oy1;
      const yo2 = inputWidth * oy2;
      for (let x = 0; x < outputWidth; x++) {
        const ox0 = x * xF;
        const ox1 = ox0 | 0;
        const ox2 = ox1 === xMax ? ox1 : ox1 + 1;
        const dx1 = ox0 - ox1;
        const dx2 = 1.0 - dx1;
        output[yo0 + x] =
          (dy2 * ((dx2 * (input[yo1 + ox1] ?? 0)) + (dx1 * (input[yo1 + ox2] ?? 0))))
          + (dy1 * ((dx2 * (input[yo2 + ox1] ?? 0)) + (dx1 * (input[yo2 + ox2] ?? 0))));
      }
    }
    return output;
  }

  static rescaleGrayscaleU32(
    input: Uint32Array,
    inputWidth: number,
    inputHeight: number,
    outputWidth: number,
    outputHeight: number,
  ): Uint32Array {
    const output = new Uint32Array(outputWidth * outputHeight);
    if (outputWidth === 1 && outputHeight === 1) { output[0] = input[0] ?? 0; return output; }
    const xF = (inputWidth - 1) / (outputWidth - 1 || 1);
    const yF = (inputHeight - 1) / (outputHeight - 1 || 1);
    const xMax = inputWidth - 1;
    const yMax = inputHeight - 1;
    for (let y = 0; y < outputHeight; y++) {
      const oy0 = y * yF;
      const oy1 = oy0 | 0;
      const oy2 = oy1 === yMax ? oy1 : oy1 + 1;
      const dy1 = oy0 - oy1;
      const dy2 = 1.0 - dy1;
      const yo0 = outputWidth * y;
      const yo1 = inputWidth * oy1;
      const yo2 = inputWidth * oy2;
      for (let x = 0; x < outputWidth; x++) {
        const ox0 = x * xF;
        const ox1 = ox0 | 0;
        const ox2 = ox1 === xMax ? ox1 : ox1 + 1;
        const dx1 = ox0 - ox1;
        const dx2 = 1.0 - dx1;
        output[yo0 + x] =
          (dy2 * ((dx2 * (input[yo1 + ox1] ?? 0)) + (dx1 * (input[yo1 + ox2] ?? 0))))
          + (dy1 * ((dx2 * (input[yo2 + ox1] ?? 0)) + (dx1 * (input[yo2 + ox2] ?? 0))));
      }
    }
    return output;
  }

  /**
   * Rescale a 24-bit color image (3 bytes per pixel, RGB interleaved) using bilinear interpolation.
   */
  static rescaleColor24(
    input: Uint8Array,
    inputWidth: number,
    inputHeight: number,
    outputWidth: number,
    outputHeight: number,
  ): Uint8Array {
    const output = new Uint8Array(outputWidth * outputHeight * 3);
    if (outputWidth === 1 && outputHeight === 1) {
      output[0] = input[0] ?? 0; output[1] = input[1] ?? 0; output[2] = input[2] ?? 0;
      return output;
    }
    const xF = (inputWidth - 1) / (outputWidth - 1 || 1);
    const yF = (inputHeight - 1) / (outputHeight - 1 || 1);
    const xMax = inputWidth - 1;
    const yMax = inputHeight - 1;
    for (let y = 0; y < outputHeight; y++) {
      const oy0 = y * yF;
      const oy1 = oy0 | 0;
      const oy2 = oy1 === yMax ? oy1 : oy1 + 1;
      const dy1 = oy0 - oy1;
      const dy2 = 1.0 - dy1;
      const yo0 = outputWidth * y * 3;
      const yo1 = inputWidth * oy1 * 3;
      const yo2 = inputWidth * oy2 * 3;
      for (let x = 0, px = 0; x < outputWidth; x++) {
        const ox0 = x * xF;
        const ox1 = ox0 | 0;
        const ox2 = ox1 === xMax ? ox1 : ox1 + 1;
        const dx1 = ox0 - ox1;
        const dx2 = 1.0 - dx1;
        let x1 = ox1 * 3;
        let x2 = ox2 * 3;
        for (let c = 0; c < 3; c++, x1++, x2++, px++) {
          output[yo0 + px] =
            (dy2 * ((dx2 * (input[yo1 + x1] ?? 0)) + (dx1 * (input[yo1 + x2] ?? 0))))
            + (dy1 * ((dx2 * (input[yo2 + x1] ?? 0)) + (dx1 * (input[yo2 + x2] ?? 0))));
        }
      }
    }
    return output;
  }
}
