# Copilot Instructions (Current Work)

## Scope
- Primary project: `cubing.spec`
- Current implementation target: `cubing.spec/new-cubing-site`
- Ignore `cubing.react` and `cubing.static` unless explicitly requested.

## Current Status
- Features 001, 002, and 003 completed in `spec.md`:
  - Feature 001: 2-look beginner cases grid with essentials section ✅
  - Feature 002: Algorithm notes on hover with tooltips ✅
  - Feature 003: Cubing.js demo modal with TwistyPlayer ✅
- Ready for Feature 004 specification via speckit.specify workflow

## Resource usage
- Reuse shared resources from `cubing.spec/shared-data` and `cubing.spec/shared-assets`
- Prefer symlinks; do not copy shared assets/data into app folders

## Working style
- Iterate in small steps
- Keep implementation details out of high-level spec unless promoted intentionally
- Treat `legacy.md` as historical project context only
- Keep `specs/` feature numbering aligned with the feature sequence tracked in `spec.md` (current next feature is 004)

## Implementation Notes
- Use shared resources via symlinks
- Start with static grid, add interactivity iteratively
- Focus on clean code and maintainable structure
- Test on mobile devices early