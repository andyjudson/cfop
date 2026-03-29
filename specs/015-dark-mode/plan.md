# Implementation Plan: Dark Mode

**Branch**: `015-dark-mode` | **Date**: 2026-03-28 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/015-dark-mode/spec.md`

## Summary

Add dark mode to the CFOP app via a CSS custom property token remap, controlled by a `data-theme="dark"` attribute on `<html>`. A navbar toggle button (moon/sun icons) lets users switch theme instantly, with preference persisted to localStorage. FOUC is prevented by an inline script in `index.html`. A prerequisite pass tokenises the two modal CSS files that still contain hardcoded colour values.

## Technical Context

**Language/Version**: TypeScript 5.9 / React 19 / Vite 7
**Primary Dependencies**: Bulma CSS 1.x, react-icons/md (existing — `MdDarkMode`, `MdLightMode`); no new dependencies
**Storage**: `localStorage` key `cfop-theme` (`'light' | 'dark'`)
**Testing**: Manual visual review across all pages and breakpoints
**Target Platform**: Web (GitHub Pages, static); macOS Safari / iOS Safari primary
**Project Type**: Web application (single-page, static hosting)
**Performance Goals**: Theme switch imperceptible (<16ms, single attribute set)
**Constraints**: No new dependencies; no SSR; FOUC must be prevented on return visits
**Scale/Scope**: One new hook, one inline script, token additions to index.css, two CSS files tokenised, one nav component updated

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| Supports CFOP learning goal | ✓ PASS | Dark mode improves usability during practice sessions |
| No new heavy dependencies | ✓ PASS | Uses existing react-icons; zero new packages |
| Minimal, maintainable approach | ✓ PASS | CSS token remap; no CSS-in-JS runtime |
| No social/account features | ✓ PASS | localStorage preference only, no user accounts |
| Static hosting compatible | ✓ PASS | Inline script + localStorage, no server required |
| Offline capable | ✓ PASS | Fully client-side |

No violations. Complexity tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/015-dark-mode/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── theme-toggle.md  ← Phase 1 output
└── tasks.md             ← Phase 2 output (/speckit.tasks)
```

### Source Code

```text
cfop-app/
├── index.html                                   # Add FOUC-prevention inline script
└── src/
    ├── index.css                                # Add [data-theme="dark"] token block
    ├── hooks/
    │   └── useTheme.ts                          # NEW: theme state, persistence, OS detection
    └── components/
        ├── CfopNavigation.tsx                   # Add theme toggle button
        ├── PracticeSessionModal.css             # Tokenise hardcoded colours (prerequisite)
        └── VisualizerModal.css                  # Tokenise hardcoded colours (prerequisite)
```

**Structure Decision**: Single `cfop-app` project. All changes are in `src/` and `index.html`. No new directories beyond `hooks/` which already exists.
