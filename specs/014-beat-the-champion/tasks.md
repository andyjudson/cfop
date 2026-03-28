# Tasks: Beat the Champion (014)

**Input**: Design documents from `/specs/014-beat-the-champion/`
**Branch**: `014-beat-the-champion`

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: Which user story this task belongs to (US1 / US2 / US3)

---

## Phase 1: Setup

**Purpose**: Data file in place and project structure ready

- [ ] T001 Copy `pyspark_sandbox/export/clean/wca_beat_the_champion.json` → `cfop-app/public/data/wca-beat-the-champion.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Types and data loader that all user story phases depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T002 Create `cfop-app/src/types/competition.ts` with `Competition`, `PracticeMode`, `CompetitiveSession`, `ComparisonOutcome` interfaces per data-model.md
- [ ] T003 [P] Create `cfop-app/src/utils/competitionData.ts` — fetch + NDJSON parse using `import.meta.env.BASE_URL + 'data/wca-beat-the-champion.json'`; module-level `Competition[]` cache; returns `Competition[]` or throws on failure

**Checkpoint**: Types defined, data loader works — user story implementation can begin

---

## Phase 3: User Story 1 — Practice with Real Competition Scrambles (P1) 🎯 MVP

**Goal**: User enters Competitive mode, receives real competition scrambles in sequence, and sees a comparison result after all 5 solves.

**Independent Test**: Open Practice modal → toggle to Competitive → complete 5 solves with the auto-selected competition's scrambles → see comparison result screen showing user times vs winner times.

### Implementation

- [ ] T004 [US1] Add `mode: PracticeMode` state (default `'standard'`) and `competitiveSession: CompetitiveSession | null` state to `PracticeSessionModal.tsx`; add mode toggle segmented control to modal header (`cfop-app/src/components/PracticeSessionModal.tsx`)
- [ ] T005 [US1] Implement toggle-to-competitive logic in `PracticeSessionModal.tsx`: call `loadCompetitions()`, auto-select `data[0]` (most recent), randomly pick a group key, set `CompetitiveSession` with `currentIndex: 0, solveTimesMs: []`; disable toggle while `timer.state === 'running'`
- [ ] T006 [US1] In `PracticeSessionModal.tsx`, serve scrambles from `competitiveSession.scrambles[currentIndex]` when `mode === 'competitive'` instead of calling `generateRandom333Scramble()`; show solve progress label ("Solve N of 5") in the scramble block
- [ ] T007 [US1] In `handleStop` for competitive mode (`PracticeSessionModal.tsx`): push `timer.elapsedMs` to `solveTimesMs`, increment `currentIndex`; do NOT call `saveSolve()` (standard stats must stay clean)
- [ ] T008 [US1] Create `cfop-app/src/components/ComparisonResult.tsx` + `ComparisonResult.css`: accepts `ComparisonOutcome` prop; renders two-column comparison table (user vs champion single + average); "You beat the champion!" indicator when `beatSingle || beatAverage`; shortfall text otherwise; "Try Again" and "Back to Standard" buttons; omits average row when `winner_average` is null
- [ ] T009 [US1] Wire `ComparisonResult` into `PracticeSessionModal.tsx`: compute `ComparisonOutcome` when `currentIndex === scrambles.length` after final solve stop; replace scramble + timer blocks with `ComparisonResult`; "Try Again" re-randomises group for same competition; "Back to Standard" clears session and sets `mode: 'standard'`
- [ ] T010 [US1] Add data load failure fallback in `PracticeSessionModal.tsx`: if `loadCompetitions()` throws, revert `mode` to `'standard'` and show the existing `practice-status` notice ("Competitive mode unavailable — using random scrambles")
- [ ] T011 [P] [US1] Add mode toggle styles and competitive scramble block styles to `cfop-app/src/components/PracticeSessionModal.css`; add `ComparisonResult.css` tokens-only styles (no hardcoded hex/rgba); verify 393px viewport renders without overflow

**Checkpoint**: Full P1 loop — mode toggle → auto-selected competition → 5 real scrambles → comparison result — works end to end

---

## Phase 4: User Story 2 — Browse and Select a Competition (P2)

**Goal**: User can open a competition selector, see all 57 events with names, years, tiers, and winning times, and choose one to practice against.

**Independent Test**: In Competitive mode, tap "Change Competition" → see scrollable list of 50+ events each showing name, year, WR/Champ badge, winner single and average → select one → scrambles and target times update to match.

### Implementation

- [ ] T012 [P] [US2] Create `cfop-app/src/components/CompetitionSelector.tsx`: accepts `competitions: Competition[]`, `selectedId: string`, `onSelect: (c: Competition) => void`, `onCancel: () => void`; renders scrollable list with one row per competition (name, year, tier badge, winner single, winner average or "—"); highlights selected row; includes Cancel button
- [ ] T013 [P] [US2] Create `cfop-app/src/components/CompetitionSelector.css`: tokens-only styles; scrollable list constrained within modal height; tier badge variants for 'wr' and 'championship'; mobile-first (393px)
- [ ] T014 [US2] Integrate `CompetitionSelector` into `PracticeSessionModal.tsx`: add `showSelector: boolean` state; show selector panel (replacing scramble/timer area) on first Competitive mode activation and when "Change Competition" is tapped; on `onSelect` — initialise new `CompetitiveSession` with the chosen competition and a freshly randomised group; on `onCancel` — hide selector, return to current session
- [ ] T015 [US2] Add "Change Competition" link/button to the competitive scramble block in `PracticeSessionModal.tsx`; show competition name + tier badge as context header above scramble display

**Checkpoint**: Competition selector fully functional — list visible, selection updates scrambles and target times

---

## Phase 5: User Story 3 — Return to Standard Practice Mode (P3)

**Goal**: User in Competitive mode can switch back to Standard in one tap with no session contamination.

**Independent Test**: Run several competitive solves → toggle back to Standard → confirm random scrambles resume and standard session stats (last time, average, best) are unchanged.

### Implementation

- [ ] T016 [US3] Verify `PracticeSessionModal.tsx` toggle-to-standard path: `competitiveSession` set to `null`, `showSelector` set to `false`, `mode` set to `'standard'`, call `loadScramble('initial')` to resume random scrambles; `useSolveStats` / `saveSolve` only called in standard mode paths (audit all `handleStop` branches)
- [ ] T017 [US3] On modal close (`isOpen` effect reset), clear `competitiveSession`, `showSelector`, and `mode` back to `'standard'` in `PracticeSessionModal.tsx` so reopening always starts in Standard mode

**Checkpoint**: All three user stories functional — Standard ↔ Competitive toggle clean, no stat contamination

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T018 [P] Verify no hardcoded `rgba()` or hex values in `ComparisonResult.css`, `CompetitionSelector.css`, or new rules in `PracticeSessionModal.css` — use `--color-*`, `--shadow-*`, `--radius-*` tokens from `cfop-app/src/index.css`
- [ ] T019 [P] Manual viewport test at 393px: mode toggle in header, competition selector list, competitive scramble block, comparison result — no overflow or truncation (SC-004)
- [ ] T020 Run production build and confirm no TypeScript errors or bundle warnings: `cd cfop-app && npm run build`
- [ ] T021 Manual feature test pass against quickstart.md checklist and all spec acceptance scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — blocks all user stories
- **US1 (Phase 3)**: Depends on Phase 2 — T004–T011 sequential within story
- **US2 (Phase 4)**: Depends on Phase 2 — T012/T013 can parallel each other, T014/T015 follow
- **US3 (Phase 5)**: Depends on Phase 3 (toggle wiring must exist)
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **US1**: Foundation (T002, T003) complete — no other story dependency
- **US2**: Foundation complete — T012/T013 can start in parallel with US1; T014/T015 depend on US1 modal wiring (T004)
- **US3**: US1 complete (toggle state must exist before verifying its clean-up paths)

### Parallel Opportunities Within US1

```
T004 (mode state + toggle UI)
  └── T005 (toggle-to-competitive logic)
        └── T006 (scramble serving)
              └── T007 (handleStop competitive branch)
                    └── T008 [P] (ComparisonResult component) + T009 (wire into modal)

T011 [P] (CSS — can start after T008/T009 components exist)
T010 [P] (fallback — can start after T005)
```

---

## Implementation Strategy

### MVP (User Story 1 only — Phases 1–3)

1. Complete Phase 1: copy data file
2. Complete Phase 2: types + data loader
3. Complete Phase 3: US1 full loop
4. **Validate**: mode toggle → 5 real scrambles → comparison result
5. Deploy/demo if ready

### Incremental Delivery

1. Phases 1–3 → US1 working → MVP
2. Phase 4 → competition selector → enhanced replay value
3. Phase 5 → clean mode switching → polish
4. Phase 6 → visual + build verification → ship
