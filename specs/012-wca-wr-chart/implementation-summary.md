# Implementation Summary: WCA World Record Evolution Chart

**Feature**: 012-wca-wr-chart
**Completed**: 2026-03-28
**Branch**: `012-wca-wr-chart` → merged to `main`

## What Was Built

Interactive step-line chart embedded in the "World Cube Association" section of the About page, showing how 3×3 Single and Average world record times evolved from 2004 to the present. Data loads at runtime from a static NDJSON file — replacing the file updates the chart with no code changes.

## Files Changed

| File | Change |
|------|--------|
| `cfop-app/src/components/WrEvolutionChart.tsx` | New — self-contained chart component |
| `cfop-app/src/components/WrEvolutionChart.css` | New — chart styles (tokens only) |
| `cfop-app/src/pages/AboutPage.tsx` | Modified — single import + `<WrEvolutionChart />` tag |
| `cfop-app/src/index.css` | Modified — added `--color-accent-warm: #e05c28` token |
| `cfop-app/package.json` | Modified — added `recharts@3.8.1` |

## Key Technical Decisions

- **Recharts v3** over Chart.js/uPlot: native `type="stepAfter"` line, JSX tooltip, React-native API, ~40 kB gzip
- **Unified `data` on `<LineChart>`** with separate `dataKey` per `<Line>` — required in Recharts v3 (per-Line `data` prop doesn't render)
- **`TooltipContentProps`** (not `TooltipProps`) for custom tooltip — `payload`/`active` are `PropertiesReadFromContext` in v3
- **Explicit `xTicks`** at 2-year boundaries via `Date.UTC` — prevents duplicate year labels from auto tick placement
- **Explicit `yMax`** computed across both series — `'dataMax + 1'` in Recharts v3 only scans the first `dataKey`
- **Vite SPA fallback guard**: missing data file returns `index.html` with 200, detected via `text.trimStart().startsWith('<')`

## Bugs Encountered and Fixed

1. Empty chart — per-`<Line>` `data` prop not rendered in Recharts v3 → unified to `<LineChart data={chartData}>`
2. Missing data file masked as empty parse → added HTML response guard
3. Duplicate X-axis year labels → explicit tick array
4. Y-axis max showing ~7.53s (Single WR only) instead of ~17s → explicit `yMax` across both series
5. `TooltipProps` type error (no `payload`/`active`) → switched to `TooltipContentProps`

## Tooltip Fields

Series label · solve time · competitor name + country flag emoji · formatted date (Mon YYYY)
(Competition ID removed from tooltip for cleaner display)
