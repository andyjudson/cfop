# Tasks: Dark Mode

**Input**: Design documents from `/specs/015-dark-mode/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, contracts/ ✓, quickstart.md ✓

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 = Toggle, US2 = Colour scheme, US3 = OS preference
- Paths relative to `cfop-app/`

---

## Phase 1: Setup

**Purpose**: Confirm no new dependencies are needed; all tooling is pre-existing.

- [X] T001 Verify `MdDarkMode` and `MdLightMode` are available in `react-icons/md` (no install needed — existing dependency)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tokenise the two modal CSS files that still use hardcoded colours. Required before dark theme tokens can work correctly in those components. Also establishes the `useTheme` hook and the dark token block that every user story depends on.

**⚠️ CRITICAL**: US1, US2, and US3 all depend on this phase.

- [X] T002 Replace all hardcoded hex/rgba colour values in `src/components/PracticeSessionModal.css` with `--color-*` tokens from `index.css` (covers backdrop rgba, card backgrounds `#f8fafc`, borders `#e2e8f0`/`#d9e2ee`, text colours `#0f172a`/`#111827`/`#64748b`/`#94a3b8`, info/error status colours)
- [X] T003 Replace all hardcoded colour values in `src/components/VisualizerModal.css` with `--color-*` tokens (covers backdrop rgba, gradient background `linear-gradient(#f8fafc, #f1f5f9)`, box-shadow rgba values)
- [X] T004 Add `[data-theme="dark"]` token override block to `src/index.css` — remap all `--color-*` tokens to dark palette values per research.md decision 5, plus dark-mode gradient token overrides
- [X] T005 Create `src/hooks/useTheme.ts` — hook that reads stored preference from `localStorage` (`cfop-theme`), falls back to OS detection (`prefers-color-scheme`), applies `data-theme` attribute to `document.documentElement`, exposes `{ theme, toggleTheme }`, wraps localStorage access in try/catch for private browsing

**Checkpoint**: Dark tokens defined, modals tokenised, hook ready — US1 can now be wired in.

---

## Phase 3: User Story 1 — Toggle Dark Mode from the Navbar (Priority: P1) 🎯 MVP

**Goal**: Moon/sun toggle button in navbar, theme switches instantly, preference persisted.

**Independent Test**: Open app → press moon icon → page goes dark → refresh → still dark → press sun → returns to light.

- [X] T006 [US1] Add FOUC-prevention inline `<script>` to `<head>` in `index.html` — reads `localStorage.getItem('cfop-theme')`, falls back to `matchMedia('(prefers-color-scheme: dark)')`, sets `document.documentElement.setAttribute('data-theme', ...)` synchronously before any CSS paints
- [X] T007 [US1] Add theme toggle button to `src/components/CfopNavigation.tsx` — import `useTheme`, import `MdDarkMode` and `MdLightMode` from `react-icons/md`, render a `<button>` alongside the hamburger showing the correct icon for the active theme, with `aria-label="Switch to dark mode"` / `"Switch to light mode"`, calling `toggleTheme` on click
- [X] T008 [US1] Style the theme toggle button in `src/App.css` (or a scoped rule in CfopNavigation's CSS) — ensure it sits alongside the hamburger without layout shift at all breakpoints (375px+), icon-only, no text label, matched visual weight to hamburger

**Checkpoint**: Toggle works, persists, no FOUC — US1 fully testable.

---

## Phase 4: User Story 2 — Dark Theme Colour Scheme (Priority: P2)

**Goal**: Every page, modal, and component renders correctly in dark mode with no leftover hardcoded light colours and sufficient contrast for cube facelet visibility.

**Independent Test**: Toggle dark mode, navigate every page — OLL/PLL/F2L cards, practice modal, visualiser, WR chart, comparison result — all readable, no invisible elements, cube diagrams legible.

- [X] T009 [P] [US2] Audit and fix any remaining hardcoded colours in `src/App.css` that don't correctly resolve under dark tokens (check shadows, gradients, section-title background)
- [X] T010 [P] [US2] Audit `src/components/AlgorithmCard.css` and `src/components/ComparisonResult.css` under dark mode — verify all `var(--color-*)` references resolve correctly; fix any tokens that map to wrong dark values
- [X] T011 [P] [US2] Add targeted Bulma dark-mode overrides inside the `[data-theme="dark"]` block in `src/index.css` — override `--bulma-body-background-color`, `--bulma-body-color`, `--bulma-background`, `--bulma-box-background-color`, and `--bulma-light` lightness values so `is-light` buttons remain visible on dark card backgrounds
- [X] T012 [US2] Manually review all pages in dark mode (OLL, PLL, F2L, Notation, About, Intuitive) and fix any contrast or visibility issues found — update token values in `src/index.css` `[data-theme="dark"]` block as needed
- [X] T013 [US2] Manually review both modals (Practice, Visualiser) in dark mode and verify cube net diagrams remain legible — dark grey/black facelets must be distinguishable from `--color-bg-subtle` (`#1e293b`) card backgrounds; fix if needed
- [X] T014 [US2] Manually review the WR evolution chart (`WrEvolutionChart`) in dark mode — verify chart lines, grid, tooltips, and axis labels are legible; update chart colour resolution in `src/components/WrEvolutionChart.tsx` if `resolveTokenColour` picks up incorrect values (chart colours are read at mount time from CSS variables)

**Checkpoint**: Full dark mode passes visual review across all pages and components.

---

## Phase 5: User Story 3 — Respect System Preference on First Visit (Priority: P3)

**Goal**: On first visit with no stored preference, OS dark mode → app dark; OS light mode → app light.

**Independent Test**: Clear localStorage, set OS to dark, open app fresh → dark mode active (no toggle needed). Repeat with OS light → light mode. Set a stored preference → verify it overrides OS.

- [X] T015 [US3] Verify the FOUC inline script (T006) and `useTheme` hook (T005) both correctly implement the OS fallback path — `matchMedia('(prefers-color-scheme: dark)').matches` used when `localStorage` key is absent; test in browser DevTools by clearing localStorage and toggling OS dark/light preference

**Checkpoint**: All three user stories complete. Full feature ready for final review.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T016 [P] Run production build (`npm run build` in `cfop-app/`) and verify no TypeScript errors and no theme-related visual regressions in the built output
- [X] T017 [P] Test on iPhone viewport (375–393px) — verify toggle button position alongside hamburger is correct, no overflow
- [X] T018 Update `specs/spec.md` feature ledger to record feature 015 as complete

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user stories
- **Phase 3 (US1 — Toggle)**: Depends on Phase 2 (needs `useTheme` hook and dark tokens)
- **Phase 4 (US2 — Colour scheme)**: Depends on Phase 2; benefits from Phase 3 being complete to toggle during review
- **Phase 5 (US3 — OS preference)**: Depends on Phase 2 (inline script + hook already implement this path)
- **Phase 6 (Polish)**: Depends on all story phases complete

### Within Each Phase

- T002 and T003 (modal CSS tokenisation) can run in parallel — different files
- T004 and T005 (dark token block + useTheme hook) can run in parallel — different files
- T009, T010, T011 in US2 can run in parallel — different files
- T015 (US3) is primarily a verification task — fast to complete

### Parallel Opportunities

```
Phase 2 parallel group A: T002 (PracticeSessionModal.css) + T003 (VisualizerModal.css)
Phase 2 parallel group B: T004 (index.css dark tokens) + T005 (useTheme hook)
Phase 4 parallel group:   T009 (App.css audit) + T010 (AlgorithmCard/ComparisonResult) + T011 (Bulma overrides)
Phase 6 parallel group:   T016 (build check) + T017 (mobile test)
```

---

## Implementation Strategy

### MVP (US1 only — toggle working, basic dark appearance)

1. Phase 1: T001 — verify icons available
2. Phase 2: T002–T005 — tokenise modals, define dark tokens, create hook
3. Phase 3: T006–T008 — wire toggle into navbar, add FOUC script
4. **STOP and VALIDATE**: Toggle switches theme, persists on refresh, no FOUC
5. Dark appearance may be imperfect at this point — US2 refines it

### Incremental Delivery

1. MVP above → working toggle with first-pass dark palette
2. US2 → full visual review, all pages correct in dark mode
3. US3 → verify OS preference detection (likely already working from hook implementation)
4. Polish → build check, mobile test, spec ledger update

---

## Notes

- The dark palette in research.md is a **first pass** — expect to iterate on specific values during T012–T014 visual review
- WrEvolutionChart reads CSS variable colours at mount time (T014) — may need the chart to re-read colours on theme change; investigate if chart colours don't update on toggle
- `is-light` Bulma buttons are the most likely breakage point in dark mode (near-white background disappears) — T011 targets this specifically
- localStorage key: `cfop-theme` | values: `'light'` | `'dark'`
