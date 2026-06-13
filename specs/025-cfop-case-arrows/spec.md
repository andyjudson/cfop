# Feature Specification: BGR Case Arrows

**Feature Branch**: `025-cfop-case-arrows`  
**Created**: 2026-06-13  
**Status**: Draft  
**Input**: User description: a new idea, not sure if feasible, for each of the cases in the beginner (2lk) page, can we add overlay arrows onto the image to show how the pieces move, these should be mapped to single css class, so can be easily toggled on / off?

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Toggle arrows on all case cards (Priority: P1)

A learner studying the Beginner Methods page wants to understand intuitively what each algorithm is doing to the cube. They click a toggle button on the page and every one of the 16 case images instantly shows directional arrows indicating which pieces move and how. Clicking again hides all arrows, returning the cards to their normal state.

**Why this priority**: This is the core interaction — the toggle mechanism is the foundation everything else depends on. Without it, no arrows are visible regardless of how well they are authored.

**Independent Test**: Can be tested by verifying the toggle button exists on the Beginner Methods page, that clicking it causes arrows to appear on all visible cards, and that clicking again hides them — independently of whether the arrow positions are accurate.

**Acceptance Scenarios**:

1. **Given** the Beginner Methods page is loaded with arrows hidden, **When** the user clicks the arrow toggle button, **Then** arrows appear on all 16 case card images simultaneously with no perceptible delay.
2. **Given** arrows are visible on all cards, **When** the user clicks the toggle again, **Then** all arrows disappear simultaneously and the case images return to their normal state.
3. **Given** the page is loaded, **When** the user scrolls through all four sections (OLL edges, OLL corners, PLL corners, PLL edges), **Then** arrows are shown or hidden consistently across all sections.

---

### User Story 2 — OLL cases show orientation arrows (Priority: P2)

A learner looking at an OLL case wants to understand which pieces are disoriented and in what direction they need to rotate to become oriented. The arrows on each OLL case card show rotation direction on the specific corners or edges that the algorithm affects — giving an immediate visual cue about the algorithm's purpose.

**Why this priority**: OLL arrows (rotation direction) are semantically different from PLL arrows (movement paths) and require separate authoring. P2 because it builds on the toggle from P1.

**Independent Test**: Can be verified by checking that each of the 8 OLL cases (4 edge + 4 corner) shows arrows positioned on the correct pieces with the correct rotation sense, without needing PLL arrows to be complete.

**Acceptance Scenarios**:

1. **Given** arrows are toggled on, **When** a user views an OLL edge case card, **Then** arrows appear on the specific edge cells that need to be oriented, indicating the flip direction.
2. **Given** arrows are toggled on, **When** a user views an OLL corner case card, **Then** arrows appear on each corner that needs to twist, indicating clockwise or counterclockwise rotation.
3. **Given** arrows are toggled on, **When** a user views any OLL case, **Then** the arrows are positioned within the boundary of the case image and do not obscure the cube's sticker colours.

---

### User Story 3 — PLL cases show permutation arrows (Priority: P3)

A learner looking at a PLL case wants to understand which pieces swap or cycle. The arrows on each PLL case card trace curved paths between the positions involved in the permutation — showing at a glance where each piece travels.

**Why this priority**: P3 because PLL arrow authoring (cycle paths) is independent from OLL and can be shipped separately.

**Independent Test**: Can be verified by checking that each of the 8 PLL cases (4 corner + 4 edge) shows arc arrows connecting the correct piece positions, reflecting the permutation cycle the algorithm performs.

**Acceptance Scenarios**:

1. **Given** arrows are toggled on, **When** a user views a PLL corner case (e.g. T-perm), **Then** arc arrows trace the corner cycle/swap paths across the case image.
2. **Given** arrows are toggled on, **When** a user views a PLL edge case (e.g. Ua-perm), **Then** arc arrows trace the edge cycle path, indicating both the pieces involved and the direction of movement.
3. **Given** arrows are toggled on, **When** a user views any PLL case, **Then** arrows are distinguishable from the sticker colours on both light and dark themes.

---

### Edge Cases

- What happens when a case has no arrows defined yet? The image renders normally with no overlay — no broken UI.
- How does the toggle behave when the page is still loading data? The toggle is only rendered once case data has loaded; it cannot be activated on an empty page.
- What happens on mobile screens? Arrow overlays are visible on mobile; if the image is scaled down, arrows scale with it (they are percentage-based overlays).
- How are arrows rendered on dark theme vs light theme? Arrow colour is chosen to be legible on both; if needed, separate colour tokens per theme are used.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Beginner Methods page MUST include a toggle control that shows or hides movement arrows on all case images simultaneously. The toggle MUST be positioned in the page's existing filter/controls row alongside other page-level controls.
- **FR-002**: The toggle MUST control all 16 cases in all four sections (OLL edges, OLL corners, PLL corners, PLL edges) with a single interaction.
- **FR-003**: OLL edge cases MUST display arc arrows between the edge sticker's current face and its correct target face, using the same arrow type as PLL permutation arrows.
- **FR-004**: OLL corner cases MUST display arc arrows between each disoriented corner sticker's current face and its correct target face, using the same arrow type as PLL permutation arrows. Curved rotation symbols (indicating CW/CCW twist) are an accepted alternative visual form to trial during implementation.
- **FR-005**: PLL corner cases MUST display arc arrows tracing the permutation path between corner positions.
- **FR-006**: PLL edge cases MUST display arc arrows tracing the permutation path between edge positions.
- **FR-007**: Arrows MUST be visually aligned with the pieces they represent within the case image.
- **FR-008**: Arrows MUST be legible on both light and dark themes.
- **FR-009**: Toggling arrows MUST NOT affect card dimensions, image display, algorithm notation, or any other page element.
- **FR-010**: The toggle button MUST have a clear active/inactive visual state so the user knows whether arrows are currently shown.
- **FR-011**: Cases with no arrows defined MUST render normally with no broken or empty overlay.

### Key Entities

- **Case arrow set**: The set of directional arrow definitions for a single algorithm case, identified by case id. Each arrow has a source position, a target position (or rotation direction for OLL), and optional curvature.
- **Arrow toggle**: A page-level control that switches between arrows-visible and arrows-hidden states for all case cards on the Beginner Methods page.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 16 Beginner Methods case images display arrows correctly when the toggle is activated — 100% coverage with no missing or misaligned overlays.
- **SC-002**: The toggle responds immediately — arrows appear or disappear within one animation frame (no loading, no async fetch).
- **SC-003**: All arrows are positioned within the bounds of their respective case image with no overlap onto card chrome (name, notation).
- **SC-004**: All OLL arrows correctly reflect orientation direction; all PLL arrows correctly trace the permutation cycle, verified by manual comparison with the algorithm's effect.
- **SC-005**: No layout shift, reflow, or image repaint occurs when the toggle is activated.

## Assumptions

- The 16 BGR case images are 2D top-down renders — piece cell positions within each image are determined by the renderer's geometry and can be mapped to precise visual coordinates without image analysis.
- Arrow position data is authored statically per case (a one-time effort) rather than computed dynamically from algorithm notation at render time.
- Arrow toggle state does not need to persist across page navigations or browser sessions; it defaults to hidden on page load.
- The toggle applies only to the Beginner Methods (BGR) page — other pages with case images (F2L, OLL, PLL reference grids) are out of scope.
- Arrow colours will contrast sufficiently with both light and dark cube sticker palettes; a single semi-transparent accent colour is the default choice.
- Mobile: arrows scale with the image and remain visible; no mobile-specific layout changes are required.

## Clarifications

### Session 2026-06-13

- Q: Where on the BGRPage should the arrow toggle button be placed? → A: In the existing filter/controls row alongside other page-level controls.
- Q: What visual style should OLL arrows use? → A: Arc arrows between the piece's current and target sticker face (same type as PLL arrows); curved rotation symbols (CW/CCW) are an alternative to trial during implementation.
