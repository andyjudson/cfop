# Tasks: Random Scramble and Solve Timer

**Input**: Design documents from `/specs/004-add-scramble-timer/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-interactions.md

**Tests**: No automated tests were explicitly requested in the feature spec; use manual validation from [quickstart.md](./quickstart.md).

**Organization**: Tasks are grouped by user story so each story can be implemented and verified independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create feature-level scaffolding used by all stories.

- [X] T001 Create practice session types from data model in cfop-app/src/types/practice.ts
- [X] T002 [P] Create scramble generation wrapper using cubing API in cfop-app/src/utils/scramble.ts
- [X] T003 [P] Create elapsed-time formatting helpers in cfop-app/src/utils/timeFormat.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared UI/state infrastructure required before user stories.

**⚠️ CRITICAL**: Complete this phase before starting user story work.

- [X] T004 Implement timer state machine hook (`idle/running/stopped`) in cfop-app/src/hooks/useSolveTimer.ts
- [X] T005 Create practice modal component skeleton and typed props in cfop-app/src/components/PracticeSessionModal.tsx
- [X] T006 [P] Add baseline modal/layout styles in cfop-app/src/components/PracticeSessionModal.css
- [X] T007 Wire practice modal open/close trigger in cfop-app/src/App.tsx

**Checkpoint**: Shared foundations ready; user story implementation can proceed.

---

## Phase 3: User Story 1 - Generate a Practice Scramble (Priority: P1) 🎯 MVP

**Goal**: User can generate and view a valid random scramble on demand.

**Independent Test**: Open practice modal, press New Scramble repeatedly, confirm each press replaces the scramble with a valid readable notation string.

### Implementation for User Story 1

- [X] T008 [US1] Implement initial scramble load on modal open in cfop-app/src/components/PracticeSessionModal.tsx
- [X] T009 [US1] Implement New Scramble action and replace-current behavior in cfop-app/src/components/PracticeSessionModal.tsx
- [X] T010 [US1] Add scramble loading/error messaging states in cfop-app/src/components/PracticeSessionModal.tsx
- [X] T011 [P] [US1] Style scramble display and action controls in cfop-app/src/components/PracticeSessionModal.css

**Checkpoint**: User Story 1 is independently functional and demoable.

---

## Phase 4: User Story 2 - Time a Solve (Priority: P2)

**Goal**: User can start and stop a simple timer and view final solve time.

**Independent Test**: Start timer, wait briefly, stop timer, verify elapsed time is > 0 and remains visible; start again and verify reset to zero.

### Implementation for User Story 2

- [X] T012 [US2] Integrate `useSolveTimer` into practice modal timer controls in cfop-app/src/components/PracticeSessionModal.tsx
- [X] T013 [US2] Render running elapsed time and stopped final time in cfop-app/src/components/PracticeSessionModal.tsx
- [X] T014 [US2] Enforce rapid-click safety and single active animation loop in cfop-app/src/hooks/useSolveTimer.ts
- [X] T015 [P] [US2] Style timer readout and start/stop button states in cfop-app/src/components/PracticeSessionModal.css

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Smooth Practice Flow (Priority: P3)

**Goal**: Scramble and timer interactions are consistent across repeated attempts.

**Independent Test**: Run repeated cycles (generate scramble → start/stop timer → request next scramble) and verify clear, predictable state transitions.

### Implementation for User Story 3

- [X] T016 [US3] Block scramble replacement while timer is running and keep timer state unchanged in cfop-app/src/components/PracticeSessionModal.tsx
- [X] T017 [US3] Show non-blocking user feedback for blocked scramble action in cfop-app/src/components/PracticeSessionModal.tsx
- [X] T018 [US3] Reset attempt-level transient UI state correctly between solves in cfop-app/src/components/PracticeSessionModal.tsx
- [X] T019 [P] [US3] Add blocked-action and attempt-status visual styles in cfop-app/src/components/PracticeSessionModal.css

**Checkpoint**: All user stories are independently functional and consistent together.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality pass across all stories.

- [X] T020 [P] Update practice entry button copy and accessibility labels in cfop-app/src/App.tsx
- [X] T021 Run full build/type-check via scripts in cfop-app/package.json and fix any resulting issues in cfop-app/src/App.tsx
- [X] T022 Validate manual checklist and record completion notes in specs/004-add-scramble-timer/quickstart.md
- [X] T023 Add Space-key timer toggle and prevent background scroll in cfop-app/src/components/PracticeSessionModal.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2.
- **Phase 4 (US2)**: Depends on Phase 2; can be implemented after US1 MVP validation.
- **Phase 5 (US3)**: Depends on Phase 2 and uses behavior from US1 + US2.
- **Phase 6 (Polish)**: Depends on completion of desired user stories.

### User Story Dependency Graph

- **US1 (P1)**: No user-story dependency after foundational phase.
- **US2 (P2)**: Depends on foundational phase; reuses modal and timer scaffolding.
- **US3 (P3)**: Depends on US1 scramble flow and US2 timer flow for combined interaction rules.

Recommended completion order: **US1 → US2 → US3**.

### Within-Story Execution Rules

- Complete state/model tasks before UI behavior tasks.
- Complete UI behavior tasks before style polish.
- Validate each story using its independent test criteria before advancing.

---

## Parallel Execution Examples

### User Story 1

- Run together after T010 is scoped:
  - T011 in cfop-app/src/components/PracticeSessionModal.css

### User Story 2

- Run together once timer behavior is stable:
  - T015 in cfop-app/src/components/PracticeSessionModal.css

### User Story 3

- Run together after blocked-action logic is implemented:
  - T019 in cfop-app/src/components/PracticeSessionModal.css

### Cross-Phase Parallel Opportunities

- Setup: T002 and T003 can run in parallel.
- Foundational: T006 can run in parallel with T004/T005.

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1 and Phase 2.
2. Implement Phase 3 (US1) only.
3. Validate US1 independent test.
4. Demo/review before adding timer complexity.

### Incremental Delivery

1. Deliver US1 scramble generation.
2. Deliver US2 timer behavior.
3. Deliver US3 interaction safety and UX consistency.
4. Perform polish/build/manual validation.

### Suggested MVP Scope

- **MVP**: Through Phase 3 (US1) for immediate user value.
- **Full Feature 004**: Through Phase 6.

---

## Notes

- All tasks follow required checklist format: checkbox, task ID, optional `[P]`, required story label for story phases, and explicit file path.
- Automated test tasks were omitted because the specification did not request TDD/automated tests.
