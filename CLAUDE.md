# CLAUDE.md

Project context for Claude Code. See [.specify/memory/constitution.md](.specify/memory/constitution.md) for principles and [specs/spec.md](specs/spec.md) for the full feature ledger.

## Project Scope

- **Repo:** `cubing.spec` — a CFOP (Rubik's cube) learning companion
- **Primary app:** `cfop-app/` — React/TypeScript/Vite, deployed to GitHub Pages
- **Utility app:** `cubify-app/` — local-only cube image generator (PNG/SVG export)
- Ignore `cubing.react` and `cubing.static` unless explicitly requested

## Current Status

Features 001–022 complete. Cubify library series (023–031) in planning.

## cubify-harness — Ground Truth Reference

**Before writing any cube state, rendering, or animation code, read [`specs/cube-mapping-lessons.md`](specs/cube-mapping-lessons.md).**
For an explanation of face state and KPattern concepts, see [`specs/cube-concepts.md`](specs/cube-concepts.md).

It documents hard-won facts that took significant debugging to establish:

- cubing.js KPattern corner/edge slot ordering (§1–2) — the documented order is wrong; verified order is 0=URF
- Orientation formula: `(s - orientation + 3) % 3` for corners — NOT `(s + orientation) % 3` (§3)
- `stickerIndex` formulas for all 6 faces — U and D are easy to swap (§6)
- cubing.js `U`/`D` = WCA `U'`/`D'` — animation-only fix, do not translate state (§5)
- `faceCW` cycle direction trap — `[off,off+6,off+8,off+2]` is CCW, not CW (§9)
- Animation sequencing — never call `onDone` synchronously from inside the render tick (§7)
- Physical rendering architecture — bake colours once at `setState()`, never reassign after animation (§8)

## CSS Standards

- All custom properties defined in `cfop-app/src/index.css`: `--color-*`, `--space-*`, `--shadow-*`, `--radius-*`, `--gradient-*`
- No hardcoded `rgba()` or hex values in component/page CSS — use tokens only
- Shadow tokens: `--shadow-sm/md/lg/xl` for neutral shadows; `--shadow-accent` / `--shadow-accent-hover` for accent-blue button shadows
- Font weights: 400 (normal), 600 (semibold), 700 (bold) only
- Algorithm notation uses `font-family: inherit` (proportional Inter) — `<code>` elements need this explicitly to override the browser UA monospace default
- Section headings use `section-title` class for consistent banner styling across all pages
- Bulma's `.title + .subtitle` applies `margin-top: -1.25rem` — override explicitly with a scoped rule if more space is needed
- Shared `AlgorithmCard` component (`standard`, `compact`, `IntuitiveCaseCard` variants) for all algorithm displays

## Data / Presentation Separation

- Algorithm JSON (`public/data/*.json`) contains pure notation syntax only — no `\n` line breaks, no markdown (`**bold**`)
- Any presentation transformation (spacing, formatting) belongs in the component layer, not the data
- `react-markdown` has been removed; tooltip notes render as plain text

## Tech Stack (cfop-app)

React 19, TypeScript, Vite, Bulma CSS, cubing.js, react-router-dom

## Spec Workflow (Hybrid Model)

- `spec.md` = high-level narrative and canonical feature sequence ledger (source of truth for numbering)
- `specs/<NNN>-<kebab-name>/` = per-feature lifecycle artifacts:
  - `spec.md`, `checklists/requirements.md`, `implementation-summary.md`
- Next feature number must follow the sequence in `spec.md`
- Keep implementation summaries inside `specs/<feature-id>/`, not repo root
- Use lowercase kebab-case filenames (e.g. `implementation-summary.md`)

## Working Style

- Iterate in small steps; keep implementation details out of high-level spec unless intentionally promoted
- For maintenance/refactor: record a short pre-change scope note, then finalize after implementation
- Before any merge/push: run local production build + manual feature test pass + checklist sign-off

## Implementation Notes

- Use CSS custom properties from `index.css` for all new/updated styles
- Use shared `AlgorithmCard` component for algorithm displays
- localStorage uses versioned envelopes with defensive validation
- iPhone 16 (~393px CSS width) is the primary small-screen baseline for modal sizing
- All `fetch()` calls use `import.meta.env.BASE_URL + 'data/...'` — never hardcode `/cubing.spec/`
- Pages use `error` state + `throw error` to propagate fetch failures to `ErrorBoundary`; `WrEvolutionChart` follows the same pattern, wrapped in `ErrorBoundary` in `AboutPage`
- No loading state placeholders — data renders when ready, empty until then

## Local Dev Server (cfop-app)

```bash
cd cfop-app
# Check for existing Vite processes first:
ps aux | grep -i vite
npm run dev -- --host 127.0.0.1 --port 5173
# URL: http://127.0.0.1:5173/cubing.spec/
```

- Kill existing Vite processes before starting to avoid port conflicts
- Use foreground commands during active testing (avoid nohup/background)
- File renames or major changes may cause the dev server to exit — restart as needed

## Testing (cfop-app)

- Smoke tests via Playwright (`@playwright/test`), Chromium, runs against local dev server
- Test files in `cfop-app/e2e/`, config in `cfop-app/playwright.config.ts`
- Run: `cd cfop-app && npx playwright test`
- `test-results/` and `playwright-report/` are gitignored (failure traces and HTML reports)

## Active Technologies (cfop-app)

**Runtime**: TypeScript 5.9, React 19, Vite 7
**UI**: Bulma CSS 1.x, react-icons 5.x
**Routing**: react-router-dom 7.x (HashRouter)
**Visualisation**: cubing.js (TwistyPlayer), Recharts 3.x
**Testing**: @playwright/test (dev-only)
**Persistence**: localStorage (`cfop-theme` for dark mode; versioned envelopes for user prefs)

## Ecosystem Best Practices

Andy is not a React/Node specialist — proactively flag and fix ecosystem hygiene issues rather than waiting to be asked:

- **Node version**: pinned to 24 via `.nvmrc` and `deploy.yml`. If either drifts, align them.
- **GitHub Actions**: keep action versions current (e.g. `actions/checkout`, `actions/setup-node`). Watch for deprecation warnings in CI output and bump versions promptly.
- **npm packages**: flag any `npm audit` high/critical vulnerabilities when spotted. Minor version drift is fine; major version gaps on core packages (React, Vite, TypeScript) are worth a note.
- **CI/CD**: `deploy.yml` only builds and deploys — it does not run tests. Smoke tests are manual pre-merge. If a CI test step is added in future, it needs `npx playwright install chromium` before the test run.
- **Bundle size**: Vite warns when chunks exceed 500kB. The `cubing.js` 3D chunk (~511kB) and main bundle (~853kB) are known and acceptable for now — don't suppress the warning, but don't treat it as blocking.

## TwistyPlayer In-Browser Usage

TwistyPlayer gates canvas initialisation behind an `IntersectionObserver` — the 3D scene will not render unless `intersectionRect.height > 0` at mount time.

- **Always set explicit `width` and `height` px on the container** before or at the same time as appending the player. Without them the container has zero height, the intersection rect is empty, and the canvas never initialises. Use inline styles or fixed CSS `height` — flex/auto sizing alone is not enough.
- **Append directly, no delays** — `setTimeout` workarounds and body-append-then-move approaches do not reliably fix the intersection issue. Direct append to a sized container is the correct pattern (`VisualizerModal` is the reference implementation).
- **`overflow: auto/hidden` on ancestors** can affect intersection reporting — if a player appears blank inside a scrollable container, verify the container has explicit dimensions.
- **Bulma default `button` (no variant) renders black in dark mode** — always add `is-light` to unstyled buttons so they pick up `--bulma-light-*` overrides from `index.css`.

## Playwright / Web Component Automation

When automating or screenshotting a third-party web component (e.g. TwistyPlayer):

1. **Inspect structure first** — write a small throwaway script that dumps shadow root children, tag names, and bounding rects before attempting any manipulation. The solution is usually obvious once you can see the actual DOM tree.
2. **Clip to the visualization element, don't hide the chrome** — find the exact element that renders the content (canvas, SVG wrapper, etc.) and use `page.screenshot({ clip: rect })`. Trying to hide controls via API or CSS is fragile.
3. **Use `page.addInitScript()` for intercepts** — this runs before any page script including bundle load. Injecting intercepts inside the HTML `<script>` tag fires too late.
4. **`headless: false` required for WebGL on macOS** — headless Chromium blocks WebGL regardless of flags. This is a macOS+Chromium constraint, not a page issue.

See `specs/017-cubify-agent-skill/research.md` (learnings 1–9) for the full record of what was tried and why.

## cubify-scripts (017)

Standalone Node.js ESM skill for cube image generation. No build step.

- **Entry**: `cubify-scripts/cubify.mjs` — run directly with `node`
- **Skill**: `.claude/commands/cubify.md` — invoked as `/cubify` in Claude Code
- **Renderer**: `cubify-scripts/lib/renderer.mjs` — Playwright headful Chromium + esbuild IIFE bundle
- **Requires**: `headless: false` (WebGL blocked in headless Chromium on macOS); `npx playwright install chromium` from `cfop-app/`
- **Output**: `.claude/tmp/cubify/` within the repo (gitignored)
- **esbuild bundle**: cached at `/tmp/cubify-twisty-bundle.js`, rebuilt on first run per session

## Recent Changes
- 020-wr-legends-panel: sortable legends table alongside WR evolution chart; current record holders highlighted
- 021-probability-scoring: `prob` field (e.g. "1/54") and WCA case number surfaced on OLL/PLL cards and in the Visualizer modal
- 022-cubify-harness: completed — CubeState, CubeRenderer3D, CubeStickering, AlgParser, interactive harness, verify-perms suite

