import { hostname, networkInterfaces } from "node:os";
import { DicomImplementation } from "../core/DicomImplementation.js";
import { DicomUID } from "../core/DicomUID.js";
import { DesktopNetworkListener } from "./DesktopNetworkListener.js";
import { DesktopNetworkStream } from "./DesktopNetworkStream.js";
import { NetworkManager, type NetworkListenerCreationOptions, type SocketExceptionInfo } from "./NetworkManager.js";
import type { INetworkListener } from "./INetworkListener.js";
import type { INetworkStream } from "./INetworkStream.js";
import type { NetworkStreamCreationOptions } from "./NetworkStreamCreationOptions.js";
import type { Socket } from "node:net";

/**
 * Node.js implementation of platform network manager.
 */
export class DesktopNetworkManager extends NetworkManager {
  protected createNetworkListenerImpl(
    ipAddress: string,
    port: number,
    options: NetworkListenerCreationOptions,
  ): INetworkListener {
    return new DesktopNetworkListener(ipAddress, port, options.tlsAcceptor ?? null);
  }

  protected async createNetworkStreamImpl(options: NetworkStreamCreationOptions): Promise<INetworkStream> {
    return await DesktopNetworkStream.connect(options);
  }

  protected createNetworkStreamFromSocketImpl(socket: Socket, ownsSocket: boolean): INetworkStream {
    return new DesktopNetworkStream(socket, ownsSocket);
  }

  protected isSocketExceptionImpl(error: unknown): SocketExceptionInfo | null {
    if (typeof error !== "object" || error === null) {
      return null;
    }

    const candidate = error as NodeJS.ErrnoException;
    if (!candidate.code) {
      return null;
    }

    return {
      errorCode: typeof candidate.errno === "number" ? candidate.errno : -1,
      errorDescriptor: candidate.code,
    };
  }

  protected tryGetNetworkIdentifierImpl(): DicomUID | null {
    const interfaces = networkInterfaces();
    for (const entries of Object.values(interfaces)) {
      if (!entries) {
        continue;
      }

      for (const entry of entries) {
        if (entry.internal) {
          continue;
        }

        const mac = (entry.mac ?? "").replace(/[^0-9a-fA-F]/g, "");
        if (!mac || /^0+$/.test(mac)) {
          continue;
        }

        try {
          return DicomUID.append(DicomImplementation.ClassUID, BigInt(`0x${mac}`));
        } catch {
          // continue next candidate
        }
      }
    }

    return null;
  }

  protected get machineNameImpl(): string {
    return hostname();
  }
}

export const desktopNetworkManager = new DesktopNetworkManager();
NetworkManager.register("desktop", desktopNetworkManager);
NetworkManager.setCurrentPlatform("desktop");
