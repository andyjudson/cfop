# Implementation Plan: Fallback Scramble Generator (Non-Official)

**Branch**: `[006-fallback-scramble-generator]` | **Date**: 2026-03-08 | **Spec**: [specs/006-fallback-scramble-generator/spec.md](specs/006-fallback-scramble-generator/spec.md)
**Input**: Feature specification from `/specs/006-fallback-scramble-generator/spec.md`

## Summary

Replace runtime dependency on `cubing/scramble` workers with a local deterministic-rule scramble generator for 3x3 practice in `cfop-app`, preserve existing practice UX (timer + stats), enforce parseable 20-move output and failure handling (1000ms timeout, last-valid scramble retention), then simplify Vite config by removing scramble-worker-specific workarounds once no runtime imports remain.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19, Node/npm (Vite 7)  
**Primary Dependencies**: React, cubing (`Alg` parser compatibility), Vite, Bulma  
**Storage**: Browser `localStorage` (existing solve stats only; no new persistence)  
**Testing**: `tsc -b && vite build` plus manual regression/smoke checks (no dedicated automated test runner configured in this app)  
**Target Platform**: Modern browsers, static-hosted deployment (GitHub Pages path base)  
**Project Type**: Frontend SPA (`cfop-app`)  
**Performance Goals**: Scramble generation resolves or fails fast within 1000ms; no persistent loading hang; stable rapid-click behavior  
**Constraints**: Fixed 20-move output, no runtime `cubing/scramble`/`cubing/search`, preserve modal/timer/stats UX, practice-grade only  
**Scale/Scope**: Single practice flow (`PracticeSessionModal`) with dozens of scramble requests per session

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- `.specify/memory/constitution.md` is a placeholder template and defines no enforceable project principles or hard gates.
- **Initial Gate Result: PASS** (no constitutional violations detectable).
- Governance fallback: enforce quality through feature requirements/success criteria and build validation.
- **Post-Design Gate Result: PASS** (Phase 1 artifacts introduce no governance conflicts; requirements and acceptance criteria remain traceable).

## Project Structure

### Documentation (this feature)

```text
specs/006-fallback-scramble-generator/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── scramble-generator-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
cfop-app/
├── src/
│   ├── components/
│   │   └── PracticeSessionModal.tsx
│   ├── utils/
│   │   ├── scramble.ts
│   │   └── scrambleGenerator.ts   # new
│   └── types/
│       └── practice.ts
├── vite.config.ts
└── package.json
```

**Structure Decision**: Keep the existing single-app structure; implement fallback generation in `src/utils` and integrate through current practice modal flow.

## Complexity Tracking

No constitution violations or exceptional complexity justifications are required at planning time.