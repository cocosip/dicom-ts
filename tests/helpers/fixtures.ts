import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const fixturesRoot = resolve(here, "..", "fixtures");

export const fixturePath = (...parts: string[]): string =>
  join(fixturesRoot, ...parts);

export const readFixture = async (...parts: string[]): Promise<Buffer> =>
  readFile(fixturePath(...parts));
