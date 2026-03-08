---
description: "Task breakdown for persistent solve time stats feature"
---

# Tasks: Persistent Solve Time Stats

**Input**: Design documents from `/specs/005-track-solve-stats/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/stats-ui-contract.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

All paths relative to `cfop-app/` directory:
- React components: `src/components/`
- Custom hooks: `src/hooks/`
- Type definitions: `src/types/`
- Utilities: `src/utils/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Type definitions and localStorage foundation that all user stories depend on

- [X] T001 Create solve record types in cfop-app/src/types/solve-stats.ts (SolveRecord, SolveHistoryStore, SolveStatsSummary)
- [X] T002 [P] Create versioned localStorage envelope utilities in cfop-app/src/utils/storage.ts (save/load with validation and corruption handling)

**Checkpoint**: Type definitions and storage utilities ready for user story implementations

---

## Phase 2: User Story 1 - Save and Show Last Solve (Priority: P1) 🎯 MVP

**Goal**: Persist completed solve times to localStorage and display the most recent solve in the practice modal

**Independent Test**: Complete one solve, verify "Last time" displays, close/reopen modal, confirm same value persists

### Implementation for User Story 1

- [X] T003 [US1] Create useSolveStats hook with save/load logic in cfop-app/src/hooks/useSolveStats.ts (reads history on mount, exposes saveSolve function, computes lastTimeMs stat)
- [X] T004 [US1] Extend PracticeSessionModal to integrate useSolveStats hook in cfop-app/src/components/PracticeSessionModal.tsx (call saveSolve on timer stop)
- [X] T005 [US1] Add stats display UI section to PracticeSessionModal in cfop-app/src/components/PracticeSessionModal.tsx (render "Last time" field with formatted value or empty state)
- [X] T006 [US1] Style stats display section in cfop-app/src/components/PracticeSessionModal.css (layout and typography for stats area)

**Checkpoint**: At this point, last solve time should persist and display correctly across modal reopens

---

## Phase 3: User Story 2 - See Average of Last 5 Solves (Priority: P2)

**Goal**: Calculate and display rolling average of most recent 5 solves with clear handling of partial history

**Independent Test**: Complete 5+ solves, verify "Average (last 5)" matches expected mean; test with <5 solves to verify partial state display

### Implementation for User Story 2

- [X] T007 [US2] Add averageLast5Ms calculation to useSolveStats hook in cfop-app/src/hooks/useSolveStats.ts (compute mean of last 5 valid records, return null if <5)
- [X] T008 [US2] Extend stats display UI to show "Average (last 5)" in cfop-app/src/components/PracticeSessionModal.tsx (render average field with formatted value or partial-state placeholder)
- [X] T009 [US2] Add partial-state helper text/styling for <5 solves in cfop-app/src/components/PracticeSessionModal.css (visual distinction for incomplete rolling window)

**Checkpoint**: At this point, both last solve AND rolling average should display correctly with proper empty/partial state handling

---

## Phase 4: User Story 3 - Track Personal Best (Priority: P3)

**Goal**: Track and display fastest solve time across all session history

**Independent Test**: Record multiple solves with varying times, verify "Best time" always shows the fastest; add a slower solve and confirm best remains unchanged

### Implementation for User Story 3

- [X] T010 [US3] Add bestTimeMs calculation to useSolveStats hook in cfop-app/src/hooks/useSolveStats.ts (find minimum valid elapsedMs from all records, return null if none)
- [X] T011 [US3] Extend stats display UI to show "Best time" in cfop-app/src/components/PracticeSessionModal.tsx (render best field with formatted value or empty state)

**Checkpoint**: All three stats (last, average, best) should now display correctly and update immediately after each solve

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Refinements and validation across all user stories

- [X] T012 [P] Add defensive error handling for corrupted localStorage in cfop-app/src/utils/storage.ts (catch parse errors, log warnings, return safe empty state)
- [X] T013 [P] Implement history size bounding in cfop-app/src/hooks/useSolveStats.ts (limit stored records to max count, e.g., 100 recent solves)
- [X] T014 [P] Add empty-state messaging for zero solves in cfop-app/src/components/PracticeSessionModal.tsx (clear placeholders when no history exists)
- [X] T015 Verify all stats update reactively after each saved solve in cfop-app/src/components/PracticeSessionModal.tsx (ensure re-render triggers correctly)
- [X] T016 Run validation checklist from specs/005-track-solve-stats/quickstart.md (manual browser verification of all acceptance scenarios)

**Additional refinements completed:**
- [X] Added resetStats button with clearSolveHistory functionality
- [X] Unified modal headers (both use Bulma delete button)
- [X] Added Space key binding to demo modal for play/pause toggle

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup (T001, T002) completion
- **User Story 2 (Phase 3)**: Depends on User Story 1 completion (needs useSolveStats hook and stats UI foundation)
- **User Story 3 (Phase 4)**: Depends on User Story 1 completion (can run in parallel with US2 if desired)
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup (Phase 1) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 (extends the same hook and UI) - Sequential dependency
- **User Story 3 (P3)**: Depends on User Story 1 (extends the same hook and UI) - Can run parallel with US2 if team capacity allows

### Within Each User Story

- User Story 1: Hook (T003) before modal integration (T004-T006)
- User Story 2: Hook extension (T007) before UI extension (T008-T009)
- User Story 3: Hook extension (T010) before UI extension (T011)

### Parallel Opportunities

- **Setup Phase**: T001 and T002 can run in parallel (different files)
- **User Story 1**: T005 and T006 can run in parallel after T004 (UI and CSS are independent)
- **User Story 2**: T008 and T009 can run in parallel after T007
- **User Story 3**: Can run in parallel with User Story 2 if team capacity allows (both extend same hook independently)
- **Polish Phase**: T012, T013, T014 can all run in parallel (different concerns)

---

## Parallel Example: Setup Phase

```bash
# Launch both setup tasks together:
Task T001: "Create solve record types in cfop-app/src/types/solve-stats.ts"
Task T002: "Create versioned localStorage envelope utilities in cfop-app/src/utils/storage.ts"
```

## Parallel Example: User Story 1 (after T004)

```bash
# Launch UI and styling together:
Task T005: "Add stats display UI section to PracticeSessionModal"
Task T006: "Style stats display section in PracticeSessionModal.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: User Story 1 (T003-T006)
3. **STOP and VALIDATE**: Test last solve persistence independently using quickstart.md checklist for US1
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup → Foundation ready
2. Add User Story 1 → Test independently → Merge to master (MVP!)
3. Add User Story 2 → Test independently → Merge to master
4. Add User Story 3 → Test independently → Merge to master
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers (after Setup complete):

1. Team completes Setup (Phase 1) together
2. Developer A: User Story 1 (Phase 2)
3. Once US1 complete:
   - Developer A: User Story 2 (Phase 3)
   - Developer B: User Story 3 (Phase 4) — can run parallel with US2
4. Team: Polish & validation (Phase 5)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Focus on US1 (MVP) first before expanding to US2/US3
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Stats computations are pure derivations from history; no complex state management needed
- localStorage is untrusted input; defensive validation critical for stability
