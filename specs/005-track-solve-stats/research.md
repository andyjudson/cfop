# Phase 0 Research — Persistent Solve Time Stats

## Decision 1: Persist solve history in a versioned localStorage envelope

- **Decision**: Store solve history in one localStorage key using a versioned JSON envelope (`version`, `updatedAt`, `solves[]`). Each solve stores duration in milliseconds and completion timestamp.
- **Rationale**: A single versioned envelope is simple, future-proof for migration, and easy to validate atomically.
- **Alternatives considered**:
  - Multiple per-solve keys in localStorage
    - Rejected: harder consistency and cleanup.
  - IndexedDB storage
    - Rejected: unnecessary complexity for small bounded history.

## Decision 2: Validate and sanitize persisted data on read

- **Decision**: Parse persisted history defensively; ignore malformed entries (non-numeric/invalid durations or timestamps), and fall back to empty valid state on unrecoverable parse/schema errors.
- **Rationale**: localStorage is untrusted runtime input and must not break practice flow.
- **Alternatives considered**:
  - Trust stored JSON without runtime checks
    - Rejected: brittle behavior and crash risk when data is corrupted.
  - Hard-fail when storage is invalid
    - Rejected: poor user experience.

## Decision 3: Keep bounded history and derive stats from in-memory sanitized list

- **Decision**: Maintain a bounded recent history (fixed max entries) and compute `last`, `average (last 5)`, and `best` from sanitized records in memory.
- **Rationale**: Keeps storage size controlled and avoids stale denormalized fields.
- **Alternatives considered**:
  - Persist precomputed stats together with history
    - Rejected: invalidation/mismatch risk.
  - Unlimited history growth
    - Rejected: unnecessary storage and parse overhead.

## Decision 4: Average(last 5) behavior with partial history

- **Decision**: For fewer than 5 valid solves, display a clear partial/empty state (e.g., placeholder and/or helper text). For 5+ solves, calculate using the most recent five valid solves.
- **Rationale**: Matches feature requirements while keeping output understandable and non-misleading.
- **Alternatives considered**:
  - Hide the metric entirely until 5 solves
    - Rejected: lower discoverability.
  - Compute over all solves instead of most recent 5
    - Rejected: contradicts requirement scope.

## Decision 5: Write persistence only on valid solve completion

- **Decision**: Persist solve records only when timer transitions from running to stopped; read persisted history on modal initialization and keep UI stats synchronized after every saved solve.
- **Rationale**: Avoids unnecessary writes during timer ticks and keeps stats reactive to completed solves.
- **Alternatives considered**:
  - Write on every timer tick
    - Rejected: excessive I/O and re-render risk.
  - Read/write only on full page reload
    - Rejected: stale modal stats.

## Resolved Clarifications

All technical-context unknowns are resolved for this feature. No `NEEDS CLARIFICATION` items remain.
