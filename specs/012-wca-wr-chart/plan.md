# Implementation Plan: WCA World Record Evolution Chart

**Branch**: `012-wca-wr-chart` | **Date**: 2026-03-28 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/012-wca-wr-chart/spec.md`

## Summary

Add an interactive step-line chart to the existing "World Cube Association" section at the bottom of the About page, visualising how 3×3 Single and Average world record times have evolved from 2004 to the present. The chart reads from a static NDJSON data file (`public/data/wca-wr-evo.json`) that can be updated by file replacement with no code changes. Built with Recharts (tree-shaken, ~40 kB gzip) using the existing app colour token system. Hover/tap tooltips reveal competitor, country, competition, date, and time.

## Technical Context

**Language/Version**: TypeScript 5.9 / React 19 / Vite 7
**Primary Dependencies**: Recharts (new, ~38–42 kB gzip tree-shaken); existing: Bulma CSS 1.x, react-router-dom 7.x, react-icons 5.x
**Storage**: N/A — data read from static file at runtime
**Testing**: Manual browser test (no automated test framework currently in cfop-app)
**Target Platform**: Web (GitHub Pages, static hosting); primary mobile baseline iPhone 16 (~393px CSS width)
**Project Type**: Web application (SPA — React + Vite, HashRouter)
**Performance Goals**: Chart renders within 500ms of page scroll-into-view; no perceptible page load delay
**Constraints**: Library ≤ 50 kB gzip; no hardcoded hex/rgba colours (CSS tokens only); no code change required for data refresh
**Scale/Scope**: Single component on one page; ~70 data points across two series

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| Educational focus | PASS | Historical context and WR data enrich the educational narrative on the About page |
| Minimal dependencies | PASS | One new library (Recharts), tree-shaken to ~40 kB; well below the constitutional preference for lightweight deps |
| Web-first / React ecosystem | PASS | Recharts is React-native; fits existing stack exactly |
| No monetization / social | PASS | Read-only visualisation; no user accounts or external data submission |
| Offline-capable | PASS | Data file is a static asset bundled with the app — available offline once loaded |
| Consistent visual design | PASS | CSS custom property tokens used throughout; no inline hex |
| Mobile compatibility | PASS | `<ResponsiveContainer>` handles 393px viewport |

**Post-design re-check**: All gates still pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/012-wca-wr-chart/
├── plan.md                    # This file
├── research.md                # Phase 0 output — library & data decisions
├── data-model.md              # Phase 1 output — types, data flow, axis config
├── checklists/
│   └── requirements.md        # Spec quality checklist (all pass)
└── tasks.md                   # Phase 2 output (/speckit.tasks — not yet created)
```

### Source Code (repository root)

```text
cfop-app/
├── public/
│   └── data/
│       └── wca-wr-evo.json              # existing — updated by data pipeline copy
├── src/
│   ├── components/
│   │   ├── WrEvolutionChart.tsx         # new — chart component
│   │   └── WrEvolutionChart.css         # new — chart-specific styles
│   └── pages/
│       └── AboutPage.tsx                # modified — add WrEvolutionChart to WCA section
└── package.json                         # modified — add recharts dependency
```

**Structure Decision**: Single-project web app (Option 1 variant). The new component follows the existing co-located TSX + CSS pattern established by `AlgorithmCard`, `DemoModal`, etc. No new directories beyond the component files.

## Implementation Phases

### Phase 1 — Component scaffolding & data loading

1. Install Recharts: `npm install recharts` (in `cfop-app/`)
2. Create `WrEvolutionChart.tsx`:
   - Define `WrRawRecord` and `WrRecord` TypeScript interfaces (see data-model.md)
   - `useEffect` on mount: fetch NDJSON, parse, split by type, normalise to `WrRecord[]`
   - Handle `loading` / `error` / `ready` states with appropriate UI feedback
   - Render a loading skeleton or "Loading WR data…" text while fetching
3. Create `WrEvolutionChart.css`:
   - Container sizing, tooltip styling using CSS custom properties only
   - Responsive adjustments for ≤ 480px (reduced font size, reduced chart aspect ratio)

### Phase 2 — Chart rendering

4. Assemble Recharts component tree:
   ```
   <ResponsiveContainer width="100%" aspect={2.2}>
     <LineChart margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
       <CartesianGrid strokeDasharray="3 3" />
       <XAxis dataKey="date" type="number" scale="time" domain={['dataMin','dataMax']} tickFormatter={yearFormatter} />
       <YAxis tickFormatter={timeFormatter} domain={[0, 'dataMax + 1']} />
       <Tooltip content={<WrTooltip />} />
       <Legend />
       <Line data={singleData} type="stepBefore" dataKey="time" name="Single WR" dot={{ r: 4 }} activeDot={{ r: 6 }} />
       <Line data={averageData} type="stepBefore" dataKey="time" name="Average WR" dot={{ r: 4 }} activeDot={{ r: 6 }} />
     </LineChart>
   </ResponsiveContainer>
   ```
5. Resolve CSS colour tokens at component initialisation using `getComputedStyle(document.documentElement)`:
   - Single WR stroke: `--color-accent-primary`
   - Average WR stroke: `--color-accent-dark`
   - Grid stroke: `--color-border-light`
6. Implement `WrTooltip` custom JSX component (renders competitor, country flag, competition, date, time)

### Phase 3 — About page integration

7. Import `WrEvolutionChart` into `AboutPage.tsx`
8. Render `<WrEvolutionChart />` as a single self-contained tag inside the existing "World Cube Association" `<section>`, after the current paragraph text — **no implementation details in the page**; the page only sees the component boundary
9. `AboutPage.tsx` must not contain any chart config, data logic, or Recharts imports — everything stays inside `WrEvolutionChart.tsx`

### Phase 4 — Polish & validation

10. Verify colour token application (no hardcoded colours in TSX or CSS)
11. Test on 393px viewport — confirm chart is legible, no label overlap, tooltip usable on touch
12. Test data-refresh workflow: replace JSON, reload, confirm chart updates
13. Run production build: `npm run build` — confirm bundle, no type errors
14. Manual feature test pass per CLAUDE.md pre-merge checklist

## Key Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Charting library | Recharts (tree-shaken) | Native step-line, JSX tooltip, React-native API, ~40 kB gzip |
| Chart type | `type="stepBefore"` Line | Record holds from its date until next record — "before" is semantically correct |
| Data format | NDJSON parsed at runtime | Preserves pipeline output format; supports file-swap data refresh |
| Colour resolution | CSS custom property read via `getComputedStyle` | Maintains token system despite Recharts needing prop-based colours |
| Tooltip | Custom `content` JSX component | Full control over multi-field layout without DOM positioning code |
| Placement | Existing WCA section, below current text | Contextually cohesive; no new section required |

## Contracts

N/A — this is a self-contained frontend component. The only "contract" is the data file schema, documented in `data-model.md`.
