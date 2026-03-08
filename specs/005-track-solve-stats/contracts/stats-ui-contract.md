# UI/Data Contract — Solve Stats Persistence

## Scope

Defines required behavior for local persistence and stat rendering in the practice timer modal.

## Persisted Data Contract

### Storage Key
- `practice.solveHistory` (logical key name; exact implementation key may include app namespace).

### Persisted Payload
- `version`: number
- `updatedAtMs`: number
- `solves`: array of solve records with:
  - `id`: string
  - `elapsedMs`: number
  - `completedAtMs`: number

### Integrity Rules
- Invalid/malformed records must not break UI.
- Unsupported payloads should resolve to safe empty state or migrated state.
- Persisted list is bounded by configured max history size.

## UI Stats Contract

### Displayed Fields
- `Last time`
- `Average (last 5)`
- `Best time`

### Update Rules
1. After each valid solve completion, all three stats are recalculated and rendered immediately.
2. After modal/page reopen, displayed stats must reflect persisted history.
3. If solve count < 5, `Average (last 5)` displays clear partial/empty state.
4. If no valid solves exist, all stats show explicit empty-state output.

## Error/Recovery Contract

- Corrupted storage must not crash practice modal.
- Invalid persisted records are ignored for calculations.
- Timer start/stop and scramble actions remain usable even when persisted data is invalid.

## Acceptance Mapping

- Supports FR-001 to FR-010 in [spec.md](../spec.md).
