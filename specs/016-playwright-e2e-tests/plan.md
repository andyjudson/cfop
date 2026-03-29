# Implementation Plan: Playwright E2E Test Suite

**Branch**: `016-playwright-e2e-tests` | **Date**: 2026-03-29 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/016-playwright-e2e-tests/spec.md`

## Summary

Add a focused Playwright E2E test suite to `cfop-app/` covering 6 user journey areas: page navigation, mobile nav, practice timer (standard + champion), algorithm visualiser modal, and WR chart. Install `@playwright/test` as a dev dependency. Use Playwright's `webServer` config to manage the Vite dev server automatically. Chromium only. One spec file per feature area.

## Technical Context

**Language/Version**: TypeScript 5.9
**Primary Dependencies**: `@playwright/test` (new, dev-only); existing: Vite 7, React 19, react-router-dom 7 (HashRouter)
**Storage**: N/A
**Testing**: `@playwright/test` — Playwright E2E only, no unit tests
**Target Platform**: Local macOS dev environment; Chromium browser
**Project Type**: Web application test suite
**Performance Goals**: Full suite completes in under 60 seconds
**Constraints**: Tests must not require a manually running dev server; HashRouter hash-based routes; Vite base `/cubing.spec/`
**Scale/Scope**: 5 spec files, ~15–20 individual tests total

## Constitution Check

| Gate | Status | Notes |
|------|--------|-------|
| Educational focus | ✅ Pass | Tests support quality of the learning app |
| TypeScript | ✅ Pass | All test files in TypeScript |
| Minimal dependencies | ✅ Pass | Single new dev dep: `@playwright/test` |
| No server-side requirements | ✅ Pass | Tests run against static Vite dev server |
| Modern web standards | ✅ Pass | Playwright is the current industry standard for E2E |

No violations. No complexity tracking required.

## Project Structure

### Documentation (this feature)

```text
specs/016-playwright-e2e-tests/
├── plan.md              # This file
├── research.md          # Phase 0 — decisions on setup, selectors, browser
├── quickstart.md        # Phase 1 — how to run the suite
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code

```text
cfop-app/
├── e2e/
│   ├── navigation.spec.ts        # US1: page load + nav links
│   ├── mobile-nav.spec.ts        # US2: hamburger + icon group at 393px
│   ├── practice-timer.spec.ts    # US3 + US4: standard mode + champion mode
│   ├── visualiser-modal.spec.ts  # US5: modal open/close + container present
│   └── wr-chart.spec.ts          # US6: chart renders, no error state
├── playwright.config.ts          # baseURL, webServer, browser config
└── package.json                  # add @playwright/test to devDependencies
```

## Implementation Notes

### playwright.config.ts

Key config values:
- `baseURL`: `http://127.0.0.1:5173/cubing.spec/`
- `webServer.command`: `npm run dev -- --host 127.0.0.1 --port 5173`
- `webServer.url`: `http://127.0.0.1:5173/cubing.spec/`
- `webServer.reuseExistingServer`: `true` (avoids port conflicts if server already running)
- Browser: Chromium only
- `testDir`: `./e2e`

### Route navigation

HashRouter routes navigate via `page.goto('/#/oll')`, `page.goto('/#/pll')` etc. The full URL becomes `http://127.0.0.1:5173/cubing.spec/#/oll`.

### Selector approach

Use existing CSS classes and ARIA roles where possible:
- Navbar: `.cfop-navbar`, `.cfop-nav-icons`, `.navbar-burger`
- Algorithm cards: `.algorithm-card` or role-based
- Practice modal: opened via `.cfop-theme-toggle[aria-label="Open practice timer"]`
- Visualiser modal: opened via `.cfop-theme-toggle[aria-label="Open algorithm visualizer"]`

Reserve `data-testid` only for elements with no reliable semantic anchor.

### practice-timer.spec.ts notes

- Standard mode: assert scramble text is present, dispatch `keydown` spacebar to start, wait briefly, dispatch again to stop, assert a time value appears in stats
- Champion mode: click mode toggle, wait for competition name to appear, assert scramble text visible
- Use `page.waitForSelector` with a timeout for async data loads

### wr-chart.spec.ts notes

- Wait for the chart SVG or Recharts container to appear
- Assert no `.wr-chart-error` element is present
- The chart renders after a fetch so use `waitForSelector` not immediate assertion
