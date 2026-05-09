# Quickstart — Feature 023: wca-data-refresh

## First-time setup

```bash
cd scripts/wca-refresh
uv sync
```

## Standard refresh (after a new WR)

```bash
/refresh-wca
# or directly:
cd scripts/wca-refresh && uv run wca-refresh
```

Output:
```
WCA export date: 2026-05-09
Cache: stale — downloading (~300MB)...
Downloading WCA export... done.

Refreshing wca-wr-evolution.json   … 64 records  (+2 new)
Refreshing wca-wr-legends.json     … 27 persons  (+1 new)
Refreshing wca-beat-the-champion.json … 58 competitions  (+1 new)

Done. Files written to cfop-app/public/data/
```

## Force re-download (if cache feels stale)

```bash
uv run wca-refresh --force
```

## Transforms only, no network (use existing cache)

```bash
uv run wca-refresh --no-download
```

## Refresh for a specific year of championships

```bash
uv run wca-refresh --year 2015   # full historical scope (default)
uv run wca-refresh --year 2024   # championships from 2024 onwards only
```

Note: `--year` gates which championships are included in `wca-beat-the-champion.json`.
WR competitions are always included regardless. Passing `--year 2026` produces a much
smaller beat-the-champion dataset than the existing file (drops 2015–2025 championships).

## Dry run (compute without writing)

```bash
uv run wca-refresh --dry-run
```

## After refresh — commit updated data

The `/refresh-wca` skill offers to commit automatically. Manual equivalent:

```bash
git add cfop-app/public/data/
git commit -m "chore(data): refresh WCA data (export 2026-05-09)"
git push
```
