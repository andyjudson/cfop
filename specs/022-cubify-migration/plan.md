# Implementation Plan — Feature 022: cubify-migration

## Summary

Replace all direct cubing.js usage in cfop-app with `@andyjudson/cubify` and
`@andyjudson/cubify-react`. Five targeted file changes + one new CSS file. No architectural
restructuring; no new routes or components. Pure replacement of rendering engine and
scramble generator.

---

## Tech Stack

| Layer | Current | Target |
|-------|---------|--------|
| Cube visualisation | `TwistyPlayer` (cubing/twisty) | `<CubePlayer>` (@andyjudson/cubify-react) |
| Scramble state display | `TwistyPlayer` (cubing/twisty) | `<CubeState>` (@andyjudson/cubify-react) |
| Alg parsing | `Alg`, `Move` (cubing/alg) | `AlgParser` (@andyjudson/cubify) |
| Scramble generation | Custom + `Alg.fromString` | `CubeScramble.random()` (@andyjudson/cubify) |
| Shared CSS | Inline styles (CubifyPage) | `src/styles/cubify.css` |

---

## Target File Structure

```
cfop-app/src/
  components/
    VisualizerModal.tsx       <- rewrite (TwistyPlayer -> CubePlayer)
    VisualizerModal.css       <- rename .twisty-container -> .cube-player-container
    ScrambleCubePreview.tsx   <- rewrite (TwistyPlayer -> CubeState, remove px sizing)
    ScrambleCubePreview.css   <- add explicit px to .scramble-cube-canvas
  utils/
    scramble.ts               <- rewrite (CubeScramble.random(), remove Alg import)
    scrambleGenerator.ts      <- DELETE
  styles/
    cubify.css                <- NEW: shared classes for CubifyPage + VisualizerModal
  pages/
    CubifyPage.tsx            <- import cubify.css; replace inline styles with classes
```

---

## Component Designs

### VisualizerModal.tsx

**State:**
```tsx
const [playing, setPlaying]         = useState(false);
const [currentStep, setCurrentStep] = useState(-1); // -1 = start
const [speed, setSpeed]             = useState(1);
const playerRef = useRef<CubePlayerHandle>(null);
```

**Move list:** `useMemo(() => AlgParser.parse(currentAlg.notation), [currentAlg])`

**Event handlers:**
- `onMove`: `setCurrentStep(e.index)`
- `onComplete`: `setPlaying(false); setCurrentStep(moves.length - 1)`
- `onReset`: `setCurrentStep(-1); setPlaying(false)`

**Step controls (imperative, no stepIndex prop):**
```tsx
const handleStepBack = () => {
  const next = Math.max(-1, currentStep - 1);
  playerRef.current?.jumpTo(next);
  setCurrentStep(next);
};
const handleStepForward = () => {
  const next = Math.min(moves.length - 1, currentStep + 1);
  playerRef.current?.jumpTo(next);
  setCurrentStep(next);
};
```

**JSX sketch:**
```tsx
<CubePlayer
  ref={playerRef}
  alg={currentAlg.notation}
  setup={currentAlg.setup ?? ''}
  stickering={mask}
  playing={playing}
  speed={speed}
  onMove={e => setCurrentStep(e.index)}
  onComplete={() => { setPlaying(false); setCurrentStep(moves.length - 1); }}
  onReset={() => { setCurrentStep(-1); setPlaying(false); }}
  style={{ width: '100%', height: '100%' }}
/>
<CubePlayerControls
  playing={playing}
  speed={speed}
  onPlayToggle={() => setPlaying(p => !p)}
  onReset={() => playerRef.current?.reset()}
  onStepBack={handleStepBack}
  onStepForward={handleStepForward}
  stepBackDisabled={currentStep === -1}
  stepForwardDisabled={currentStep === moves.length - 1}
  onCameraReset={() => playerRef.current?.resetCamera()}
  onSpeedChange={setSpeed}
/>
```

**What disappears:**
- All TwistyPlayer lifecycle (initPlayer, cleanupPlayer, retry timer, experimentalModel listeners)
- `Alg`, `Move` imports from `cubing/alg`
- `parseAlgorithmMoves` helper (replaced by `AlgParser.parse`)
- react-icons imports: MdPlayArrow, MdPause, MdReplay, MdAdd, MdRemove, MdFilterCenterFocus
- `SPEED_STEPS` array and `speedIndex` state
- playerRef type changes from `TwistyPlayer | null` to `CubePlayerHandle | null`

**What stays:**
- `fetchSet`, `getGroups`, `handleSetChange`, `handleGroupChange` — data loading unchanged
- `getMask` helper — orbit strings pass through to `stickering` prop without change
- `CaseCarousel` — unchanged
- Keyboard shortcuts (space/Escape handlers) — rewired to `setPlaying`
- All CSS classes and modal structure

**CSS:** Rename `.twisty-container` -> `.cube-player-container` (and its child rule). Height stays 280px desktop, 220px mobile.

---

### ScrambleCubePreview.tsx

**Rewrite:**
```tsx
import { CubeState } from '@andyjudson/cubify-react';

export function ScrambleCubePreview({ scramble, expanded, onToggleExpand }) {
  return (
    <div
      className={`scramble-cube-panel${expanded ? ' scramble-cube-panel--expanded' : ''}`}
      onClick={onToggleExpand} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggleExpand(); } }}
      title={expanded ? 'Collapse cube' : 'Expand cube'}
      aria-label={expanded ? 'Collapse cube view' : 'Expand cube view'}
    >
      <div className={`scramble-cube-canvas${expanded ? ' scramble-cube-canvas--expanded' : ''}`}>
        <CubeState alg={scramble} style={{ width: '100%', height: '100%' }} />
      </div>
      <span className="scramble-cube-hint">
        {expanded ? <MdFullscreenExit size={14} /> : <MdFullscreen size={14} />}
      </span>
    </div>
  );
}
```

**What disappears:** `useEffect`, `useRef`, `TwistyPlayer` import, explicit px math, playerRef

**CSS change in ScrambleCubePreview.css:**
```css
.scramble-cube-canvas {
  width: 120px;
  height: 120px;
  /* existing flex centering stays */
}
.scramble-cube-canvas--expanded {
  width: 200px;
  height: 200px;
}
```

---

### scramble.ts (rewrite)

```typescript
import { CubeScramble } from '@andyjudson/cubify';
import type { ScrambleSource, ScrambleState } from '../types/practice';

export const generateRandom333Scramble = async (
  source: ScrambleSource = 'manual',
): Promise<ScrambleState> => {
  const notation = CubeScramble.random(20);
  return {
    value: notation,
    generatedAtMs: Date.now(),
    source,
  };
};
```

**Removes:** `Alg` import, `assertValidScramble`, `generate333ScrambleWithTimeout` call, `Generate333Result` type import.

---

### scrambleGenerator.ts

**Delete** this file. All types (`Generate333Result`, `Generate333Success`, `Generate333Failure`, `Generate333Options`) are removed with it — no other callers.

---

### src/styles/cubify.css (new)

Shared CSS classes extracted from CubifyPage.tsx inline styles:
- `.cubify-select-row` — flex row for selectors
- `.cubify-theme-btn` / `.cubify-theme-btn.is-active` — theme preset toggle buttons
- `.cubify-speed-row` — speed − ×N.N + row
- `.cubify-speed-label` — tabular-nums speed display

**Import** in `CubifyPage.tsx` and `VisualizerModal.tsx`.

---

### CubifyPage.tsx

- Add `import '../styles/cubify.css'`
- Replace inline select-row div styles with `className="cubify-select-row"`
- Replace inline theme button styles with `className={...cubify-theme-btn...}`
- Replace inline speed row div styles with `className="cubify-speed-row"` / `className="cubify-speed-label"`

---

## Imports Added (cfop-app)

```typescript
// VisualizerModal.tsx
import { CubePlayer, CubePlayerControls } from '@andyjudson/cubify-react';
import type { CubePlayerHandle } from '@andyjudson/cubify-react';
import { AlgParser } from '@andyjudson/cubify';

// ScrambleCubePreview.tsx
import { CubeState } from '@andyjudson/cubify-react';

// scramble.ts
import { CubeScramble } from '@andyjudson/cubify';
```

---

## Imports Removed (cfop-app)

```typescript
// VisualizerModal.tsx
import { Alg, Move } from 'cubing/alg';     // REMOVE
import { TwistyPlayer } from 'cubing/twisty'; // REMOVE

// ScrambleCubePreview.tsx
import { TwistyPlayer } from 'cubing/twisty'; // REMOVE

// scramble.ts
import { Alg } from 'cubing/alg';            // REMOVE
```

---

## Verification

Run after all changes:
```bash
grep -r "from 'cubing" cfop-app/src
```
Expected: no output.

---

## Constitution Check (Post-Design)

| Gate | Status |
|------|--------|
| No backward-compat hacks | pass: clean API replacement, no shims |
| Minimal new code | pass: each file shrinks; VisualizerModal loses ~90 lines of lifecycle code |
| TypeScript throughout | pass: all target files remain .tsx / .ts |
| No new dependencies | pass: uses already-installed @andyjudson/cubify-react |
| Mobile sizing | pass: .scramble-cube-canvas CSS drives size; no px in component |
| Bundle size | pass: cubing.js 3D chunk removed (~500KB gzipped) |
| Tests | pass: no new unit tests needed; Playwright smoke tests serve as acceptance |

---

## Acceptance Criteria Cross-Reference

| Criterion | Covered by |
|-----------|-----------|
| VisualizerModal step-through with play/pause/step/speed/camera reset | VisualizerModal.tsx rewrite |
| ScrambleCubePreview container-driven sizing | ScrambleCubePreview.tsx + CSS |
| scrambleGenerator.ts replaced | scramble.ts + delete scrambleGenerator.ts |
| scramble.ts uses CubeScramble / no Alg import | scramble.ts rewrite |
| VisualizerModal.tsx Alg/Move removed | VisualizerModal.tsx rewrite |
| `grep -r "from 'cubing" src` no output | All files + deletion |
| No IntersectionObserver workaround | TwistyPlayer lifecycle deleted |
| Scramble quality preserved | CubeScramble.random(20): 20 moves, axis exclusion |
| CSS extraction to shared file | src/styles/cubify.css |
| Playwright smoke tests pass | Existing test suite |
| Bundle size reduced | cubing.js 3D removed |
