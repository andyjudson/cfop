# Research — Feature 023: wca-data-refresh

## Decision 1: Package manager — uv over Poetry

**Decision:** uv  
**Rationale:** Faster installs, simpler CLI (`uv sync` / `uv run`), official `astral-sh/setup-uv@v2` GitHub Actions support, consistent with other repos in this project. No `poetry run` wrapper needed.  
**Alternatives considered:** Poetry (used in pyspark.sandbox — rejected for speed and cross-repo consistency)

---

## Decision 2: Staleness check — HTTP HEAD + Location header

**Decision:** `requests.head(url, allow_redirects=False)` → parse timestamp from `Location` header filename  
**Rationale:** WCA export URL returns a 301 redirect with the full filename in the `Location` header (e.g. `WCA_export_v2_129_20260509T000027Z.tsv.zip`). The timestamp is embedded directly — a single lightweight request gives a definitive freshness check without downloading anything. Verified: `curl -sI https://www.worldcubeassociation.org/export/results/v2/tsv` returns `location: https://assets.worldcubeassociation.org/export/results/WCA_export_v2_129_20260509T000027Z.tsv.zip`.  
**Implementation:** Extract the timestamp substring (e.g. `20260509T000027Z`) from the Location filename; compare to the `export_date` stored in `.cache/metadata.json` from the last download. Skip download if they match.  
**Alternatives considered:** Age-based TTL (imprecise — WCA updates at a fixed time, not a fixed interval); trust-always (no caching benefit)

---

## Decision 3: PySpark → pandas port strategy

**Decision:** Direct function-by-function port of the notebook's `prepare_*` functions.

Key mappings (verified against notebook source):

| PySpark pattern | Pandas equivalent |
|-----------------|-------------------|
| `cummin()` over ordered window | `df.sort_values('col')['col'].cummin()` |
| `lag(col).over(Window.orderBy(...))` | `df['col'].shift(1)` |
| `row_number().over(Window.partitionBy(...).orderBy(...))` | `df.sort_values(...).groupby(...).cumcount() + 1` |
| `f_min(col).over(Window.partitionBy(...))` | `df.groupby(...)['col'].transform('min')` |
| `unionByName` | `pd.concat([df1, df2])` |
| Cross-join WR-at-time pattern | Filtered merge on `comp_date >= wr_date`, then `groupby(...).min()` |

The beat_the_champion transform is the most complex: 4-table join, cross-join-style WR-at-time lookup, nested scramble groups dict. Port function-by-function from notebook; the notebook source is the reference for correctness.

**Alternatives considered:** Polars (faster but unfamiliar, additional dependency); DuckDB (SQL-native but overkill for a batch script)

---

## Decision 4: `--year` parameter scope and default

**Decision:** `--year` gates championship competitions only; WR competitions are always included regardless of year.

**Critical note on existing data:** The existing `wca-beat-the-champion.json` has 57 records spanning 2015–2026. The notebook defaults to `year=2015` to include championships from when WCA began capturing scrambles digitally. If the script defaults to the current year (2026), the output will contain only current-year championships plus all-time WR competitions — dropping ~40 historical championship records from the output file.

**Recommendation:** Default `--year` to **2015** to preserve the existing dataset scope. Use `--year <current>` only when intentionally narrowing to recent championships. The spec clarification ("default to current year") was based on the assumption that past data is complete and doesn't need regenerating — but because the script always rebuilds from source, "not regenerating" means "not including", not "reading from cache". This should be resolved before implementation.

**Alternatives considered:** Always-all-time (no year parameter) — rejected because the user explicitly wanted control; default current year — produces a valid but narrower dataset than what's currently deployed

---

## Decision 5: GitHub Actions — uv setup and commit-back

**Decision:**
- `astral-sh/setup-uv@v2` (official Astral action; no separate `setup-python` needed)
- `uv sync` to install dependencies
- Git config with bot identity (`github-actions[bot]`)
- `git diff --quiet --cached` guard before commit + push
- `permissions: contents: write` in workflow

**Workflow structure:**
```yaml
permissions:
  contents: write

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v2
      - run: uv sync
        working-directory: scripts/wca-refresh
      - run: uv run wca-refresh
        working-directory: scripts/wca-refresh
      - run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add cfop-app/public/data/
          if ! git diff --quiet --cached; then
            git commit -m "chore(data): refresh WCA data (export $(date +%Y-%m-%d))"
            git push
          fi
```

**Cache note:** GitHub Actions runners are ephemeral — `.cache/` does not persist between runs. Each CI run downloads the full ~300MB export fresh. This is acceptable for a monthly cadence.

**Alternatives considered:** `stefanzweifel/git-auto-commit-action` (third-party; rejected to keep workflow self-contained)

---

## Decision 6: Output format — NDJSON, matching existing files exactly

**Decision:** `df.to_json(orient="records", lines=True)` — one JSON object per line, no trailing newline.  
**Rationale:** cfop-app already parses this format; no consumer changes needed. Verified against existing files: all three use NDJSON with consistent field names.  
**Alternatives considered:** JSON array — rejected (would require cfop-app changes)
