# Feature 030 — cubify-scramble (Scramble Generator Migration)

## Summary

Migrate the scramble generator in `cfop-app` off `cubing.js` and into `cubify-harness`, eliminating the remaining direct cubing.js dependency from the app.

---

## Motivation

cfop-app currently calls cubing.js directly for scramble generation (`randomScrambleForEvent`). This is one of two remaining cubing.js dependencies after TwistyPlayer is replaced (the other being `Alg`/`Move` parsing, already wrapped in `AlgParser`).

Migrating scrambles to `cubify-harness` completes the decoupling.

---

## Existing Implementation

`cfop-app/src/utils/scrambleGenerator.ts` is already a custom pure-logic scrambler:
- 20-move output, no consecutive same-face, no opposite-face A-B-A patterns
- Only cubing.js touch: `Alg.fromString` used for validation — easily replaced with `AlgParser.parse()`

This is a migration, not a rewrite.

## Scope

### CubeScramble module

```js
import { CubeScramble } from 'cubify';

const scramble = CubeScramble.random();   // string — 20-move scramble notation
const moves = CubeScramble.parse(scramble); // string[] of move tokens
```

Migration steps:
1. Move `scrambleGenerator.ts` logic into `cubify-harness/src/CubeScramble.js`
2. Replace `Alg.fromString` validation with `AlgParser.parse()` check
3. cfop-app imports from cubify wrapper instead of local util

---

## Acceptance Criteria

- [ ] `CubeScramble.random()` returns consistent quality scrambles (same constraints as current)
- [ ] No cubing.js import in the scramble module
- [ ] cfop-app `scrambleGenerator.ts` replaced by cubify import
- [ ] Existing scramble quality constraints preserved (no same-face, no A-B-A)
