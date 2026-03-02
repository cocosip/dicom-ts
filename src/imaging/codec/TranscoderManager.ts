import { DicomTransferSyntax } from "../../core/DicomTransferSyntax.js";
import type { IDicomCodec } from "./IDicomCodec.js";
import type { ITranscoderManager } from "./ITranscoderManager.js";
import { DicomRleCodec } from "./rle/index.js";

function syntaxUid(transferSyntax: DicomTransferSyntax | string): string {
  return typeof transferSyntax === "string" ? transferSyntax : transferSyntax.uid.uid;
}

/**
 * Abstract manager for codec discovery and transfer syntax mapping.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Codec/TranscoderManager.cs
 */
export abstract class TranscoderManager implements ITranscoderManager {
  protected readonly codecs = new Map<string, IDicomCodec>();
  private static defaultManager: DefaultTranscoderManager | null = null;

  hasCodec(syntax: DicomTransferSyntax): boolean {
    return this.codecs.has(syntax.uid.uid);
  }

  canTranscode(inSyntax: DicomTransferSyntax, outSyntax: DicomTransferSyntax): boolean {
    return (!inSyntax.isEncapsulated || this.hasCodec(inSyntax))
      && (!outSyntax.isEncapsulated || this.hasCodec(outSyntax));
  }

  getCodec(syntax: DicomTransferSyntax): IDicomCodec {
    const codec = this.codecs.get(syntax.uid.uid);
    if (!codec) {
      throw new Error(`No codec registered for transfer syntax: ${syntax.uid.uid}`);
    }
    return codec;
  }

  // TypeScript extension: allow runtime codec registration for plugins/tests.
  register(codec: IDicomCodec): void {
    this.codecs.set(codec.transferSyntax.uid.uid, codec);
  }

  // TypeScript extension: allow runtime codec unregistration for plugins/tests.
  unregister(transferSyntax: DicomTransferSyntax | string): void {
    this.codecs.delete(syntaxUid(transferSyntax));
  }

  tryGetCodec(transferSyntax: DicomTransferSyntax | string): IDicomCodec | null {
    return this.codecs.get(syntaxUid(transferSyntax)) ?? null;
  }

  abstract loadCodecs(path?: string | null, search?: string | null): void;

  static hasCodec(syntax: DicomTransferSyntax): boolean {
    return TranscoderManager.getManager().hasCodec(syntax);
  }

  static canTranscode(inSyntax: DicomTransferSyntax, outSyntax: DicomTransferSyntax): boolean {
    return TranscoderManager.getManager().canTranscode(inSyntax, outSyntax);
  }

  static getCodec(syntax: DicomTransferSyntax): IDicomCodec {
    return TranscoderManager.getManager().getCodec(syntax);
  }

  static tryGetCodec(transferSyntax: DicomTransferSyntax | string): IDicomCodec | null {
    return TranscoderManager.getManager().tryGetCodec(transferSyntax);
  }

  static register(codec: IDicomCodec): void {
    TranscoderManager.getManager().register(codec);
  }

  static unregister(transferSyntax: DicomTransferSyntax | string): void {
    TranscoderManager.getManager().unregister(transferSyntax);
  }

  static loadCodecs(path?: string | null, search?: string | null): void {
    TranscoderManager.getManager().loadCodecs(path, search);
  }

  static setManager(manager: DefaultTranscoderManager): void {
    TranscoderManager.defaultManager = manager;
  }

  static getManager(): DefaultTranscoderManager {
    if (!TranscoderManager.defaultManager) {
      TranscoderManager.defaultManager = new DefaultTranscoderManager();
    }
    return TranscoderManager.defaultManager;
  }
}

/**
 * Default manager implementation used by the library runtime.
 *
 * Reference: fo-dicom/FO-DICOM.Core/Imaging/Codec/DefaultTranscoderManager.cs
 */
export class DefaultTranscoderManager extends TranscoderManager {
  constructor() {
    super();
    this.loadCodecs();
  }

  override loadCodecs(_path: string | null = null, _search: string | null = null): void {
    this.register(new DicomRleCodec());
  }
}
