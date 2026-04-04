# Tasks: 018 — Scramble Cube Preview

**Input**: [spec.md](spec.md), [plan.md](plan.md)
**Branch**: `018-scramble-cube-preview` (merged to main)

> Retrospective task list — written after implementation.

## Phase 1: ScrambleCubePreview Component

- [x] T001 Create `ScrambleCubePreview.tsx` — TwistyPlayer with explicit px container, compact/expanded sizes, expand/collapse toggle icon
- [x] T002 Create `ScrambleCubePreview.css` — `.scramble-row` two-panel flex layout, `.scramble-cube-panel`, `.scramble-cube-panel--expanded`, mobile overrides

## Phase 2: PracticeSessionModal Integration

- [x] T003 Add `cubeExpanded` state to `PracticeSessionModal`
- [x] T004 Replace scramble display with `.scramble-row` (text panel + `ScrambleCubePreview` side-by-side)
- [x] T005 Conditionally hide timer block and stats block when `cubeExpanded === true`
- [x] T006 Pass `expanded` and `onToggleExpand` props to `ScrambleCubePreview`

## Phase 3: Polish

- [x] T007 Increase scramble text size to `1.15rem`, center-align, `text-wrap: balance`
- [x] T008 Fix Expand/Collapse All buttons in dark mode (add `is-light` class to unstyled Bulma buttons)
- [x] T009 Group Scramble/Start/Stop/Reset buttons into single `.timer-controls` row with `flex: 1` equal widths
- [x] T010 Solve count pill always visible from Solve: 0
- [x] T011 Mobile layout: compact cube panel, icon-only hint text

## Phase 4: Sign-off

- [x] T012 Visual QA on desktop and Xcode simulator (iPhone 16)
- [x] T013 Commit, merge to main, push to GitHub
