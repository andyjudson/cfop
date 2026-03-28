# Tasks: WCA World Record Evolution Chart

**Input**: Design documents from `/specs/012-wca-wr-chart/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓

**Organization**: Tasks grouped by user story. No automated tests (not in spec); all validation is manual browser testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story this task serves (US1, US2, US3)

---

## Phase 1: Setup

**Purpose**: Install the new dependency and create skeleton files

- [x] T001 Install `recharts` in `cfop-app/` — run `npm install recharts` and confirm addition to `cfop-app/package.json`
- [x] T002 [P] Create skeleton `cfop-app/src/components/WrEvolutionChart.tsx` (exported named function, no logic yet — just a placeholder `<div>` return)
- [x] T003 [P] Create skeleton `cfop-app/src/components/WrEvolutionChart.css` (empty file, import stub ready)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: TypeScript types, data parsing utilities, and colour resolution — required by all user stories

**⚠️ CRITICAL**: Phases 3–5 depend on this phase being complete

- [x] T004 Define `WrRawRecord` and `WrRecord` TypeScript interfaces and `LoadState` type in `cfop-app/src/components/WrEvolutionChart.tsx` — exact shapes in `data-model.md`
- [x] T005 Implement `parseNdjson(text: string): WrRawRecord[]` helper (split on `\n`, filter empty, `JSON.parse` each line, skip malformed) in `cfop-app/src/components/WrEvolutionChart.tsx`
- [x] T006 Implement `normaliseRecord(raw: WrRawRecord): WrRecord` helper (extract fields, pre-format date as `"MMM YYYY"`, resolve flag from `COUNTRY_FLAGS` map) in `cfop-app/src/components/WrEvolutionChart.tsx`
- [x] T007 [P] Define `COUNTRY_FLAGS` lookup map (all countries in the dataset: Japan, France, USA, Finland, Netherlands, Australia, Poland, Korea, China) in `cfop-app/src/components/WrEvolutionChart.tsx`
- [x] T008 Implement `resolveTokenColour(token: string): string` utility that calls `getComputedStyle(document.documentElement).getPropertyValue(token).trim()` — used to pass CSS custom property values as Recharts stroke props in `cfop-app/src/components/WrEvolutionChart.tsx`

**Checkpoint**: Types, parsers, and colour utilities complete — story implementation can begin

---

## Phase 3: User Story 1 — View WR Evolution Chart (Priority: P1) 🎯 MVP

**Goal**: Render two step-line series (Single WR + Average WR) with labelled axes and legend, loading from the NDJSON data file

**Independent Test**: Load About page in browser, scroll to "World Cube Association" section — both series are visible as step lines with year X-axis, seconds Y-axis, and a legend. Chart is legible at 393px viewport width.

### Implementation for User Story 1

- [x] T009 [US1] Implement `useEffect` data fetch in `cfop-app/src/components/WrEvolutionChart.tsx`: fetch from `import.meta.env.BASE_URL + 'data/wca-wr-evo.json'`, call `parseNdjson`, call `normaliseRecord` on each, split into `singleData` and `averageData` arrays, set `loadState` to `'ready'`
- [x] T010 [US1] Add loading and error state rendering in `cfop-app/src/components/WrEvolutionChart.tsx`: show `"Loading WR data…"` while `loadState === 'loading'`; show a brief error message if `loadState === 'error'`
- [x] T011 [US1] Assemble `<ResponsiveContainer>` + `<LineChart>` + `<CartesianGrid>` skeleton in `cfop-app/src/components/WrEvolutionChart.tsx` — two `<Line>` components with `data={singleData}` and `data={averageData}`, both `type="stepBefore"`, `dataKey="time"`, with distinct `stroke` colours from `resolveTokenColour`
- [x] T012 [US1] Configure `<XAxis>` in `cfop-app/src/components/WrEvolutionChart.tsx`: `dataKey="date"`, `type="number"`, `scale="time"`, `domain={['dataMin','dataMax']}`, `tickFormatter` returning `new Date(v).getFullYear().toString()`
- [x] T013 [US1] Configure `<YAxis>` in `cfop-app/src/components/WrEvolutionChart.tsx`: `tickFormatter` returning `v + 's'`, `domain={[0, 'dataMax + 1']}`, `allowDecimals={false}` (or 1 decimal — whichever looks cleanest)
- [x] T014 [US1] Add `<Legend>` to `<LineChart>` in `cfop-app/src/components/WrEvolutionChart.tsx`
- [x] T015 [US1] Add dot/activeDot sizing to both `<Line>` components in `cfop-app/src/components/WrEvolutionChart.tsx`: `dot={{ r: 3 }}`, `activeDot={{ r: 5 }}`
- [x] T016 [US1] Style `cfop-app/src/components/WrEvolutionChart.css`: chart section wrapper padding, `<ResponsiveContainer>` aspect ratio, CSS custom properties only (no hex/rgba), add responsive rule at `≤ 480px` reducing aspect ratio so chart doesn't become too tall on narrow screens
- [x] T017 [US1] Wire `<WrEvolutionChart />` into `cfop-app/src/pages/AboutPage.tsx`: single named import, single JSX tag inside the existing "World Cube Association" `<section>` after the current paragraph text — no chart config or Recharts imports in the page file

**Checkpoint**: US1 complete — both series render, chart legible on mobile, no hardcoded colours

---

## Phase 4: User Story 2 — Hover to Inspect Individual Records (Priority: P2)

**Goal**: Hover or tap any data point to reveal a tooltip with competitor name, country flag, competition ID, formatted date, and solve time

**Independent Test**: Hover over any node on either series — tooltip appears with all five fields. Move away — tooltip dismisses. On mobile, tap a point — tooltip shows.

### Implementation for User Story 2

- [x] T018 [US2] Implement `WrTooltipContent` as an inline React component (or named function) in `cfop-app/src/components/WrEvolutionChart.tsx` — accepts Recharts `TooltipContentProps`, renders a `<div>` with: series label, `flagEmoji + " " + personCountry`, `personName`, `competitionId`, `formattedDate`, `time + "s"`
- [x] T019 [US2] Wire `<Tooltip content={WrTooltipContent} />` into `<LineChart>` in `cfop-app/src/components/WrEvolutionChart.tsx` (replacing any default Recharts tooltip)
- [x] T020 [US2] Style the tooltip `<div>` in `cfop-app/src/components/WrEvolutionChart.css`: background `var(--color-bg-subtle)`, border `var(--color-border-light)`, text `var(--color-text-primary)` / `var(--color-text-secondary)`, `--shadow-sm`, rounded corners via `--radius-md` (or nearest token), compact padding

**Checkpoint**: US2 complete — tooltip shows all fields on hover and mobile tap

---

## Phase 5: User Story 3 — Data Refresh Without Code Change (Priority: P3)

**Goal**: Replacing `wca-wr-evo.json` with an updated file causes the chart to reflect the new data on next page load, with no code changes

**Independent Test**: Append a synthetic test record to `wca-wr-evo.json`, reload the About page, confirm the new point appears on the correct series, then revert the file.

### Implementation for User Story 3

- [x] T021 [US3] Verify data-refresh workflow manually: (1) copy `wca-wr-evo.json` to a backup, (2) append a synthetic future Single WR record as a new NDJSON line, (3) reload About page and confirm new point renders on the Single WR series, (4) restore original file — no code changes required at any step. Document pass/fail.

**Checkpoint**: US3 confirmed — file-swap data refresh works as designed

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality checks before merge

- [x] T022 [P] Audit `cfop-app/src/components/WrEvolutionChart.tsx` and `WrEvolutionChart.css` for hardcoded hex or rgba values — confirmed zero found
- [x] T023 Run production build: `cd cfop-app && npm run build` — confirmed no TypeScript errors, build clean, bundle size acceptable
- [x] T024 Manual feature test pass per CLAUDE.md pre-merge checklist: desktop + 393px mobile viewport, both series visible, tooltip works, no layout breakage

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — **blocks all user stories**
- **US1 (Phase 3)**: Depends on Phase 2 completion
- **US2 (Phase 4)**: Depends on Phase 3 completion (tooltip builds on rendered chart)
- **US3 (Phase 5)**: Depends on Phase 3 completion (needs chart rendering to verify data refresh)
- **Polish (Phase 6)**: Depends on Phases 3–5 complete

### Within User Story 1

T009 → T010 → T011 → T012 + T013 (parallel) → T014 → T015 → T016 → T017

### Parallel Opportunities

- T002 and T003 (Phase 1): Different files, run in parallel
- T007 and T008 (Phase 2): Independent utilities, run in parallel
- T012 and T013 (Phase 3): XAxis and YAxis configuration are independent
- T022 and T023 (Phase 6): Independent checks

---

## Implementation Strategy

### MVP (US1 only — Phases 1–3 + T022–T024)

1. Phase 1: Install Recharts, create skeletons
2. Phase 2: Types, parsers, utilities
3. Phase 3: Render chart with both series
4. Phase 6: Build check + manual test
5. **STOP and VALIDATE** — chart visible, both series, mobile legible

### Incremental Delivery

1. MVP above → chart renders (US1)
2. Add tooltip (US2) → interactive data exploration
3. Verify data refresh (US3) → maintenance workflow confirmed
4. Polish → ready to merge

---

## Notes

- No automated tests — all validation is manual browser testing per CLAUDE.md
- `AboutPage.tsx` must remain clean: one import, one `<WrEvolutionChart />` tag, nothing else from Recharts or chart config
- Recharts renders SVG (not canvas) — CSS custom properties work natively on SVG elements; `resolveTokenColour` is needed only because Recharts accepts colour as a JS string prop (not a CSS attribute)
- The `type="stepBefore"` setting on `<Line>` is semantically correct: the WR value holds from its date until the next record supersedes it
