# Implementation Plan: About Page & Persistent Hamburger Navigation

**Branch**: `011-about-page-nav` | **Date**: 2026-03-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/011-about-page-nav/spec.md`

## Summary

Create a new "About" page consolidating all educational/contextual content (cubing background, CFOP primer, methods overview, WCA, video links, practice strategies) and make it the first nav item. Replace Bulma's responsive desktop nav bar expansion with a persistent hamburger menu on all screen sizes by overriding the default CSS behaviour. Clean README files of any educational content now moved into the app.

## Technical Context

**Language/Version**: TypeScript / React 19
**Primary Dependencies**: Bulma CSS, react-router-dom (HashRouter), react-icons/md
**Storage**: N/A (static content only)
**Testing**: Manual build verification + visual cross-viewport test
**Target Platform**: Web (GitHub Pages static hosting), macOS + iOS primary
**Project Type**: Web application (React SPA)
**Performance Goals**: No regression in initial load; no new dependencies
**Constraints**: Must not break existing routes; Bulma CSS desktop nav expansion requires explicit override
**Scale/Scope**: 1 new page, 1 modified component (CfopNavigation), 1 modified router (App.tsx), README edits

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| Educational focus | ✅ Pass | About page directly improves learning onboarding |
| Tech stack alignment (React/Bulma/TS) | ✅ Pass | No new dependencies required |
| Scope — CFOP only | ✅ Pass | About page covers CFOP methods context |
| Minimal dependencies | ✅ Pass | Zero new packages |
| No social/accounts/monetization | ✅ Pass | Static content page only |
| Offline-capable (static) | ✅ Pass | All content is inline, no API calls |

No violations. No Complexity Tracking required.

## Project Structure

### Documentation (this feature)

```text
specs/011-about-page-nav/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A — no data entities)
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
cfop-app/src/
├── App.tsx                        # Add /about route; update default redirect
├── pages/
│   ├── AboutPage.tsx              # NEW — consolidated educational content
│   ├── BGRPage.tsx                # Remove intro content now in About
│   └── IntuitivePage.tsx          # Remove any intro content now in About
└── components/
    └── CfopNavigation.tsx         # Add About as first item; always-hamburger CSS

README.md                          # Strip educational content; keep technical only
cfop-app/README.md                 # If present: same cleanup
```

**Structure Decision**: Single web-app project. All changes are within `cfop-app/src/` plus README files. No new files outside the standard pages/components convention.

---

## Phase 0: Research

### R-001: Current Educational Content Inventory

**Decision**: Audit before implementation to avoid missing content or duplicating it.

Content to consolidate exists in these locations:
- **BGRPage.tsx intro** — references to 2-look methods, CubeHead video links (OLL + PLL YouTube), "Essentials Cases" summary
- **IntuitivePage.tsx** — likely has cubing background / primer intro content
- **README.md (repo root)** — user confirmed educational content exists here; to be moved to About and then removed from README
- No standalone pages currently exist for "Methods", "WCA", or "Practice Strategies" — this content will be authored new or migrated from README

**Rationale**: Better to audit first than assume content locations during implementation.

**Alternatives considered**: Assuming content is only in READMEs — rejected, page intros also carry context.

---

### R-002: Always-Hamburger Navigation (Bulma Override)

**Decision**: Override Bulma's CSS to keep `navbar-burger` always visible and `navbar-menu` always hidden until toggled, at all viewport widths.

**How Bulma works by default**:
- `navbar-burger` is `display: none` on desktop (≥1024px) via Bulma's stylesheet
- `navbar-menu` is `display: block` on desktop, `display: none` on mobile
- Toggling `.is-active` on both shows the mobile dropdown at all sizes

**Required CSS override** (in `App.css` or a scoped block):
```css
/* Force hamburger visible at all widths */
.cfop-navbar .navbar-burger {
  display: flex !important;
}
/* Force menu hidden until toggled at all widths */
.cfop-navbar .navbar-menu {
  display: none;
}
.cfop-navbar .navbar-menu.is-active {
  display: block;
}
```

**Rationale**: Minimal override, no new JS. Works with existing `isMenuOpen` state already in `CfopNavigation`. The `!important` on burger is necessary to override Bulma's `@media` rule without restructuring the stylesheet.

**Alternatives considered**:
- Removing Bulma navbar entirely and building custom — rejected, overkill and breaks existing style
- Using Bulma's `is-transparent` or `has-dropdown` — not relevant to this problem

---

### R-003: Routing for About Page

**Decision**: Add `/about` route in `App.tsx` and update the root redirect from `/2lk` to `/about` (About becomes the landing page, matching FR-002 "first item in nav").

**Considerations**:
- Existing bookmark/direct links to `/2lk`, `/oll`, etc. are unaffected — those routes stay
- Root `/` redirect changes from `/2lk` → `/about`
- No content pages are removed from routing (BGRPage etc. remain), only their intro text is trimmed

**Rationale**: About as the entry point aligns with the spec's intent that new visitors land in context first.

---

## Phase 1: Design

### About Page — Section Structure

The About page (`AboutPage.tsx`) will be a single scrollable page using the existing `CfopPageLayout` wrapper and `section-title` banner pattern, with these named sections:

| Section | Content |
|---------|---------|
| Cubing Background | Brief history/context of the Rubik's cube and why speedcubing |
| CFOP Primer | What CFOP stands for, the 4 stages (Cross, F2L, OLL, PLL) |
| Methods Overview | 2-look vs full CFOP; intuitive vs algorithm-heavy; learning path |
| WCA | What WCA competitions are; how times are measured; context for the timer feature |
| Video Resources | Curated video links (CubeHead OLL/PLL already referenced in BGRPage; others from README) |
| Practice Strategies | Tips for drilling algorithms; use of the scramble/timer feature |

### Navigation Changes — CfopNavigation.tsx

Updated `navLinks` array (first item = About):

```text
/about     → "About"
/notation  → "Notation"
/intuitive → "Intuitive"
/2lk       → "Beginner"
/f2l       → "F2L"
/oll       → "OLL"
/pll       → "PLL"
```

Backdrop close (click outside): add an overlay `div` behind the open menu that triggers `setIsMenuOpen(false)`, consistent with the `AlgorithmNotesSheet` pattern already in the app. Escape key handler via `useEffect`.

### App.tsx Route Changes

```text
Before: <Route path="/" element={<Navigate to="/2lk" replace />} />
After:  <Route path="/about" element={<AboutPage />} />
        <Route path="/" element={<Navigate to="/about" replace />} />
```

### README Cleanup Scope

Content to **remove** from README(s):
- Any CFOP explanation or primer sections
- Video link lists
- Practice advice

Content to **keep** in README(s):
- Project setup / local dev instructions
- Architecture overview
- Deployment notes
- Contribution guidelines

### Agent Context Update

Run `.specify/scripts/bash/update-agent-context.sh claude` after Phase 1 to refresh CLAUDE.md with the new `AboutPage` component and updated routing.

---

## Implementation Order

1. Audit current README and page intros to inventory content (quick read-only pass)
2. Create `AboutPage.tsx` with all six sections
3. Add `/about` route and update root redirect in `App.tsx`
4. Update `CfopNavigation.tsx` — add About as first nav item
5. Add always-hamburger CSS override
6. Add backdrop-close and Escape-dismiss to hamburger menu
7. Trim intro content from BGRPage / IntuitivePage that is now in About
8. Clean README files
9. Build verification + manual cross-viewport test
