# Data Model: Global Alg Visualizer & Practice Timer

**Feature**: 013-global-alg-visualizer
**Date**: 2026-03-28

## Existing Schema (unchanged)

The `CfopAlgorithm` interface already covers all data requirements for this feature:

```ts
interface CfopAlgorithm {
  id: string;        // e.g. "oll_dot_1"
  name: string;      // e.g. "Dot 1 (H)"
  notation: string;  // e.g. "R U2 R' U' R U' R'"
  image: string;     // asset path
  notes?: string;
  method?: string;   // "oll" | "pll"
  group?: string;    // group label from JSON
}
```

No new data schemas are required.

## Runtime State: VisualizerModal

All state is in-component; nothing is persisted to localStorage.

| State field      | Type                           | Default         | Description |
|-----------------|--------------------------------|-----------------|-------------|
| `ollData`       | `CfopAlgorithm[]`              | `[]`            | All OLL algorithms, loaded on first open |
| `pllData`       | `CfopAlgorithm[]`              | `[]`            | All PLL algorithms, loaded on first open |
| `loadState`     | `'loading' \| 'ready' \| 'error'` | `'loading'`  | Data fetch status |
| `selectedSet`   | `'OLL' \| 'PLL'`               | `'OLL'`         | Active algorithm set |
| `selectedGroup` | `string`                       | `'all'`         | Active group filter; `'all'` = no filter |
| `currentAlg`    | `CfopAlgorithm \| null`        | `null`          | Algorithm currently loaded in the player |

## Derived Values

- **Available groups**: Extracted from the active set's data. `['all', ...unique group values sorted]`
- **Shuffle pool**: `selectedSet === 'OLL' ? ollData : pllData`, filtered to `selectedGroup === 'all' ? all : records where group === selectedGroup`

## Group Reference (current JSON data)

### OLL — 57 algorithms, 7 groups

| Group label         | Count |
|--------------------|-------|
| Block & Edge Setup | 9     |
| Cross Solved        | 6     |
| Dot Patterns        | 4     |
| Fish & Awkward      | 8     |
| Lightning & Hooks   | 10    |
| Line & L Shapes     | 11    |
| Small Patterns      | 9     |

### PLL — 21 algorithms, 5 groups

| Group label    | Count |
|----------------|-------|
| adjacent swap  | 6     |
| corners only   | 2     |
| diagonal swap  | 2     |
| edges only     | 4     |
| G perms        | 4     |

*(Note: spec SC-003 referenced "14 OLL groups" — that was the pre-Feature-008 count. Current data has 7 consolidated groups.)*
