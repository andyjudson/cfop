# Feature Specification: Cubing Notation Reference Page

**Feature Branch**: `010-notation-reference`  
**Created**: 2026-03-08  
**Status**: Draft  
**Input**: User description: "Add a notation reference page to cfop-app by reusing and refining existing notation learning content (face turns, modifiers, slices, rotations, and triggers) so learners can understand algorithm syntax in one place."

## Clarifications

### Session 2026-03-08

- Q: Where should the Notation page appear in the navigation menu, and what label should be used? → A: Option A - "Notation" label positioned between "Intuitive" and "Beginner" (pedagogical flow: overview → reference → practice progression)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand Basic Notation Symbols (Priority: P1)

As a learner reading algorithms for the first time, I can open a notation page and quickly understand face turns, prime turns, and double turns so I can read algorithm strings correctly.

**Why this priority**: Without basic notation understanding, learners cannot use any algorithm pages effectively.

**Independent Test**: Open the notation page and confirm users can identify meaning of standard move symbols from content and visuals only.

**Acceptance Scenarios**:

1. **Given** a learner opens the notation page, **When** they read the first notation sections, **Then** they can distinguish clockwise, counterclockwise, and double turns.
2. **Given** a learner views notation examples, **When** they inspect associated visuals, **Then** each symbol is paired with a clear, relevant reference image.

---

### User Story 2 - Learn Extended Notation Concepts (Priority: P2)

As a progressing learner, I can review wide turns, slice moves, and whole-cube rotations so I can follow advanced tutorials and algorithm notes.

**Why this priority**: Extended notation is needed for intermediate CFOP content and prevents confusion when users encounter non-basic symbols.

**Independent Test**: Open the extended notation sections and verify each concept category is clearly separated and explained with examples.

**Acceptance Scenarios**:

1. **Given** a learner navigates to modifiers and rotation content, **When** they read the section headings and explanations, **Then** they can differentiate wide turns, slice turns, and cube rotations.
2. **Given** a learner compares symbols across sections, **When** they review examples, **Then** no symbol meaning is contradictory across the page.

---

### User Story 3 - Use Trigger Reference During Practice (Priority: P3)

As a practicing cuber, I can review common triggers and their inverses so I can apply and reverse short move sequences more confidently.

**Why this priority**: Trigger fluency improves execution quality and supports both intuitive and algorithmic learning.

**Independent Test**: Open the trigger section and verify users can find each trigger name, base sequence, and inverse in one place.

**Acceptance Scenarios**:

1. **Given** a learner is on the notation page, **When** they open the trigger area, **Then** they can see named triggers and inverse relationships.
2. **Given** a learner is practicing an algorithm, **When** they cross-check a trigger on the page, **Then** they can use the trigger reference without leaving the learning flow.

### Edge Cases

- If one or more notation images are unavailable, the related textual explanations should still be visible and understandable.
- If a user lands directly on the notation route, the page should render completely without requiring prior page visits.
- If learners use very small screens, section headings, examples, and trigger lists should remain readable and not overlap.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a dedicated notation reference page accessible from app navigation with label "Notation" positioned between "Intuitive" and "Beginner" menu items.
- **FR-002**: The page MUST reuse existing approved notation teaching content as the baseline source, including explanatory text and visual assets.
- **FR-003**: The page MUST include distinct sections for face rotations, modifiers, slice moves, cube rotations, and common triggers.
- **FR-004**: The page MUST explain symbol meaning in beginner-friendly language for each notation section.
- **FR-005**: The page MUST present at least one visual example per core notation category where existing assets are available.
- **FR-006**: The trigger section MUST include trigger name, sequence, and inverse relationship for each listed trigger.
- **FR-007**: The notation page MUST support mobile readability without horizontal scrolling in core content regions.
- **FR-008**: If any referenced notation visual is unavailable, the page MUST continue to display remaining content and indicate unavailable examples gracefully.
- **FR-009**: The feature MUST preserve existing functionality on existing CFOP pages.

### Key Entities *(include if feature involves data)*

- **Notation Section**: A topical instructional block containing section title, explanatory copy, and grouped examples.
- **Notation Example**: A specific symbol reference entry containing symbol label, explanation, and optional image.
- **Trigger Reference**: A named sequence entry containing canonical move sequence, purpose context, and inverse sequence.

### Assumptions & Dependencies

- Existing notation text and image assets are sufficient to launch the initial notation reference experience.
- The notation page is informational and does not require solve timers, interactive players, or generated data.
- Navigation structure can accommodate at least one additional top-level learning destination.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of first-time learners can correctly answer a basic notation quiz item (clockwise vs prime vs double turn) after reviewing the page.
- **SC-002**: At least 90% of test users can locate the trigger section within 10 seconds of opening the notation page.
- **SC-003**: At least 90% of test users can identify the inverse of a listed trigger using only the page content.
- **SC-004**: On small-screen baseline testing, all major notation sections are readable without horizontal scrolling.
- **SC-005**: If any single image fails to load, users can still complete notation comprehension tasks from the remaining content.
