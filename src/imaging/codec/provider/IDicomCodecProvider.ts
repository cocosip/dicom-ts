import type { IDicomCodec } from "../IDicomCodec.js";
import type { ITransferSyntaxCapability } from "./ITransferSyntaxCapability.js";

export interface IDicomCodecProvider {
  readonly id: string;
  readonly priority: number;
  supports(transferSyntaxUid: string): boolean;
  getCodec(transferSyntaxUid: string): IDicomCodec | null;
  listCapabilities(): readonly ITransferSyntaxCapability[];
}
