# CLAUDE.md

Project context for Claude Code. See `specs/spec.md` for the feature ledger.

## Project Scope

- **Repo:** `cfop` — a CFOP (Rubik's cube) learning companion
- **Primary app:** `cfop-app/` — React/TypeScript/Vite, deployed to GitHub Pages at `andyjudson.github.io/cfop/`

## Current Status

Features 001–023 complete. Feature 022 replaced TwistyPlayer with cubify across the app. Feature 023 added the wca-refresh CLI and refreshed all three WCA data files.

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

React 19, TypeScript, Vite, Bulma CSS, cubing.js, cubify, react-router-dom

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
- iPhone 16 (~393px CSS width) is the primary small-screen baseline; both modals (`VisualizerModal`, `PracticeSessionModal`) go full-screen (100% width/height, no border-radius) at `max-width: 600px`
- All `fetch()` calls use `import.meta.env.BASE_URL + 'data/...'` — never hardcode `/cfop/`
- Pages use `error` state + `throw error` to propagate fetch failures to `ErrorBoundary`; `WrEvolutionChart` follows the same pattern, wrapped in `ErrorBoundary` in `AboutPage`
- No loading state placeholders — data renders when ready, empty until then

## Local Dev Server (cfop-app)

```bash
cd cfop-app
# Check for existing Vite processes first:
ps aux | grep -i vite
npm run dev -- --host 127.0.0.1 --port 5173
# URL: http://127.0.0.1:5173/cfop/
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
**Visualisation**: cubify (`CubePlayerComponent`/`CubeStateComponent`/`CubeMoveTape`/`CubePlayerControls`), Recharts 3.x
**Testing**: @playwright/test (dev-only)
**Persistence**: localStorage (`cfop-theme` for dark mode; versioned envelopes for user prefs)

## Ecosystem Best Practices

Andy is not a React/Node specialist — proactively flag and fix ecosystem hygiene issues rather than waiting to be asked:

- **Node version**: pinned to 24 via `.nvmrc` and `deploy.yml`. If either drifts, align them.
- **GitHub Actions**: keep action versions current (e.g. `actions/checkout`, `actions/setup-node`). Watch for deprecation warnings in CI output and bump versions promptly.
- **npm packages**: flag any `npm audit` high/critical vulnerabilities when spotted. Minor version drift is fine; major version gaps on core packages (React, Vite, TypeScript) are worth a note.
- **CI/CD**: `deploy.yml` only builds and deploys — it does not run tests. Smoke tests are manual pre-merge. If a CI test step is added in future, it needs `npx playwright install chromium` before the test run.
- **Bundle size**: Vite warns when chunks exceed 500kB. The `cubing.js` 3D chunk (~511kB) and main bundle (~853kB) are known and acceptable for now — don't suppress the warning, but don't treat it as blocking.

## cubify Integration (`src/lib/cubify/`)

Published as `@andyjudson/cubify` + `@andyjudson/cubify-react` on GitHub Packages. For local dev, `CUBIFY_LOCAL=1` in `cfop-app/.env.local` activates a Vite alias to `../cubify/src/` (live HMR, no build step). React wrappers:

| Component | Props |
|-----------|-------|
| `<CubePlayerComponent>` | `alg`, `setup`, `stickering`, `theme`, `playing`, `speed`, `style`; events `onMove`, `onReset`, `onComplete`; ref `reset()`, `resetCamera()` |
| `<CubePlayerControls>` | `playing`, `stepIndex`, `moveCount`, `size` (`'md'`\|`'sm'`); callbacks `onPlayToggle`, `onReset`, `onStepBackward`, `onStepForward`, `onCameraReset`; no `onSpeedChange` — speed is consumer-owned |
| `<CubeMoveTape>` | `moves`, `stepIndex` — responsive row sizes (12/row desktop, 9/row mobile); active/done highlight |
| `<CubeStateComponent>` | `alg`, `setup`, `stickering`, `theme`, `style` — static snapshot, no animation |

- `CubeState.setupFromAlg(alg, rotation?)` computes the inverse setup string from an alg + optional whole-cube rotation prefix
- Transparent canvas: Three.js `setClearColor(0x000000, 0)` — blends with any page background


## WCA Data Refresh (`scripts/wca-refresh/`)

Python CLI that downloads the WCA public export and regenerates three NDJSON files in `cfop-app/public/data/`. Managed with `uv`.

```bash
cd scripts/wca-refresh
uv sync                          # first time
uv run wca-refresh               # download if stale + regenerate all files
uv run wca-refresh --no-download # use existing cache (fast)
uv run wca-refresh --force       # force re-download
uv run wca-refresh --dry-run     # transforms only, no file writes
```

**Output files:**
- `wca-wr-evolution.json` — one record per WR-setting event; `competition_date` in Unix ms
- `wca-wr-legends.json` — one record per person who has held a WR; `last_wr_date` in Unix ms
- `wca-beat-the-champion.json` — finals results + scrambles for WR comps and championships; `competition_date` in Unix ms; sorted by `competition_date` descending

**Cache:** `scripts/wca-refresh/.cache/` (gitignored, ~300MB). Staleness detected via HTTP HEAD on the WCA export URL — the redirect `Location` header embeds a timestamp.

**Also available as the `/refresh-wca` Claude Code skill** (`.claude/commands/refresh-wca.md`), and as a monthly GitHub Actions cron (`.github/workflows/refresh-wca.yml`).

## Recent Changes
- refactor-architecture (complete): upgraded to `@andyjudson/cubify` v1.3.11 (`CubeSolverCfop` renamed from `CfopSolver`, `CubeSolverKociemba` from `CubeSolver`, `CubeSolverInterface<T>` added). `CubifyPage` — CFOP solver state extracted to `useCfopSolve` hook (`src/hooks/useCfopSolve.ts`); `AlgParser.parse` wrapped in `useMemo`; speed clamping extracted to `src/utils/speed.ts`.
- post-022 enhancements (ongoing): `VisualizerModal` — case carousel (`CaseCarousel`) with group separators, 2-Look/full OLL/full PLL set switching, full-screen on mobile. `CubifyPage` — WCA random-state scramble (`CubeScramble.wca()`) + Kociemba solve (`CubeSolver`) with pre-warmed scramble cache (`scrambleCache.ts`); secondary controls row (speed, scramble, solve) with `.cubify-controls-secondary`/`.cubify-controls-separator` classes; separators hidden on mobile. Both modals full-screen at ≤600px. Published as v1.3.7.
- 023-wca-data-refresh: `scripts/wca-refresh/` uv CLI; all three WCA data files refreshed to May 2026 export; beat-the-champion adds `competition_date`, `month`, `day`; WrLegendsTable filter fixed for current WR holders with 1 WR; date units fixed to proper Unix ms
- 022-cubify-migration: full replacement of TwistyPlayer with cubify; `<CubePlayer>`, `<CubeState>`, `<CubeMoveTape>`, `<CubePlayerControls>`; published as `@andyjudson/cubify` + `@andyjudson/cubify-react`

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/025-cfop-case-arrows/plan.md
<!-- SPECKIT END -->
