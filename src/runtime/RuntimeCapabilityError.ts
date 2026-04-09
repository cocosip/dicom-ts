export class RuntimeCapabilityError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "RuntimeCapabilityError";
    this.code = code;
  }
}

export function createRuntimeCapabilityError(code: string, message: string): RuntimeCapabilityError {
  return new RuntimeCapabilityError(code, message);
}
