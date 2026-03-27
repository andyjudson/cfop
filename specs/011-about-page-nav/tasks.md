# Tasks: About Page & Persistent Hamburger Navigation

**Input**: Design documents from `/specs/011-about-page-nav/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. No tests were requested in the spec.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: Content audit — inventory what exists and where before any code changes.

- [ ] T001 Read cfop-app/src/pages/BGRPage.tsx and cfop-app/src/pages/IntuitivePage.tsx — document all intro/educational content that needs migrating to About page
- [ ] T002 [P] Read README.md (repo root) and cfop-app/README.md (if present) — document all educational content (CFOP background, methods, video links, practice tips) to be removed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Route infrastructure — must be in place before About page can be navigated to.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T003 Add `/about` route and update root redirect from `/2lk` to `/about` in cfop-app/src/App.tsx (import AboutPage once created; use a stub if needed to unblock)

**Checkpoint**: Foundation ready — routing exists for /about before page content is authored.

---

## Phase 3: User Story 1 — About Page Content (Priority: P1) 🎯 MVP

**Goal**: A single scrollable page consolidating all six educational content sections, accessible at `/about`.

**Independent Test**: Navigate to `/about` and confirm all six section headings are present and their content is readable. Confirm no content is missing compared to the T001/T002 audit inventory.

### Implementation for User Story 1

- [ ] T004 [US1] Create cfop-app/src/pages/AboutPage.tsx — CfopPageLayout wrapper with six section stubs: Cubing Background, CFOP Primer, Methods Overview, WCA Context, Video Resources, Practice Strategies
- [ ] T005 [US1] Fill "Cubing Background" section in cfop-app/src/pages/AboutPage.tsx — brief history and context of Rubik's cube speedsolving
- [ ] T006 [US1] Fill "CFOP Primer" section in cfop-app/src/pages/AboutPage.tsx — what CFOP stands for, the four stages (Cross, F2L, OLL, PLL), why it's effective
- [ ] T007 [US1] Fill "Methods Overview" section in cfop-app/src/pages/AboutPage.tsx — 2-look vs full CFOP, intuitive vs algorithm-heavy, suggested learning path
- [ ] T008 [US1] Fill "WCA Context" section in cfop-app/src/pages/AboutPage.tsx — what WCA competitions are, how times are measured, relevance to the scramble/timer feature
- [ ] T009 [US1] Fill "Video Resources" section in cfop-app/src/pages/AboutPage.tsx — migrate curated video links from BGRPage.tsx intro and README (CubeHead OLL/PLL + any others from audit)
- [ ] T010 [US1] Fill "Practice Strategies" section in cfop-app/src/pages/AboutPage.tsx — tips for drilling algorithms, using the scramble/timer, building recognition
- [ ] T011 [US1] Remove migrated intro content from cfop-app/src/pages/BGRPage.tsx — trim video links and any cubing-context prose now covered by About; retain the "Essentials Cases" summary line as it is page-specific
- [ ] T012 [US1] Remove migrated intro content from cfop-app/src/pages/IntuitivePage.tsx — trim any cubing-background prose identified in T001 audit; retain page-specific intro only

**Checkpoint**: User Story 1 complete — `/about` renders all six sections; existing page intros are trimmed without losing content.

---

## Phase 4: User Story 2 — Persistent Hamburger Navigation (Priority: P2)

**Goal**: Hamburger menu icon visible and functional on all screen sizes; closes on selection, backdrop tap, or Escape.

**Independent Test**: Resize browser from 375px to 1440px — hamburger icon is always visible, clicking it opens/closes the menu with About as the first item.

### Implementation for User Story 2

- [ ] T013 [US2] Add `{ path: '/about', label: 'About' }` as first entry in navLinks array in cfop-app/src/components/CfopNavigation.tsx
- [ ] T014 [US2] Add always-hamburger CSS overrides to cfop-app/src/App.css — `.cfop-navbar .navbar-burger { display: flex !important; }`, hide `.cfop-navbar .navbar-menu` and show only when `.is-active`
- [ ] T015 [US2] Add click-outside backdrop to cfop-app/src/components/CfopNavigation.tsx — transparent overlay div rendered when menu is open, onClick triggers setIsMenuOpen(false)
- [ ] T016 [US2] Add Escape key dismiss via useEffect in cfop-app/src/components/CfopNavigation.tsx — listener added when menu opens, removed on close or unmount

**Checkpoint**: User Story 2 complete — hamburger always visible, About first in menu, all dismiss interactions work.

---

## Phase 5: User Story 3 — README Cleanup (Priority: P3)

**Goal**: Repository README files contain only technical documentation; all educational content lives in the app.

**Independent Test**: Read README.md and cfop-app/README.md — confirm no CFOP primer, methods explanation, video links, or practice strategies remain.

### Implementation for User Story 3

- [ ] T017 [US3] Edit README.md — remove all CFOP educational content identified in T002 audit; retain setup, architecture, deployment, and contribution sections only
- [ ] T018 [P] [US3] Edit cfop-app/README.md (if present) — same cleanup: technical content only

**Checkpoint**: User Story 3 complete — README files are developer-facing documents only.

---

## Phase 6: Polish & Verification

**Purpose**: Build verification, cross-viewport manual test, and spec ledger update.

- [ ] T019 Run production build in cfop-app/ (`npm run build`) and confirm no TypeScript or compile errors
- [ ] T020 Manual cross-viewport test — verify hamburger icon visible and functional at 375px, 768px, 1280px, 1440px viewport widths
- [ ] T021 [P] Verify About page: all six section headings present, About is first item in nav menu, root `/` redirects to `/about`
- [ ] T022 [P] Add Feature 011 entry to specs/spec.md — narrative section + bullet in Implementation Plan

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — T001 and T002 can run in parallel immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (audit must inform route decisions) — blocks all user stories
- **US1 (Phase 3)**: Depends on Phase 2 (route must exist); T004 must complete before T005–T010; T011/T012 after T009 (content migrated first)
- **US2 (Phase 4)**: Depends on Phase 2; T013 before T014; T015 and T016 can follow T013 in parallel
- **US3 (Phase 5)**: Depends on Phase 3 (content must be in About before removing from README)
- **Polish (Phase 6)**: Depends on all user stories complete; T020/T021/T022 can run in parallel after T019

### User Story Dependencies

- **US1 (P1)**: Starts after Foundational; no dependency on US2 or US3
- **US2 (P2)**: Starts after Foundational; independent of US1 content but About route must exist (T003)
- **US3 (P3)**: Must follow US1 — content must be live in About before being removed from README

### Parallel Opportunities

- T001 and T002 (audit): Run in parallel
- T005–T010 (About sections): Sequential edits to same file — but each section is discrete
- T015 and T016 (backdrop + Escape): Can be done in same edit pass
- T017 and T018 (README cleanup): Parallel (different files)
- T019 build → then T020, T021, T022 in parallel

---

## Implementation Strategy

### MVP (User Story 1 Only)

1. Complete Phase 1: Audit content
2. Complete Phase 2: Add /about route
3. Complete Phase 3: Build AboutPage with all six sections; trim page intros
4. **STOP and VALIDATE**: Confirm all content accessible, no content lost
5. About page is live and navigable (even if hamburger still mobile-only)

### Incremental Delivery

1. Setup + Foundational → route exists
2. US1 → About page live (**MVP demo point**)
3. US2 → Hamburger always visible on desktop
4. US3 → READMEs cleaned up
5. Polish → Build verified, spec ledger updated

---

## Notes

- T001/T002 audit outputs are inputs to T004–T010 — do not skip
- The "Essentials Cases" summary line in BGRPage intro is page-specific and stays; only CFOP background prose and video links migrate
- Bulma's navbar CSS requires `!important` on the burger override — this is expected and acceptable per project CSS standards
- Backdrop-close in CfopNavigation follows the same pattern as AlgorithmNotesSheet (already in the codebase)
