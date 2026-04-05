# Data Model: WR Legends Panel (Feature 022)

## Source Data

`wca-wr-evolution.json` — NDJSON, 69 records, fetched once in `AboutPage`.

Existing type (exported from `WrEvolutionChart.tsx`):

```ts
export interface WrRawRecord {
  competition_date: number;   // Unix ms timestamp
  competition_id: string;
  competition_name: string;
  person_id: string;
  person_name: string;        // may include CJK parens, e.g. "Yiheng Wang (王艺衡)"
  person_country: string;     // e.g. "Australia", "China"
  time: number;               // seconds, 2 decimal places
  type: 'Single WR' | 'Average WR';
}
```

## Derived: WrLegend

One row per person in the legends table. Computed in `AboutPage` via `useMemo` from `WrRawRecord[]`.

```ts
interface WrLegend {
  personId: string;           // unique key
  personName: string;         // CJK parens stripped
  personCountry: string;
  flagEmoji: string;          // from COUNTRY_FLAGS map
  totalWrs: number;           // singleCount + avgCount
  singleCount: number;
  avgCount: number;
  bestSingle: number | null;  // null if no single WR
  bestAvg: number | null;     // null if no average WR
  lastWrDate: number;         // Unix ms — most recent WR date, used for tiebreak
  isCurrentSingle: boolean;   // holds the current WR single
  isCurrentAvg: boolean;      // holds the current WR average
}
```

## Derivation Algorithm

```
currentSingleHolder = person_id of first record with type='Single WR' (file is date-desc)
currentAvgHolder    = person_id of first record with type='Average WR'

For each WrRawRecord:
  upsert legend by person_id:
    - strip CJK parens from person_name
    - increment singleCount or avgCount
    - track min(bestSingle) and min(bestAvg)
    - track max(lastWrDate)
    - set isCurrentSingle = (person_id === currentSingleHolder)
    - set isCurrentAvg    = (person_id === currentAvgHolder)
  totalWrs = singleCount + avgCount

Default sort: totalWrs DESC, lastWrDate DESC
```

## Sort State

```ts
type SortKey = 'name' | 'totalWrs' | 'bestSingle' | 'bestAvg';
type SortDir = 'asc' | 'desc';
```

Null `bestSingle` / `bestAvg` always sorts to the bottom, regardless of direction.

## Expand/Collapse State

```ts
const [chartExpanded, setChartExpanded] = useState(false);
```

- `false` (default): side-by-side — table in `.column.is-one-third`, chart in `.column.is-two-thirds`
- `true`: chart-only — table column hidden, chart in `.column.is-full`
