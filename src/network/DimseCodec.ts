import * as Tags from "../core/DicomTag.generated.js";
import { DicomTransferSyntax } from "../core/DicomTransferSyntax.js";
import { DicomDataset } from "../dataset/DicomDataset.js";
import { MemoryByteBuffer } from "../io/buffer/MemoryByteBuffer.js";
import { ByteBufferByteSource } from "../io/ByteBufferByteSource.js";
import { DicomReader } from "../io/reader/DicomReader.js";
import { DicomDatasetReaderObserver } from "../io/reader/DicomDatasetReaderObserver.js";
import { MemoryByteTarget } from "../io/MemoryByteTarget.js";
import { write as writeDataset } from "../io/writer/DicomDatasetExtensions.js";
import { DicomAssociation } from "./DicomAssociation.js";
import { DicomCEchoRequest } from "./DicomCEchoRequest.js";
import { DicomCEchoResponse } from "./DicomCEchoResponse.js";
import { DicomCFindRequest } from "./DicomCFindRequest.js";
import { DicomCFindResponse } from "./DicomCFindResponse.js";
import { DicomCGetRequest } from "./DicomCGetRequest.js";
import { DicomCGetResponse } from "./DicomCGetResponse.js";
import { DicomCMoveRequest } from "./DicomCMoveRequest.js";
import { DicomCMoveResponse } from "./DicomCMoveResponse.js";
import { DicomCommandField } from "./DicomCommandField.js";
import { DicomCStoreRequest } from "./DicomCStoreRequest.js";
import { DicomCStoreResponse } from "./DicomCStoreResponse.js";
import { DicomMessage } from "./DicomMessage.js";
import { DicomNActionRequest } from "./DicomNActionRequest.js";
import { DicomNActionResponse } from "./DicomNActionResponse.js";
import { DicomNCreateRequest } from "./DicomNCreateRequest.js";
import { DicomNCreateResponse } from "./DicomNCreateResponse.js";
import { DicomNDeleteRequest } from "./DicomNDeleteRequest.js";
import { DicomNDeleteResponse } from "./DicomNDeleteResponse.js";
import { DicomNEventReportRequest } from "./DicomNEventReportRequest.js";
import { DicomNEventReportResponse } from "./DicomNEventReportResponse.js";
import { DicomNGetRequest } from "./DicomNGetRequest.js";
import { DicomNGetResponse } from "./DicomNGetResponse.js";
import { DicomNSetRequest } from "./DicomNSetRequest.js";
import { DicomNSetResponse } from "./DicomNSetResponse.js";
import { DicomPresentationContext, DicomPresentationContextResult } from "./DicomPresentationContext.js";
import { DicomRequest } from "./DicomRequest.js";
import { DicomResponse } from "./DicomResponse.js";
import { PDV, PDataTF } from "./PDU.js";

const DEFAULT_MAX_PDU_LENGTH = 16 * 1024;
const PDU_OVERHEAD_BYTES = 12;

interface DimseAssemblyContext {
  commandChunks: Uint8Array<ArrayBufferLike>[];
  dataChunks: Uint8Array<ArrayBufferLike>[];
  message: DicomMessage | null;
}

export interface DimseDecoderState {
  readonly contexts: Map<number, DimseAssemblyContext>;
}

export function createDimseDecoderState(): DimseDecoderState {
  return {
    contexts: new Map<number, DimseAssemblyContext>(),
  };
}

export function encodeDimseMessage(
  association: DicomAssociation,
  message: DicomMessage,
  maxPduLength: number = association.maximumPDULength > 0 ? association.maximumPDULength : DEFAULT_MAX_PDU_LENGTH,
): PDataTF[] {
  const presentationContext = resolvePresentationContext(association, message);
  const contextId = presentationContext.id;
  const payloadLimit = Math.max(1, maxPduLength - PDU_OVERHEAD_BYTES);
  const pdus: PDataTF[] = [];

  const commandBytes = serializeDataset(message.command, DicomTransferSyntax.ImplicitVRLittleEndian);
  appendPdvs(pdus, contextId, commandBytes, true, payloadLimit);

  if (message.hasDataset) {
    const syntax = resolveTransferSyntax(presentationContext);
    const dataset = message.dataset ?? new DicomDataset();
    const datasetBytes = serializeDataset(dataset, syntax);
    appendPdvs(pdus, contextId, datasetBytes, false, payloadLimit);
  }

  return pdus;
}

export function decodePDataTF(
  association: DicomAssociation,
  state: DimseDecoderState,
  pDataTf: PDataTF,
): DicomMessage[] {
  const messages: DicomMessage[] = [];

  for (const pdv of pDataTf.pdvs) {
    const context = getOrCreateAssemblyContext(state, pdv.contextId);
    const targetChunks = pdv.isCommand ? context.commandChunks : context.dataChunks;
    targetChunks.push(Uint8Array.from(pdv.value));

    if (!pdv.isLastFragment) {
      continue;
    }

    if (pdv.isCommand) {
      const command = deserializeDataset(concatChunks(context.commandChunks), DicomTransferSyntax.ImplicitVRLittleEndian);
      context.commandChunks = [];
      const message = createMessageFromCommand(command);
      const presentationContext = association.presentationContexts.get(pdv.contextId);
      if (presentationContext) {
        message.presentationContext = presentationContext;
      }
      context.message = message;

      if (!message.hasDataset) {
        messages.push(message);
        state.contexts.delete(pdv.contextId);
      }
      continue;
    }

    const message = context.message;
    if (!message) {
      throw new Error(`Received DIMSE dataset fragment without command fragment (context=${pdv.contextId}).`);
    }

    const datasetSyntax = resolveTransferSyntaxForContext(association, pdv.contextId);
    message.dataset = deserializeDataset(concatChunks(context.dataChunks), datasetSyntax);
    context.dataChunks = [];
    messages.push(message);
    state.contexts.delete(pdv.contextId);
  }

  return messages;
}

function appendPdvs(
  pdus: PDataTF[],
  contextId: number,
  bytes: Uint8Array,
  isCommand: boolean,
  payloadLimit: number,
): void {
  if (bytes.length === 0) {
    pdus.push(new PDataTF([new PDV(contextId, new Uint8Array(0), isCommand, true)]));
    return;
  }

  let offset = 0;
  while (offset < bytes.length) {
    const nextOffset = Math.min(offset + payloadLimit, bytes.length);
    const fragment = bytes.slice(offset, nextOffset);
    const isLast = nextOffset >= bytes.length;
    pdus.push(new PDataTF([new PDV(contextId, fragment, isCommand, isLast)]));
    offset = nextOffset;
  }
}

function resolvePresentationContext(association: DicomAssociation, message: DicomMessage): DicomPresentationContext {
  if (message.presentationContext) {
    return message.presentationContext;
  }

  const sopClassUid = message.sopClassUID?.uid;
  if (!sopClassUid) {
    throw new Error(`Cannot resolve presentation context for ${message.toString()}: missing SOP class UID.`);
  }

  for (const context of association.presentationContexts) {
    if (context.abstractSyntax.uid === sopClassUid && context.result === DicomPresentationContextResult.Accept) {
      message.presentationContext = context;
      return context;
    }
  }

  for (const context of association.presentationContexts) {
    if (context.abstractSyntax.uid === sopClassUid) {
      message.presentationContext = context;
      return context;
    }
  }

  throw new Error(`No presentation context found for SOP class ${sopClassUid}.`);
}

function resolveTransferSyntax(context: DicomPresentationContext): DicomTransferSyntax {
  return context.acceptedTransferSyntax
    ?? context.getTransferSyntaxes()[0]
    ?? DicomTransferSyntax.ImplicitVRLittleEndian;
}

function resolveTransferSyntaxForContext(association: DicomAssociation, contextId: number): DicomTransferSyntax {
  const context = association.presentationContexts.get(contextId);
  if (!context) {
    return DicomTransferSyntax.ImplicitVRLittleEndian;
  }
  return resolveTransferSyntax(context);
}

function serializeDataset(dataset: DicomDataset, syntax: DicomTransferSyntax): Uint8Array {
  const target = new MemoryByteTarget();
  writeDataset(dataset, target, syntax);
  return target.toBuffer();
}

function deserializeDataset(bytes: Uint8Array, syntax: DicomTransferSyntax): DicomDataset {
  const dataset = new DicomDataset();
  if (bytes.length === 0) {
    return dataset;
  }

  const source = new ByteBufferByteSource([new MemoryByteBuffer(bytes)]);
  const observer = new DicomDatasetReaderObserver(dataset);
  const reader = new DicomReader();
  reader.read(source, observer, { transferSyntax: syntax });
  return dataset;
}

function getOrCreateAssemblyContext(state: DimseDecoderState, contextId: number): DimseAssemblyContext {
  const existing = state.contexts.get(contextId);
  if (existing) {
    return existing;
  }

  const created: DimseAssemblyContext = {
    commandChunks: [],
    dataChunks: [],
    message: null,
  };
  state.contexts.set(contextId, created);
  return created;
}

function concatChunks(chunks: readonly Uint8Array<ArrayBufferLike>[]): Uint8Array {
  if (chunks.length === 0) {
    return new Uint8Array(0);
  }

  let total = 0;
  for (const chunk of chunks) {
    total += chunk.length;
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  return merged;
}

function createMessageFromCommand(command: DicomDataset): DicomMessage {
  const commandField = command.getSingleValueOrDefault<number>(Tags.CommandField, 0) as DicomCommandField;

  switch (commandField) {
    case DicomCommandField.CEchoRequest:
      return new DicomCEchoRequest(command);
    case DicomCommandField.CEchoResponse:
      return new DicomCEchoResponse(command);
    case DicomCommandField.CStoreRequest:
      return new DicomCStoreRequest(command);
    case DicomCommandField.CStoreResponse:
      return new DicomCStoreResponse(command);
    case DicomCommandField.CFindRequest:
      return new DicomCFindRequest(command);
    case DicomCommandField.CFindResponse:
      return new DicomCFindResponse(command);
    case DicomCommandField.CGetRequest:
      return new DicomCGetRequest(command);
    case DicomCommandField.CGetResponse:
      return new DicomCGetResponse(command);
    case DicomCommandField.CMoveRequest:
      return new DicomCMoveRequest(command);
    case DicomCommandField.CMoveResponse:
      return new DicomCMoveResponse(command);
    case DicomCommandField.NActionRequest:
      return new DicomNActionRequest(command);
    case DicomCommandField.NActionResponse:
      return new DicomNActionResponse(command);
    case DicomCommandField.NCreateRequest:
      return new DicomNCreateRequest(command);
    case DicomCommandField.NCreateResponse:
      return new DicomNCreateResponse(command);
    case DicomCommandField.NDeleteRequest:
      return new DicomNDeleteRequest(command);
    case DicomCommandField.NDeleteResponse:
      return new DicomNDeleteResponse(command);
    case DicomCommandField.NEventReportRequest:
      return new DicomNEventReportRequest(command);
    case DicomCommandField.NEventReportResponse:
      return new DicomNEventReportResponse(command);
    case DicomCommandField.NGetRequest:
      return new DicomNGetRequest(command);
    case DicomCommandField.NGetResponse:
      return new DicomNGetResponse(command);
    case DicomCommandField.NSetRequest:
      return new DicomNSetRequest(command);
    case DicomCommandField.NSetResponse:
      return new DicomNSetResponse(command);
    default:
      // Unknown commands are still represented as a generic DIMSE message.
      return new DicomMessage(command);
  }
}

export function isDimseResponse(message: DicomMessage): message is DicomResponse {
  return message instanceof DicomResponse;
}

export function isDimseRequest(message: DicomMessage): message is DicomRequest {
  return message instanceof DicomRequest;
}
