import { createServer, Socket, type Server } from "node:net";
import type { ITlsAcceptor } from "./ITlsAcceptor.js";
import type { ITlsInitiator } from "./ITlsInitiator.js";

export interface ConnectSocketOptions {
  host: string;
  port: number;
  tlsInitiator?: ITlsInitiator | null;
  noDelay?: boolean;
  timeoutMs?: number;
  connectionTimeoutMs?: number;
}

export interface ListenServerOptions {
  backlog?: number;
  tlsAcceptor?: ITlsAcceptor | null;
  connectionListener?: (socket: Socket) => void;
}

export async function connectSocket(options: ConnectSocketOptions): Promise<Socket> {
  const timeoutMs = Math.max(1, options.connectionTimeoutMs ?? 10_000);
  const socket = options.tlsInitiator
    ? await options.tlsInitiator.initiateTls(options.host, options.port, timeoutMs)
    : await openSocket(options.host, options.port, timeoutMs);

  socket.setNoDelay(options.noDelay ?? true);
  if ((options.timeoutMs ?? 0) > 0) {
    socket.setTimeout(options.timeoutMs ?? 0);
  }

  return socket;
}

export async function listenServer(
  host: string,
  port: number,
  options: ListenServerOptions = {},
): Promise<Server> {
  const server = options.tlsAcceptor
    ? options.tlsAcceptor.createTlsServer((socket) => options.connectionListener?.(socket))
    : createServer((socket) => options.connectionListener?.(socket));

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    if (options.backlog === undefined) {
      server.listen(port, host, () => {
        server.off("error", reject);
        resolve();
      });
      return;
    }

    server.listen(port, host, options.backlog, () => {
      server.off("error", reject);
      resolve();
    });
  });

  return server;
}

export async function closeServer(server: Server): Promise<void> {
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
}

export async function waitForServerClose(server: Server): Promise<void> {
  await new Promise<void>((resolve) => {
    server.once("close", () => resolve());
  });
}

async function openSocket(host: string, port: number, timeoutMs: number): Promise<Socket> {
  return await new Promise<Socket>((resolve, reject) => {
    const socket = new Socket();

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
    socket.connect({ host, port });
  });
}
