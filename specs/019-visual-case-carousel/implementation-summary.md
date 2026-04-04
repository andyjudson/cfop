# Implementation Summary: 019 — Visual Case Carousel

**Status**: Complete | **Merged**: 2026-04-04

## What Was Built

- `CaseCarousel` component: horizontally scrollable strip of case thumbnails (64px, 52px on mobile) using the existing PNG assets. Active case highlighted with accent border + glow. Auto-scrolls to active item on load and on change.
- Single toggle button in the nav row switches between Browse (carousel) and Select (dropdowns) modes.
- All three selectors (set, group, toggle button) consolidated onto one row — no wasted space.
- Arrow key (←/→) navigation steps through cases in browse mode.
- Mobile (≤480px): toggle and carousel hidden via CSS; dropdowns always shown.

## Key Design Decisions

- **Conditional rendering not CSS hiding** for carousel vs. dropdowns — cleaner than visibility class tricks that were overridden by Bulma.
- **Group selector promoted to nav row** — available in both Browse and Select modes on the same line as set selector and toggle, eliminating a wasted row.
- **Alg dropdown always rendered** but hidden on desktop in browse mode (`is-hidden-carousel`); shown on mobile via CSS override so keyboard navigation still works without the carousel.
- **Single toggle button** replacing a two-button pill — frees space for all three controls on one row and matches Bulma `.select` height (no `is-small`).
- **Arrow key handler on `window`** in `CaseCarousel` — fires `onSelect` for adjacent case, which triggers header name update and `scrollIntoView`.
- **`title` tooltip removed** from carousel items — name shown in modal header on selection is cleaner and less intrusive.

## Files Changed

| File | Change |
|------|--------|
| `CaseCarousel.tsx` | New component — carousel strip, active highlight, arrow key nav |
| `CaseCarousel.css` | New styles — horizontal scroll, thumbnail sizing, active state |
| `VisualizerModal.tsx` | navMode state, single toggle button, consolidated nav row, conditional carousel/dropdown rendering |
| `VisualizerModal.css` | Nav toggle row styles, alg-select flex fix, mobile overrides |
