# CLAUDE.md

Project context for Claude Code. See [.specify/memory/constitution.md](.specify/memory/constitution.md) for principles and [specs/spec.md](specs/spec.md) for the full feature ledger.

## Project Scope

- **Repo:** `cubing.spec` — a CFOP (Rubik's cube) learning companion
- **Primary app:** `cfop-app/` — React/TypeScript/Vite, deployed to GitHub Pages
- **Utility app:** `cubify-app/` — local-only cube image generator (PNG/SVG export)
- Ignore `cubing.react` and `cubing.static` unless explicitly requested

## Current Status

Features 001–010 complete. Feature 011 (CSS cleanup/design token system) under active refinement. Ready for next net-new feature.

CSS standards established in 011:
- 60+ CSS custom properties in `cfop-app/src/index.css` (`--color-*`, `--space-*`, `--font-*`, `--shadow-*`, `--radius-*`, `--gradient-*`)
- Shared `AlgorithmCard` component with `standard`, `compact`, and `IntuitiveCaseCard` variants
- Font weights: 400 (normal), 600 (semibold), 700 (bold) only

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
