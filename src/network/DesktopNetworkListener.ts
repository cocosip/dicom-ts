import { createServer, type Server, type Socket } from "node:net";
import type { AcceptSocketOptions, INetworkListener } from "./INetworkListener.js";
import type { ITlsAcceptor } from "./ITlsAcceptor.js";

interface SocketWaiter {
  resolve: (socket: Socket | null) => void;
  options: AcceptSocketOptions;
}

/**
 * Node.js implementation of INetworkListener.
 */
export class DesktopNetworkListener implements INetworkListener {
  private readonly queuedSockets: Socket[] = [];
  private readonly waiters: SocketWaiter[] = [];
  private server: Server | null = null;
  private started = false;
  private stopping = false;
  private boundHost: string;
  private boundPort = -1;

  constructor(
    private readonly hostValue: string,
    private readonly portValue: number,
    private readonly tlsAcceptor: ITlsAcceptor | null = null,
  ) {
    this.boundHost = hostValue;
  }

  get host(): string {
    return this.boundHost;
  }

  get port(): number {
    return this.boundPort;
  }

  async start(backlog = 128): Promise<void> {
    if (this.started) {
      return;
    }

    this.stopping = false;
    const server = this.tlsAcceptor
      ? this.tlsAcceptor.createTlsServer((socket) => this.handleIncomingSocket(socket))
      : createServer((socket) => this.handleIncomingSocket(socket));
    this.server = server;

    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(this.portValue, this.hostValue, backlog, () => {
        server.off("error", reject);
        resolve();
      });
    });

    const address = server.address();
    if (address && typeof address !== "string") {
      this.boundHost = address.address;
      this.boundPort = address.port;
    } else {
      this.boundHost = this.hostValue;
      this.boundPort = this.portValue;
    }

    this.started = true;
  }

  stop(): void {
    if (!this.started || this.stopping) {
      return;
    }

    this.stopping = true;
    this.started = false;

    for (const waiter of this.waiters.splice(0, this.waiters.length)) {
      waiter.resolve(null);
    }

    for (const socket of this.queuedSockets.splice(0, this.queuedSockets.length)) {
      if (!socket.destroyed) {
        socket.destroy();
      }
    }

    if (this.server) {
      const server = this.server;
      this.server = null;
      server.close();
    }
  }

  async acceptSocket(options: AcceptSocketOptions = {}): Promise<Socket | null> {
    if (!this.started) {
      return null;
    }

    const socket = this.queuedSockets.shift();
    if (socket) {
      configureAcceptedSocket(socket, options);
      return socket;
    }

    if (this.stopping) {
      return null;
    }

    return await new Promise<Socket | null>((resolve) => {
      const waiter: SocketWaiter = { resolve, options };
      this.waiters.push(waiter);

      if (!options.signal) {
        return;
      }

      if (options.signal.aborted) {
        removeWaiter(this.waiters, waiter);
        resolve(null);
        return;
      }

      const onAbort = (): void => {
        options.signal?.removeEventListener("abort", onAbort);
        removeWaiter(this.waiters, waiter);
        resolve(null);
      };
      options.signal.addEventListener("abort", onAbort, { once: true });
    });
  }

  private handleIncomingSocket(socket: Socket): void {
    if (this.stopping) {
      socket.destroy();
      return;
    }

    const waiter = this.waiters.shift();
    if (!waiter) {
      this.queuedSockets.push(socket);
      return;
    }

    configureAcceptedSocket(socket, waiter.options);
    waiter.resolve(socket);
  }
}

function configureAcceptedSocket(socket: Socket, options: AcceptSocketOptions): void {
  socket.setNoDelay(options.noDelay ?? true);
  // Node.js Socket does not expose direct receive/send buffer size setters across platforms.
  void options.receiveBufferSize;
  void options.sendBufferSize;
}

function removeWaiter(waiters: SocketWaiter[], target: SocketWaiter): void {
  const index = waiters.indexOf(target);
  if (index >= 0) {
    waiters.splice(index, 1);
  }
}
