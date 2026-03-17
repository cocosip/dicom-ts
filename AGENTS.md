# Project Workflow

## Project Identity

- Project name: dicom-ts
- System name: codex-mem
- Default memory scope: current project

## Memory Rules

- At the start of a fresh session in this repository, call `memory_bootstrap_session`.
- Save a memory note when work produces a lasting decision, bugfix insight, reusable discovery, or durable implementation constraint.
- Save a handoff before pausing, switching tasks, or ending the session.
- Prefer notes for durable codec behavior, transfer syntax mapping, parser edge cases, fixture discoveries, and compatibility constraints.

## Related Project Policy

- Related-project memory is allowed only when the task clearly depends on another repository in the same system.
- Typical examples include API contracts, schema changes, generated clients, deployment coordination, integration debugging, and codec compatibility work.
- Do not pull memory from unrelated projects by default.

## Preferred Tags

- Use tags where useful, especially: dicom, codec, transcoding, transfer-syntax, imaging

## Project-Specific Notes

- `dicom-ts` is a pure TypeScript DICOM implementation for Node.js, ported from `fo-dicom`.
- Keep the runtime dependency model unchanged unless the user explicitly requests otherwise: TypeScript/JavaScript packages plus Node built-ins only.
- Do not add native or binary runtime dependencies for codec support.
- Treat `dist/` as build output; prefer editing `src/`, `tests/`, `scripts/`, and `tools/`.
- Run `npm test` for behavioral verification. Run `npm run build` when exports, generated output, or public typing may be affected.
- Prefer explicit transfer syntax names and UIDs in notes, tests, plans, and handoffs to avoid ambiguity.

## Codec Reference Map (fo-dicom.Codecs)

When working on image codec or transcoder tasks, especially Phase 10.5, use `source-code/fo-dicom.Codecs/` as an additional read-only reference.

- `source-code/fo-dicom.Codecs/Codec/`
  - C# codec manager and transfer syntax binding layer.
  - Maps each DICOM transfer syntax to one concrete `IDicomCodec` implementation.
  - Key file: `NativeTranscoderManager.cs` for codec discovery and registration behavior.
- `source-code/fo-dicom.Codecs/Native/`
  - Native C/C++ bridge code and third-party codec libraries used by `fo-dicom.Codecs`.
  - Includes bindings and wrappers for `libijg*` (JPEG), `CharLS` (JPEG-LS), `OpenJPEG` (J2K), and `OpenJPH` (HTJ2K).
  - Treat this as behavior reference only; do not add a native runtime dependency to `dicom-ts`.
- `source-code/fo-dicom.Codecs/Tests/`
  - Acceptance and unit tests with real compressed DICOM fixtures.
  - Use these as compatibility and regression references when creating `dicom-ts` codec tests.

## Codec Implementation Guardrails

- Keep the `dicom-ts` runtime dependency model unchanged: pure TypeScript plus Node built-ins.
- For Phase 10.5, use the split strategy:
  - In-tree pure TypeScript: RLE plus JPEG Lossless Process 14 family.
  - Plugin-only with no built-in binary: JPEG baseline and extended, JPEG-LS, JPEG 2000, and HTJ2K.
- Align transfer syntax behavior with both references:
  - `source-code/fo-dicom/FO-DICOM.Core/Imaging/Codec/`
  - `source-code/fo-dicom.Codecs/Codec/`

## Phase 10.5 Required Codec Coverage

The following transfer syntaxes are mandatory targets for codec planning and implementation:

- JPEG Family
  - JPEG Baseline (Process 1), lossy 8-bit: `1.2.840.10008.1.2.4.50`
  - JPEG Extended (Process 2 and 4), lossy 8/12-bit: `1.2.840.10008.1.2.4.51`
  - JPEG Lossless (Process 14), all predictors: `1.2.840.10008.1.2.4.57`
  - JPEG Lossless SV1 (Process 14, predictor 1): `1.2.840.10008.1.2.4.70`
- JPEG-LS Family
  - JPEG-LS Lossless: `1.2.840.10008.1.2.4.80`
  - JPEG-LS Near-Lossless: `1.2.840.10008.1.2.4.81`
- JPEG 2000 Family
  - JPEG 2000 Lossless: `1.2.840.10008.1.2.4.90`
  - JPEG 2000 (lossy/lossless): `1.2.840.10008.1.2.4.91`
  - JPEG 2000 Multi-component Lossless: `1.2.840.10008.1.2.4.92`
  - JPEG 2000 Multi-component: `1.2.840.10008.1.2.4.93`

## System Relationships

- This repository belongs to system: codex-mem
- Related repositories may include: fo-dicom, fo-dicom.Codecs
- Use related-project memory only when the current task depends on one of those repositories or on another clearly related repository in the same system.

## Cross-Repo Memory Rules

- Prefer current-project memory first.
- Expand to related repositories only for integration-relevant or codec-compatibility work.
- When using related-project memory, mention the source repository explicitly in your reasoning and outputs.
