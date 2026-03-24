# Tasks: Feature 007 - Cube Image Generator Tool

**Input**: Design documents from `/specs/007-cube-image-generator/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2])
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize standalone `cubify-app` app with required tooling and base structure.

- [x] T001 Create standalone app folder structure in cubify-app/
- [x] T002 Create project manifest and scripts in cubify-app/package.json
- [x] T003 [P] Create TypeScript config files in cubify-app/tsconfig.json, cubify-app/tsconfig.app.json, cubify-app/tsconfig.node.json
- [x] T004 [P] Create Vite + React entry files in cubify-app/index.html, cubify-app/vite.config.ts, cubify-app/src/main.tsx
- [x] T005 [P] Create base app shell and styles in cubify-app/src/App.tsx, cubify-app/src/App.css, cubify-app/src/index.css
- [x] T006 Install and lock dependencies (`react`, `react-dom`, `cubing`, `bulma`, `typescript`, `vite`, `@vitejs/plugin-react`) in cubify-app/package-lock.json
- [x] T047 Add standalone boundary note in cubify-app README/entry docs: no links/buttons/routes to cfop-app and no cross-app coupling

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build core models/utilities/components required by all user stories.

**⚠️ CRITICAL**: No user story work should begin until this phase is complete.

- [x] T007 Define domain types and action-state contracts in cubify-app/src/types/imageGenerator.ts
- [x] T008 [P] Implement preset mask constants and lookup helpers in cubify-app/src/utils/maskPresets.ts
- [x] T009 [P] Implement algorithm parse/validation helpers in cubify-app/src/utils/algUtils.ts
- [x] T010 [P] Implement capture filename + mode helpers in cubify-app/src/utils/captureUtils.ts
- [x] T011 Create TwistyPlayer wrapper component skeleton in cubify-app/src/components/CubeViewer.tsx
- [x] T012 Create form component skeleton with controlled props in cubify-app/src/components/ControlForm.tsx
- [x] T013 Create action button group skeleton in cubify-app/src/components/ActionButtons.tsx
- [x] T014 Wire foundational state and component composition in cubify-app/src/App.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Generate Algorithm Case Images (Priority: P1) 🎯 MVP

**Goal**: Users can apply valid algorithms and capture fixed-size 2D/3D outputs.

**Independent Test**: Enter a valid algorithm, Apply, then Capture in both modes and verify output dimensions/format.

- [ ] T015 [P] [US1] Implement algorithm field validation + inline error state in cubify-app/src/utils/algUtils.ts
- [ ] T016 [US1] Implement setup/move algorithm inputs and Enter-to-Apply submit behavior in cubify-app/src/components/ControlForm.tsx
- [ ] T017 [US1] Implement Apply action to update TwistyPlayer state in cubify-app/src/App.tsx
- [ ] T018 [US1] Implement render-only TwistyPlayer baseline config (`background:none`, `hintFacelets:none`, `controlPanel:none`) in cubify-app/src/components/CubeViewer.tsx
- [ ] T019 [US1] Implement Capture action using `experimentalDownloadScreenshot` in cubify-app/src/components/ActionButtons.tsx
- [ ] T020 [US1] Enforce 3D capture target sizing (288x288) and 2D fixed SVG workflow in cubify-app/src/components/CubeViewer.tsx
- [ ] T021 [US1] Implement timestamped filename pattern `cubing-3x3-{timestamp}` in cubify-app/src/utils/captureUtils.ts
- [ ] T022 [US1] Disable Play/Capture for empty or invalid move algorithm in cubify-app/src/App.tsx and cubify-app/src/components/ActionButtons.tsx
- [ ] T023 [US1] Execute manual validation checklist items for SC-001/SC-002/SC-004 from specs/007-cube-image-generator/quickstart.md and record pass/fail outcomes
- [ ] T044 [US1] Implement 2D↔3D mode-switch state preservation + automatic re-render in cubify-app/src/App.tsx and cubify-app/src/components/CubeViewer.tsx (FR-015)

**Checkpoint**: User Story 1 fully functional and independently testable.

---

## Phase 4: User Story 2 - Use Preset Masks for CFOP Stages (Priority: P1)

**Goal**: Preset mask dropdown applies correct stage-focused sticker visibility.

**Independent Test**: Select each preset (`default`, `cross`, `f2l`, `oll`, `pll`) and verify expected visual output after Apply.

- [ ] T024 [P] [US2] Implement preset mask selector UI in cubify-app/src/components/ControlForm.tsx
- [ ] T025 [US2] Map preset keys to mask notation and expose effective preset value in cubify-app/src/utils/maskPresets.ts
- [ ] T026 [US2] Apply selected preset mask to TwistyPlayer stickering configuration in cubify-app/src/components/CubeViewer.tsx
- [ ] T027 [US2] Wire preset selection state and Apply behavior in cubify-app/src/App.tsx
- [ ] T028 [US2] Execute preset mask validation checklist from specs/007-cube-image-generator/quickstart.md and record pass/fail outcomes

**Checkpoint**: User Story 2 independently functional and testable.

---

## Phase 5: User Story 3 - Custom Mask for Special Cases (Priority: P2)

**Goal**: Advanced users can override presets with custom mask notation.

**Independent Test**: Enter a custom mask, Apply, and confirm custom value takes precedence over selected preset.

- [ ] T029 [P] [US3] Implement custom mask text input with preserved value in cubify-app/src/components/ControlForm.tsx
- [ ] T030 [US3] Implement deterministic mask precedence (`custom > preset`) in cubify-app/src/App.tsx
- [ ] T031 [US3] Apply effective mask (including custom overrides) in cubify-app/src/components/CubeViewer.tsx
- [ ] T032 [US3] Execute custom-mask override validation checklist from specs/007-cube-image-generator/quickstart.md and record pass/fail outcomes

**Checkpoint**: User Story 3 independently functional and testable.

---

## Phase 6: User Story 4 - Preview Algorithm Animation (Priority: P3)

**Goal**: Users can play algorithm animation as a QA step before capture.

**Independent Test**: With valid algorithm, Play animates at configured speed; invalid/empty algorithm keeps Play disabled.

- [ ] T033 [P] [US4] Implement Play button UI and disabled-state props in cubify-app/src/components/ActionButtons.tsx
- [ ] T034 [US4] Implement play action wiring and timing configuration (~1.5x baseline) in cubify-app/src/components/CubeViewer.tsx
- [ ] T035 [US4] Integrate play state gating with validation state in cubify-app/src/App.tsx
- [ ] T036 [US4] Execute playback validation checklist from specs/007-cube-image-generator/quickstart.md and record pass/fail outcomes

**Checkpoint**: User Story 4 independently functional and testable.

---

## Phase 7: User Story 5 - Debug with Inverted Algorithms (Priority: P3)

**Goal**: Apply action logs original + inverted algorithms for developer workflows.

**Independent Test**: Apply valid algorithm and verify both original and inverted notation appear in browser console.

- [ ] T037 [P] [US5] Implement algorithm inversion formatter utility in cubify-app/src/utils/algUtils.ts
- [ ] T038 [US5] Emit structured console logs on Apply for original/inverted algorithms in cubify-app/src/App.tsx
- [ ] T039 [US5] Execute console-log validation checklist from specs/007-cube-image-generator/quickstart.md and record pass/fail outcomes

**Checkpoint**: User Story 5 independently functional and testable.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, manual QA, and feature documentation closure.

- [ ] T040 [P] Apply shared theme + Bulma consistency in cubify-app/src/App.css and cubify-app/src/index.css (FR-009), including responsive layout tuning for desktop + small screens
- [ ] T041 [P] Add concise developer usage notes for cubify-app in README.md
- [ ] T045 [P] Create specs/007-cube-image-generator/implementation-summary.md scaffold for validation logs and completion notes
- [ ] T046 Define and document explicit SC-008 measurement method (PNG file-size check procedure for 10-sample run) in specs/007-cube-image-generator/quickstart.md and specs/007-cube-image-generator/implementation-summary.md
- [ ] T048 Validate isolation guardrail (FR-017): confirm no buttons/links between `cfop-app` and `cubify-app`, no shared route dependency, and no runtime imports from `cfop-app` into `cubify-app`; record result in specs/007-cube-image-generator/implementation-summary.md
- [ ] T042 Run full quickstart validation checklist and record outcomes in specs/007-cube-image-generator/implementation-summary.md
- [ ] T043 Run final build gate for cubify-app (`npm run build`) and capture result in specs/007-cube-image-generator/implementation-summary.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: no dependencies
- **Phase 2 (Foundational)**: depends on Phase 1; blocks all user stories
- **Phases 3-7 (User Stories)**: depend on Phase 2 completion
  - US1 and US2 can run in parallel after Phase 2
  - US3 depends on US2 mask flow baseline
  - US4 depends on US1 validation/action wiring
  - US5 depends on US1 Apply flow and alg utils
- **Phase 8 (Polish)**: depends on completion of desired stories

### User Story Dependencies

- **US1 (P1)**: starts immediately after Foundational; MVP core
- **US2 (P1)**: starts after Foundational; independent from US1 except shared viewer wiring
- **US3 (P2)**: depends on US2 mask selection flow
- **US4 (P3)**: depends on US1 action + validation states
- **US5 (P3)**: depends on US1 Apply path and alg utilities
- **FR-015 mode-switch preservation**: implemented in T044 as part of US1 completion criteria

### Within Each User Story

- Utilities/state before UI integration
- UI wiring before manual validation updates
- Story complete and independently testable before moving forward

### Parallel Opportunities

- Phase 1: T003, T004, T005 can run in parallel
- Phase 2: T008, T009, T010 can run in parallel
- US1: T015 can run in parallel with T016/T018 before integration tasks; T044 follows state wiring tasks
- US2: T024 and T025 can run in parallel
- US4 + US5 can run in parallel once US1 is stable

---

## Parallel Example: User Story 2

```bash
# Parallelizable tasks for US2:
Task: "T024 [US2] Implement preset mask selector UI in cubify-app/src/components/ControlForm.tsx"
Task: "T025 [US2] Map preset keys to mask notation in cubify-app/src/utils/maskPresets.ts"
```

## Parallel Example: User Story 4

```bash
# Parallelizable tasks for US4:
Task: "T033 [US4] Implement Play button UI and disabled-state props in cubify-app/src/components/ActionButtons.tsx"
Task: "T034 [US4] Implement play action wiring and timing configuration in cubify-app/src/components/CubeViewer.tsx"
```

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 + Phase 2
2. Complete US1 (Phase 3)
3. Validate independent capture workflow (2D/3D)
4. Demo MVP for feedback

### Incremental Delivery

1. Ship US1 core image workflow
2. Add US2 preset masks
3. Add US3 custom override
4. Add US4 playback QA
5. Add US5 inversion logs
6. Run polish + final validation gate

### Suggested MVP Scope

- **MVP**: User Story 1 only (Apply + valid render + fixed capture outputs)

