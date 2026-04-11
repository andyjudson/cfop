# Feature 025 — cubify-2d-export

## Summary

Implement `CubeRenderer2D` and `CubeExporter` in `cubify-harness` to generate SVG and PNG cube net images from a `CubeState`, with stickering mask support. Replace the Playwright-based headless rendering in `cubify-scripts` with a pure JS path.

---

## Motivation

The current `cubify-scripts` agent skill uses Playwright + headful Chromium to screenshot a TwistyPlayer instance. This is:
- Slow (~3–5s per image)
- Requires a headed browser on macOS (WebGL blocked in headless Chromium)
- Fragile — depends on TwistyPlayer DOM internals

`CubeRenderer2D` generates SVG cube nets directly as strings — no browser, no WebGL, no Playwright. PNG export uses `OffscreenCanvas` in the browser or `node-canvas` in Node.js.

---

## Scope

### In scope
- SVG cube net generation (standard cross layout: U top, L-F-R-B middle row, D bottom)
- Stickering mask support via `CubeStickering.fromOrbitString()`
- `CubeExporter.toSVG(algOrState, options)` — returns SVG string
- `CubeExporter.toPNG(algOrState, options)` — browser path via `OffscreenCanvas`
- Node.js test script validating SVG output
- Migration path for `cubify-scripts` to use `CubeExporter` directly

### Out of scope
- Isometric 3D SVG projection (future)
- Animated GIF/video export (future)

---

## User Stories

**US-001 — SVG cube net**
`CubeRenderer2D.toSVG(state, { stickering, size, theme })` returns a valid SVG string. Each sticker is a `<rect>` with correct fill colour. Hidden stickers use `--cubify-hidden` value.

**US-002 — CubeExporter.toSVG**
`CubeExporter.toSVG(algOrState, { stickering, setupAlg, size })` resolves input to a `CubeState`, applies stickering, delegates to `CubeRenderer2D`. Works in Node.js (no DOM dependency).

**US-003 — CubeExporter.toPNG (browser)**
`CubeExporter.toPNG(algOrState, options)` renders SVG to `OffscreenCanvas`, returns a `Blob`. Guards on `typeof OffscreenCanvas !== 'undefined'`.

**US-004 — Node.js validation script**
`demo/export-test.mjs` calls `toSVG` for a set of algs and writes output to `/tmp/cubify-test-*.svg`. Validates non-empty, correct sticker count (54 rects).

**US-005 — cubify-scripts migration**
`cubify-scripts/lib/renderer.mjs` updated to call `CubeExporter.toSVG()` or `toPNG()` directly. Playwright + headful browser dependency removed.

---

## SVG Net Layout

```
        [U]
  [L]  [F]  [R]  [B]
        [D]
```

Each face is a 3×3 grid of `<rect>` elements. Sticker size, gap, and colours driven by theme tokens.

---

## setupAlg Resolution

If `setupAlg` provided:
```
displayState = solved.applyAlg(inv(alg)).applyAlg(setupAlg)
```
Matches `experimentalSetupAnchor: 'end'` behaviour from TwistyPlayer.

---

## Acceptance Criteria

- [ ] `node demo/export-test.mjs` produces valid SVG for Sune, T-Perm, solved
- [ ] SVG contains exactly 54 coloured rects for `full` stickering
- [ ] OLL stickering hides correct 36 stickers
- [ ] PNG export returns a Blob in browser
- [ ] `cubify-scripts` no longer requires Playwright for image generation
