# Data Model — Feature 007 Cube Image Generator

## Entity: VisualizationConfig

Represents full user-configurable state used to render the cube.

### Fields
- `setupAlgorithm: string`
- `moveAlgorithm: string`
- `visualizationMode: "3d" | "2d"`
- `anchor: "start" | "end"`
- `presetMask: "default" | "cross" | "f2l" | "oll" | "pll"`
- `customMask: string`
- `effectiveMask: string` (computed)

### Validation Rules
- `moveAlgorithm` may be empty for display but is required valid for Play/Capture enablement.
- Non-empty algorithm fields must parse via `Alg.fromString`.
- `effectiveMask = customMask.trim() !== "" ? customMask : preset mask value`.
- Mode switch must preserve all other fields.

---

## Entity: ValidationState

Captures current validation outcomes and UI-gating flags.

### Fields
- `moveAlgorithmError: string | null`
- `setupAlgorithmError: string | null`
- `isMoveAlgorithmValid: boolean`
- `isSetupAlgorithmValid: boolean`
- `canApply: boolean`
- `canPlay: boolean`
- `canCapture: boolean`

### Validation Rules
- Invalid move algorithm shows inline error and preserves input text.
- `canPlay` and `canCapture` must be `false` when move algorithm is empty/invalid.
- `canApply` remains `true` for solvable states including empty move algorithm.

---

## Entity: CaptureRequest

Represents one capture action and expected output constraints.

### Fields
- `requestedAtMs: number`
- `filenameBase: string` (`cubing-3x3-{timestamp}`)
- `mode: "3d" | "2d"`
- `targetWidthPx: number` (3D => 288)
- `targetHeightPx: number` (3D => 288)
- `expectedFormat: "png" | "svg"`

### Validation Rules
- 3D requests must render with fixed 288×288 capture dimensions.
- 2D requests must export SVG with fixed viewBox.
- Capture action must not execute when `canCapture` is false.

---

## Entity: AlgorithmLogEntry

Tracks developer log output produced on Apply.

### Fields
- `originalAlgorithm: string`
- `invertedAlgorithm: string`
- `loggedAtMs: number`

### Validation Rules
- Apply with valid move algorithm logs both original and inverted notation.
- Invalid input must not emit misleading inversion logs.

---

## Relationship Summary

- One `VisualizationConfig` determines one effective render state in `CubeViewer`.
- One valid Apply action may emit one `AlgorithmLogEntry`.
- One valid Capture click creates one `CaptureRequest` and triggers one download.
- `ValidationState` governs action enablement (`Apply`, `Play`, `Capture`) for the current `VisualizationConfig`.
