import { DicomTransferSyntax } from "../core/DicomTransferSyntax.js";
import { DicomUID } from "../core/DicomUID.js";
import { DicomPresentationContext } from "./DicomPresentationContext.js";

export class DicomPresentationContextCollection implements Iterable<DicomPresentationContext> {
  private readonly contexts = new Map<number, DicomPresentationContext>();
  private readonly uniqueContexts = new Set<string>();

  get count(): number {
    return this.contexts.size;
  }

  get(id: number): DicomPresentationContext | undefined {
    return this.contexts.get(id);
  }

  add(item: DicomPresentationContext): void {
    const key = toUniqueKey(item);
    if (this.uniqueContexts.has(key)) {
      return;
    }

    if (this.contexts.has(item.id)) {
      throw new Error(`Presentation context ID ${item.id} already exists`);
    }

    this.uniqueContexts.add(key);
    this.contexts.set(item.id, item);
  }

  addPresentationContext(
    abstractSyntax: DicomUID,
    transferSyntaxes: readonly DicomTransferSyntax[] = [],
    userRole: boolean | null = null,
    providerRole: boolean | null = null,
  ): DicomPresentationContext {
    const context = new DicomPresentationContext(this.getNextPresentationContextID(), abstractSyntax, userRole, providerRole);
    for (const transferSyntax of transferSyntaxes) {
      context.addTransferSyntax(transferSyntax);
    }
    this.add(context);
    return context;
  }

  clear(): void {
    this.contexts.clear();
    this.uniqueContexts.clear();
  }

  contains(item: DicomPresentationContext): boolean {
    const existing = this.contexts.get(item.id);
    return !!existing && existing.abstractSyntax.uid === item.abstractSyntax.uid;
  }

  remove(item: DicomPresentationContext): boolean {
    const removed = this.contexts.delete(item.id);
    if (removed) {
      this.uniqueContexts.delete(toUniqueKey(item));
    }
    return removed;
  }

  [Symbol.iterator](): Iterator<DicomPresentationContext> {
    const sorted = [...this.contexts.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([, context]) => context);
    return sorted[Symbol.iterator]();
  }

  private getNextPresentationContextID(): number {
    if (this.contexts.size === 0) {
      return 1;
    }

    const next = Math.max(...this.contexts.keys()) + 2;
    if (next >= 256) {
      throw new Error("Too many presentation contexts configured for this association");
    }
    return next;
  }
}

function toUniqueKey(context: DicomPresentationContext): string {
  const transferSyntaxes = context.getTransferSyntaxes().map((syntax) => syntax.uid.uid).join("|");
  return [
    context.abstractSyntax.uid,
    context.userRole === null ? "null" : context.userRole ? "1" : "0",
    context.providerRole === null ? "null" : context.providerRole ? "1" : "0",
    transferSyntaxes,
  ].join("::");
}
