# Feature Specification: Dark Mode

**Feature Branch**: `015-dark-mode`
**Created**: 2026-03-28
**Status**: Draft
**Input**: User description: "dark mode support with button visible along side hamburger - thinking moon crest / sunshine icons, colours on you for a first pass but keep in mind cube graphics tend to be dark grey or black, and we still need these to stand out"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Toggle Dark Mode from the Navbar (Priority: P1)

A user wants to switch the app to dark mode to reduce eye strain or suit their preference. A toggle button sits in the navbar alongside the hamburger menu, showing a moon icon in light mode and a sun icon in dark mode. Pressing it flips the theme immediately. The chosen theme is remembered across sessions.

**Why this priority**: Core deliverable — the toggle is the entire feature entry point. Everything else depends on this working.

**Independent Test**: Open the app, press the moon icon in the navbar, verify the page switches to a dark colour scheme. Refresh — verify dark mode persists. Press the sun icon, verify it returns to light mode.

**Acceptance Scenarios**:

1. **Given** the app is in light mode, **When** the user presses the moon icon, **Then** the entire page switches to the dark colour scheme immediately.
2. **Given** the app is in dark mode, **When** the user presses the sun icon, **Then** the entire page returns to the light colour scheme immediately.
3. **Given** the user previously chose dark mode, **When** they return to the app in a new session, **Then** dark mode is active automatically.
4. **Given** the toggle button exists, **When** viewed on any screen size, **Then** the button is visible alongside the hamburger without overlap or layout breakage.

---

### User Story 2 — Dark Theme Colour Scheme (Priority: P2)

The full app — all pages, components, modals, cards, navigation, and typography — renders correctly and readably in dark mode. Cube graphics (which use dark grey/black facelet colours) remain clearly distinguishable against the dark background. Algorithm notation, stat values, and interactive elements all retain sufficient contrast.

**Why this priority**: A toggle is useless without a well-considered dark palette. Cube graphic contrast is a specific constraint that distinguishes this app from generic dark mode implementations.

**Independent Test**: Navigate to every page in dark mode and verify: text is readable, algorithm cards display correctly, cube 3D visualisation is visible, modals look consistent, no elements are invisible or illegible.

**Acceptance Scenarios**:

1. **Given** dark mode is active, **When** viewing any page, **Then** background, text, borders, and card surfaces all use dark palette values with no leftover hardcoded light colours.
2. **Given** dark mode is active, **When** viewing OLL/PLL/F2L algorithm cards with cube net diagrams, **Then** the dark grey/black cube face colours are clearly distinguishable from the card background.
3. **Given** dark mode is active, **When** the 3D visualiser modal is open, **Then** the cube and UI controls are visible and usable.
4. **Given** dark mode is active, **When** viewing the practice modal or comparison result, **Then** stats, timers, and button labels all meet readable contrast levels.
5. **Given** dark mode is active, **When** viewing the WR evolution chart, **Then** chart lines, labels, and tooltips are legible.

---

### User Story 3 — Respect System Preference on First Visit (Priority: P3)

On a user's first visit (no stored preference), the app automatically adopts the operating system's light/dark preference. Users on devices already set to dark mode see the dark theme without having to toggle manually.

**Why this priority**: Enhances first-time experience but is not blocking — the manual toggle (P1) covers the core use case.

**Independent Test**: With no stored theme preference, set the OS to dark mode, open the app fresh, verify dark mode is active. Set OS to light, repeat, verify light mode is active.

**Acceptance Scenarios**:

1. **Given** no stored theme preference and the OS is set to dark mode, **When** the user opens the app, **Then** dark mode is active.
2. **Given** no stored theme preference and the OS is set to light mode, **When** the user opens the app, **Then** light mode is active.
3. **Given** a stored user preference, **When** the user opens the app, **Then** the stored preference takes precedence over the OS setting.

---

### Edge Cases

- What happens when browser storage is unavailable (e.g. private browsing)? — Theme works for the session; no error is thrown; falls back to OS preference.
- How do cube net SVG diagrams behave in dark mode? — Facelet fill colours are data-driven (not CSS theme tokens), so only the surrounding container background changes. The background must provide enough contrast with dark grey/black facelets.
- What if the user changes their OS theme while the app is open? — If no stored preference is set, the app may or may not respond live; this is acceptable and not a hard requirement for v1.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST provide a theme toggle button visible in the navbar on all screen sizes.
- **FR-002**: The toggle button MUST display a moon icon in light mode and a sun icon in dark mode.
- **FR-003**: Pressing the toggle MUST switch the active theme immediately without a page reload.
- **FR-004**: The selected theme MUST be persisted across browser sessions.
- **FR-005**: On first visit with no stored preference, the app MUST respect the operating system's light/dark mode setting.
- **FR-006**: All pages, modals, and components MUST render correctly in both themes with no hardcoded light colours remaining.
- **FR-007**: The dark theme MUST use a colour palette where cube net dark grey/black facelet colours are clearly distinguishable from card and page backgrounds.
- **FR-008**: The dark theme MUST maintain readable contrast for all text, labels, and interactive elements.
- **FR-009**: The theme toggle button MUST be positioned alongside the hamburger and MUST NOT cause layout overflow or displacement at any screen size.
- **FR-010**: The 3D cube visualiser MUST remain visible and usable in dark mode.

### Key Entities

- **Theme preference**: The user's active theme (`light` or `dark`), persisted across sessions, takes precedence over OS preference when set.
- **Colour token set**: The existing CSS custom property system (`--color-*`) extended with dark-mode values — the sole mechanism for theming all components without duplicating CSS rules.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Theme switches imperceptibly — no visible flash or delay on toggle.
- **SC-002**: All pages and modals pass a manual contrast review in dark mode — no text or UI element is invisible or unreadable.
- **SC-003**: Cube facelet colours (dark grey, black, white, yellow, red, orange, blue, green) are distinguishable from the dark page/card background on all algorithm display components.
- **SC-004**: Theme preference is correctly restored on every return visit where browser storage is available.
- **SC-005**: The toggle button is visible and operable at all breakpoints from 375px upwards without displacing other navbar elements.

## Assumptions

- The existing CSS custom property token system (`--color-*`) is the mechanism for theming — dark mode remaps these tokens rather than duplicating component CSS.
- The dark palette is a first-pass; visual refinement is expected after review.
- Cube net SVG facelet colours are driven by data (per-face colour codes), not CSS theme tokens — they do not change between themes; only the surrounding container background changes.
- The 3D TwistyPlayer cube visualiser background is already `none`; it will inherit the modal/page background naturally.
- Print styles are out of scope — the existing light-mode print behaviour is preserved.
- Animated theme transitions are a nice-to-have; an instant switch is acceptable for v1.
