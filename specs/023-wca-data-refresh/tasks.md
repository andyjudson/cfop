# Tasks: Feature 023 — wca-data-refresh

**Input**: `/specs/023-wca-data-refresh/`  
**Branch**: `023-wca-data-refresh`  
**Reference implementation**: `pyspark.sandbox/wca_parser.ipynb` — port function-by-function

---

## Phase 1: Setup

**Purpose**: Create the `scripts/wca-refresh/` package scaffold.

- [x] T001 Create `scripts/wca-refresh/wca_refresh/__init__.py` (empty) and directory structure matching plan.md
- [x] T002 Create `scripts/wca-refresh/pyproject.toml` — PEP 621 format; `name="wca-refresh"`, `dependencies = ["requests", "pandas", "typer", "rich"]`, `[project.scripts] wca-refresh = "wca_refresh.cli:app"`, Python `>=3.11`
- [x] T003 Create `scripts/wca-refresh/.gitignore` — add `.cache/` to prevent ~300MB TSV files from being committed
- [x] T004 Run `uv sync` in `scripts/wca-refresh/` to generate `scripts/wca-refresh/uv.lock`

---

## Phase 2: Foundational — Download & Cache

**Purpose**: Implement the download layer that all three transforms depend on.

**⚠️ CRITICAL**: No transform work can begin until this phase is complete — transforms read from the cache populated here.

- [x] T005 Implement `scripts/wca-refresh/wca_refresh/download.py` — `download_wca_export(dest_path: Path)`: streaming GET to `https://www.worldcubeassociation.org/export/results/v2/tsv`, read final `r.url` for filename, write to `dest_path/<filename>.tmp` then rename on completion, extract zip to `dest_path/`, read `dest_path/metadata.json`, delete zip
- [x] T006 Add `check_freshness(cache_dir: Path) -> tuple[bool, str | None]` to `download.py` — `requests.head(url, allow_redirects=False)`, parse timestamp via `re.search(r'_(\d{8}T\d{6}Z)\.tsv\.zip', location)`, compare to `metadata.json["export_date"]` if it exists; return `(True, remote_ts)` if fresh else `(False, remote_ts)`

**Checkpoint**: Cache layer complete — transforms can now read TSV files from `.cache/`

---

## Phase 3: User Story 1 — Core CLI Refresh (Priority: P1) 🎯 MVP

**Goal**: `uv run wca-refresh` downloads the WCA export (if stale) and regenerates all three NDJSON files in `cfop-app/public/data/` with no Spark dependency.

**Independent Test**: Run `uv run wca-refresh --no-download` with an existing cache; verify three output files are written with schemas matching `data-model.md`; confirm `wca-wr-evolution.json` contains `{"competition_id":"BeijingWinter2026",...,"time":3.84,"type":"Average WR"}`.

### Implementation for User Story 1

- [x] T007 [US1] Create `scripts/wca-refresh/wca_refresh/transforms.py` with shared helpers: `clean_name(name: str) -> str` (strip CJK parens via `re.sub(r'\s*\([^)]+\)', '', str(name)).strip()`), `load_wca_table(path, filter_expr=None) -> pd.DataFrame` (`pd.read_csv(path, sep='\t', low_memory=False)` + optional boolean filter), and four loaders: `load_raw_results()`, `load_raw_competitions()`, `load_raw_scrambles()`, `load_raw_championships()` — each reads the appropriate TSV from `CACHE_DIR`; also `parse_results(filter_condition: str)` (join results + competitions, select columns per data-model.md, convert `best/100.0` and `average/100.0` to seconds) and `parse_scrambles()` (filter `round_type_id=='f'` and `is_extra=='0'`)
- [x] T008 [US1] Add `compute_wr_progression(df: pd.DataFrame, record_type: str) -> pd.DataFrame` to `transforms.py` — sort by competition_date, group by date+person+competition, take min time; `cummin()` for running minimum; `shift(1)` to detect new WR; keep only rows where new WR set; add `type` column (`"Single WR"` or `"Average WR"`). Add `prepare_wr_evolution() -> pd.DataFrame` — call `parse_results(WR_FILTER)`, run for single+average, `pd.concat`, return with columns: `competition_date` (Unix ms), `competition_id`, `competition_name`, `person_id`, `person_name`, `person_country`, `time`, `type`
- [x] T009 [US1] Add `prepare_wr_legends(df_wr: pd.DataFrame | None = None) -> pd.DataFrame` to `transforms.py` — call `prepare_wr_evolution()` if None; sort by `competition_date` desc, take first row per type for `is_current_single`/`is_current_avg` person_id; groupby `person_id` for `single_wr_count`, `average_wr_count`, `best_single`, `best_average`, `last_wr_date`; apply `clean_name()` to `person_name`; sort by `total_wr_count` desc. Return with columns per `data-model.md`
- [x] T010 [US1] Add `prepare_beat_the_champion(year: int = 2015) -> pd.DataFrame` to `transforms.py` — (1) load all 4 source tables; (2) WR comp IDs: filter results for `WR_FILTER`, take distinct `competition_id`; (3) championship comp IDs: filter championships for world/continental types, join competitions for `year >= year`, take distinct `competition_id`; (4) union both ID sets; (5) finals results: filter results for `round_type_id=='f'` and `best > 0`, join qualifying IDs; (6) winner per comp: sort by `best` asc, groupby `competition_id` first row; (7) WR-at-time: for each comp, filter WR history where `wr_date <= comp_date`, groupby `competition_id` min — produces `wr_single_at_time` and `wr_average_at_time`; (8) scrambles: join qualifying IDs, build `scramble_groups` dict `{group_id: [scramble,...]}` keyed by competition; (9) filter winners to comps with scramble data; apply `clean_name()`; sort by `year` desc. Return with columns per `data-model.md`
- [x] T011 [US1] Create `scripts/wca-refresh/wca_refresh/export.py` — `diff_summary(output_path: Path, new_count: int) -> str`: read existing file line count if exists (else 0), return `f"+{new_count - old_count} new"` or `"no change"`; `_write_atomic(df: pd.DataFrame, output_path: Path)`: write to `output_path.with_suffix('.tmp')` via `df.to_json(orient='records', lines=True)` then `tmp.rename(output_path)`; `export_wr_evolution(dest_path: Path)`, `export_wr_legends(dest_path: Path)`, `export_beat_the_champion(dest_path: Path, year: int = 2015)` — each calls prepare_*(), gets diff_summary, calls _write_atomic, returns `(record_count, diff_str)`
- [x] T012 [US1] Create `scripts/wca-refresh/wca_refresh/cli.py` — Typer app with options: `--force/--no-force` (bool, default False), `--no-download` (bool, default False), `--dry-run` (bool, default False), `--year` (int, default 2015); validate `--force` and `--no-download` are mutually exclusive (raise `typer.BadParameter` if both set); set `CACHE_DIR = Path(__file__).parent.parent / '.cache'`; set `DATA_DIR` = `cfop-app/public/data/` relative to repo root (use `Path(__file__).parents[3] / 'cfop-app/public/data'`); orchestrate: (1) check freshness unless `--no-download`; (2) download if stale or `--force`; (3) print export date + cache status via Rich; (4) run all three exports (or skip writes if `--dry-run`); (5) print per-file counts + diff; (6) print "Done. Files written to cfop-app/public/data/" or "Dry run — no files written."

**Checkpoint**: `uv run wca-refresh --no-download` works end-to-end; output files match existing schema

---

## Phase 4: User Story 2 — /refresh-wca Skill (Priority: P2)

**Goal**: A Claude Code skill that interactively runs the CLI and offers to commit the updated files.

**Independent Test**: Run `/refresh-wca` and confirm it checks uv availability, executes the script, reports the diff summary, and offers a git commit with the correct message format.

### Implementation for User Story 2

- [x] T013 [US2] Create `cfop/.claude/commands/refresh-wca.md` — skill that: (1) checks `uv` is on PATH (suggest install if missing); (2) checks `scripts/wca-refresh/uv.lock` exists (suggest `cd scripts/wca-refresh && uv sync` if missing); (3) runs `cd scripts/wca-refresh && uv run wca-refresh [ARGS]` passing through any flags from `/refresh-wca` invocation (`--force`, `--no-download`); (4) captures and displays stdout diff summary; (5) offers to `git add cfop-app/public/data/ && git commit -m "chore(data): refresh WCA data (export YYYY-MM-DD)"` using export date from script output; usage examples: `/refresh-wca`, `/refresh-wca --force`, `/refresh-wca --no-download`

**Checkpoint**: `/refresh-wca` runs full flow and offers commit

---

## Phase 5: User Story 3 — GitHub Actions Monthly Schedule (Priority: P3)

**Goal**: Monthly automated refresh that commits updated files directly to `main` if any data changed.

**Independent Test**: Trigger via `workflow_dispatch`; job completes successfully; if WCA data was updated since last run, a commit appears on `main`; if not, job exits cleanly with no commit.

### Implementation for User Story 3

- [x] T014 [US3] Create `.github/workflows/refresh-wca.yml` — `on.schedule` cron `'0 6 1 * *'` + `workflow_dispatch`; `permissions: contents: write`; single job `refresh` on `ubuntu-latest`; steps: `actions/checkout@v4` → `astral-sh/setup-uv@v2` → `uv sync` (`working-directory: scripts/wca-refresh`) → `uv run wca-refresh` (`working-directory: scripts/wca-refresh`) → git config (`github-actions[bot]` identity) → `git add cfop-app/public/data/` → `if ! git diff --quiet --cached; then git commit -m "chore(data): refresh WCA data (export $(date +%Y-%m-%d))" && git push; fi`

**Checkpoint**: Workflow runs on schedule and on manual dispatch; commits if data changed

---

## Phase 6: Polish & Validation

- [x] T015 Run `uv run wca-refresh --no-download` (requires existing cache from a prior download) and verify all three output files in `cfop-app/public/data/` match schemas in `specs/023-wca-data-refresh/data-model.md`
- [ ] T016 Run full `uv run wca-refresh` (live download) and confirm `cfop-app/public/data/wca-wr-evolution.json` contains Xuanyi Geng's 3.84s average WR (`BeijingWinter2026`)
- [ ] T017 Commit refreshed JSON files: `git add cfop-app/public/data/ && git commit -m "chore(data): refresh WCA data (export YYYY-MM-DD)"`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — **blocks all user stories**
- **US1 (Phase 3)**: Depends on Foundational — T007 → T008 → T009 → T010 are sequential (same file); T011 can start after T007; T012 depends on T011
- **US2 (Phase 4)**: Depends on US1 (wraps the CLI)
- **US3 (Phase 5)**: Depends on US1 (CI runs the CLI)
- **Polish (Phase 6)**: Depends on US1 complete; T016 requires live network

### Within US1

```
T007 (transforms.py scaffold + helpers + parse_results)
  → T008 (add prepare_wr_evolution)
    → T009 (add prepare_wr_legends)
      → T010 (add prepare_beat_the_champion)
T007 → T011 (export.py, separate file — can start after T007 defines prepare_* signatures)
T011 + T010 → T012 (cli.py orchestrates everything)
```

### Parallel Opportunities

- T005 and T006 are sequential (same file, T006 extends T005)
- T011 (export.py) can proceed in parallel with T009/T010 once T007 establishes function signatures
- T013 (skill) and T014 (CI) can be written in parallel after T012 is complete

---

## Implementation Strategy

### MVP (US1 only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (download layer)
3. Complete Phase 3: US1 (full CLI)
4. **Validate**: `uv run wca-refresh --no-download` + schema check
5. Run live refresh, commit updated JSON files

### Full delivery

1. MVP → confirms data is correct
2. Add US2 (skill) — ~30 min
3. Add US3 (CI) — ~30 min
4. Polish phase

---

## Notes

- Notebook source at `pyspark.sandbox/wca_parser.ipynb` is the reference for transform correctness — port function-by-function, don't invent logic
- `--year` parameter in `prepare_beat_the_champion` gates **championship competitions only** — WR competitions are always all-time regardless of year value
- `DATA_DIR` path in `cli.py` must resolve correctly whether run from `scripts/wca-refresh/` or repo root — use `Path(__file__).parents[3]` to navigate up from the package to repo root
- Atomic write pattern: write to `.tmp`, rename on success — never write directly to the output path
- All NDJSON output uses `df.to_json(orient='records', lines=True)` — matches existing file format exactly
