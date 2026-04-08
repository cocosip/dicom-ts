import { connect, createServer, type Server, type Socket } from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import type { ITlsAcceptor } from "../../src/network/index.js";
import { connectSocket, listenServer } from "../../src/network/nodeTransport.js";

class PassthroughTlsAcceptor implements ITlsAcceptor {
  called = false;

  createTlsServer(connectionListener: (socket: Socket) => void): Server {
    this.called = true;
    return createServer(connectionListener);
  }
}

describe("nodeTransport helpers", () => {
  const sockets: Socket[] = [];
  const servers: Server[] = [];

  afterEach(async () => {
    for (const socket of sockets.splice(0, sockets.length)) {
      if (!socket.destroyed) {
        socket.destroy();
      }
    }
    while (servers.length > 0) {
      await closeServer(servers.pop()!);
    }
  });

  it("creates native node servers through a thin internal helper", async () => {
    const acceptedPromise = new Promise<Socket>((resolve) => {
      void resolve;
    });
    void acceptedPromise;
    let accepted: Socket | null = null;
    const server = await listenServer("127.0.0.1", 0, {
      connectionListener: (socket) => {
        accepted = socket;
        sockets.push(socket);
      },
    });
    servers.push(server);

    const port = getPort(server);
    const client = connect({
      host: "127.0.0.1",
      port,
    });
    sockets.push(client);
    await onceConnect(client);
    await delay(20);

    expect(accepted).not.toBeNull();
    expect(accepted?.remotePort).toBe(client.localPort);
    expect(accepted?.localPort).toBe(port);
  });

  it("creates outbound sockets through a thin internal helper", async () => {
    const server = createServer((socket) => {
      sockets.push(socket);
    });
    servers.push(server);
    await listen(server);

    const port = getPort(server);
    const socket = await connectSocket({
      host: "127.0.0.1",
      port,
      noDelay: true,
      connectionTimeoutMs: 2_000,
    });
    sockets.push(socket);

    expect(socket.remotePort).toBe(port);
    expect(socket.localPort).toBeGreaterThan(0);
  });

  it("surfaces connection failures from connectSocket", async () => {
    const port = await reserveFreePort();

    await expect(connectSocket({
      host: "127.0.0.1",
      port,
      noDelay: true,
      connectionTimeoutMs: 200,
    })).rejects.toThrow();
  });

  it("uses the tlsAcceptor branch when listenServer is configured for TLS", async () => {
    const tlsAcceptor = new PassthroughTlsAcceptor();
    const server = await listenServer("127.0.0.1", 0, {
      tlsAcceptor,
    });
    servers.push(server);

    expect(tlsAcceptor.called).toBe(true);
    expect(getPort(server)).toBeGreaterThan(0);
  });
});

async function onceConnect(socket: Socket): Promise<void> {
  if (!socket.connecting) {
    return;
  }
  await new Promise<void>((resolve, reject) => {
    socket.once("connect", () => resolve());
    socket.once("error", reject);
  });
}

async function listen(server: Server): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      resolve();
    });
  });
}

async function closeServer(server: Server): Promise<void> {
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
}

async function delay(ms: number): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function getPort(server: Server): number {
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Server is not bound to a TCP port.");
  }
  return address.port;
}

async function reserveFreePort(): Promise<number> {
  const server = createServer();
  await listen(server);

  const port = getPort(server);
  await closeServer(server);
  return port;
}
