# Feature Specification: Persistent Solve Time Stats

**Feature Branch**: `[005-track-solve-stats]`  
**Created**: 2026-03-07  
**Status**: Draft  
**Input**: User description: "feature 005 builds on our practice timer ... now keep track of timings just using local storage, as well displaying the last time, display the average over the last 5 solves, and best time"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Save and Show Last Solve (Priority: P1)

As a learner using the practice timer, I want each completed solve to be saved and the latest solve time displayed so I can immediately see my most recent result.

**Why this priority**: Persisting and showing the last result is the minimum useful extension beyond the live timer.

**Independent Test**: Complete one solve, close/reopen the practice modal, and confirm the same last solve time is still displayed.

**Acceptance Scenarios**:

1. **Given** a user completes a solve, **When** the timer stops, **Then** the solve time is saved and shown as "Last time".
2. **Given** a previously saved solve exists, **When** the user returns to practice later, **Then** "Last time" shows that most recent saved solve value.

---

### User Story 2 - See Average of Last 5 Solves (Priority: P2)

As a learner tracking consistency, I want to see the average over my last 5 solves so I can judge performance trends, not just a single solve.

**Why this priority**: A short rolling average gives a more reliable practice signal than one result and directly supports improvement tracking.

**Independent Test**: Complete at least 5 solves and verify that the displayed average matches the arithmetic mean of the most recent five saved solve times.

**Acceptance Scenarios**:

1. **Given** five or more saved solves exist, **When** a new solve is recorded, **Then** the "Average (last 5)" updates using the most recent five solves only.
2. **Given** fewer than five solves exist, **When** viewing stats, **Then** the average display remains understandable and reflects available data according to defined behavior.

---

### User Story 3 - Track Personal Best (Priority: P3)

As a learner, I want to see my best (fastest) solve time so I can recognize progress milestones across sessions.

**Why this priority**: Best-time visibility motivates practice and complements last/average metrics.

**Independent Test**: Record multiple solves with varying times and confirm "Best time" always shows the fastest valid saved solve.

**Acceptance Scenarios**:

1. **Given** saved solves exist, **When** a slower solve is added, **Then** "Best time" remains unchanged.
2. **Given** saved solves exist, **When** a faster solve is added, **Then** "Best time" updates to the new fastest value.

---

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- No solves have been completed yet; stat fields should show clear empty-state values.
- Fewer than 5 solves exist; "Average (last 5)" should not mislead users.
- Invalid or corrupted stored timing data is encountered; system should recover safely without crashing.
- A stored solve value is zero/negative/non-numeric; invalid entries should be ignored for stat calculations.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: The system MUST persist completed solve times on the user device using local storage so values remain available across sessions.
- **FR-002**: The system MUST record a new solve entry only when a solve is validly completed (timer stopped from running state).
- **FR-003**: The system MUST display a "Last time" value representing the most recent saved solve.
- **FR-004**: The system MUST display an "Average (last 5)" value calculated from the five most recent valid saved solves.
- **FR-005**: The system MUST display a "Best time" value representing the fastest valid saved solve.
- **FR-006**: The system MUST update all displayed stats immediately after each new saved solve.
- **FR-007**: The system MUST continue to display accurate stats after the user closes and later reopens the app/page.
- **FR-008**: The system MUST handle empty history and partial history (1–4 solves) with clear, non-misleading stat output.
- **FR-009**: The system MUST ignore invalid persisted entries during stat computation and avoid breaking the practice experience.
- **FR-010**: The system MUST keep stat labels and values understandable for first-time users in the practice modal.

### Key Entities *(include if feature involves data)*

- **Solve Record**: A persisted completed solve with a recorded duration and completion timestamp.
- **Solve History**: Ordered collection of persisted solve records used for summary calculations.
- **Solve Stats Summary**: Derived values shown to user: last solve, average of last 5 solves, and best solve.

### Assumptions

- This feature extends existing practice timer behavior and does not change timer control rules.
- Persistence scope is per browser/device only; cross-device sync is out of scope.
- Only valid completed solves are included in history/stat calculations.
- Any future reset/clear-history control is out of scope unless separately requested.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 100% of valid completed solves are reflected in "Last time" immediately after stopping the timer.
- **SC-002**: For test runs with at least 5 solves, "Average (last 5)" matches expected calculation in at least 95% of manual verification checks.
- **SC-003**: For mixed solve sequences, "Best time" remains correct in at least 95% of manual verification checks.
- **SC-004**: After closing and reopening the app/page, at least 95% of verification sessions show the same saved stats values as before closing.
