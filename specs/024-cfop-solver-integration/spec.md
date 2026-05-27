# Feature Specification: CFOP Solver Integration — CubifyPage

**Feature Branch**: `024-cfop-solver-integration`
**Created**: 2026-05-27
**Status**: Draft
**Input**: User description: "024 for the cfop solver integration into the cubify page — switch the solve button to use the new cfop solver method, use the info message panel for stage progress, use the masks and stage locked play loops"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Stage-by-stage CFOP Solve Playback (Priority: P1)

A user scrambles the cube and presses Solve. Instead of a single flat solution, the cube enters CFOP solve mode: each of the 7 stages (cross, F2L front-right, F2L front-left, F2L back-left, F2L back-right, OLL, PLL) loads individually. The cube shows the correct pre-stage state — scrambled with all prior stages already applied — and waits for the user to press play before animating. After each stage finishes, the next loads automatically, again waiting for play. Stages with no algorithm (sub-step already solved) are skipped without user interaction.

**Why this priority**: This is the core feature — without stage-by-stage playback the integration delivers no new value over the existing flat solve.

**Independent Test**: Can be fully tested by scrambling the cube, pressing Solve, and stepping through each stage manually; the cube must start from the correct position at each stage and end fully solved after all stages complete.

**Acceptance Scenarios**:

1. **Given** a scrambled cube with scramble animation complete, **When** the user presses Solve, **Then** the solver computes a CFOP solution and loads stage 1 (cross) with the cube showing the scrambled+z2 starting state, paused and ready to play.
2. **Given** a CFOP stage is loaded and paused, **When** the user presses play, **Then** the stage algorithm animates from the correct pre-stage position.
3. **Given** a stage animation completes, **When** the completion event fires, **Then** the next stage loads automatically, the cube advances to the post-previous-stage position, and playback pauses awaiting user input.
4. **Given** a stage has no algorithm (sub-step already solved), **When** that stage is reached, **Then** it is skipped automatically and the next stage loads without requiring user interaction.
5. **Given** all 7 stages have played, **When** the final stage completes, **Then** the cube is in the fully solved state.

---

### User Story 2 - Stage Progress in the Info Panel (Priority: P2)

While in CFOP solve mode, the notification panel below the cube shows the current stage context — the stage label (e.g., "cross", "oll"), the algorithm being played, and where available the case name and WCA ID (e.g., "T-Perm #21" for PLL). This keeps the user oriented throughout the multi-stage sequence without cluttering the cube or controls.

**Why this priority**: Stage context is necessary for learning value — knowing which step is playing and which case it is turns the visualisation into a teaching tool rather than just an animation.

**Independent Test**: Can be tested independently by verifying the info panel text updates correctly at each stage transition and matches the stage's label and algorithm.

**Acceptance Scenarios**:

1. **Given** the solver is computing, **When** the user is waiting, **Then** the info panel reads "Solving… CFOP method".
2. **Given** a stage is loaded and ready to play, **When** the stage has a non-empty algorithm, **Then** the info panel shows the stage label, algorithm, and a prompt to press play (e.g., "cross: F' L F L' — press play to simulate stage").
3. **Given** an OLL or PLL stage, **When** the stage has a recognised case, **Then** the info panel includes the case name and WCA ID alongside the algorithm.
4. **Given** all stages are complete, **When** the final stage finishes, **Then** the info panel shows a "Solved!" summary.

---

### User Story 3 - Existing Controls Work in CFOP Mode (Priority: P3)

Speed adjustment, step-forward, step-backward, and reset controls all function correctly within CFOP solve mode. Speed changes apply to the current and subsequent stages. Reset returns the cube to the start of the current stage. The scramble button is available to start a new solve at any point after the current solve completes.

**Why this priority**: Control continuity avoids regressions and makes CFOP mode feel integrated rather than bolted on.

**Independent Test**: Can be tested by entering CFOP solve mode and exercising each control in turn.

**Acceptance Scenarios**:

1. **Given** CFOP solve mode is active, **When** the user adjusts speed, **Then** the current stage and all subsequent stages animate at the new speed.
2. **Given** a stage is playing, **When** the user presses step-backward, **Then** the animation steps back within that stage's algorithm.
3. **Given** a stage is playing or paused, **When** the user presses reset, **Then** the cube returns to the start of the current stage.

---

### Edge Cases

- What happens when the solver times out or fails to find a solution? → A user-readable error message appears in the info panel; the cube stays in its scrambled state.
- What happens if the user presses Scramble during a CFOP solve sequence? → The solve mode is cancelled, scramble mode starts normally.
- What happens if multiple consecutive stages have empty algorithms? → Each is skipped in sequence without requiring any user input.
- What happens when the user navigates away from CFOP solve mode mid-sequence (e.g., selects a case from the dropdown)? → The solve state resets and the selected case loads normally.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Solve button MUST trigger a CFOP-method solve, replacing the previous Kociemba 2-phase single-alg solve.
- **FR-002**: The solver MUST return a solution with exactly 7 stages: cross, f2l-fr, f2l-fl, f2l-bl, f2l-br, oll, pll.
- **FR-003**: Each stage MUST load individually into the cube player, paused at the start position, without auto-playing.
- **FR-004**: The cube player MUST show the correct pre-stage starting position (scramble + orientation + all prior stage algorithms applied) at the beginning of each stage.
- **FR-005**: Each stage MUST apply the stickering mask provided by the solver for that stage, highlighting the target pieces wherever they currently are on the cube.
- **FR-006**: Stages with an empty algorithm MUST be skipped automatically without requiring user interaction.
- **FR-007**: The info panel MUST display stage progress: stage label, algorithm, and (for OLL/PLL) case name and WCA ID where available.
- **FR-008**: The info panel MUST prompt the user to press play when a stage is loaded and waiting.
- **FR-009**: The Solve button MUST remain disabled until a scramble animation has fully completed (existing behaviour preserved).
- **FR-010**: Speed, step-forward, step-backward, and reset controls MUST operate correctly within CFOP solve mode.
- **FR-011**: Starting a new scramble at any point MUST cancel any in-progress CFOP solve and reset to scramble mode.
- **FR-012**: The solve button tooltip MUST reflect the CFOP method.

### Key Entities

- **SolveStage**: One of 7 labelled steps in the CFOP solution — carries label, algorithm string, stickering mask string, move count, optional case name, and optional WCA ID.
- **CfopSolution**: The full 7-stage result from the solver, including total move count and a setup rotation string (z2) needed to orient the cube into the solver's working frame.
- **AccumulatedSetup**: The cumulative algorithm string (scramble alg + orientation rotation + all prior stage algs) that positions the cube correctly at the start of each stage for the player.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The user can identify which CFOP stage is currently active at every point during solve playback.
- **SC-002**: The cube shows the correct pre-stage position at the start of every stage animation, matching the expected cube state after all preceding steps.
- **SC-003**: Stickering correctly highlights target pieces for each stage type — cross edges for cross, corner+edge pair for each F2L slot, U-face + side stickers for OLL, top-layer pieces for PLL.
- **SC-004**: The full 7-stage solve sequence leaves the cube visually and logically in the solved state.
- **SC-005**: Empty stages (sub-steps already solved) are bypassed without any user gesture required.
- **SC-006**: The solve button responds within 5 seconds for any valid scrambled cube state.

## Assumptions

- The CFOP solver is available as a library export from `@andyjudson/cubify` v1.3.10+; no solver logic is implemented within cfop-app.
- Stickering masks (dynamic orbit strings) are provided per-stage by the solver; cfop-app consumes them without defining its own mask logic.
- The existing `<CubePlayer>` React component's prop-driven interface (alg, setup, stickering, playing, onComplete) is sufficient to drive stage-by-stage playback without changes to the library.
- The Kociemba single-alg solve mode is removed; CFOP becomes the sole solve method on the CubifyPage.
- The solver applies a z2 rotation internally; cfop-app is responsible for prepending z2 to the accumulated setup so the cube renders in the correct orientation throughout playback.
- Mobile and accessibility requirements are out of scope for this feature; existing behaviour is preserved.
