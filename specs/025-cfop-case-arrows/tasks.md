# Tasks: BGR Case Arrows

**Input**: Design documents from `specs/025-cfop-case-arrows/`  
**Plan**: [plan.md](plan.md) | **Spec**: [spec.md](spec.md) | **Data model**: [data-model.md](data-model.md)

**No tests** — no test tasks in this feature; visual verification is in the Polish phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: US1/US2/US3 maps to spec.md user stories

---

## Phase 1: Foundational (Shared Infrastructure)

**Purpose**: Arrow data interface — required by all three user stories before any story-specific work begins.

- [X] T001 Create `cfop-app/src/data/bgrArrows.ts` — define `export interface Arrow { from: [number, number]; to: [number, number]; cp?: [number, number]; }` and `export const BGR_ARROWS: Partial<Record<string, Arrow[]>> = {};` (empty map, all entries added in US2/US3)

**Checkpoint**: `bgrArrows.ts` compiles cleanly; `Arrow` and `BGR_ARROWS` are importable.

---

## Phase 2: User Story 1 — Toggle arrows on all case cards (Priority: P1) 🎯 MVP

**Goal**: Full toggle infrastructure — SVG overlay component, CSS show/hide, AlgorithmCard prop, BGRPage toggle button and wrapper class. Toggle works even before arrow data is authored.

**Independent Test**: Run dev server (`cd cfop-app && npm run dev`); open BGRPage; click toggle button — all 16 case images get `.arrow-overlay` SVG inserted into DOM (even if arrows array is empty). No layout shift, no console errors. Clicking again removes the arrows. Cases with no arrows in `BGR_ARROWS` render normally (FR-011).

- [X] T002 [US1] Create `cfop-app/src/components/ArrowOverlay.tsx` — SVG overlay component: `interface ArrowOverlayProps { arrows: Arrow[] }`. Renders `<svg className="arrow-overlay" viewBox="0 0 288 224" width="100%" height="100%" style={{position:'absolute',inset:0,pointerEvents:'none'}}><defs>` with a filled triangle `<marker id="arrowhead">` in orange (`rgba(255,140,0,0.85)`), then one `<path>` per arrow with quadratic bezier `M from Q cp to` (straight `M from L to` when cp is absent), `stroke="rgba(255,140,0,0.85)"`, `strokeWidth={3}`, `fill="none"`, `markerEnd="url(#arrowhead)"`. Import `Arrow` from `../data/bgrArrows`.

- [X] T003 [P] [US1] Create `cfop-app/src/components/ArrowOverlay.css` — import in ArrowOverlay.tsx. Rules: `.arrow-overlay { display: none; position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; overflow: visible; }` and `.bgr-show-arrows .arrow-overlay { display: block; }`.

- [X] T004 [US1] Modify `cfop-app/src/components/AlgorithmCard.tsx` — add `arrows?: Arrow[]` to `AlgorithmCardProps`; import `Arrow` from `../data/bgrArrows` and `ArrowOverlay` from `./ArrowOverlay`; inside `.image-container` div, after the `<img>`, add `{arrows && arrows.length > 0 && <ArrowOverlay arrows={arrows} />}`. Also add `import './ArrowOverlay.css'`.

- [X] T005 [US1] Modify `cfop-app/src/pages/BGRPage.tsx` — (a) add `import { BGR_ARROWS } from '../data/bgrArrows'`; (b) add `const [showArrows, setShowArrows] = useState(false)` to component body; (c) add a controls row div immediately before `<main>`: `<div className="bgr-controls-row" style={{display:'flex',justifyContent:'flex-end',padding:'0 1.5rem 0.5rem'}}><button className={`button is-small${showArrows ? ' is-warning' : ''}`} onClick={() => setShowArrows(v => !v)} aria-pressed={showArrows}>{showArrows ? 'Hide arrows' : 'Show arrows'}</button></div>`; (d) wrap the `<main>` element content in `<div className={showArrows ? 'bgr-show-arrows' : ''}>...</div>`; (e) pass `arrows={BGR_ARROWS[alg.id]}` to each `<AlgorithmCard>` call inside `renderAlgorithmSection`.

**Checkpoint**: Toggle button visible on BGR page; clicking it adds/removes `.bgr-show-arrows` class; no SVG arrows visible yet (empty data map). No layout shift.

---

## Phase 3: User Story 2 — OLL cases show orientation arrows (Priority: P2)

**Goal**: All 10 OLL cases (3 edge + 7 corner) have accurate arc arrows indicating which pieces are disoriented and in which direction they need to move.

**Independent Test**: Enable arrows on BGRPage; scroll to OLL Edge Cases and OLL Corner Cases sections; each case image shows arrows on the affected pieces that correctly reflect the algorithm's effect (compare visually against the algorithm notation and the 2D case image). No case shows arrows on already-oriented pieces.

**Reference** — U-face cell centres from plan.md (SVG coordinate space 288×224):

| Position | x | y |
|----------|---|---|
| UBL | 75.5 | 75.5 |
| UB | 144.0 | 75.5 |
| UBR | 212.5 | 75.5 |
| UL | 75.5 | 144.0 |
| UC | 144.0 | 144.0 |
| UR | 212.5 | 144.0 |
| UFL | 75.5 | 212.5 |
| UF | 144.0 | 212.5 |
| UFR | 212.5 | 212.5 |

For OLL arrows: draw an arc FROM the disoriented sticker's U-face position (its cell centre), CURVING toward the adjacent face, and BACK — suggesting the flip/twist. A short arc `from` slightly offset left of the cell centre `to` slightly offset right, with a `cp` pushed toward the adjacent face, conveys orientation direction. Compare against the actual PNG to confirm correct cells are targeted.

- [X] T006 [US2] Author OLL edge arrows in `cfop-app/src/data/bgrArrows.ts` — add entries for `oll_cross_line` (2 disoriented edges: UF, UB — the non-line edges; z2 render means the image shows the solving face from above), `oll_cross_hook` (2 disoriented edges), `oll_cross_dot` (all 4 edges disoriented). For each disoriented edge cell, add an Arrow arc suggesting flip direction (cp offset perpendicular to the edge orientation).

- [X] T007 [US2] Author OLL corner arrows in `cfop-app/src/data/bgrArrows.ts` — add entries for `oll_sune` (3 corners need to twist: UBL, UFR, UBR — each needs a CW or CCW arc based on the Sune algorithm effect) and `oll_antisune` (3 corners: UBR, UFL, UBL — each with opposite twist direction).

- [X] T008 [US2] Author OLL corner arrows in `cfop-app/src/data/bgrArrows.ts` — add entries for the 5 remaining shape cases. `oll_shape_h`: all 4 corners disoriented (alternating CW/CCW). `oll_shape_pi`: 4 corners, specific pattern. `oll_shape_t`: 2 corners. `oll_shape_l`: 2 corners. `oll_shape_u`: 2 corners. Use the actual PNG images to identify which corners have non-yellow U-face stickers — those are the disoriented pieces needing arrows.

**Checkpoint**: OLL section shows correct arrows on all 10 cases when toggle is active. No arrows on already-oriented pieces.

---

## Phase 4: User Story 3 — PLL cases show permutation arrows (Priority: P3)

**Goal**: All 6 PLL cases (2 corner + 4 edge) have arc arrows tracing the permutation cycle between U-face cell positions.

**Independent Test**: Enable arrows on BGRPage; scroll to PLL Corner Cases and PLL Edge Cases sections; each case image shows cycle arrows connecting the correct piece positions in the correct direction, matching the permutation the algorithm performs.

**Arrow convention for PLL cycles**: Draw arrows around the cycle in the direction of movement. For a 3-cycle A → B → C, draw: arc from A to B, arc from B to C, arc from C to A (the "return" arc closes the cycle). For a 2-cycle (swap) A ↔ B, draw two arcs: one from A curving above to B, one from B curving below back to A (double-headed swap visual).

- [X] T009 [US3] Author PLL corner arrows in `cfop-app/src/data/bgrArrows.ts` — `pll_t`: swap of UBR ↔ UFR corners (two opposing arcs between x=212.5,y=75.5 and x=212.5,y=212.5); `pll_y`: 3-cycle of UFL → UBL → UFR (or whichever 3 corners the Y-perm cycles — verify from JSON setup alg).

- [X] T010 [US3] Author PLL edge arrows in `cfop-app/src/data/bgrArrows.ts` — `pll_ua`: 3-cycle of three edges counter-clockwise (UB → UL → UF, i.e. 144,75.5 → 75.5,144 → 144,212.5 → back to start); `pll_ub`: 3-cycle clockwise (UF → UL → UB).

- [X] T011 [US3] Author PLL edge arrows in `cfop-app/src/data/bgrArrows.ts` — `pll_h`: double swap of opposite edges (UF ↔ UB: 144,212.5 ↔ 144,75.5 and UL ↔ UR: 75.5,144 ↔ 212.5,144); `pll_z`: adjacent swap (UF ↔ UL and UB ↔ UR).

**Checkpoint**: PLL section shows correct permutation arcs on all 6 cases when toggle is active. Arrows distinguishable from sticker colours on both light and dark themes.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T012 [P] Visual verification — start dev server (`cd cfop-app && npm run dev -- --port 5173`), open BGRPage, toggle arrows on/off; check all 16 cases for: (a) arrows visible on correct pieces only, (b) no layout shift (SC-005), (c) toggle active/inactive visual state is clear (FR-010), (d) no console errors.

- [ ] T013 [P] Contrast check — view BGRPage in both light and dark theme with arrows enabled; confirm orange accent arrows are legible against all sticker colours on all 16 cases (FR-008); adjust `rgba(255,140,0,0.85)` values in ArrowOverlay.tsx marker/path if any colour clashes.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies — start immediately
- **US1 (Phase 2)**: Depends on Phase 1 (imports `Arrow` and `BGR_ARROWS`)
- **US2 (Phase 3)**: Depends on Phase 1 only (adds data to `BGR_ARROWS`); independent of US1
- **US3 (Phase 4)**: Depends on Phase 1 only (same file as US2, must run after US2 tasks to avoid file conflicts)
- **Polish (Phase 5)**: Depends on US1 complete (needs working toggle) + at least one of US2/US3

### Within Phase 2 (US1)

- T002 and T003 can start in parallel (different files)
- T004 depends on T002 (imports ArrowOverlay)
- T005 depends on T004 (imports modified AlgorithmCard interface) and T001

### Parallel Opportunities

```
Phase 1:         T001 (alone)
Phase 2 (US1):   T002 ‖ T003  →  T004  →  T005
Phase 3 (US2):   T006 → T007 → T008  (sequential, same file)
Phase 4 (US3):   T009 → T010 → T011  (sequential, same file)
Phase 5:         T012 ‖ T013
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. T001 — Arrow interface
2. T002 + T003 — ArrowOverlay component + CSS
3. T004 — AlgorithmCard prop
4. T005 — BGRPage toggle
5. **STOP and VALIDATE**: Toggle works, no layout shift, no console errors (even with no arrow data)

### Incremental Delivery

1. Foundation + US1 → toggle infrastructure working → can demo to user (toggle shows empty overlays)
2. US2 → OLL arrows authored → 10 cases have arrows → meaningful demo
3. US3 → PLL arrows authored → all 16 cases complete → SC-001 met
4. Polish → visual verification + contrast check → all success criteria met

---

## Notes

- Arrow coordinates are in 288×224 SVG space; U-face cell centres are in the plan.md coordinate table
- For OLL arrows: use the actual PNG images to identify which stickers are non-yellow (those are disoriented pieces)
- For PLL arrows: verify cycle direction from the JSON `notation` field in cfop-bgr.json before authoring
- All 16 BGR case PNGs have z2 applied as setup (from cfop-bgr.json `"setup": "z2"`) — the image shows the top face after the setup rotation
- US2 and US3 both edit `bgrArrows.ts` — do them sequentially to avoid merge conflicts in the same file
