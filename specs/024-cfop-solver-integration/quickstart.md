# Quickstart / Integration Scenarios: CFOP Solver Integration

## Scenario 1 — Happy path: full 7-stage solve

**Setup**: Start on CubifyPage with a fresh session.

1. Press Scramble → wait for scramble animation to complete (`scrambleDone = true`)
2. Press Solve → info panel shows "Solving… CFOP method"
3. Solver returns → info panel shows cross stage info + "press play to simulate stage"
4. Press play → cross alg animates from scrambled+z2 position; move tape shows cross moves
5. Animation completes → next stage (first non-empty F2L) loads automatically, paused
6. Repeat press-play cycle for each of the 7 stages
7. After final stage completes → info panel shows "Solved! N moves"
8. Cube is visually in the solved state

**Verify**:
- Each stage starts at the correct pre-stage position (not reset to solved)
- Move tape shows only the current stage's moves
- Stickering mask changes per stage (cross edges highlighted, then F2L pair, then OLL face, then PLL top layer)
- Stage label + case info visible in info panel throughout

## Scenario 2 — Empty stage skip

**Setup**: Use a scramble where the cross is already solved in z2 orientation, OR observe that OLL is already solved (skip case).

1. Complete scramble
2. Press Solve
3. If a stage has empty alg (e.g., cross already done) → it is skipped without user input; next non-empty stage loads
4. No stuck state, no user action required to advance past the empty stage

**Verify**: Stage index increments through empties without pause; info panel doesn't show a "press play" prompt for skipped stages.

## Scenario 3 — Cancel mid-solve by scrambling again

1. Complete scramble, press Solve, step through 2 stages
2. Press Scramble (available once playing stops between stages)
3. Mode resets to 'scramble'; new scramble loads and animates
4. CFOP state is cleared; Solve button requires new scramble to complete before re-enabling

## Scenario 4 — Speed change during CFOP playback

1. Start a CFOP solve, begin playing stage 1
2. Adjust speed mid-animation
3. Current stage respects new speed immediately
4. Subsequent stages also use new speed

## Scenario 5 — Step backward within a stage

1. Start a CFOP solve, begin playing stage 1
2. Press step-backward during animation
3. Animation steps back within that stage's alg (not to a previous stage)

## Scenario 6 — Solver error / timeout

1. (Force timeout by setting a very short `timeoutMs` in dev, or use a known hard scramble)
2. Press Solve → "Solving… CFOP method" shows
3. Solver times out → error logged to console; info panel clears (or shows error)
4. Cube remains in scrambled state; Solve button becomes re-available (isSolving → false)
