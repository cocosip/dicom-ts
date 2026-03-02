import { DicomAssociation } from "./DicomAssociation.js";
import { DicomClient } from "./DicomClient.js";
import { DicomClientConnection, type DicomClientConnectionOpenOptions } from "./DicomClientConnection.js";
import type { DicomClientOptions } from "./DicomClientOptions.js";

export class DicomClientFactory {
  static create(options: DicomClientOptions = {}): DicomClient {
    return new DicomClient(options);
  }

  static async createConnection(options: DicomClientConnectionOpenOptions): Promise<DicomClientConnection> {
    return await DicomClientConnection.connect(options);
  }

  static createAssociation(callingAE: string, calledAE: string): DicomAssociation {
    return new DicomAssociation(callingAE, calledAE);
  }
}
