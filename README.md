# cubing.spec

This project serves as a personal reference for learning and practicing CFOP (Cross, F2L, OLL, PLL) — the dominant speedcubing method used in competitive solving. Development follows a specification-first approach using **spec-kit** principles, with AI-agentic-assisted implementation.

## Applications

### cfop-app
CFOP learning companion with algorithm reference grids, interactive visualizations, practice timers, and solve tracking.

**Live app:** https://andyjudson.github.io/cubing.spec/

**Features:**
- Full CFOP navigation (Intuitive, Notation, Beginner/2LK, F2L, OLL, PLL)
- Notation reference page covering face turns, modifiers, slices, rotations, and common triggers
- Expandable/collapsible algorithm sections with session persistence
- OLL consolidated from 14→7 balanced groups; OLL and PLL probability scores ("1/54") and WCA case numbers on every card
- Solve visualization modal with cubing.js TwistyPlayer and scramble cube preview
- Practice timer with scramble generator; persistent solve time tracking via localStorage
- About page with WCA world record evolution chart (Recharts) and sortable WR Legends table
- Dark mode with localStorage persistence; mobile-responsive layout (iPhone 16 baseline)

**Directory:** `/cfop-app/` • [README](cfop-app/README.md)

### cubify-harness
Clean-room 3×3 cube visualisation and logic library, built to replace cubing.js TwistyPlayer in this project. Used as a test harness for iterating on rendering, stickering, and animation ideas before promoting to the main app.

**Usage:** Open `cubify-harness/index.html` directly in a browser (no build step).

**What's built:**
- `CubeState` — wraps cubing.js KPattern; `applyMove/applyAlg`, `toFaceArray()`, `invertAlg()`
- `CubeRenderer3D` — Three.js 3D cube renderer; `setState()`, `animateMove()`, `animateAlg()`, `setSpeed()`; alpha + preserveDrawingBuffer for PNG export
- `CubeRenderer2D` — Canvas 2D top-down view (U face + side strips + corner quads); SVG output for Node.js; transparent background option
- `CubeStickering` — CFOP orbit-string masking; `fromOrbitStringWithState()` with full char set (-/I/D/O/S/P); `MASK_PRESETS` (15 presets)
- `CubeExporter` — `toPNG(alg, { style: '2d'|'3d' })` PNG export; harness Export 2D / Export 3D buttons
- `AlgParser` — WCA notation parser (face turns, wide moves, slices, rotations)
- `verify-perms.mjs` — 18-test permutation cross-check suite against cubing.js ground truth
- `demo/export-test.mjs` — Node.js sharp-based PNG validation (Sune OLL, T-Perm PLL, solved)

**Design goals:** No IntersectionObserver constraints, no shadow DOM, no baked-in controls — clean public API, CSS custom property theming, MIT licensed.

**Directory:** `/cubify-harness/`

### cubify-app
Standalone cube image generator for use in algorithm documentation with 3D PNG and 2D SVG export capabilities.

**Usage:** Local development tool (not deployed to GitHub Pages)

**Features:**
- 3D PNG capture at native resolution (~4096×4096)
- 2D SVG export with 288×288 viewBox
- Preset mask library for CFOP stages (default, cross, F2L, OLL, PLL)
- Custom mask override with orbit notation
- Setup algorithm configuration with anchor control
- Algorithm validation and inversion logging

**Directory:** `/cubify-app/` • [README](cubify-app/README.md)

### cubify-scripts
Claude Code agent skill (`/cubify`) that generates cube state images from algorithm inputs. Runs as a standalone Node.js script — no build step.

**Usage:** Invoked via `/cubify` in Claude Code, or directly: `node cubify-scripts/cubify.mjs <args>`

**Input modes:**
- Raw algorithm: `/cubify R U R' U'`
- Named case lookup: `/cubify --case oll_sune`
- Batch JSON file: `/cubify --file algs-cfop-oll.json`

**Directory:** `/cubify-scripts/`

## Built With

- **Cubing knowledge** from [Milan Struyf](https://www.youtube.com/@CubeHead) (CubeHead) and [Dylan Wang](https://www.youtube.com/@JPerm) (JPerm)
- **[Cubing.js](https://github.com/cubing/cubing.js)** framework from Lucas Garron for cube graphics and algorithm visualization
- **React 19** and **TypeScript 5.9** for modern reactive UI
- **Vite 7** for fast development and optimized builds
- **Bulma CSS** for UI components and responsive layout
- **GitHub Copilot** and **Claude Code** for AI-agentic-assisted development
- **Spec-Kit** methodology for specification-driven development
- Deployed on **GitHub Pages**

## Development

Each application is independent with its own package.json and build configuration.

### cfop-app
```bash
cd cfop-app
npm install
npm run dev  # http://localhost:5173/cubing.spec/
```

### cubify-app
```bash
cd cubify-app
npm install
npm run dev  # http://localhost:5173/
```

## Testing

Smoke tests use [Playwright](https://playwright.dev/) and run against the local dev server (Chromium). Run manually before merging a feature branch to main.

```bash
cd cfop-app
npx playwright test          # full suite (~10s)
npx playwright test e2e/navigation.spec.ts   # single file
```

The dev server starts automatically via `playwright.config.ts` (`reuseExistingServer: true`). If a Vite process is already running on a different interface, kill it first to avoid port conflicts.

**Test coverage** (16 tests across 5 spec files):

| Spec | What it covers |
|------|----------------|
| `navigation.spec.ts` | All primary pages load; BGR cards always visible; PLL cards visible after expand-all; nav link routing |
| `mobile-nav.spec.ts` | Icons and hamburger grouped on right at 393px; menu opens and closes |
| `practice-timer.spec.ts` | Modal opens with scramble; spacebar timer records a time; last/best stats visible; champion mode loads competition and scrambles |
| `visualiser-modal.spec.ts` | Modal opens with TwistyPlayer present; closes via close button |
| `wr-chart.spec.ts` | Recharts renders on About page; no error state |

For full design rationale and test scope, see [`specs/016-playwright-e2e-tests/`](specs/016-playwright-e2e-tests/).

## Acknowledgments

Huge thanks to the cubing community educators who make this learning journey accessible, and to the cubing.js project for providing such a powerful toolkit for cube visualization and manipulation. This project wouldn't exist without their generous knowledge sharing.

## Repository Structure

```
cubing.spec/
├── cfop-app/           # CFOP learning companion (main app)
├── cubify-harness/     # Cube visualisation library + test harness (in progress)
├── cubify-app/         # Cube image generator (utility)
├── cubify-scripts/     # Agent skill (Node.js, no build)
├── specs/              # Feature specifications (001–031+)
│   ├── 022-cubify-harness/
│   ├── 023-cubify-stickering/
│   ├── ...
│   └── spec.md         # Canonical feature ledger
└── .specify/           # Spec-kit configuration
```

## License

MIT License - see [LICENSE](LICENSE) for details.

Note: 
- Cubing algorithms are mathematical sequences in the public domain. 
- This project uses [cubing.js](https://github.com/cubing/cubing.js) (MPL-2.0) for visualization.

---

**Status**: Active development • Features 001–023 complete • 026 complete • cubify library series (024–031) in progress
