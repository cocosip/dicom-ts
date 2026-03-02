export type {
  DicomJpegSampleFactor,
  DicomJpegCodecParameters,
  DicomJpegBaselineParameters,
  DicomJpegExtendedParameters,
  DicomJpegFrameContext,
} from "./common/JpegBaselineExtendedCommon.js";
export type { IDicomJpegBaselineAdapter } from "./baseline/index.js";
export type { IDicomJpegExtendedAdapter } from "./extended/index.js";

// Transfer-syntax scoped namespaces (one transfer syntax => one codec entrypoint).
export { DicomJpegProcess1Codec, DicomJpegProcess1Codec as JpegBaselineCodec } from "./baseline/index.js";
export { DicomJpegProcess2_4Codec, DicomJpegProcess2_4Codec as JpegExtendedCodec } from "./extended/index.js";
export { DicomJpegProcess14Codec, DicomJpegProcess14Codec as JpegLosslessCodec } from "./lossless/index.js";
export {
  DicomJpegProcess14SV1Codec,
  DicomJpegProcess14SV1Codec as JpegLossless14SV1Codec,
} from "./lossless14sv1/index.js";
