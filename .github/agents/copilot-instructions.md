# cubing.spec Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-07

## Active Technologies
- Browser `localStorage` (versioned JSON envelope) (005-track-solve-stats)
- TypeScript 5.9, React 19, Node/npm (Vite 7) + React, cubing (`Alg` parser compatibility), Vite, Bulma (006-fallback-scramble-generator)
- Browser `localStorage` (existing solve stats only; no new persistence) (006-fallback-scramble-generator)
- TypeScript 5.9, React 19 + `cubing` (TwistyPlayer + Alg), `react`, `react-dom`, `vite`, `bulma` (007-cube-image-generator)
- N/A (no persistence required) (007-cube-image-generator)
- TypeScript 5.9.3, React 19.2.0 + React Router DOM 7.1.4, Bulma 1.0.4, React Icons 5.6.0, React Markdown 10.1.0 (009-intuitive-methods)
- Static assets (PNG images) already available in `/cubing.spec/cfop-app/public/assets/cfop_bgr/` (009-intuitive-methods)
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
- 009-intuitive-methods: Added TypeScript 5.9.3, React 19.2.0 + React Router DOM 7.1.4, Bulma 1.0.4, React Icons 5.6.0, React Markdown 10.1.0
- 007-cube-image-generator: Added TypeScript 5.9, React 19 + `cubing` (TwistyPlayer + Alg), `react`, `react-dom`, `vite`, `bulma`
- 006-fallback-scramble-generator: Added TypeScript 5.9, React 19, Node/npm (Vite 7) + React, cubing (`Alg` parser compatibility), Vite, Bulma


<!-- MANUAL ADDITIONS START -->
- Theme consistency guardrail: In `cfop-app`, card/table surfaces should remain light (`#fff`-based) and readable even when OS/browser prefers dark mode. For every UI feature, verify `.box`, `.card`, and `.table` surfaces/text contrast do not shift to dark-theme defaults unless explicitly requested.
<!-- MANUAL ADDITIONS END -->
