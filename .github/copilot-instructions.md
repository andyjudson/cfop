# Copilot Instructions (Current Work)

## Scope
- Primary project: `cubing.spec`
- Current implementation target: `cubing.spec/cfop-app`
- Ignore `cubing.react` and `cubing.static` unless explicitly requested.

## Current Status
- Features 001, 002, 003, 004, and 005 completed in `spec.md`:
  - Feature 001: Learning 2-look beginner cases grid ✅
  - Feature 002: Algorithm notes on hover with tooltips ✅
  - Feature 003: Cubing.js solve visualization player modal ✅
  - Feature 004: Practice scramble + solve timer modal ✅
  - Feature 005: Persistent solve time stats with localStorage ✅
- Ready for Feature 006 specification via speckit.specify workflow

## Resource usage
- Reuse shared resources from `cubing.spec/shared-data` and `cubing.spec/shared-assets`
- Prefer symlinks; do not copy shared assets/data into app folders

## Working style
- Iterate in small steps
- Keep implementation details out of high-level spec unless promoted intentionally
- Treat `legacy-projects.md` as historical project context only
- Keep `specs/` feature numbering aligned with the feature sequence tracked in `spec.md` (current next feature is 006)
- Keep feature implementation summaries inside that feature's `specs/<feature-id>/` folder (not repo root)
- Use clean lowercase kebab-case filenames for summaries, e.g. `implementation-summary.md`
- Avoid uppercase or "shouting" summary filenames
- Before any merge/push step, require a local validation gate:
  - run local production build
  - run manual feature test pass in local instance
  - perform a brief manual review/checklist sign-off
- Merge/push only after the local validation gate passes

## Implementation Notes
- Use shared resources via symlinks
- Start with static grid, add interactivity iteratively
- Focus on clean code and maintainable structure
- Test on mobile devices early
- Modal dialog should use consistent styling, be responsive, and support keyboard navigation where logical e.g. start-stop or play-pause controls
- localStorage persistence uses versioned envelopes with defensive validation