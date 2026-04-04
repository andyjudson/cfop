# Implementation Plan: 018 — Scramble Cube Preview

**Branch**: `018-scramble-cube-preview` | **Date**: 2026-04-04 | **Spec**: [spec.md](spec.md)

> Retrospective plan — written after implementation for completeness.

## Summary

Adds a `ScrambleCubePreview` component to the Practice Timer modal. A compact TwistyPlayer renders the current scrambled cube state inline alongside the scramble text (two-panel row layout). Tapping the cube toggles an expanded view that fills the modal and hides the timer and stats blocks.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19
**Primary Dependencies**: cubing.js `TwistyPlayer`, Bulma CSS
**Storage**: N/A — ephemeral state only
**Testing**: Playwright smoke tests (manual)
**Target Platform**: Web — iPhone 16 primary mobile baseline

## Key Design Decisions

- **Explicit px dimensions on TwistyPlayer container**: TwistyPlayer gates canvas init behind an `IntersectionObserver` — `intersectionRect.height` must be > 0 at mount. Container must have explicit `width` and `height` via inline style. Flex/auto sizing alone is insufficient.
- **Two-panel row**: `.scramble-row` flex row — text panel left (`flex:1`), cube panel right (`flex-shrink:0`). On mobile ≤480px the cube panel remains side-by-side but compact.
- **Expand/collapse**: `cubeExpanded` boolean in `PracticeSessionModal` passed to `ScrambleCubePreview`. When expanded, the timer block and stats block are conditionally hidden (`{!cubeExpanded && ...}`).
- **`background: 'none'`**: TwistyPlayer renders transparent, blending with modal background in both themes.
- **Icon-only hint on mobile**: `.scramble-cube-hint { font-size: 0 }` hides the text label on narrow screens, keeping the icon.

## Project Structure

```text
cfop-app/src/components/
├── ScrambleCubePreview.tsx      (new)
├── ScrambleCubePreview.css      (new — two-panel row, cube panel, expand state)
├── PracticeSessionModal.tsx     (modified — scramble-row layout, cubeExpanded state, timer/stats conditional hide)
└── PracticeSessionModal.css     (modified — scramble-text sizing, timer-body, mobile overrides)
```
