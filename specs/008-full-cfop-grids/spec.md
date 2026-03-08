# Feature Specification: Full CFOP Algorithm Grids

**Feature Branch**: `008-full-cfop-grids`  
**Created**: 2026-03-08  
**Status**: Draft  
**Input**: User description: "Add full CFOP algorithm grids (F2L, OLL, PLL) as separate pages in cfop-app with navigation between 2LK, F2L, OLL, and PLL pages. Each page displays grid of algorithm cards with images and notation, organized by case groups. No player modals, scramble functionality, or hover tooltips at this stage."

## Clarifications

### Session 2026-03-08

- Q: What URL path format should navigation use for deep linking? → A: Hash-based routing: `/cfop-app/#/2lk`, `/cfop-app/#/f2l`, `/cfop-app/#/oll`, `/cfop-app/#/pll`
- Q: How should the system handle data loading failures (network error, missing file, malformed JSON)? → A: Display error message with retry button
- Q: Should expand/collapse state reset on every navigation away, or persist within browser tab session? → A: Persist within tab session until tab close/refresh
- Q: What navigation menu display pattern should be used (persistent header, collapsible, bottom bar, etc.)? → A: Persistent header with horizontal nav links
- Q: Should algorithm cards on full CFOP pages be interactive/clickable or purely static displays? → A: Static display only (no click interaction)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Full F2L Algorithm Grid (Priority: P1)

A cuber who has mastered the beginner 2-look method wants to progress to full F2L by learning the 41 F2L case algorithms organized by pairing patterns.

**Why this priority**: F2L is the first step in progressing from 2-look beginner method to full CFOP. It's the most commonly learned next step after mastering 2-look OLL/PLL, making it the highest priority for the learning progression.

**Independent Test**: Can be fully tested by navigating to the F2L page and viewing all 41 algorithms organized into 6 groups (easy inserts, disconnected pairs, corner in slot, edge in slot, connected pairs, pair in slot). Delivers immediate value as a reference guide without requiring other features.

**Acceptance Scenarios**:

1. **Given** user is on the main 2LK page, **When** user clicks F2L navigation link, **Then** F2L page loads showing 41 algorithm cards organized by 6 case groups
2. **Given** user is viewing F2L page, **When** user scrolls through the grid, **Then** each card displays cube state image and algorithm notation clearly
3. **Given** user is on F2L page, **When** user clicks navigation to return to 2LK page, **Then** 2LK page loads with existing functionality intact

---

### User Story 2 - View Full OLL Algorithm Grid (Priority: P2)

A cuber learning full CFOP wants to study the complete 57 OLL cases grouped into fewer, balanced learning sections to reduce cognitive overload while keeping pattern-based study flow.

**Why this priority**: OLL is the second step in full CFOP progression and has the largest case count. Consolidated groups improve scanability and reduce fragmentation.

**Independent Test**: Can be fully tested by navigating to OLL page and validating 7 consolidated collapsed section headers, then expanding each section and verifying all 57 cases are present exactly once.

**Acceptance Scenarios**:

1. **Given** user is on any CFOP page, **When** user clicks OLL navigation link, **Then** OLL page loads showing 7 consolidated collapsed sections with names and counts
2. **Given** user expands an OLL section, **When** cards render, **Then** cards belong to that consolidated group mapping
3. **Given** user clicks "Expand All" then "Collapse All", **When** actions complete, **Then** all OLL sections open and close consistently

---

### User Story 3 - View Full PLL Algorithm Grid (Priority: P3)

A cuber wants to learn all 21 PLL cases organized by permutation type (edges only, corners only, adjacent swap, diagonal swap, G perms) to complete their full CFOP repertoire.

**Why this priority**: PLL is typically the final step in learning full CFOP. With fewer cases (21) than OLL (57) and simpler pattern recognition, it's often learned last but is still essential for complete CFOP mastery.

**Independent Test**: Can be fully tested by navigating to the PLL page and viewing all 21 algorithms organized into 5 groups (edges only, corners only, adjacent swap, diagonal swap, G perms). Provides complete PLL reference independently.

**Acceptance Scenarios**:

1. **Given** user is on any CFOP page, **When** user clicks PLL navigation link, **Then** PLL page loads showing 21 algorithm cards organized by 5 permutation type groups
2. **Given** user is viewing PLL page, **When** user examines the cards, **Then** each card displays cube state image and algorithm notation matching the style of other CFOP pages
3. **Given** user has viewed all full CFOP pages, **When** user switches between F2L, OLL, and PLL pages, **Then** navigation works bidirectionally without errors

---

### User Story 4 - Navigate Between All CFOP Method Pages (Priority: P1)

A cuber wants to easily switch between the beginner 2-look page and the three advanced full CFOP pages (F2L, OLL, PLL) to reference different algorithm sets during their learning journey.

**Why this priority**: Navigation is critical infrastructure for the entire feature. Without it, the separate pages are isolated and difficult to access. This enables all other user stories and must work reliably from the start.

**Independent Test**: Can be fully tested by clicking through all navigation links in sequence (2LK → F2L → OLL → PLL → back to 2LK) and verifying each page loads correctly. Delivers value by making all algorithm reference pages accessible.

**Acceptance Scenarios**:

1. **Given** user is on the 2LK page, **When** user views the page header, **Then** navigation menu displays links to 2LK, F2L, OLL, and PLL pages
2. **Given** user is on any CFOP page, **When** user clicks a navigation link, **Then** the target page loads and the current page indicator updates to show active page
3. **Given** user navigates between pages, **When** user returns to previously visited page, **Then** page state is fresh (no stale data or incorrect display)
4. **Given** user is on mobile device, **When** user views persistent header navigation, **Then** horizontal nav links are responsive and easily tappable without overlap

---

### Edge Cases

- What happens on small mobile screens with many algorithms?
  - Sections default collapsed to minimize initial scroll
  - Users can expand only the groups they need
  - "Expand All" remains available for full reference mode

- What happens when users rapidly toggle sections?
  - Section state must stay consistent with visible UI
  - Repeated taps must not cause partial or desynced states

- What happens when users navigate away after expanding sections?
  - Expand/collapse state persists within browser tab session for convenient cross-referencing
  - User can expand OLL sections, navigate to F2L, then return to OLL with sections still expanded
  - State resets on tab close or page refresh (not persisted across browser sessions)
  - Each page maintains independent expand/collapse state

- How does the system handle varying group sizes?
  - Headers always show group name + count
  - Larger groups expand using the same card grid without layout breakage
  - No empty groups are shown

- What happens when user refreshes the page while on a full CFOP page (not 2LK)?
  - App should maintain proper routing and load the correct page (not default to 2LK)
  - Page state should initialize cleanly without showing wrong content first
  - Browser back/forward buttons should work correctly with page navigation

- How does navigation work when user has been practicing with timer/demo modals?
  - Modals should close when navigating to different pages (no orphaned modal state)
  - Practice timer should stop if running when user navigates away
  - Modal-related state should reset cleanly when switching pages
  - Section expand/collapse state is separate from modal state

- What happens when algorithm JSON data fails to load?
  - System displays specific error message identifying which dataset failed (e.g., "Failed to load F2L algorithms")
  - Retry button allows user to attempt reload without full page refresh
  - Error state does not block navigation to other pages that may have loaded successfully
  - Malformed JSON is treated same as network failure (error message with retry)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide separate pages for Full F2L (41 cases), Full OLL (57 cases), and Full PLL (21 cases) algorithms
- **FR-002**: System MUST organize F2L page into 6 case group sections: easy inserts, disconnected pairs, corner in slot, edge in slot, connected pairs, pair in slot
- **FR-003**: System MUST organize OLL page into 7 consolidated balanced groups:
  - Cross Solved
  - Small Patterns
  - Block & Edge Setup
  - Line & L Shapes
  - Lightning & Hooks
  - Fish & Awkward
  - Dot Patterns
- **FR-004**: System MUST organize PLL page into 5 case group sections: edges only, corners only, adjacent swap, diagonal swap, G perms
- **FR-005**: System MUST implement expandable/collapsible case group sections on all full CFOP pages
- **FR-006**: System MUST provide "Expand All" and "Collapse All" controls on each full CFOP page
- **FR-007**: Case group sections MUST default to collapsed state on initial page load
- **FR-008**: Expand/collapse state MUST persist within browser tab session (navigating between pages retains state) and reset only on tab close or page refresh
- **FR-009**: System MUST provide persistent header navigation menu with horizontal links accessible from all CFOP pages (2LK, F2L, OLL, PLL)
- **FR-010**: Navigation menu MUST clearly indicate the active page
- **FR-011**: System MUST display each algorithm card with cube state image and algorithm notation in consistent format
- **FR-012**: System MUST load algorithm data from existing JSON files (`algs-cfop-f2l.json`, `algs-cfop-oll.json`, `algs-cfop-pll.json`)
- **FR-013**: OLL consolidation MUST be applied directly in [cfop-app/public/data/algs-cfop-oll.json](cfop-app/public/data/algs-cfop-oll.json) by normalizing each case `group` value to one of the 7 consolidated group labels
- **FR-014**: Algorithm cards on full CFOP pages MUST be static non-interactive displays (no hover tooltips, no click handlers, no demo player modal, no scramble/timer features); 2LK page retains existing interactive behavior
- **FR-015**: System MUST render cube state images from existing asset paths defined in JSON data files
- **FR-016**: System MUST maintain responsive grid layout on mobile and desktop
- **FR-017**: Navigation MUST update browser URL using hash-based routing (format: `/cfop-app/#/2lk`, `/cfop-app/#/f2l`, `/cfop-app/#/oll`, `/cfop-app/#/pll`) for deep links and back/forward behavior
- **FR-018**: Section headers MUST include group name and algorithm count
- **FR-019**: System MUST render algorithm notation in monospace style with consistent spacing and wrapping
- **FR-020**: System MUST display specific error message with retry button when algorithm JSON data fails to load (network error, missing file, or malformed JSON)

### Key Entities

- **CFOP Page**: Represents one of four learning reference pages (2LK, F2L, OLL, PLL)
  - Attributes: page identifier, page title, algorithm dataset source
  - Relationships: contains multiple case groups, has navigation links to other pages

- **Case Group**: Represents a section of algorithms with common patterns (e.g., "disconnected pairs" in F2L, "fish shapes" in OLL)
  - Attributes: group name, group identifier, case count
  - Relationships: belongs to one CFOP page, contains multiple algorithm cases

- **Algorithm Case**: Represents a single cube solving case with its solution algorithm
  - Attributes: case ID, case name, algorithm notation, cube state image path, method (f2l/oll/pll), group assignment
  - Relationships: belongs to one case group

- **Navigation State**: Represents the current active page and available navigation options
  - Attributes: current page identifier, available page links, active page indicator
  - Relationships: controls page visibility and navigation menu display

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can navigate to any of the 4 CFOP pages within 2 clicks from any other CFOP page
- **SC-002**: All 119 full CFOP algorithms are displayed correctly when sections are expanded
- **SC-003**: Initial page load with collapsed sections completes in under 2 seconds on standard mobile connection
- **SC-004**: Expanding a single section responds within 300ms perceived interaction time
- **SC-005**: "Expand All" on OLL expands all 57 algorithms within 2 seconds without UI freeze
- **SC-006**: Collapsed section headers allow users to locate a target group within 5 seconds
- **SC-007**: 100% of OLL algorithms in [cfop-app/public/data/algs-cfop-oll.json](cfop-app/public/data/algs-cfop-oll.json) use one of the 7 consolidated group labels (no invalid group labels)
- **SC-008**: Browser back/forward behavior restores correct page route and active navigation state

## Assumptions *(optional - include if helpful)*

### Technical Assumptions

- All algorithm JSON data files (`algs-cfop-f2l.json`, `algs-cfop-oll.json`, `algs-cfop-pll.json`) are already complete and accurate
- All cube state image assets referenced in JSON files exist in the correct paths (`./assets/cfop_f2l/`, `./assets/cfop_oll/`, `./assets/cfop_pll/`)
- React routing library (React Router or similar) will be used for client-side page navigation
- Existing Bulma CSS styling and custom CSS from 2LK page can be reused for full CFOP pages

### User Experience Assumptions

- Users learning full CFOP are already familiar with basic 2-look method and cube notation
- Users will primarily use these pages as reference guides (lookup specific cases) rather than sequential learning (read every case in order)
- Mobile users will tolerate longer scroll distances on pages with many algorithms (57 OLL cases)
- Users do not require search/filter functionality at this stage (can scroll/scan to find cases)

### Scope Assumptions

- Interactive features (tooltips, demo player, practice timer) remain exclusive to 2LK page for now
- Full CFOP pages are display-only reference grids without practice/learning assistance features
- Navigation is implemented as page-level routing (not tabs or accordion within single page)
- Essential algorithm markers (star icons) from 2LK page do not apply to full CFOP pages (all cases are equally important for full method mastery)
- OLL dataset group labels are intentionally rewritten to consolidated labels for long-term maintainability

## Dependencies *(optional - include if helpful)*

### Data Dependencies

- Existing algorithm JSON files must remain in current format with `id`, `name`, `notation`, `method`, `group`, and `image` fields
- Cube state SVG images must exist at paths specified in JSON data

### Code Dependencies

- Existing `AlgorithmCard` component (or equivalent) from 2LK page for consistent card rendering
- Existing grid layout CSS for responsive algorithm display
- Existing Bulma CSS framework for page structure and typography

### External Dependencies

- None (feature is self-contained within cfop-app, no external APIs or services)

## Open Questions *(optional - include if any)*

No open questions. OLL grouping strategy is finalized as Option 2 (fewer balanced groups).
