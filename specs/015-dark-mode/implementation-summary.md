# Implementation Summary: Feature 015 — Dark Mode

## What Was Built

### Dark Mode Foundation
- `src/hooks/useTheme.ts` — reads `localStorage` (`cfop-theme`), falls back to OS `prefers-color-scheme`, applies `data-theme` attribute to `<html>`, exposes `{ theme, toggleTheme }`
- `index.html` — FOUC-prevention inline `<script>` in `<head>` applies theme before first paint
- `src/index.css` — full `[data-theme="dark"]` token override block remapping all `--color-*`, `--gradient-*`, `--shadow-*` tokens, plus Bulma CSS variable overrides (`--bulma-navbar-background-color`, `--bulma-body-background-color`, `--bulma-light-*` etc.)

### Navbar Restructure
- Theme toggle (moon/sun icon) always visible alongside Visualizer and Practice icon buttons in the brand bar
- Hamburger menu restructured with a divider separating primer/beginner links from F2L/OLL/PLL
- Visualize and Practice removed from expanded menu — icon-only buttons in brand bar only
- Bulma `--bulma-navbar-height: 2.75rem` override to align all brand-bar elements
- Dark mode navbar background and text colours patched via Bulma CSS variable overrides

### CSS Token Cleanup
- `PracticeSessionModal.css` and `VisualizerModal.css` — all hardcoded hex/rgba values replaced with `--color-*` tokens
- Modal borders added (`border: 1px solid var(--color-border-medium)`) to define edges on dark backdrop
- `--color-accent-yellow` token added (amber, light: `#b45309` / dark: `#fbbf24`) for use in ComparisonResult

### Beat the Champion Data Model Fix (on this branch)
- Removed `tier: 'wr' | 'championship'` concept — was incorrectly attributing WR credit to the finals winner
- `wr_single` / `wr_average` (WR set at this event) replaced with `wr_single_at_time` / `wr_average_at_time` (historical WR standing on the competition date), computed via PySpark non-equi join
- PySpark notebook updated: `export_beat_the_champion()` accepts optional `dest_path` parameter; `APP_DATA_PATH` constant for direct export to `cfop-app/public/data/`
- TypeScript types, validator, and all UI components updated for new schema
- CompetitionSelector: tier badge replaced with country · year

### ComparisonResult Redesign
- Transposed table: metrics as rows (You / Champion / Delta / WR (year) / Delta), Single and Average as columns
- TR-level row colour inheritance: You = primary, Champion = blue (`--color-accent-primary`), WR = orange (`--color-accent-warm`)
- `delta-ahead` (green) overrides row colour when user beats the target
- Competition year shown in WR row label

### Algorithm Card Polish
- `line_break?: number | number[]` field added to `CfopAlgorithm` interface and JSON data
- `formatNotation()` helper inserts `\n` at specified token positions; rendered with `white-space: pre-wrap`
- T Perm in BGR JSON gets `line_break: 9` to prevent orphan last move

### About Page
- Section headers left-aligned on Notation, BGR, and About pages
- "What's in This App" section added covering all pages and utilities with accurate descriptions
- Algorithm Visualiser and Practice Timer descriptions corrected to reflect actual behaviour

## Files Changed (key)
- `src/index.css` — dark token block, new `--color-accent-yellow` token
- `src/hooks/useTheme.ts` — new file
- `index.html` — FOUC script
- `src/components/CfopNavigation.tsx` — theme toggle, icon buttons, nav restructure
- `src/App.css` — navbar height, hamburger alignment, divider, expanded menu styles
- `src/components/PracticeSessionModal.css` / `VisualizerModal.css` — full tokenisation
- `src/components/AlgorithmCard.tsx` / `.css` — `line_break` field, `formatNotation`, `pre-wrap`
- `src/components/ComparisonResult.tsx` / `.css` — transposed table, row colours
- `src/components/CompetitionSelector.tsx` / `.css` — tier removed, meta style added
- `src/types/competition.ts` — tier removed, WR fields renamed, `competitionYear` added
- `src/utils/competitionData.ts` — validator updated for new schema
- `src/pages/AboutPage.tsx` — left-align headers, "What's in This App" section
- `public/data/wca-beat-the-champion.json` — re-exported with new schema (57 competitions)
- `public/data/algs-cfop-bgr.json` / `algs-cfop-pll.json` — `line_break` fields

## Build
Production build verified: no TypeScript errors. `npm run build` ✅
