import { describe, it, expect } from "vitest";
import { DicomVM } from "../../src/core/DicomVM.js";

describe("DicomVM", () => {
  it("parse single value", () => {
    const vm = DicomVM.parse("1");
    expect(vm.minimum).toBe(1);
    expect(vm.maximum).toBe(1);
  });

  it("parse range", () => {
    const vm = DicomVM.parse("1-3");
    expect(vm.minimum).toBe(1);
    expect(vm.maximum).toBe(3);
  });

  it("parse unbounded n", () => {
    const vm = DicomVM.parse("1-n");
    expect(vm.minimum).toBe(1);
    expect(vm.maximum).toBe(Number.MAX_SAFE_INTEGER);
    expect(vm.multiplicity).toBe(1);
  });

  it("parse multiplicity 2-2n", () => {
    const vm = DicomVM.parse("2-2n");
    expect(vm.minimum).toBe(2);
    expect(vm.maximum).toBe(Number.MAX_SAFE_INTEGER);
    expect(vm.multiplicity).toBe(2);
  });

  it("caches parsed values", () => {
    expect(DicomVM.parse("1")).toBe(DicomVM.parse("1"));
    expect(DicomVM.parse("1-n")).toBe(DicomVM.parse("1-n"));
  });

  it("predefined VM constants", () => {
    expect(DicomVM.VM_1).toBe(DicomVM.parse("1"));
    expect(DicomVM.VM_1_n).toBe(DicomVM.parse("1-n"));
    expect(DicomVM.VM_2_2n).toBe(DicomVM.parse("2-2n"));
  });

  it("isValid checks count", () => {
    expect(DicomVM.VM_1.isValid(1)).toBe(true);
    expect(DicomVM.VM_1.isValid(2)).toBe(false);
    expect(DicomVM.VM_1_n.isValid(1)).toBe(true);
    expect(DicomVM.VM_1_n.isValid(100)).toBe(true);
    expect(DicomVM.VM_1_n.isValid(0)).toBe(false);
  });

  it("isValid with multiplicity constraint", () => {
    expect(DicomVM.VM_2_2n.isValid(2)).toBe(true);
    expect(DicomVM.VM_2_2n.isValid(4)).toBe(true);
    expect(DicomVM.VM_2_2n.isValid(3)).toBe(false);
  });

  it("toString single", () => {
    expect(DicomVM.VM_1.toString()).toBe("1");
  });

  it("toString range", () => {
    expect(DicomVM.parse("1-3").toString()).toBe("1-3");
  });

  it("toString unbounded", () => {
    expect(DicomVM.VM_1_n.toString()).toBe("1-n");
    expect(DicomVM.VM_2_2n.toString()).toBe("2-2n");
  });
});
