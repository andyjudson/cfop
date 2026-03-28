# Research: Beat the Champion (014)

## Data Loading Pattern

**Decision**: `fetch(import.meta.env.BASE_URL + 'data/wca-beat-the-champion.json')` with NDJSON parsing — identical to the `WrEvolutionChart` pattern.

**Rationale**: Established pattern in the project. `BASE_URL` ensures the correct path on GitHub Pages. NDJSON because the PySpark export uses `orient="records", lines=True`.

**Parsing**: Split on `\n`, filter empty lines, `JSON.parse` each line — mirror the `parseNdjson` helper already in `WrEvolutionChart.tsx`.

**Alternatives considered**: Importing the JSON at build time via Vite. Rejected — runtime fetch keeps the pattern consistent with all other data files.

---

## Competitive Session State Scope

**Decision**: Competitive session state lives entirely in `PracticeSessionModal` local state — no new localStorage key, no new persistence hook.

**Rationale**: Spec is explicit: "ephemeral (session only), consistent with how standard mode currently works." `useSolveStats` + localStorage must only be called in standard mode. Keeping competitive state local ensures zero contamination (FR-011).

**Alternatives considered**: A dedicated `useCompetitiveSession` hook. Rejected — purely local state doesn't benefit from a hook abstraction at this scale.

---

## Scramble Group Assignment

**Decision**: On competition selection, randomly pick one key from `scramble_groups` and serve its scrambles in order (index 0 → N). Track `currentIndex` in state.

**Rationale**: Mirrors real competition experience — each competitor is placed in one group and solves those scrambles in sequence. Per spec FR-006.

**Data confirmed**: Export sanity check shows all 57 competitions have exactly 5 scrambles per group and 1–2 groups. Sessions always use exactly 5 scrambles.

---

## Comparison Trigger

**Decision**: Comparison result shown automatically when the last scramble is solved (`currentIndex === scrambles.length - 1` at stop).

**Rationale**: SC-001 requires the result within the session with no extra navigation. Automatic trigger avoids an additional user action.

**Average handling**: Session average = mean of all solve times ms → seconds. If `winner_average` is `null`, only the single comparison is shown.

---

## Competition Selector UI

**Decision**: Inline scrollable list panel inside the modal — replaces scramble/timer content area while open; dismissed once a competition is confirmed.

**Rationale**: Single modal layer. The modal is already `max-height: 90vh; overflow: auto` so the list scrolls naturally within it.

**Default selection**: `data[0]` — the most recent competition (export is pre-sorted `year` descending).

---

## Mode Toggle Placement

**Decision**: Segmented control ("Standard" | "Competitive") in the modal header alongside the title, using Bulma `buttons has-addons`.

**Rationale**: Immediately visible, single tap, no navigation required. Consistent with existing Bulma patterns in the app.

---

## Data File Placement

**Decision**: Copy `wca_beat_the_champion.json` → `cfop-app/public/data/wca-beat-the-champion.json` (kebab-case, matching existing convention).

**Rationale**: `public/data/` is the established location for bundled static data. One-time copy from the pyspark_sandbox export.

---

## Constitution Violation Note

The constitution states "No social or competitive features." Feature 014 is solo — no user accounts, no leaderboards, no multiplayer. It serves personal motivation as a learning tool. This is a deliberate, spec-approved override consistent with the constitution's spirit.
