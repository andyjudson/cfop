# Implementation Plan: 019 — Visual Case Carousel

**Branch**: `019-visual-case-carousel` | **Date**: 2026-04-04 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/019-visual-case-carousel/spec.md`

## Summary

Adds a visual carousel mode to the existing `VisualizerModal` — a horizontally scrollable strip of case thumbnails (PNG images) for OLL and PLL. Tapping a thumbnail loads that case into the TwistyPlayer, identical to dropdown selection. The existing dropdowns are retained as a parallel navigation path, switchable via a Browse/Select toggle pill. On mobile (≤480px) the toggle and carousel are hidden and the dropdowns are always shown.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19
**Primary Dependencies**: Bulma CSS, react-icons, cubing.js (existing)
**Storage**: N/A — reads algorithm JSON already loaded by VisualizerModal
**Testing**: Playwright smoke tests (manual pre-merge)
**Target Platform**: Web (desktop + iPhone 16 mobile baseline)
**Project Type**: React component feature (single-page app)
**Performance Goals**: 57 OLL + 21 PLL images lazy-loaded; no measurable render budget impact
**Constraints**: No new data files; reuse existing PNG assets and loaded JSON
**Scale/Scope**: Two new files, two modified files; purely presentational

## Constitution Check

- No new data fetching — carousel consumes `activeData` already loaded by `VisualizerModal`
- No new routes or pages
- No localStorage changes
- Image paths come directly from JSON `image` field — no path derivation logic needed
- CSS tokens only — no hardcoded colours

## Project Structure

```text
cfop-app/src/components/
├── CaseCarousel.tsx          (new — carousel component)
├── CaseCarousel.css          (new — carousel styles)
├── VisualizerModal.tsx       (modified — add navMode state, toggle, conditional rendering)
└── VisualizerModal.css       (modified — toggle row styles, visibility helpers, mobile overrides)
```

## Design Decisions

- **Render-both, CSS-toggle approach**: Both carousel and dropdown panels are always rendered in the DOM. Visibility is controlled by class names (`.is-hidden`, `.is-desktop-hidden`) and CSS. This avoids remounting the TwistyPlayer when switching modes.
- **Mobile fallback via CSS only**: No JS media query hook. On ≤480px, `.visualizer-nav-mode { display: none }` hides the toggle, `.visualizer-carousel-panel { display: none !important }` hides the carousel, and `.visualizer-select-panel.is-desktop-hidden { display: block }` always shows the dropdowns.
- **`scrollIntoView` on activeId change**: The `CaseCarousel` component holds a `ref` on whichever item is active and calls `scrollIntoView({ inline: 'center', block: 'nearest' })` in a `useEffect` keyed on `activeId`. This handles both initial load and dropdown-driven changes.
- **Default mode**: `browse` — the carousel is the headline feature and should be the first experience.
