import type { Socket } from "node:net";
import { DicomAssociation } from "./DicomAssociation.js";
import { DicomService, type DicomServiceOptions } from "./DicomService.js";
import type { IDicomServer } from "./IDicomServer.js";
import { resolveDicomServerOptions, type DicomServerOptions, type ResolvedDicomServerOptions } from "./DicomServerOptions.js";
import type { INetworkListener } from "./INetworkListener.js";

export type DicomServiceFactory<TService extends DicomService = DicomService> = (
  socket: Socket,
  association: DicomAssociation,
  options: DicomServiceOptions,
) => TService;

export class DicomServer<TService extends DicomService = DicomService> implements IDicomServer {
  readonly options: Readonly<ResolvedDicomServerOptions>;

  private readonly serviceFactory: DicomServiceFactory<TService>;
  private readonly servicesBySocket = new Map<Socket, TService>();
  private listener: INetworkListener | null = null;
  private acceptLoopTask: Promise<void> | null = null;
  private hostValue: string;
  private portValue: number;
  private listeningValue = false;

  constructor(serviceFactory: DicomServiceFactory<TService>, options: DicomServerOptions = {}) {
    this.serviceFactory = serviceFactory;
    this.options = resolveDicomServerOptions(options);
    this.hostValue = this.options.host;
    this.portValue = this.options.port;
  }

  get isListening(): boolean {
    return this.listeningValue;
  }

  get host(): string {
    return this.hostValue;
  }

  get port(): number {
    return this.portValue;
  }

  get connectionCount(): number {
    return this.servicesBySocket.size;
  }

  async start(): Promise<void> {
    if (this.listeningValue) {
      return;
    }

    if (this.options.tls && !this.options.tlsAcceptor) {
      throw new Error("TLS is enabled but no tlsAcceptor is configured.");
    }

    const listener = this.options.networkManager.createNetworkListener(this.options.host, this.options.port, {
      tlsAcceptor: this.options.tlsAcceptor,
    });
    await listener.start(this.options.backlog);
    this.listener = listener;
    this.hostValue = listener.host;
    this.portValue = listener.port;
    this.listeningValue = true;
    this.acceptLoopTask = this.acceptLoop(listener).catch(() => {
      this.listeningValue = false;
    });
  }

  async stop(): Promise<void> {
    if (!this.listener) {
      return;
    }

    const listener = this.listener;
    this.listener = null;
    this.listeningValue = false;
    listener.stop();
    if (this.acceptLoopTask) {
      await this.acceptLoopTask;
    }
    this.acceptLoopTask = null;

    for (const socket of this.servicesBySocket.keys()) {
      if (!socket.destroyed) {
        socket.destroy();
      }
    }
    this.servicesBySocket.clear();
  }

  private async acceptLoop(listener: INetworkListener): Promise<void> {
    while (this.listeningValue) {
      const socket = await listener.acceptSocket({ noDelay: true });
      if (!socket) {
        return;
      }
      this.handleSocketConnection(socket);
    }
  }

  private handleSocketConnection(socket: Socket): void {
    try {
      const association = new DicomAssociation();
      const serviceOptions: DicomServiceOptions = {
        ...this.options.serviceOptions,
        socket,
      };
      const service = this.serviceFactory(socket, association, serviceOptions);
      if (!service.isSocketBound) {
        service.bindSocket(socket);
      }
      this.servicesBySocket.set(socket, service);
    } catch (error) {
      socket.destroy(error instanceof Error ? error : new Error(String(error)));
      return;
    }

    socket.on("close", () => {
      this.servicesBySocket.delete(socket);
    });
  }
}
