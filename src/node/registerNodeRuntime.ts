import { deflateRawSync, inflateRawSync, inflateSync } from "node:zlib";
import { registerDeflateCodec } from "../io/deflateRegistry.js";

let registered = false;

export function registerNodeRuntime(): void {
  if (registered) {
    return;
  }

  registerDeflateCodec({
    inflateRaw: (data) => inflateRawSync(data),
    inflate: (data) => inflateSync(data),
    deflateRaw: (data) => deflateRawSync(data),
  });

  registered = true;
}
