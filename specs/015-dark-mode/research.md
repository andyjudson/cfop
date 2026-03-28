# Research: Dark Mode — Feature 015

## Decision 1: Theme switching mechanism

**Decision**: CSS custom property override via a `data-theme="dark"` attribute on `<html>`, remapping the existing `--color-*` token set under a `[data-theme="dark"]` block in `index.css`.

**Rationale**: The app already has a complete `--color-*` token system in `index.css`. Remapping those tokens under a single selector is the minimal, non-destructive approach — no component CSS changes are needed for files that already use tokens. Avoids adding a CSS-in-JS runtime or a separate theme stylesheet.

**Alternatives considered**:
- Class-based (`.dark` on `<body>`): equivalent mechanism, `data-theme` is more semantic.
- `prefers-color-scheme` media query only: cannot be manually toggled; user has no control.
- CSS-in-JS (styled-components theme provider): heavy dependency, contradicts minimal-dependency constitution.

---

## Decision 2: FOUC prevention

**Decision**: An inline `<script>` block in `index.html` reads `localStorage` and sets `document.documentElement.setAttribute('data-theme', ...)` *before* the page renders. Falls back to `window.matchMedia('(prefers-color-scheme: dark)')`.

**Rationale**: React mounts after the HTML is parsed. Without an inline script, there is a flash of the light theme on users with a stored dark preference. The inline script runs synchronously in the `<head>` before any CSS or React renders.

**Alternatives considered**:
- No FOUC prevention: acceptable for v1 but jarring — rejected.
- Server-side rendering with theme cookie: no SSR in this app (static hosting).

---

## Decision 3: React state and persistence

**Decision**: A `useTheme` custom hook manages the active theme string, writes to `localStorage` on change, and applies `document.documentElement.setAttribute('data-theme', theme)` as a side effect. Exported from `cfop-app/src/hooks/useTheme.ts`. The hook is consumed directly in `CfopNavigation` where the toggle button lives — no global context needed since only one component reads/writes the theme.

**Rationale**: Minimal state footprint. A React context would be needed if multiple components need to read the active theme reactively — currently only the nav button icon changes, so a single hook instance suffices.

**Alternatives considered**:
- React context + provider: over-engineered for a single toggle; adds wrapper complexity.
- URL param for theme: not persistent, ugly URLs.

---

## Decision 4: Bulma CSS variable strategy

**Decision**: Override only the `--bulma-*` variables that visibly break in dark mode. Primary targets: `--bulma-body-background-color`, `--bulma-body-color`, `--bulma-background`, `--bulma-box-background-color`, `--bulma-card-background-color`. Bulma button colour variables (`is-primary`, `is-link`, `is-warning`, `is-danger`) have acceptable dark-background contrast and are left as-is for v1.

The `is-light` button variant (used throughout for subdued actions) will need a dark-mode override since its near-white background becomes invisible on a dark card. Override `--bulma-light` lightness values for dark mode.

**Rationale**: Bulma 1.x uses an HSL-based variable system. Full remapping of all `--bulma-*` variables is possible but high effort. A targeted override of the variables that break is proportionate to a v1 pass.

**Alternatives considered**:
- Full Bulma variable remap: thorough but unnecessary for a first pass.
- Replace Bulma buttons with custom elements: too much churn.

---

## Decision 5: Dark colour palette (first pass)

**Design constraints**:
- Cube net facelets include black edges and dark-grey stickers (approx `#2d2d2d`–`#444`). Card backgrounds must be noticeably lighter than these so cube diagrams remain legible.
- Accent blue (`#2563eb`) is too dark on dark backgrounds — lighten to `#60a5fa`.
- Accent warm orange (`#e05c28`) → `#fb923c`.

**Token values (dark overrides)**:

| Token | Light | Dark |
|-------|-------|------|
| `--color-bg-base` | `#ffffff` | `#0f172a` |
| `--color-bg-subtle` | `#f8fafc` | `#1e293b` |
| `--color-bg-muted` | `#f1f5f9` | `#334155` |
| `--color-bg-emphasis` | `#e2e8f0` | `#475569` |
| `--color-text-primary` | `#0f172a` | `#f1f5f9` |
| `--color-text-secondary` | `#334155` | `#94a3b8` |
| `--color-text-tertiary` | `#3b4f87` | `#60a5fa` |
| `--color-text-emphasis` | `#111827` | `#e2e8f0` |
| `--color-text-subtle` | `#1f2937` | `#cbd5e1` |
| `--color-border-light` | `#e2e8f0` | `#1e293b` |
| `--color-border-medium` | `#cbd5e1` | `#334155` |
| `--color-border-emphasis` | `#dbe4ef` | `#2d4a6b` |
| `--color-accent-primary` | `#2563eb` | `#60a5fa` |
| `--color-accent-dark` | `#3b4f87` | `#93c5fd` |
| `--color-accent-warm` | `#e05c28` | `#fb923c` |
| `--color-notation-symbol` | `#020617` | `#f1f5f9` |
| `--color-success` | `#15803d` | `#4ade80` |
| `--color-success-bg` | `#f0fdf4` | `#052e16` |
| `--color-success-border` | `#bbf7d0` | `#166534` |
| `--shadow-sm/md/lg/xl` | `rgba(15,23,42,...)` | `rgba(0,0,0,...)` (darker) |
| `--gradient-section-*` | light slate | dark slate equivalents |

---

## Decision 6: Hardcoded colour cleanup (prerequisite)

**Finding**: Research revealed `PracticeSessionModal.css` and `VisualizerModal.css` contain significant hardcoded hex values not covered by the `--color-*` token system. These must be tokenised as part of this feature — otherwise those components will not theme correctly.

**Decision**: Tokenise all hardcoded colours in those two files as part of the dark mode implementation work (not a separate maintenance task). All other component CSS files are already fully tokenised.

---

## Decision 7: Toggle icon

**Decision**: `MdDarkMode` (crescent moon) from `react-icons/md` when in light mode; `MdLightMode` (sun) when in dark mode. Both icons already available from the existing `react-icons` dependency — no new packages.

**Alternatives considered**: `MdNightlight`, `MdBrightness2`, `MdWbSunny` — all valid; `MdDarkMode`/`MdLightMode` are the most semantically named pair.
