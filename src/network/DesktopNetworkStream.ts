import { connect, type Socket } from "node:net";
import type { INetworkStream } from "./INetworkStream.js";
import type { NetworkStreamCreationOptions } from "./NetworkStreamCreationOptions.js";

const DEFAULT_CONNECT_TIMEOUT_MS = 10_000;

/**
 * Node.js implementation of INetworkStream backed by net.Socket.
 */
export class DesktopNetworkStream implements INetworkStream {
  constructor(
    private readonly socket: Socket,
    private readonly ownsSocket: boolean,
  ) {}

  static async connect(options: NetworkStreamCreationOptions): Promise<DesktopNetworkStream> {
    const timeoutMs = Math.max(1, options.connectionTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS);
    const socket = options.tlsInitiator
      ? await options.tlsInitiator.initiateTls(options.host, options.port, timeoutMs)
      : await openSocket(options.host, options.port, timeoutMs);

    socket.setNoDelay(options.noDelay ?? true);
    if ((options.timeoutMs ?? 0) > 0) {
      socket.setTimeout(options.timeoutMs ?? 0);
    }

    return new DesktopNetworkStream(socket, true);
  }

  get remoteHost(): string {
    return this.socket.remoteAddress ?? "";
  }

  get localHost(): string {
    return this.socket.localAddress ?? "";
  }

  get remotePort(): number {
    return this.socket.remotePort ?? 0;
  }

  get localPort(): number {
    return this.socket.localPort ?? 0;
  }

  asSocket(): Socket {
    return this.socket;
  }

  close(): void {
    if (!this.ownsSocket) {
      return;
    }
    if (!this.socket.destroyed) {
      this.socket.destroy();
    }
  }
}

async function openSocket(host: string, port: number, timeoutMs: number): Promise<Socket> {
  return await new Promise<Socket>((resolve, reject) => {
    const socket = connect({ host, port });

    const timeout = setTimeout(() => {
      socket.destroy();
      reject(new Error(`Timed out connecting to ${host}:${port} (${timeoutMs} ms).`));
    }, timeoutMs);

    const cleanup = (): void => {
      clearTimeout(timeout);
      socket.off("connect", onConnect);
      socket.off("error", onError);
    };

    const onConnect = (): void => {
      cleanup();
      resolve(socket);
    };

    const onError = (error: Error): void => {
      cleanup();
      reject(error);
    };

    socket.once("connect", onConnect);
    socket.once("error", onError);
  });
}
