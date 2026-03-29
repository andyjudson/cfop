# Tasks: Playwright E2E Test Suite

**Input**: Design documents from `/specs/016-playwright-e2e-tests/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Organization**: Tasks grouped by user story. Each story's spec file is independently creatable and runnable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to

---

## Phase 1: Setup

**Purpose**: Install Playwright and create the config so the suite can run at all.

- [ ] T001 Add `@playwright/test` to devDependencies in `cfop-app/package.json` and run `npm install`
- [ ] T002 Run `npx playwright install chromium` inside `cfop-app/` to download the browser
- [ ] T003 Create `cfop-app/playwright.config.ts` with baseURL `http://127.0.0.1:5173/cubing.spec/`, webServer config pointing to `npm run dev -- --host 127.0.0.1 --port 5173`, `reuseExistingServer: true`, testDir `./e2e`, and Chromium as the only browser project
- [ ] T004 Add `"test:e2e": "playwright test"` script to `cfop-app/package.json`
- [ ] T005 Create the `cfop-app/e2e/` directory

**Checkpoint**: Run `npx playwright test --list` from `cfop-app/` — should show 0 tests, no errors.

---

## Phase 2: Foundational (Blocking Prerequisite)

**Purpose**: Verify the dev server starts correctly under Playwright's webServer config before writing any tests.

**⚠️ CRITICAL**: Confirm this works before writing any spec files.

- [ ] T006 Create a minimal smoke file `cfop-app/e2e/smoke.spec.ts` that navigates to `/` and asserts the page title is not empty, then run `npx playwright test` to confirm the webServer boots and the base URL resolves correctly
- [ ] T007 Delete `cfop-app/e2e/smoke.spec.ts` once confirmed working

**Checkpoint**: Playwright can start the dev server and load the app. Ready to write all story specs.

---

## Phase 3: User Story 1 — Page Navigation and Content Rendering (Priority: P1) 🎯 MVP

**Goal**: Verify all primary pages load with expected content and nav links work.

**Independent Test**: `npx playwright test e2e/navigation.spec.ts` passes with all pages confirmed.

- [ ] T008 [US1] Create `cfop-app/e2e/navigation.spec.ts` and add a test that navigates to `/#/about` and asserts the page heading and WR chart section container are visible
- [ ] T009 [P] [US1] Add a test to `navigation.spec.ts` that navigates to `/#/oll`, `/#/pll`, and `/#/f2l` and asserts at least one algorithm card is rendered on each page
- [ ] T010 [P] [US1] Add a test to `navigation.spec.ts` that navigates to `/#/notation` and `/#/intuitive` and asserts a section heading is visible on each
- [ ] T011 [US1] Add a test to `navigation.spec.ts` that clicks a nav link from the expanded menu and asserts the correct page URL hash is active

**Checkpoint**: `npx playwright test e2e/navigation.spec.ts` — all tests green.

---

## Phase 4: User Story 2 — Mobile Navigation Behaviour (Priority: P2)

**Goal**: Verify icon group and hamburger are grouped correctly at 393px and the menu opens/closes.

**Independent Test**: `npx playwright test e2e/mobile-nav.spec.ts` passes at mobile viewport.

- [ ] T012 [US2] Create `cfop-app/e2e/mobile-nav.spec.ts` with viewport set to `{ width: 393, height: 852 }` in the test or `use` block, and add a test asserting `.cfop-nav-icons` and `.navbar-burger` are both visible and positioned on the right side of the navbar
- [ ] T013 [P] [US2] Add a test to `mobile-nav.spec.ts` that clicks the hamburger (`.navbar-burger`) and asserts the nav menu is visible with at least one nav link
- [ ] T014 [P] [US2] Add a test to `mobile-nav.spec.ts` that opens the menu then clicks the hamburger again and asserts the menu is no longer visible

**Checkpoint**: `npx playwright test e2e/mobile-nav.spec.ts` — all tests green.

---

## Phase 5: User Story 3 + 4 — Practice Timer Standard and Champion Mode (Priority: P3)

**Goal**: Verify practice modal opens, standard mode shows scramble and records a timed solve, champion mode loads a competition with scrambles.

**Independent Test**: `npx playwright test e2e/practice-timer.spec.ts` passes with both modes exercised.

- [ ] T015 [US3] Create `cfop-app/e2e/practice-timer.spec.ts` and add a test that clicks the practice timer nav icon (`[aria-label="Open practice timer"]`), asserts the modal is visible, and asserts a scramble string is displayed
- [ ] T016 [US3] Add a test to `practice-timer.spec.ts` that dispatches a spacebar `keydown` event to start the timer, waits 500ms, dispatches spacebar again to stop, then asserts a numeric time value appears in the stats area
- [ ] T017 [US3] Add a test to `practice-timer.spec.ts` that verifies last time and best time labels are visible after one solve is recorded
- [ ] T018 [P] [US4] Add a test to `practice-timer.spec.ts` that switches to champion mode, waits for a competition name to appear, and asserts it is non-empty
- [ ] T019 [P] [US4] Add a test to `practice-timer.spec.ts` that in champion mode asserts at least one scramble string is visible in the solve set

**Checkpoint**: `npx playwright test e2e/practice-timer.spec.ts` — all tests green.

---

## Phase 6: User Story 5 — Algorithm Visualiser Modal (Priority: P4)

**Goal**: Verify the visualiser modal opens from the nav icon and the player container element is present.

**Independent Test**: `npx playwright test e2e/visualiser-modal.spec.ts` passes.

- [ ] T020 [US5] Create `cfop-app/e2e/visualiser-modal.spec.ts` and add a test that clicks the visualiser nav icon (`[aria-label="Open algorithm visualizer"]`) and asserts the modal is visible and the player container element is present in the DOM
- [ ] T021 [P] [US5] Add a test to `visualiser-modal.spec.ts` that opens the modal then triggers the close action (close button or backdrop click) and asserts the modal is no longer visible

**Checkpoint**: `npx playwright test e2e/visualiser-modal.spec.ts` — all tests green.

---

## Phase 7: User Story 6 — WR Evolution Chart (Priority: P5)

**Goal**: Verify the WR chart on the About page renders without an error state.

**Independent Test**: `npx playwright test e2e/wr-chart.spec.ts` passes.

- [ ] T022 [US6] Create `cfop-app/e2e/wr-chart.spec.ts` and add a test that navigates to `/#/about`, waits for the Recharts container (`.recharts-responsive-container` or `svg`) to be visible, and asserts no `.wr-chart-error` element is present

**Checkpoint**: `npx playwright test e2e/wr-chart.spec.ts` — test green.

---

## Phase 8: Polish

- [ ] T023 Run the full suite with `npx playwright test` from `cfop-app/` and confirm all tests pass in a single run
- [ ] T024 [P] Verify the full suite completes in under 60 seconds (check run time in Playwright output)
- [ ] T025 [P] Update `quickstart.md` in `specs/016-playwright-e2e-tests/` if any run instructions differ from what was planned

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion — **blocks all story phases**
- **User Story phases (3–7)**: All depend on Phase 2; can proceed in any order or parallel after that
- **Polish (Phase 8)**: Depends on all story phases complete

### User Story Dependencies

- **US1 (P1)**: No story dependencies — implement first
- **US2 (P2)**: Independent of US1
- **US3 + US4 (P3)**: Share a spec file — implement sequentially within the file, independent of US1/US2
- **US5 (P4)**: Independent of all other stories
- **US6 (P5)**: Independent of all other stories

### Parallel Opportunities Within Stories

- T009 + T010 (US1 page checks): different routes, fully parallel
- T013 + T014 (US2 menu tests): different interactions, parallel
- T018 + T019 (US4 champion mode): parallel assertions
- T020 + T021 (US5 modal): parallel
- T023 + T024 + T025 (Polish): fully parallel

---

## Implementation Strategy

### MVP First (US1 only)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundational smoke check)
3. Complete Phase 3 (navigation.spec.ts)
4. **STOP and VALIDATE**: `npx playwright test e2e/navigation.spec.ts`
5. Suite is already useful — all primary pages confirmed working

### Incremental Delivery

1. Setup + Foundational → runner works
2. Phase 3 (US1) → pages confirmed → **MVP**
3. Phase 4 (US2) → mobile nav confirmed
4. Phase 5 (US3+US4) → timer confirmed
5. Phase 6 (US5) → visualiser confirmed
6. Phase 7 (US6) → chart confirmed
7. Phase 8 → full suite green, timing verified

---

## Notes

- [P] tasks are in different files with no incomplete-task dependencies
- `reuseExistingServer: true` prevents port conflicts if dev server is already running
- HashRouter routes: always navigate to `/#/route` not `/route`
- Spacebar timer tests: use `page.keyboard.press('Space')` or dispatch keydown events
- For champion mode data load: use `page.waitForSelector` with a reasonable timeout (5–10s)
- Commit after each phase checkpoint
