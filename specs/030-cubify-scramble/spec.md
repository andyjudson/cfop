# Feature 030 — cubify-scramble (Scramble Generator Migration)

## Summary

Migrate the scramble generator in `cfop-app` off `cubing.js` and into `cubify-harness`, eliminating the remaining direct cubing.js dependency from the app.

---

## Motivation

cfop-app currently calls cubing.js directly for scramble generation (`randomScrambleForEvent`). This is one of two remaining cubing.js dependencies after TwistyPlayer is replaced (the other being `Alg`/`Move` parsing, already wrapped in `AlgParser`).

Migrating scrambles to `cubify-harness` completes the decoupling.

---

## Scope

### CubeScramble module

```js
import { CubeScramble } from 'cubify';

const scramble = await CubeScramble.random();      // WCA-standard random state scramble
const moves = CubeScramble.parse(scramble);         // string[] of move tokens
const state = await CubeState.fromAlg(scramble);   // apply scramble to get state
```

### Implementation options (in priority order)

1. **Delegate to cubing.js `randomScrambleForEvent`** — keep cubing.js as internal dep, expose clean API. Lowest risk, simplest migration.
2. **Pure JS random move scramble** — 20-move random state approximation. Not WCA-standard but sufficient for practice use.
3. **Kociemba-based optimal scramble** — requires solver integration (separate future spec).

Option 1 is the right call for this feature — the goal is API decoupling, not reimplementing the scrambler.

---

## Acceptance Criteria

- [ ] `CubeScramble.random()` returns a valid WCA scramble string
- [ ] cfop-app imports `CubeScramble` from cubify, not directly from cubing.js
- [ ] No direct cubing.js imports remain in cfop-app source
