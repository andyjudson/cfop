# Feature 019 — Visual Case Carousel

## Summary

Adds a visual case-browsing mode to the Algorithm Visualizer modal. Instead of navigating by name via dropdowns, the user can browse OLL and PLL cases as a carousel of case images — matching the way a solver actually recognises cases mid-solve (by pattern, not name).

The existing dropdown selectors are retained as an alternative navigation path. The carousel is an additional, parallel way to find and load a case into the player.

## Motivation

During a solve, you recognise the OLL or PLL pattern visually. Looking up "T-perm" or "OLL 37" by name requires knowing the name — which defeats the purpose when you're still learning. Browsing thumbnails of the actual case images lets you match what you see on the cube directly to the algorithm.

## User Stories

**US-001 — Browse cases visually**
As a learner, I want to scroll through case images for OLL or PLL so I can find the pattern I'm seeing on the cube without knowing its name.

**US-002 — Select a case from the carousel**
As a learner, when I tap a case image in the carousel, I want the visualizer to load that case and start showing its algorithm — exactly as if I had selected it via the dropdown.

**US-003 — Retain dropdown navigation**
As a learner who knows case names or groups, I still want the dropdown selectors available so I can navigate by name or group when I prefer.

## Functional Requirements

**FR-001 — Carousel toggle**
A toggle or tab within the visualizer modal switches between "Browse" (carousel) and "Select" (dropdowns) navigation modes. The player and controls below remain unchanged in both modes.

**FR-002 — Carousel layout**
The carousel displays case images in a horizontally scrollable row, grouped by OLL or PLL matching the active set selection. Cases are shown in their existing group order (matching the JSON data order).

**FR-003 — Case image thumbnails**
Each carousel item shows the existing cubify-generated PNG (`assets/cfop_oll/` or `assets/cfop_pll/`). Image path derived from algorithm `id` field using the same `{set}-{groupId}-{caseIndex}.png` naming convention.

**FR-004 — Active case highlight**
The currently loaded case is visually highlighted in the carousel (border or background accent). When the user navigates via dropdown, the carousel scrolls to and highlights the matching case.

**FR-005 — Tap to load**
Tapping a carousel item loads that algorithm into the TwistyPlayer (same effect as selecting via dropdown). The player rewinds to the start.

**FR-006 — Set switching**
Switching between OLL and PLL updates both the carousel and the dropdowns consistently.

**FR-007 — Scroll to active**
When the modal opens or the active case changes, the carousel scrolls to bring the active case into view.

## Design Notes

- Carousel sits between the set selector and the player — replacing the group + algorithm dropdowns when in Browse mode
- Thumbnail size: ~64px × 64px, enough to recognise the pattern
- Group dividers or subtle separators between OLL groups (dot-patterns, cross-patterns, etc.) would help navigation but are a stretch goal
- No search text input in this feature — pure visual browsing
- Mobile: carousel scrolls horizontally with momentum; thumbnails may be slightly smaller (~52px)

## Assets

- OLL images: `assets/cfop_oll/oll-{groupId}-{caseIndex}.png` (57 cases)
- PLL images: `assets/cfop_pll/pll-{groupId}-{caseIndex}.png` (21 cases)
- Images are transparent PNGs on dark/light background via CSS

## Out of Scope

- F2L visual carousel (cases are situational, less suited to recognition-based lookup)
- Text search by case name
- Favouriting or bookmarking cases
- Swipe gesture between individual cases (carousel is a strip, not a swiper)

## Acceptance Criteria

- [x] Carousel visible and scrollable for both OLL (57 cases) and PLL (21 cases)
- [x] Tapping a case loads it into the player identically to dropdown selection
- [x] Active case highlighted and scrolled into view on load and on change
- [x] Dropdown navigation remains fully functional alongside carousel
- [x] Toggle between Browse/Select modes is clear and persistent within the session
- [x] No visual regression on desktop or mobile (iPhone 16 baseline)
