# Quickstart — Validate Feature 005

## Prerequisites

- Node.js available.
- Workspace root is `cubing.spec`.
- Feature 004 practice modal is already functioning.

## Run Locally

1. Open `cfop-app`.
2. Install dependencies if needed.
3. Start development server.
4. Open app and launch Practice Session modal.

## Manual Validation Checklist

### Persistence
- [ ] Complete one solve and confirm `Last time` updates.
- [ ] Refresh/reopen app and confirm `Last time` persists.
- [ ] Complete multiple solves and confirm persisted values survive modal close/open.

### Stats Calculation
- [ ] With 1–4 solves, `Average (last 5)` shows clear partial/empty state.
- [ ] After 5+ solves, `Average (last 5)` equals mean of most recent five solve times.
- [ ] `Best time` remains unchanged on slower solve additions.
- [ ] `Best time` updates when a faster solve is recorded.

### Robustness
- [ ] Invalid/corrupt local storage payload does not crash practice modal.
- [ ] Invalid persisted solve entries are ignored for stats.
- [ ] Timer and scramble behavior from Feature 004 remains unchanged.

## Build Verification

- Run app build and confirm no TypeScript/build failures.
