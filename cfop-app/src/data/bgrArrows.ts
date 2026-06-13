export interface Arrow {
  from: [number, number];
  to:   [number, number];
  cp?:  [number, number];
  /** Double-headed: a single arc with arrowheads at both ends (for swaps). */
  both?: boolean;
}

// U-face cell centres for size=288 (x = 75.5 + c*68.5, y = 75.5 + r*68.5)
// UBL(75.5,75.5) UB(144,75.5) UBR(212.5,75.5)
// UL(75.5,144)   UC(144,144)  UR(212.5,144)
// UFL(75.5,212.5) UF(144,212.5) UFR(212.5,212.5)

const OUT: Record<string, [number, number]> = {
  B: [0, -1], F: [0, 1], L: [-1, 0], R: [1, 0],
};

// Rotate a vector by `deg` (screen space: +x right, +y down, so +deg is CW).
function rot([vx, vy]: [number, number], deg: number): [number, number] {
  const r = (deg * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
  return [vx * c - vy * s, vx * s + vy * c];
}

// OLL corner twist arrows: a ~120° circular sweep AROUND the corner cell. The
// TAIL sits on the corner's yellow side sticker (the facelet pointing sideways)
// and is tangent to the rotation, so the arrow reads as "twist this corner —
// the yellow rotates up onto the top". `side` is the face the yellow facelet
// sits on, derived from the rendered case state (setup z2): B/F/L/R.
function twist(cx: number, cy: number, side: 'B' | 'F' | 'L' | 'R'): Arrow {
  const out = OUT[side];
  // sweep toward the cube centre: +90° from `out` points inward, or -90° if not
  const toC: [number, number] = [Math.sign(144 - cx), Math.sign(144 - cy)];
  const inward = rot(out, 90);
  const sweep = (inward[0] * toC[0] + inward[1] * toC[1] >= 0 ? 1 : -1) * 180;
  const head = rot(out, sweep);
  const mid = rot(out, sweep / 2);
  return {
    from: [cx + out[0] * 52, cy + out[1] * 52],   // tail set into the yellow side sticker
    to:   [cx + head[0] * 26, cy + head[1] * 26], // head 180° around, onto the top face
    cp:   [cx + mid[0] * 50, cy + mid[1] * 50],   // bulge outward → clear rotation
  };
}

// OLL edge flip arrows: same tail-at-yellow idea as the corner twist, but for a
// disoriented edge — its yellow sits on the outward side face and flips up onto
// the top. Tail at the side sticker, strong arc swinging onto the top face.
function flip(cx: number, cy: number, side: 'B' | 'F' | 'L' | 'R'): Arrow {
  const [ox, oy] = OUT[side];
  const perp: [number, number] = [-oy, ox]; // perpendicular bow (pinwheels CW across the 4 edges)
  return {
    from: [cx + ox * 54, cy + oy * 54],   // tail at the yellow side sticker
    to:   [cx - ox * 22, cy - oy * 22],   // head past centre, onto the top face
    cp:   [cx + perp[0] * 56, cy + perp[1] * 56], // strong sideways bow
  };
}

export const BGR_ARROWS: Partial<Record<string, Arrow[]>> = {

  // ── OLL EDGES ───────────────────────────────────────────────────────────────

  // Line: UF and UB need to flip (UL and UR already oriented)
  oll_cross_line: [flip(144, 75.5, 'B'), flip(144, 212.5, 'F')],

  // Hook: UB and UL need to flip (UR and UF already oriented)
  oll_cross_hook: [flip(144, 75.5, 'B'), flip(75.5, 144, 'L')],

  // Dot: all 4 edges disoriented
  oll_cross_dot: [
    flip(144, 75.5, 'B'),
    flip(75.5, 144, 'L'),
    flip(212.5, 144, 'R'),
    flip(144, 212.5, 'F'),
  ],

  // ── OLL CORNERS ─────────────────────────────────────────────────────────────

  // Sune: UFL oriented; yellow sits on UBL-back, UBR-right, UFR-front
  oll_sune: [
    twist(75.5, 75.5, 'B'),    // UBL yellow on back
    twist(212.5, 75.5, 'R'),   // UBR yellow on right
    twist(212.5, 212.5, 'F'),  // UFR yellow on front
  ],

  // AntiSune: UBR oriented; yellow sits on UBL-left, UFL-front, UFR-right
  oll_antisune: [
    twist(75.5, 75.5, 'L'),    // UBL yellow on left
    twist(75.5, 212.5, 'F'),   // UFL yellow on front
    twist(212.5, 212.5, 'R'),  // UFR yellow on right
  ],

  // H shape: all 4 disoriented; left pair yellow on left, right pair on right
  oll_shape_h: [
    twist(75.5, 75.5, 'L'),    // UBL yellow on left
    twist(212.5, 75.5, 'R'),   // UBR yellow on right
    twist(75.5, 212.5, 'L'),   // UFL yellow on left
    twist(212.5, 212.5, 'R'),  // UFR yellow on right
  ],

  // Pi shape: all 4 disoriented; UBL-left, UBR-back, UFL-left, UFR-front
  oll_shape_pi: [
    twist(75.5, 75.5, 'L'),    // UBL yellow on left
    twist(212.5, 75.5, 'B'),   // UBR yellow on back
    twist(75.5, 212.5, 'L'),   // UFL yellow on left
    twist(212.5, 212.5, 'F'),  // UFR yellow on front
  ],

  // T shape: UBL yellow on back, UFL yellow on front (left column)
  oll_shape_t: [
    twist(75.5, 75.5, 'B'),    // UBL yellow on back
    twist(75.5, 212.5, 'F'),   // UFL yellow on front
  ],

  // L shape: UBL yellow on left, UFR yellow on front (diagonal)
  oll_shape_l: [
    twist(75.5, 75.5, 'L'),    // UBL yellow on left
    twist(212.5, 212.5, 'F'),  // UFR yellow on front
  ],

  // U shape: UFL and UFR both yellow on front (front pair)
  oll_shape_u: [
    twist(75.5, 212.5, 'F'),   // UFL yellow on front
    twist(212.5, 212.5, 'F'),  // UFR yellow on front
  ],

  // ── PLL CORNERS (edges greyed by 'corner' mask) ──────────────────────────────
  // Cycles below are derived from the actual rendered cube state (solved+setup+inv(alg)).

  // T-perm: adjacent corner swap UBR ↔ UFR (right side) — one double-headed arc
  pll_t: [
    { from: [212.5, 75.5], to: [212.5, 212.5], cp: [250, 144], both: true }, // UBR ↔ UFR
  ],

  // Y-perm: diagonal corner swap UBL ↔ UFR — one double-headed arc
  pll_y: [
    { from: [75.5, 75.5], to: [212.5, 212.5], cp: [188, 100], both: true }, // UBL ↔ UFR
  ],

  // ── PLL EDGES ───────────────────────────────────────────────────────────────

  // Ua-perm: 3-edge cycle UB → UL → UR (counterclockwise; UF stays). Matches note.
  pll_ua: [
    { from: [144, 75.5],  to: [75.5, 144],  cp: [90, 90]   }, // UB → UL
    { from: [75.5, 144],  to: [212.5, 144], cp: [144, 208] }, // UL → UR (around front)
    { from: [212.5, 144], to: [144, 75.5],  cp: [198, 90]  }, // UR → UB
  ],

  // Ub-perm: 3-edge cycle UB → UR → UL (clockwise; UF stays). Matches note.
  pll_ub: [
    { from: [144, 75.5],  to: [212.5, 144], cp: [198, 90]  }, // UB → UR
    { from: [212.5, 144], to: [75.5, 144],  cp: [144, 208] }, // UR → UL (around front)
    { from: [75.5, 144],  to: [144, 75.5],  cp: [90, 90]   }, // UL → UB
  ],

  // H-perm: opposite-pair swaps UB ↔ UF and UL ↔ UR — two double-headed straight
  // arrows forming a clean plus, instead of four overlapping arcs.
  pll_h: [
    { from: [144, 96], to: [144, 192], both: true }, // UB ↔ UF (vertical)
    { from: [96, 144], to: [192, 144], both: true }, // UL ↔ UR (horizontal)
  ],

  // Z-perm: two adjacent edge pairs swap across the main diagonal —
  // UF ↔ UR (front↔right, around UFR) and UL ↔ UB (left↔back, around UBL).
  // One double-headed arc per pair, sitting in opposite corners (no overlap).
  pll_z: [
    { from: [144, 212.5], to: [212.5, 144], cp: [205, 205], both: true }, // UF ↔ UR
    { from: [75.5, 144],  to: [144, 75.5],  cp: [83, 83],   both: true }, // UL ↔ UB
  ],
};
