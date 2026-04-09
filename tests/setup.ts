import { registerNodeRuntime } from "../src/node/registerNodeRuntime.js";
import { registerNodeImaging } from "../src/node/registerNodeImaging.js";
import { registerNodeCodecProviders } from "../src/imaging/codec/provider/registerBuiltins.js";

registerNodeRuntime();
registerNodeImaging();
registerNodeCodecProviders();
