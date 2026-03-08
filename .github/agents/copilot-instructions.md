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
- TypeScript (~5.9), React 19 + React Router DOM, Bulma, React Icons (existing stack only) (009-intuitive-methods)
- Static assets from `cfop-app/public/assets/cfop_bgr` (no DB) (009-intuitive-methods)

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
- 009-intuitive-methods: Added TypeScript (~5.9), React 19 + React Router DOM, Bulma, React Icons (existing stack only)
- 009-intuitive-methods: Added TypeScript 5.9.3, React 19.2.0 + React Router DOM 7.1.4, Bulma 1.0.4, React Icons 5.6.0, React Markdown 10.1.0
- 007-cube-image-generator: Added TypeScript 5.9, React 19 + `cubing` (TwistyPlayer + Alg), `react`, `react-dom`, `vite`, `bulma`


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
