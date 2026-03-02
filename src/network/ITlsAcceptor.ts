import type { Server } from "node:net";
import type { Socket } from "node:net";

export interface ITlsAcceptor {
  createTlsServer(connectionListener: (socket: Socket) => void): Server;
}
