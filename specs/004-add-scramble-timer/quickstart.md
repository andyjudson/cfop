# Quickstart — Validate Feature 004

## Prerequisites

- Node.js environment available.
- Workspace root: `cubing.spec`.

## Run Locally

1. Open project folder `cfop-app`.
2. Install dependencies if needed.
3. Start development server.
4. Open app in browser.

## Manual Validation Checklist

### Scramble flow
- [x] A scramble is visible on initial load (or can be generated with one button press).
- [x] Pressing `New Scramble` replaces the displayed scramble.
- [x] Repeated presses produce new scramble values and do not break layout.

### Timer flow
- [x] Timer is initially idle with a clear starting value.
- [x] Pressing `Start` begins increasing elapsed time.
- [x] Pressing `Stop` freezes elapsed time and shows final result.
- [x] Pressing `Start` again starts a new attempt from zero.
- [x] Pressing `Space` in the open practice modal toggles timer start/stop.

### Conflict handling
- [x] Rapid repeated `Start/Stop` interactions do not create inconsistent states.
- [x] While timer is running, pressing `New Scramble` does not change the active scramble and gives clear feedback.
- [x] Pressing `Space` in the open practice modal does not scroll the background page.

### Regression checks
- [x] Existing algorithm grid renders as before.
- [x] Tooltip behavior still works.
- [x] Demo modal still opens and functions.

## Build Verification

- Run project build and confirm no TypeScript/build failures.

## Implementation Run Notes

- 2026-03-07: `npm run build` executed in `cfop-app` and completed successfully.
- 2026-03-07: Manual browser verification completed during interactive review.

## Manual Validation Outcome (2026-03-07)

- Practice modal opens/closes correctly from the main page.
- Random scramble generation works on open and on demand via `New Scramble`.
- Timer start/stop/reset behavior works and remains stable under rapid interaction.
- Running-state scramble protection works with non-blocking feedback.
- Scramble line wrapping and spacing adjustments verified visually.
- Main page subtitle spacing tweak under header verified visually.
- Space key toggles timer and prevents background page scroll while modal is open.
