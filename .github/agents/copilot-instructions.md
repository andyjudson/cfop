# cfop Development Guidelines

## Scope

- Primary project: `cfop` — a CFOP (Rubik's cube) learning companion
- Current implementation target: `cfop-app/` — React/TypeScript/Vite, deployed to GitHub Pages
- Utility app: `cubify-app/` — local-only cube image generator (PNG/SVG export)
- Ignore `cubing.react` and `cubing.static` unless explicitly requested

## Current Status

Features 001–015 complete. 016 (Playwright E2E) in progress.

## Tech Stack (cfop-app)

**Runtime**: TypeScript 5.9, React 19, Vite 7
**UI**: Bulma CSS 1.x, react-icons 5.x
**Routing**: react-router-dom 7.x (HashRouter)
**Visualisation**: cubing.js (TwistyPlayer), Recharts 3.x
**Testing**: @playwright/test (dev-only)
**Persistence**: localStorage (`cfop-theme` for dark mode; versioned envelopes for user prefs)

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
- Any presentation transformation belongs in the component layer, not the data
- `react-markdown` has been removed; tooltip notes render as plain text

## Implementation Notes

- Use CSS custom properties from `index.css` for all new/updated styles
- Use shared `AlgorithmCard` component for algorithm displays
- localStorage uses versioned envelopes with defensive validation
- iPhone 16 (~393px CSS width) is the primary small-screen baseline for modal sizing
- All `fetch()` calls use `import.meta.env.BASE_URL + 'data/...'` — never hardcode `/cfop/`
- Pages use `error` state + `throw error` to propagate fetch failures to `ErrorBoundary`; `WrEvolutionChart` follows the same pattern, wrapped in `ErrorBoundary` in `AboutPage`
- No loading state placeholders — data renders when ready, empty until then
- Dark mode is implemented via `cfop-theme` localStorage key and CSS token overrides — do not rely on OS/browser `prefers-color-scheme`; all theme surfaces must use `--color-*` tokens

## Testing (cfop-app)

- E2E only — Playwright (`@playwright/test`), Chromium, runs against local dev server
- Test files in `cfop-app/e2e/`, config in `cfop-app/playwright.config.ts`
- Run: `cd cfop-app && npx playwright test`

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
