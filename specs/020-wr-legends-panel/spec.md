# Feature 020 — WR Legends Panel

## Summary

Adds a WR Legends table to the About page's WCA section, alongside the existing WR Evolution chart. The table summarises which cubers have held the most world records, their best single and average times, and highlights current record holders. Complementary to the chart — the chart shows history over time, the table shows who made that history.

## Motivation

The WR Evolution chart already tells the story of how fast the world record has fallen. This feature puts names and faces to that story — Feliks Zemdegs (19 WRs), Yiheng Wang (10 WRs), Max Park (4 WRs) are the legends behind the numbers. A sortable table makes the data explorable and memorable.

## Layout

The WCA section uses a **side-by-side panel** layout on desktop:

- **Left panel (1/3 width)**: WR Legends table
- **Right panel (2/3 width)**: existing WR Evolution chart

On mobile, panels stack vertically — table first, chart below.

The user can **expand the chart** to full width, collapsing the table (toggle button). Default state: side-by-side.

## Data Source

Derived client-side from the existing `wca-wr-evolution.json` (69 records, already fetched by `WrEvolutionChart`). No new data file needed — aggregate per person on load:

- `name` — person_name
- `country` — person_country (for flag emoji)
- `wr_count` — total WRs (single + average combined)
- `single_count` — number of single WRs
- `avg_count` — number of average WRs
- `best_single` — lowest single time held as WR (seconds)
- `best_avg` — lowest average time held as WR (seconds)
- `last_wr_date` — most recent WR date (for tiebreak sort)
- `is_current_single` — holds the current single WR
- `is_current_avg` — holds the current average WR

Current record holders = the first entry per type in the NDJSON (already sorted descending by date).

## Table Columns

| Column | Content | Notes |
|---|---|---|
| Name | Person name | May include CJK characters in parens |
| Country | Flag emoji + country name | Flag derived from country string |
| WRs | Total WR count | Default sort column (desc) |
| Single | Best single time (s) | `—` if no single WR |
| Average | Best average time (s) | `—` if no average WR |

Current record holders (single or average) are marked with a small star icon or highlighted row — not a separate column.

## Functional Requirements

**FR-001 — Table renders WR Legends**
Table shows one row per person who has held a WR, derived from `wca-wr-evolution.json`. Default sort: total WRs descending, with last WR date descending as tiebreaker. This ensures current record holders with fewer total WRs (e.g. Teodor Zajder, 1 WR, current single) still appear near the top above historical one-WR holders from earlier eras.

**FR-002 — Current record indicator**
Rows where `is_current_single` or `is_current_avg` are true display a small star (★) or accent colour on the relevant time cell. Both cells may be highlighted for the same person.

**FR-003 — Sortable columns**
Clicking Name, WRs, Single, or Average column headers re-sorts the table. Clicking the active column header toggles asc/desc. Country is not sortable.

**FR-004 — Side-by-side layout**
On desktop (≥769px): table occupies ~1/3 width, chart ~2/3. On mobile: table stacks above chart, both full width.

**FR-005 — Expand/collapse toggle**
A small toggle button (e.g. "Expand chart" / "Show table") switches between side-by-side and chart-only views. Default: side-by-side.

**FR-006 — Data sharing with WrEvolutionChart**
The WR Legends table derives its data from the same fetch as the chart. The About page fetches once and passes data to both components — no duplicate fetch.

## Design Notes

- Flag emoji: use a simple country→flag mapping for the ~10 countries in the dataset (Australia, China, USA, Japan, Netherlands, Poland, France, Korea, Finland)
- Times render as seconds with 2 decimal places: `4.22` not `4.220`
- Missing single or average: render `—` (em dash)
- Table should be compact — small font, tight row height — since it sits in a 1/3 panel
- No pagination needed: 26 rows maximum
- The table and chart share the same section heading ("World Cube Association")

## PySpark Alignment

The existing `summarize_person_wr()` function in `wca_parser.ipynb` produces an equivalent aggregation in Spark. Its output schema should be aligned to match the client-side derivation:

- Rename to follow the `export_*` / `summarize_*` naming convention (already correct)
- Output columns should match: `person_name`, `person_country`, `single_wr_count`, `average_wr_count`, `best_single`, `best_average`
- Add `is_current_single` and `is_current_avg` boolean flags (derived from most recent WR date per type)
- This function does not need to export a file — it is a local analysis utility

## Out of Scope

- Photos or avatars of cubers
- Links to WCA profiles
- Filtering by country
- 3x3 average vs single breakdown beyond what's in the existing NDJSON
- Other WCA events (this dataset covers 3x3 only)

## Acceptance Criteria

- [ ] WR Legends table renders in the About page WCA section
- [ ] Table derives data from `wca-wr-evolution.json` without a second fetch
- [ ] Current WR holder cells are visually distinguished
- [ ] Table is sortable by Name, WRs, Single, Average
- [ ] Side-by-side layout on desktop, stacked on mobile
- [ ] Expand/collapse toggle works
- [ ] Times render as `4.22` format; missing values show `—`
- [ ] No visual regression on existing WR Evolution chart
