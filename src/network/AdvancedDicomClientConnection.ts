import { DicomAssociation } from "./DicomAssociation.js";
import { DicomClientConnection } from "./DicomClientConnection.js";
import type { DicomClientOptions } from "./DicomClientOptions.js";
import { DicomRequest } from "./DicomRequest.js";
import { DicomResponse } from "./DicomResponse.js";
import { DicomAbortReason, DicomAbortSource } from "./PDU.js";

export interface AdvancedDicomClientConnectionOpenOptions {
  host: string;
  port: number;
  callingAE: string;
  calledAE: string;
  association?: DicomAssociation;
  clientOptions?: DicomClientOptions;
}

export class AdvancedDicomClientConnection {
  readonly connection: DicomClientConnection;

  private constructor(connection: DicomClientConnection) {
    this.connection = connection;
  }

  get association(): DicomAssociation {
    return this.connection.association;
  }

  get isAssociationEstablished(): boolean {
    return this.connection.isAssociationEstablished;
  }

  static async open(options: AdvancedDicomClientConnectionOpenOptions): Promise<AdvancedDicomClientConnection> {
    const connection = await DicomClientConnection.connect(options);
    return new AdvancedDicomClientConnection(connection);
  }

  async requestAssociation(timeoutMs?: number): Promise<void> {
    await this.connection.requestAssociation(timeoutMs);
  }

  async sendRequest(request: DicomRequest, timeoutMs?: number): Promise<readonly DicomResponse[]> {
    return await this.connection.sendRequestAndWait(request, timeoutMs);
  }

  async releaseAssociation(timeoutMs?: number): Promise<void> {
    await this.connection.releaseAssociation(timeoutMs);
  }

  async abort(
    source: DicomAbortSource = DicomAbortSource.ServiceUser,
    reason: DicomAbortReason = DicomAbortReason.NotSpecified,
  ): Promise<void> {
    await this.connection.abort(source, reason);
  }

  async close(): Promise<void> {
    await this.connection.close();
  }
}
