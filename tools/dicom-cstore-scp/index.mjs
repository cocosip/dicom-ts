#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const options = parseArgs(args);

if (options.help) {
  printHelp();
  process.exit(0);
}

if (options.error) {
  console.error(`[tool] ${options.error}`);
  printHelp();
  process.exit(1);
}

const dicom = await loadDicomTs();
if (!dicom) {
  process.exit(1);
}

if (!validateAeTitle(dicom, options.aeTitle, "--ae")) {
  process.exit(1);
}

const allowedCallingAEs = parseAllowCallingAes(options.allowCallingAesRaw);
if (!validateAllowCallingAes(dicom, allowedCallingAEs)) {
  process.exit(1);
}

const resolvedOutputDir = path.resolve(options.outputDir);
await fs.mkdir(resolvedOutputDir, { recursive: true });

const runtime = {
  expectedCalledAE: normalizeAe(options.aeTitle),
  allowedCallingAEs: allowedCallingAEs ? new Set(allowedCallingAEs.map((ae) => normalizeAe(ae))) : null,
  outputDir: resolvedOutputDir,
  savedCount: 0,
  fallbackCounter: 0,
};

const serviceCtor = createCStoreScpServiceCtor(dicom, runtime);
const server = dicom.DicomServerFactory.create(
  (_socket, association, serviceOptions) => new serviceCtor(association, serviceOptions),
  {
    host: options.host,
    port: options.port,
  },
);

try {
  await server.start();
  console.log(`[scp] Listening on ${server.host}:${server.port}`);
  console.log(`[scp] Called AE: ${runtime.expectedCalledAE}`);
  console.log(`[scp] Output dir: ${runtime.outputDir}`);
  if (runtime.allowedCallingAEs) {
    console.log(`[scp] Allowed Calling AEs: ${Array.from(runtime.allowedCallingAEs).join(", ")}`);
  } else {
    console.log("[scp] Allowed Calling AEs: *");
  }
  console.log("[scp] Press Ctrl+C to stop.");

  await waitForShutdownSignal(server);
} catch (error) {
  console.error(`[scp] Failed to start or run SCP: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}

function createCStoreScpServiceCtor(dicom, runtime) {
  return class CStoreScpService extends dicom.DicomCEchoProvider {
    constructor(association, serviceOptions = {}) {
      super(association, {
        ...serviceOptions,
        autoSendAssociationAccept: false,
      });
    }

    async onReceiveAssociationRequest(association) {
      const calledAE = normalizeAe(association.calledAE);
      const callingAE = normalizeAe(association.callingAE);

      if (calledAE !== runtime.expectedCalledAE) {
        console.error(`[scp] Reject association: called AE mismatch (expected=${runtime.expectedCalledAE}, got=${calledAE || "-"})`);
        await this.rejectAssociation(dicom.DicomRejectReason.CalledAENotRecognized);
        return;
      }

      if (runtime.allowedCallingAEs && !runtime.allowedCallingAEs.has(callingAE)) {
        console.error(`[scp] Reject association: calling AE not allowed (got=${callingAE || "-"})`);
        await this.rejectAssociation(dicom.DicomRejectReason.CallingAENotRecognized);
        return;
      }

      acceptPresentationContexts(dicom, association);
      await this.sendPDU(new dicom.AAssociateAC(association));
      console.error(
        `[scp] Association accepted: calling=${callingAE || "-"} called=${calledAE || "-"} `
        + `from ${association.remoteHost || "-"}:${association.remotePort || 0}`,
      );
    }

    async onCStoreRequest(request) {
      try {
        if (!request.dataset) {
          console.error("[scp] Reject C-STORE without dataset.");
          return new dicom.DicomCStoreResponse(request, dicom.DicomStatus.StorageCannotUnderstand.code);
        }

        const file = new dicom.DicomFile(request.dataset);
        const sopInstanceUID = request.sopInstanceUID?.uid ?? request.dataset.tryGetString(dicom.DicomTags.SOPInstanceUID) ?? "";
        const sopClassUID = request.sopClassUID?.uid ?? request.dataset.tryGetString(dicom.DicomTags.SOPClassUID) ?? "";
        const outputPath = await allocateOutputPath(runtime, sopInstanceUID);
        await file.save(outputPath);

        runtime.savedCount += 1;
        console.error(
          `[scp] Stored #${runtime.savedCount}: ${outputPath} `
          + `(SOPClass=${sopClassUID || "-"}, SOPInstance=${sopInstanceUID || "-"})`,
        );
        return new dicom.DicomCStoreResponse(request, dicom.DicomStatus.Success.code);
      } catch (error) {
        console.error(`[scp] Failed to store C-STORE dataset: ${error instanceof Error ? error.message : String(error)}`);
        return new dicom.DicomCStoreResponse(request, dicom.DicomStatus.ProcessingFailure.code);
      }
    }

    async onCStoreRequestException(_tempFileName, error) {
      console.error(`[scp] C-STORE exception callback: ${error instanceof Error ? error.message : String(error)}`);
    }

    async onReceiveAssociationReleaseRequest() {
      console.error("[scp] Association release requested.");
    }

    onReceiveAbort(source, reason) {
      console.error(`[scp] Association aborted: source=${String(source)} reason=${String(reason)}`);
    }

    onConnectionClosed(error) {
      if (error) {
        console.error(`[scp] Connection closed with error: ${error.message}`);
      } else {
        console.error("[scp] Connection closed.");
      }
    }

    async rejectAssociation(reason) {
      await this.sendPDU(
        new dicom.AAssociateRJ(
          dicom.DicomRejectResult.Permanent,
          dicom.DicomRejectSource.ServiceUser,
          reason,
        ),
      );
      this.disconnect();
    }
  };
}

function parseAllowCallingAes(raw) {
  if (raw === null) {
    return null;
  }
  const values = raw.split(",").map((v) => v.trim()).filter(Boolean);
  if (values.length === 0) {
    return null;
  }
  return values;
}

function validateAllowCallingAes(dicom, allowList) {
  if (!allowList) {
    return true;
  }
  for (const ae of allowList) {
    if (!validateAeTitle(dicom, ae, "--allow-calling-ae")) {
      return false;
    }
  }
  return true;
}

function validateAeTitle(dicom, value, optionName) {
  try {
    dicom.DicomValidation.validateAE(value);
    return true;
  } catch (error) {
    console.error(`[tool] Invalid AE title for ${optionName}: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

function normalizeAe(value) {
  return String(value ?? "").trim();
}

function acceptPresentationContexts(dicom, association) {
  for (const context of association.presentationContexts) {
    if (context.result !== dicom.DicomPresentationContextResult.Proposed) {
      continue;
    }
    const syntax = context.getTransferSyntaxes()[0] ?? dicom.DicomTransferSyntax.ImplicitVRLittleEndian;
    context.setResult(dicom.DicomPresentationContextResult.Accept, syntax);
  }
}

async function allocateOutputPath(runtime, sopInstanceUID) {
  const base = sanitizeFilename(sopInstanceUID || nextFallbackBaseName(runtime));
  const initial = path.join(runtime.outputDir, `${base}.dcm`);
  if (!(await pathExists(initial))) {
    return initial;
  }

  let index = 1;
  while (true) {
    const candidate = path.join(runtime.outputDir, `${base}-${index}.dcm`);
    if (!(await pathExists(candidate))) {
      return candidate;
    }
    index += 1;
  }
}

function nextFallbackBaseName(runtime) {
  runtime.fallbackCounter += 1;
  return `received-${Date.now()}-${runtime.fallbackCounter}`;
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function sanitizeFilename(value) {
  return value.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 180) || "received";
}

async function waitForShutdownSignal(server) {
  await new Promise((resolve) => {
    let stopping = false;

    const shutdown = async (signal) => {
      if (stopping) {
        return;
      }
      stopping = true;
      console.error(`[scp] ${signal} received, stopping server...`);
      await server.stop();
      console.error("[scp] Server stopped.");
      resolve(undefined);
    };

    process.once("SIGINT", () => {
      void shutdown("SIGINT");
    });
    process.once("SIGTERM", () => {
      void shutdown("SIGTERM");
    });
  });
}

async function loadDicomTs() {
  try {
    return await import("../../dist/esm/index.js");
  } catch {
    console.error("[tool] dist/esm not found. Building automatically...");
    const buildResult = spawnSync("npm", ["run", "build:esm"], {
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    if (buildResult.status !== 0) {
      console.error("[tool] Auto build failed. Run: npm run build");
      return null;
    }

    try {
      return await import("../../dist/esm/index.js");
    } catch {
      console.error("[tool] Build succeeded but dist/esm still cannot be loaded.");
      return null;
    }
  }
}

function parseArgs(argv) {
  const result = {
    host: "0.0.0.0",
    port: 104,
    aeTitle: "DICOMTS_SCP",
    allowCallingAesRaw: null,
    outputDir: "./received",
    help: false,
    error: null,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") {
      result.help = true;
      continue;
    }
    if (arg === "--host") {
      const value = argv[i + 1] ?? "";
      if (!value || value.startsWith("-")) {
        result.error = "Option --host requires a value.";
      } else {
        result.host = value;
        i++;
      }
      continue;
    }
    if (arg === "--port") {
      const value = Number(argv[i + 1] ?? "");
      if (!Number.isInteger(value) || value < 1 || value > 65535) {
        result.error = "Option --port requires an integer between 1 and 65535.";
      } else {
        result.port = value;
        i++;
      }
      continue;
    }
    if (arg === "--ae") {
      const value = argv[i + 1] ?? "";
      if (!value || value.startsWith("-")) {
        result.error = "Option --ae requires a value.";
      } else {
        result.aeTitle = value;
        i++;
      }
      continue;
    }
    if (arg === "--allow-calling-ae") {
      const value = argv[i + 1] ?? "";
      if (!value || value.startsWith("-")) {
        result.error = "Option --allow-calling-ae requires a comma-separated value.";
      } else {
        result.allowCallingAesRaw = value;
        i++;
      }
      continue;
    }
    if (arg === "--out-dir") {
      const value = argv[i + 1] ?? "";
      if (!value || value.startsWith("-")) {
        result.error = "Option --out-dir requires a path.";
      } else {
        result.outputDir = value;
        i++;
      }
      continue;
    }
    if (arg.startsWith("-")) {
      result.error = `Unknown option: ${arg}`;
    } else {
      result.error = `Unexpected argument: ${arg}`;
    }
  }

  return result;
}

function printHelp() {
  console.log(`dicom-ts tool: C-STORE SCP

Usage:
  node tools/dicom-cstore-scp/index.mjs [options]

Options:
  --host <host>               Bind host (default: 0.0.0.0)
  --port <port>               Bind port (default: 104)
  --ae <ae>                   Local called AE title (default: DICOMTS_SCP)
  --allow-calling-ae <list>   Comma-separated allowed calling AEs (default: allow all)
  --out-dir <dir>             Directory for received DICOM files (default: ./received)
  -h, --help                  Show help

Example:
  node tools/dicom-cstore-scp/index.mjs --port 11112 --ae MY_SCP --allow-calling-ae MY_SCU --out-dir ./incoming
`);
}
