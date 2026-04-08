import type { Server, Socket } from "node:net";
import { DicomAssociation } from "./DicomAssociation.js";
import { DicomServerRegistry } from "./DicomServerRegistry.js";
import type { DicomServerRegistration } from "./DicomServerRegistration.js";
import { DicomService, type DicomServiceOptions } from "./DicomService.js";
import type { IDicomServer } from "./IDicomServer.js";
import { closeServer, listenServer, waitForServerClose } from "./nodeTransport.js";
import { resolveDicomServerOptions, type DicomServerOptions, type ResolvedDicomServerOptions } from "./DicomServerOptions.js";

export type DicomServiceFactory<TService extends DicomService = DicomService> = (
  socket: Socket,
  association: DicomAssociation,
  options: DicomServiceOptions,
) => TService;

export class DicomServer<TService extends DicomService = DicomService> implements IDicomServer {
  readonly options: Readonly<ResolvedDicomServerOptions>;

  private readonly serviceFactory: DicomServiceFactory<TService>;
  private readonly servicesBySocket = new Map<Socket, TService>();
  private server: Server | null = null;
  private closeTask: Promise<void> | null = null;
  private hostValue: string;
  private portValue: number;
  private listeningValue = false;
  private registrationValue: DicomServerRegistration | null = null;

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

  get registration(): DicomServerRegistration | null {
    return this.registrationValue;
  }

  async start(): Promise<void> {
    if (this.listeningValue) {
      return;
    }

    if (this.options.tls && !this.options.tlsAcceptor) {
      throw new Error("TLS is enabled but no tlsAcceptor is configured.");
    }

    if (this.options.port > 0 && !DicomServerRegistry.isAvailable(this.options.port, this.options.host)) {
      throw new Error(`There is already a DICOM server registered for ${this.options.host}:${this.options.port}.`);
    }

    const server = await listenServer(this.options.host, this.options.port, {
      backlog: this.options.backlog,
      tlsAcceptor: this.options.tlsAcceptor,
      connectionListener: (socket) => this.handleSocketConnection(socket),
    });

    const address = server.address();
    const boundHost = address && typeof address !== "string" ? address.address : this.options.host;
    const boundPort = address && typeof address !== "string" ? address.port : this.options.port;
    if (!DicomServerRegistry.isAvailable(boundPort, boundHost)) {
      await closeServer(server);
      throw new Error(`There is already a DICOM server registered for ${boundHost}:${boundPort}.`);
    }

    this.server = server;
    this.hostValue = boundHost;
    this.portValue = boundPort;
    this.listeningValue = true;
    const closeTask = waitForServerClose(server)
      .finally(() => {
        this.listeningValue = false;
        if (this.server === server) {
          this.server = null;
        }
        this.unregisterFromRegistry();
      });
    this.closeTask = closeTask;
    this.registrationValue = DicomServerRegistry.register(this, closeTask);
  }

  async stop(): Promise<void> {
    if (!this.server) {
      this.unregisterFromRegistry();
      return;
    }

    const server = this.server;
    this.server = null;
    this.listeningValue = false;
    const closeTask = this.closeTask;
    this.closeTask = null;
    server.close();

    for (const socket of this.servicesBySocket.keys()) {
      if (!socket.destroyed) {
        socket.destroy();
      }
    }
    this.servicesBySocket.clear();
    if (closeTask) {
      await closeTask;
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

  private unregisterFromRegistry(): void {
    const registration = this.registrationValue;
    if (!registration) {
      return;
    }
    this.registrationValue = null;
    registration.dispose();
  }
}
