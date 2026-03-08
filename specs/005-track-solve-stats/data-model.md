# Data Model — Persistent Solve Time Stats

## Entity: `SolveRecord`

A single valid completed solve persisted for stats calculations.

### Fields
- `id: string` — unique identifier for record.
- `elapsedMs: number` — solve duration in milliseconds.
- `completedAtMs: number` — epoch timestamp for solve completion.

### Validation Rules
- `elapsedMs` must be a finite positive number.
- `completedAtMs` must be a finite positive epoch timestamp.
- Invalid records are excluded from stats and persistence repair output.

## Entity: `SolveHistoryStore`

Versioned persisted container stored in local storage.

### Fields
- `version: number` — schema version.
- `updatedAtMs: number` — epoch timestamp for last store update.
- `solves: SolveRecord[]` — ordered solve records (oldest → newest).

### Validation Rules
- `version` must match supported schema or be migratable.
- `solves` must be an array; non-array values resolve to empty list.
- Store size is bounded to configured maximum record count.

## Entity: `SolveStatsSummary`

Derived values displayed in practice modal.

### Fields
- `lastTimeMs: number | null` — most recent valid solve.
- `averageLast5Ms: number | null` — arithmetic mean of last five valid solves.
- `bestTimeMs: number | null` — minimum valid solve value in history.
- `solveCount: number` — count of valid persisted solves.

### Derivation Rules
- `lastTimeMs` = last valid record in ordered list; null if none.
- `averageLast5Ms` = mean of most recent 5 valid records; null if fewer than 5.
- `bestTimeMs` = minimum valid `elapsedMs`; null if none.

## State Transitions

1. **On valid solve stop**:
   - Create `SolveRecord` from timer result.
   - Append to `SolveHistoryStore.solves`.
   - Truncate to max history length if needed.
   - Persist updated store.
   - Recompute `SolveStatsSummary`.

2. **On modal/page initialization**:
   - Read persisted store.
   - Validate/sanitize/migrate as needed.
   - Recompute `SolveStatsSummary` for UI.

3. **On corrupted storage input**:
   - Fallback to safe empty store.
   - Keep practice flow functional.
