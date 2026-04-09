import type { IDicomCodec } from "../IDicomCodec.js";
import type { IDicomCodecProvider } from "./IDicomCodecProvider.js";
import type { ITransferSyntaxCapability } from "./ITransferSyntaxCapability.js";

export interface IDicomCodecRegistry {
  registerProvider(provider: IDicomCodecProvider): void;
  unregisterProvider(id: string): void;
  resolveCodec(transferSyntaxUid: string): IDicomCodec | null;
  getCapabilities(): readonly ITransferSyntaxCapability[];
  listProviders(): readonly IDicomCodecProvider[];
}
