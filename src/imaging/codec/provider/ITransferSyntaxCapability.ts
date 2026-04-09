export type TransferSyntaxOperation = "encode" | "decode" | "transcode";

export interface ITransferSyntaxCapability {
  readonly transferSyntaxUid: string;
  readonly operations: readonly TransferSyntaxOperation[];
  readonly lossy?: boolean;
}
