// JPEG codec family (Phase 10.5)

// Codec parameters
export { DicomJpegParams, DicomJpegSampleFactor } from "./DicomJpegParams.js";

// Baseline Process 1 — pure TypeScript built-in implementation
export { DicomJpegProcess1Codec } from "./baseline/DicomJpegProcess1Codec.js";

// Extended Process 2 & 4 — pure TypeScript built-in implementation (8-bit and 12-bit)
export { DicomJpegProcess2_4Codec } from "./extended/DicomJpegProcess2_4Codec.js";

// Lossless Process 14 – all predictors (built-in)
export { DicomJpegProcess14Codec } from "./lossless/DicomJpegProcess14Codec.js";

// Lossless Process 14 SV1 – predictor 1 (built-in)
export { DicomJpegProcess14SV1Codec } from "./lossless14sv1/DicomJpegProcess14SV1Codec.js";

export type { LosslessEncodeOptions } from "./common/JpegProcess14Common.js";

// Adapter plug-in types for Baseline / Extended codecs
export type { DicomJpegFrameContext, DicomJpegAdapter } from "./common/DicomJpegAdapter.js";
