# Research: WCA WR Chart — Phase 0

**Feature**: 012-wca-wr-chart
**Date**: 2026-03-28

## Decision 1: Charting Library

**Decision**: Recharts (with selective tree-shaken imports)

**Rationale**:
- Native `type="stepBefore"` on `<Line>` — semantically correct: record holds until the next data point. Zero workaround.
- Custom tooltip via `content` prop on `<Tooltip>` accepts a React component — cleanest path to rendering competitor name, country, competition, date, and time as JSX, with no string concatenation or DOM positioning code.
- React-native API (JSX component tree): no `useEffect`/`useRef` lifecycle wiring, no `Chart.register()` discipline. Consistent with cfop-app component style.
- Bundle: importing only `LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `Legend`, `ResponsiveContainer` lands at ~38–42 kB gzip — clears the 50 kB spec constraint.
- `<ResponsiveContainer width="100%" aspect={2.5}>` handles all viewports including iPhone 16 (393px) out of the box.

**Alternatives considered**:

| Library | Size (gzip) | Step-line | Tooltip | Decision |
|---------|-------------|-----------|---------|----------|
| Chart.js 4 + react-chartjs-2 | ~45–65 kB (tree-shaking required) | Native (`stepped: true`) | Callback strings or DIY DOM | Rejected: bundle risk; less ergonomic tooltip API vs Recharts JSX |
| uPlot | ~15 kB | Native | DIY DOM (~25 lines) | Rejected: imperative lifecycle, DIY tooltip adds maintenance friction without sufficient bundle saving to justify |
| Lightweight Charts (TradingView) | ~45–52 kB | No native step mode — workaround required | DIY DOM | Rejected: no native step-line is a disqualifying mismatch |
| Visx (@visx/shape) | ~20–28 kB | Native (curveStepBefore) | Hook-based JSX | Valid alternative, but higher implementation effort (manual scales/axes/paths) for similar outcome |

---

## Decision 2: Data Parsing

**Decision**: Parse the data file as NDJSON (newline-delimited JSON) at runtime via `fetch`.

**Rationale**: The file `cfop-app/public/data/wca-wr-evo.json` is one JSON object per line, not a JSON array. It must be split on newlines, filtered for non-empty lines, and each line parsed with `JSON.parse()`. This is a ~5-line parsing step, appropriate in the component's `useEffect` data-loading logic.

**Alternatives considered**: Converting the file to a JSON array — rejected because it requires modifying the PySpark pipeline output format. Keeping NDJSON means the file can be updated by copying directly.

---

## Decision 3: Placement in About Page

**Decision**: Add the chart inside the existing "World Cube Association" section at the bottom of `AboutPage.tsx`.

**Rationale**: The section already exists with relevant intro text about WCA and WR times. Adding the chart there avoids introducing a new section and is contextually cohesive. Minimal About page restructuring required.

---

## Decision 4: Colour Token Resolution for Canvas

**Decision**: Not applicable — Recharts renders as SVG, not canvas.

**Rationale**: Unlike Chart.js (canvas-based), Recharts generates SVG elements. CSS custom properties resolve correctly on SVG elements in modern browsers. The app's colour tokens (`--color-accent-primary`, `--color-accent-dark`, etc.) can be read at runtime using `getComputedStyle(document.documentElement).getPropertyValue(...)` and passed as `stroke` props, maintaining full alignment with the design token system.

**Colours assigned**:
- Single WR series: `--color-accent-primary` (#2563eb)
- Average WR series: `--color-accent-dark` (#3b4f87)
- Grid lines: `--color-border-light`
- Tooltip background: `--color-bg-base` / `--color-bg-subtle`
- Tooltip text: `--color-text-primary` / `--color-text-secondary`

---

## Decision 5: X-Axis Formatting

**Decision**: Use `tickFormatter` on `<XAxis>` to display year labels (e.g., "2004", "2010", "2016"). The x-axis data is Unix millisecond timestamps from `competition_date`. Pass as numeric values; format with `new Date(val).getFullYear()`.

**Rationale**: Recharts `<XAxis type="number" scale="time" domain={['dataMin', 'dataMax']}/>` handles numeric timestamp axes cleanly. Year-only tick labels avoid crowding on narrow viewports.

---

## Decision 6: Y-Axis Formatting

**Decision**: Format Y-axis tick labels as seconds to one decimal place (e.g., "5.0s", "10.0s"). Invert the axis is NOT needed — lower times appear at the bottom, which is conventional for time-improvement charts (time decreasing = progress = moving downward on the chart is fine; the trend goes down-right which visually reads as "getting faster").

**Rationale**: Standard sports/performance chart convention. The downward trend is positive and immediately legible.

---

## Decision 7: Tooltip Content

**Decision**: Custom JSX tooltip component. Show:
- Series label (Single WR / Average WR)
- Solve time formatted as `Xs.XXs` (e.g., `3.47s`)
- Competitor name and country flag emoji derived from country code mapping
- Competition ID (human-readable enough for cubing enthusiasts)
- Date formatted as `MMM YYYY` (e.g., `Nov 2018`)

**Note on country flags**: ISO 3166-1 alpha-2 country codes can be converted to flag emoji using regional indicator symbols: `String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65))`. The data `person_country` field contains country names (e.g., "China", "USA") not codes, so a small lookup map (~15 entries covering all WR holders) is sufficient.

---

## Summary of NEEDS CLARIFICATION resolutions

All spec requirements were clear. No clarifications needed during research phase. All decisions above are implementation choices resolved by research.
