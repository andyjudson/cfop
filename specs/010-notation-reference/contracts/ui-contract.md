# UI Contract: Notation Reference Page (Feature 010)

## Purpose
Define externally visible UI behavior for the notation feature so implementation can vary without changing user-facing expectations.

## Route Contract
- New route: `#/notation`
- Route must render independently when opened directly.
- Existing routes (`#/intuitive`, `#/2lk`, `#/f2l`, `#/oll`, `#/pll`) must remain functional.

## Navigation Contract
- Add top-level nav item with label: `Notation`
- Position in nav order:
  1. `Intuitive`
  2. `Notation`
  3. `Beginner`
  4. `F2L`
  5. `OLL`
  6. `PLL`
- Active-state behavior must match existing navbar patterns.

## Page Content Contract
The notation page must include the following sections in this order:
1. Face Rotations
2. Modifiers
3. Slice Moves
4. Cube Rotations
5. Common Triggers

Each section must provide:
- section title,
- beginner-friendly explanatory text,
- examples list/grid.

## Example Tile Contract
Each notation example exposes:
- `symbol`
- `label`
- `explanation`
- optional visual

If visual asset fails to load:
- symbol/label/explanation remain visible,
- page remains usable without horizontal overflow.

## Trigger Contract
Each trigger entry exposes:
- trigger name,
- sequence,
- inverse sequence,
- optional short context line.

## Accessibility & Responsive Contract
- Section heading hierarchy is sequential and readable.
- Images include meaningful `alt` text when present.
- Small-screen baseline (~393px width) must not require horizontal scrolling in core content regions.

## Out of Scope Contract
- No solve timers or demo modal behavior.
- No fetch-driven dynamic content required for this page.
- No user accounts, personalization, or progress storage.
