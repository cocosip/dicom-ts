import type { IDicomCodec } from "../IDicomCodec.js";
import { TranscoderManager } from "../TranscoderManager.js";
import type { IDicomCodecProvider } from "./IDicomCodecProvider.js";
import type { IDicomCodecRegistry } from "./IDicomCodecRegistry.js";
import type { ITransferSyntaxCapability } from "./ITransferSyntaxCapability.js";

class DefaultCodecRegistry implements IDicomCodecRegistry {
  private readonly providers = new Map<string, IDicomCodecProvider>();

  registerProvider(provider: IDicomCodecProvider): void {
    this.providers.set(provider.id, provider);
  }

  unregisterProvider(id: string): void {
    this.providers.delete(id);
  }

  resolveCodec(transferSyntaxUid: string): IDicomCodec | null {
    const ordered = Array.from(this.providers.values()).sort((a, b) => b.priority - a.priority);
    for (const provider of ordered) {
      if (!provider.supports(transferSyntaxUid)) {
        continue;
      }
      const codec = provider.getCodec(transferSyntaxUid);
      if (codec) {
        return codec;
      }
    }

    return TranscoderManager.tryGetCodec(transferSyntaxUid);
  }

  getCapabilities(): readonly ITransferSyntaxCapability[] {
    const items: ITransferSyntaxCapability[] = [];
    for (const provider of this.providers.values()) {
      items.push(...provider.listCapabilities());
    }
    return items;
  }

  listProviders(): readonly IDicomCodecProvider[] {
    return Array.from(this.providers.values());
  }
}

const registry = new DefaultCodecRegistry();

export function getDicomCodecRegistry(): IDicomCodecRegistry {
  return registry;
}

export function registerCodecProvider(provider: IDicomCodecProvider): void {
  registry.registerProvider(provider);
}

export function unregisterCodecProvider(id: string): void {
  registry.unregisterProvider(id);
}

export function resolveCodec(transferSyntaxUid: string): IDicomCodec | null {
  return registry.resolveCodec(transferSyntaxUid);
}

export function getCodecCapabilities(): readonly ITransferSyntaxCapability[] {
  return registry.getCapabilities();
}
