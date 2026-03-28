# UI Contracts: Beat the Champion (014)

These contracts describe the user-facing interface components added or modified by this feature. Each contract defines the component's purpose, props/state, and expected behaviour.

---

## 1. Mode Toggle (PracticeSessionModal header)

**Location**: `PracticeSessionModal.tsx` — modal header, right of title

**Appearance**: Bulma `buttons has-addons` segmented control with two options: "Standard" and "Competitive"

**Behaviour**:
- Switching Standard → Competitive: loads competition data if not cached, selects default competition (most recent), initialises `CompetitiveSession`
- Switching Competitive → Standard: clears `CompetitiveSession`, resumes `loadScramble('initial')`
- Toggle is disabled while a solve is in progress (`timer.state === 'running'`)
- If data fails to load on switch to Competitive, a fallback notice is shown and mode reverts to Standard (FR-012 fallback)

---

## 2. Competition Selector Panel

**Location**: Inside `PracticeSessionModal` — replaces scramble/timer content while open

**Trigger**: Shown automatically on first switch to Competitive mode; also accessible via a "Change Competition" link while in Competitive mode

**Contents per row**:
- Competition name + year
- Tier badge ("WR" | "Champ")
- Winner's best single (seconds, 2dp)
- Winner's best average (seconds, 2dp) or "—" if null

**Behaviour**:
- Tapping a row selects that competition, dismisses the selector, initialises a new `CompetitiveSession`
- List is scrollable within the modal; no pagination
- Currently selected competition is highlighted
- "Cancel" (or tapping outside the list area) returns to the current mode without changing competition — only available if a competition is already selected

**Acceptance**: SC-002 — 50+ events visible with name, year, winning times at a glance

---

## 3. Competitive Scramble Block

**Location**: `PracticeSessionModal` scramble block — shown when `mode === 'competitive'` and selector is closed

**Replaces**: "New Scramble" button

**Contents**:
- Competition name + tier badge (context header)
- Current scramble (same `.scramble-display` / `.scramble-text` styling)
- Solve progress: "Solve 1 of 5", "Solve 2 of 5", … (FR-006)
- "Change Competition" link (opens selector)

**Behaviour**:
- Scramble advances automatically after each solve stop — no manual "New Scramble" needed
- After the final solve, this block transitions to the Comparison Result (below)
- Group assignment (e.g. "Group A") shown as a subtitle if the competition has > 1 group

---

## 4. Running Comparison (during competitive session)

**Location**: Statistics block — shown when `mode === 'competitive'` and `solveTimesMs.length > 0`

**Contents**:
- User's current best single vs winner's single, with delta (e.g. "+2.4s behind" or "−0.8s ahead")
- User's current session average vs winner's average (shown only when ≥ 2 solves recorded; "—" before then)

**Behaviour**:
- Updates after every solve stop (FR-007)
- Positive delta (user slower) shown in neutral/muted style
- Negative delta (user faster) shown in accent/celebratory style

---

## 5. Comparison Result (final screen)

**Location**: Replaces scramble + timer blocks after final solve

**Contents**:
- Competition name and winner name
- Two-column comparison table:
  | | You | Champion |
  |---|---|---|
  | Best single | Xs.xx | Xs.xx |
  | Average (5) | Xs.xx | Xs.xx |
- Beat indicator: "You beat the champion!" (if either metric beaten) or shortfall text e.g. "+4.2s behind on average"
- "Try Again" button → re-randomises group assignment for same competition, starts new session
- "Change Competition" button → opens selector
- "Back to Standard" button → switches mode

**Behaviour**:
- Shown within 1 second of final solve stop (SC-003)
- If `winner_average` is null, average row omitted entirely
- Beat indicator logic: `beatSingle || beatAverage` → celebrate; otherwise show worst shortfall
- Renders without overflow on 393px viewport (SC-004)
