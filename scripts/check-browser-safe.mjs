import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const entry = path.join(root, "src", "browser", "index.ts");

const forbidden = [
  /^node:/,
  /^(fs|path|stream|net|tls|zlib|crypto|os|child_process)$/i,
];

const visited = new Set();
const stack = [entry];
const offenders = [];

while (stack.length > 0) {
  const file = stack.pop();
  if (!file || visited.has(file)) {
    continue;
  }
  visited.add(file);

  const source = fs.readFileSync(file, "utf8");
  const importSpecifiers = extractImports(source);

  for (const specifier of importSpecifiers) {
    if (isForbidden(specifier)) {
      offenders.push({ file, specifier });
      continue;
    }

    if (!specifier.startsWith(".")) {
      continue;
    }

    const resolved = resolveRelative(file, specifier);
    if (resolved) {
      stack.push(resolved);
    }
  }
}

if (offenders.length > 0) {
  for (const offender of offenders) {
    const relative = path.relative(root, offender.file).replace(/\\/g, "/");
    console.error(`[browser-safe] forbidden import "${offender.specifier}" in ${relative}`);
  }
  process.exit(1);
}

console.log(`[browser-safe] ok (${visited.size} files checked)`);

function extractImports(source) {
  const out = [];
  const regex = /\b(?:import|export)\s+(?:[^"'`]*?\s+from\s+)?["'`]([^"'`]+)["'`]/g;
  let match;
  while ((match = regex.exec(source)) !== null) {
    out.push(match[1]);
  }
  return out;
}

function isForbidden(specifier) {
  return forbidden.some((rule) => rule.test(specifier));
}

function resolveRelative(fromFile, specifier) {
  const base = path.resolve(path.dirname(fromFile), specifier);
  const noJsExt = base.replace(/\.(c|m)?js$/i, "");
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.mts`,
    `${base}.cts`,
    `${noJsExt}.ts`,
    `${noJsExt}.tsx`,
    `${noJsExt}.mts`,
    `${noJsExt}.cts`,
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  for (const ext of [".ts", ".tsx", ".mts", ".cts"]) {
    const indexFile = path.join(base, `index${ext}`);
    if (fs.existsSync(indexFile) && fs.statSync(indexFile).isFile()) {
      return indexFile;
    }
  }
  return null;
}
