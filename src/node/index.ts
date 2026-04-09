import { registerNodeRuntime } from "./registerNodeRuntime.js";
import { registerNodeImaging, registerNodeSharedImageOperations } from "./registerNodeImaging.js";
import { registerNodeCodecProviders } from "../imaging/codec/provider/registerBuiltins.js";

registerNodeRuntime();
registerNodeImaging();
registerNodeCodecProviders();

export * from "../index.js";
export * from "../network/index.js";
export * from "./fileAdapters.js";
export { registerNodeRuntime } from "./registerNodeRuntime.js";
export { registerNodeImaging } from "./registerNodeImaging.js";
export {
  registerNodeSharedImageOperations,
  registerNodeSharpImageOperations,
  setNodeImageOperationMode,
  getNodeImageOperationMode,
} from "./registerNodeImaging.js";
export type { NodeImageOperationMode, RegisterNodeSharpImageOptions } from "./registerNodeImaging.js";
