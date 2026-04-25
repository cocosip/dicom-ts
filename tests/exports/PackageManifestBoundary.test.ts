import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

async function readJson<T = Record<string, unknown>>(path: string): Promise<T> {
  return JSON.parse(await readFile(path, "utf8")) as T;
}

describe("package manifest boundaries", () => {
  it("keeps shared io free of static Node platform imports", async () => {
    const ioFiles = await listTypeScriptFiles(join(root, "src", "io"));
    const offenders: string[] = [];
    const staticNodeImport = /\bimport\s+(?:[^"'`]*?\s+from\s+)?["'`]node:[^"'`]+["'`]/;

    for (const file of ioFiles) {
      const source = await readFile(file, "utf8");
      if (staticNodeImport.test(source)) {
        offenders.push(file.replace(root, "").replace(/\\/g, "/"));
      }
    }

    expect(offenders).toEqual([]);
  });

  it("keeps browser-exported media and structured-report modules free of static Node imports", async () => {
    const files = [
      ...await listTypeScriptFiles(join(root, "src", "media")),
      ...await listTypeScriptFiles(join(root, "src", "structured-report")),
    ];
    const offenders: string[] = [];
    const staticNodeImport = /\bimport\s+(?:[^"'`]*?\s+from\s+)?["'`]node:[^"'`]+["'`]/;
    const nodeDirectoryImport = /["'`]\.\.\/node\//;

    for (const file of files) {
      const source = await readFile(file, "utf8");
      if (staticNodeImport.test(source) || nodeDirectoryImport.test(source)) {
        offenders.push(file.replace(root, "").replace(/\\/g, "/"));
      }
    }

    expect(offenders).toEqual([]);
  });

  it("keeps shared browser package sources free of Node runtime type and fallback leaks", async () => {
    const files = await listTypeScriptFiles(join(root, "src"));
    const offenders: string[] = [];
    const nodeLeak = /\bNodeJS\.|\btypeof\s+Buffer\b|\bBuffer\.from\b|import\s+\{\s*Buffer\s*\}\s+from|["'`]node:(?:buffer|crypto|fs|path|stream|zlib)["'`]|globalThis[\s\S]{0,160}\)\.process|\bprocess\.(?:env|versions)\b|\bversions\??\.node\b/;

    for (const file of files) {
      const relative = file.replace(root, "").replace(/\\/g, "/");
      if (relative.startsWith("/src/node/") || relative.startsWith("/src/network/")) {
        continue;
      }
      const source = await readFile(file, "utf8");
      if (nodeLeak.test(source)) {
        offenders.push(relative);
      }
    }

    expect(offenders).toEqual([]);
  });

  it("keeps package entrypoints self-contained inside each published package", async () => {
    for (const packageName of ["dicom-ts", "dicom-ts-node"] as const) {
      const packageRoot = join(root, "packages", packageName);
      const manifest = await readJson<{ files?: string[] }>(join(packageRoot, "package.json"));
      const esmEntry = await readFile(join(packageRoot, "index.js"), "utf8");
      const cjsEntry = await readFile(join(packageRoot, "index.cjs"), "utf8");
      const typesEntry = await readFile(join(packageRoot, "index.d.ts"), "utf8");

      expect(esmEntry).not.toContain("../..");
      expect(cjsEntry).not.toContain("../..");
      expect(typesEntry).not.toContain("../..");
      expect(manifest.files).toContain("dist");
    }
  });

  it("keeps runtime dependencies in publishable workspace packages", async () => {
    const rootManifest = await readJson<{ dependencies?: Record<string, string> }>(join(root, "package.json"));
    const browserManifest = await readJson<{ dependencies?: Record<string, string> }>(
      join(root, "packages", "dicom-ts", "package.json"),
    );
    const nodeManifest = await readJson<{
      dependencies?: Record<string, string>;
      optionalDependencies?: Record<string, string>;
    }>(join(root, "packages", "dicom-ts-node", "package.json"));

    expect(rootManifest.dependencies ?? {}).toEqual({});
    expect(browserManifest.dependencies).toMatchObject({
      "iconv-lite": "^0.7.2",
      "jpeg-js": "^0.4.4",
      "upng-js": "^2.1.0",
    });
    expect(nodeManifest.dependencies).toEqual({
      "dicom-ts": "0.2.0-alpha.0",
    });
    expect(nodeManifest.optionalDependencies).toEqual({
      sharp: "^0.34.0",
    });
  });

  it("keeps package-lock workspace metadata aligned with package manifests", async () => {
    const lock = await readJson<{
      packages?: Record<
        string,
        {
          dependencies?: Record<string, string>;
          optionalDependencies?: Record<string, string>;
        }
      >;
    }>(join(root, "package-lock.json"));

    expect(lock.packages?.[""].dependencies ?? {}).toEqual({});
    expect(lock.packages?.["packages/dicom-ts"]?.dependencies).toMatchObject({
      "iconv-lite": "^0.7.2",
      "jpeg-js": "^0.4.4",
      "upng-js": "^2.1.0",
    });
    expect(lock.packages?.["packages/dicom-ts-node"]?.dependencies).toEqual({
      "dicom-ts": "0.2.0-alpha.0",
    });
    expect(lock.packages?.["packages/dicom-ts-node"]?.optionalDependencies).toEqual({
      sharp: "^0.34.0",
    });
  });
});

async function listTypeScriptFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listTypeScriptFiles(file));
    } else if (entry.isFile() && file.endsWith(".ts")) {
      files.push(file);
    }
  }
  return files;
}
