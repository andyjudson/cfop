# Implementation Plan: Global Algorithm Visualizer & Practice Timer

**Branch**: `013-global-alg-visualizer` | **Date**: 2026-03-28 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/013-global-alg-visualizer/spec.md`

## Summary

Promote the Algorithm Visualizer and Practice Timer from the Beginner page into the nav bar, making both tools accessible from any page in the app. The Visualizer is upgraded from a single random 2LK algorithm demo to a full OLL/PLL browser with set selector, group filter, and Shuffle button. The Beginner page is cleaned up by removing the two modal trigger buttons and their state. All changes are additive to the existing modal and nav components with minimal blast radius.

## Technical Context

**Language/Version**: TypeScript 5.9 / React 19 / Vite 7
**Primary Dependencies**: Existing: cubing.js (TwistyPlayer), react-icons/md, Bulma CSS 1.x, react-router-dom 7.x. No new dependencies.
**Storage**: N/A — runtime state only; no persistence
**Testing**: Manual browser test (no automated test framework in cfop-app)
**Target Platform**: Web (GitHub Pages, static hosting); primary mobile baseline iPhone 16 (~393px CSS width)
**Project Type**: Web application (SPA — React + Vite, HashRouter)
**Performance Goals**: VisualizerModal opens and auto-shuffles within 500ms; Shuffle responds within 200ms
**Constraints**: No new dependencies; no hardcoded hex/rgba colours (CSS tokens only)
**Scale/Scope**: Two modal components, one nav modification, one page clean-up; ~78 OLL+PLL data points already in the app

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Educational focus | PASS | Expanded visualizer directly supports full OLL/PLL algorithm learning |
| Minimal dependencies | PASS | Zero new dependencies; reuses cubing.js, react-icons already installed |
| Web-first / React ecosystem | PASS | Consistent with existing SPA architecture |
| No monetization / social | PASS | Read-only learning tool |
| Offline-capable | PASS | All data files are static assets bundled with the app |
| Consistent visual design | PASS | CSS token system used throughout; new component follows existing modal pattern |
| Mobile compatibility | PASS | Selectors + Shuffle designed for 393px baseline |

**Post-design re-check**: All gates pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/013-global-alg-visualizer/
├── plan.md                    # This file
├── research.md                # Phase 0 output — architecture decisions
├── data-model.md              # Phase 1 output — runtime state and group reference
├── checklists/
│   └── requirements.md        # Spec quality checklist (all pass)
└── tasks.md                   # Phase 2 output (/speckit.tasks — not yet created)
```

### Source Code (repository root)

```text
cfop-app/
├── public/
│   └── data/
│       ├── algs-cfop-oll.json   # existing — consumed by VisualizerModal
│       └── algs-cfop-pll.json   # existing — consumed by VisualizerModal
└── src/
    ├── components/
    │   ├── CfopNavigation.tsx   # modified — add modal triggers + render VisualizerModal & PracticeSessionModal
    │   ├── VisualizerModal.tsx  # new — upgraded demo with set/group selector and Shuffle
    │   └── VisualizerModal.css  # new — styles for selectors and layout additions
    └── pages/
        └── BGRPage.tsx          # modified — remove Demo/Practice buttons, state, and modal renders
```

**Structure Decision**: Single-project SPA (existing pattern). New `VisualizerModal` component follows the co-located TSX + CSS pattern of `DemoModal` and `WrEvolutionChart`. `DemoModal` is left untouched (may be cleaned up in a future maintenance pass).

## Implementation Phases

### Phase 1 — VisualizerModal component

1. Create `VisualizerModal.tsx`:
   - Props: `onClose: () => void` (no algorithm prop — self-contained selection)
   - State: `ollData`, `pllData`, `loadState`, `selectedSet`, `selectedGroup`, `currentAlg`
   - On mount: fetch both OLL and PLL JSON files in parallel; set `loadState` to `'ready'`; auto-shuffle one OLL algorithm as default
   - Derived: `availableGroups = ['all', ...unique groups for selectedSet sorted]`; `shufflePool = filtered by set + group`
   - Set selector: `<select>` with OLL / PLL options; on change → reset group to `'all'` → auto-shuffle
   - Group selector: `<select>` populated from `availableGroups`; on change → auto-shuffle
   - Shuffle button: picks `shufflePool[Math.floor(Math.random() * shufflePool.length)]` → sets `currentAlg` → resets player
   - Player/controls: identical lifecycle to `DemoModal` — TwistyPlayer init, play/pause/rewind/speed, move highlighting, Escape + backdrop dismiss, Space key toggle

2. Create `VisualizerModal.css`:
   - Selector row styles using CSS tokens only
   - Shuffle button variant styling
   - Mobile layout: selectors + Shuffle fit inline or wrap cleanly at 393px

### Phase 2 — CfopNavigation wired to modals

3. Modify `CfopNavigation.tsx`:
   - Import `VisualizerModal` and `PracticeSessionModal`
   - Add `showVisualizer` and `showPractice` boolean state
   - Add two action `<button>` elements in the nav (`.navbar-item` class) with `MdVideocam` and `MdTimer` icons from react-icons/md — already imported elsewhere in the app
   - Render `{showVisualizer && <VisualizerModal onClose={() => setShowVisualizer(false)} />}` and `<PracticeSessionModal isOpen={showPractice} onClose={() => setShowPractice(false)} />`
   - Close nav menu when either modal is opened
   - Ensure only one modal can open at a time (opening one closes the other)

### Phase 3 — BGRPage clean-up

4. Modify `BGRPage.tsx`:
   - Remove `showDemo`, `demoAlgorithm`, `showPracticeSession` state
   - Remove `handleOpenDemo`, `handleCloseDemo`, `handleOpenPracticeSession`, `handleClosePracticeSession` handlers
   - Remove the `.button-row` div containing both trigger buttons
   - Remove `{showDemo && demoAlgorithm && <DemoModal ... />}` and `<PracticeSessionModal ...>` renders
   - Remove unused imports: `DemoModal`, `PracticeSessionModal`, `MdVideocam`, `MdTimer`

### Phase 4 — Polish & validation

5. Audit `VisualizerModal.tsx` and `VisualizerModal.css` for hardcoded colours — confirmed zero
6. Verify group selector contents: OLL 7 groups + "All groups", PLL 5 groups + "All groups"
7. Manual test: desktop + 393px mobile viewport, both nav entries work, Shuffle loads correct set/group, dismiss works
8. Run production build: `cd cfop-app && npm run build` — no TypeScript errors

## Key Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Modal state ownership | `CfopNavigation` owns open/close | Self-contained; no context or prop drilling; modals are fixed-position so mount location doesn't matter |
| New component vs extend DemoModal | New `VisualizerModal` | Different prop contract (no pre-selected alg); keeps DemoModal unchanged |
| Data loading | Fetch both JSON files on first open | Parallel fetch, cached in state; reuses existing data files with no schema changes |
| Default on open | OLL / All groups / auto-shuffle | Immediately useful; never shows an empty player |
| BGRPage clean-up | Full removal of buttons and state | Buttons are redundant once nav has both entries; removes dead state/handlers |
| OLL group count | 7 groups (current JSON data) | Spec mentioned 14 (pre-Feature-008 count) — actual consolidated data has 7 |

## Contracts

N/A — self-contained frontend feature. Data contracts are the existing JSON file schemas, unchanged.
