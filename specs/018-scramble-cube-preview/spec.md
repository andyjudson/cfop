# Feature Specification: Scramble Cube Preview

**Feature Branch**: `018-scramble-cube-preview`
**Created**: 2026-04-04
**Status**: Draft

## Overview

Add a live 3D cube visualisation to the Practice Timer modal showing the current scrambled state. The cube renders inline within the modal at a compact size and can be expanded to fill the modal (hiding all timer controls) for a closer look during inspection.

---

## User Scenarios & Testing

### User Story 1 - Inline scramble preview (Priority: P1)

A cuber opens the Practice Timer and sees a small 3D cube rendering the current scrambled state alongside the scramble notation. They can glance at it to orient themselves before starting the timer.

**Why this priority**: Core feature value — the scramble notation alone is abstract; the cube makes the state immediately readable.

**Independent Test**: Open Practice Timer modal, verify a 3D cube appears showing the scrambled state. Confirm it updates when a new scramble is generated (after completing a solve).

**Acceptance Scenarios**:

1. **Given** the Practice Timer modal is open, **When** a scramble is generated, **Then** a 3D cube appears showing the scrambled state with green front and white top.
2. **Given** a solve completes and a new scramble is generated, **When** the modal updates, **Then** the cube re-renders to show the new scrambled state.
3. **Given** Champion mode is active, **When** a WCA scramble is loaded, **Then** the cube renders that scramble's state.

---

### User Story 2 - Expanded cube view (Priority: P2)

The cuber taps the cube to expand it, hiding all timer controls and scramble text. A large cube fills the modal for detailed inspection. Tapping the cube again (or a collapse button) collapses back to the full timer view.

**Why this priority**: Small cube is useful at a glance; expanded view is needed for complex scrambles where piece orientation requires closer inspection.

**Independent Test**: Tap the cube in the modal — all timer controls and scramble text hide, cube fills available space. Tap again or press close — full timer view restores.

**Acceptance Scenarios**:

1. **Given** the inline cube is visible, **When** the user taps it, **Then** timer controls, scramble text, and stats are hidden and the cube expands to fill the modal.
2. **Given** the expanded cube view is active, **When** the user taps the cube or a collapse button, **Then** the full timer modal layout restores.
3. **Given** the expanded view is open, **When** the user closes the modal, **Then** expanded state does not persist — next open starts in normal layout.

---

### Edge Cases

- Scramble is empty string or null — cube should not render (no broken TwistyPlayer with empty alg).
- Modal closes while cube is in expanded state — on reopen, default (compact) layout is shown.
- Very long scramble string — cube renders correctly; no layout overflow.
- Dark mode — TwistyPlayer `background: 'none'` ensures it blends with modal background.

---

## Requirements

### Functional Requirements

- **FR-001**: A `TwistyPlayer` web component MUST render inline in the Practice Timer modal, showing the scrambled cube state (3D, `PG3D` visualization, green front / white top default orientation).
- **FR-002**: The cube MUST update reactively whenever a new scramble is generated, without remounting the modal.
- **FR-003**: The cube MUST be tappable/clickable to toggle an expanded view that fills the modal and hides all other modal content (timer, scramble text, stats, controls).
- **FR-004**: The expanded view MUST provide a visible collapse control (button or tap-the-cube again).
- **FR-005**: Expanded state MUST be local/ephemeral — not persisted to localStorage.
- **FR-006**: The cube MUST render with `background: 'none'` to blend with the modal's themed background in both light and dark mode.
- **FR-007**: `controlPanel` MUST be hidden in both compact and expanded views (inspection only, no playback controls).

### Key Entities

- **ScrambleCubePreview**: New component wrapping `TwistyPlayer` with compact/expanded toggle state.
- **PracticeTimerModal**: Existing component — receives the `ScrambleCubePreview` and manages layout hide/show based on expanded state.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Cube renders correctly for a representative set of WCA scrambles (standard 20-move 3×3 scrambles) in both Standard and Champion modes.
- **SC-002**: Cube updates without full modal remount when a new scramble is generated.
- **SC-003**: Expand/collapse toggle works on iPhone 16 (~393px) without layout overflow or z-index issues.
- **SC-004**: No visible flash, blank state, or layout shift between compact and expanded views.
- **SC-005**: Dark mode and light mode both render without white box artefacts around the cube.

---

## Assumptions

- `cubing.js` `TwistyPlayer` is already a project dependency (used in Algorithm Visualiser) — no new package required.
- TwistyPlayer's `controlPanel: 'none'` works correctly in the browser (this is a known working config in the browser; the headless macOS issue only affects Playwright/cubify).
- Green front / white top is the default TwistyPlayer orientation for `PG3D` — no setup alg needed.
- The expanded view hides controls within the modal; it does not open a second modal.
- No animation between compact and expanded states required for v1 — instant show/hide is sufficient.
