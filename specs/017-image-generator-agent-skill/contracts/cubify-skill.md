# Contract: /cubify Skill Interface

## Invocation Syntax

```
/cubify <alg>
/cubify --case <case-id>
/cubify --file <path-to-json>
```

### Optional flags (any mode)

| Flag | Description |
|------|-------------|
| `--2d` | Force 2D top-layer visualization (experimental-2D-LL) |
| `--3d` | Force 3D perspective visualization (PG3D) |
| `--setup <alg>` | Override setup algorithm |

All output is PNG regardless of visualization mode.

---

## Input Modes

### Mode 1 — Raw algorithm

```
/cubify R U R' U'
/cubify "R U R' U'" --2d
/cubify "F R U R' U' F'" --setup z2
```

- Input is the remainder of the command after `/cubify` with no leading `--` flag
- Whitespace-separated move tokens
- Validated against cubing.js `Alg.fromString()` — error returned for invalid notation

### Mode 2 — Case lookup

```
/cubify --case oll_sune
/cubify --case pll_t --3d
```

- `--case` followed by a single case ID string
- Case ID format: `<type>_<name>` (e.g. `oll_sune`, `pll_t`, `f2l_basic`)
- View mode and mask inferred from case type unless overridden

### Mode 3 — Batch file

```
/cubify --file algs-cfop-oll.json
/cubify --file /absolute/path/to/file.json
```

- `--file` followed by a file path (relative to `cfop-app/public/data/` or absolute)
- Generates one image per case entry
- Files named `<case-id>.svg` or `<case-id>.png`

---

## Output Contract

### Single image (modes 1 & 2)

```
✓ Image written: ~/.claude/tmp/cubify/oll_sune.png
```

### Batch (mode 3)

```
✓ Batch complete: 57/57 images written to ~/.claude/tmp/cubify/
  oll_dot.png, oll_sune.png, ...
```

### Error

```
✗ Error: Unknown case ID "oll_foo". Available OLL cases: oll_sune, oll_antisune, ...
✗ Error: Invalid algorithm "R Q U" — unknown move "Q"
✗ Error: sips not found. PNG resizing requires macOS.
```

---

## Renderer Script Contract

The skill calls the Node renderer via:

```bash
node cubify-scripts/cubify.mjs [args]
```

### Exit codes

| Code | Meaning |
|------|---------|
| `0` | Success — image(s) written |
| `1` | Input error (invalid alg, unknown case ID, missing file) |
| `2` | Render error (Playwright failure, sips failure) |

### stdout

- On success: absolute path(s) to written file(s), one per line
- On error: human-readable error message

---

## File Naming Convention

| Input | Output filename |
|-------|----------------|
| Raw alg | `cubify-<timestamp>.png` |
| `--case oll_sune` | `oll_sune.png` |
| `--file algs-cfop-oll.json` | `<case-id>.png` per case |
