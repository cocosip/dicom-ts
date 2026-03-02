import type { Socket } from "node:net";

export interface ITlsInitiator {
  initiateTls(remoteHost: string, remotePort: number, timeoutMs: number): Promise<Socket>;
}
