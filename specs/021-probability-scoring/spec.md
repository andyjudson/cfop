# Feature 021 — Probability Scoring

## Summary

Surfaces the mathematical probability of each OLL and PLL case appearing in a random solve, alongside the WCA case number. This is a lightweight data display feature — the probabilities and WCA IDs are already in the JSON data; this feature makes them visible to learners in the UI.

## Motivation

Understanding how likely a case is to appear gives learners a rational basis for prioritising which algorithms to learn first. Cases like Sune (1/54) appear roughly twice as often as H Shape (1/108). This "rarity" framing also makes the skip cases (Checkers/OLL 20 at 1/216, H Perm at 1/72) memorable fun facts.

The WCA number provides a common reference: when a learner looks up a case on SpeedSolving.com wiki or asks in a Discord server, "OLL 27" is universally understood; "Sune" is not always.

## User Stories

**US-001 — See case probability**
As a learner, I want to see the probability of each OLL and PLL case so I can prioritise cases I'll actually encounter.

**US-002 — See WCA case number**
As a learner, I want to see the WCA number (e.g. OLL 27, T Perm) so I can look the case up externally using a common reference.

**US-003 — Probability in the Visualizer**
As a learner, when I have a case loaded in the Visualizer modal, I want to see the probability and WCA ID in the case header, so I have context while learning the algorithm.

## Functional Requirements

**FR-001 — Probability badge on algorithm cards**
OLL and PLL algorithm cards display the `prob` field (e.g. "1/54") as a small badge or secondary label. Placement: alongside or below the case name, unobtrusive.

**FR-002 — WCA ID badge on algorithm cards**
OLL cards display the WCA number (e.g. "OLL 27"). PLL cards display the WCA letter code (e.g. "T Perm" is already the name, but a short "WCA: T" label or similar). Since PLL names *are* the WCA IDs, this may be a no-op for PLL.

**FR-003 — Visualizer modal header**
When a case is loaded in the Visualizer modal, the case header area (currently shows name and group) includes the WCA ID and probability.

**FR-004 — Data source**
Read directly from the existing `wca_id` and `prob` fields in `algs-cfop-oll.json` and `algs-cfop-pll.json`. No new data files required.

## Design Notes

- Probability fractions should render as-is: "1/54", "1/108", "1/216" — not as decimals
- WCA ID for OLL: render as "OLL 27" (integer, prefixed)
- WCA ID for PLL: the name already encodes the WCA ID (T Perm = WCA T); a subtle "WCA" label may be sufficient or skipped entirely for PLL
- Badges should be visually lighter than the case name — use a muted text colour token
- On compact cards (e.g. the full CFOP grids) space is tight; consider showing only one or the other, or only on hover/focus
- Checkers (OLL 20, prob 1/216) and H Perm (prob 1/72) are natural conversation starters — consider a tooltip note: "OLL skip — top already solved!"

## Data Already in Place

As of the data update (April 2026):
- `algs-cfop-oll.json`: all 57 cases have `wca_id` (integer 1–57) and `prob` (fraction string)
- `algs-cfop-pll.json`: all 21 cases have `wca_id` (string, e.g. "T") and `prob`
- Reference: `wca-oll-reference.json`, `wca-pll-reference.json` — verified against SpeedSolving.com wiki
- Research notes: `specs/research/cfop-probabilities-and-wca-ids.md`

## Out of Scope

- F2L probability display (F2L cases are situational, probability is less meaningful per-case)
- Sorting or filtering by probability
- Cumulative probability ("probability of needing at most one of these cases")
- Probability visualisation / bar charts

## Acceptance Criteria

- [ ] OLL algorithm cards display probability fraction and WCA number
- [ ] PLL algorithm cards display probability fraction (WCA ID display TBD per design)
- [ ] Visualizer modal header shows WCA ID and probability for the loaded case
- [ ] Probability displays use fraction format, not decimal
- [ ] No visual regression on existing card or modal layouts
- [ ] Mobile (iPhone 16 baseline) layout remains clean
