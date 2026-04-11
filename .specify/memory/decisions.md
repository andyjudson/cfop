# Architectural Decision Record

Cross-cutting decisions for the cubing.spec project. Each entry captures what was decided, why, and what was rejected. Spec references indicate where the decision originated or was first exercised.

---

## Tech Stack

### ADR-001 — React + TypeScript + Vite as the primary stack
**Decision**: React 19, TypeScript 5.x, Vite 7 for the cfop-app.
**Rationale**: Modern, well-supported, strong ecosystem. TypeScript prevents a class of runtime errors that are hard to catch in a data-heavy app (algorithm JSON, competition data). Vite's HMR makes the iteration loop fast.
**Rejected**: Plain HTML/JS (insufficient for component reuse at this scale); Vue (less familiar); Next.js (no SSR need, GitHub Pages deployment is simpler with Vite).
**Spec**: Feature 001

### ADR-002 — Bulma CSS as the UI framework
**Decision**: Bulma 1.x for base component styling; CSS custom properties for all theming.
**Rationale**: Classname-based, no JS runtime, easy to override with CSS tokens. Integrates cleanly with React without a dedicated component library.
**Rejected**: Tailwind (verbose in JSX, harder to theme consistently); MUI (too opinionated, larger bundle); bare CSS (too much bespoke work for buttons, modals, selects).
**Spec**: Feature 001

### ADR-003 — CSS custom property tokens for all theming
**Decision**: All colours, shadows, spacing, radii defined as `--color-*`, `--shadow-*`, `--space-*`, `--radius-*` tokens in `index.css`. No hardcoded hex or rgba values in component CSS.
**Rationale**: Single source of truth for the design system. Dark mode, future retheming, and the cubify-harness library all benefit from token-based styling.
**Rejected**: Hardcoded values per component (impossible to maintain at scale); Bulma's built-in dark mode (insufficient control over the palette).
**Spec**: Feature 015 (dark mode); enforced throughout

### ADR-004 — HashRouter over BrowserRouter
**Decision**: `react-router-dom` HashRouter for client-side routing.
**Rationale**: GitHub Pages serves static files — BrowserRouter requires server-side redirect configuration that GitHub Pages doesn't support. Hash routing works without server config.
**Rejected**: BrowserRouter (requires 404.html hack on GitHub Pages, fragile).
**Spec**: Feature 001

---

## Data

### ADR-005 — JSON data files in `public/data/`, fetched at runtime
**Decision**: Algorithm data served as static JSON from `public/data/`, fetched via `fetch()` on page load using `import.meta.env.BASE_URL`.
**Rationale**: Data can be updated without a code change or rebuild. Keeps bundle size down. Consistent pattern across OLL, PLL, F2L, competition data.
**Rejected**: Importing JSON directly into the bundle (increases bundle size; requires rebuild for data changes); external API (unnecessary complexity, no backend).
**Spec**: Feature 001; enforced throughout

### ADR-006 — Pure notation in data files; presentation in components
**Decision**: Algorithm JSON contains only raw notation strings. No `\n` line breaks, no markdown formatting, no display hints.
**Rationale**: Data and presentation concerns are separated. Multiple components can render the same algorithm differently (card, player, carousel thumbnail, move badges).
**Rejected**: Embedding display hints in JSON (couples data to a single rendering context; harder to maintain).
**Spec**: Feature 003; enforced throughout

### ADR-007 — Versioned localStorage envelopes for user preferences
**Decision**: All localStorage writes use a versioned envelope `{ version: N, data: ... }` with defensive validation on read.
**Rationale**: Stored data can become stale across app updates. The envelope allows safe migration and graceful fallback to defaults rather than crashes.
**Rejected**: Raw value storage (breaks silently on schema change); no persistence (loses user context between sessions).
**Spec**: Feature 005 (solve stats); Feature 015 (theme preference)

---

## Rendering & Integration

### ADR-008 — TwistyPlayer requires explicit px container dimensions at mount
**Decision**: All TwistyPlayer containers must have explicit `width` and `height` set via inline style at mount time — never rely on flex/auto sizing alone.
**Rationale**: TwistyPlayer gates canvas initialisation behind an `IntersectionObserver` that only fires when `intersectionRect.height > 0`. Zero-height containers at mount time produce a permanently blank canvas with no error. This constraint is undocumented in cubing.js.
**Rejected**: `setTimeout` workarounds (unreliable timing); body-append-then-move approach (doesn't fix the intersection issue).
**Spec**: Feature 018; documented in CLAUDE.md
**Superseded by**: ADR-020 (cubify-harness removes this constraint entirely)

### ADR-009 — Bulma bare `button` requires `is-light` in dark mode
**Decision**: All unstyled Bulma buttons (no variant class) must have `is-light` added explicitly.
**Rationale**: Bulma's bare `.button` renders with a black background in dark mode. `is-light` picks up the `--bulma-light-*` overrides defined in `index.css` for dark mode.
**Rejected**: Custom button reset CSS (fights Bulma specificity; fragile across Bulma updates).
**Spec**: Feature 018; documented in CLAUDE.md

### ADR-010 — TwistyPlayer control panel suppressed; custom controls built per feature
**Decision**: All TwistyPlayer instances use `controlPanel: 'none'`. Play/pause/speed controls are built fresh in each consuming component.
**Rationale**: The built-in control panel has poor UI/UX and cannot be styled via external CSS (shadow DOM). Custom controls integrate with the app's design system and can be tailored to context (visualizer vs. practice modal).
**Rejected**: Styling the built-in panel (blocked by shadow DOM); using the panel with CSS overrides (too fragile).
**Spec**: Feature 003, Feature 013

### ADR-011 — Headless Chromium requires `headless: false` for WebGL on macOS
**Decision**: The cubify agent skill runs Playwright with `headless: false`.
**Rationale**: Headless Chromium on macOS blocks WebGL regardless of flags. This is a macOS+Chromium platform constraint, not a page issue. `headless: false` launches a visible browser window which supports WebGL fully.
**Rejected**: All headless flags and WebGL software renderer attempts (none work reliably on macOS).
**Spec**: Feature 017; documented in CLAUDE.md
**Superseded by**: ADR-020 (cubify-harness CubeExporter uses OffscreenCanvas, no browser required)

### ADR-012 — Conditional rendering over CSS visibility toggling
**Decision**: Show/hide UI panels (carousel vs. dropdowns in VisualizerModal) via React conditional rendering, not CSS `display: none` / visibility classes.
**Rationale**: CSS class-based hiding was overridden by Bulma's own display rules, requiring `!important` escalation and mobile override complexity. Conditional rendering is unambiguous and debuggable.
**Rejected**: CSS `.is-desktop-hidden` class approach (Bulma specificity conflicts; required three layers of override to handle mobile fallback correctly).
**Spec**: Feature 019

---

## Library

### ADR-013 — cubing.js used for notation parsing only; rendering built fresh (cubify-harness)
**Decision**: `cubing.js` is retained as a dependency for `Alg`, `Move`, and `experimentalLeafMoves()` — WCA-compliant notation parsing. All rendering, animation, stickering, and export are built fresh in cubify-harness.
**Rationale**: The notation parsing in cubing.js is well-tested and WCA-compliant — not worth reinventing. The rendering layer (TwistyPlayer web component) is the source of all integration pain and is replaced entirely.
**Rejected**: Full cubing.js replacement including notation (high risk, low reward); keeping TwistyPlayer (perpetuates all documented integration constraints).
**Spec**: Feature 020

### ADR-014 — Three.js as the WebGL abstraction for cubify-harness
**Decision**: Three.js for 3D cube rendering in cubify-harness (subject to PoC validation).
**Rationale**: Well-maintained, excellent WebGL abstraction, OffscreenCanvas support for headless export, large community. Cube geometry (26 cubelets, 54 stickers) is simple enough that Three.js is appropriate, not overkill.
**Rejected**: Raw WebGL (significant implementation cost for geometry, normals, lighting); Babylon.js (larger bundle, less community).
**Spec**: Feature 020

### ADR-015 — Named CFOP stickering presets replace orbit mask strings
**Decision**: cubify-harness exposes `setStickering('oll' | 'pll' | 'f2l' | 'cross' | 'full')`. Orbit mask strings are an internal implementation detail.
**Rationale**: cubing.js stickering requires opaque strings like `EDGES:----OOOO----,CORNERS:----OOOO,CENTERS:------` with no documentation. These were reverse-engineered for each use. Named presets encode the intent, not the mechanism.
**Rejected**: Exposing orbit strings in the public API (perpetuates the undocumented format; forces every consumer to understand it).
**Spec**: Feature 020

---

## Process

### ADR-016 — Speckit workflow for every feature
**Decision**: Every feature follows: create branch → `/speckit.plan` → `/speckit.tasks` → implement → sign-off → merge.
**Rationale**: Features 018 and 019 were implemented without a branch, plan.md, or tasks.md, requiring retrospective artifact creation. The speckit artifacts are the source of truth for what was built and why — without them, context is lost across sessions.
**Rejected**: Ad-hoc implementation without planning artifacts (creates undocumented decisions, harder to resume across context resets).
**Spec**: Enforced from Feature 020 onwards; retrospective artifacts created for 018–019

### ADR-017 — Cross-cutting changes committed to main, not feature branches
**Decision**: CI config, CLAUDE.md, .gitignore, and other infrastructure changes go directly to main.
**Rationale**: These changes affect the whole project, not a single feature. Putting them on a feature branch creates merge conflicts and delays their availability to other branches.
**Rejected**: Infrastructure changes on feature branches (merge conflicts; delayed availability).
**Spec**: Project-wide convention

### ADR-018 — No loading state placeholders; data renders when ready
**Decision**: Pages and components render empty/blank until data is available. No skeleton loaders or spinners.
**Rationale**: The data files are small and load quickly on any connection. Loading states add complexity for marginal UX benefit given the data size. Error states (via ErrorBoundary) handle genuine failures.
**Rejected**: Skeleton loaders (premature complexity); global loading spinner (poor UX for fast loads — flicker effect).
**Spec**: Enforced throughout; noted in CLAUDE.md
