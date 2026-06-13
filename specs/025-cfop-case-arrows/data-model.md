# Data Model: BGR Case Arrows

**Feature**: 025-cfop-case-arrows  
**Created**: 2026-06-13

## Entities

### Arrow

A single directed arc drawn on a case image, from a source position to a target position, with an optional quadratic Bézier control point for curvature.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `from` | `[number, number]` | Yes | Start point `[x, y]` in 288×224 SVG coordinate space |
| `to` | `[number, number]` | Yes | End point `[x, y]` in 288×224 SVG coordinate space |
| `cp` | `[number, number]` | No | Quadratic Bézier control point; omit for straight arrow |

**Constraints**:
- All coordinates must be within `0 ≤ x ≤ 288`, `0 ≤ y ≤ 224`
- `from` and `to` must differ (zero-length arrows are invalid)
- Coordinate space origin is top-left of the PNG image

### CaseArrows

An ordered list of `Arrow` objects for a single algorithm case.

| Field | Type | Description |
|-------|------|-------------|
| Case ID key | `string` | Matches `CfopAlgorithm.id` from cfop-bgr.json |
| Value | `Arrow[]` | One or more arrows for this case |

**Constraints**:
- Case IDs must exactly match the `id` field in `cfop-bgr.json`
- An absent key means no arrows are defined for that case (renders normally — FR-011)
- An empty array `[]` is semantically equivalent to an absent key

### BGR_ARROWS

The complete static lookup map of all authored case arrows.

```typescript
export const BGR_ARROWS: Partial<Record<string, Arrow[]>> = {
  // OLL edge cases (3)
  oll_cross_line: Arrow[],
  oll_cross_hook: Arrow[],
  oll_cross_dot:  Arrow[],

  // OLL corner cases (7)
  oll_sune:     Arrow[],
  oll_antisune: Arrow[],
  oll_shape_h:  Arrow[],
  oll_shape_pi: Arrow[],
  oll_shape_t:  Arrow[],
  oll_shape_l:  Arrow[],
  oll_shape_u:  Arrow[],

  // PLL corner cases (2)
  pll_t: Arrow[],
  pll_y: Arrow[],

  // PLL edge cases (4)
  pll_ua: Arrow[],
  pll_ub: Arrow[],
  pll_h:  Arrow[],
  pll_z:  Arrow[],
};
```

## State

### ArrowToggle (BGRPage state)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `showArrows` | `boolean` | `false` | Whether arrows are currently visible |

**Transitions**:
- `false` → `true`: user clicks toggle button; CSS class `.bgr-show-arrows` added to wrapper
- `true` → `false`: user clicks toggle again; CSS class removed
- No persistence — resets to `false` on page navigation or browser refresh

## Relationships

```
BGRPage
  └── showArrows: boolean (state)
  └── bgr-show-arrows CSS class (on wrapper div when showArrows=true)
      └── AlgorithmCard ×16
            └── arrows: Arrow[] (prop, resolved from BGR_ARROWS[algorithm.id])
                  └── ArrowOverlay
                        └── <svg class="arrow-overlay"> (display controlled by ancestor .bgr-show-arrows)
                              └── Arrow ×N (paths per case)
```

## Coordinate Space Reference

All arrow coordinates use the 288×224 SVG coordinate space matching the rendered PNG images.

U-face cell centres (for authoring):

| Position | x | y |
|----------|---|---|
| UBL corner | 75.5 | 75.5 |
| UB edge | 144.0 | 75.5 |
| UBR corner | 212.5 | 75.5 |
| UL edge | 75.5 | 144.0 |
| UC centre | 144.0 | 144.0 |
| UR edge | 212.5 | 144.0 |
| UFL corner | 75.5 | 212.5 |
| UF edge | 144.0 | 212.5 |
| UFR corner | 212.5 | 212.5 |
