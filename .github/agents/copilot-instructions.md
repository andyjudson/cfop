# cubing.spec Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-07

## Active Technologies
- Browser `localStorage` (versioned JSON envelope) (005-track-solve-stats)
- TypeScript 5.9, React 19, Node/npm (Vite 7) + React, cubing (`Alg` parser compatibility), Vite, Bulma (006-fallback-scramble-generator)
- Browser `localStorage` (existing solve stats only; no new persistence) (006-fallback-scramble-generator)
- TypeScript 5.9, React 19 + `cubing` (TwistyPlayer + Alg), `react`, `react-dom`, `vite`, `bulma` (007-cube-image-generator)
- N/A (no persistence required) (007-cube-image-generator)
- TypeScript 5.x + React 19 + React Router, Bulma CSS, existing `cfop-app` components (`CfopPageLayout`, existing navbar) (010-notation-reference)
- Static asset files under `cfop-app/public/assets/notation` (no new persistence) (010-notation-reference)

- TypeScript 5.9 (React 19) + React, Vite, `cubing`, Bulma, `react-icons` (004-add-scramble-timer)

## Project Structure

```text
cfop-app/
specs/
shared-assets/
shared-data/
```

## Commands

npm --prefix cfop-app run dev
npm --prefix cfop-app run build

## Code Style

TypeScript 5.9 (React 19): Follow standard conventions

## Recent Changes
- 010-notation-reference: Added TypeScript 5.x + React 19 + React Router, Bulma CSS, existing `cfop-app` components (`CfopPageLayout`, existing navbar)
- 007-cube-image-generator: Added TypeScript 5.9, React 19 + `cubing` (TwistyPlayer + Alg), `react`, `react-dom`, `vite`, `bulma`
- 006-fallback-scramble-generator: Added TypeScript 5.9, React 19, Node/npm (Vite 7) + React, cubing (`Alg` parser compatibility), Vite, Bulma


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
