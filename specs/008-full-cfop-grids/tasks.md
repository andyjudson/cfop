# Implementation Tasks: Full CFOP Algorithm Grids

**Feature**: 008-full-cfop-grids | **Branch**: `008-full-cfop-grids`  
**Generated**: 2026-03-08 | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Overview

This document breaks down Feature 008 into executable implementation tasks organized by user story. Each phase represents an independently testable increment of functionality.

**Total User Stories**: 4 (US1: F2L Page, US2: OLL Page, US3: PLL Page, US4: Navigation)  
**Priority Order**: US4 (Navigation) → US1 (F2L) → US2 (OLL) → US3 (PLL)  
**Tech Stack**: React 19+, TypeScript 5.x, React Router, Bulma CSS, Vite  
**Testing**: Vitest (unit), Cypress (e2e)

---

---

## Phase 1: Project Setup

**Goal**: Initialize routing infrastructure and refactor existing 2LK page into routable component structure.

**Tasks**:

- [X] T001 Install React Router package in cfop-app/package.json
- [X] T002 Create cfop-app/src/pages/ directory for page components
- [X] T003 Extract existing App.tsx content to cfop-app/src/pages/BGRPage.tsx (2LK page)
- [X] T004 Configure hash-based routing in cfop-app/src/App.tsx with routes for /#/2lk, /#/f2l, /#/oll, /#/pll

---

## Phase 2: Foundational Components

**Goal**: Build reusable UI components that all CFOP pages will share (expandable sections, navigation menu, page layout).

**Independent Test**: Components can be tested in isolation with mock data before page implementation.

**Tasks**:

- [X] T005 [P] Create cfop-app/src/components/AlgorithmGroupSection.tsx (expandable section wrapper with collapse toggle)
- [X] T006 [P] Create cfop-app/src/components/ExpandCollapseControls.tsx ("Expand All"/"Collapse All" button group)
- [X] T007 [P] Create cfop-app/src/components/CfopNavigation.tsx (persistent header navigation with active page indicator)
- [X] T008 [P] Create cfop-app/src/components/CfopPageLayout.tsx (shared layout wrapper with navigation + content area)
- [X] T009 [P] Create cfop-app/src/hooks/useSectionToggle.ts (manage expand/collapse state in sessionStorage)
- [X] T010 [P] Create cfop-app/src/components/ErrorBoundary.tsx (error display with retry button for data loading failures)

---

## Phase 3: User Story 1 - Navigate Between CFOP Pages (Priority: P1) 🎯 MVP

**Goal**: Users can navigate between 2LK, F2L, OLL, and PLL pages with active-state indication and browser history support.

**Independent Test**: Navigate 2LK → F2L → OLL → PLL → 2LK and validate active nav + back/forward behavior.

### Implementation for User Story 1

- [X] T011 [US1] Navigation links and active-state rendering implemented in CfopNavigation.tsx
- [X] T012 [US1] BGRPage created for 2LK route preserving existing behavior
- [X] T013 [US1] Route declarations added in App.tsx for all four pages
- [X] T014 [US1] CfopPageLayout created providing consistent layout wrapper
- [ ] T015 [US1] Add navigation-specific responsive style tuning in cfop-app/src/App.css

**Checkpoint**: ✅ Navigation works independently with current 2LK experience intact.

---

## Phase 4: User Story 2 - F2L and PLL Grouped Reference Pages (Priority: P1)

**Goal**: Deliver full F2L and full PLL grouped pages with expandable sections and card-only content.

**Independent Test**: Open F2L and PLL pages, expand/collapse groups, verify cards and counts.

### Implementation for User Story 2

- [X] T016 [US2] F2LPage.tsx created with grouped renderer, data loader, and expand/collapse controls
- [X] T017 [US2] PLLPage.tsx created with grouped renderer, data loader, and expand/collapse controls
- [X] T018 [US2] F2L/PLL routes integrated into App.tsx
- [X] T019 [US2] Static card display ensured (no tooltip/demo/timer controls on F2L/PLL pages)

**Checkpoint**: ✅ F2L and PLL pages are independently usable and match reference-grid scope.

---

## Phase 5: User Story 3 - OLL Consolidated Groups via JSON (Priority: P2)

**Goal**: Use 7 consolidated OLL groups by rewriting JSON `group` labels directly.

**Independent Test**: Validate all 57 OLL entries use exactly one of 7 consolidated labels and render correctly in OLL page.

### Implementation for User Story 3

- [X] T020 [US3] Rewrite OLL `group` values to consolidated labels in cfop-app/public/data/algs-cfop-oll.json
- [X] T021 [US3] OLLPage.tsx created with grouped renderer and expand/collapse controls
- [X] T022 [US3] OLL route integrated into App.tsx
- [ ] T023 [US3] Add OLL group ordering constants (7-group order) in cfop-app/src/utils/groupOrder.ts
- [ ] T024 [US3] Add lightweight JSON validation helper for allowed OLL groups in cfop-app/src/utils/validateOllGroups.ts

**Checkpoint**: OLL page structure complete, JSON consolidation complete (T020 ✅).

---

## Phase 6: User Story 4 - Expand/Collapse UX Controls (Priority: P2)

**Goal**: Progressive-disclosure controls across full CFOP pages with default-collapsed sections and expand-all/collapse-all.

**Independent Test**: On F2L/OLL/PLL pages, default collapsed; individual toggle works; expand-all/collapse-all works.

### Implementation for User Story 4

- [ ] T025 [US4] Implement section expanded-state model and handlers in cfop-app/src/pages/GroupedAlgorithmsPage.tsx
- [ ] T026 [US4] Implement Expand All / Collapse All behavior in cfop-app/src/components/ExpandCollapseControls.tsx
- [ ] T027 [US4] Implement group header toggle interaction + counts in cfop-app/src/components/AlgorithmGroupSection.tsx
- [ ] T028 [US4] Add expand/collapse transitions and motion-safe styling in cfop-app/src/App.css
- [ ] T029 [US4] Reset expanded state on page revisit/route change in cfop-app/src/pages/GroupedAlgorithmsPage.tsx

**Checkpoint**: Expand/collapse UX is complete and independently testable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final integration checks, docs, and validation.

- [X] T030 [P] Update cfop-app feature documentation with new page navigation and grouped views in cfop-app/README.md
- [X] T031 Verify 2LK interactive features still work unchanged in cfop-app/src/pages/BGRPage.tsx
- [X] T032 Run production build and address regressions in cfop-app/package.json scripts
- [ ] T033 Perform manual responsive validation (iPhone baseline + desktop) and capture checklist in specs/008-full-cfop-grids/checklists/requirements.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 → required before Phase 2
- Phase 2 → blocks all user stories
- Phase 3 (US1) → should complete first (MVP navigation)
- Phase 4 (US2), Phase 5 (US3), and Phase 6 (US4) can proceed after Phase 2; recommended order: US1 → US2 → US3 → US4
- Phase 7 depends on completion of selected stories

### User Story Dependencies

- **US1**: Depends on foundational setup only
- **US2**: Depends on US1 routing shell and foundational components
- **US3**: Depends on US1 routing shell and US2 grouped renderer
- **US4**: Depends on grouped page/section components from US2/US3

### Critical Data Decision Coverage

- OLL consolidation via JSON rewrite is explicitly covered by **T020** in cfop-app/public/data/algs-cfop-oll.json.

---

## Parallel Opportunities

- **Setup/Foundational**: T003, T005, T006 can run in parallel
- **US2**: T016 and T017 can run in parallel after T015
- **US3**: T023 and T024 can run in parallel with T021
- **Polish**: T030 can run in parallel with T031/T032

### Parallel Example: US2

- [ ] T016 [US2] Create F2L page using grouped renderer and data loader in cfop-app/src/pages/F2LPage.tsx
- [ ] T017 [US2] Create PLL page using grouped renderer and data loader in cfop-app/src/pages/PLLPage.tsx

---

## Implementation Strategy

### MVP First

1. Complete Phase 1 + Phase 2
2. Complete US1 (Phase 3) for route/navigation MVP
3. Validate route flow and existing 2LK behavior

### Incremental Delivery

1. Add US2 (F2L/PLL grouped pages)
2. Add US3 (OLL consolidated JSON + page)
3. Add US4 (expand/collapse UX refinements)
4. Finish with Phase 7 validation and docs
