# Data Model: Cubify Agent Skill (017)

The skill is stateless — no persistent data store. The entities below describe the in-memory structures the renderer works with.

---

## CubifyInput

Represents the parsed input from a `/cubify` invocation.

| Field | Type | Description |
|-------|------|-------------|
| `mode` | `'alg' \| 'case' \| 'file'` | Which input mode was used |
| `alg` | `string \| null` | Raw algorithm string (mode=alg) |
| `caseId` | `string \| null` | Case identifier e.g. `oll_sune` (mode=case) |
| `filePath` | `string \| null` | Path to JSON algorithm file (mode=file) |
| `viewMode` | `'2d' \| '3d' \| 'auto'` | Explicit flag or auto-inferred |
| `setupAlg` | `string \| null` | Optional setup moves override |

---

## RenderConfig

Resolved configuration passed to the renderer — all fields concrete, no nulls.

| Field | Type | Description |
|-------|------|-------------|
| `alg` | `string` | Algorithm to apply |
| `setupAlg` | `string` | Setup moves (empty string if none) |
| `visualization` | `'PG3D' \| 'experimental-2D-LL'` | cubing.js visualization mode |
| `mask` | `string` | `experimentalStickeringMaskOrbits` value |
| `outputFormat` | `'png' \| 'svg'` | Output file format |
| `outputPath` | `string` | Absolute path for the output file |

---

## AlgorithmCase (from JSON)

Structure of each entry in `algs-cfop-*.json` files, used for case lookup.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique case identifier e.g. `oll_sune` |
| `name` | `string` | Human-readable name |
| `notation` | `string` | Algorithm notation |
| `method` | `string` | Case type: `oll`, `pll`, `f2l`, `cross`, `bgr` |
| `setup` | `string \| undefined` | Optional setup moves |

---

## RenderResult

Returned after a single render completes.

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | Whether the image was written |
| `outputPath` | `string \| null` | Absolute path to written file |
| `caseId` | `string \| null` | Case ID if applicable |
| `error` | `string \| null` | Error message if success=false |

---

## Mask Presets

Copied from `cubify-app/src/utils/maskPresets.ts` into `cubify-scripts/lib/masks.mjs`.

| Preset | Usage | Orbit string |
|--------|-------|-------------|
| `default` | All stickers visible | `EDGES:------------,CORNERS:--------,CENTERS:------` |
| `cross` | Bottom cross focus | `EDGES:----IIIIIIII,CORNERS:IIIIIIII,CENTERS:------` |
| `f2l` | F2L pairs focus | `EDGES:----IIII----,CORNERS:----IIII,CENTERS:------` |
| `oll` | Top face orientation | `EDGES:----OOOO----,CORNERS:----IIII,CENTERS:------` |
| `pll` | Top layer permutation | `EDGES:----OOOO----,CORNERS:--------,CENTERS:------` |

---

## Type-to-Config Mapping

Determines default `viewMode` and `mask` from case `type`.

| Case type | View mode | Mask | Output format |
|-----------|-----------|------|--------------|
| `oll` | 2D | `oll` | PNG |
| `pll` | 2D | `pll` | PNG |
| `f2l` | 3D | `f2l` | PNG |
| `cross` | 3D | `cross` | PNG |
| `bgr` | 3D | `default` | PNG |
| _(raw alg)_ | 3D | `default` | PNG |

Note: all output is PNG. Playwright `page.screenshot()` only supports PNG; the 2D/3D distinction affects the TwistyPlayer visualization mode, not the file format.
