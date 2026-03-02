import type { Server, Socket } from "node:net";
import { createSecureContext, createServer as createTlsServer, type SecureContextOptions, type TlsOptions } from "node:tls";
import type { ITlsAcceptor } from "./ITlsAcceptor.js";

export interface DefaultTlsAcceptorOptions {
  handshakeTimeoutMs?: number;
  requireMutualAuthentication?: boolean;
  tlsOptions: SecureContextOptions & {
    key?: string | Buffer | Array<string | Buffer>;
    cert?: string | Buffer | Array<string | Buffer>;
    pfx?: string | Buffer | Array<string | Buffer | { buf: string | Buffer; passphrase?: string }>;
    passphrase?: string;
    ca?: string | Buffer | Array<string | Buffer>;
  };
}

const DEFAULT_TLS_HANDSHAKE_TIMEOUT_MS = 60_000;

export class DefaultTlsAcceptor implements ITlsAcceptor {
  readonly handshakeTimeoutMs: number;
  readonly requireMutualAuthentication: boolean;
  private readonly options: DefaultTlsAcceptorOptions["tlsOptions"];

  constructor(options: DefaultTlsAcceptorOptions) {
    if (!options || !options.tlsOptions) {
      throw new Error("DefaultTlsAcceptor requires tlsOptions containing certificate material.");
    }

    const hasCertificate = !!(options.tlsOptions.cert || options.tlsOptions.pfx);
    if (!hasCertificate) {
      throw new Error("DefaultTlsAcceptor requires cert or pfx in tlsOptions.");
    }

    this.options = { ...options.tlsOptions };
    this.handshakeTimeoutMs = options.handshakeTimeoutMs ?? DEFAULT_TLS_HANDSHAKE_TIMEOUT_MS;
    this.requireMutualAuthentication = options.requireMutualAuthentication ?? false;
  }

  createTlsServer(connectionListener: (socket: Socket) => void): Server {
    const secureContext = createSecureContext(this.options);
    const tlsOptions: TlsOptions = {
      ...this.options,
      secureContext,
      requestCert: this.requireMutualAuthentication,
      rejectUnauthorized: this.requireMutualAuthentication,
      handshakeTimeout: this.handshakeTimeoutMs,
    };

    const server = createTlsServer(tlsOptions, (socket) => {
      connectionListener(socket);
    });

    return server;
  }
}
