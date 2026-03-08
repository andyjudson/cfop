# Implementation Plan: Cubing Notation Reference Page

**Branch**: `010-notation-reference` | **Date**: 2026-03-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-notation-reference/spec.md`

## Summary

Add a new top-level Notation learning page in `cfop-app` that teaches face turns, modifiers, slices, rotations, and triggers in one reference experience. Reuse legacy **content and layout ideas only** (from `cubing.static/notation.html` and historical notation learning material) while implementing with existing `cfop-app` architecture (`CfopPageLayout`, current routing/navigation, existing CSS patterns). Place a `Notation` nav item between `Intuitive` and `Beginner`.

## Technical Context

**Language/Version**: TypeScript 5.x + React 19  
**Primary Dependencies**: React Router, Bulma CSS, existing `cfop-app` components (`CfopPageLayout`, existing navbar)  
**Storage**: Static asset files under `cfop-app/public/assets/notation` (no new persistence)  
**Testing**: Local production build (`npm run build`) + manual route/navigation/responsive checks  
**Target Platform**: Web SPA (desktop + mobile Safari baseline, ~393px width)  
**Project Type**: Frontend web application (single Vite SPA)  
**Performance Goals**: Static page render with no regressions to existing CFOP page load/interaction  
**Constraints**: Reuse content/layout ideas only; no legacy implementation copy; preserve existing page behavior; no horizontal scrolling in core content on small screens  
**Scale/Scope**: 1 new route/page + navbar update + static notation sections and trigger reference

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Source reviewed: repository constitution in `/constitution.md` (the memory constitution template file is non-operative placeholder text).

- **Educational Focus**: PASS — feature directly improves algorithm literacy.
- **Open Source & Accessibility**: PASS — static instructional content, no gated functionality.
- **Content Ownership**: PASS with guardrail — reuse approved notation concepts/assets; do not copy legacy implementation code.
- **Technology Choices**: PASS — React/TypeScript/Vite/Bulma stack retained.
- **Scope Limitations**: PASS — informational page only; no accounts, monetization, or competitive features.
- **Quality Standards**: PASS — requires responsive readability and non-regression of existing CFOP pages.

## Project Structure

### Documentation (this feature)

```text
specs/010-notation-reference/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
cfop-app/
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── components/
│   │   └── CfopNavigation.tsx
│   └── pages/
│       └── NotationPage.tsx
└── public/
    └── assets/
        └── notation/
```

**Structure Decision**: Extend existing frontend SPA only; no backend, no new workspace, no new package boundaries.

## Post-Design Constitution Check (Phase 1 Re-check)

- **Educational intent preserved**: PASS — sections map directly to learner notation comprehension.
- **No implementation copying from legacy app**: PASS by design contract — only content concepts and image assets are reused.
- **Consistency with existing app architecture**: PASS — same routing/nav/layout patterns.
- **Non-regression expectation**: PASS — build + manual checks included in quickstart.

## Complexity Tracking

No constitutional violations requiring exception.
