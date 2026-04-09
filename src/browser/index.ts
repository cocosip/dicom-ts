import { registerWebImageEncoders } from "../imaging/runtime/registerBuiltins.js";
import { registerWebCodecProviders } from "../imaging/codec/provider/registerBuiltins.js";

registerWebImageEncoders();
registerWebCodecProviders();

export * from "../core/index.js";
export * from "../logging/index.js";
export * from "../dataset/index.js";
export * from "../serialization/index.js";
export * from "../imaging/index.js";
export * from "../printing/index.js";

export { DicomFileMetaInformation } from "../DicomFileMetaInformation.js";
export { DicomFileFormat } from "../DicomFileFormat.js";

export * from "./io.js";
export * from "./fileAdapters.js";
export * from "../runtime/index.js";
