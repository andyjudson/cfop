# Implementation Plan: BGR Case Arrows

**Branch**: `main` | **Date**: 2026-06-13 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `specs/025-cfop-case-arrows/spec.md`

## Summary

Overlay directional SVG arrows on the 16 BGR case images (288×224 px 2D top-down renders) to show how pieces move for each OLL/PLL case. A single CSS class on a BGRPage wrapper toggles all overlays simultaneously. OLL cases show arc arrows between a piece's current sticker face and its correct target face; PLL cases show arc arrows tracing permutation cycle paths between U-face positions. Arrow data is a static TypeScript map keyed by case ID — no changes to JSON data files or PNG assets.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19  
**Primary Dependencies**: Vite 7, Bulma CSS, react-icons (all existing)  
**Storage**: N/A — static arrow data, no persistence  
**Testing**: Playwright (Chromium) — 16 existing e2e tests; no new test files required for P1  
**Target Platform**: Web (GitHub Pages), mobile-responsive  
**Project Type**: Web application (cfop-app)  
**Performance Goals**: Toggle responds within one animation frame — pure CSS class swap, no JS computation at toggle time  
**Constraints**: No new npm dependencies; no changes to cfop-bgr.json or PNG assets  
**Scale/Scope**: 16 cases, 1 static data file, ~3 component changes

## Constitution Check

| Gate | Status | Notes |
|------|--------|-------|
| Educational focus | ✓ PASS | Arrows directly help learners understand algorithm intent |
| Open source / no paywalls | ✓ PASS | No restrictions added |
| React + TypeScript + Vite | ✓ PASS | No new tech, stays within existing stack |
| Minimal dependencies | ✓ PASS | Zero new npm packages — uses native SVG |
| CFOP learning scope | ✓ PASS | BGR page only, arrow content is algorithmic |
| Static hosting compatible | ✓ PASS | All data is compile-time static |

No gate violations. No complexity tracking required.

## Project Structure

### Documentation (this feature)

```text
specs/025-cfop-case-arrows/
├── plan.md              ← this file
├── research.md          ← Phase 0 output (below)
├── data-model.md        ← Phase 1 output (below)
└── tasks.md             ← Phase 2 output (/speckit-tasks)
```

### Source Code Changes

```text
cfop-app/src/
├── data/
│   └── bgrArrows.ts               ← NEW: static arrow data (all 16 cases)
├── components/
│   ├── AlgorithmCard.tsx           ← MODIFY: accept arrows?: Arrow[] prop
│   ├── ArrowOverlay.tsx            ← NEW: SVG overlay component
│   └── ArrowOverlay.css            ← NEW: toggle CSS (.arrow-overlay, .bgr-show-arrows)
└── pages/
    └── BGRPage.tsx                 ← MODIFY: add showArrows state, controls row, pass arrows
```

---

## Phase 0: Research

### Decision 1 — SVG vs Canvas for arrow overlay

**Decision**: SVG  
**Rationale**: SVG scales with `width="100%"` and `height="100%"` on the overlay element — no re-draw needed at different viewport sizes. Arrowhead `<marker>` definitions are reused across all arrows in the same SVG. Canvas would require redraw on each resize event.  
**Alternatives considered**: Canvas (requires resize listener + redraw); CSS border/transform tricks (not expressive enough for curved arcs)

### Decision 2 — CSS class toggle vs React prop propagation

**Decision**: CSS class on BGRPage wrapper (`.bgr-show-arrows`) + `display: none/block` on `.arrow-overlay`  
**Rationale**: A single class swap requires zero JS computation at toggle time — satisfies SC-002 ("within one animation frame"). React prop propagation would re-render every AlgorithmCard on each toggle.  
**Alternatives considered**: React context with `showArrows` value (causes re-render of all 16 cards); individual `useState` per card (cannot be single-interaction toggle)

### Decision 3 — Arrow data location

**Decision**: Static TypeScript map `bgrArrows.ts` in `cfop-app/src/data/`, keyed by case `id` string  
**Rationale**: Per spec assumption — data is authored once and never changes at runtime. TypeScript provides type-checking during authoring. Keeping it in `src/data/` is consistent with how other static lookup data would be co-located with the app.  
**Alternatives considered**: Inline in bgrArrows.json (loses type safety on shape); extending cfop-bgr.json (spec explicitly prohibits changes to JSON data files)

### Decision 4 — Arrow path encoding

**Decision**: Quadratic Bézier (`Q` command in SVG `<path>`) with a single control point per arrow  
**Rationale**: One control point is sufficient for the gentle arcs needed on a 288×224 canvas. It's simpler to author than cubic Bézier and produces smooth curves. Straight arrows (no curve) are expressed as `cp: undefined` — the path degrades to a line with `L`.  
**Alternatives considered**: Cubic Bézier (two control points — more complex to author); `<line>` + `<polyline>` (no arrowhead support without `<marker>`)

### Decision 5 — Arrowhead style

**Decision**: SVG `<marker>` element with a filled triangle, defined once in `<defs>`, referenced by all arrow `<path>` elements via `marker-end`  
**Rationale**: Single definition, zero duplication. Color inherits from the path stroke via `fill: context-stroke` (CSS `context-stroke` keyword supported in all modern browsers). Semi-transparent accent color (e.g., `rgba(255,165,0,0.85)`) contrasts on both light and dark sticker palettes.  
**Alternatives considered**: Emoji / Unicode arrows (not scalable, not positionable); CSS `::after` pseudo-elements (cannot be positioned over `<img>` precisely)

### Decision 6 — Arrow colour

**Decision**: Single accent colour `rgba(255, 140, 0, 0.85)` (dark orange, semi-transparent)  
**Rationale**: Orange contrasts with all six face colours (white, yellow, red, blue, orange stickers are adjacent — a warm orange at 85% opacity is distinct from sticker orange due to the transparency, and contrasts against blue, green, white, yellow, red). Degrades gracefully on both light and dark page themes.  
**Alternatives considered**: CSS custom property from the design system (viable, but adds token authoring overhead for a single colour); theme-conditional arrow colour (adds complexity, not needed per constitution simplicity guidelines)

### Decision 7 — Component coupling

**Decision**: `AlgorithmCard` accepts `arrows?: Arrow[]` prop; BGRPage resolves arrows from `BGR_ARROWS[alg.id]` and passes them; on other pages no `arrows` prop is passed  
**Rationale**: Avoids importing BGR-specific data into `AlgorithmCard` on every page. The SVG is only added to the DOM when `arrows` is non-empty.  
**Alternatives considered**: Context API (heavier machinery for one boolean state); CSS-only global class without prop (renders SVG on non-BGR pages unnecessarily)

### Decision 8 — OLL arrow visual form

**Decision**: Arc arrows between the piece's current sticker face and its correct target face (same visual type as PLL arrows). Curved rotation symbols (CW/CCW arc) are an accepted alternative to trial during implementation (per clarification 2026-06-13).  
**Rationale**: Consistent visual grammar across OLL and PLL — learners see one arrow type with two semantic uses (orientation and permutation). Reduces cognitive load.  
**Alternatives considered**: Straight directional arrows on sticker cells (simpler but less expressive); dedicated rotation symbol glyph (inconsistent with PLL visual language)

---

## Phase 1: Design & Contracts

### Data Model

See [data-model.md](data-model.md).

### UI Contracts

#### Arrow interface (`cfop-app/src/data/bgrArrows.ts`)

```typescript
export interface Arrow {
  from: [number, number];   // [x, y] in 288×224 SVG coordinate space
  to:   [number, number];
  cp?:  [number, number];   // optional quadratic bezier control point
}

// Keyed by algorithm id (matches CfopAlgorithm.id from cfop-bgr.json)
export const BGR_ARROWS: Partial<Record<string, Arrow[]>> = { ... };
```

#### AlgorithmCard — extended props

```typescript
interface AlgorithmCardProps {
  algorithm: CfopAlgorithm;
  variant?: 'standard' | 'compact';
  isEssential?: boolean;
  onShowNotes?: (algorithm: CfopAlgorithm) => void;
  arrows?: Arrow[];          // NEW — if provided, renders ArrowOverlay inside .image-container
}
```

Rendered output (when `arrows` is non-empty):

```html
<div class="image-container">
  <img src="..." alt="..." />
  <svg class="arrow-overlay" viewBox="0 0 288 224" ...>
    <!-- arrowhead marker def + paths -->
  </svg>
</div>
```

#### BGRPage — new state and controls

```typescript
const [showArrows, setShowArrows] = useState(false);

// Toggle button in controls row (above the first section):
<div className="bgr-controls-row">
  <button
    className={`button is-small${showArrows ? ' is-warning' : ''}`}
    onClick={() => setShowArrows(v => !v)}
    aria-pressed={showArrows}
  >
    {showArrows ? 'Hide arrows' : 'Show arrows'}
  </button>
</div>

// Wrapper with CSS class:
<div className={showArrows ? 'bgr-show-arrows' : ''}>
  {renderAlgorithmSection(...)}
  ...
</div>
```

#### CSS toggle mechanism (`ArrowOverlay.css`)

```css
/* Default: hidden */
.arrow-overlay {
  display: none;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

/* Activated by BGRPage wrapper */
.bgr-show-arrows .arrow-overlay {
  display: block;
}
```

### Cell position reference (for authoring `bgrArrows.ts`)

CubeRenderer2D geometry for `size = 288`:

```
margin    = 7
cellSize  = 68.5
stripDepth = 34.25
uX = uY  = 41.25
```

U-face cell centres (r = row, c = col, 0-indexed from top-left):

```
x = 75.5 + c × 68.5
y = 75.5 + r × 68.5
```

| Label | (r,c) | x | y |
|-------|-------|-----|-----|
| UBL (back-left corner) | (0,0) | 75.5 | 75.5 |
| UB (back edge) | (0,1) | 144.0 | 75.5 |
| UBR (back-right corner) | (0,2) | 212.5 | 75.5 |
| UL (left edge) | (1,0) | 75.5 | 144.0 |
| UC (centre) | (1,1) | 144.0 | 144.0 |
| UR (right edge) | (1,2) | 212.5 | 144.0 |
| UFL (front-left corner) | (2,0) | 75.5 | 212.5 |
| UF (front edge) | (2,1) | 144.0 | 212.5 |
| UFR (front-right corner) | (2,2) | 212.5 | 212.5 |

Adjacent strip cell centres (first sticker of each side face visible in the render):

```
Back strip (above U):  y ≈ 24,  x = 75.5 / 144.0 / 212.5
Left strip (left of U): x ≈ 24,  y = 75.5 / 144.0 / 212.5
Right strip (right of U): x ≈ 264, y = 75.5 / 144.0 / 212.5
Front strip: y ≈ 264 — outside 288×224 frame, not visible
```

> **Note**: The 288×224 images are square-rendered 2D views at size=288 with the bottom strip (front face, y≈264) cropped. All U-face cells and the three visible side strips (back/left/right) are within frame. Authoring arrows on U-face cells only covers all OLL and PLL needs.

### Arrow authoring guide (per case type)

**OLL edges** (3 cases — oll_cross_line, oll_cross_hook, oll_cross_dot):  
Draw an arc from the edge cell sticker in its current facing direction to the U-face position. For the Line case: the two horizontal edge cells (UB, UF — noting UF sticker is visible on U face, not the clipped front strip). Use the U-face cell centres of the affected edge pieces.

**OLL corners** (7 cases — oll_sune, oll_antisune, oll_shape_h/pi/t/l/u):  
Draw arcs from off-face sticker positions to their correct U-face positions for each corner that needs to twist. Where a rotation symbol is more legible, use a short arc that curves around the corner sticker.

**PLL corners** (2 cases — pll_t, pll_y):  
Draw arcs between U-face corner cell centres to trace the permutation cycle (T-perm = 2-cycle of two corners; Y-perm = 3-cycle of three corners).

**PLL edges** (4 cases — pll_ua, pll_ub, pll_h, pll_z):  
Draw arcs between U-face edge cell centres to trace the cycle/swap. Ua/Ub = 3-cycle of three edges; H = double swap; Z = 2 adjacent swaps.

---

## Implementation Strategy

### Phase 1 (P1) — Toggle mechanism (independent of arrow content)

Implement the full toggle infrastructure with stub arrow data (1–2 cases with placeholder arrows). Verifies SC-002 (one-frame response), SC-005 (no layout shift), FR-001/002/009/010/011.

1. Create `bgrArrows.ts` with the `Arrow` interface and `BGR_ARROWS` map (stub: 2-3 cases only)
2. Create `ArrowOverlay.tsx` — SVG element with marker defs + path rendering
3. Create `ArrowOverlay.css` — show/hide CSS
4. Modify `AlgorithmCard.tsx` — add `arrows` prop, render `<ArrowOverlay>` inside `.image-container`
5. Modify `BGRPage.tsx` — add `showArrows` state, controls row, wrapper class, pass arrows

### Phase 2 (P2) — OLL arrow data

Author accurate arrow coordinates for all 10 OLL cases. Visually verify against PNGs.

### Phase 3 (P3) — PLL arrow data

Author accurate arrow coordinates for all 6 PLL cases. Visually verify against PNGs.

Phases 2 and 3 are independent — can be done in either order or simultaneously.
