# Feature Specification: WCA World Record Evolution Chart

**Feature Branch**: `012-wca-wr-chart`
**Created**: 2026-03-28
**Status**: Complete ✅
**Input**: User description: "I want to add a graph of the WR times (singles and averages) evolving over the last 20 or so years..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View WR Evolution Chart (Priority: P1)

A user visits the About page and scrolls to the bottom, where they see an interactive chart showing how the 3×3 speedcubing world record solve times (both Single and Average) have evolved from the early 2000s to the present day. Two step-line series are displayed — one for Single WR, one for Average WR — giving a clear visual sense of how dramatically times have dropped over two decades.

**Why this priority**: This is the core deliverable. The chart alone with both series rendered correctly constitutes the full MVP.

**Independent Test**: Load the About page, scroll to the WCA Records section, confirm two step-line series are rendered with labelled axes and a legend.

**Acceptance Scenarios**:

1. **Given** the About page is loaded, **When** the user scrolls to the WCA Records section, **Then** a chart is visible with two clearly labelled series (Single WR and Average WR) plotted as step lines across the date range in the data
2. **Given** the chart is rendered, **When** the user views the Y-axis, **Then** times are displayed in seconds with an appropriate scale
3. **Given** the chart is rendered, **When** the user views the X-axis, **Then** years are displayed covering the full data range (~2004 to present)

---

### User Story 2 - Hover to Inspect Individual Records (Priority: P2)

A user moves their pointer (or taps on mobile) over a data point on either series. A tooltip appears showing the competitor's name, their country, the competition name, the date, and the exact solve time.

**Why this priority**: Hover interactivity transforms the chart from a static image into an engaging experience that connects the data to real people and events — a key part of the "cool visualisation" intent.

**Independent Test**: Hover over any data point; confirm tooltip shows all five fields (name, country, competition, date, time).

**Acceptance Scenarios**:

1. **Given** the chart is visible, **When** the user hovers over a step-line node, **Then** a tooltip appears showing: competitor name and country, competition name, formatted date, and solve time in seconds
2. **Given** the chart is on a touch device, **When** the user taps a data point, **Then** the tooltip is displayed
3. **Given** a tooltip is displayed, **When** the user moves away, **Then** the tooltip dismisses cleanly

---

### User Story 3 - Data Refresh Without Code Change (Priority: P3)

A developer refreshes the WCA data by running the PySpark pipeline and copying the new `wca-wr-evo.json` output into `cfop-app/public/data/`. On the next page load the chart automatically reflects the updated data with no code changes required.

**Why this priority**: Maintenance ergonomics — the owner wants to keep data current without touching React code. This is a design constraint, not a user-facing interaction, so it is lower priority than visual correctness.

**Independent Test**: Replace the JSON file with a modified version containing an additional record; reload the page and confirm the new point appears on the chart.

**Acceptance Scenarios**:

1. **Given** the data file is replaced with a newer version, **When** the About page is reloaded, **Then** the chart reflects the new data automatically
2. **Given** the data file contains records from a wider date range, **When** the chart renders, **Then** the axis range adjusts to fit the new data

---

### Edge Cases

- What happens when the data file is missing or fails to load? The chart area should display a graceful fallback message rather than a broken UI.
- What happens on very narrow screens (< 400px)? The chart must remain legible; axis labels may abbreviate but must not overlap.
- What if two records share the same date? Both points should be represented; tooltip should show the relevant record for the series being hovered.
- What if the JSON contains malformed entries? Valid records should still render; malformed entries are silently skipped.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The About page MUST include a dedicated "World Records" section displaying the WR evolution chart, positioned after the Video Resources section
- **FR-002**: The chart MUST render two separate step-line series: one for Single WR times and one for Average WR times
- **FR-003**: Each series MUST be visually distinct (different colour) and identified via a legend
- **FR-004**: The X-axis MUST display years spanning the full date range present in the data file
- **FR-005**: The Y-axis MUST display solve time in seconds with an appropriate scale
- **FR-006**: Hovering over (or tapping) a data point MUST display a tooltip containing: competitor name, country, competition name, event date (formatted as month/year), and solve time
- **FR-007**: The chart MUST load its data from `cfop-app/public/data/wca-wr-evo.json` at runtime, requiring no code changes when the file is replaced with updated data
- **FR-008**: The chart MUST be responsive and readable at the primary mobile baseline (~393px CSS width)
- **FR-009**: The chart MUST use the app's existing colour token system for all colours — no hardcoded hex or rgba values
- **FR-010**: The visualisation library added to the project MUST NOT exceed ~50 kB gzipped in bundle weight

### Key Entities

- **WR Record**: A single world-record-setting solve. Attributes: date, competitor name, competitor country, competition name, time in seconds, type (Single or Average)
- **Series**: A collection of WR Records of the same type rendered as a continuous step line on the chart
- **Tooltip**: A contextual overlay that appears on hover/tap for a specific data point, displaying its human-readable record details

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Both series (Single WR and Average WR) are visible and distinguishable on first scroll to the WCA Records section, on both desktop and mobile viewports
- **SC-002**: Hovering or tapping any data point reveals a tooltip with all required fields within one second of the interaction
- **SC-003**: Replacing the JSON data file and reloading the page updates the chart with no source code changes required
- **SC-004**: The page renders without layout breakage or overlapping labels at 393px viewport width
- **SC-005**: The chart section adds no perceptible delay to About page load time (library weight under 50 kB gzipped)

## Assumptions

- The data file schema is stable: `competition_date` (Unix ms timestamp), `person_name`, `person_country`, `competition_id`, `time` (seconds float), `type` ("Single WR" or "Average WR")
- All users have a modern browser with JavaScript enabled (consistent with existing app requirements)
- The chart is read-only; no user filtering, zooming, or editing interactions are in scope for this feature
- Mobile tap-to-show-tooltip is acceptable as a substitute for pointer hover on touch devices
- The introductory copy for the WCA Records section will be authored as part of this feature alongside the chart component
- The chart will be embedded directly in the About page — not a separate route or modal
