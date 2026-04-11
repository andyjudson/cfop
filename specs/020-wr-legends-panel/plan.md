# Implementation Plan: WR Legends Panel

**Branch**: `022-wr-legends-panel` | **Date**: 2026-04-05 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/022-wr-legends-panel/spec.md`

## Summary

Add a WR Legends table to the About page's WCA section alongside the existing WR Evolution chart. The table is derived client-side from the same `wca-wr-evolution.json` data (no second fetch), showing one row per WR holder with name, country flag, total WR count, best single, and best average. Current record holders are highlighted. Columns are sortable. Layout is side-by-side (1/3 table, 2/3 chart) on desktop, stacked on mobile, with an expand/collapse toggle.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19
**Primary Dependencies**: Bulma CSS 1.x, react-icons 5.x (for star icon and sort indicators)
**Storage**: N/A — data derived in-memory from existing NDJSON fetch
**Testing**: @playwright/test (smoke tests in cfop-app/e2e/)
**Target Platform**: Web (GitHub Pages), iPhone 16 baseline for mobile
**Project Type**: Web application — React SPA
**Performance Goals**: No additional network requests; derivation from 69 records is trivial
**Constraints**: No hardcoded colours — CSS tokens only; no duplicate fetch of wca-wr-evolution.json
**Scale/Scope**: 26 rows maximum, single page section

## Constitution Check

| Gate | Status | Notes |
|------|--------|-------|
| Educational focus | ✅ PASS | WCA context and legends support learning motivation |
| Minimal dependencies | ✅ PASS | No new dependencies; react-icons already in use |
| CSS tokens only | ✅ PASS | Will use `--color-*` tokens throughout |
| No hardcoded fetch path | ✅ PASS | Will use `import.meta.env.BASE_URL` pattern |
| Mobile baseline (iPhone 16) | ✅ PASS | Stacked layout on mobile specified |
| Single data source | ✅ PASS | Lift fetch to AboutPage, pass raw records to both components |

No violations.

## Project Structure

### Documentation (this feature)

```text
specs/022-wr-legends-panel/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code

```text
cfop-app/src/
├── components/
│   ├── WrLegendsTable.tsx       # NEW — sortable WR legends table
│   ├── WrLegendsTable.css       # NEW — table + panel layout styles
│   └── WrEvolutionChart.tsx     # MODIFIED — accept raw records as prop (lift fetch out)
└── pages/
    └── AboutPage.tsx            # MODIFIED — fetch once, pass to both components; side-by-side layout
```

## Complexity Tracking

No constitution violations — no complexity justification required.

---

## Phase 0: Research

### Data derivation from wca-wr-evolution.json

The NDJSON has 69 records sorted descending by `competition_date`. Current record holders are simply the first occurrence of each `type` in the file.

**Person aggregation algorithm** (client-side, computed once on load):

```ts
interface WrLegend {
  personName: string;       // CJK parens stripped (reuse normaliseRecord pattern)
  personCountry: string;
  flagEmoji: string;
  totalWrs: number;         // single + average count
  singleCount: number;
  avgCount: number;
  bestSingle: number | null;
  bestAvg: number | null;
  lastWrDate: number;       // for tiebreak sort
  isCurrentSingle: boolean;
  isCurrentAvg: boolean;
}
```

**Derivation steps**:
1. Parse NDJSON (already done in `WrEvolutionChart` — lift to `AboutPage`)
2. First record where `type === 'Single WR'` → `isCurrentSingle = true` for that person
3. First record where `type === 'Average WR'` → `isCurrentAvg = true` for that person
4. Group remaining records by `person_id`, accumulate counts and track best times
5. Default sort: `totalWrs` desc, then `lastWrDate` desc as tiebreaker

**Decision**: Derive in `AboutPage` via `useMemo`, pass `WrRawRecord[]` down to both `WrLegendsTable` and `WrEvolutionChart`. `WrRawRecord` type moves to a shared location (or re-exported from `WrEvolutionChart`).

### Layout approach

Current `AboutPage` WCA section is a plain `<section>`. The side-by-side panel needs a flex/columns wrapper. Bulma's `.columns` is already available — use `.column.is-one-third` / `.column.is-two-thirds`.

Expand/collapse: simple `useState<boolean>` for `chartExpanded`. When true, hide the table column and set chart column to full width.

### Sort state

```ts
type SortKey = 'name' | 'totalWrs' | 'bestSingle' | 'bestAvg';
type SortDir = 'asc' | 'desc';
const [sortKey, setSortKey] = useState<SortKey>('totalWrs');
const [sortDir, setSortDir] = useState<SortDir>('desc');
```

Null values (no single or no average) always sort to the bottom regardless of direction.

### Current record highlight

Star icon (★ or `MdStar` from react-icons) on the relevant time cell, coloured with `--color-accent-warm`. Not a separate column — inline in the Single/Average cell.

### WrEvolutionChart refactor

`WrEvolutionChart` currently owns its own fetch. To avoid a duplicate fetch, it needs to accept `records: WrRawRecord[]` as a prop instead. The internal `useEffect` fetch is removed; `singleData` and `averageData` are derived from props via `useMemo`.

**No behavioural change** to the chart — purely a prop lift.

---

## Phase 1: Data Model

See [data-model.md](data-model.md).

---

## Phase 1: Agent Context Update

Run after design is finalised:
```bash
.specify/scripts/bash/update-agent-context.sh claude
```
