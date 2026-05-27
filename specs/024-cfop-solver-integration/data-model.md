# Data Model: CFOP Solver Integration

## React State (CubifyPage)

### Existing state — unchanged

| State | Type | Role in CFOP mode |
|-------|------|-------------------|
| `mode` | `'case' \| 'scramble' \| 'solve'` | `'solve'` entered after solver returns |
| `scrambleAlg` | `string \| null` | Used to build initial `cfopSetup` |
| `scrambleDone` | `boolean` | Guards solve button; set false when solve starts |
| `playing` | `boolean` | Controlled per-stage; false between stages |
| `stepIndex` | `number` | Tracks position within current stage alg |

### New state — added for CFOP

| State | Type | Initial | Description |
|-------|------|---------|-------------|
| `cfopStages` | `SolveStage[] \| null` | `null` | All 7 stages from solver; null until first solve |
| `cfopStageIndex` | `number` | `0` | Index into `cfopStages`; advances on `onComplete` |
| `cfopSetup` | `string` | `''` | Accumulated setup: `scramble + z2 + prior stage algs` |

### Removed state

| State | Removed because |
|-------|----------------|
| `solveAlg: string \| null` | Replaced by `cfopStages[cfopStageIndex].alg` |

## SolveStage (from `@andyjudson/cubify`)

Provided by the solver — consumed as-is, no transformation in cfop-app.

| Field | Type | Example |
|-------|------|---------|
| `label` | `SolveStageLabel` | `'cross'`, `'f2l-fr'`, `'oll'`, `'pll'` |
| `alg` | `string` | `"F' L F L'"` (empty string if sub-step already solved) |
| `mask` | `string` | Orbit string or MASK_PRESETS label |
| `moves` | `number` | Move count for this stage |
| `caseName` | `string \| undefined` | `"T-Perm"` (OLL/PLL only) |
| `wcaId` | `string \| number \| undefined` | `21` (OLL/PLL only) |

## State Transitions

```
'case' mode
    │
    ▼ handleScramble()
'scramble' mode (scrambleAlg set, playing animates)
    │ onComplete → scrambleDone = true
    │
    ▼ handleSolve() [solver resolves]
'solve' mode, cfopStageIndex = 0
    │
    ▼ user presses play
playing = true, stage 0 animates
    │ onComplete
    ├── cfopStageIndex = 1 (skip empties), playing = false
    ├── user presses play → stage 1 animates
    ├── …repeat through 7 stages…
    │ onComplete (stage 6)
    └── cfopStageIndex = 7 (>= stages.length) → "Solved!" status, playing = false

At any point in 'solve' mode:
    handleScramble() → mode = 'scramble', cfopStages = null, cfopStageIndex = 0
    handleCaseChange() → mode = 'case', cfopStages = null
```

## AccumulatedSetup derivation

```
After solver returns solution with setupAlg = 'z2':
  cfopSetup[0] = scrambleAlg + ' z2'

After stage i completes:
  cfopSetup[i+1] = cfopSetup[i] + ' ' + stages[i].alg   (if stages[i].alg non-empty)
  cfopSetup[i+1] = cfopSetup[i]                           (if stages[i].alg empty)

This ensures <CubePlayer setup={cfopSetup}> always starts each stage
from the correct physical cube position.
```
