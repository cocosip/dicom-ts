import type { IImageBackend } from "./IImageBackend.js";
import type { IImageSurface } from "./IImageSurface.js";

const backends = new Map<string, IImageBackend>();

function keyOf(target: string): string {
  return target.trim().toLowerCase();
}

export function registerImageBackend(backend: IImageBackend): void {
  backends.set(keyOf(backend.target), backend);
}

export function unregisterImageBackend(target: string): void {
  backends.delete(keyOf(target));
}

export function getImageBackend(target: string): IImageBackend | null {
  return backends.get(keyOf(target)) ?? null;
}

export function listImageBackends(): readonly IImageBackend[] {
  return Array.from(backends.values());
}

export function convertImageSurface<T = unknown>(surface: IImageSurface, target: string): T {
  const backend = getImageBackend(target);
  if (!backend) {
    throw new Error(`No image backend registered for target: ${target}`);
  }
  return backend.convert(surface) as T;
}
