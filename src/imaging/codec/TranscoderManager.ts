import { DicomTransferSyntax } from "../../core/DicomTransferSyntax.js";
import type { IDicomCodec } from "./IDicomCodec.js";

export class TranscoderManager {
  private static readonly codecs = new Map<string, IDicomCodec>();

  static register(codec: IDicomCodec): void {
    TranscoderManager.codecs.set(codec.transferSyntax.uid.uid, codec);
  }

  static unregister(transferSyntax: DicomTransferSyntax | string): void {
    const uid = typeof transferSyntax === "string" ? transferSyntax : transferSyntax.uid.uid;
    TranscoderManager.codecs.delete(uid);
  }

  static getCodec(transferSyntax: DicomTransferSyntax | string): IDicomCodec | null {
    const uid = typeof transferSyntax === "string" ? transferSyntax : transferSyntax.uid.uid;
    return TranscoderManager.codecs.get(uid) ?? null;
  }
}
