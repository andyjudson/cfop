# Research — Feature 022: cubify-migration

## Overview

Research phase for replacing TwistyPlayer / cubing.js direct imports in cfop-app with
`@andyjudson/cubify` and `@andyjudson/cubify-react`. All questions resolved against
published package source.

---

## Decision 1 — AlgParser.parse() return type

**Decision:** `AlgParser.parse(notation: string)` returns `string[]` — one token per move.

**Rationale:** Direct drop-in for `parseAlgorithmMoves()` in VisualizerModal. That function
iterates `alg.experimentalLeafMoves()` to build a `string[]`; AlgParser does the same thing
without cubing.js. The `move` tape and step-index tracking both work against `string[]`.

**Alternatives considered:** Keeping a cubing.js-based parser — rejected because the whole
point of the migration is removing cubing.js surface area from cfop-app.

---

## Decision 2 — CubePlayer step back/forward

**Decision:** Use `playerRef.current?.jumpTo(n)` (CubePlayerHandle) directly from step
buttons. Track current position via `onMove` events. Do not use the `stepIndex` prop.

**Rationale:** The `stepIndex` prop fires `jumpTo` on every change. If we also receive
`onMove` events that update `stepIndex` state, we'd create a feedback loop
(state → prop → engine → event → state). Calling `jumpTo` imperatively from the handle
avoids this. `onMove` events remain the authoritative source for position display.

**stepIndex arithmetic:**
- Step back: `Math.max(-1, currentStep - 1)` then `jumpTo(result)`
- Step forward: `Math.min(moves.length - 1, currentStep + 1)` then `jumpTo(result)`
- `currentStep = -1` means "at start" (before any moves)
- Disabled guards: step back when `currentStep === -1`; step forward when `currentStep === moves.length - 1`

**Alternatives considered:** `stepIndex` prop — rejected due to feedback loop risk.

---

## Decision 3 — Speed range

**Decision:** Use `CubePlayerControls` native speed range: `0.5–3`, step `0.5`.

**Rationale:** VisualizerModal currently uses `SPEED_STEPS = [0.5,1,1.5,2,3,4,6]`, reaching
up to ×6. `CubePlayerControls` caps at 3 (matching the `CubePlayer` engine's supported
range). Dropping ×4 and ×6 is an acceptable quality tradeoff — they were rarely used and ×3
is already very fast for CFOP practice.

**Alternatives considered:** Custom speed buttons to keep ×6 — rejected; CubePlayerControls
covers the practical range and avoids duplicating speed UI logic.

---

## Decision 4 — Stickering compatibility

**Decision:** `getMask()` in VisualizerModal returns orbit strings (e.g.
`'EDGES:----OOOO----,CORNERS:----OOOO,CENTERS:------'`). Pass directly to `stickering` prop
on `<CubePlayer>`. No translation needed.

**Rationale:** `CubePlayer.setStickering(str)` delegates to `CubeStickering.fromOrbitString(str)`,
which accepts the same orbit string format. The existing `getMask()` function's output is
already in this format.

**Alternatives considered:** Replacing `getMask()` with MASK_PRESETS labels — deferred; the
orbit strings are already correct and a label mapping would require verifying exact
equivalence for each oll/pll variant.

---

## Decision 5 — ScrambleCubePreview sizing

**Decision:** Remove explicit px from `scramble-cube-canvas` div. Pass `style={{ width: '100%', height: '100%' }}`
to `<CubeState>`. Let `.scramble-cube-canvas` CSS control dimensions.

**Rationale:** Current code sets `player.style.width/height = ${size}px` from an `expanded`
boolean (120px / 200px). Container-driven sizing aligns with the clarified requirement and
removes the cubing.js lifecycle re-init on expand toggle.

**CSS change required:** `.scramble-cube-canvas` in `ScrambleCubePreview.css` needs explicit
dimensions. Default: `width: 120px; height: 120px`. Expanded: `.scramble-cube-panel--expanded .scramble-cube-canvas { width: 200px; height: 200px }`.

**Alternatives considered:** Keep explicit px via inline style on `<CubeState>` — rejected;
spec requires container-driven sizing, and the class approach is cleaner.

---

## Decision 6 — scrambleGenerator.ts replacement

**Decision:** Delete `scrambleGenerator.ts` entirely. Rewrite `scramble.ts` to call
`CubeScramble.random(20)` directly. Remove the `Generate333Result` union type machinery.

**Rationale:** `Generate333Result` is only used in `scramble.ts` (imports `generate333ScrambleWithTimeout`
and `Generate333Result`). No other file references these types. `CubeScramble.random()` is
synchronous and always returns valid notation — the async wrapper, timeout promise, and
`Alg.fromString` validation step all become dead code. Removing both files and replacing
with a direct call is cleaner than shimming the old API shape.

**Interface preserved:** `generateRandom333Scramble` export in `scramble.ts` stays. Return
type `ScrambleState` is unchanged. All callers are unaffected.

**Alternatives considered:** Keep `scrambleGenerator.ts` as a thin wrapper around
`CubeScramble.random()` — rejected; it leaves dead type machinery and an unnecessary async
layer around a synchronous call.

---

## Decision 7 — scramble.ts assertValidScramble

**Decision:** Remove `assertValidScramble` (and its `Alg` import from `cubing/alg`) from
`scramble.ts`. `CubeScramble.random()` output is always valid WCA notation — the validation
is redundant.

**Rationale:** `CubeScramble.random()` generates moves from a fixed `FACES × SUFFIXES`
product — every token is valid WCA notation. The Alg.fromString check exists only to catch
invalid tokens from the old custom generator. With CubeScramble this cannot fail.

---

## Decision 8 — CSS extraction to src/styles/cubify.css

**Decision:** Create `cfop-app/src/styles/cubify.css`. Extract candidate classes from
`CubifyPage.tsx` inline styles: `.cubify-select-row`, `.cubify-theme-btn`,
`.cubify-transport-btn`, `.cubify-speed-row`. Import in both `CubifyPage.tsx` and
`VisualizerModal.tsx`.

**Rationale:** CubifyPage currently uses heavy inline styles. Once VisualizerModal embeds
`<CubePlayer>` with similar transport controls, the same visual language is needed in both
places. Shared classes prevent duplication.

**Scope guard:** Only extract patterns that are actually reused between CubifyPage and
VisualizerModal. CubifyPage-only styles stay inline. VisualizerModal-only styles stay in
`VisualizerModal.css`.

**Alternatives considered:** CSS modules — rejected per clarification (shared across
components, not scoped).

---

## Decision 9 — VisualizerModal controls wiring

**Decision:** Use `<CubePlayerControls>` directly in VisualizerModal JSX with all five
handler props: `onPlayToggle`, `onReset`, `onStepBack`, `onStepForward`, `onCameraReset`,
`onSpeedChange`. Keep existing `.controls-panel` / `.control-buttons` CSS wrapper for
layout.

**Rationale:** CubePlayerControls renders the exact button set specified in the clarification
(play/pause, step back/forward, speed, camera reset). Its inline button styles match the
visual language of the harness. Wrapping it in the existing `.controls-panel` div preserves
modal layout.

**What disappears:** `MdPlayArrow`, `MdPause`, `MdReplay`, `MdAdd`, `MdRemove`,
`MdFilterCenterFocus` react-icons imports in VisualizerModal (replaced by CubePlayerControls
internals).

---

## Constitution Check

| Principle | Status |
|-----------|--------|
| Educational focus | ✅ Step-through visualisation and scramble display serve CFOP learning |
| Minimal dependencies | ✅ Removes cubing.js direct surface; single cubify dependency |
| TypeScript | ✅ All files remain TypeScript; cubify exports full types |
| Performance | ✅ Removes ~500KB cubing.js 3D chunk from bundle |
| Web standards / React best practices | ✅ Controlled components, ref-based imperative API |
| Mobile / accessibility | ✅ Container-driven cube sizes, keyboard controls preserved |
