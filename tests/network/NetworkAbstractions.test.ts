import { connect, createServer, type Server, type Socket } from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import {
  DesktopNetworkManager,
  NetworkManager,
  type INetworkListener,
  type INetworkStream,
} from "../../src/network/index.js";

describe("Network abstractions", () => {
  const listeners: INetworkListener[] = [];
  const streams: INetworkStream[] = [];
  const sockets: Socket[] = [];
  const servers: Server[] = [];

  afterEach(async () => {
    for (const stream of streams.splice(0, streams.length)) {
      stream.close();
    }
    for (const socket of sockets.splice(0, sockets.length)) {
      if (!socket.destroyed) {
        socket.destroy();
      }
    }
    for (const listener of listeners.splice(0, listeners.length)) {
      listener.stop();
    }
    while (servers.length > 0) {
      await closeServer(servers.pop()!);
    }
  });

  it("provides DesktopNetworkManager as current registered platform", () => {
    const manager = NetworkManager.getCurrent();
    expect(manager).toBeInstanceOf(DesktopNetworkManager);
    expect(manager.machineName.length).toBeGreaterThan(0);
    expect(() => manager.tryGetNetworkIdentifier()).not.toThrow();
  });

  it("supports listener accept and stream wrapping", async () => {
    const manager = NetworkManager.getCurrent();
    const listener = manager.createNetworkListener("127.0.0.1", 0);
    listeners.push(listener);
    await listener.start();

    const acceptPromise = listener.acceptSocket({ noDelay: true });
    const client = connect({
      host: "127.0.0.1",
      port: listener.port,
    });
    sockets.push(client);
    await onceConnect(client);

    const accepted = await acceptPromise;
    expect(accepted).not.toBeNull();
    sockets.push(accepted!);

    const wrapped = manager.createNetworkStreamFromSocket(accepted!, false);
    streams.push(wrapped);
    expect(wrapped.remotePort).toBe(client.localPort);
    expect(wrapped.localPort).toBe(listener.port);
  });

  it("creates outbound stream via NetworkStreamCreationOptions", async () => {
    const manager = NetworkManager.getCurrent();
    const server = createServer((socket) => {
      sockets.push(socket);
    });
    servers.push(server);
    await listen(server);

    const port = getPort(server);
    const stream = await manager.createNetworkStream({
      host: "127.0.0.1",
      port,
      noDelay: true,
      connectionTimeoutMs: 2_000,
    });
    streams.push(stream);

    expect(stream.remotePort).toBe(port);
    expect(stream.localPort).toBeGreaterThan(0);
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

function getPort(server: Server): number {
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Server is not bound to a TCP port.");
  }
  return address.port;
}
