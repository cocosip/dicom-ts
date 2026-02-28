import { DicomUID } from "../core/DicomUID.js";
import { DicomExtendedNegotiation } from "./DicomExtendedNegotiation.js";
import { DicomServiceApplicationInfo } from "./DicomServiceApplicationInfo.js";

export class DicomExtendedNegotiationCollection implements Iterable<DicomExtendedNegotiation> {
  private readonly entries = new Map<string, DicomExtendedNegotiation>();

  get count(): number {
    return this.entries.size;
  }

  add(item: DicomExtendedNegotiation): void;
  add(sopClassUid: DicomUID, applicationInfo: DicomServiceApplicationInfo): void;
  add(sopClassUid: DicomUID, serviceClassUid: DicomUID | null, ...relatedGeneralSopClasses: DicomUID[]): void;
  add(
    sopClassUid: DicomUID,
    applicationInfo: DicomServiceApplicationInfo | null,
    serviceClassUid: DicomUID | null,
    ...relatedGeneralSopClasses: DicomUID[]
  ): void;
  add(
    itemOrSopClass: DicomExtendedNegotiation | DicomUID,
    applicationInfoOrServiceClass?: DicomServiceApplicationInfo | DicomUID | null,
    serviceClassUid: DicomUID | null = null,
    ...relatedGeneralSopClasses: DicomUID[]
  ): void {
    if (itemOrSopClass instanceof DicomExtendedNegotiation) {
      this.addEntry(itemOrSopClass);
      return;
    }

    if (applicationInfoOrServiceClass instanceof DicomServiceApplicationInfo) {
      this.addEntry(new DicomExtendedNegotiation(
        itemOrSopClass,
        applicationInfoOrServiceClass,
        serviceClassUid,
        ...relatedGeneralSopClasses,
      ));
      return;
    }

    if (applicationInfoOrServiceClass instanceof DicomUID) {
      if (serviceClassUid) {
        this.addEntry(new DicomExtendedNegotiation(
          itemOrSopClass,
          applicationInfoOrServiceClass,
          serviceClassUid,
          ...relatedGeneralSopClasses,
        ));
      } else {
        this.addEntry(new DicomExtendedNegotiation(
          itemOrSopClass,
          applicationInfoOrServiceClass,
          ...relatedGeneralSopClasses,
        ));
      }
      return;
    }

    this.addEntry(new DicomExtendedNegotiation(
      itemOrSopClass,
      applicationInfoOrServiceClass ?? null,
      serviceClassUid,
      ...relatedGeneralSopClasses,
    ));
  }

  addOrUpdate(sopClassUid: DicomUID, applicationInfo: DicomServiceApplicationInfo): void;
  addOrUpdate(sopClassUid: DicomUID, serviceClassUid: DicomUID | null, ...relatedGeneralSopClasses: DicomUID[]): void;
  addOrUpdate(
    sopClassUid: DicomUID,
    applicationInfo: DicomServiceApplicationInfo | null,
    serviceClassUid: DicomUID | null,
    ...relatedGeneralSopClasses: DicomUID[]
  ): void;
  addOrUpdate(
    sopClassUid: DicomUID,
    applicationInfoOrServiceClass: DicomServiceApplicationInfo | DicomUID | null,
    serviceClassUid: DicomUID | null = null,
    ...relatedGeneralSopClasses: DicomUID[]
  ): void {
    const key = sopClassUid.uid;
    const existing = this.entries.get(key);
    if (!existing) {
      if (applicationInfoOrServiceClass instanceof DicomServiceApplicationInfo) {
        this.add(sopClassUid, applicationInfoOrServiceClass, serviceClassUid, ...relatedGeneralSopClasses);
      } else if (applicationInfoOrServiceClass instanceof DicomUID) {
        if (serviceClassUid) {
          this.add(sopClassUid, applicationInfoOrServiceClass, serviceClassUid, ...relatedGeneralSopClasses);
        } else {
          this.add(sopClassUid, applicationInfoOrServiceClass, ...relatedGeneralSopClasses);
        }
      } else {
        this.add(sopClassUid, applicationInfoOrServiceClass, serviceClassUid, ...relatedGeneralSopClasses);
      }
      return;
    }

    if (applicationInfoOrServiceClass instanceof DicomServiceApplicationInfo) {
      existing.requestedApplicationInfo = applicationInfoOrServiceClass;
      if (serviceClassUid) {
        existing.serviceClassUid = serviceClassUid;
        existing.relatedGeneralSopClasses.splice(0, existing.relatedGeneralSopClasses.length, ...relatedGeneralSopClasses);
      }
      return;
    }

    existing.serviceClassUid = applicationInfoOrServiceClass;
    if (serviceClassUid) {
      existing.relatedGeneralSopClasses.splice(0, existing.relatedGeneralSopClasses.length, serviceClassUid, ...relatedGeneralSopClasses);
    } else {
      existing.relatedGeneralSopClasses.splice(0, existing.relatedGeneralSopClasses.length, ...relatedGeneralSopClasses);
    }
  }

  acceptApplicationInfo(sopClassUid: DicomUID, applicationInfo: DicomServiceApplicationInfo): void {
    this.entries.get(sopClassUid.uid)?.acceptApplicationInfo(applicationInfo);
  }

  clear(): void {
    this.entries.clear();
  }

  contains(item: DicomExtendedNegotiation): boolean;
  contains(sopClassUid: DicomUID): boolean;
  contains(itemOrSopClassUid: DicomExtendedNegotiation | DicomUID): boolean {
    if (itemOrSopClassUid instanceof DicomExtendedNegotiation) {
      return this.entries.has(itemOrSopClassUid.sopClassUid.uid);
    }
    return this.entries.has(itemOrSopClassUid.uid);
  }

  get(sopClassUid: DicomUID): DicomExtendedNegotiation | undefined {
    return this.entries.get(sopClassUid.uid);
  }

  remove(item: DicomExtendedNegotiation): boolean {
    return this.entries.delete(item.sopClassUid.uid);
  }

  [Symbol.iterator](): Iterator<DicomExtendedNegotiation> {
    return this.entries.values();
  }

  private addEntry(item: DicomExtendedNegotiation): void {
    if (!item?.sopClassUid) {
      return;
    }
    this.entries.set(item.sopClassUid.uid, item);
  }
}
