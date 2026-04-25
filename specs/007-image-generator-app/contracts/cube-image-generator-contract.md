# Contract: Cube Image Generator Tool

## Scope
UI/domain contract for `cubify-app` standalone app.

## 1) Control Form Contract

### Inputs
- `setupAlgorithm: string`
- `moveAlgorithm: string`
- `visualizationMode: "3d" | "2d"`
- `anchor: "start" | "end"`
- `presetMask: "default" | "cross" | "f2l" | "oll" | "pll"`
- `customMask: string`

### Behavior
1. Enter key submits form and triggers Apply.
2. Invalid algorithm text shows inline error near corresponding field.
3. Invalid text is preserved for correction (never auto-cleared).
4. Mode switch preserves all non-mode settings and triggers re-render.

## 2) Action Button Contract

### Apply
- **Allowed when**: form is present; move algorithm may be empty (solved state).
- **Effects**:
  - Updates TwistyPlayer render state.
  - Logs original and inverted move algorithm when valid non-empty move algorithm exists.

### Play
- **Allowed when**: `moveAlgorithm` is non-empty and valid.
- **Effects**: Starts animation at configured tempo (~1.5x baseline).

### Capture
- **Allowed when**: `moveAlgorithm` is non-empty and valid.
- **Effects**:
  - 3D mode -> download PNG with filename `cubing-3x3-{timestamp}` and fixed 288×288 target.
  - 2D mode -> download SVG with fixed viewBox output.

## 3) Mask Resolution Contract

`effectiveMask` resolution order:
1. If `customMask.trim()` is non-empty, use custom mask.
2. Else use mask mapped from preset dropdown.

Preset keys and expected semantics:
- `default`
- `cross`
- `f2l`
- `oll`
- `pll`

## 4) TwistyPlayer Rendering Contract

Required configuration baseline:
- `puzzle: "3x3x3"`
- `background: "none"`
- `hintFacelets: "none"`
- `controlPanel: "none"`
- `visualization`: mode-mapped (`PG3D` for 3D, 2D variant for 2D)

## 5) Error/State Contract

- Inline validation errors must be user-visible and non-blocking for text editing.
- Rapid repeated actions must not corrupt render state or block future captures.
- Play/Capture disabled state must reflect current validation instantly.

## 6) Non-Functional Contract

- App must build cleanly with `npm run build`.
- 10 consecutive capture actions must complete without UI freeze.
- 3D PNG output target is ≤200KB for typical captures (quality target, validated manually).

## 7) Standalone Boundary Contract

- `cubify-app` must not require `cfop-app` runtime imports.
- `cubify-app` UI must not include navigation links/buttons into `cfop-app`.
- `cfop-app` must not require runtime links/buttons into `cubify-app` for normal operation.
