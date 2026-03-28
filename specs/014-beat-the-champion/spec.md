# Feature Specification: Beat the Champion

**Feature Branch**: `014-beat-the-champion`
**Created**: 2026-03-28
**Status**: Draft
**Input**: User description: "Beat the Champion - use real WCA event finals scrambles and results in practice mode to let users compare their times against competition winners"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Practice with Real Competition Scrambles (Priority: P1)

A user opens the Practice Timer and switches to a new "Competitive" mode. Instead of random scrambles, they receive the actual scrambles used at a real WCA finals event where a world record was set. They complete their solves using those scrambles, then see how their best single time or average compares to the competition winner's result.

**Why this priority**: This is the headline feature — the moment of "I used the same scrambles as a world championship". Without this core loop, nothing else in the feature has meaning.

**Independent Test**: Open the Practice modal, switch to Competitive mode, select or accept a competition, complete 5 solves with the competition scrambles, and see a comparison result at the end. The entire flow is self-contained and delivers the "beat the champion" experience.

**Acceptance Scenarios**:

1. **Given** the Practice modal is open, **When** the user switches to Competitive mode, **Then** the scramble source changes to real competition scrambles from a pre-loaded WR event
2. **Given** Competitive mode is active, **When** the user starts a solve, **Then** the displayed scramble is one of the actual scrambles used in that competition's finals
3. **Given** the user completes 5 solves, **When** the session ends, **Then** their best single and average are displayed alongside the competition winner's single and average
4. **Given** a comparison is shown, **When** the user's average beats the winner's average, **Then** the result is celebrated with a clear "You beat the champion!" indicator
5. **Given** a comparison is shown, **When** the user's result does not beat the winner, **Then** the shortfall is shown clearly (e.g., "+4.2s behind") without discouraging language

---

### User Story 2 - Browse and Select a Competition (Priority: P2)

A user in Competitive mode can browse the available WR competitions rather than accepting a random one. They can see the competition name, year, and the winning times — allowing them to pick a challenge appropriate to their level, or seek out a specific historic event.

**Why this priority**: Random selection is fine for casual play, but letting users target a specific event adds replay value and intentionality. Builds on the P1 core loop.

**Independent Test**: In Competitive mode, open the competition selector, browse the list of available events with their dates and winning times, select one, and confirm the scrambles and target times update to match the chosen event.

**Acceptance Scenarios**:

1. **Given** Competitive mode is active, **When** the user opens the competition selector, **Then** a list of WR competitions is shown, each with name, year, and winner's best single and average times
2. **Given** the competition list is open, **When** the user selects an event, **Then** the session loads that competition's scrambles and sets that event's winning times as the target
3. **Given** a competition is selected, **When** the user views the practice area, **Then** the competition name and target times are visible for reference throughout the session

---

### User Story 3 - Return to Standard Practice Mode (Priority: P3)

A user who has been using Competitive mode can easily switch back to the standard random-scramble practice mode without reloading or closing the modal. Their session history and stats in standard mode are unaffected by competitive sessions.

**Why this priority**: A clean escape hatch ensures competitive mode doesn't feel like a dead end. Lowest priority because the modal already has a close button — this is about in-session switching rather than exit.

**Independent Test**: In Competitive mode, switch back to Standard mode and confirm random scrambles resume and any accumulated standard session stats are intact.

**Acceptance Scenarios**:

1. **Given** Competitive mode is active, **When** the user switches back to Standard mode, **Then** the next scramble is randomly generated and no competition target is shown
2. **Given** the user switches modes mid-session, **Then** any solve times from that session's competitive solves are not included in the standard session stats

---

### Edge Cases

- What if a selected competition has fewer than 5 scrambles? The session uses however many are available; the average is calculated over the actual count.
- What if the user closes the modal mid-session? The competitive session is discarded — no partial results are shown.
- What if the competition winner only has a single result (no valid average)? Show the single time comparison only and note that no average was recorded.
- On narrow mobile viewports, does the comparison result layout stay readable with two sets of times side by side?
- What happens if the bundled competition data fails to load? Fall back to standard random scrambles with a brief notice.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Practice modal MUST offer a mode toggle between Standard (random scrambles) and Competitive (real competition scrambles)
- **FR-002**: Competitive mode MUST load scrambles from a curated set of two event tiers: WCA finals events where a world record was set, and World/Continental Championship finals (2015 onwards)
- **FR-003**: A default competition MUST be selected automatically when Competitive mode is first activated (most recent WR event with available scrambles)
- **FR-004**: The user MUST be able to select a specific competition from a browsable list
- **FR-005**: Each competition in the list MUST display the event name, year, and the winner's best single and average times
- **FR-006**: Competitive mode MUST serve a randomly assigned scramble group (e.g. Group A, B, C, or D) from the selected competition — giving the user exactly the scrambles that group of competitors used, typically 5
- **FR-007**: After each solve in Competitive mode, the running comparison to the winner's times MUST be visible
- **FR-008**: The final comparison MUST show the user's best single and average (over the session) versus the winner's best single and average
- **FR-009**: When the user's time beats the winner's time, the result MUST be visually distinguished
- **FR-010**: Switching between Standard and Competitive modes MUST be possible without closing the modal
- **FR-011**: Competitive session stats MUST NOT contaminate standard mode session stats
- **FR-012**: The competition data (scrambles and results) MUST be bundled with the app — no runtime external API calls required

### Key Entities

- **Competition**: A named WCA event in one of two tiers — (1) a WR event where a 3×3 world record was set, or (2) a World or Continental Championship final (2015+). Attributes: competition ID, name, year, country, tier, winner's best single, winner's best average.
- **Competition Scramble**: One of the actual move sequences used in a competition's finals round, linked to a competition by ID.
- **Competitive Session**: An in-progress or completed set of solves against a specific competition's scrambles. Tracks: selected competition, solve times, comparison outcome.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can enter Competitive mode, complete 5 solves with real competition scrambles, and see a comparison result — all within the existing Practice modal without navigation changes
- **SC-002**: The competition selector lists all available events (50+ events across WR and Championship tiers) with names, years, and winning times visible at a glance
- **SC-003**: The comparison result is displayed within one second of the final solve completing
- **SC-004**: The mode toggle and competition selector render without overflow or truncation on a 393px mobile viewport
- **SC-005**: Switching between Standard and Competitive modes takes a single tap and completes instantly with no loading delay

## Assumptions

- The curated dataset covers two tiers: (1) ~36 WR events with scrambles available, and (2) ~20 World and Continental Championship finals from 2015 onwards — totalling ~56 events and ~61 playable sessions
- WR competitions without scramble data in the source export are excluded
- Championship tier covers: World Championships, European, Asian, North American, South American, African, and Oceania continental championships
- Competition data is pre-processed and bundled as a static file (~221 KB combined) — no live WCA API dependency
- The feature is scoped to 3×3 single/average events only; other puzzle types are out of scope
- Scrambles are organised into groups (A, B, C, D) as in the real event — each competitive session uses one randomly assigned group's scrambles (typically 5), mirroring the experience of being placed in a competition group
- The comparison target is always the overall winner's times from the finals — not a group-specific result, which is not tracked at that granularity
- Where no valid average exists for the winner, only the single time is compared
- The existing Practice modal layout is extended, not replaced — the mode toggle is additive
- Competitive session stats are ephemeral (session only), consistent with how standard mode currently works
