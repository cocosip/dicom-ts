import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const packages = [
  {
    name: "dicom-ts",
    browserSafe: true,
    entries: {
      esm: "browser/index.js",
      cjs: "browser/index.js",
    },
  },
  {
    name: "dicom-ts-node",
    entries: {
      esm: "node/index.js",
      cjs: "node/index.js",
    },
  },
];

for (const pkg of packages) {
  const packageRoot = path.join(root, "packages", pkg.name);
  const targetDist = path.join(packageRoot, "dist");
  await fs.rm(targetDist, { force: true, recursive: true });

  await syncGraph(path.join(root, "dist", "esm"), pkg.entries.esm, path.join(targetDist, "esm"), pkg);
  await syncGraph(path.join(root, "dist", "cjs"), pkg.entries.cjs, path.join(targetDist, "cjs"), pkg);
  await writeJson(path.join(targetDist, "cjs", "package.json"), { type: "commonjs" });
  if (pkg.browserSafe) {
    await assertBrowserPackageSafe(targetDist);
  }
}

async function syncGraph(sourceRoot, entry, targetRoot, pkg) {
  const stack = [entry];
  const visited = new Set();

  while (stack.length > 0) {
    const relativeFile = normalizeRelative(stack.pop());
    if (!relativeFile || visited.has(relativeFile)) {
      continue;
    }
    visited.add(relativeFile);

    const sourceFile = path.join(sourceRoot, relativeFile);
    const source = await readOptionalText(sourceFile);
    if (source === null) {
      continue;
    }

    await copyFile(sourceFile, path.join(targetRoot, relativeFile));
    for (const sidecar of sidecarsFor(relativeFile)) {
      await copyIfExists(path.join(sourceRoot, sidecar), path.join(targetRoot, sidecar));
    }

    const declarationFile = relativeFile.replace(/\.js$/, ".d.ts");
    const declaration = await readOptionalText(path.join(sourceRoot, declarationFile));
    for (const specifier of extractRelativeSpecifiers(source)) {
      const resolved = await resolveRelative(sourceRoot, relativeFile, specifier);
      if (resolved && shouldInclude(resolved, pkg)) {
        stack.push(resolved);
      }
    }
    if (declaration !== null) {
      for (const specifier of extractRelativeSpecifiers(declaration)) {
        const resolved = await resolveRelative(sourceRoot, declarationFile, specifier);
        if (resolved && shouldInclude(resolved, pkg)) {
          stack.push(resolved);
        }
      }
    }
  }
}

function shouldInclude(relativeFile, pkg) {
  if (!pkg.browserSafe) {
    return true;
  }
  return !relativeFile.startsWith("node/") && !relativeFile.startsWith("network/");
}

function extractRelativeSpecifiers(source) {
  const specifiers = [];
  const patterns = [
    /\b(?:import|export)\s+(?:[^"'`]*?\s+from\s+)?["'`]([^"'`]+)["'`]/g,
    /\bimport\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/g,
    /\brequire\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(source)) !== null) {
      const specifier = match[1];
      if (specifier?.startsWith(".")) {
        specifiers.push(specifier);
      }
    }
  }
  return specifiers;
}

async function resolveRelative(sourceRoot, fromRelativeFile, specifier) {
  const fromDirectory = path.dirname(path.join(sourceRoot, fromRelativeFile));
  const absoluteBase = path.resolve(fromDirectory, specifier);
  const candidates = [
    absoluteBase,
    `${absoluteBase}.js`,
    path.join(absoluteBase, "index.js"),
  ];

  for (const candidate of candidates) {
    if (await isFile(candidate)) {
      return path.relative(sourceRoot, candidate).replace(/\\/g, "/");
    }
  }
  return null;
}

function sidecarsFor(relativeFile) {
  if (!relativeFile.endsWith(".js")) {
    return [];
  }
  const base = relativeFile.slice(0, -3);
  return [
    `${relativeFile}.map`,
    `${base}.d.ts`,
    `${base}.d.ts.map`,
  ];
}

async function copyIfExists(source, target) {
  if (await isFile(source)) {
    await copyFile(source, target);
  }
}

async function copyFile(source, target) {
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(source, target);
}

async function readOptionalText(file) {
  try {
    return await fs.readFile(file, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function isFile(file) {
  try {
    return (await fs.stat(file)).isFile();
  } catch (error) {
    if (error?.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

function normalizeRelative(relativeFile) {
  return relativeFile?.replace(/\\/g, "/");
}

async function assertBrowserPackageSafe(targetDist) {
  for (const forbiddenDirectory of ["node", "network"]) {
    const forbiddenPath = path.join(targetDist, "esm", forbiddenDirectory);
    if (await pathExists(forbiddenPath)) {
      throw new Error(`Browser package dist must not include ${forbiddenDirectory}/`);
    }
  }

  const forbiddenStaticImport = /\b(?:import|export)\s+(?:[^"'`]*?\s+from\s+)?["'`]node:[^"'`]+["'`]|\brequire\s*\(\s*["'`]node:[^"'`]+["'`]\s*\)/;
  for await (const file of walk(targetDist)) {
    if (!file.endsWith(".js")) {
      continue;
    }
    const source = await fs.readFile(file, "utf8");
    if (forbiddenStaticImport.test(source)) {
      const relative = path.relative(targetDist, file).replace(/\\/g, "/");
      throw new Error(`Browser package dist has forbidden Node import in ${relative}`);
    }
  }
}

async function pathExists(file) {
  try {
    await fs.stat(file);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

async function* walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      yield* walk(file);
    } else if (entry.isFile()) {
      yield file;
    }
  }
}
