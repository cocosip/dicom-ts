/**
 * Representation of the file meta information in a DICOM Part 10 file.
 *
 * Ported from fo-dicom/FO-DICOM.Core/DicomFileMetaInformation.cs
 */
import { DicomTransferSyntax } from "./core/DicomTransferSyntax.js";
import { DicomUID } from "./core/DicomUID.js";
import { DicomImplementation } from "./core/DicomImplementation.js";
import { DicomTag } from "./core/DicomTag.js";
import * as DicomTags from "./core/DicomTag.generated.js";
import { DicomDataset } from "./dataset/DicomDataset.js";
import {
  DicomApplicationEntity,
  DicomOtherByte,
  DicomShortString,
  DicomUniqueIdentifier,
} from "./dataset/DicomElement.js";

export class DicomFileMetaInformation extends DicomDataset {
  constructor();
  constructor(dataset: DicomDataset);
  constructor(metaInfo: DicomFileMetaInformation);
  constructor(arg?: DicomDataset | DicomFileMetaInformation) {
    super(DicomTransferSyntax.ExplicitVRLittleEndian);
    this.validateItems = arg?.validateItems ?? false;

    if (arg) {
      for (const item of arg) {
        this.addOrUpdate(item);
      }
    }

    this.version = new Uint8Array([0x00, 0x01]);

    if (arg && !(arg instanceof DicomFileMetaInformation)) {
      this.mediaStorageSOPClassUID = getUidFromDataset(arg, DicomTags.SOPClassUID);
      this.mediaStorageSOPInstanceUID = getUidFromDataset(arg, DicomTags.SOPInstanceUID);
      this.transferSyntaxUID = arg.internalTransferSyntax;

      this.implementationClassUID = DicomImplementation.ClassUID;
      this.implementationVersionName = DicomImplementation.Version;

      const srcAet = arg.tryGetString(DicomTags.SourceApplicationEntityTitle);
      if (srcAet) this.sourceApplicationEntityTitle = srcAet;

      const sendAet = arg.tryGetString(DicomTags.SendingApplicationEntityTitle);
      if (sendAet) this.sendingApplicationEntityTitle = sendAet;

      const recvAet = arg.tryGetString(DicomTags.ReceivingApplicationEntityTitle);
      if (recvAet) this.receivingApplicationEntityTitle = recvAet;

      const privCreator = getUidFromDataset(arg, DicomTags.PrivateInformationCreatorUID);
      if (privCreator) this.privateInformationCreatorUID = privCreator;

      const privInfo = arg.tryGetValues<number>(DicomTags.PrivateInformation);
      if (privInfo) this.privateInformation = Uint8Array.from(privInfo);
    } else {
      if (!this.contains(DicomTags.ImplementationClassUID)) {
        this.implementationClassUID = DicomImplementation.ClassUID;
      }
      if (!this.contains(DicomTags.ImplementationVersionName)) {
        this.implementationVersionName = DicomImplementation.Version;
      }
    }
  }

  get version(): Uint8Array {
    const item = this.getDicomItem<DicomOtherByte>(DicomTags.FileMetaInformationVersion);
    return item?.buffer.data ?? new Uint8Array([0x00, 0x01]);
  }

  set version(value: Uint8Array) {
    this.addOrUpdate(new DicomOtherByte(DicomTags.FileMetaInformationVersion, value));
  }

  get mediaStorageSOPClassUID(): DicomUID | null {
    return getUidFromDataset(this, DicomTags.MediaStorageSOPClassUID);
  }

  set mediaStorageSOPClassUID(value: DicomUID | null) {
    if (!value) return;
    this.addOrUpdate(new DicomUniqueIdentifier(DicomTags.MediaStorageSOPClassUID, value));
  }

  get mediaStorageSOPInstanceUID(): DicomUID | null {
    return getUidFromDataset(this, DicomTags.MediaStorageSOPInstanceUID);
  }

  set mediaStorageSOPInstanceUID(value: DicomUID | null) {
    if (!value) return;
    this.addOrUpdate(new DicomUniqueIdentifier(DicomTags.MediaStorageSOPInstanceUID, value));
  }

  get transferSyntaxUID(): DicomTransferSyntax | null {
    const item = this.getDicomItem<DicomUniqueIdentifier>(DicomTags.TransferSyntaxUID);
    if (!item) return null;
    return DicomTransferSyntax.parse(item.uidValue.uid);
  }

  set transferSyntaxUID(value: DicomTransferSyntax | null) {
    if (!value) return;
    this.addOrUpdate(new DicomUniqueIdentifier(DicomTags.TransferSyntaxUID, value));
  }

  get implementationClassUID(): DicomUID | null {
    return getUidFromDataset(this, DicomTags.ImplementationClassUID);
  }

  set implementationClassUID(value: DicomUID | null) {
    if (!value) return;
    this.addOrUpdate(new DicomUniqueIdentifier(DicomTags.ImplementationClassUID, value));
  }

  get implementationVersionName(): string | null {
    const item = this.getDicomItem<DicomShortString>(DicomTags.ImplementationVersionName);
    return item ? item.getAt(0) : null;
  }

  set implementationVersionName(value: string | null) {
    if (value === null || value === undefined) return;
    this.addOrUpdate(new DicomShortString(DicomTags.ImplementationVersionName, value));
  }

  get sourceApplicationEntityTitle(): string | null {
    const item = this.getDicomItem<DicomApplicationEntity>(DicomTags.SourceApplicationEntityTitle);
    return item ? item.getAt(0) : null;
  }

  set sourceApplicationEntityTitle(value: string | null) {
    if (value === null || value === undefined) return;
    this.addOrUpdate(new DicomApplicationEntity(DicomTags.SourceApplicationEntityTitle, value));
  }

  get sendingApplicationEntityTitle(): string | null {
    const item = this.getDicomItem<DicomApplicationEntity>(DicomTags.SendingApplicationEntityTitle);
    return item ? item.getAt(0) : null;
  }

  set sendingApplicationEntityTitle(value: string | null) {
    if (value === null || value === undefined) return;
    this.addOrUpdate(new DicomApplicationEntity(DicomTags.SendingApplicationEntityTitle, value));
  }

  get receivingApplicationEntityTitle(): string | null {
    const item = this.getDicomItem<DicomApplicationEntity>(DicomTags.ReceivingApplicationEntityTitle);
    return item ? item.getAt(0) : null;
  }

  set receivingApplicationEntityTitle(value: string | null) {
    if (value === null || value === undefined) return;
    this.addOrUpdate(new DicomApplicationEntity(DicomTags.ReceivingApplicationEntityTitle, value));
  }

  get privateInformationCreatorUID(): DicomUID | null {
    return getUidFromDataset(this, DicomTags.PrivateInformationCreatorUID);
  }

  set privateInformationCreatorUID(value: DicomUID | null) {
    if (!value) return;
    this.addOrUpdate(new DicomUniqueIdentifier(DicomTags.PrivateInformationCreatorUID, value));
  }

  get privateInformation(): Uint8Array | null {
    const item = this.getDicomItem<DicomOtherByte>(DicomTags.PrivateInformation);
    return item?.buffer.data ?? null;
  }

  set privateInformation(value: Uint8Array | null) {
    if (!value) return;
    this.addOrUpdate(new DicomOtherByte(DicomTags.PrivateInformation, value));
  }

  override toString(): string {
    return "DICOM File Meta Info";
  }
}

function getUidFromDataset(dataset: DicomDataset, tag: DicomTag): DicomUID | null {
  const item = dataset.getDicomItem<DicomUniqueIdentifier>(tag);
  return item?.uidValue ?? null;
}
