# Quickstart: Running the E2E Test Suite

## Prerequisites

- Node.js installed
- Run `npm install` inside `cfop-app/` (installs Playwright)
- Run `npx playwright install chromium` inside `cfop-app/` (one-time browser download)

## Run all tests

```bash
cd cfop-app
npx playwright test
```

Playwright will auto-start the Vite dev server, run all tests, then shut it down.

## Run a single file

```bash
cd cfop-app
npx playwright test e2e/navigation.spec.ts
```

## Run with UI mode (headed, interactive)

```bash
cd cfop-app
npx playwright test --ui
```

## View last test report

```bash
cd cfop-app
npx playwright show-report
```

## File locations

| File | Purpose |
|------|---------|
| `cfop-app/playwright.config.ts` | Playwright configuration (baseURL, webServer, browser) |
| `cfop-app/e2e/navigation.spec.ts` | Page load and nav link tests |
| `cfop-app/e2e/mobile-nav.spec.ts` | Mobile navbar tests |
| `cfop-app/e2e/practice-timer.spec.ts` | Practice timer (standard + champion mode) |
| `cfop-app/e2e/visualiser-modal.spec.ts` | Algorithm visualiser modal |
| `cfop-app/e2e/wr-chart.spec.ts` | WR evolution chart |
