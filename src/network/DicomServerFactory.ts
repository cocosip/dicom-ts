import { DicomAssociation } from "./DicomAssociation.js";
import { DicomCEchoProvider } from "./DicomCEchoProvider.js";
import { DicomServer, type DicomServiceFactory } from "./DicomServer.js";
import { DicomService, type DicomServiceOptions } from "./DicomService.js";
import type { IDicomServer } from "./IDicomServer.js";
import type { DicomServerOptions } from "./DicomServerOptions.js";

export type DicomServiceConstructor<TService extends DicomService> = new (
  association?: DicomAssociation,
  options?: DicomServiceOptions,
) => TService;

export class DicomServerFactory {
  static create<TService extends DicomService>(
    serviceFactory: DicomServiceFactory<TService>,
    options: DicomServerOptions = {},
  ): IDicomServer {
    return new DicomServer(serviceFactory, options);
  }

  static createForService<TService extends DicomService>(
    serviceCtor: DicomServiceConstructor<TService>,
    options: DicomServerOptions = {},
  ): IDicomServer {
    return new DicomServer((_socket, association, serviceOptions) => new serviceCtor(association, serviceOptions), options);
  }

  static createCEchoServer(options: DicomServerOptions = {}): IDicomServer {
    return this.createForService(DicomCEchoProvider, options);
  }
}
