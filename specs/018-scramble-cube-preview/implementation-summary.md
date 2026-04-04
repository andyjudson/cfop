# Implementation Summary: 018 — Scramble Cube Preview

**Status**: Complete | **Merged**: 2026-04-04

## What Was Built

- `ScrambleCubePreview` component: compact TwistyPlayer rendered inline in the Practice Timer modal alongside the scramble text. Tapping expands the cube to fill the modal, hiding the timer and stats blocks.
- Two-panel `.scramble-row` layout: text left, cube right on all screen sizes (including mobile).

## Key Technical Finding

TwistyPlayer's canvas will not initialise unless the container has an explicit non-zero height at mount time (`IntersectionObserver` gate). The fix is **explicit `width`/`height` px values via inline style on the container div** — CSS flex/auto sizing alone is not enough. This is now documented in `CLAUDE.md` under "TwistyPlayer In-Browser Usage".

## Files Changed

| File | Change |
|------|--------|
| `ScrambleCubePreview.tsx` | New component |
| `ScrambleCubePreview.css` | New styles |
| `PracticeSessionModal.tsx` | Scramble-row layout, cubeExpanded state, conditional timer/stats hide, unified button row |
| `PracticeSessionModal.css` | Scramble text size, timer-body, mobile overrides |
| `ExpandCollapseControls.tsx` | `is-light` added to fix dark mode black buttons |
| `VisualizerModal.tsx` | Speed range expanded to 6× via preset steps array |
| `CLAUDE.md` | TwistyPlayer usage guidelines added |
