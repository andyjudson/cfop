# Quickstart — Feature 007 Cube Image Generator

## Prerequisites
- Node/npm installed
- Repository cloned

## Run locally

```bash
cd imggen-app
npm install
npm run dev -- --host 127.0.0.1 --port 5176
```

Open local URL shown by Vite (expected `http://127.0.0.1:5176/cubing.spec/` if base path is configured similarly).

## Build check

```bash
npm run build
```

## Manual validation checklist

### A. Core rendering
1. Enter valid move algorithm (e.g., `R U R' U'`) and click Apply.
2. Verify cube updates to expected state.
3. Confirm console logs original and inverted notation.

### B. Validation behavior
1. Enter invalid notation (`XYZ` or `R3`).
2. Verify inline error appears near algorithm input.
3. Verify invalid text remains in field.
4. Verify Play and Capture are disabled.

### C. Preset/custom masks
1. Test each preset: default, cross, f2l, oll, pll.
2. Verify expected visible/ignored sticker behavior.
3. Enter custom mask and verify it overrides preset.

### D. Mode and anchor behavior
1. Configure setup algorithm, mask, anchor.
2. Switch 3D -> 2D -> 3D.
3. Verify all settings are preserved and re-rendered.

### E. Capture outputs
1. In 3D mode, capture image and verify PNG dimensions are 288×288.
2. In 2D mode, capture image and verify SVG with fixed viewBox.
3. Run 10 consecutive captures; verify no freezes and all files valid.
4. Sample 10 PNG outputs; verify target size around/under 200KB.

### F. Keyboard behavior
1. Focus algorithm input and press Enter.
2. Verify Apply action triggers without clicking button.

## Done criteria
- All FR-001..FR-016 satisfied.
- All SC-001..SC-008 validated.
- Build passes and manual checklist complete.
