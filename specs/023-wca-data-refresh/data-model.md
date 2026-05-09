# Data Model — Feature 023: wca-data-refresh

## Source Tables (from WCA TSV export)

| Table | File | Key columns used |
|-------|------|-----------------|
| Results | `WCA_export_results.tsv` | `event_id`, `person_id`, `person_name`, `person_country_id`, `competition_id`, `best`, `average`, `round_type_id`, `regional_single_record`, `regional_average_record` |
| Competitions | `WCA_export_competitions.tsv` | `id`, `name`, `country_id`, `city_name`, `year`, `month`, `day` |
| Scrambles | `WCA_export_scrambles.tsv` | `competition_id`, `event_id`, `round_type_id`, `group_id`, `scramble_num`, `scramble`, `is_extra` |
| Championships | `WCA_export_championships.tsv` | `competition_id`, `championship_type` |

All filtered to `event_id = '333'` (3x3x3) except Championships.

---

## Output Entities

### 1. `wca-wr-evolution.json`

One record per WR-setting event (single or average), in chronological order (newest first).

| Field | Type | Notes |
|-------|------|-------|
| `competition_date` | number | Unix timestamp (ms) |
| `competition_id` | string | WCA competition ID |
| `competition_name` | string | Human-readable name |
| `person_id` | string | WCA person ID |
| `person_name` | string | Raw name (may contain CJK parens) |
| `person_country` | string | Country of competitor |
| `time` | number | WR time in seconds |
| `type` | string | `"Single WR"` or `"Average WR"` |

One row per WR (cumulative minimum — rows where a new WR was set).

---

### 2. `wca-wr-legends.json`

One record per person who has ever held a 3x3x3 WR, sorted by `total_wr_count` descending.

| Field | Type | Notes |
|-------|------|-------|
| `person_name` | string | CJK parens stripped |
| `person_country` | string | Country |
| `last_wr_date` | number | Unix timestamp (ms) of most recent WR |
| `single_wr_count` | number | Count of single WRs held |
| `average_wr_count` | number | Count of average WRs held |
| `total_wr_count` | number | `single_wr_count + average_wr_count` |
| `best_single` | number \| null | Best single time in seconds |
| `best_average` | number \| null | Best average time in seconds |
| `is_current_single` | boolean | True if current single WR holder |
| `is_current_avg` | boolean | True if current average WR holder |

---

### 3. `wca-beat-the-champion.json`

One record per qualifying competition (WR event or championship final), sorted by `competition_date` descending.

| Field | Type | Notes |
|-------|------|-------|
| `competition_date` | number | Unix timestamp (ms) |
| `competition_id` | string | WCA competition ID |
| `competition_name` | string | Human-readable name |
| `year` | number | Competition year |
| `month` | number | Competition month |
| `day` | number | Competition start day |
| `country` | string | Host country |
| `winner_name` | string | Finals winner (CJK parens stripped) |
| `winner_single` | number | Winner's best single in seconds |
| `winner_average` | number \| null | Winner's average in seconds (null if DNF/DNS) |
| `wr_single_at_time` | number \| null | WR single at time of competition |
| `wr_average_at_time` | number \| null | WR average at time of competition |
| `scramble_groups` | object | `{ group_id: [scramble, ...] }` — all final-round scramble groups |

**Qualifying competitions:** Union of (a) any competition where a 3x3x3 WR was set, and (b) world/continental championships from `--year` onwards where scramble data is available.

---

## Cache Entities

Stored in `scripts/wca-refresh/.cache/` (gitignored).

| File | Description |
|------|-------------|
| `metadata.json` | WCA export metadata including `export_date` |
| `WCA_export_results.tsv` | Full results table |
| `WCA_export_competitions.tsv` | All competitions |
| `WCA_export_scrambles.tsv` | All scrambles |
| `WCA_export_championships.tsv` | Championship designations |

The cache is populated by `download_wca_export()`. Staleness: compare timestamp in WCA redirect `Location` header to `metadata.json` export date — skip download if they match.
