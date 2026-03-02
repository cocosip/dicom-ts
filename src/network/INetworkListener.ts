import type { Socket } from "node:net";

export interface AcceptSocketOptions {
  noDelay?: boolean;
  receiveBufferSize?: number;
  sendBufferSize?: number;
  signal?: AbortSignal;
}

/**
 * Platform-agnostic listener abstraction used by DICOM server.
 */
export interface INetworkListener {
  readonly host: string;
  readonly port: number;
  start(backlog?: number): Promise<void>;
  stop(): void;
  acceptSocket(options?: AcceptSocketOptions): Promise<Socket | null>;
}
