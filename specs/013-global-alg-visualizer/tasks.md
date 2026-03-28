# Tasks: Global Algorithm Visualizer & Practice Timer

**Input**: Design documents from `/specs/013-global-alg-visualizer/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓

**Organization**: Tasks grouped by user story. No automated tests (not in spec); all validation is manual browser testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story this task serves (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: Create skeleton files; no existing files are touched in this phase

- [x] T001 [P] Create skeleton `cfop-app/src/components/VisualizerModal.tsx` (exported named function returning a placeholder `<div>`)
- [x] T002 [P] Create skeleton `cfop-app/src/components/VisualizerModal.css` (empty file with import stub)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared data-loading utilities and types used by US1 and US2

**⚠️ CRITICAL**: US1 and US2 both depend on this phase being complete

- [x] T003 Confirm `CfopAlgorithm` interface in `cfop-app/src/components/AlgorithmCard.tsx` already has `id`, `name`, `notation`, `method`, `group`, `image` fields — no changes needed (read-only verification)
- [x] T004 In `cfop-app/src/components/VisualizerModal.tsx`: define `LoadState` type (`'loading' | 'ready' | 'error'`), `VisualizerModalProps` interface (`onClose: () => void`), and import `CfopAlgorithm` from `AlgorithmCard`
- [x] T005 In `cfop-app/src/components/VisualizerModal.tsx`: implement `fetchSet(set: 'OLL' | 'PLL'): Promise<CfopAlgorithm[]>` helper that fetches the appropriate JSON file (`import.meta.env.BASE_URL + 'data/algs-cfop-oll.json'` or `pll.json`), returns parsed array, throws on non-ok or HTML response
- [x] T006 In `cfop-app/src/components/VisualizerModal.tsx`: implement `getGroups(algorithms: CfopAlgorithm[]): string[]` helper that returns `['all', ...unique group values sorted alphabetically]`
- [x] T007 In `cfop-app/src/components/VisualizerModal.tsx`: implement `pickRandom(pool: CfopAlgorithm[]): CfopAlgorithm` helper that returns a random element from the pool

**Checkpoint**: Types, data-loading helpers, and utilities complete — US1 and US2 implementation can begin

---

## Phase 3: User Story 1 — Access Visualizer and Timer from Nav Bar (Priority: P1) 🎯 MVP

**Goal**: Both tools accessible from nav on any page; modals open and function correctly

**Independent Test**: Navigate to the OLL or PLL page, open the nav menu — confirm "Visualize" and "Practice" entries are present and both modals open and are dismissible via close button, Escape, and backdrop.

### Implementation for User Story 1

- [x] T008 [US1] In `cfop-app/src/components/CfopNavigation.tsx`: add `showVisualizer` and `showPractice` boolean state (both default `false`); add imports for `VisualizerModal` and `PracticeSessionModal`
- [x] T009 [US1] In `cfop-app/src/components/CfopNavigation.tsx`: add two `<button type="button" className="navbar-item">` action entries to the nav (after the page links): "Visualize" with `MdVideocam` icon and "Practice" with `MdTimer` icon — clicking each sets the corresponding state to `true` and closes the nav menu; opening one ensures the other is closed
- [x] T010 [US1] In `cfop-app/src/components/CfopNavigation.tsx`: render `{showVisualizer && <VisualizerModal onClose={() => setShowVisualizer(false)} />}` and `<PracticeSessionModal isOpen={showPractice} onClose={() => setShowPractice(false)} />` at the bottom of the component's JSX return
- [x] T011 [US1] In `cfop-app/src/components/CfopNavigation.tsx`: add `MdVideocam` and `MdTimer` imports from `react-icons/md`
- [x] T012 [US1] In `cfop-app/src/components/VisualizerModal.tsx`: implement the full modal shell — backdrop div with `handleBackdropClick`, inner `.modal-content` div, header with placeholder algorithm name and close button (`onClose`), Escape key listener via `useEffect` — returns a functional dismissible modal (player placeholder for now)
- [x] T013 [US1] Style `.navbar-item` action buttons in `cfop-app/src/App.css` (or a nav-specific block): `background: none; border: none; cursor: pointer;` plus icon+label flex layout — ensure they match the visual weight of existing nav link items

**Checkpoint**: US1 complete — both nav entries open their modals and dismiss cleanly from any page

---

## Phase 4: User Story 2 — Browse OLL and PLL in the Visualizer (Priority: P2)

**Goal**: VisualizerModal fully functional with set/group selectors, Shuffle, and 3D cube player

**Independent Test**: Open Visualizer from nav. Select "OLL" → confirm group selector shows 7 OLL groups + "All groups". Select a group → press Shuffle → confirm a valid algorithm from that group loads and animates. Change to "PLL" → confirm group selector updates to 5 PLL groups. Press Shuffle repeatedly → confirm random algorithms load each time.

### Implementation for User Story 2

- [x] T014 [US2] In `cfop-app/src/components/VisualizerModal.tsx`: add state — `ollData`, `pllData` (`CfopAlgorithm[]`, default `[]`), `loadState` (`LoadState`, default `'loading'`), `selectedSet` (`'OLL' | 'PLL'`, default `'OLL'`), `selectedGroup` (string, default `'all'`), `currentAlg` (`CfopAlgorithm | null`, default `null`)
- [x] T015 [US2] In `cfop-app/src/components/VisualizerModal.tsx`: add `useEffect` on mount that calls `Promise.all([fetchSet('OLL'), fetchSet('PLL')])`, sets `ollData` and `pllData`, sets `loadState` to `'ready'`, and calls `shuffle()` with the initial OLL pool; on error sets `loadState` to `'error'`
- [x] T016 [US2] In `cfop-app/src/components/VisualizerModal.tsx`: add `useMemo` for `activeData` (returns `ollData` or `pllData` based on `selectedSet`), `availableGroups` (calls `getGroups(activeData)`), and `shufflePool` (filters `activeData` by `selectedGroup`, or all when `'all'`)
- [x] T017 [US2] In `cfop-app/src/components/VisualizerModal.tsx`: implement `handleSetChange` — updates `selectedSet`, resets `selectedGroup` to `'all'`, then auto-shuffles; implement `handleGroupChange` — updates `selectedGroup`, then auto-shuffles; implement `handleShuffle` — calls `pickRandom(shufflePool)`, sets `currentAlg`
- [x] T018 [US2] In `cfop-app/src/components/VisualizerModal.tsx`: add selector row JSX above the player — `<select>` for set (OLL/PLL) and `<select>` for group (mapped from `availableGroups`, showing "All groups" for the `'all'` value); add Shuffle `<button>` to the controls panel alongside existing play/pause/rewind/speed buttons
- [x] T019 [US2] In `cfop-app/src/components/VisualizerModal.tsx`: implement TwistyPlayer initialization block — identical lifecycle pattern to `DemoModal` (mount/cleanup, `playerRef`, `twistyRef`, `onMoveInfo`, `onTimelineInfo` listeners); re-initialise player when `currentAlg` changes (use `currentAlg?.id` as the `useEffect` dependency); apply `getMask` helper (copy from `DemoModal`) for stickering
- [x] T020 [US2] In `cfop-app/src/components/VisualizerModal.tsx`: add play/pause/rewind/speed controls JSX and handlers — identical to `DemoModal`; add Space key toggle via `useEffect`; add algorithm move display row at bottom
- [x] T021 [US2] In `cfop-app/src/components/VisualizerModal.tsx`: update modal header to show `currentAlg?.name` and the group label (`currentAlg?.group`); show "Loading…" while `loadState === 'loading'`; show error message if `loadState === 'error'`
- [x] T022 [US2] Style `cfop-app/src/components/VisualizerModal.css`: selector row layout (flex, gap, aligned with controls), Shuffle button style, group label in header, responsive layout at ≤ 480px — CSS tokens only, no hex/rgba

**Checkpoint**: US2 complete — full OLL/PLL Visualizer works end-to-end with Shuffle

---

## Phase 5: User Story 3 — Beginner Page Clean-Up (Priority: P3)

**Goal**: Remove Demo/Practice buttons and all associated state/handlers/imports from BGRPage; page renders cleanly

**Independent Test**: Open the Beginner page — confirm no Demo or Practice button is visible. Confirm algorithm grid, section headings, essentials summary, and tooltips all work normally. Confirm nav bar entries still open both tools.

### Implementation for User Story 3

- [x] T023 [US3] In `cfop-app/src/pages/BGRPage.tsx`: remove state variables `showDemo`, `demoAlgorithm`, `showPracticeSession`
- [x] T024 [US3] In `cfop-app/src/pages/BGRPage.tsx`: remove handler functions `handleOpenDemo`, `handleCloseDemo`, `handleOpenPracticeSession`, `handleClosePracticeSession`
- [x] T025 [US3] In `cfop-app/src/pages/BGRPage.tsx`: remove the `<div className="has-text-centered mb-5 button-row">` block containing both trigger buttons
- [x] T026 [US3] In `cfop-app/src/pages/BGRPage.tsx`: remove `{showDemo && demoAlgorithm && <DemoModal ... />}` and `<PracticeSessionModal ... />` renders
- [x] T027 [US3] In `cfop-app/src/pages/BGRPage.tsx`: remove unused imports — `DemoModal`, `PracticeSessionModal`, `MdVideocam`, `MdTimer`

**Checkpoint**: US3 complete — Beginner page is clean, no modal triggers, grid intact

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality checks before merge

- [x] T028 [P] Audit `cfop-app/src/components/VisualizerModal.tsx` and `VisualizerModal.css` for hardcoded hex or rgba values — confirm zero found
- [x] T029 [P] Verify `cfop-app/src/components/CfopNavigation.tsx` compiles cleanly — no TypeScript errors on new state and imports
- [x] T030 Run production build: `cd cfop-app && npm run build` — confirm no TypeScript errors, build clean
- [x] T031 Manual feature test pass: desktop + 393px mobile viewport — nav entries open both modals, Shuffle loads correct set/group algorithms, player animates, dismiss works, Beginner page clean with no regressions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — **blocks US1 and US2**
- **US1 (Phase 3)**: Depends on Phase 2 — needs skeleton VisualizerModal to import
- **US2 (Phase 4)**: Depends on Phase 3 — adds functionality to the modal wired up in US1
- **US3 (Phase 5)**: Depends on Phase 3 — requires nav entries exist before Beginner buttons are removed (so tools remain accessible)
- **Polish (Phase 6)**: Depends on Phases 3–5 complete

### Within User Story 2

T014 → T015 → T016 → T017 → T018 + T019 (parallel) → T020 → T021 → T022

### Parallel Opportunities

- T001 and T002 (Phase 1): Different files
- T018 and T019 (Phase 4): Selectors JSX and player init are independent
- T028 and T029 (Phase 6): Independent checks
- T023–T027 (Phase 5): All in same file — sequential

---

## Implementation Strategy

### MVP (US1 only — Phases 1–3 + T028–T031)

1. Phase 1: Create skeleton files
2. Phase 2: Types and helpers
3. Phase 3: Wire nav entries to modals (VisualizerModal is a working dismissible shell at this point)
4. Phase 6: Build check + manual test
5. **STOP and VALIDATE** — both nav entries open modals, dismiss cleanly, accessible from any page

### Incremental Delivery

1. MVP above → nav access works (US1)
2. Add full player + selectors + Shuffle (US2) → full Visualizer functional
3. Clean up Beginner page (US3) → page simplified
4. Polish → ready to merge

---

## Notes

- No automated tests — all validation is manual browser testing per CLAUDE.md
- `DemoModal` is **not modified** in this feature — it stays as-is (may be removed in a future cleanup)
- `CfopNavigation` gains modal ownership; `CfopPageLayout` and `App.tsx` are **not modified**
- US3 (Beginner clean-up) must come after US1 — tools must be in the nav before the page buttons are removed
- VisualizerModal player lifecycle is a direct copy of DemoModal's — same TwistyPlayer init/cleanup pattern
