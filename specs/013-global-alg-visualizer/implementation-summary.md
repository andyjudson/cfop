# Implementation Summary: Global Algorithm Visualizer & Practice Timer

**Feature**: 013-global-alg-visualizer
**Completed**: 2026-03-28
**Branch**: `013-global-alg-visualizer` → merged to `main`

## What Was Built

Promoted the Algorithm Visualizer and Practice Timer from the Beginner page into the nav bar, making both tools accessible from any page. The Visualizer was upgraded from a single random 2LK demo into a full OLL/PLL browser with three selectors (set, group, algorithm) and a Shuffle button. The Beginner page was cleaned up by removing the now-redundant modal trigger buttons.

## Files Changed

| File | Change |
|------|--------|
| `cfop-app/src/components/VisualizerModal.tsx` | New — upgraded visualizer with OLL/PLL data loading, 3-selector UI, Shuffle, TwistyPlayer |
| `cfop-app/src/components/VisualizerModal.css` | New — all modal/player/selector styles (absorbed DemoModal.css) |
| `cfop-app/src/components/CfopNavigation.tsx` | Modified — added "Visualize" + "Practice" nav action buttons; owns modal state |
| `cfop-app/src/pages/BGRPage.tsx` | Modified — removed Demo/Practice buttons, state, handlers, imports |
| `cfop-app/src/App.css` | Modified — added `.cfop-navbar-action` button styles |
| `cfop-app/src/App.tsx` | Modified — default route changed from `/about` to `/2lk` |
| `cfop-app/src/components/DemoModal.tsx` | Deleted — superseded by VisualizerModal |
| `cfop-app/src/components/DemoModal.css` | Deleted — styles absorbed into VisualizerModal.css |

## Key Decisions

- `CfopNavigation` owns `showVisualizer` / `showPractice` state and renders both modals — no context or prop drilling needed
- New `VisualizerModal` replaces `DemoModal` entirely; `DemoModal` deleted
- OLL/PLL JSON fetched in parallel on first open, cached in state
- Three selectors: Set (OLL/PLL) → Group → Algorithm; Shuffle randomises within current set+group scope and updates the algorithm selector
- Algorithm selector options update dynamically when set or group changes
- Auto-shuffles one OLL algorithm on open so player is never empty
- Modal width set to 580px to prevent longer algorithm move sequences wrapping to 3 lines

## Data

- OLL: 57 algorithms across 7 groups (Block & Edge Setup, Cross Solved, Dot Patterns, Fish & Awkward, Lightning & Hooks, Line & L Shapes, Small Patterns)
- PLL: 21 algorithms across 5 groups (adjacent swap, corners only, diagonal swap, edges only, G perms)
