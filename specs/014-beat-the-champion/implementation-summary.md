# Implementation Summary: Beat the Champion (014)

**Branch**: `014-beat-the-champion`
**Status**: Complete — all tasks done, manual tests passed

---

## What Was Built

Three user stories delivered:

1. **Practice with real competition scrambles** — competitive mode uses actual WCA competition scrambles in sequence (5 per session), with a comparison result screen at the end showing user times vs winner times
2. **Browse and select a competition** — scrollable selector showing all 57 events with name, year, WR/Champ tier, and winning times; tap any row to switch competition
3. **Return to standard mode** — clean toggle back to standard with no stat contamination; reopening modal always starts in standard

---

## Files Changed / Created

| File | Change |
|---|---|
| `cfop-app/public/data/wca-beat-the-champion.json` | New — 57 competitions NDJSON (~29KB), generated from WCA export via PySpark |
| `cfop-app/src/types/competition.ts` | New — `Competition`, `PracticeMode`, `CompetitiveSession`, `ComparisonOutcome` types |
| `cfop-app/src/utils/competitionData.ts` | New — fetch + NDJSON parse with module-level cache; `pickRandomGroup()` utility |
| `cfop-app/src/components/PracticeSessionModal.tsx` | Modified — competitive mode state, session management, UI restructure |
| `cfop-app/src/components/PracticeSessionModal.css` | Modified — mode toggle, tier badges, solve count pill, scramble title layout |
| `cfop-app/src/components/ComparisonResult.tsx` | New — final results screen with user vs champion comparison table |
| `cfop-app/src/components/ComparisonResult.css` | New — tokens-only styles |
| `cfop-app/src/components/CompetitionSelector.tsx` | New — scrollable competition picker |
| `cfop-app/src/components/CompetitionSelector.css` | New — tokens-only styles |
| `cfop-app/src/index.css` | Modified — added `--color-success`, `--color-success-bg`, `--color-success-border` tokens |
| `pyspark_sandbox/wca_parser.ipynb` | Modified — added `export_beat_the_champion()` function |

---

## Data Pipeline

- Source: WCA public export TSV files processed in PySpark
- Two tiers merged: `wr` (world record holder at most recent WC) and `championship` (world/continental finals 2015+), preferring `wr` when both apply
- Winner names stripped of parenthetical Chinese script
- Output: 57 competitions (36 WR + 21 championship), scramble groups of 5 per competition

---

## UI Decisions

- Mode toggle moved into timer controls row alongside Scramble/Start/Stop buttons (all `is-small` with MUI icons + labels)
- Competition name + tier badge inline in scramble block title
- Solve progress shown as `n / 5` pill in timer header (replaces bottom status messages)
- Standard mode shows solve count pill (`N solves`) in same position
- WR badge: accent blue; Champ badge: accent warm orange
- Competition name and winner name both use `--color-accent-primary`

---

## Key Invariants

- `saveSolve()` only called in standard mode — competitive solves never touch `useSolveStats`
- `CompetitiveSession` always `null` on modal close
- Scrambles in competitive mode always from `session.scrambles[currentIndex]`, never from `generateRandom333Scramble()`
- Mode toggle disabled while `timer.state === 'running'`
