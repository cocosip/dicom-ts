import * as DicomUIDs from "../core/DicomUID.generated.js";
import { DicomImplementation } from "../core/DicomImplementation.js";
import { DicomTransferSyntax } from "../core/DicomTransferSyntax.js";
import { DicomUID, DicomUidType } from "../core/DicomUID.js";
import { DicomAssociation } from "./DicomAssociation.js";
import { DicomExtendedNegotiation } from "./DicomExtendedNegotiation.js";
import { DicomPresentationContext, DicomPresentationContextResult } from "./DicomPresentationContext.js";
import { DicomServiceApplicationInfo } from "./DicomServiceApplicationInfo.js";
import { DicomUserIdentityNegotiation, DicomUserIdentityType } from "./DicomUserIdentityNegotiation.js";

const DEFAULT_MAX_PDU_LENGTH = 16 * 1024;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export enum RawPduType {
  A_ASSOCIATE_RQ = 0x01,
  A_ASSOCIATE_AC = 0x02,
  A_ASSOCIATE_RJ = 0x03,
  P_DATA_TF = 0x04,
  A_RELEASE_RQ = 0x05,
  A_RELEASE_RP = 0x06,
  A_ABORT = 0x07,
}

/**
 * Binary helper for reading/writing one PDU payload with a DICOM PDU common header.
 */
export class RawPDU {
  static readonly CommonFieldsLength = 6;

  readonly type: RawPduType;
  private readonly payload: number[];
  private readOffset = 0;
  private readonly length16Stack: number[] = [];

  constructor(type: RawPduType);
  constructor(type: RawPduType, payload: Uint8Array);
  constructor(type: RawPduType, payload?: Uint8Array) {
    this.type = type;
    this.payload = payload ? [...payload] : [];
  }

  static fromBytes(buffer: Uint8Array, offset = 0): { raw: RawPDU; bytesRead: number } {
    if (offset < 0 || offset + RawPDU.CommonFieldsLength > buffer.length) {
      throw new Error("Insufficient bytes for PDU common header.");
    }

    const type = buffer[offset] as RawPduType;
    const length = readUint32BE(buffer, offset + 2);
    const total = RawPDU.CommonFieldsLength + length;
    if (offset + total > buffer.length) {
      throw new Error(`PDU payload exceeds input buffer length (length=${length}).`);
    }

    const payload = buffer.slice(offset + RawPDU.CommonFieldsLength, offset + total);
    return { raw: new RawPDU(type, payload), bytesRead: total };
  }

  get length(): number {
    return this.payload.length;
  }

  get position(): number {
    return this.readOffset;
  }

  reset(): void {
    this.readOffset = 0;
  }

  toBytes(): Uint8Array {
    const bytes = new Uint8Array(RawPDU.CommonFieldsLength + this.payload.length);
    bytes[0] = this.type;
    bytes[1] = 0x00;
    writeUint32BE(bytes, 2, this.payload.length);
    bytes.set(this.payload, RawPDU.CommonFieldsLength);
    return bytes;
  }

  readByte(name = "byte"): number {
    this.ensureReadable(1, name);
    return this.payload[this.readOffset++] ?? 0;
  }

  readBytes(count: number, name = "bytes"): Uint8Array {
    this.ensureReadable(count, name);
    const value = new Uint8Array(this.payload.slice(this.readOffset, this.readOffset + count));
    this.readOffset += count;
    return value;
  }

  readUInt16(name = "uint16"): number {
    this.ensureReadable(2, name);
    const value = (this.payload[this.readOffset]! << 8) | this.payload[this.readOffset + 1]!;
    this.readOffset += 2;
    return value >>> 0;
  }

  readUInt32(name = "uint32"): number {
    this.ensureReadable(4, name);
    const value = (
      (this.payload[this.readOffset]! * 0x1000000)
      + ((this.payload[this.readOffset + 1]! << 16) >>> 0)
      + (this.payload[this.readOffset + 2]! << 8)
      + this.payload[this.readOffset + 3]!
    ) >>> 0;
    this.readOffset += 4;
    return value;
  }

  readString(byteCount: number, name = "string", trim = true): string {
    const bytes = this.readBytes(byteCount, name);
    const value = decoder.decode(bytes);
    return trim ? value.replace(/[\u0000 ]+$/g, "") : value;
  }

  skipBytes(count: number, name = "skip"): void {
    this.ensureReadable(count, name);
    this.readOffset += count;
  }

  writeByte(value: number): void {
    this.payload.push(value & 0xff);
  }

  writeBytes(value: Uint8Array | readonly number[]): void {
    for (const b of value) {
      this.payload.push(b & 0xff);
    }
  }

  writeUInt16(value: number): void {
    this.payload.push((value >>> 8) & 0xff, value & 0xff);
  }

  writeUInt32(value: number): void {
    this.payload.push(
      (value >>> 24) & 0xff,
      (value >>> 16) & 0xff,
      (value >>> 8) & 0xff,
      value & 0xff,
    );
  }

  writeString(value: string): void {
    this.writeBytes(encoder.encode(value));
  }

  writePaddedString(value: string, count: number, pad = " "): void {
    this.writeString(value.substring(0, Math.min(value.length, count)).padEnd(count, pad));
  }

  markLength16(): void {
    this.length16Stack.push(this.payload.length);
    this.writeUInt16(0);
  }

  writeLength16(): void {
    const marker = this.length16Stack.pop();
    if (marker === undefined) {
      throw new Error("Length marker stack is empty.");
    }
    const length = this.payload.length - marker - 2;
    if (length < 0 || length > 0xffff) {
      throw new Error(`Invalid 16-bit length value: ${length}`);
    }
    this.payload[marker] = (length >>> 8) & 0xff;
    this.payload[marker + 1] = length & 0xff;
  }

  private ensureReadable(bytes: number, name: string): void {
    if (this.readOffset + bytes > this.payload.length) {
      throw new Error(`Read out of range for "${name}" (offset=${this.readOffset}, bytes=${bytes}, length=${this.payload.length}).`);
    }
  }
}

export interface PDU {
  readonly type: RawPduType;
  write(): Uint8Array;
  read(raw: RawPDU): void;
}

export class AAssociateRQ implements PDU {
  readonly type = RawPduType.A_ASSOCIATE_RQ;

  constructor(readonly association: DicomAssociation = new DicomAssociation()) {}

  write(): Uint8Array {
    const raw = new RawPDU(this.type);
    raw.writeUInt16(0x0001);
    raw.writeUInt16(0x0000);
    raw.writePaddedString(this.association.calledAE, 16, " ");
    raw.writePaddedString(this.association.callingAE, 16, " ");
    raw.writeBytes(new Uint8Array(32));

    writeItem(raw, 0x10, () => {
      raw.writeString(DicomUIDs.DICOMApplicationContext.uid);
    });

    for (const pc of this.association.presentationContexts) {
      writeItem(raw, 0x20, () => {
        raw.writeByte(pc.id);
        raw.writeBytes([0x00, 0x00, 0x00]);

        writeItem(raw, 0x30, () => {
          raw.writeString(pc.abstractSyntax.uid);
        });

        for (const ts of pc.getTransferSyntaxes()) {
          writeItem(raw, 0x40, () => {
            raw.writeString(ts.uid.uid);
          });
        }
      });
    }

    writeItem(raw, 0x50, () => {
      writeItem(raw, 0x51, () => {
        raw.writeUInt32(this.association.maximumPDULength > 0 ? this.association.maximumPDULength : DEFAULT_MAX_PDU_LENGTH);
      });

      writeItem(raw, 0x52, () => {
        raw.writeString(DicomImplementation.ClassUID.uid);
      });

      if (this.association.maxAsyncOpsInvoked !== 1 || this.association.maxAsyncOpsPerformed !== 1) {
        writeItem(raw, 0x53, () => {
          raw.writeUInt16(this.association.maxAsyncOpsInvoked);
          raw.writeUInt16(this.association.maxAsyncOpsPerformed);
        });
      }

      for (const pc of this.association.presentationContexts) {
        if (pc.userRole === null && pc.providerRole === null) {
          continue;
        }
        writeItem(raw, 0x54, () => {
          raw.markLength16();
          raw.writeString(pc.abstractSyntax.uid);
          raw.writeLength16();
          raw.writeByte(pc.userRole ? 1 : 0);
          raw.writeByte(pc.providerRole ? 1 : 0);
        });
      }

      writeItem(raw, 0x55, () => {
        raw.writeString(DicomImplementation.Version);
      });

      for (const ext of this.association.extendedNegotiations) {
        const requestedInfo = ext.requestedApplicationInfo;
        if (!requestedInfo || requestedInfo.count === 0) {
          continue;
        }
        writeItem(raw, 0x56, () => {
          raw.markLength16();
          raw.writeString(ext.sopClassUid.uid);
          raw.writeLength16();
          raw.writeBytes(requestedInfo.getValues());
        });
      }

      for (const ext of this.association.extendedNegotiations) {
        const serviceClassUid = ext.serviceClassUid;
        if (!serviceClassUid) {
          continue;
        }
        writeItem(raw, 0x57, () => {
          raw.markLength16();
          raw.writeString(ext.sopClassUid.uid);
          raw.writeLength16();
          raw.markLength16();
          raw.writeString(serviceClassUid.uid);
          raw.writeLength16();
          raw.markLength16();
          for (const related of ext.relatedGeneralSopClasses) {
            raw.markLength16();
            raw.writeString(related.uid);
            raw.writeLength16();
          }
          raw.writeLength16();
        });
      }

      const userIdentity = this.association.userIdentityNegotiation;
      if (userIdentity && userIdentity.userIdentityType !== null) {
        userIdentity.validate();
        writeItem(raw, 0x58, () => {
          raw.writeByte(userIdentity.userIdentityType ?? 0);
          raw.writeByte(userIdentity.positiveResponseRequested ? 1 : 0);
          raw.markLength16();
          raw.writeString(userIdentity.primaryField ?? "");
          raw.writeLength16();
          raw.markLength16();
          raw.writeString(userIdentity.secondaryField ?? "");
          raw.writeLength16();
        });
      }
    });

    return raw.toBytes();
  }

  read(raw: RawPDU): void {
    raw.reset();
    raw.readUInt16("Version");
    raw.skipBytes(2, "Reserved");
    this.association.calledAE = raw.readString(16, "Called AE");
    this.association.callingAE = raw.readString(16, "Calling AE");
    raw.skipBytes(32, "Reserved");

    while (raw.position < raw.length) {
      const itemType = raw.readByte("Item-Type");
      raw.skipBytes(1, "Reserved");
      const itemLength = raw.readUInt16("Item-Length");
      const itemEnd = raw.position + itemLength;

      if (itemType === 0x10) {
        raw.skipBytes(itemLength, "Application Context");
      } else if (itemType === 0x20) {
        this.readPresentationContextRequest(raw, itemEnd);
      } else if (itemType === 0x50) {
        this.readUserInformation(raw, itemEnd);
      } else {
        raw.skipBytes(itemLength, "Unknown Item");
      }
    }
  }

  private readPresentationContextRequest(raw: RawPDU, itemEnd: number): void {
    const id = raw.readByte("Presentation Context ID");
    raw.skipBytes(3, "Reserved");

    let abstractSyntax: DicomUID | null = null;
    const transferSyntaxes: DicomTransferSyntax[] = [];

    while (raw.position < itemEnd) {
      const subType = raw.readByte("Presentation Context Item-Type");
      raw.skipBytes(1, "Reserved");
      const subLength = raw.readUInt16("Presentation Context Item-Length");

      if (subType === 0x30) {
        abstractSyntax = DicomUID.parse(raw.readString(subLength, "Abstract Syntax UID"));
      } else if (subType === 0x40) {
        transferSyntaxes.push(DicomTransferSyntax.parse(raw.readString(subLength, "Transfer Syntax UID")));
      } else {
        raw.skipBytes(subLength, "Unknown Presentation Context Item");
      }
    }

    if (!abstractSyntax) {
      return;
    }

    const context = new DicomPresentationContext(id, abstractSyntax);
    for (const ts of transferSyntaxes) {
      context.addTransferSyntax(ts);
    }
    upsertPresentationContext(this.association, context);
  }

  private readUserInformation(raw: RawPDU, itemEnd: number): void {
    while (raw.position < itemEnd) {
      const userType = raw.readByte("User Item-Type");
      raw.skipBytes(1, "Reserved");
      const userLength = raw.readUInt16("User Item-Length");
      const userEnd = raw.position + userLength;

      switch (userType) {
        case 0x51:
          this.association.maximumPDULength = raw.readUInt32("Max PDU Length");
          break;
        case 0x52:
          this.association.remoteImplementationClassUID = new DicomUID(
            raw.readString(userLength, "Implementation Class UID"),
            "Implementation Class UID",
            DicomUidType.Unknown,
          );
          break;
        case 0x53:
          this.association.maxAsyncOpsInvoked = raw.readUInt16("Async Ops Invoked");
          this.association.maxAsyncOpsPerformed = raw.readUInt16("Async Ops Performed");
          break;
        case 0x54:
          this.readRoleSelection(raw, userEnd);
          break;
        case 0x55:
          this.association.remoteImplementationVersion = raw.readString(userLength, "Implementation Version");
          break;
        case 0x56:
          this.readExtendedNegotiation(raw, userEnd);
          break;
        case 0x57:
          this.readCommonExtendedNegotiation(raw, userEnd);
          break;
        case 0x58:
          this.readUserIdentity(raw, userEnd);
          break;
        default:
          raw.skipBytes(userLength, "Unhandled User Item");
          break;
      }

      if (raw.position < userEnd) {
        raw.skipBytes(userEnd - raw.position, "User Item Tail");
      }
    }
  }

  private readRoleSelection(raw: RawPDU, end: number): void {
    const uidLength = raw.readUInt16("Abstract Syntax UID Length");
    const uid = raw.readString(uidLength, "Abstract Syntax UID");
    const userRole = raw.readByte("SCU Role") === 1;
    const providerRole = raw.readByte("SCP Role") === 1;
    updatePresentationContextRoles(this.association, uid, userRole, providerRole);

    if (raw.position < end) {
      raw.skipBytes(end - raw.position, "Role Selection Tail");
    }
  }

  private readExtendedNegotiation(raw: RawPDU, end: number): void {
    const uidLength = raw.readUInt16("SOP Class UID Length");
    const uid = DicomUID.parse(raw.readString(uidLength, "SOP Class UID"));
    const info = raw.readBytes(end - raw.position, "Service Class Application Information");
    const appInfo = DicomServiceApplicationInfo.create(uid, info);
    this.association.extendedNegotiations.addOrUpdate(uid, appInfo);
  }

  private readCommonExtendedNegotiation(raw: RawPDU, end: number): void {
    const uidLength = raw.readUInt16("SOP Class UID Length");
    const uid = DicomUID.parse(raw.readString(uidLength, "SOP Class UID"));
    const serviceClassUidLength = raw.readUInt16("Service Class UID Length");
    const serviceClassUid = DicomUID.parse(raw.readString(serviceClassUidLength, "Service Class UID"));

    const relatedLength = raw.readUInt16("Related SOP Class ID Length");
    const relatedEnd = raw.position + relatedLength;
    const related: DicomUID[] = [];
    while (raw.position < relatedEnd) {
      const relUidLength = raw.readUInt16("Related SOP Class UID Length");
      related.push(DicomUID.parse(raw.readString(relUidLength, "Related SOP Class UID")));
    }

    this.association.extendedNegotiations.addOrUpdate(uid, serviceClassUid, ...related);
    if (raw.position < end) {
      raw.skipBytes(end - raw.position, "Common Extended Negotiation Tail");
    }
  }

  private readUserIdentity(raw: RawPDU, end: number): void {
    const identity = new DicomUserIdentityNegotiation();
    identity.userIdentityType = raw.readByte("User Identity Type") as DicomUserIdentityType;
    identity.positiveResponseRequested = raw.readByte("Positive Response Requested") === 1;
    const primaryLength = raw.readUInt16("Primary Field Length");
    identity.primaryField = raw.readString(primaryLength, "Primary Field", false);
    const secondaryLength = raw.readUInt16("Secondary Field Length");
    identity.secondaryField = raw.readString(secondaryLength, "Secondary Field", false);
    this.association.userIdentityNegotiation = identity;

    if (raw.position < end) {
      raw.skipBytes(end - raw.position, "User Identity Tail");
    }
  }
}

export class AAssociateAC implements PDU {
  readonly type = RawPduType.A_ASSOCIATE_AC;

  constructor(readonly association: DicomAssociation = new DicomAssociation()) {}

  write(): Uint8Array {
    const raw = new RawPDU(this.type);
    raw.writeUInt16(0x0001);
    raw.writeUInt16(0x0000);
    raw.writePaddedString(this.association.calledAE, 16, " ");
    raw.writePaddedString(this.association.callingAE, 16, " ");
    raw.writeBytes(new Uint8Array(32));

    writeItem(raw, 0x10, () => {
      raw.writeString(DicomUIDs.DICOMApplicationContext.uid);
    });

    for (const pc of this.association.presentationContexts) {
      writeItem(raw, 0x21, () => {
        raw.writeByte(pc.id);
        raw.writeByte(0x00);
        raw.writeByte(pc.result);
        raw.writeByte(0x00);

        writeItem(raw, 0x40, () => {
          const fallback = pc.getTransferSyntaxes()[0] ?? DicomTransferSyntax.ImplicitVRLittleEndian;
          raw.writeString((pc.acceptedTransferSyntax ?? fallback).uid.uid);
        });
      });
    }

    writeItem(raw, 0x50, () => {
      writeItem(raw, 0x51, () => {
        raw.writeUInt32(this.association.maximumPDULength > 0 ? this.association.maximumPDULength : DEFAULT_MAX_PDU_LENGTH);
      });

      writeItem(raw, 0x52, () => {
        raw.writeString(DicomImplementation.ClassUID.uid);
      });

      if (this.association.maxAsyncOpsInvoked !== 1 || this.association.maxAsyncOpsPerformed !== 1) {
        writeItem(raw, 0x53, () => {
          raw.writeUInt16(this.association.maxAsyncOpsInvoked);
          raw.writeUInt16(this.association.maxAsyncOpsPerformed);
        });
      }

      for (const pc of this.association.presentationContexts) {
        if (pc.userRole === null && pc.providerRole === null) {
          continue;
        }
        writeItem(raw, 0x54, () => {
          raw.markLength16();
          raw.writeString(pc.abstractSyntax.uid);
          raw.writeLength16();
          raw.writeByte(pc.userRole ? 1 : 0);
          raw.writeByte(pc.providerRole ? 1 : 0);
        });
      }

      writeItem(raw, 0x55, () => {
        raw.writeString(DicomImplementation.Version);
      });

      for (const ext of this.association.extendedNegotiations) {
        const acceptedInfo = ext.acceptedApplicationInfo;
        if (!acceptedInfo || acceptedInfo.count === 0) {
          continue;
        }
        writeItem(raw, 0x56, () => {
          raw.markLength16();
          raw.writeString(ext.sopClassUid.uid);
          raw.writeLength16();
          raw.writeBytes(acceptedInfo.getValues());
        });
      }

      const serverResponse = this.association.userIdentityNegotiation?.serverResponse;
      if (serverResponse) {
        writeItem(raw, 0x59, () => {
          raw.markLength16();
          raw.writeString(serverResponse);
          raw.writeLength16();
        });
      }
    });

    return raw.toBytes();
  }

  read(raw: RawPDU): void {
    raw.reset();
    this.association.maxAsyncOpsInvoked = 1;
    this.association.maxAsyncOpsPerformed = 1;

    raw.readUInt16("Version");
    raw.skipBytes(2, "Reserved");
    raw.skipBytes(16, "Called AE");
    raw.skipBytes(16, "Calling AE");
    raw.skipBytes(32, "Reserved");

    while (raw.position < raw.length) {
      const itemType = raw.readByte("Item-Type");
      raw.skipBytes(1, "Reserved");
      const itemLength = raw.readUInt16("Item-Length");
      const itemEnd = raw.position + itemLength;

      if (itemType === 0x10) {
        raw.skipBytes(itemLength, "Application Context");
      } else if (itemType === 0x21) {
        this.readPresentationContextAccept(raw, itemEnd);
      } else if (itemType === 0x50) {
        this.readUserInformation(raw, itemEnd);
      } else {
        raw.skipBytes(itemLength, "Unknown Item");
      }
    }
  }

  private readPresentationContextAccept(raw: RawPDU, itemEnd: number): void {
    const id = raw.readByte("Presentation Context ID");
    raw.skipBytes(1, "Reserved");
    const result = raw.readByte("Result") as DicomPresentationContextResult;
    raw.skipBytes(1, "Reserved");

    const subType = raw.readByte("Transfer Syntax Item-Type");
    raw.skipBytes(1, "Reserved");
    const subLength = raw.readUInt16("Transfer Syntax Item-Length");
    const transferSyntaxUid = subType === 0x40
      ? raw.readString(subLength, "Transfer Syntax UID")
      : (raw.skipBytes(subLength, "Unknown Transfer Syntax"), DicomUIDs.ImplicitVRLittleEndian.uid);

    let context = this.association.presentationContexts.get(id);
    if (!context) {
      context = new DicomPresentationContext(id, DicomUID.parse("0", "Unknown Abstract Syntax", DicomUidType.SOPClass));
      upsertPresentationContext(this.association, context);
    }

    const syntax = DicomTransferSyntax.parse(transferSyntaxUid);
    if (result === DicomPresentationContextResult.Accept) {
      context.setResult(result, syntax);
    } else {
      context.setResult(result);
    }

    if (raw.position < itemEnd) {
      raw.skipBytes(itemEnd - raw.position, "Presentation Context Tail");
    }
  }

  private readUserInformation(raw: RawPDU, itemEnd: number): void {
    while (raw.position < itemEnd) {
      const userType = raw.readByte("User Item-Type");
      raw.skipBytes(1, "Reserved");
      const userLength = raw.readUInt16("User Item-Length");
      const userEnd = raw.position + userLength;

      switch (userType) {
        case 0x51:
          this.association.maximumPDULength = raw.readUInt32("Max PDU Length");
          break;
        case 0x52:
          this.association.remoteImplementationClassUID = DicomUID.parse(raw.readString(userLength, "Implementation Class UID"));
          break;
        case 0x53:
          this.association.maxAsyncOpsInvoked = raw.readUInt16("Async Ops Invoked");
          this.association.maxAsyncOpsPerformed = raw.readUInt16("Async Ops Performed");
          break;
        case 0x54:
          this.readRoleSelection(raw, userEnd);
          break;
        case 0x55:
          this.association.remoteImplementationVersion = raw.readString(userLength, "Implementation Version");
          break;
        case 0x56:
          this.readExtendedNegotiation(raw, userEnd);
          break;
        case 0x59:
          this.readServerResponse(raw, userEnd);
          break;
        default:
          raw.skipBytes(userLength, "Unhandled User Item");
          break;
      }

      if (raw.position < userEnd) {
        raw.skipBytes(userEnd - raw.position, "User Item Tail");
      }
    }
  }

  private readRoleSelection(raw: RawPDU, end: number): void {
    const uidLength = raw.readUInt16("Abstract Syntax UID Length");
    const uid = raw.readString(uidLength, "Abstract Syntax UID");
    const userRole = raw.readByte("SCU Role") === 1;
    const providerRole = raw.readByte("SCP Role") === 1;
    updatePresentationContextRoles(this.association, uid, userRole, providerRole);

    if (raw.position < end) {
      raw.skipBytes(end - raw.position, "Role Selection Tail");
    }
  }

  private readExtendedNegotiation(raw: RawPDU, end: number): void {
    const uidLength = raw.readUInt16("SOP Class UID Length");
    const uid = DicomUID.parse(raw.readString(uidLength, "SOP Class UID"));
    const info = raw.readBytes(end - raw.position, "Service Class Application Information");
    const appInfo = DicomServiceApplicationInfo.create(uid, info);
    this.association.extendedNegotiations.acceptApplicationInfo(uid, appInfo);
  }

  private readServerResponse(raw: RawPDU, end: number): void {
    const responseLength = raw.readUInt16("Server Response Length");
    const response = raw.readString(responseLength, "Server Response", false);
    if (!this.association.userIdentityNegotiation) {
      this.association.userIdentityNegotiation = new DicomUserIdentityNegotiation();
    }
    this.association.userIdentityNegotiation.serverResponse = response;
    if (raw.position < end) {
      raw.skipBytes(end - raw.position, "Server Response Tail");
    }
  }
}

export enum DicomRejectResult {
  Permanent = 1,
  Transient = 2,
}

export enum DicomRejectSource {
  ServiceUser = 1,
  ServiceProviderACSE = 2,
  ServiceProviderPresentation = 3,
}

/**
 * Value is `(source << 4) | reasonCode` matching DICOM PS3.8 Table 9-21.
 */
export enum DicomRejectReason {
  NoReasonGiven = 0x11,
  ApplicationContextNotSupported = 0x12,
  CallingAENotRecognized = 0x13,
  CalledAENotRecognized = 0x17,
  NoReasonGiven_ = 0x21,
  ProtocolVersionNotSupported = 0x22,
  TemporaryCongestion = 0x31,
  LocalLimitExceeded = 0x32,
}

export class AAssociateRJ implements PDU {
  readonly type = RawPduType.A_ASSOCIATE_RJ;

  constructor(
    public result: DicomRejectResult = DicomRejectResult.Permanent,
    public source: DicomRejectSource = DicomRejectSource.ServiceUser,
    public reason: DicomRejectReason = DicomRejectReason.NoReasonGiven,
  ) {}

  write(): Uint8Array {
    const raw = new RawPDU(this.type);
    raw.writeByte(0x00);
    raw.writeByte(this.result);
    raw.writeByte(this.source);
    raw.writeByte(this.reason & 0x0f);
    return raw.toBytes();
  }

  read(raw: RawPDU): void {
    raw.reset();
    raw.readByte("Reserved");
    this.result = raw.readByte("Result") as DicomRejectResult;
    this.source = raw.readByte("Source") as DicomRejectSource;
    this.reason = ((this.source << 4) | raw.readByte("Reason")) as DicomRejectReason;
  }
}

export class AReleaseRQ implements PDU {
  readonly type = RawPduType.A_RELEASE_RQ;

  write(): Uint8Array {
    const raw = new RawPDU(this.type);
    raw.writeUInt32(0x00000000);
    return raw.toBytes();
  }

  read(raw: RawPDU): void {
    raw.reset();
    raw.readUInt32("Reserved");
  }
}

export class AReleaseRP implements PDU {
  readonly type = RawPduType.A_RELEASE_RP;

  write(): Uint8Array {
    const raw = new RawPDU(this.type);
    raw.writeUInt32(0x00000000);
    return raw.toBytes();
  }

  read(raw: RawPDU): void {
    raw.reset();
    raw.readUInt32("Reserved");
  }
}

export enum DicomAbortSource {
  ServiceUser = 0,
  Unknown = 1,
  ServiceProvider = 2,
}

export enum DicomAbortReason {
  NotSpecified = 0,
  UnrecognizedPDU = 1,
  UnexpectedPDU = 2,
  UnrecognizedPDUParameter = 4,
  UnexpectedPDUParameter = 5,
  InvalidPDUParameter = 6,
}

export class AAbort implements PDU {
  readonly type = RawPduType.A_ABORT;

  constructor(
    public source: DicomAbortSource = DicomAbortSource.ServiceUser,
    public reason: DicomAbortReason = DicomAbortReason.NotSpecified,
  ) {}

  write(): Uint8Array {
    const raw = new RawPDU(this.type);
    raw.writeByte(0x00);
    raw.writeByte(0x00);
    raw.writeByte(this.source);
    raw.writeByte(this.reason);
    return raw.toBytes();
  }

  read(raw: RawPDU): void {
    raw.reset();
    raw.readByte("Reserved");
    raw.readByte("Reserved");
    this.source = raw.readByte("Source") as DicomAbortSource;
    this.reason = raw.readByte("Reason") as DicomAbortReason;
  }
}

export class PDV {
  readonly contextId: number;
  readonly value: Uint8Array;
  readonly isCommand: boolean;
  readonly isLastFragment: boolean;

  constructor(contextId: number, value: Uint8Array, isCommand: boolean, isLastFragment: boolean) {
    this.contextId = contextId & 0xff;
    this.value = value;
    this.isCommand = isCommand;
    this.isLastFragment = isLastFragment;
  }

  get pdvLength(): number {
    return this.value.length + RawPDU.CommonFieldsLength;
  }

  write(raw: RawPDU): void {
    const control = (this.isCommand ? 0x01 : 0x00) | (this.isLastFragment ? 0x02 : 0x00);
    raw.writeUInt32(this.value.length + 2);
    raw.writeByte(this.contextId);
    raw.writeByte(control);
    raw.writeBytes(this.value);
  }

  static read(raw: RawPDU): PDV {
    const length = raw.readUInt32("PDV Length");
    if (length < 2) {
      throw new Error(`Invalid PDV length: ${length}`);
    }
    const contextId = raw.readByte("Presentation Context ID");
    const control = raw.readByte("Message Control Header");
    const value = raw.readBytes(length - 2, "PDV Value");
    return new PDV(contextId, value, (control & 0x01) !== 0, (control & 0x02) !== 0);
  }
}

export class PDataTF implements PDU {
  readonly type = RawPduType.P_DATA_TF;
  readonly pdvs: PDV[] = [];

  constructor(pdvs?: Iterable<PDV>) {
    if (pdvs) {
      this.pdvs.push(...pdvs);
    }
  }

  addPDV(pdv: PDV): void {
    this.pdvs.push(pdv);
  }

  getLengthOfPDVs(): number {
    return this.pdvs.reduce((sum, pdv) => sum + pdv.pdvLength, 0);
  }

  write(): Uint8Array {
    const raw = new RawPDU(this.type);
    for (const pdv of this.pdvs) {
      pdv.write(raw);
    }
    return raw.toBytes();
  }

  read(raw: RawPDU): void {
    raw.reset();
    this.pdvs.splice(0, this.pdvs.length);
    while (raw.position < raw.length) {
      this.pdvs.push(PDV.read(raw));
    }
  }
}

export function readPDU(bytes: Uint8Array, association: DicomAssociation = new DicomAssociation()): { pdu: PDU; bytesRead: number } {
  const { raw, bytesRead } = RawPDU.fromBytes(bytes);

  let pdu: PDU;
  switch (raw.type) {
    case RawPduType.A_ASSOCIATE_RQ:
      pdu = new AAssociateRQ(association);
      break;
    case RawPduType.A_ASSOCIATE_AC:
      pdu = new AAssociateAC(association);
      break;
    case RawPduType.A_ASSOCIATE_RJ:
      pdu = new AAssociateRJ();
      break;
    case RawPduType.A_RELEASE_RQ:
      pdu = new AReleaseRQ();
      break;
    case RawPduType.A_RELEASE_RP:
      pdu = new AReleaseRP();
      break;
    case RawPduType.A_ABORT:
      pdu = new AAbort();
      break;
    case RawPduType.P_DATA_TF:
      pdu = new PDataTF();
      break;
    default:
      throw new Error(`Unsupported PDU type: 0x${(raw.type as number).toString(16).padStart(2, "0")}`);
  }

  pdu.read(raw);
  return { pdu, bytesRead };
}

function writeItem(raw: RawPDU, itemType: number, writer: () => void): void {
  raw.writeByte(itemType);
  raw.writeByte(0x00);
  raw.markLength16();
  writer();
  raw.writeLength16();
}

function upsertPresentationContext(association: DicomAssociation, context: DicomPresentationContext): void {
  const existing = association.presentationContexts.get(context.id);
  if (existing) {
    association.presentationContexts.remove(existing);
  }
  association.presentationContexts.add(context);
}

function updatePresentationContextRoles(
  association: DicomAssociation,
  abstractSyntaxUid: string,
  userRole: boolean,
  providerRole: boolean,
): void {
  for (const existing of association.presentationContexts) {
    if (existing.abstractSyntax.uid !== abstractSyntaxUid) {
      continue;
    }

    const replacement = new DicomPresentationContext(
      existing.id,
      existing.abstractSyntax,
      userRole,
      providerRole,
    );
    for (const ts of existing.getTransferSyntaxes()) {
      replacement.addTransferSyntax(ts);
    }
    if (existing.result === DicomPresentationContextResult.Accept && existing.acceptedTransferSyntax) {
      replacement.setResult(existing.result, existing.acceptedTransferSyntax);
    } else if (existing.result !== DicomPresentationContextResult.Proposed) {
      replacement.setResult(existing.result);
    }

    association.presentationContexts.remove(existing);
    association.presentationContexts.add(replacement);
    return;
  }
}

function readUint32BE(buffer: Uint8Array, offset: number): number {
  return (
    (buffer[offset]! * 0x1000000)
    + ((buffer[offset + 1]! << 16) >>> 0)
    + (buffer[offset + 2]! << 8)
    + buffer[offset + 3]!
  ) >>> 0;
}

function writeUint32BE(buffer: Uint8Array, offset: number, value: number): void {
  buffer[offset] = (value >>> 24) & 0xff;
  buffer[offset + 1] = (value >>> 16) & 0xff;
  buffer[offset + 2] = (value >>> 8) & 0xff;
  buffer[offset + 3] = value & 0xff;
}

export { DicomExtendedNegotiation };
