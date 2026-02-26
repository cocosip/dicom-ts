/**
 * DICOM Value Multiplicity (VM) descriptor.
 *
 * Specifies the allowed number of values in a data element.
 *
 * Reference: fo-dicom/FO-DICOM.Core/DicomVM.cs
 */
export class DicomVM {
  /** Minimum number of values (always >= 1). */
  readonly minimum: number;
  /** Maximum number of values; `Number.MAX_SAFE_INTEGER` means unlimited (n). */
  readonly maximum: number;
  /** Step size for repeating-multiplicity forms like `2-2n` (step = 2). */
  readonly multiplicity: number;

  constructor(minimum: number, maximum: number, multiplicity: number) {
    this.minimum = minimum;
    this.maximum = maximum;
    this.multiplicity = multiplicity;
  }

  /** Returns true if the given count satisfies this VM constraint. */
  isValid(count: number): boolean {
    if (count < this.minimum) return false;
    if (count > this.maximum) return false;
    if (this.multiplicity > 1) {
      return (count - this.minimum) % this.multiplicity === 0;
    }
    return true;
  }

  toString(): string {
    if (this.minimum === this.maximum) return String(this.minimum);
    if (this.maximum === Number.MAX_SAFE_INTEGER) {
      if (this.multiplicity > 1) return `${this.minimum}-${this.multiplicity}n`;
      return `${this.minimum}-n`;
    }
    return `${this.minimum}-${this.maximum}`;
  }

  // ---------------------------------------------------------------------------
  // Static parse & cache
  // ---------------------------------------------------------------------------

  private static readonly _cache = new Map<string, DicomVM>();

  /**
   * Parse a VM string such as `"1"`, `"1-3"`, `"1-n"`, `"2-2n"`.
   */
  static parse(s: string): DicomVM {
    const cached = DicomVM._cache.get(s);
    if (cached !== undefined) return cached;

    const parts = s.split(/[-\s]|or/).filter(Boolean);

    let vm: DicomVM;

    if (parts.length === 1) {
      const n = parseInt(parts[0]!, 10);
      vm = new DicomVM(n, n, n);
    } else {
      const min = parseInt(parts[0]!, 10);
      const maxStr = parts[1]!.toLowerCase();

      if (maxStr.includes("n")) {
        const prefix = maxStr.replace(/n$/, "");
        const step = prefix.length > 0 ? parseInt(prefix, 10) : 1;
        vm = new DicomVM(min, Number.MAX_SAFE_INTEGER, step);
      } else {
        const max = parseInt(maxStr, 10);
        vm = new DicomVM(min, max, 1);
      }
    }

    DicomVM._cache.set(s, vm);
    return vm;
  }

  // ---------------------------------------------------------------------------
  // Predefined VM constants (matches fo-dicom naming)
  // ---------------------------------------------------------------------------

  static readonly VM_1     = DicomVM.parse("1");
  static readonly VM_1_2   = DicomVM.parse("1-2");
  static readonly VM_1_3   = DicomVM.parse("1-3");
  static readonly VM_1_8   = DicomVM.parse("1-8");
  static readonly VM_1_32  = DicomVM.parse("1-32");
  static readonly VM_1_99  = DicomVM.parse("1-99");
  static readonly VM_1_n   = DicomVM.parse("1-n");
  static readonly VM_2     = DicomVM.parse("2");
  static readonly VM_2_n   = DicomVM.parse("2-n");
  static readonly VM_2_2n  = DicomVM.parse("2-2n");
  static readonly VM_3     = DicomVM.parse("3");
  static readonly VM_3_n   = DicomVM.parse("3-n");
  static readonly VM_3_3n  = DicomVM.parse("3-3n");
  static readonly VM_4     = DicomVM.parse("4");
  static readonly VM_6     = DicomVM.parse("6");
  static readonly VM_16    = DicomVM.parse("16");
}
