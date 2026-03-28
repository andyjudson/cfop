# Implementation Plan: Beat the Champion

**Branch**: `014-beat-the-champion` | **Date**: 2026-03-28 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/014-beat-the-champion/spec.md`

## Summary

Extend the existing Practice modal with a Competitive mode that serves real WCA competition scrambles and compares the user's session times against the competition winner. Data is pre-processed via PySpark (done) and bundled as a static NDJSON file (~30 KB). The modal gains a mode toggle, a competition selector panel, and a comparison result screen — all within the existing modal layer, with no new routes or external API calls.

## Technical Context

**Language/Version**: TypeScript 5.9 / React 19 / Vite 7
**Primary Dependencies**: Bulma CSS 1.x, react-router-dom 7.x, react-icons 5.x (all existing — no new dependencies)
**Storage**: No new persistence — competitive session is ephemeral (session only)
**Testing**: N/A (project has no automated test suite)
**Target Platform**: Web (GitHub Pages), macOS + iOS (393px mobile baseline)
**Project Type**: web-app (frontend, static hosting)
**Performance Goals**: Comparison result within 1s of final solve (SC-003); mode toggle instant (SC-005); data load on first activation only (cached in module)
**Constraints**: 393px mobile viewport; no runtime external API calls; modal-only extension (no new routes); bundled data < 50 KB
**Scale/Scope**: 57 competitions, ~30 KB data file, extends one existing component

## Constitution Check

| Gate | Status | Notes |
|---|---|---|
| Web-first, React ecosystem | PASS | TypeScript / React 19 / Vite — no change |
| No new external dependencies | PASS | Zero new packages |
| No server-side requirements | PASS | Static fetch from `public/data/` |
| Minimal bundle size | PASS | +~30 KB data file, no new JS dependencies |
| Algorithm JSON stays pure notation | PASS | N/A — no algorithm data changes |
| "No competitive features" (constitution) | OVERRIDE | Solo feature — no accounts, leaderboards, multiplayer. Personal motivation tool. Deliberate spec-approved override. |

## Project Structure

### Documentation (this feature)

```text
specs/014-beat-the-champion/
├── plan.md                    # This file
├── research.md                # Phase 0 output
├── data-model.md              # Phase 1 output
├── quickstart.md              # Phase 1 output
├── contracts/
│   └── ui-contracts.md        # Phase 1 output
└── tasks.md                   # Phase 2 output (/speckit.tasks)
```

### Source Code

```text
cfop-app/public/data/
└── wca-beat-the-champion.json        # Bundled competition data (copy from pyspark export)

cfop-app/src/
├── types/
│   ├── practice.ts                   # Existing — no change
│   └── competition.ts                # NEW: Competition, CompetitiveSession, ComparisonOutcome
├── utils/
│   ├── scramble.ts                   # Existing — no change
│   └── competitionData.ts            # NEW: fetch + parse NDJSON, module-level cache
├── components/
│   ├── PracticeSessionModal.tsx      # MODIFIED: mode toggle, competitive state, selector integration
│   ├── PracticeSessionModal.css      # MODIFIED: mode toggle styles, competitive block styles
│   ├── CompetitionSelector.tsx       # NEW: scrollable competition list panel
│   ├── CompetitionSelector.css       # NEW
│   ├── ComparisonResult.tsx          # NEW: final session comparison screen
│   └── ComparisonResult.css          # NEW
```

**Structure Decision**: Single frontend project extension. No new routes — all UI lives inside `PracticeSessionModal`. No new hooks — competitive session state is local to the modal.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Constitution "no competitive features" | Solo motivational tool — no social element | The feature is the entire point of spec 014; removing it defeats the spec |
