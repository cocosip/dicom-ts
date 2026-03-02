import type { Socket } from "node:net";

/**
 * Platform-agnostic wrapper for one connected transport socket.
 */
export interface INetworkStream {
  readonly remoteHost: string;
  readonly localHost: string;
  readonly remotePort: number;
  readonly localPort: number;
  asSocket(): Socket;
  close(): void;
}
