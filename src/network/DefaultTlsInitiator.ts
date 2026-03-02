import type { Socket } from "node:net";
import { isIP } from "node:net";
import { connect as connectTls, type ConnectionOptions } from "node:tls";
import type { ITlsInitiator } from "./ITlsInitiator.js";

export interface DefaultTlsInitiatorOptions {
  ignoreCertificateErrors?: boolean;
  handshakeTimeoutMs?: number;
  connectionOptions?: Omit<ConnectionOptions, "host" | "port">;
}

const DEFAULT_TLS_HANDSHAKE_TIMEOUT_MS = 60_000;

export class DefaultTlsInitiator implements ITlsInitiator {
  readonly ignoreCertificateErrors: boolean;
  readonly handshakeTimeoutMs: number;
  readonly connectionOptions: Omit<ConnectionOptions, "host" | "port">;

  constructor(options: DefaultTlsInitiatorOptions = {}) {
    this.ignoreCertificateErrors = options.ignoreCertificateErrors ?? false;
    this.handshakeTimeoutMs = options.handshakeTimeoutMs ?? DEFAULT_TLS_HANDSHAKE_TIMEOUT_MS;
    this.connectionOptions = { ...(options.connectionOptions ?? {}) };
  }

  async initiateTls(remoteHost: string, remotePort: number, timeoutMs: number): Promise<Socket> {
    const effectiveTimeout = Math.max(1, timeoutMs || this.handshakeTimeoutMs || DEFAULT_TLS_HANDSHAKE_TIMEOUT_MS);
    const rejectUnauthorized = this.ignoreCertificateErrors
      ? false
      : (this.connectionOptions.rejectUnauthorized ?? true);

    return await new Promise<Socket>((resolve, reject) => {
      const resolvedServerName = this.connectionOptions.servername
        ?? (isIP(remoteHost) === 0 ? remoteHost : undefined);
      const socket = connectTls({
        ...this.connectionOptions,
        host: remoteHost,
        port: remotePort,
        servername: resolvedServerName,
        rejectUnauthorized,
      });

      const timeout = setTimeout(() => {
        socket.destroy();
        reject(new Error(`TLS client handshake timed out after ${effectiveTimeout} ms.`));
      }, effectiveTimeout);

      const cleanup = (): void => {
        clearTimeout(timeout);
        socket.off("secureConnect", onSecureConnect);
        socket.off("error", onError);
      };

      const onSecureConnect = (): void => {
        cleanup();
        resolve(socket);
      };

      const onError = (error: Error): void => {
        cleanup();
        reject(error);
      };

      socket.once("secureConnect", onSecureConnect);
      socket.once("error", onError);
    });
  }
}
