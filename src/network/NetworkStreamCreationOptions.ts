import type { ITlsInitiator } from "./ITlsInitiator.js";

/**
 * Parameters used to open one outbound transport stream.
 */
export interface NetworkStreamCreationOptions {
  host: string;
  port: number;
  tlsInitiator?: ITlsInitiator | null;
  noDelay?: boolean;
  timeoutMs?: number;
  connectionTimeoutMs?: number;
  receiveBufferSize?: number;
  sendBufferSize?: number;
}
