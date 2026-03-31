# Quickstart: Cubify Agent Skill (017)

## Prerequisites

1. Chromium installed for Playwright (already done for feature 016):
   ```bash
   cd cfop-app && npx playwright install chromium
   ```

2. Node.js 24 (matches `.nvmrc`)

3. macOS (for `sips` PNG resizing)

---

## Setup (once)

```bash
cd cubify-scripts
npm install
```

---

## Usage

### Generate image from a raw algorithm

```bash
/cubify R U R' U'
```
Produces: `~/.claude/tmp/cubify/cubify-<timestamp>.png` (3D, default)

```bash
/cubify "F R U R' U' F'" --2d
```
Produces: `~/.claude/tmp/cubify/cubify-<timestamp>.png` (2D top-layer view)

### Generate image for a named case

```bash
/cubify --case oll_sune
```
Produces: `~/.claude/tmp/cubify/oll_sune.png` (2D view, OLL mask auto-applied)

```bash
/cubify --case f2l-1-1
```
Produces: `~/.claude/tmp/cubify/f2l-1-1.png` (3D view, F2L mask auto-applied)

### Batch generate all cases from a JSON file

```bash
/cubify --file algs-cfop-oll.json
```
Produces: `~/.claude/tmp/cubify/oll-*.png` — one PNG per OLL case

---

## Direct script invocation (for testing)

```bash
cd cubify-scripts
node cubify.mjs "R U R' U'"
node cubify.mjs --case oll_sune
node cubify.mjs --file ../cfop-app/public/data/algs-cfop-oll.json
```

---

## Output location

All images are written to `~/.claude/tmp/cubify/`. The directory is created automatically on first run.

---

## Integration scenario: generating all OLL images

```bash
/cubify --file algs-cfop-oll.json
# Output: 57 PNG files in ~/.claude/tmp/cubify/
# Each named <case-id>.png with correct sticker mask applied
```

Expected output:
```
✓ Batch complete: 57/57 images written to ~/.claude/tmp/cubify/
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `sips not found` | macOS only — not supported on Linux/Windows |
| `Chromium not found` | Run `cd cfop-app && npx playwright install chromium` |
| `Cannot find module 'playwright'` | Run `cd cubify-scripts && npm install` |
| Blank image output | Check algorithm string is valid cubing notation |
