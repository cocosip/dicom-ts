import { TranscoderManager } from "../TranscoderManager.js";
import type { IDicomCodec } from "../IDicomCodec.js";
import type { IDicomCodecProvider } from "./IDicomCodecProvider.js";
import type { ITransferSyntaxCapability } from "./ITransferSyntaxCapability.js";
import { registerCodecProvider } from "./DicomCodecRegistry.js";

const WEB_UIDS = [
  "1.2.840.10008.1.2.5", // RLE Lossless
  "1.2.840.10008.1.2.4.57", // JPEG Lossless Process 14
  "1.2.840.10008.1.2.4.70", // JPEG Lossless SV1
  "1.2.840.10008.1.2.4.80", // JPEG-LS Lossless
  "1.2.840.10008.1.2.4.81", // JPEG-LS Near-Lossless
];

let webRegistered = false;
let nodeRegistered = false;

export function registerWebCodecProviders(): void {
  if (webRegistered) {
    return;
  }
  registerCodecProvider(new FilteredProvider("web-default-codec-provider", 100, WEB_UIDS));
  webRegistered = true;
}

export function registerNodeCodecProviders(): void {
  if (nodeRegistered) {
    return;
  }
  registerCodecProvider(new AllCodecsProvider("node-default-codec-provider", 10));
  nodeRegistered = true;
}

export function registerNativeCodecProviders(): void {
  // Placeholder for external package `dicom-ts-codec-native`.
}

class FilteredProvider implements IDicomCodecProvider {
  constructor(
    readonly id: string,
    readonly priority: number,
    private readonly supportedUids: readonly string[],
  ) {}

  supports(transferSyntaxUid: string): boolean {
    return this.supportedUids.includes(transferSyntaxUid);
  }

  getCodec(transferSyntaxUid: string): IDicomCodec | null {
    if (!this.supports(transferSyntaxUid)) {
      return null;
    }
    return TranscoderManager.tryGetCodec(transferSyntaxUid);
  }

  listCapabilities(): readonly ITransferSyntaxCapability[] {
    return this.supportedUids.map((uid) => ({
      transferSyntaxUid: uid,
      operations: ["encode", "decode", "transcode"],
    }));
  }
}

class AllCodecsProvider implements IDicomCodecProvider {
  constructor(readonly id: string, readonly priority: number) {}

  supports(transferSyntaxUid: string): boolean {
    return TranscoderManager.tryGetCodec(transferSyntaxUid) !== null;
  }

  getCodec(transferSyntaxUid: string): IDicomCodec | null {
    return TranscoderManager.tryGetCodec(transferSyntaxUid);
  }

  listCapabilities(): readonly ITransferSyntaxCapability[] {
    const allKnownUids = [
      "1.2.840.10008.1.2.5",
      "1.2.840.10008.1.2.4.50",
      "1.2.840.10008.1.2.4.51",
      "1.2.840.10008.1.2.4.57",
      "1.2.840.10008.1.2.4.70",
      "1.2.840.10008.1.2.4.80",
      "1.2.840.10008.1.2.4.81",
      "1.2.840.10008.1.2.4.90",
      "1.2.840.10008.1.2.4.91",
      "1.2.840.10008.1.2.4.92",
      "1.2.840.10008.1.2.4.93",
    ];
    return allKnownUids.filter((uid) => this.supports(uid)).map((uid) => ({
      transferSyntaxUid: uid,
      operations: ["encode", "decode", "transcode"],
    }));
  }
}
