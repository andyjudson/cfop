# Research: Playwright E2E Test Suite

**Feature**: 016-playwright-e2e-tests
**Date**: 2026-03-29

## Decision 1: Playwright Installation Location

**Decision**: Install `@playwright/test` as a dev dependency inside `cfop-app/`, co-located with the app.

**Rationale**: Tests are tightly coupled to the app's routes, components, and data. Co-location keeps the test config and source in the same package, simplifies `package.json` scripts, and avoids a separate root-level test package.

**Alternatives considered**: Installing at repo root — rejected because it would require path config to reach `cfop-app/` assets and complicates the existing pre-push hook structure.

---

## Decision 2: Dev Server Management

**Decision**: Use Playwright's `webServer` config to auto-start and stop the Vite dev server for each test run.

**Rationale**: Playwright's built-in `webServer` option starts the dev server before tests and tears it down after, eliminating the need to manually manage the process. The existing dev command (`vite --host 127.0.0.1 --port 5173`) maps cleanly to this config.

**Alternatives considered**: Requiring a manually running dev server — rejected as fragile and error-prone; tests would fail silently if the server wasn't running.

---

## Decision 3: Base URL and HashRouter Navigation

**Decision**: Set `baseURL` to `http://127.0.0.1:5173/cubing.spec/` in playwright.config.ts. Navigate to hash routes using `page.goto('/#/oll')` etc.

**Rationale**: The app uses HashRouter (react-router-dom), so all routes are hash-based (e.g. `/#/oll`, `/#/pll`). Playwright's `page.goto` handles hash URLs correctly. The Vite base is `/cubing.spec/`, so the full dev URL is `http://127.0.0.1:5173/cubing.spec/`.

**Alternatives considered**: Clicking nav links to navigate — useful for nav tests but too slow for page-content tests where direct URL navigation is faster and more reliable.

---

## Decision 4: Test Selectors Strategy

**Decision**: Use semantic selectors (ARIA roles, text content, CSS classes) rather than adding `data-testid` attributes throughout the codebase.

**Rationale**: The app is small and stable; its existing class names (e.g. `.cfop-navbar`, `.navbar-burger`, `.cfop-nav-icons`) and text content are reliable anchors. Adding `data-testid` everywhere would mean touching many components with no user-facing benefit. Reserve `data-testid` for cases where no semantic selector exists.

**Alternatives considered**: Full `data-testid` coverage — rejected as over-engineering for a personal project at this scale.

---

## Decision 5: Browser Target

**Decision**: Chromium only for local test runs.

**Rationale**: The app targets Safari (iOS) in production but cross-browser E2E testing at this scale adds run time with minimal regression value. Chromium is the fastest Playwright browser and catches the vast majority of JS/layout regressions. Mobile viewport is simulated in Chromium rather than requiring a separate WebKit runner.

**Alternatives considered**: WebKit for Safari parity — can be added later if Safari-specific bugs emerge; not needed for initial suite.

---

## Decision 6: Test File Structure

**Decision**: One spec file per feature area in `cfop-app/e2e/`.

**Rationale**: Matches the spec's FR-008 (small, focused suite). Each file is independently runnable. Maps directly to the 6 user stories in the spec.

**File plan**:
- `e2e/navigation.spec.ts` — page load and nav links (US1)
- `e2e/mobile-nav.spec.ts` — hamburger and icon group (US2)
- `e2e/practice-timer.spec.ts` — standard mode + champion mode (US3 + US4)
- `e2e/visualiser-modal.spec.ts` — modal open/close (US5)
- `e2e/wr-chart.spec.ts` — chart render (US6)
