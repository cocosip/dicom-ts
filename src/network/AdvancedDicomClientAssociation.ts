import { DicomRequest } from "./DicomRequest.js";
import { DicomResponse } from "./DicomResponse.js";
import { AdvancedDicomClientConnection, type AdvancedDicomClientConnectionOpenOptions } from "./AdvancedDicomClientConnection.js";

export class AdvancedDicomClientAssociation {
  readonly connection: AdvancedDicomClientConnection;
  private readonly queuedRequests: DicomRequest[] = [];

  private constructor(connection: AdvancedDicomClientConnection) {
    this.connection = connection;
  }

  static async open(options: AdvancedDicomClientConnectionOpenOptions): Promise<AdvancedDicomClientAssociation> {
    const connection = await AdvancedDicomClientConnection.open(options);
    return new AdvancedDicomClientAssociation(connection);
  }

  addRequest(request: DicomRequest): void {
    this.queuedRequests.push(request);
  }

  async sendRequest(request: DicomRequest, timeoutMs?: number): Promise<readonly DicomResponse[]> {
    return await this.connection.sendRequest(request, timeoutMs);
  }

  async sendQueuedRequests(timeoutMs?: number): Promise<Map<number, readonly DicomResponse[]>> {
    const results = new Map<number, readonly DicomResponse[]>();
    const requests = [...this.queuedRequests];
    this.queuedRequests.length = 0;

    for (const request of requests) {
      const responses = await this.connection.sendRequest(request, timeoutMs);
      results.set(request.messageID, responses);
    }
    return results;
  }

  async release(timeoutMs?: number): Promise<void> {
    await this.connection.releaseAssociation(timeoutMs);
  }

  async close(): Promise<void> {
    await this.connection.close();
  }
}
