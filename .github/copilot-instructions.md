# Copilot Instructions

## Scope
- Primary project: `cubing.spec`
- Current implementation target: `cubing.spec/cfop-app`
- Ignore `cubing.react` and `cubing.static` unless explicitly requested.

## Current Status
- Features 001 through 010 are implemented in `cfop-app` and tracked in specs artifacts.
- CSS baseline refined (March 2026):
  - Design token system in `index.css`: `--color-*`, `--space-*`, `--shadow-*`, `--radius-*`, `--gradient-*`
  - No hardcoded `rgba()` or hex values in CSS — tokens only; `--shadow-accent`/`--shadow-accent-hover` for accent-blue shadows
  - Algorithm notation uses `font-family: inherit` (proportional Inter, not monospace)
  - `react-markdown` removed; tooltip notes are plain text; JSON data is pure syntax (no `\n`, no markdown)
  - All pages use `section-title` class on section headings for consistent banner styling
- Ready for next net-new feature specification.

## Resource usage
- Reuse shared resources from `cubing.spec/shared-data` and `cubing.spec/shared-assets`
- Prefer symlinks; do not copy shared assets/data into app folders

## Working style
- Iterate in small steps
- Keep implementation details out of high-level spec unless promoted intentionally
- Treat `legacy-projects.md` as historical project context only
- Keep `specs/` feature numbering aligned with the feature sequence tracked in `spec.md` (next available number only)
- Keep feature implementation summaries inside that feature's `specs/<feature-id>/` folder (not repo root)
- Use clean lowercase kebab-case filenames for summaries, e.g. `implementation-summary.md`
- Avoid uppercase or "shouting" summary filenames
- Use a hybrid spec pattern:
  - `spec.md` = high-level narrative and canonical feature sequence ledger
  - `specs/<NNN>-<name>/` = per-feature lifecycle artifacts (`spec.md`, `checklists/requirements.md`, `implementation-summary.md`)
  - Retrospective backfill is acceptable for older features that predate folder-based artifacts, and should be labeled clearly
- Before any merge/push step, require a local validation gate:
  - run local production build
  - run manual feature test pass in local instance
  - perform a brief manual review/checklist sign-off
- Merge/push only after the local validation gate passes
- For maintenance/refactor work, record a short pre-change scope note first, then finalize guidance after implementation.

## Implementation Notes
- Use shared resources via symlinks
- Use shared `AlgorithmCard` component for algorithm displays (`standard`, `compact`, and `IntuitiveCaseCard` variants)
- Use CSS custom properties from `index.css` for all styles — no hardcoded `rgba()` or hex values
- Font weights: 400 (normal), 600 (semibold), 700 (bold) only
- Algorithm notation: `font-family: inherit` on `<code>` elements (proportional Inter; explicit inherit required to override browser UA monospace default)
- Algorithm JSON: pure notation syntax only — no `\n` line breaks, no markdown formatting
- Section headings use `section-title` class for consistent banner across all pages
- Bulma `.title + .subtitle` has a built-in negative margin — override with a scoped rule if spacing adjustment needed
- Start with static grid, add interactivity iteratively
- Focus on clean code and maintainable structure
- Test on mobile devices early
- Use iPhone 16 (standard size, ~393px CSS width) as the primary small-screen baseline for modal sizing and typography tuning
- Modal dialog should use consistent styling, be responsive, and support keyboard navigation where logical e.g. start-stop or play-pause controls
- localStorage persistence uses versioned envelopes with defensive validation

## Local Development Server
- Before starting dev server, check for existing Vite processes: `ps aux | grep -i vite`
- Kill existing processes before starting new ones to avoid port conflicts
- Use simple foreground commands during active testing: `npm run dev -- --host 127.0.0.1 --port 5173`
- Avoid nohup/background processes during manual test phases - harder to manage and diagnose
- File renames or major code changes may cause dev server to exit - restart as needed
- Default dev server URL: http://127.0.0.1:5173/cubing.spec/