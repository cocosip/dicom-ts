import { DicomTransferSyntax } from "../core/DicomTransferSyntax.js";
import { DicomUID } from "../core/DicomUID.js";

export enum DicomPresentationContextResult {
  Proposed = 255,
  Accept = 0,
  RejectUser = 1,
  RejectNoReason = 2,
  RejectAbstractSyntaxNotSupported = 3,
  RejectTransferSyntaxesNotSupported = 4,
}

export class DicomPresentationContext {
  readonly id: number;
  readonly abstractSyntax: DicomUID;
  readonly userRole: boolean | null;
  readonly providerRole: boolean | null;

  private resultValue: DicomPresentationContextResult;
  private acceptedTransferSyntaxValue: DicomTransferSyntax | null;
  private readonly transferSyntaxes: DicomTransferSyntax[];

  constructor(id: number, abstractSyntax: DicomUID, userRole: boolean | null = null, providerRole: boolean | null = null) {
    this.id = id;
    this.abstractSyntax = abstractSyntax;
    this.userRole = userRole;
    this.providerRole = providerRole;
    this.resultValue = DicomPresentationContextResult.Proposed;
    this.acceptedTransferSyntaxValue = null;
    this.transferSyntaxes = [];
  }

  get result(): DicomPresentationContextResult {
    return this.resultValue;
  }

  get acceptedTransferSyntax(): DicomTransferSyntax | null {
    return this.acceptedTransferSyntaxValue;
  }

  static getScpRolePresentationContext(
    abstractSyntax: DicomUID,
    ...transferSyntaxes: DicomTransferSyntax[]
  ): DicomPresentationContext {
    const presentationContext = new DicomPresentationContext(0, abstractSyntax, false, true);
    if (transferSyntaxes.length === 0) {
      presentationContext.addTransferSyntax(DicomTransferSyntax.ImplicitVRLittleEndian);
    } else {
      for (const transferSyntax of transferSyntaxes) {
        presentationContext.addTransferSyntax(transferSyntax);
      }
    }
    return presentationContext;
  }

  setResult(result: DicomPresentationContextResult, acceptedTransferSyntax?: DicomTransferSyntax): void {
    if (result === DicomPresentationContextResult.Accept && !acceptedTransferSyntax) {
      throw new Error("Result acceptance requires a non-null transfer syntax");
    }

    this.transferSyntaxes.splice(0, this.transferSyntaxes.length);
    if (acceptedTransferSyntax) {
      this.transferSyntaxes.push(acceptedTransferSyntax);
    }

    this.resultValue = result;
    this.acceptedTransferSyntaxValue = result === DicomPresentationContextResult.Accept
      ? (acceptedTransferSyntax ?? null)
      : null;
  }

  acceptTransferSyntaxes(acceptedTransferSyntaxes: readonly DicomTransferSyntax[], scpPriority = false): boolean {
    if (this.resultValue === DicomPresentationContextResult.Accept) {
      return true;
    }

    if (scpPriority) {
      for (const transferSyntax of acceptedTransferSyntaxes) {
        if (this.hasTransferSyntax(transferSyntax)) {
          this.setResult(DicomPresentationContextResult.Accept, transferSyntax);
          return true;
        }
      }
    } else {
      for (const proposedTransferSyntax of this.transferSyntaxes) {
        if (acceptedTransferSyntaxes.some((candidate) => candidate.uid.uid === proposedTransferSyntax.uid.uid)) {
          this.setResult(DicomPresentationContextResult.Accept, proposedTransferSyntax);
          return true;
        }
      }
    }

    this.setResult(DicomPresentationContextResult.RejectTransferSyntaxesNotSupported);
    return false;
  }

  addTransferSyntax(transferSyntax: DicomTransferSyntax | null | undefined): void {
    if (!transferSyntax || this.hasTransferSyntax(transferSyntax)) {
      return;
    }
    this.transferSyntaxes.push(transferSyntax);
  }

  removeTransferSyntax(transferSyntax: DicomTransferSyntax | null | undefined): void {
    if (!transferSyntax) {
      return;
    }
    const index = this.transferSyntaxes.findIndex((candidate) => candidate.uid.uid === transferSyntax.uid.uid);
    if (index >= 0) {
      this.transferSyntaxes.splice(index, 1);
    }
  }

  clearTransferSyntaxes(): void {
    this.transferSyntaxes.splice(0, this.transferSyntaxes.length);
  }

  getTransferSyntaxes(): readonly DicomTransferSyntax[] {
    return [...this.transferSyntaxes];
  }

  hasTransferSyntax(transferSyntax: DicomTransferSyntax): boolean {
    return this.transferSyntaxes.some((candidate) => candidate.uid.uid === transferSyntax.uid.uid);
  }

  getResultDescription(): string {
    switch (this.resultValue) {
      case DicomPresentationContextResult.Accept:
        return "Accept";
      case DicomPresentationContextResult.Proposed:
        return "Proposed";
      case DicomPresentationContextResult.RejectAbstractSyntaxNotSupported:
        return "Reject - Abstract Syntax Not Supported";
      case DicomPresentationContextResult.RejectNoReason:
        return "Reject - No Reason";
      case DicomPresentationContextResult.RejectTransferSyntaxesNotSupported:
        return "Reject - Transfer Syntaxes Not Supported";
      case DicomPresentationContextResult.RejectUser:
        return "Reject - User";
      default:
        return "Unknown";
    }
  }
}
