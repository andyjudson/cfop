# Tasks — Feature 006: Fallback Scramble Generator

**Feature**: Fallback Scramble Generator (Non-Official)  
**Branch**: `006-fallback-scramble-generator`  
**Target**: `cfop-app`  
**Generated**: 2026-03-08

---

## Overview

Replace runtime dependency on `cubing/scramble` workers (production blocker) with a local deterministic rule-based 3x3 scramble generator. Preserve existing practice modal UX (timer, stats, visual feedback). Enforce 20-move parseable output with 1000ms timeout, last-click-wins concurrency semantics, and last-valid-scramble preservation on failure.

**Deliverables**:
- `src/utils/scrambleGenerator.ts` — generator function + validation layer
- `src/utils/scramble.ts` — integration hook
- `src/components/PracticeSessionModal.tsx` — modal integration + request tracking
- `vite.config.ts` — remove scramble worker workarounds
- Manual smoke test pass (50+ generations, failure paths, concurrency)

**Key Success Criteria**:
- Scramble generation completes reliably within 1000ms
- All outputs parseable by `Alg.fromString`
- Last-click-wins prevents stale state
- Production build succeeds; GitHub Pages deploy stable
- No timer/stats regression

**Parallel Execution**: Tasks T002, T003, T004, T005, T006, T007, T008 are independent (different modules/concerns). Run them in sequence only to avoid file conflicts, or parallelize with explicit file ranges.

---

## Phase 1: Setup & Foundational

- [x] T001 Create feature branch and verify structure

---

## Phase 2a: Design Review Gate (Quality Assurance)

**Goal**: Validate research/data-model/contracts artifacts against spec requirements before coding implementation.

**Review Checklist**:
- ✅ Quality constraints (same-face, opposite-face A-B-A patterns) are clearly defined in `research.md` Decision 1
- ✅ Data model entities (PracticeScramble, GenerationRequest, PracticeScrambleViewState) are complete in `data-model.md`
- ✅ API contract specifies input/output types and behavioral guarantees in `contracts/scramble-generator-contract.md`
- ✅ All 14 functional requirements are traceable to design artifacts or tasks
- ✅ No ambiguities blocking implementation (clarifications locked from spec session)

- [x] T001a [GATE] Review Phase 1 design artifacts (research, data-model, contracts) against spec requirements; confirm all constraints and API behaviors are clear before proceeding to T002

---

## Phase 2: Generator Core (User Story: Reliable Scramble Generation)

**Goal**: Implement deterministic 3x3 move generator meeting quality rules, parsing, and timeout guarantees.

**Independent Test Criteria**:
- Generator produces exactly 20 moves per call
- All moves are valid (faces U/D/L/R/F/B, suffixes "" | "'" | "2")
- No consecutive same-face moves
- No opposite-face A-B-A patterns
- All outputs parseable by `Alg.fromString`
- Timeout wrapper returns failure after 1000ms

- [x] T002 [P] Implement scrambleGenerator.ts with core move generation logic
- [x] T003 [P] Implement quality constraint validation (no consecutive/opposite-face patterns)
- [x] T004 [P] Implement parser validation wrapper (Alg.fromString compatibility)
- [x] T005 [P] Implement timeout wrapper with configurable duration (1000ms default)
- [x] T006 [P] Add TypeScript types and result union types (Success | Failure)

---

## Phase 3: Modal Integration (User Story: Last-Click-Wins Request Semantics)

**Goal**: Integrate generator into `PracticeSessionModal` with request tracking and stale-request filtering.

**Independent Test Criteria**:
- Rapid "New Scramble" clicks (10+) show only latest result
- Scramble remains unchanged during active timer session
- Failure (timeout/parse error) preserves last valid scramble
- Inline error message displays on failure, clears on success
- No out-of-order state updates

- [x] T007 [P] [US1] Add request tracking state to PracticeSessionModal (requestId counter + activeRequestId)
- [x] T008 [P] [US1] Implement New Scramble click handler with request token generation
- [x] T009 [P] [US1] Implement generator call with await + result handling (fulfilled/timedOut/failed paths)
- [x] T010 [P] [US1] Add lastValidScramble preservation logic on failure
- [x] T011 [P] [US1] Add inline error text UI and clear-on-success logic
- [x] T012 [US1] Update PracticeSessionModal to import fallback generator (replace cubing/scramble import)
- [x] T013 [US1] Verify timer controls still prevent scramble changes during timing (confirms FR-006 scramble-protection-during-active-timer requirement)

---

## Phase 4: Import Cleanup (User Story: Remove Worker Dependencies)

**Goal**: Remove runtime references to `cubing/scramble` and simplify Vite config.

**Independent Test Criteria**:
- No `cubing/scramble` or `cubing/search` imports in runtime code
- `npm run build` succeeds
- No worker-specific excludes remain in vite.config.ts
- Production bundle size reduced

- [x] T014 [P] Search and remove all cubing/scramble imports from src/ (verify grep output)
- [x] T015 [P] Search and remove all cubing/search imports from src/
- [x] T016 [P] Update vite.config.ts: remove optimizeDeps.exclude workaround
- [x] T017 [US1] Run `npm run build` and verify production bundle succeeds

---

## Phase 5: Testing & Validation (User Story: Acceptance Criteria)

**Goal**: Validate generator quality, concurrency behavior, failure handling, and no regressions.

**Independent Test Criteria** (all pass):
- Generator produces 50+ consecutive valid scrambles
- Rapid-click behavior shows only latest scramble
- Timeout at ~1000ms shows error + preserves last valid
- Parse validation confirms all samples pass `Alg.fromString`
- Timer start/stop unaffected
- Solve stats persist and display correctly
- GitHub Pages deploy stable

- [x] T018 [P] Manual smoke test: generate 50+ consecutive scrambles locally (verify output format, no hangs)
- [x] T019 [P] Manual concurrency test: rapid-click "New Scramble" 10+ times, verify stale filtering works
- [x] T020 [P] Manual failure test: simulate timeout by temporarily modifying generator (e.g., add `const delay = Math.random() * 1500; await new Promise(r => setTimeout(r, delay))` before returning result) to trigger 1000ms timeout consistently; verify last-valid scramble is preserved and inline error displays; remove delay before final commit
- [x] T021 [P] Manual parse test: sample 10 generated scrambles, verify `Alg.fromString` succeeds via console
- [x] T022 [P] Manual regression test: run full practice flow (scramble → timer start/stop → reset → stats view)
- [x] T023 [US1] Verify stats persistence (localStorage) still works across page reloads
- [x] T024 [US1] Build and deploy to GitHub Pages; test from production URL (after local validation gate passes)

---

## Phase 6: Polish & Documentation

- [x] T025 Add comments/JSDoc to scrambleGenerator.ts explaining quality rules
- [x] T026 Update src/utils/scramble.ts imports/exports for clarity
- [x] T027 Verify TypeScript build passes (`npm run build`)
- [x] T028 Update CHANGELOG or release notes (if applicable)

---

## Phase 7: Local Validation Gate (Required Before Merge/Push)

- [x] T029 Run local production build (`npm run build`) and confirm success
- [x] T030 Run manual local feature test pass (T018–T023) and record pass/fail checklist
- [x] T031 Perform brief manual code review/sign-off (generator rules, timeout/failure handling, request concurrency)
- [x] T032 Merge/push only after T029–T031 all pass

---

## Dependencies & Execution Order

### Critical Path (Blocking)
1. T001 (setup) → T002, T003 (generator core)
2. T002–T006 (generator independent, can run in parallel) → T007 (integration)
3. T007–T013 (integration, sequential within modal state) → T014–T017 (cleanup)
4. T014–T017 → T018–T024 (testing depends on clean code)
5. T018–T024 → T025–T028 (polish)
6. T025–T028 → T029–T032 (required local validation gate before merge/push)

### Parallelization Opportunities
- **T002–T006**: All implement different parts of generator module; can run in parallel if working in separate functions/branches within the file
- **T007–T011**: All integrate into modal state; recommend sequential to avoid merge conflicts in same component
- **T014–T015**: Both cleanup imports; can parallelize by dividing src/ tree regions
- **T018–T023**: All manual tests; fully parallelizable (different test scenarios)

### Independent Modules
- Generator logic (T002–T006) is independent from modal integration (T007–T013)
- Cleanup (T014–T017) can begin after T006 if imports are in separate layers
- Testing (T018–T024) is fully parallelizable

---

## Implementation Strategy

### MVP Scope (Phase 2 + Phase 3)
- Implement local generator core (T002–T006)
- Integrate into modal with last-click-wins (T007–T013)
- Verify via manual smoke test (T018, T019)
- **Deliverable**: Working practice modal with local scrambles, no production blocker

### Incremental Delivery
- **Checkpoint 1** (MVP): Generator + modal integration passing manual smoke tests
- **Checkpoint 2** (Cleanup): Worker imports removed, Vite config simplified, production build green
- **Checkpoint 3** (Full Test Pass): All 7 manual test scenarios pass; deployment stable

---

## Testing Notes

**No automated test runner configured in cfop-app**. Manual smoke tests per `quickstart.md` are acceptance gate:

1. **Smoke Test (T018)**: 50+ consecutive generations, format validation
2. **Concurrency Test (T019)**: Rapid clicks, stale filtering
3. **Failure Path (T020)**: Timeout + preservation
4. **Parse Compatibility (T021)**: `Alg.fromString` validation
5. **Regression (T022)**: Timer/stats flows unaffected
6. **Persistence (T023)**: localStorage still works
7. **Production Deploy (T024)**: GitHub Pages stable

**Build validation** via `npm run build` is the primary gate for preventing regressions.

