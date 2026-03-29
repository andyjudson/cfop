# Feature Specification: Playwright E2E Test Suite

**Feature Branch**: `016-playwright-e2e-tests`
**Created**: 2026-03-29
**Status**: Draft
**Input**: User description: "Add a Playwright E2E test suite covering the key user journeys of the cfop-app. The suite should cover: page navigation and content rendering, mobile nav behaviour (hamburger, icon grouping), practice timer (standard mode start/stop/stats, champion mode loading a competition), algorithm pages rendering cards (OLL, PLL, F2L), and the WR evolution chart rendering on the About page. No unit tests — Playwright only. Tests should run against the local dev server. Keep the suite small and focused on confidence-giving journeys rather than exhaustive coverage."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Page Navigation and Content Rendering (Priority: P1)

A developer runs the test suite and gets confidence that all primary pages load, render their expected content, and are reachable via navigation.

**Why this priority**: Navigation and page rendering are the foundation — if these fail, nothing else matters.

**Independent Test**: Run the suite against the dev server and verify each page URL resolves and its key content element is visible.

**Acceptance Scenarios**:

1. **Given** the dev server is running, **When** the About page is visited, **Then** the page heading and WR evolution chart container are visible
2. **Given** the dev server is running, **When** OLL, PLL, and F2L pages are visited, **Then** algorithm cards are rendered on each page
3. **Given** the dev server is running, **When** the Notation and Intuitive pages are visited, **Then** their section headings are visible
4. **Given** any page is loaded, **When** a nav link is clicked, **Then** the correct page is displayed

---

### User Story 2 - Mobile Navigation Behaviour (Priority: P2)

A developer verifies that the mobile navbar renders the icon group and hamburger correctly and that the menu opens and closes as expected on a small viewport.

**Why this priority**: The mobile nav was recently reworked; regression testing here catches layout or interaction regressions quickly.

**Independent Test**: Set viewport to mobile width, assert icon group and hamburger are visible together on the right, toggle the menu open and closed.

**Acceptance Scenarios**:

1. **Given** a mobile viewport (393px wide), **When** the page loads, **Then** the three nav icons and hamburger are grouped together on the right side of the navbar
2. **Given** a mobile viewport, **When** the hamburger is clicked, **Then** the nav menu opens and page links are visible
3. **Given** the nav menu is open, **When** the hamburger is clicked again, **Then** the menu closes

---

### User Story 3 - Practice Timer: Standard Mode (Priority: P3)

A developer verifies that the practice timer can be opened, a scramble is displayed, the timer starts and stops via spacebar, and rolling stats update after a solve.

**Why this priority**: The timer is the primary interactive feature; core start/stop/stats behaviour should be regression-tested.

**Independent Test**: Open the practice modal, trigger start and stop, verify a time is recorded and stats are visible.

**Acceptance Scenarios**:

1. **Given** the practice modal is open in standard mode, **When** it loads, **Then** a scramble string is displayed
2. **Given** the practice modal is open, **When** the spacebar is pressed to start then stop the timer, **Then** a solve time is recorded and displayed
3. **Given** at least one solve is recorded, **When** the stats area is visible, **Then** last time and best time values are shown

---

### User Story 4 - Practice Timer: Champion Mode (Priority: P3)

A developer verifies that champion mode loads a real competition, displays the event name and winner, and shows scrambles for the solve set.

**Why this priority**: Champion mode depends on external JSON data; verifying it loads and renders correctly catches data or rendering regressions.

**Independent Test**: Open practice modal, switch to champion mode, assert a competition name and scramble set are displayed.

**Acceptance Scenarios**:

1. **Given** the practice modal is open, **When** champion mode is selected, **Then** a competition name and winner are displayed
2. **Given** champion mode is active, **When** the solve set loads, **Then** at least one scramble string is visible

---

### User Story 5 - Algorithm Visualiser Modal (Priority: P4)

A developer verifies that the algorithm visualiser modal opens from the nav icon and renders the player container, confirming the modal lifecycle works correctly.

**Why this priority**: The modal opens via a nav icon button and mounts a third-party player — testing that the container is present confirms the app-level wiring without testing cubing.js internals.

**Independent Test**: Click the visualiser icon in the navbar, assert the modal is visible and the player container element is present.

**Acceptance Scenarios**:

1. **Given** any page is loaded, **When** the visualiser nav icon is clicked, **Then** the modal opens and the player container is visible
2. **Given** the visualiser modal is open, **When** the close action is triggered, **Then** the modal is dismissed

---

### User Story 6 - WR Evolution Chart (Priority: P5)

A developer verifies that the WR evolution chart on the About page renders with data and is not in an error state.

**Why this priority**: The chart depends on a JSON data file; a missing or malformed file would silently break it without a test.

**Independent Test**: Visit the About page, wait for the chart container to be visible and contain rendered content.

**Acceptance Scenarios**:

1. **Given** the About page is loaded, **When** the WR chart section is visible, **Then** the chart is rendered and no error message is shown

---

### Edge Cases

- What happens if the dev server is not running when the suite executes?
- How does the suite handle champion mode if the data file takes longer than expected to load?
- What if a page renders but algorithm cards are empty due to a silent data fetch failure?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The test suite MUST run against the local dev server (not a production URL)
- **FR-002**: Tests MUST cover all primary pages: About, OLL, PLL, F2L, Notation, and Intuitive
- **FR-003**: Tests MUST verify mobile nav icon grouping and hamburger menu toggle at 393px viewport width
- **FR-004**: Tests MUST verify practice timer standard mode: scramble display, start/stop via spacebar, stats update
- **FR-005**: Tests MUST verify practice timer champion mode: competition name loads, scrambles are visible
- **FR-006**: Tests MUST verify the algorithm visualiser modal opens and the player container is present
- **FR-007**: Tests MUST verify the WR evolution chart renders on the About page without an error state
- **FR-008**: The suite MUST remain small — one test file per feature area, no exhaustive permutation testing
- **FR-009**: No unit tests — Playwright E2E only

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All tests pass in a single run against the local dev server
- **SC-002**: The full suite completes in under 60 seconds
- **SC-003**: Each of the 6 user journey areas has at least one passing test
- **SC-004**: A regression in any covered journey causes at least one test to fail
- **SC-005**: The suite can be run with a single command from the cfop-app directory

## Assumptions

- The local dev server runs at `http://127.0.0.1:5173/cubing.spec/` (matching existing dev config)
- Mobile viewport is simulated via Playwright configuration — no physical device required
- Champion mode JSON data (`wca-beat-the-champion.json`) is present and valid in the public/data folder
- Playwright will be installed as a dev dependency within `cfop-app/`
- No CI/CD integration is in scope — local execution only
- Dark mode and theme toggle behaviour is out of scope (cosmetic, low regression risk)
- The algorithm visualiser is tested at the modal/container level only — 3D rendering correctness is out of scope (cubing.js internals)
