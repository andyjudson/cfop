# CLAUDE.md

Project context for Claude Code. See [.specify/memory/constitution.md](.specify/memory/constitution.md) for principles and [specs/spec.md](specs/spec.md) for the full feature ledger.

## Project Scope

- **Repo:** `cubing.spec` — a CFOP (Rubik's cube) learning companion
- **Primary app:** `cfop-app/` — React/TypeScript/Vite, deployed to GitHub Pages
- **Utility app:** `cubify-app/` — local-only cube image generator (PNG/SVG export)
- Ignore `cubing.react` and `cubing.static` unless explicitly requested

## Current Status

Features 001–010 complete. CSS baseline refined. Ready for next net-new feature.

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
- Shared data/assets via symlinks from `shared-data/` and `shared-assets/`; do not copy into app folders
- localStorage uses versioned envelopes with defensive validation
- iPhone 16 (~393px CSS width) is the primary small-screen baseline for modal sizing

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
