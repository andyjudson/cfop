# Data Model: WCA WR Chart

**Feature**: 012-wca-wr-chart
**Date**: 2026-03-28

## Source Data

**File**: `cfop-app/public/data/wca-wr-evo.json`
**Format**: NDJSON — one JSON object per line (not a JSON array)
**Served**: As a static asset via `fetch(import.meta.env.BASE_URL + 'data/wca-wr-evo.json')`

### Raw Record Shape (one line of the file)

```typescript
interface WrRawRecord {
  competition_date: number;      // Unix timestamp in milliseconds
  competition_id: string;        // e.g. "WuhuOpen2018"
  person_id: string;             // WCA competitor ID, e.g. "2015DUYU01"
  person_name: string;           // Display name, may include native script in parentheses
  person_country: string;        // Country name (English), e.g. "China", "USA"
  time: number;                  // Solve time in seconds, e.g. 3.47
  type: "Single WR" | "Average WR";
}
```

### Notes on Source Data
- `person_name` may contain Unicode characters (e.g. `"Yusheng Du (杜宇生)"`)
- `person_country` is a full country name, not an ISO code — a small lookup map is used for flag emoji
- All records in the file are WR-setting events; no filtering needed beyond splitting by `type`
- ~65–70 records total across both types (as of early 2026)

---

## Derived / Runtime Types

### Normalised Record (post-parse, used in component)

```typescript
interface WrRecord {
  date: number;           // competition_date (ms timestamp) — used as x-axis value
  time: number;           // solve time in seconds — used as y-axis value
  personName: string;     // display name (stripped of native script)
  personCountry: string;  // country name as in source data
  competitionId: string;  // raw competition ID
  formattedDate: string;  // e.g. "Nov 2018" — pre-formatted for tooltip
  flagEmoji: string;      // derived from country name via lookup map
}
```

### Chart Series Data (Recharts `<Line>` dataKey shape)

Recharts requires a unified `data` array for `<LineChart>`. The chart uses two separate `<Line>` components each with their own `data` prop (passed directly), avoiding the need to merge both series into a single unified array.

```typescript
// Two separate arrays, one per series:
const singleData: WrRecord[] = [...];   // type === "Single WR"
const averageData: WrRecord[] = [...];  // type === "Average WR"
```

---

## Component Interface

### Props

```typescript
interface WrEvolutionChartProps {
  // No required props — component is self-contained and fetches its own data
}
```

### Internal State

```typescript
type LoadState = 'loading' | 'ready' | 'error';

// Component internal:
const [singleData, setSingleData] = useState<WrRecord[]>([]);
const [averageData, setAverageData] = useState<WrRecord[]>([]);
const [loadState, setLoadState] = useState<LoadState>('loading');
```

---

## Country Flag Lookup

A small hardcoded map covering all WR-holding countries in the dataset:

```typescript
const COUNTRY_FLAGS: Record<string, string> = {
  'Japan': '🇯🇵',
  'France': '🇫🇷',
  'USA': '🇺🇸',
  'Finland': '🇫🇮',
  'Netherlands': '🇳🇱',
  'Australia': '🇦🇺',
  'Poland': '🇵🇱',
  'Korea': '🇰🇷',
  'China': '🇨🇳',
};
```

This covers all countries appearing in the current dataset. When an unknown country appears (e.g. after a data refresh adds a new WR holder), the flag gracefully falls back to an empty string.

---

## Data Flow

```
wca-wr-evo.json (NDJSON)
  └── fetch() on component mount
        └── split('\n') → filter(Boolean) → map(JSON.parse)
              └── filter(isValidRecord)
                    ├── filter(type === "Single WR") → singleData[]
                    └── filter(type === "Average WR") → averageData[]
                          └── map(normalise) → WrRecord[]
                                └── <LineChart data> / <Line data>
```

---

## Axis Configuration

| Axis | Type | Domain | Tick Format |
|------|------|--------|-------------|
| X (date) | `number`, `scale="time"` | `['dataMin', 'dataMax']` | `new Date(v).getFullYear()` — year only |
| Y (time) | `number` | `[0, 'dataMax + 1']` | `v + 's'` — e.g. `"5s"` |

Y-axis is NOT inverted. Downward trend (lower times = faster) reads naturally as "improvement over time."
