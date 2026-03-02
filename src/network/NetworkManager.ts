import type { Socket } from "node:net";
import type { DicomUID } from "../core/DicomUID.js";
import type { ITlsAcceptor } from "./ITlsAcceptor.js";
import type { INetworkListener } from "./INetworkListener.js";
import type { INetworkStream } from "./INetworkStream.js";
import type { NetworkStreamCreationOptions } from "./NetworkStreamCreationOptions.js";

export interface NetworkListenerCreationOptions {
  tlsAcceptor?: ITlsAcceptor | null;
}

export interface SocketExceptionInfo {
  errorCode: number;
  errorDescriptor: string;
}

/**
 * Platform-registered abstraction for transport primitives.
 */
export abstract class NetworkManager {
  static readonly IPv4Any = "0.0.0.0";
  static readonly IPv6Any = "::";
  static readonly IPv4Loopback = "127.0.0.1";
  static readonly IPv6Loopback = "::1";

  private static readonly registry = new Map<string, NetworkManager>();
  private static currentPlatform: string | null = null;

  static register(platform: string, manager: NetworkManager): void {
    const key = platform.trim().toLowerCase();
    if (!key) {
      throw new Error("Network platform name cannot be empty.");
    }
    NetworkManager.registry.set(key, manager);
    if (!NetworkManager.currentPlatform) {
      NetworkManager.currentPlatform = key;
    }
  }

  static setCurrentPlatform(platform: string): void {
    const key = platform.trim().toLowerCase();
    if (!NetworkManager.registry.has(key)) {
      throw new Error(`NetworkManager platform "${platform}" is not registered.`);
    }
    NetworkManager.currentPlatform = key;
  }

  static getCurrent(): NetworkManager {
    const key = NetworkManager.currentPlatform;
    if (!key) {
      throw new Error("No NetworkManager platform is registered.");
    }
    const manager = NetworkManager.registry.get(key);
    if (!manager) {
      throw new Error(`Registered NetworkManager platform "${key}" is not available.`);
    }
    return manager;
  }

  createNetworkListener(
    ipAddress: string,
    port: number,
    options: NetworkListenerCreationOptions = {},
  ): INetworkListener {
    return this.createNetworkListenerImpl(ipAddress, port, options);
  }

  async createNetworkStream(options: NetworkStreamCreationOptions): Promise<INetworkStream> {
    return await this.createNetworkStreamImpl(options);
  }

  createNetworkStreamFromSocket(socket: Socket, ownsSocket: boolean): INetworkStream {
    return this.createNetworkStreamFromSocketImpl(socket, ownsSocket);
  }

  isSocketException(error: unknown): SocketExceptionInfo | null {
    return this.isSocketExceptionImpl(error);
  }

  tryGetNetworkIdentifier(): DicomUID | null {
    return this.tryGetNetworkIdentifierImpl();
  }

  get machineName(): string {
    return this.machineNameImpl;
  }

  protected abstract createNetworkListenerImpl(
    ipAddress: string,
    port: number,
    options: NetworkListenerCreationOptions,
  ): INetworkListener;

  protected abstract createNetworkStreamImpl(options: NetworkStreamCreationOptions): Promise<INetworkStream>;

  protected abstract createNetworkStreamFromSocketImpl(socket: Socket, ownsSocket: boolean): INetworkStream;

  protected abstract isSocketExceptionImpl(error: unknown): SocketExceptionInfo | null;

  protected abstract tryGetNetworkIdentifierImpl(): DicomUID | null;

  protected abstract get machineNameImpl(): string;
}
