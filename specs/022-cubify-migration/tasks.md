# Tasks: Feature 022 — cubify-migration

**Feature**: cfop-app adopts cubify (TwistyPlayer + cubing/alg removed)
**Plan**: specs/022-cubify-migration/plan.md
**Spec**: specs/022-cubify-migration/spec.md
**Research**: specs/022-cubify-migration/research.md

**User Stories:**
- US1: Scramble generation — `scrambleGenerator.ts` deleted, `scramble.ts` uses `CubeScramble.random()`
- US2: Scramble cube preview — `ScrambleCubePreview.tsx` uses `<CubeState>`, container-driven sizing
- US3: Step-through visualiser — `VisualizerModal.tsx` uses `<CubePlayer>` + `<CubePlayerControls>`
- US4: CSS extraction — shared classes in `src/styles/cubify.css`, `CubifyPage.tsx` uses class names

---

## Phase 1: Setup

**Purpose**: Create the new CSS directory — only structural prerequisite.

- [X] T001 Create cfop-app/src/styles/ directory (mkdir -p cfop-app/src/styles)

---

## Phase 2: Foundational

**Purpose**: No blocking foundation needed — `@andyjudson/cubify` and `@andyjudson/cubify-react` are already installed in cfop-app/package.json. Proceed directly to user stories.

**Checkpoint**: Packages verified — all four user stories can proceed.

---

## Phase 3: User Story 1 — Scramble Generation (Priority: P1) 🎯 MVP

**Goal**: Remove `cubing/alg` from the scramble pipeline; `CubeScramble.random()` generates the scramble directly.

**Independent Test**: Run app, navigate to Practice — new scramble generates on each press. No runtime error. `grep -r "from 'cubing" cfop-app/src/utils` returns no output.

- [X] T002 [P] [US1] Rewrite cfop-app/src/utils/scramble.ts to import CubeScramble from '@andyjudson/cubify', call CubeScramble.random(20), return ScrambleState — remove Alg import and assertValidScramble
- [X] T003 [P] [US1] Delete cfop-app/src/utils/scrambleGenerator.ts (the entire file — no callers remain after T002)

**Checkpoint**: Scramble generation uses cubify. No cubing/alg import in utils/. Practice page functional.

---

## Phase 4: User Story 2 — Scramble Cube Preview (Priority: P2)

**Goal**: Replace TwistyPlayer with `<CubeState>` in ScrambleCubePreview; size driven by CSS, not explicit px.

**Independent Test**: Practice page shows a 120px cube beside the scramble text; clicking expands to 200px. No TwistyPlayer mounted. No IntersectionObserver lifecycle. `grep -r "from 'cubing" cfop-app/src/components/ScrambleCubePreview.tsx` returns no output.

- [X] T004 [P] [US2] Update cfop-app/src/components/ScrambleCubePreview.css: add `.scramble-cube-canvas { width: 120px; height: 120px; }` and `.scramble-cube-canvas--expanded { width: 200px; height: 200px; }` — keep existing flex centering rules
- [X] T005 [P] [US2] Rewrite cfop-app/src/components/ScrambleCubePreview.tsx to import CubeState from '@andyjudson/cubify-react'; remove TwistyPlayer, useEffect, useRef; replace container div with `<div className="scramble-cube-canvas[--expanded]"><CubeState alg={scramble} style={{ width: '100%', height: '100%' }} /></div>`; keep expand toggle logic, panel classes, keyboard handler, MdFullscreen icons

**Checkpoint**: ScrambleCubePreview renders correctly at both sizes. No TwistyPlayer in component. No cubing import.

---

## Phase 5: User Story 3 — Step-Through Visualiser (Priority: P3)

**Goal**: Replace TwistyPlayer in VisualizerModal with `<CubePlayer>` + `<CubePlayerControls>`; play/pause/step/speed/camera reset work; no cubing/alg import.

**Independent Test**: Open VisualizerModal — cube renders for the selected algorithm. Play button animates. Step forward/back moves one position. Speed control changes tempo. Camera reset button works. `grep -r "from 'cubing" cfop-app/src/components/VisualizerModal.tsx` returns no output.

- [X] T006 [US3] Rewrite cfop-app/src/components/VisualizerModal.tsx:
  - Remove imports: `Alg`, `Move` from 'cubing/alg'; `TwistyPlayer` from 'cubing/twisty'; MdPlayArrow, MdPause, MdReplay, MdAdd, MdRemove, MdFilterCenterFocus from react-icons/md
  - Add imports: `CubePlayer`, `CubePlayerControls` from '@andyjudson/cubify-react'; `CubePlayerHandle` type; `AlgParser` from '@andyjudson/cubify'
  - Replace state: remove `speedIndex`/`SPEED_STEPS`/`twistyRef`/`playerRef: TwistyPlayer`; add `playing`, `currentStep` (-1 = start), `speed` (float 1), `playerRef: CubePlayerHandle`
  - Replace `parseAlgorithmMoves` with `useMemo(() => AlgParser.parse(currentAlg.notation), [currentAlg])`
  - Remove entire TwistyPlayer lifecycle useEffect (initPlayer, cleanupPlayer, retry timer, experimentalModel listeners)
  - Remove speed useEffect (playerRef.current.tempoScale)
  - Remove handlePlay/handlePause/handleRewind/handleResetView — replaced by CubePlayerControls props
  - Add handleStepBack: jumpTo(Math.max(-1, currentStep - 1)) + setCurrentStep; handleStepForward: jumpTo(Math.min(moves.length-1, currentStep+1)) + setCurrentStep
  - Replace `.twisty-container` div with `<CubePlayer ref={playerRef} alg={currentAlg.notation} setup={currentAlg.setup ?? ''} stickering={mask} playing={playing} speed={speed} onMove={e => setCurrentStep(e.index)} onComplete={() => { setPlaying(false); setCurrentStep(moves.length - 1); }} onReset={() => { setCurrentStep(-1); setPlaying(false); }} style={{ width: '100%', height: '100%' }} />`
  - Replace `.control-buttons` contents with `<CubePlayerControls playing={playing} speed={speed} onPlayToggle={() => setPlaying(p => !p)} onReset={() => playerRef.current?.reset()} onStepBack={handleStepBack} onStepForward={handleStepForward} stepBackDisabled={currentStep === -1} stepForwardDisabled={!moves.length || currentStep === moves.length - 1} onCameraReset={() => playerRef.current?.resetCamera()} onSpeedChange={setSpeed} />`
  - Rewire keyboard handler: space key calls `setPlaying(p => !p)` instead of handlePlay/handlePause
  - Keep: fetchSet, getGroups, handleSetChange, handleGroupChange, getMask, CaseCarousel, all existing CSS class names, modal structure, Escape key handler

- [X] T007 [US3] Update cfop-app/src/components/VisualizerModal.css: rename `.twisty-container` to `.cube-player-container`; rename `.twisty-container twisty-player` rule to `.cube-player-container > div` (matches CubePlayer's inner div); keep all dimensions and layout unchanged

**Checkpoint**: VisualizerModal fully functional with CubePlayer. All five controls work. No cubing.js import. Algorithm move tape still highlights current step.

---

## Phase 6: User Story 4 — CSS Extraction (Priority: P4)

**Goal**: Extract repeated inline styles from CubifyPage.tsx to `src/styles/cubify.css`; VisualizerModal imports the shared file.

**Independent Test**: CubifyPage looks visually identical before and after. No inline style objects on select rows, theme buttons, or speed row. `cubify.css` exists and is imported by both CubifyPage.tsx and VisualizerModal.tsx.

- [X] T008 [US4] Write cfop-app/src/styles/cubify.css with classes: `.cubify-select-row` (flex, gap 8px, centered, flex-wrap, mb 0.75rem), `.cubify-theme-btn` (44×44px, borderRadius 10, border #dbdbdb, bg #f5f5f5), `.cubify-theme-btn.is-active` (bg #00b89c, borderColor #00b89c, color #fff), `.cubify-speed-row` (flex, gap 8, centered, mt 6px), `.cubify-speed-label` (min-width 40px, text-center, 0.85rem, tabular-nums)

- [X] T009 [US4] Update cfop-app/src/pages/CubifyPage.tsx: add `import '../styles/cubify.css'`; replace inline select-row div style with `className="cubify-select-row"`; replace inline theme button style objects with `className={\`cubify-theme-btn\${active ? ' is-active' : ''}\`}`; replace inline speed row div with `className="cubify-speed-row"` and speed label span with `className="cubify-speed-label"`

- [X] T010 [US4] Add `import '../styles/cubify.css'` to cfop-app/src/components/VisualizerModal.tsx (top of imports — shared stylesheet already written in T008)

**Checkpoint**: Both CubifyPage and VisualizerModal import cubify.css. Inline style objects removed from CubifyPage for the extracted patterns. Visual appearance unchanged.

---

## Phase 7: Polish & Verification

**Purpose**: Confirm all cubing.js direct imports removed; build clean.

- [X] T011 Run `grep -r "from 'cubing" cfop-app/src` and confirm zero output — if any remain, trace and fix
- [X] T012 Run `npm run build` in cfop-app — confirm clean TypeScript compilation, no type errors
- [X] T013 [P] Run Playwright smoke tests in cfop-app — confirm existing test suite passes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** (Setup): No dependencies — start immediately
- **Phase 2** (Foundation): No blocking work — passes through
- **Phase 3** (US1 — scramble utils): Independent, can start after Phase 1
- **Phase 4** (US2 — ScrambleCubePreview): Independent, can run in parallel with US1
- **Phase 5** (US3 — VisualizerModal): Independent, can run in parallel with US1 and US2
- **Phase 6** (US4 — CSS extraction): Depends on US3 (T006/T007) being complete — T010 adds import to VisualizerModal.tsx
- **Phase 7** (Polish): Depends on all user stories complete

### Parallel Opportunities

US1, US2, and US3 are fully parallel (different files, no shared dependencies):
- T002 [US1] scramble.ts rewrite
- T003 [US1] scrambleGenerator.ts deletion
- T004 [US2] ScrambleCubePreview.css update
- T005 [US2] ScrambleCubePreview.tsx rewrite
- T006/T007 [US3] VisualizerModal rewrite + CSS

US4 can begin as soon as US3 is done.

### Within US3 (VisualizerModal)

T006 (component rewrite) must complete before T007 (CSS rename) is validated, but T007 is a simple search-replace and can be done first without risk.

---

## Parallel Example: US1 + US2 + US3 launch together

```
Task 1: T002 — rewrite scramble.ts
Task 2: T003 — delete scrambleGenerator.ts
Task 3: T004 — update ScrambleCubePreview.css
Task 4: T005 — rewrite ScrambleCubePreview.tsx
Task 5: T006 — rewrite VisualizerModal.tsx    [largest task]
Task 6: T007 — update VisualizerModal.css
```

Then: T008 → T009 → T010 → T011 → T012 → T013

---

## Implementation Strategy

### MVP First (US1 only)

1. T001 (mkdir)
2. T002 + T003 (scramble utils)
3. Validate: `grep -r "from 'cubing" cfop-app/src/utils` returns nothing; Practice page generates scrambles

### Full Delivery

1. T001 → T002/T003/T004/T005/T006/T007 (all in parallel) → T008 → T009 → T010 → T011/T012/T013

### Suggested order for single-developer

T001 → T002 → T003 → T004 → T005 → T007 → T006 → T008 → T009 → T010 → T011 → T012 → T013

(T006 is the largest — save it for when momentum is built; T007 CSS rename is trivial and can go first to validate the class name.)
