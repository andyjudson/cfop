# Feature Specification: Fallback Scramble Generator (Non-Official)

**Feature Branch**: `[006-fallback-scramble-generator]`  
**Created**: 2026-03-08  
**Status**: Draft  
**Input**: User description: "Create feature 006 as a fallback/replacement for scramble generation from cubing.js, while still plugging generated scramble strings into cubing.js-compatible parsing/visualization paths."

## Clarifications

### Session 2026-03-08

- Q: If scramble generation fails at runtime, what should the practice modal do with the scramble display? → A: Keep last valid scramble visible and show an inline error message
- Q: Should scramble length be fixed or configurable for v1? → A: Fixed length 20 only (v1)
- Q: For rapid repeated New Scramble clicks, which result should the UI keep if requests overlap? → A: Last-click-wins; only latest request may update UI
- Q: How should “practice-grade, not official WCA” be communicated in the UI? → A: No UI text; docs/spec only
- Q: What timeout target should we set for scramble generation before treating it as a failure path? → A: 1000ms timeout

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Practice Scramble Works in Production (Priority: P1)

As a learner using the deployed app, I want a new scramble to generate every time without hanging so I can practice reliably in production.

**Why this priority**: Current production blocker is scramble generation availability.

**Independent Test**: Open practice modal on deployed site, click `New Scramble` repeatedly, confirm each request returns quickly and timer flow remains usable.

**Acceptance Scenarios**:

1. **Given** practice modal is open, **When** user requests a scramble, **Then** the app returns a valid scramble string without depending on `cubing/scramble` workers.
2. **Given** user requests multiple scrambles, **When** each request completes, **Then** each scramble is non-empty and parseable.

---

### User Story 2 - Generated Scramble Is Cubing.js-Compatible (Priority: P2)

As a developer, I want generated scramble notation to be consumable by cubing.js APIs so the same string can be used for parsing and optional visualization.

**Why this priority**: Compatibility avoids dual formats and enables future visualization/debug reuse.

**Independent Test**: Validate generated string with `Alg.fromString` and pass it into a TwistyPlayer-compatible path without format conversion.

**Acceptance Scenarios**:

1. **Given** a generated scramble string, **When** parsed with `Alg.fromString`, **Then** parsing succeeds.
2. **Given** a generated scramble string, **When** attached to a visualization flow, **Then** no notation-format errors occur.

---

### User Story 3 - Build Config Is Simplified After Migration (Priority: P3)

As a maintainer, I want obsolete worker-specific Vite workarounds removed once fallback generation is active so build config stays minimal and understandable.

**Why this priority**: Reduces technical debt and removes misleading config tied to retired runtime paths.

**Independent Test**: Remove imports of `cubing/scramble` and `cubing/search`, simplify Vite config, verify dev/build/deploy continue to pass.

**Acceptance Scenarios**:

1. **Given** fallback generator is active, **When** app builds for production, **Then** build succeeds without worker workaround plugins for scramble generation.
2. **Given** simplified Vite config, **When** practice modal is used, **Then** scramble generation remains stable in dev and production.

---

### Edge Cases

- Rapid repeated `New Scramble` clicks MUST use last-click-wins behavior so only the most recent request may update UI state.
- Generated scramble must not include empty tokens or invalid symbols.
- Generator should avoid immediate inverse/cancel patterns (e.g., `R R'`) and repeated same-face turns.
- If generation fails unexpectedly, practice modal should keep the last valid scramble visible, show inline error text, and remain usable.
- If scramble generation exceeds 1000ms, the request should be treated as failed and follow the standard failure path.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a client-side 3x3 scramble generator that does not depend on `cubing/scramble`.
- **FR-002**: The generator MUST return standard move-notation strings parseable by `Alg.fromString`.
- **FR-003**: The generator MUST produce non-empty scramble strings with a fixed length of 20 moves for v1.
- **FR-004**: The generator MUST avoid immediate move cancellation and same-face repetition in consecutive moves.
- **FR-005**: The practice modal MUST use the fallback generator for scramble requests in both development and production builds.
- **FR-006**: The app MUST preserve existing timer, solve stats, modal UX behavior, and scramble-protection-during-active-timer after migration (users cannot request new scramble while timer is running).
- **FR-007**: The app MUST keep generated scramble output compatible with cubing.js parsing APIs; visualization/rendering compatibility is optional for v1 (may be deferred to Feature 007 imggen-app tool).
- **FR-008**: Once runtime dependence on `cubing/scramble`/`cubing/search` is removed, Vite worker workaround configuration MUST be removed or reduced to only still-needed settings.
- **FR-009**: Build and deployment pipelines MUST pass after configuration cleanup.
- **FR-010**: The feature MUST clearly communicate that generated scrambles are practice-grade and not official WCA competition scrambles.
- **FR-011**: On generation failure, the practice modal MUST preserve the last valid scramble text and display an inline error message without blocking timer controls.
- **FR-012**: For overlapping scramble requests, the practice modal MUST enforce last-click-wins semantics so stale earlier responses cannot overwrite newer scramble state.
- **FR-013**: Communication that scrambles are practice-grade (not official WCA) MUST be documented in project/spec documentation and does not require additional in-modal UI text in v1.
- **FR-014**: Scramble generation requests MUST use a 1000ms timeout; timed-out requests MUST be handled as failures using the same inline error and last-valid-scramble behavior.

### Key Entities *(include if feature involves data)*

- **Practice Scramble**: A generated 3x3 move sequence used for timer practice.
- **Scramble Generation Rules**: Constraints that enforce notation validity and basic quality guardrails.
- **Generation Result**: Scramble text plus metadata (`generatedAtMs`, source) used by existing modal state.

### Assumptions

- Scope is 3x3 practice mode only.
- Official-WCA equivalence is out of scope.
- Existing practice timer and stats architecture remain unchanged.
- Scramble-length configurability is out of scope for v1.

## Scramble Generation Rules *(technical specification)*

### Move Notation

- **Faces**: U (Up), D (Down), L (Left), R (Right), F (Front), B (Back)
- **Modifiers**: 
  - None (clockwise 90°)
  - `'` (counterclockwise 90°)
  - `2` (180°)
- **Out of Scope**: Wide moves (Uw, Dw, etc.), slice moves (M, E, S), rotations (x, y, z)

### Generation Parameters

- **Fixed Length**: 20 moves per scramble
- **Selection Method**: Random face selection with random modifier selection for each move

### Quality Constraints

The generator MUST enforce the following constraints to produce reasonable practice scrambles:

1. **No Same-Face Repetition**: Two consecutive moves must not affect the same face
   - Invalid: `R R'`, `U U2`, `F F`
   - Valid: `R U`, `L F'`, `D2 B`

2. **No Opposite-Face Repetition Patterns**: Three consecutive moves must not follow the pattern A-B-A where A and B are opposite faces
   - Opposite face pairs: U↔D, L↔R, F↔B
   - Invalid: `R L R`, `U D U2`, `F B F'`
   - Valid: `R L U`, `F R F`, `U R U'`

3. **Minimal Redundancy**: While not enforcing WCA-level random-state requirements, the generator should avoid obvious move cancellations and inefficient patterns

### Rationale

These rules balance simplicity with scramble quality:
- Fixed 20-move length is shorter than official WCA (~19-21 for random-state) but sufficient for practice
- Same-face constraint prevents immediate cancellations (e.g., `R R'` = no-op)
- Opposite-face pattern constraint reduces predictable subsequences without complex state tracking
- No slice/wide moves simplifies implementation while maintaining full cube coverage

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In production manual validation, 100% of at least 50 consecutive scramble requests return a parseable notation string.
- **SC-002**: Practice modal no longer hangs in a persistent `Generating...` state; `isGenerating` flag clears within 1000ms of request initiation.
- **SC-003**: `npm run build` and deployed smoke test both pass with fallback generator enabled.
- **SC-004**: After migration, Vite config no longer includes scramble-worker workaround logic that is not actively needed.
- **SC-005**: No regressions are observed in timer controls, solve recording, or stats display during manual regression checks.
- **SC-006**: During manual failure-path testing, the modal retains the previous scramble and displays inline error feedback instead of clearing scramble text.
- **SC-007**: In rapid-click testing (10+ quick requests), the final displayed scramble corresponds to the latest user request with no stale overwrite.
- **SC-008**: When scramble generation is artificially delayed beyond 1000ms in testing, the modal exits loading state and shows failure feedback without freezing controls.
