# Research — Feature 007 Cube Image Generator

## Decision 1: Visualization architecture should use one persistent TwistyPlayer instance with controlled reconfiguration

- **Decision**: Maintain a single mounted `TwistyPlayer` instance in `CubeViewer` and update configuration on Apply/mode changes instead of remounting per action.
- **Rationale**: Reduces render churn, avoids race conditions during rapid Apply/Capture clicks, and preserves deterministic behavior when switching 2D/3D while keeping existing settings.
- **Alternatives considered**:
  - Recreate player on every Apply: simpler but causes flicker and increases event timing complexity.
  - Separate players for 2D and 3D: avoids mode toggles but duplicates state synchronization and adds bugs.

## Decision 2: Validation model should parse algorithms eagerly and gate Play/Capture

- **Decision**: Validate move algorithm and setup algorithm using `Alg.fromString` (with empty as valid solved state where applicable), surface inline error near algorithm field, and disable Play/Capture when move algorithm is empty/invalid.
- **Rationale**: Directly satisfies FR-013/FR-014 and avoids runtime exceptions from action buttons.
- **Alternatives considered**:
  - Validate only on Apply: delays feedback and allows invalid transient action attempts.
  - Silent fallback to solved state for invalid text: obscures mistakes and violates inline-error requirement.

## Decision 3: Mask precedence should be deterministic: custom mask overrides preset when non-empty

- **Decision**: Compute effective mask with rule: `customMask.trim() !== '' ? customMask : presetMaskValue`.
- **Rationale**: Matches FR-005 and User Story 3 acceptance criteria; easy mental model for advanced users.
- **Alternatives considered**:
  - Always merge preset + custom: ambiguous and hard to debug.
  - Force either/or toggle control: extra UI complexity for little gain.

## Decision 4: Capture strategy should rely on TwistyPlayer screenshot API with mode-specific validation

- **Decision**: Use `experimentalDownloadScreenshot(filename)` as the primary capture path; enforce 3D fixed size through container/player dimensions (288×288) before capture and validate 2D exports by fixed SVG viewBox expectations.
- **Rationale**: Lowest implementation risk with existing cubing.js behavior and fulfills FR-007/FR-008.
- **Alternatives considered**:
  - Manual canvas capture pipeline: more control but significant complexity and maintenance cost.
  - Third-party DOM-to-image libraries: inconsistent quality with WebGL/Shadow DOM content.

## Decision 5: File-size target should be best-effort validation, not blocking logic

- **Decision**: Treat ≤200KB PNG as a target verified in manual checks (SC-008), with optional developer warning if known metadata indicates larger files.
- **Rationale**: Exact byte-size control is constrained by rendering complexity and library internals; blocking capture would degrade UX.
- **Alternatives considered**:
  - Hard-fail captures over threshold: user-hostile and hard to guarantee deterministically.
  - Ignore size entirely: misses explicit feature quality target.

## Decision 6: Keyboard behavior should centralize Enter-to-Apply at form level

- **Decision**: Handle Enter key in control form submit path and call Apply action once, preventing duplicate calls from individual fields.
- **Rationale**: Meets FR-011 while keeping behavior consistent and testable.
- **Alternatives considered**:
  - Per-input keydown handlers: repetitive and prone to inconsistent behavior.
  - Global key listener: can interfere with non-form controls and accessibility.
