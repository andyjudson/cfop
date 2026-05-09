# CLI Contract — wca-refresh

## Entry point

Registered in `pyproject.toml` as `[project.scripts]`:
```toml
wca-refresh = "wca_refresh.cli:app"
```

Invoked as `uv run wca-refresh [OPTIONS]` from `scripts/wca-refresh/`.

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--force` | flag | false | Re-download even if cache is current |
| `--no-download` | flag | false | Use existing cache; skip network entirely |
| `--dry-run` | flag | false | Compute transforms but do not write output files |
| `--year` | int | 2015 | Earliest year for championship competitions in beat-the-champion output (WR competitions are always all-time) |

`--force` and `--no-download` are mutually exclusive.

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | Success (files written or no changes needed) |
| 1 | Error (download failed, transform failed, bad arguments) |

## Stdout contract

On success, script prints:
```
WCA export date: YYYY-MM-DD
Cache: fresh (skipping download)       # or: stale — downloading (~300MB)...

Refreshing wca-wr-evolution.json   … N records  (+N new | no change)
Refreshing wca-wr-legends.json     … N persons  (+N new | no change)
Refreshing wca-beat-the-champion.json … N competitions  (+N new | no change)

Done. Files written to cfop-app/public/data/
```

On `--dry-run`, final line reads `Dry run — no files written.`

On error, prints a human-readable message to stderr and exits 1.

## Output files

Written to `cfop-app/public/data/` (relative to repo root):
- `wca-wr-evolution.json`
- `wca-wr-legends.json`
- `wca-beat-the-champion.json`

Each is NDJSON — one JSON object per line, UTF-8, no trailing newline. Schema matches existing files exactly (see `data-model.md`).

## Atomicity guarantee

Each output file is written to a `.tmp` sibling then renamed on success. A failed transform leaves the existing file intact. A failed download leaves the cache intact (temp-file + rename in `.cache/`).
