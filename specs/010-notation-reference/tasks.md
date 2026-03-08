# Tasks: Cubing Notation Reference Page

**Input**: Design documents from `/specs/010-notation-reference/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md, quickstart.md

**Tests**: Automated tests are not explicitly requested in the feature spec; this task list uses manual validation tasks per user story plus production build validation.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add page scaffold and wire initial route/navigation entry points.

- [X] T001 Create notation page scaffold with `CfopPageLayout` in `cfop-app/src/pages/NotationPage.tsx`
- [X] T002 Register notation route (`/notation`) in `cfop-app/src/App.tsx`
- [X] T003 Add `Notation` nav item placeholder in `cfop-app/src/components/CfopNavigation.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared notation content structures and rendering primitives used by all stories.

**⚠️ CRITICAL**: No user story work starts until this phase is complete.

- [X] T004 Create static entities (`NotationSection`, `NotationExample`, `TriggerReference`) in `cfop-app/src/pages/NotationPage.tsx`
- [X] T005 Implement reusable notation example card/tile renderer in `cfop-app/src/pages/NotationPage.tsx`
- [X] T006 [P] Implement per-example missing-image fallback indicator logic in `cfop-app/src/pages/NotationPage.tsx`
- [X] T007 [P] Add shared notation layout/responsive styles in `cfop-app/src/App.css`
- [X] T008 Add content guard comments to prevent copying legacy implementation patterns in `cfop-app/src/pages/NotationPage.tsx`

**Checkpoint**: Foundation complete; user stories can proceed.

---

## Phase 3: User Story 1 - Understand Basic Notation Symbols (Priority: P1) 🎯 MVP

**Goal**: Learners can understand face turns, prime turns, and double turns quickly.

**Independent Test**: Open `#/notation` and verify face rotation + modifier basics clearly explain clockwise vs prime vs double turns with relevant visuals.

### Implementation for User Story 1

- [X] T009 [US1] Implement Face Rotations section content and ordering in `cfop-app/src/pages/NotationPage.tsx`
- [X] T010 [US1] Implement Modifiers subsection content (`'`, `2`) in `cfop-app/src/pages/NotationPage.tsx`
- [X] T011 [P] [US1] Wire face/modifier notation assets from `cfop-app/public/assets/notation/` in `cfop-app/src/pages/NotationPage.tsx`
- [X] T012 [US1] Apply beginner-first symbol explanation text refinement in `cfop-app/src/pages/NotationPage.tsx`
- [X] T013 [US1] Manual validation for basic notation comprehension flow in `cfop-app/src/pages/NotationPage.tsx`

**Checkpoint**: US1 is fully functional and testable on its own.

---

## Phase 4: User Story 2 - Learn Extended Notation Concepts (Priority: P2)

**Goal**: Learners can understand wide turns, slice moves, and whole-cube rotations without contradictions.

**Independent Test**: Open `#/notation` and verify extended notation sections are clearly separated and symbol meanings are consistent.

### Implementation for User Story 2

- [ ] T014 [US2] Implement wide-turn notation explanations in Modifiers section in `cfop-app/src/pages/NotationPage.tsx`
- [ ] T015 [US2] Implement Slice Moves section (`M`, `S`, `E`) in `cfop-app/src/pages/NotationPage.tsx`
- [ ] T016 [US2] Implement Cube Rotations section (`x`, `y`, `z`) in `cfop-app/src/pages/NotationPage.tsx`
- [ ] T017 [P] [US2] Wire slice/rotation assets from `cfop-app/public/assets/notation/` in `cfop-app/src/pages/NotationPage.tsx`
- [ ] T018 [US2] Add contradiction check pass for symbol definitions in `cfop-app/src/pages/NotationPage.tsx`
- [ ] T019 [US2] Manual validation for extended notation readability on ~393px baseline in `cfop-app/src/App.css`

**Checkpoint**: US1 and US2 both work independently.

---

## Phase 5: User Story 3 - Use Trigger Reference During Practice (Priority: P3)

**Goal**: Learners can quickly find named triggers and inverse sequences during practice.

**Independent Test**: Open `#/notation` and verify trigger list includes name, sequence, inverse, and can be used as quick reference.

### Implementation for User Story 3

- [ ] T020 [US3] Implement Common Triggers section with named trigger entries in `cfop-app/src/pages/NotationPage.tsx`
- [ ] T021 [US3] Add inverse mapping display for each trigger in `cfop-app/src/pages/NotationPage.tsx`
- [ ] T022 [US3] Add optional context/purpose lines for triggers in `cfop-app/src/pages/NotationPage.tsx`
- [ ] T023 [US3] Finalize navbar order to `Intuitive → Notation → Beginner → F2L → OLL → PLL` in `cfop-app/src/components/CfopNavigation.tsx`
- [ ] T024 [US3] Validate notation route deep-link and active nav state in `cfop-app/src/App.tsx`
- [ ] T025 [US3] Manual validation for trigger lookup speed/clarity in `cfop-app/src/pages/NotationPage.tsx`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality and non-regression pass across all stories.

- [X] T026 [P] Accessibility pass (heading hierarchy, alt text, readable fallback text) in `cfop-app/src/pages/NotationPage.tsx`
- [X] T027 [P] Responsive spacing/typography polish for notation sections in `cfop-app/src/App.css`
- [X] T028 Run production build validation via scripts in `cfop-app/package.json`
- [X] T029 Run manual non-regression route checks for existing pages via `cfop-app/src/App.tsx`
- [X] T030 Document implementation outcome in `specs/010-notation-reference/implementation-summary.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: starts immediately.
- **Phase 2 (Foundational)**: depends on Setup; blocks all user story work.
- **Phase 3 (US1)**: depends on Foundational.
- **Phase 4 (US2)**: depends on Foundational.
- **Phase 5 (US3)**: depends on Foundational and can run after US1/US2 content exists.
- **Phase 6 (Polish)**: depends on completion of desired stories.

### User Story Dependencies

- **US1 (P1)**: independent after Foundational.
- **US2 (P2)**: independent after Foundational; does not require US3.
- **US3 (P3)**: independent after Foundational; relies on route/page existence from Setup.

### Parallel Opportunities

- T006 and T007 can run in parallel after T005.
- T011 can run in parallel with T009/T010.
- T017 can run in parallel with T015/T016.
- T026 and T027 can run in parallel during Polish.

---

## Parallel Execution Examples

### User Story 1

- T009 and T010 can proceed while T011 is wired in parallel.

### User Story 2

- T015 and T016 can proceed while T017 is wired in parallel.

### User Story 3

- T020 and T023 can proceed in parallel, then converge at T024.

---

## Implementation Strategy

### MVP First (US1)

1. Complete Setup + Foundational.
2. Deliver US1 and validate independently.
3. Demo/verify notation basics before expanding scope.

### Incremental Delivery

1. Add US2 extended notation concepts.
2. Add US3 trigger reference + nav ordering.
3. Execute polish and non-regression validation.

### Scope Guardrails

- Reuse legacy content and layout ideas only.
- Do not copy legacy implementation structure/code.
- Keep page static and informational.
- Preserve existing CFOP page behavior and routing.
