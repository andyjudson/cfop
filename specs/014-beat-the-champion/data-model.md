# Data Model: Beat the Champion (014)

## Bundled Data (Static JSON)

### `Competition` — one record per bundled event

```typescript
interface Competition {
  competition_id: string;                       // WCA ID e.g. "ShenyangSpring2025"
  competition_name: string;                     // Display name e.g. "Shenyang Spring 2025"
  year: number;                                 // Calendar year
  country: string;                              // ISO country code
  tier: 'wr' | 'championship';                 // WR event or championship final
  winner_name: string;                          // Finals winner display name
  winner_single: number;                        // Best single, seconds (2dp)
  winner_average: number | null;                // Best average, seconds (2dp); null if no valid avg
  scramble_groups: Record<string, string[]>;    // group_id → ordered scramble list
}
```

**Validation rules**:
- `winner_single > 0` always
- `winner_average` may be `null` — UI shows single comparison only
- Each group always has ≥ 1 scramble (confirmed: all 57 events have exactly 5 per group)
- `tier` is a closed enum

**Source**: `cfop-app/public/data/wca-beat-the-champion.json` (NDJSON, 57 records, ~30 KB)

---

## Runtime Types (TypeScript)

### `PracticeMode`

```typescript
type PracticeMode = 'standard' | 'competitive';
```

### `CompetitiveSession`

Ephemeral — lives in `PracticeSessionModal` local state only. Cleared on mode switch or modal close.

```typescript
interface CompetitiveSession {
  competition: Competition;   // Selected competition
  groupId: string;            // Randomly assigned group key e.g. "A"
  scrambles: string[];        // Ordered scramble list for the assigned group
  currentIndex: number;       // Index of the next scramble to serve (0-based)
  solveTimesMs: number[];     // Completed solve durations, grows with each stop
}
```

**State transitions**:
```
null
  │  activate competitive mode (competition selected)
  ▼
CompetitiveSession  { currentIndex: 0, solveTimesMs: [] }
  │
  │  [solve recorded]  → currentIndex++, solveTimesMs.push(t)
  │
  │  currentIndex === scrambles.length  → show ComparisonOutcome
  │
  │  [mode switch or modal close]
  ▼
null
```

### `ComparisonOutcome`

Derived at session end — computed on render, never stored.

```typescript
interface ComparisonOutcome {
  userBestSingleMs: number;
  userAverageMs: number | null;     // null if fewer solves than group size
  winnerSingleS: number;
  winnerAverageS: number | null;
  beatSingle: boolean;
  beatAverage: boolean | null;      // null if no valid winner average to compare
  competitionName: string;
  winnerName: string;
}
```

---

## Data Flow

```
public/data/wca-beat-the-champion.json
        │
        │  fetch on first competitive mode activation
        ▼
utils/competitionData.ts  ──  parseNdjson + validate  ──  Competition[] (module cache)
        │
        ▼
PracticeSessionModal  (mode: PracticeMode)
        │
        ├── standard mode ──▶  loadScramble()  ──▶  useSolveStats() + localStorage
        │
        └── competitive mode
                │
                ▼
          CompetitiveSession (local state)
                │
                ├── scrambles[currentIndex]  →  ScrambleState.value
                │
                └── solveTimesMs[]  →  ComparisonOutcome  (on final solve)
```

---

## Existing Types — No Change Required

`ScrambleState`, `TimerSession`, `PracticeAttemptView` in `types/practice.ts` are unchanged. Competitive mode serves scrambles as plain strings into the existing `ScrambleState.value` field; the timer hook (`useSolveTimer`) is reused without modification.
