# Implementation Plan: Persistent Solve Time Stats

**Branch**: `[005-track-solve-stats]` | **Date**: 2026-03-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-track-solve-stats/spec.md`

## Summary

Extend the existing practice timer modal by persisting completed solve times in browser local storage and exposing three derived stats in the modal: last solve, average of last 5 solves, and best solve. The design uses a versioned storage envelope with runtime validation and corruption-safe fallback to preserve UX stability.

## Technical Context

**Language/Version**: TypeScript 5.9 (React 19)  
**Primary Dependencies**: React, Vite, `cubing`, Bulma, `react-icons`  
**Storage**: Browser `localStorage` (versioned JSON envelope)  
**Testing**: Type-check/build (`tsc -b`, `vite build`) + manual browser verification checklist  
**Target Platform**: Modern desktop/mobile browsers  
**Project Type**: Frontend single-page web application  
**Performance Goals**: Stats update immediately on solve stop; no noticeable UI lag during timer run  
**Constraints**: Client-side only, no backend sync, robust handling of invalid/corrupt stored data, maintain existing timer/scramble behavior  
**Scale/Scope**: Single modal feature extension; small solve history retained locally with bounded size

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Constitution reviewed: [`.specify/memory/constitution.md`](../../.specify/memory/constitution.md)
- Result: Constitution file is still placeholder/template content with no enforceable principles.
- Gate status (pre-research): **PASS** (no active constitutional constraints to violate)

## Project Structure

### Documentation (this feature)

```text
specs/005-track-solve-stats/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── stats-ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
cfop-app/
├── src/
│   ├── components/
│   │   ├── PracticeSessionModal.tsx
│   │   └── PracticeSessionModal.css
│   ├── hooks/
│   │   └── useSolveTimer.ts
│   ├── types/
│   │   └── practice.ts
│   └── utils/
│       └── timeFormat.ts
├── public/
│   ├── assets -> ../shared-assets (symlink)
│   └── data -> ../shared-data (symlink)
└── package.json
```

**Structure Decision**: Implement Feature 005 by extending existing practice-modal components and utility/types under `cfop-app/src`; no new app/module split is needed.

## Phase Plan

### Phase 0 — Research

1. Define local storage data contract, validation, and corruption handling strategy.
2. Decide user-facing behavior for average-of-5 with partial solve counts.
3. Define React integration pattern for read/write timing with minimal re-render overhead.

Output: [research.md](./research.md)

### Phase 1 — Design & Contracts

1. Model solve records, persisted envelope, and derived stat entities.
2. Define UI/state contract for stat display updates and empty/invalid data handling.
3. Author quickstart validation checklist for stat persistence and calculations.
4. Update agent context file for this plan’s technologies.

Outputs:
- [data-model.md](./data-model.md)
- [contracts/stats-ui-contract.md](./contracts/stats-ui-contract.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- Re-evaluated after Phase 1 outputs.
- Status: **PASS** (no enforceable constitution rules currently defined; no unresolved clarifications remain).

## Complexity Tracking

No constitutional violations or complexity exceptions identified.
