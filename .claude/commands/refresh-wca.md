---
description: Download the WCA public export (if stale) and regenerate the three NDJSON data files in cfop-app/public/data/.
---

# /refresh-wca — Refresh WCA data

Downloads the WCA public export (if stale) and regenerates the three NDJSON files in `cfop-app/public/data/`.

## Usage

```
/refresh-wca
/refresh-wca --force
/refresh-wca --no-download
/refresh-wca --dry-run
/refresh-wca --year 2020
```

Any flags passed to `/refresh-wca` are forwarded to the CLI.

## Steps

1. **Check uv is available**

   ```bash
   which uv
   ```

   If not found, instruct the user to install it: `curl -LsSf https://astral.sh/uv/install.sh | sh`

2. **Check uv.lock exists**

   ```bash
   ls scripts/wca-refresh/uv.lock
   ```

   If missing, run:
   ```bash
   cd scripts/wca-refresh && uv sync
   ```

3. **Run the CLI**

   ```bash
   cd scripts/wca-refresh && uv run wca-refresh $ARGS
   ```

   Where `$ARGS` are any flags from the `/refresh-wca` invocation (e.g. `--force`, `--no-download`, `--dry-run`, `--year 2020`).

4. **Display output** — capture and show stdout from the CLI, including the export date and per-file diff summary.

5. **Offer to commit** — if files were written (not a dry run), offer:

   ```bash
   git add cfop-app/public/data/
   git commit -m "chore(data): refresh WCA data (export YYYY-MM-DD)"
   ```

   Use the export date printed by the CLI (e.g. `2026-05-09`) in the commit message.

## Notes

- The CLI handles freshness checks automatically — no manual staleness logic needed here
- `--force` and `--no-download` are mutually exclusive; the CLI will reject both together
- The `.cache/` directory (~300MB) is gitignored and lives in `scripts/wca-refresh/.cache/`
