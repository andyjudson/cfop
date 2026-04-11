# Research: WR Legends Panel (Feature 022)

No external research required — all dependencies are in-project. This document records decisions made during planning.

## Decision: Lift fetch to AboutPage

**Decision**: Move `wca-wr-evolution.json` fetch from `WrEvolutionChart` into `AboutPage`. Pass `WrRawRecord[]` as a prop to both `WrEvolutionChart` and the new `WrLegendsTable`.

**Rationale**: Spec requires no duplicate fetch. `AboutPage` is the single consumer of both components, making it the natural owner of the shared data.

**Alternative considered**: Shared React context or a custom hook (`useWrData`). Rejected — overkill for two sibling components on a single page. Prop-passing is simpler and more explicit.

## Decision: Derive legends in AboutPage via useMemo

**Decision**: Aggregate `WrRawRecord[]` → `WrLegend[]` inside `AboutPage` with `useMemo`, pass to `WrLegendsTable`.

**Rationale**: Keeps `WrLegendsTable` as a pure presentational component (receives data, renders table). Aggregation logic is co-located with the data source. 69 records → 26 rows is trivial; no performance concern.

## Decision: COUNTRY_FLAGS shared constant

**Decision**: Move `COUNTRY_FLAGS` map from `WrEvolutionChart` to a shared location accessible to both components. Options: inline duplicate, or extract to a small util.

**Rationale**: Both components need flag emoji. Duplicating the 9-entry map is acceptable given its tiny size — avoid over-engineering a shared util for this. Extract only if a third consumer emerges.

**Resolution**: Duplicate in `WrLegendsTable` for now. The map is 9 entries and stable.

## Decision: Null sort order

**Decision**: Rows with no single WR (`bestSingle: null`) always sort to the bottom when sorting by Single, regardless of asc/desc direction. Same for Average.

**Rationale**: Null values mixed into the sort order would be confusing. Always-bottom is the convention users expect from data tables.

## Decision: Name display

**Decision**: Strip CJK parenthetical from `person_name` for the table (e.g. "Yiheng Wang" not "Yiheng Wang (王艺衡)"). Same stripping already used in `WrEvolutionChart.normaliseRecord`.

**Rationale**: Table cells are compact (1/3 panel width). Full names with CJK are too wide on mobile.

## Decision: WrRawRecord type location

**Decision**: Export `WrRawRecord` from `WrEvolutionChart.tsx` so `AboutPage` can type the shared records array. No new shared types file needed.

**Alternative considered**: Shared `types/wca.ts`. Rejected — premature; one consumer of the type outside its origin file doesn't justify a new module.
