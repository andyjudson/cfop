# Tasks: WR Legends Panel (Feature 022)

**Input**: Design documents from `/specs/022-wr-legends-panel/`
**Branch**: `022-wr-legends-panel`

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)

---

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Lift the data fetch out of `WrEvolutionChart` into `AboutPage` so both the chart and the new table share a single data source. Must be complete before any user story work.

- [x] T001 Export `WrRawRecord` interface from `cfop-app/src/components/WrEvolutionChart.tsx` (add `export` keyword)
- [x] T002 Refactor `WrEvolutionChart` to accept `records: WrRawRecord[]` as a prop instead of fetching internally — remove the `useEffect` fetch, derive `singleData`/`averageData` from props via `useMemo` in `cfop-app/src/components/WrEvolutionChart.tsx`
- [x] T003 Update `AboutPage` to fetch `wca-wr-evolution.json` once, parse NDJSON, and pass `records` to `<WrEvolutionChart records={records} />` in `cfop-app/src/pages/AboutPage.tsx`
- [ ] T004 Verify the existing WR Evolution chart still renders correctly after the refactor (dev server smoke check)

**Checkpoint**: WrEvolutionChart renders identically via props. AboutPage owns the single fetch.

---

## Phase 2: User Story 1 — WR Legends Table (P1) 🎯 MVP

**Spec ref**: US-001 (see case probability), FR-001, FR-002, FR-003

**Goal**: Render a read-only WR Legends table in the About page WCA section showing all WR holders with name, country flag, WR count, best single, and best average.

**Independent Test**: Open About page → WCA section shows a table with Feliks Zemdegs at the top (19 WRs), correct flag and times. Teodor Zajder appears near the top (current single WR holder despite only 1 WR). All 26 rows present.

- [x] T005 [P] Define `WrLegend` interface and `deriveWrLegends(records: WrRawRecord[]): WrLegend[]` utility function in `cfop-app/src/components/WrLegendsTable.tsx` — implement aggregation per data-model.md (strip CJK parens, track counts, best times, lastWrDate, isCurrentSingle/Avg)
- [x] T006 [P] Create `cfop-app/src/components/WrLegendsTable.css` with table styles — compact rows, small font (`--font-size-sm`), use `--color-*` tokens throughout, star highlight colour using `--color-accent-warm`
- [x] T007 [US1] Implement `WrLegendsTable` component in `cfop-app/src/components/WrLegendsTable.tsx` — render table with columns: Name, Country (flag + name), WRs, Single, Average; current WR cells show ★ icon; times formatted to 2dp; missing values show `—`
- [x] T008 [US1] Add `WrLegend` derivation to `AboutPage` via `useMemo` from the shared `records` array, pass to `<WrLegendsTable legends={legends} />` in `cfop-app/src/pages/AboutPage.tsx`
- [x] T009 [US1] Add `<WrLegendsTable />` to the WCA section in `cfop-app/src/pages/AboutPage.tsx` — render below the intro paragraph, above the chart (layout phase comes in US3)

**Checkpoint**: Table visible in About page, correct data, Feliks on top, Teodor near top, star on current record cells.

---

## Phase 3: User Story 2 — Sortable Columns (P2)

**Spec ref**: FR-003

**Goal**: Clicking Name, WRs, Single, or Average column headers re-sorts the table. Active column shows sort direction indicator. Null values always sort to bottom.

**Independent Test**: Click "Single" header → sorts ascending by best single time, null entries (no single WR) at bottom. Click again → descending. Click "Name" → alphabetical. Default sort (WRs desc + lastWrDate desc tiebreak) restored on page reload.

- [x] T010 [US2] Add sort state (`sortKey`, `sortDir`) to `WrLegendsTable` component and implement `sortedLegends` memo with null-to-bottom logic in `cfop-app/src/components/WrLegendsTable.tsx`
- [x] T011 [US2] Add sortable header click handlers and sort direction indicator (▲/▼ or react-icon) to column headers in `cfop-app/src/components/WrLegendsTable.tsx`
- [x] T012 [US2] Style active sort column header with `--color-accent-primary` or bold weight in `cfop-app/src/components/WrLegendsTable.css`

**Checkpoint**: All four sortable columns work, null times sort to bottom, active column visually indicated.

---

## Phase 4: User Story 3 — Side-by-Side Layout + Mobile Stacking (P2)

**Spec ref**: FR-004, FR-005

**Goal**: On desktop, table sits in a 1/3 column and chart in a 2/3 column. On mobile they stack (table above chart). An expand/collapse toggle switches between side-by-side and chart-only.

**Independent Test**: Desktop: table and chart are side by side. Mobile (devtools 393px): table stacks above chart, both full width. Toggle button collapses table and expands chart to full width; clicking again restores side-by-side.

- [x] T013 [US3] Add `chartExpanded` state to `AboutPage` and wrap the WCA section content in a Bulma `.columns` layout — table in `.column.is-one-third` (hidden when expanded), chart in `.column.is-two-thirds` (full width when expanded) in `cfop-app/src/pages/AboutPage.tsx`
- [x] T014 [US3] Add expand/collapse toggle button ("Expand chart" / "Show table") with appropriate icon from react-icons, positioned above or beside the chart column in `cfop-app/src/pages/AboutPage.tsx`
- [x] T015 [US3] Add responsive CSS: on mobile (< 769px) columns stack, table full width above chart full width in `cfop-app/src/pages/AboutPage.tsx` or a scoped CSS module/class

**Checkpoint**: Layout correct on desktop and mobile. Toggle works. Chart renders at full width when expanded.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T016 [P] Add `ErrorBoundary` wrapper around `<WrLegendsTable />` in `cfop-app/src/pages/AboutPage.tsx` (consistent with existing `<WrEvolutionChart />` wrapping)
- [ ] T017 [P] Verify dark mode — all table colours use CSS tokens, no regressions in `cfop-app/src/components/WrLegendsTable.css`
- [ ] T018 [P] Verify no visual regression on existing WR Evolution chart after the fetch-lift refactor (dev server, check both light and dark mode)
- [x] T019 Run production build and confirm no TypeScript errors: `cd cfop-app && npm run build`

---

## Dependencies & Execution Order

- **Phase 1 (Foundational)**: Start immediately — T001 → T002 → T003 → T004 in sequence
- **Phase 2 (US1)**: Depends on Phase 1 complete. T005 and T006 are parallel, then T007 → T008 → T009
- **Phase 3 (US2)**: Depends on Phase 2 complete (needs the table component to exist)
- **Phase 4 (US3)**: Depends on Phase 2 complete (needs table and chart both in AboutPage)
  - Phase 3 and Phase 4 can proceed in parallel once Phase 2 is done
- **Phase 5 (Polish)**: After Phase 3 and 4 complete

---

## Implementation Strategy

### MVP (Phase 1 + Phase 2 only)

1. Complete Phase 1: Lift fetch
2. Complete Phase 2: Render read-only table
3. **Validate**: Table visible, data correct, chart unaffected
4. Ship if sufficient

### Full feature

Continue with Phase 3 (sort), Phase 4 (layout), Phase 5 (polish) in order.
