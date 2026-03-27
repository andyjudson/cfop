# Feature Specification: About Page & Persistent Hamburger Navigation

**Feature Branch**: `011-about-page-nav`
**Created**: 2026-03-27
**Status**: Draft
**Input**: User description: "I think we should move the cubing background, cfop primer, methods, wca, video links, practice strategies into an about page, which should be the first item in the list, and put the navigation always under a hamburger menu option - not just on mobile ... and leave the readme files as more technical background to the apps or repos"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Find All Learning Context in One Place (Priority: P1)

A new visitor to the app wants to understand CFOP before diving into algorithms. Currently this context is scattered across separate pages. With this feature, they open "About" — the first item in the menu — and find everything in one place: what CFOP is, the methods overview, competition context (WCA), recommended videos, and practice advice.

**Why this priority**: The About page consolidation is the core value of this feature. Without it, the nav change is cosmetic only.

**Independent Test**: Can be fully tested by navigating to the About page and confirming all six content sections are present and readable. Delivers a complete orientation experience for new learners.

**Acceptance Scenarios**:

1. **Given** I open the app for the first time, **When** I open the navigation menu, **Then** "About" is the first item listed.
2. **Given** I am on the About page, **When** I scroll through it, **Then** I can find cubing background, CFOP primer, methods overview, WCA context, video links, and practice strategies — all on the same page.
3. **Given** content previously existed on separate pages, **When** those pages are removed, **Then** that content is fully preserved within the About page sections.

---

### User Story 2 - Access Navigation from Any Screen Size (Priority: P2)

A learner on a desktop browser wants to switch between pages. Instead of a visible nav bar, they click the hamburger icon to reveal the menu, pick a destination, and the menu closes. The experience is identical on a phone.

**Why this priority**: The always-on hamburger gives a consistent, predictable navigation model across all devices and frees up screen space on desktop for content.

**Independent Test**: Can be tested independently by resizing the browser across breakpoints and confirming the hamburger icon is always present and functional, regardless of screen width.

**Acceptance Scenarios**:

1. **Given** I am on any page at any screen width, **When** I look at the header, **Then** I see a hamburger menu icon (not an expanded nav bar).
2. **Given** I click/tap the hamburger icon, **When** the menu opens, **Then** all navigation items are visible and tappable.
3. **Given** the menu is open, **When** I select a page, **Then** the menu closes and I land on the selected page.
4. **Given** the menu is open, **When** I tap outside the menu or press Escape, **Then** the menu closes without navigating.

---

### User Story 3 - READMEs Stay Technical (Priority: P3)

A developer looking at the repo README finds setup instructions, architecture notes, and contribution guidance — not user-facing learning content. Educational content lives only in the app.

**Why this priority**: This is a content governance boundary, not a user-facing feature. Important for long-term clarity but doesn't affect the app experience directly.

**Independent Test**: Can be tested by reviewing the repository README(s) and confirming they contain no CFOP educational content.

**Acceptance Scenarios**:

1. **Given** I open the repository README, **When** I read it, **Then** I find only technical content (setup, architecture, deployment, contribution).
2. **Given** educational content has been moved to the About page, **When** I search the README, **Then** no CFOP primer, practice strategies, or video links appear there.

---

### Edge Cases

- What happens to existing direct links or bookmarks to pages that are removed (e.g., a standalone "Methods" page)? Users should land on About rather than a broken route.
- If a user navigates back via browser history to a removed page, they should land somewhere sensible rather than a blank or error state.
- The About page must remain scannable — six content sections on one page require clear headings and enough structure that users can find what they need without reading everything.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST provide an "About" page that consolidates all of the following content sections: cubing background, CFOP primer, methods overview, WCA context, video links, and practice strategies.
- **FR-002**: "About" MUST be the first item in the navigation menu.
- **FR-003**: The navigation MUST always be presented via a hamburger menu icon on all screen sizes — desktop, tablet, and mobile — replacing any always-visible expanded nav bar.
- **FR-004**: The hamburger menu MUST open an overlay or drawer panel showing all navigation destinations, and MUST close when a destination is selected, when the user taps outside it, or when Escape is pressed.
- **FR-005**: Any pages that previously held content now consolidated into About MUST be removed or redirected to About, so no educational content is orphaned or duplicated.
- **FR-006**: The About page MUST be structured with clearly labelled sections so users can scan and navigate content of interest.
- **FR-007**: Repository README files MUST contain only technical documentation (setup, architecture, deployment, contribution) and MUST NOT include CFOP educational content.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All six content areas (background, primer, methods, WCA, video links, practice strategies) are accessible from the About page without navigating elsewhere.
- **SC-002**: "About" is the first item visible when the navigation menu is opened, across all supported screen sizes.
- **SC-003**: The hamburger menu icon is present and functional at viewport widths from 375px (small mobile) through 1440px (large desktop).
- **SC-004**: A user can open the navigation, select any page, and arrive there within 2 interactions from any starting page.
- **SC-005**: All content previously accessible on removed pages remains fully accessible via the About page — no content is lost.
- **SC-006**: No educational content (CFOP background, methods, practice tips, video links) appears in the repository README(s).

## Assumptions

- The content to be consolidated currently lives across multiple pages or sections within the app (not just in README files).
- The About page will be a single scrollable page with named sections, not a tabbed or sub-paged layout.
- The hamburger menu replaces the existing desktop nav bar entirely — there is no hybrid approach where both exist at any screen width.
- The hamburger menu opens a panel consistent in style with the current mobile menu behaviour.
- Removed pages that had their own routes will redirect to About rather than returning a broken state.
- "README files" refers to `README.md` files in the repository root and app subdirectories.
