# Tasks: CFOP Solver Integration — CubifyPage

**Input**: Design documents from `specs/024-cfop-solver-integration/`
**Target file**: `cfop-app/src/pages/CubifyPage.tsx` (single file, all changes here)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelisable with other [P] tasks in the same phase
- **[Story]**: Which user story this task belongs to
- All tasks target `cfop-app/src/pages/CubifyPage.tsx` unless noted

---

## Phase 1: Setup

**Purpose**: Import wiring — prerequisite for all phases.

- [ ] T001 Add `CfopSolver` and `SolveStage` imports from `@andyjudson/cubify`; remove `CubeSolver` import in `cfop-app/src/pages/CubifyPage.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Replace Kociemba solver instance and migrate state shape. MUST complete before any user story work.

**⚠️ CRITICAL**: All user story work depends on this phase.

- [ ] T002 Replace `solverRef: useRef<CubeSolver>` with `cfopSolverRef: useRef<CfopSolver>` and update the `useEffect` init to `new CfopSolver()` with `solver.dispose()` cleanup in `cfop-app/src/pages/CubifyPage.tsx`
- [ ] T003 Add `cfopStages: SolveStage[] | null`, `cfopStageIndex: number`, `cfopSetup: string` state (initialised to `null`, `0`, `''`); add ref mirrors `cfopStagesRef`, `cfopStageIdxRef`, `cfopSetupRef` (each initialised to match state) in `cfop-app/src/pages/CubifyPage.tsx`
- [ ] T004 Remove `solveAlg` state; update `activeAlg` / `activeSetup` / `activeMask` derived values with solve-mode branches per plan.md; in `handleCaseChange` and `handleScramble` replace `setSolveAlg(null)` with clears of `cfopStages`, `cfopStageIndex`, `cfopSetup` and their ref mirrors in `cfop-app/src/pages/CubifyPage.tsx`

**Checkpoint**: App compiles with no TypeScript errors. Scramble/case mode unaffected.

---

## Phase 3: User Story 1 — Stage-by-stage CFOP Solve Playback (Priority: P1) 🎯 MVP

**Goal**: Pressing Solve triggers CFOP solver, loads stage 0 paused, advances through all 7 stages on user play, ends in solved state.

**Independent Test**: Scramble → Solve → step through all 7 stages via play button → cube visually solved after final stage.

- [ ] T005 [US1] Replace `handleSolve` with CFOP version: guard on `scrambleDone && scrambleAlg && !isSolving && cfopSolverRef.current`; call `CubeState.fromAlg(scrambleAlg)` then `cfopSolverRef.current.solve(state)`; set `initialSetup = [scrambleAlg, solution.setupAlg].join(' ')`; update all three refs immediately then call `setCfopStages / setCfopStageIndex(0) / setCfopSetup`; call `setMode('solve')`, `setScrambleDone(false)`, `setPlaying(false)` — do NOT call `autoPlay()` in `cfop-app/src/pages/CubifyPage.tsx`
- [ ] T006 [US1] Add solve-mode branch to `handleComplete`: read stages/idx/setup from refs; compute `newSetup` (append completed stage alg if non-empty); scan forward for `nextIdx` skipping empty-alg stages; update all three refs immediately then call `setCfopSetup(newSetup)` and `setCfopStageIndex(nextIdx)` — `setPlaying(false)` is already set in the existing code path in `cfop-app/src/pages/CubifyPage.tsx`
- [ ] T007 [US1] Add completed-solve guard to `handlePlayToggle`: early return when `modeRef.current === 'solve'` and `!cfopStagesRef.current[cfopStageIdxRef.current]?.alg` in `cfop-app/src/pages/CubifyPage.tsx`

**Checkpoint**: Full 7-stage CFOP solve works end-to-end. Cube reaches solved state. Empty stages are skipped. Scramble button resets correctly.

---

## Phase 4: User Story 2 — Stage Progress in the Info Panel (Priority: P2)

**Goal**: Info panel shows current stage label, alg, case name/WCA ID, and play prompt throughout the CFOP sequence.

**Independent Test**: Step through a solve and verify info panel text matches each stage label + alg; OLL/PLL stages show case name; panel shows "press play to simulate stage" when paused.

- [ ] T008 [US2] Replace the solve-mode branch in `statusMessage` with CFOP stage status derivation: compute `cfopStage = cfopStages?.[cfopStageIndex]`; show `"Solved! N moves"` when `cfopStage` is undefined (all done); otherwise inline `buildStageStatus` — humanise label (`f2l-fr` → `f2l fr`), append `— CaseName #WcaId` if present, append alg, append `— press play to simulate stage` when `!playing` in `cfop-app/src/pages/CubifyPage.tsx`
- [ ] T009 [US2] Update solve button `title` attribute to `"Solve (CFOP method)"` in `cfop-app/src/pages/CubifyPage.tsx`

**Checkpoint**: Info panel updates correctly at every stage transition; OLL/PLL case names visible; "Solved!" shows after final stage.

---

## Phase 5: User Story 3 — Existing Controls Work in CFOP Mode (Priority: P3)

**Goal**: Speed, step-forward, step-backward, and reset controls all function correctly within a CFOP solve sequence.

**Independent Test**: Start a CFOP solve; verify each control in turn — speed change mid-animation, step backward within a stage, reset returns to stage start.

- [ ] T010 [US3] Verify `handleResetButton`, `handleStepForward`, `handleStepBackward`, and speed buttons work correctly in CFOP solve mode via manual browser test using quickstart.md Scenario 4 and 5 — no code changes expected; document any regressions found in `specs/024-cfop-solver-integration/quickstart.md`

**Checkpoint**: All three controls behave as specified in US3 acceptance scenarios.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T011 Update the Solve button description paragraph in the About `<details>` section to describe `CfopSolver` and the 7-stage CFOP method, replacing the Kociemba description in `cfop-app/src/pages/CubifyPage.tsx`
- [ ] T012 Run all 6 quickstart.md scenarios manually in the browser (`cfop-app/` dev server) and confirm each passes; record any failures in `specs/024-cfop-solver-integration/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user stories
- **Phase 3 (US1)**: Depends on Phase 2 — core playback
- **Phase 4 (US2)**: Depends on Phase 2; independent of Phase 3 (info panel can be wired before playback is verified, but logic is easier to validate after Phase 3)
- **Phase 5 (US3)**: Depends on Phase 3 (needs working playback to verify controls)
- **Phase 6 (Polish)**: Depends on Phases 3–5

### User Story Dependencies

- **US1 (P1)**: Blocking — all other stories build on working playback
- **US2 (P2)**: Can be implemented alongside US1 (different code paths); best verified after US1 works
- **US3 (P3)**: Verification only — depends on US1 completing

### No Parallel Opportunities

All tasks are in the same file; parallelism is not applicable. Work sequentially in phase order.

---

## Implementation Strategy

### MVP (US1 only)

1. Phase 1: T001 — imports
2. Phase 2: T002 → T003 → T004 — solver + state migration
3. Phase 3: T005 → T006 → T007 — playback logic
4. **Validate**: scramble + solve + step through all stages in browser

### Full Delivery

1. MVP above
2. Phase 4: T008 → T009 — info panel
3. Phase 5: T010 — control verification
4. Phase 6: T011 → T012 — about text + quickstart sign-off

---

## Notes

- All 12 tasks target `cfop-app/src/pages/CubifyPage.tsx` (except T012 which is browser verification)
- Ref mirrors must be updated synchronously (before setState) in T005 and T006 to prevent stale reads in callbacks during the same event cycle
- `autoPlay()` must NOT be called in T005 — `<CubePlayer>` loads stage 0 automatically when `alg`/`setup` props change via the React re-render
- The `handleComplete` existing `setPlaying(false)` call runs before the new solve-mode branch in T006 — no duplication needed
