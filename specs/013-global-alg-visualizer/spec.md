# Feature Specification: Global Algorithm Visualizer & Practice Timer

**Feature Branch**: `013-global-alg-visualizer`
**Created**: 2026-03-28
**Status**: Complete ✅
**Input**: User description: "next feature i'd like to work on is moving the time and alg-visualizer to be accessible through the nav bar rather than the beginner page, and the visualizer should have an expanded pool of algorithms to demo - add drop down selector for oll or pll alg set and one for group within these (or all), with a shuffle button on the control bar at the bottom to randomly select an alg from those selections to visualize."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access Visualizer and Timer from Nav Bar (Priority: P1)

A user on any page of the app can open the Algorithm Visualizer or the Practice Timer directly from the navigation menu, without first navigating to the Beginner page. Both tools appear as top-level nav entries and launch as modal overlays — the underlying page does not change.

**Why this priority**: Today both tools are buried on the Beginner page. Moving them to the nav makes them reachable from any page in the app, and it is the prerequisite for all other work in this feature.

**Independent Test**: Open the app on the Notation or F2L page. Confirm the nav bar contains entries for both the Visualizer and the Practice Timer. Open each and confirm it functions as it did from the Beginner page.

**Acceptance Scenarios**:

1. **Given** any page is open, **When** the user opens the nav menu, **Then** entries for the Visualizer and the Practice Timer are visible
2. **Given** the user taps the Visualizer entry in the nav, **When** the modal opens, **Then** the 3D cube player is shown and functional
3. **Given** the user taps the Practice Timer entry in the nav, **When** the modal opens, **Then** the scramble generator and solve timer are shown and functional
4. **Given** a modal is open, **When** the user presses Escape or taps the backdrop, **Then** the modal closes and the underlying page is unchanged

---

### User Story 2 - Browse OLL and PLL Algorithms in the Visualizer (Priority: P2)

A user opens the Algorithm Visualizer and sees controls that let them choose which algorithm set to explore: OLL or PLL. Within that set they can either view all groups or narrow to a specific group (e.g., "Dot cases", "T-shape"). A Shuffle button on the control bar picks a random algorithm from the selected scope and loads it into the player, updating the displayed algorithm name and group label.

**Why this priority**: This is the headline upgrade to the Visualizer. The expanded pool transforms it from a 2-look demo into a full CFOP reference tool. The group filter makes the scope manageable — users studying a specific case family can stay focused.

**Independent Test**: Open the Visualizer from the nav. Select "OLL" then a specific group, then press Shuffle several times. Confirm each result is a valid algorithm from that group shown on the 3D cube. Select "All groups" and Shuffle; confirm algorithms from multiple groups can appear.

**Acceptance Scenarios**:

1. **Given** the Visualizer is open, **When** the user selects "OLL", **Then** the group selector lists OLL groups plus an "All groups" option
2. **Given** the Visualizer is open, **When** the user selects "PLL", **Then** the group selector lists PLL groups plus an "All groups" option
3. **Given** an algorithm set and group are selected, **When** the user presses Shuffle, **Then** a random algorithm from that scope loads and the cube animates it
4. **Given** "All groups" is selected, **When** Shuffle is pressed, **Then** any algorithm in the chosen set may be selected
5. **Given** a new algorithm loads via Shuffle, **Then** the algorithm name and group label displayed in the modal update to reflect the new selection

---

### User Story 3 - Beginner Page Clean-Up (Priority: P3)

With both tools now accessible from the nav bar, the Beginner page is tidied up by removing the Demo and Practice modal trigger buttons. The page refocuses on its core purpose: the 2-look algorithm reference grid. The result is a cleaner, less cluttered page that no longer doubles as a launcher for tools that now live elsewhere.

**Why this priority**: Once the tools are in the nav bar, the buttons on the Beginner page become redundant. Removing them reduces visual noise and clarifies the page's purpose. It is lower priority than the nav access and Visualizer upgrade because it is a subtraction, not an addition — the app works fine either way.

**Independent Test**: Open the Beginner page after the feature is complete. Confirm neither the Demo button nor the Practice button appears on the page. Confirm the algorithm grid, tooltips, and essential case markers all remain intact.

**Acceptance Scenarios**:

1. **Given** the Beginner page is open, **Then** no Demo or Practice button is visible on the page
2. **Given** the Demo and Practice buttons have been removed, **Then** the algorithm grid, section structure, and all other Beginner page content remain unchanged
3. **Given** a user wants to access either tool from the Beginner page, **When** they open the nav menu, **Then** both the Visualizer and Practice Timer entries are available

---

### Edge Cases

- What happens if the user rapidly presses Shuffle? Each press loads a new algorithm; no crash or stuck state.
- What if a selected group contains only one algorithm? Shuffle always returns that algorithm without error.
- What if the user changes the algorithm set while a cube animation is playing? The current animation stops cleanly and the new algorithm loads from the beginning.
- What if both the Visualizer and Practice Timer are triggered simultaneously (e.g., from nav and page button at once)? Only one modal may be open at a time.
- On very narrow screens (< 400px), do the selectors and Shuffle button fit in the control bar without overflow or wrapping that breaks the layout?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The navigation menu MUST include a direct entry point to the Algorithm Visualizer modal, accessible from every page
- **FR-002**: The navigation menu MUST include a direct entry point to the Practice Timer modal, accessible from every page
- **FR-003**: The Algorithm Visualizer MUST provide a selector to choose between OLL and PLL algorithm sets
- **FR-004**: The Algorithm Visualizer MUST provide a group selector listing all groups within the chosen set, plus an "All groups" option
- **FR-005**: The group selector MUST update its options automatically whenever the algorithm set selection changes
- **FR-006**: The Visualizer control bar MUST include a Shuffle button that loads a random algorithm from the currently selected set and group into the player
- **FR-007**: When Shuffle loads a new algorithm, the algorithm name and group label shown in the modal MUST update immediately
- **FR-008**: The Demo and Practice modal trigger buttons MUST be removed from the Beginner page
- **FR-009**: All other Beginner page content — algorithm grid, section structure, tooltips, essential markers — MUST remain unchanged after the button removal
- **FR-010**: Only one modal (Visualizer or Practice Timer) may be open at a time
- **FR-011**: Both modals MUST be dismissible via close button, Escape key, and backdrop tap — consistent with existing behaviour
- **FR-012**: The algorithm set selector, group selector, and Shuffle button MUST be usable on mobile viewports (~393px CSS width) without overflow

### Key Entities

- **Algorithm Set**: A named collection of CFOP algorithms — OLL (57 cases) or PLL (21 cases), each subdivided into named groups
- **Algorithm Group**: A named subset within an algorithm set (e.g., "Dot", "Line", "T-shape" for OLL). Used to filter the Shuffle pool. "All groups" is a virtual group representing the full set.
- **Shuffle Pool**: The set of algorithms eligible for random selection, determined by the active algorithm set and group choice
- **Visualizer Session**: The in-memory state of an open Visualizer: selected set, selected group, current algorithm, and playback position

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Both the Visualizer and Practice Timer are reachable in two taps or fewer from any page in the app
- **SC-002**: The Shuffle button loads and begins animating a new algorithm within one second of being pressed
- **SC-003**: The group selector lists all groups for OLL (14 groups + "All") and PLL (5 groups + "All") with no missing or duplicate entries
- **SC-004**: The Beginner page renders cleanly without Demo or Practice buttons, and the algorithm grid is fully intact — verified by manual test on desktop and 393px mobile viewport
- **SC-005**: The Visualizer control bar (selectors + Shuffle + playback controls) renders without overflow or truncation at 393px viewport width

## Assumptions

- The full OLL (57 cases, 14 groups) and PLL (21 cases, 5 groups) algorithm data already exists in the app's JSON data files and can be reused without schema changes
- The existing Visualizer modal (3D cube player + custom playback controls) is extended, not rebuilt from scratch
- The Practice Timer modal is reused exactly as-is; no changes to timer, scramble, or stats functionality are in scope for this feature
- Nav entries for the Visualizer and Practice Timer trigger modal overlays rather than page navigations — the URL does not change
- Removing the Demo and Practice buttons from the Beginner page may also remove associated modal state management code from that page; this is acceptable and desirable as part of the clean-up
- The 2LK beginner algorithm set is not added to the Visualizer's set selector in this feature; scope is OLL and PLL only
- Algorithm selection state (set, group) within the Visualizer resets to a sensible default (e.g., OLL / All groups) each time the modal is opened
- No new algorithm data or imagery needs to be created; all required data is already present in the app
