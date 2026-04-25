# Implementation Plan: Feature 007 - Cube Image Generator Tool

**Branch**: `[007-cube-image-generator]` | **Date**: 2026-03-08 | **Spec**: [specs/007-cube-image-generator/spec.md](specs/007-cube-image-generator/spec.md)
**Input**: Feature specification from `/specs/007-cube-image-generator/spec.md`

## Summary

Build a standalone React/Vite app at `cubify-app/` that uses cubing.js `TwistyPlayer` for 3x3 visualization and deterministic image export workflows. The tool provides controlled form inputs (setup/move algorithm, mode, anchor, mask), preset + custom mask logic, Apply/Play/Capture actions, and fixed output behavior (288×288 PNG in 3D, fixed-viewBox SVG in 2D), plus inline validation and developer console logging for inverted algorithms.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19  
**Primary Dependencies**: `cubing` (TwistyPlayer + Alg), `react`, `react-dom`, `vite`, `bulma`  
**Storage**: N/A (no persistence required)  
**Testing**: `npm run build` + manual validation checklist (captures, masks, keyboard, invalid-input handling)  
**Target Platform**: Modern desktop browsers (Chrome/Safari/Edge), static-hostable web app  
**Project Type**: Standalone frontend SPA tool (`cubify-app`)  
**Performance Goals**: Apply/render interactions remain responsive; 10 consecutive captures without UI freeze; normal 3D PNG target ≤200KB  
**Constraints**: 3x3-only scope; fixed 288×288 PNG in 3D; fixed-viewBox SVG in 2D; invalid input must preserve text; Play/Capture disabled for empty/invalid algorithm; strict standalone isolation from `cfop-app` (no cross-app links/routes/runtime coupling)  
**Scale/Scope**: Single tool app with one main page, one TwistyPlayer instance, and controlled form/action workflow

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- `.specify/memory/constitution.md` remains a placeholder template without enforceable rules.
- Initial Gate Result: **PASS** (no defined constitutional constraints violated).
- Quality enforcement basis: feature spec FR/SC requirements + build/manual validation gates.
- Post-Design Gate Result: **PASS** (research, data model, contracts, and quickstart are aligned with feature requirements and contain no governance conflicts).

## Project Structure

### Documentation (this feature)

```text
specs/007-cube-image-generator/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── cube-image-generator-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
cubify-app/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── App.css
    ├── index.css
    ├── components/
    │   ├── CubeViewer.tsx
    │   ├── ControlForm.tsx
    │   └── ActionButtons.tsx
    ├── types/
    │   └── imageGenerator.ts
    └── utils/
        ├── maskPresets.ts
        ├── algUtils.ts
        └── captureUtils.ts
```

**Structure Decision**: Use a standalone frontend app (`cubify-app`) to isolate developer tooling concerns from `cfop-app`, while keeping shared visual conventions (Bulma + project styling principles) and enforcing no cross-app navigation/runtime dependencies.

## Phase 0 Research (Completed)

Research decisions are documented in [specs/007-cube-image-generator/research.md](specs/007-cube-image-generator/research.md), including:
- TwistyPlayer rendering/capture workflow by visualization mode
- Mask preset precedence + custom override behavior
- Validation and button enablement strategy
- PNG size target handling and quality checks

## Phase 1 Design & Contracts (Completed)

- Data model documented in [specs/007-cube-image-generator/data-model.md](specs/007-cube-image-generator/data-model.md)
- Interface contract documented in [specs/007-cube-image-generator/contracts/cube-image-generator-contract.md](specs/007-cube-image-generator/contracts/cube-image-generator-contract.md)
- Manual validation flow documented in [specs/007-cube-image-generator/quickstart.md](specs/007-cube-image-generator/quickstart.md)
- Agent context updated via `.specify/scripts/bash/update-agent-context.sh copilot`

## Complexity Tracking

No constitution violations or extra complexity exemptions are required for this plan.
