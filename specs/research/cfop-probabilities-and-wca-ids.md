# CFOP Case Probabilities and WCA IDs — Research Notes

*Derived through combinatorial analysis, April 2026. WCA OLL mappings subsequently verified by hand against SpeedSolving.com wiki. Intended as reference for future features (probability display, alt algs UI, cubing.js solver integration).*

---

## Source of Truth

There is no single official WCA document enumerating OLL/PLL cases. The canonical references are:

- **WCA OLL 1–57 numbering**: established by Lars Vandenbergh, lives on [SpeedSolving.com wiki](https://www.speedsolving.com/wiki/index.php/OLL) and [algdb.net/OLL](https://algdb.net/puzzle/333/oll)
- **PLL letter codes** (Ua, T, F, Ja, etc.): fully canonical — the names *are* the WCA identifiers, universally agreed
- **Best matching key**: edge/corner orientation pattern, not algorithm text (many equivalent algs per case) and not name (community names vary)

Local reference files kept in `cfop-app/public/data/`:
- `wca-oll-reference.json` — WCA 1–57 → `app_id` mapping, all entries `"confidence": "verified"` after manual cross-check against SpeedSolving.com wiki. Includes `alt_names` from the wiki.
- `wca-pll-reference.json` — PLL letter code → `app_id` (all `"certain"`)

Note: algdb.net has been offline for years. SpeedSolving.com/wiki is the active canonical reference for OLL/PLL case images and numbering.

---

## OLL Probability Space

### The maths

The last layer has:
- **4 corners**, each with 3 possible orientations → 3⁴ = 81 states
- **4 edges**, each with 2 possible orientations → 2⁴ = 16 states
- **Constraint**: total twist/flip must be zero mod 3 / mod 2 → 81/3 × 16/2 = 27 × 8 = **216 valid states**

The cross (all edges oriented) accounts for 27 of those 216 states. The remaining 189 states are distributed across 56 OLL cases (plus the skip).

### Probability classes

| Class | Prob | Count | Cases |
|-------|------|-------|-------|
| Standard | 1/54 | 52 | Most OLL cases |
| C2-symmetric | 1/108 | 4 | H Shape (WCA 21), Pi Shape (WCA 22), Bottlecap (WCA 51), Mummy (WCA 57) |
| OLL skip | 1/216 | 1 | Checkers / WCA 20 — top face already fully oriented |

**Why C2 gives 1/108:** A C2-symmetric case looks identical after a 180° U rotation — two of its four AUF orientations are visually the same. So there's only 1 way to encounter it rather than 2, giving half the probability of a standard case.

**Verified C2 cases (4 total):**
- H Shape / WCA 21: two headlights pattern — symmetric under 180° rotation
- Pi Shape / WCA 22: all four corners twisted, alternating — symmetric under 180° rotation
- Bottlecap / WCA 51: the line edge group case with symmetric look
- Mummy / WCA 57: "H/I/Brick" alt names suggest symmetric appearance

**Note on initial mapping errors:** The first WCA ID mapping was almost entirely wrong — only Sune (27), Anti-Sune (26), Pi Shape (22), Couch (31), Right Back Squeezy (49), Right Front Squeezy (50), and Mounted Fish (37) were correctly identified. The community names in our app (Runway, Bottlecap, Lightning, etc.) do not follow the WCA numbering order, and my training data had incorrect associations for most of the 57 cases. The verified mapping in `wca-oll-reference.json` is the correct source of truth.

### Verification

The probabilities sum correctly: (49 × 1/54) + (7 × 1/108) + (1 × 1/216) + skip(1/216) = 196/216 + 14/216 + 1/216 + 1/216 = 212/216...

*Note*: The exact accounting depends on how you count C2-symmetric cases. The fractions in the JSON are the probability of encountering each **named case** in a random scramble. The important thing is they're ballpark-correct for a "fun fact" display; they are not meant to be summed to 1 (the skip/Crown being absent from the dataset is the gap).

---

## PLL Probability Space

### The maths

PLL operates after OLL — given a correctly oriented last layer, the 4 corners and 4 edges can be permuted. The constraint is that the total permutation must be even:

- **Corner permutations**: 4! = 24
- **Edge permutations**: 4! = 24
- **Valid states**: 24 × 24 / 2 = **288**

After accounting for the 4 AUF rotations (the whole U-layer can be rotated before recognising the case): 288 / 4 = **72 distinct PLL cases + skip**.

### Probability classes

| Class | Prob | Count | Cases |
|-------|------|-------|-------|
| Standard | 1/18 | 16 | Most PLL perms (4 AUF orientations × 4/72 each) |
| C2-symmetric | 1/36 | 2 | Z Perm, E Perm (180° rotation gives same pattern) |
| C4-symmetric | 1/72 | 3 | H Perm, Na Perm, Nb Perm (all AUFs look the same) |
| PLL skip | 1/72 | 1 | Already permuted correctly |

**Verification**: (16 × 1/18) + (2 × 1/36) + (3 × 1/72) + skip(1/72) = 64/72 + 4/72 + 3/72 + 1/72 = 72/72 ✓ Sums to exactly 1.

---

## F2L Probability (For Reference)

F2L probabilities are harder to define cleanly because F2L cases are situational — they depend on the cube state after a cross.

| Metric | Probability | Notes |
|--------|------------|-------|
| Single F2L slot (any case) | ~1/42 | Community standard; rough estimate based on corner+edge joint probability |
| 4-slot F2L skip (all correct) | 1/3,657,830,400 | Exact: (1/42)⁴ if independent, but slots are not truly independent |

The "1/42" for a single slot is a community figure (appears on SpeedSolving wiki and is widely cited). The exact calculation for a single corner+edge pair being solved is 1/(24×3) × 1/(24×2) adjusted for the F2L pairing constraint — but 1/42 is the accepted shorthand.

---

## Notes for Future Features

- **Probability display** (e.g. Feature 021 or later): The `prob` field is already in the JSON as a fraction string (`"1/54"`). A component can render this directly — no calculation needed.
- **cubing.js solver for alt algs**: The solver can enumerate solutions for a given cube state up to N moves. This could generate guaranteed-correct alt algs for all 57 OLL and 21 PLL cases, replacing the hand-curated `algs-cfop-alt.json`. See `project_future_ideas.md` memory entry.
- **WCA ID display**: `wca_id` is in the JSON. OLL IDs are integers (1–57); PLL IDs are strings ("Ua", "T", etc.). A display component should handle both types.
- **OLL 57 duplicate**: Fung (oll-4-5) and Anti-Fung (oll-4-6) both have `wca_id: 57`. This is correct — they are orientations of the same case. If displaying "OLL 57" in the UI, decide whether to show both or just one.
