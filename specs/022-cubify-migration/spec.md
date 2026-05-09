# Feature 022 — cubify-migration (cfop-app adopts cubify)

## Summary

Full adoption of cubify in `cfop-app`: scramble generation, alg parsing, and 3D visualisation. Replaces TwistyPlayer and all direct cubing.js imports. Removes IntersectionObserver workarounds, shadow DOM constraints, and explicit px dimension hacks.

This feature absorbs what was previously split between Feature 030 (decouple) and Feature 031 (migration) — they are one coherent delivery.

---

## Clarifications

### Session 2026-05-08

- Q: What controls should VisualizerModal expose for the embedded `<CubePlayer>`? → A: Play/pause, step back/forward, speed, and camera reset — no theme or stickering controls.
- Q: How should `<CubeState>` be sized in ScrambleCubePreview once explicit px dimensions are removed? → A: Container-driven — `<CubeState>` fills its parent; parent CSS controls the size.
- Q: Where should shared cubify CSS classes live? → A: New `src/styles/cubify.css` — dedicated file imported where needed.
- Q: Should `scrambleGenerator.ts` keep its custom logic (replace only `Alg.fromString`) or replace entirely with `CubeScramble.random()`? → A: Replace entirely with `CubeScramble.random()`. `CubeScramble.random()` already applies equivalent constraints (no same-face) plus a stricter axis-exclusion rule that supersedes the A-B-A check. Uniform-state scrambling (WCA-grade) is out of scope — random-move with axis exclusion is sufficient for practice.
- Q: Is Feature 029 (React wrappers) complete and are there any remaining blockers before 022 can start? → A: 029 complete, no blockers — ready to plan.

---

## Motivation

cfop-app currently uses:
- `randomScrambleForEvent` (cubing.js) for scramble generation
- `Alg`/`Move` (cubing.js) for alg validation and parsing in several files
- `TwistyPlayer` (cubing.js) for step-through visualisation in VisualizerModal
- `TwistyPlayer` for scramble state display in ScrambleCubePreview

All of these can be replaced with cubify equivalents now that the library API (028), scramble generator (028), and React wrapper (029) are complete. The result is a single clean dependency: `cubify`.

---

## Migration Targets

| Component | Current | Target |
|-----------|---------|--------|
| `VisualizerModal` | TwistyPlayer + `experimentalModel` | `<CubePlayer>` (Feature 029) |
| `ScrambleCubePreview` | TwistyPlayer, explicit px dimensions | `<CubeState>` (Feature 029) |
| `scrambleGenerator.ts` | Custom scrambler + `Alg.fromString` validation | `CubeScramble.random()` |
| `scramble.ts` | `Alg` from cubing/alg | `AlgParser.parse()` |
| `VisualizerModal.tsx` imports | `Alg`, `Move` from cubing/alg | `AlgParser.parse()` |

---

## What Goes Away

- `TwistyPlayer` dependency and its cubing.js 3D chunk (~500KB gzipped)
- `IntersectionObserver` height workarounds in VisualizerModal
- `useEffect` timing hacks for TwistyPlayer initialisation
- `experimentalModel` API access for step tracking
- All direct `import ... from 'cubing/...'` in cfop-app source
- Explicit `width`/`height` px constraints on cube containers

What stays: `cubify` keeps cubing.js internally for `KPattern` move application — that dependency never surfaces in cfop-app.

---

## Scramble Generator Notes

`cfop-app/src/utils/scrambleGenerator.ts` is a custom pure-logic scrambler (20 moves, no same-face, no A-B-A). It will be replaced entirely by `CubeScramble.random()`.

`CubeScramble.random()` applies equivalent constraints plus a stricter axis-exclusion rule: if the last two moves were on opposite faces of the same axis (e.g. U then D), the entire axis is excluded for the next move — this supersedes the simpler A-B-A check and produces marginally better sequences. Default length is 20 moves.

The only quality gap vs WCA is random-state scrambling (`tnoodle` generates a random cube position then solves it, guaranteeing uniform distribution over all states). That requires a solver and is out of scope — random-move with axis exclusion is sufficient for practice.

---

## Prerequisites

- Feature 028 (library API) ✅ — `CubeScramble`, `AlgParser`, full public API
- Feature 029 (React wrapper) ✅ — `<CubePlayer>`, `<CubeState>` components shipped as `@andyjudson/cubify-react` v1.0.0

---

## CSS / Styling

`CubifyPage.tsx` currently uses heavy inline styles throughout — selector widths, theme button styles, speed control buttons, layout gaps. These should be extracted to shared CSS classes before `VisualizerModal` embeds `<CubePlayer>`, so both the page and the modal share the same look without duplicating inline rules.

Candidate classes: `.cubify-select-row`, `.cubify-theme-btn`, `.cubify-transport-btn`, `.cubify-speed-row`. The speed controls in particular (rendered inline in `CubifyPage` after being split out of `<CubePlayerControls>`) are an obvious candidate for a reusable pattern.

Shared styles live in `src/styles/cubify.css` — imported by `CubifyPage` and `VisualizerModal`. Not CSS modules (shared across components).

---

## Acceptance Criteria

- [ ] `VisualizerModal` renders step-through cube using `<CubePlayer>`; play/pause, step back/forward, speed, and camera reset controls work; no theme or stickering controls
- [ ] `ScrambleCubePreview` renders scramble state using `<CubeState>` — sized by parent container, no explicit px dimensions
- [ ] `scrambleGenerator.ts` replaced entirely with `CubeScramble.random()` — custom logic removed, no cubing.js `Alg` import
- [ ] `scramble.ts` uses `AlgParser.parse()` — no cubing.js `Alg` import
- [ ] `VisualizerModal.tsx` — `Alg`/`Move` imports removed
- [ ] `grep -r "from 'cubing" cfop-app/src` returns no matches
- [ ] No `IntersectionObserver` workaround in any component
- [ ] Scramble quality preserved: 20 moves, no same-face, axis-exclusion applied (equivalent to A-B-A prevention, strictly better)
- [ ] `CubifyPage.tsx` inline styles extracted to shared CSS classes; modal reuses same classes
- [ ] Existing Playwright smoke tests pass
- [ ] Production bundle size reduced (cubing.js 3D chunk removed)
