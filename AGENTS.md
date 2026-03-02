# AGENTS.md

<INSTRUCTIONS>
## Skills
A skill is a set of local instructions to follow that is stored in a `SKILL.md` file. Below is the list of skills that can be used. Each entry includes a name, description, and file path so you can open the source for full instructions when using a specific skill.
### Available skills
- skill-creator: Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Codex's capabilities with specialized knowledge, workflows, or tool integrations. (file: C:/Users/11855/.codex/skills/.system/skill-creator/SKILL.md)
- skill-installer: Install Codex skills into $CODEX_HOME/skills from a curated list or a GitHub repo path. Use when a user asks to list installable skills, install a curated skill, or install a skill from another repo (including private repos). (file: C:/Users/11855/.codex/skills/.system/skill-installer/SKILL.md)
### How to use skills
- Discovery: The list above is the skills available in this session (name + description + file path). Skill bodies live on disk at the listed paths.
- Trigger rules: If the user names a skill (with `$SkillName` or plain text) OR the task clearly matches a skill's description shown above, you must use that skill for that turn. Multiple mentions mean use them all. Do not carry skills across turns unless re-mentioned.
- Missing/blocked: If a named skill isn't in the list or the path can't be read, say so briefly and continue with the best fallback.
- How to use a skill (progressive disclosure):
  1) After deciding to use a skill, open its `SKILL.md`. Read only enough to follow the workflow.
  2) When `SKILL.md` references relative paths (e.g., `scripts/foo.py`), resolve them relative to the skill directory listed above first, and only consider other paths if needed.
  3) If `SKILL.md` points to extra folders such as `references/`, load only the specific files needed for the request; don't bulk-load everything.
  4) If `scripts/` exist, prefer running or patching them instead of retyping large code blocks.
  5) If `assets/` or templates exist, reuse them instead of recreating from scratch.
- Coordination and sequencing:
  - If multiple skills apply, choose the minimal set that covers the request and state the order you'll use them.
  - Announce which skill(s) you're using and why (one short line). If you skip an obvious skill, say why.
- Context hygiene:
  - Keep context small: summarize long sections instead of pasting them; only load extra files when needed.
  - Avoid deep reference-chasing: prefer opening only files directly linked from `SKILL.md` unless you're blocked.
  - When variants exist (frameworks, providers, domains), pick only the relevant reference file(s) and note that choice.
- Safety and fallback: If a skill can't be applied cleanly (missing files, unclear instructions), state the issue, pick the next-best approach, and continue.
</INSTRUCTIONS>

## Codec Reference Map (fo-dicom.Codecs)

When working on image codec/transcoder tasks (Phase 10.5), use `source-code/fo-dicom.Codecs/` as an additional read-only reference.

- `source-code/fo-dicom.Codecs/Codec/`
  - C# codec manager + transfer syntax binding layer.
  - Maps each DICOM transfer syntax to one concrete `IDicomCodec` implementation.
  - Key file: `NativeTranscoderManager.cs` (codec discovery/registration).
- `source-code/fo-dicom.Codecs/Native/`
  - Native C/C++ bridge code and third-party codec libraries used by fo-dicom.Codecs.
  - Includes bindings/wrappers for `libijg*` (JPEG), `CharLS` (JPEG-LS), `OpenJPEG` (J2K), `OpenJPH` (HTJ2K).
  - Treat as behavior reference only; do not add native runtime dependency to `dicom-ts`.
- `source-code/fo-dicom.Codecs/Tests/`
  - Acceptance and unit tests with real compressed DICOM fixtures.
  - Use as compatibility and regression reference when creating `dicom-ts` codec tests.

## Codec Implementation Guardrails

- Keep `dicom-ts` runtime dependency model unchanged: pure TypeScript + Node built-ins.
- For Phase 10.5, use split strategy:
  - In-tree pure TS: RLE + JPEG Lossless Process 14 family.
  - Plugin-only (no built-in binary): JPEG baseline/extended, JPEG-LS, JPEG2000, HTJ2K.
- Align transfer syntax behavior with both references:
  - `source-code/fo-dicom/FO-DICOM.Core/Imaging/Codec/`
  - `source-code/fo-dicom.Codecs/Codec/`

## Phase 10.5 Required Codec Coverage

The following transfer syntaxes are mandatory targets for codec planning and implementation:

- JPEG Family
  - JPEG Baseline (Process 1), lossy 8-bit: `1.2.840.10008.1.2.4.50`
  - JPEG Extended (Process 2 & 4), lossy 8/12-bit: `1.2.840.10008.1.2.4.51`
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
