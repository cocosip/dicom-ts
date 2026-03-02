// JPEG codec family (Phase 10.5)

// Codec parameters
export { DicomJpegParams, DicomJpegSampleFactor } from "./DicomJpegParams.js";

// Baseline Process 1 (plugin-path)
export { DicomJpegProcess1Codec } from "./baseline/DicomJpegProcess1Codec.js";

// Extended Process 2 & 4 (plugin-path)
export { DicomJpegProcess2_4Codec } from "./extended/DicomJpegProcess2_4Codec.js";

// Lossless Process 14 – all predictors (built-in)
export { DicomJpegProcess14Codec } from "./lossless/DicomJpegProcess14Codec.js";

// Lossless Process 14 SV1 – predictor 1 (built-in)
export { DicomJpegProcess14SV1Codec } from "./lossless14sv1/DicomJpegProcess14SV1Codec.js";

// Shared adapter types
export type {
  DicomJpegAdapter,
  DicomJpegFrameContext,
} from "./common/JpegBaselineExtendedCommon.js";

export type { LosslessEncodeOptions } from "./common/JpegProcess14Common.js";
