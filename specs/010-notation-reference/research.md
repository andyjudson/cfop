# Research: Notation Reference Page (Feature 010)

## Decision 1: Reuse legacy notation as concept/content source, not code
- **Decision**: Use `cubing.static/notation.html` and existing notation learning content as source material for section structure, wording themes, and asset mapping only.
- **Rationale**: This preserves educational continuity while avoiding direct carryover of legacy implementation patterns.
- **Alternatives considered**:
  - Copy legacy HTML/CSS directly into React page (rejected: violates implementation-reuse constraint and current architecture consistency).
  - Rewrite entirely from scratch without legacy reference (rejected: unnecessary drift from established learning content).

## Decision 2: Keep implementation within current cfop-app architecture
- **Decision**: Build the page with existing `cfop-app` patterns (`CfopPageLayout`, page modules, current router/nav, shared `App.css`).
- **Rationale**: Minimizes maintenance overhead and preserves visual/behavioral consistency across CFOP pages.
- **Alternatives considered**:
  - Introduce new styling framework/components for notation page (rejected: unnecessary complexity and inconsistency).
  - Build as isolated mini-app/module (rejected: out of scope and unnecessary for static instructional content).

## Decision 3: Navigation label and order
- **Decision**: Add navbar entry labeled `Notation` between `Intuitive` and `Beginner`.
- **Rationale**: Learners typically need notation fluency after intuitive basics and before algorithm-heavy pages.
- **Alternatives considered**:
  - Place Notation after Beginner (rejected: weaker pedagogical flow for first-time algorithm readers).
  - Place Notation as final nav item (rejected: poor discoverability for the target learning step).

## Decision 4: Asset strategy
- **Decision**: Use existing notation assets in `cfop-app/public/assets/notation` for face turns/modifiers/slices/rotations.
- **Rationale**: Assets already exist and satisfy core visual requirements without adding dependencies.
- **Alternatives considered**:
  - Generate or import new notation images (rejected: not required for MVP scope).
  - Use only text and no visuals (rejected: conflicts with requirement to present visual examples where available).

## Decision 5: Trigger section format
- **Decision**: Provide trigger references as text-first entries (name, sequence, inverse), optionally with lightweight grouping.
- **Rationale**: Trigger comprehension does not require dedicated image assets; text reference is fast and readable.
- **Alternatives considered**:
  - Require trigger-specific images (rejected: no current asset requirement and extra scope).
  - Omit trigger inverses (rejected: conflicts with feature requirements).

## Decision 6: Missing-image behavior
- **Decision**: If any notation image fails, retain the symbol/description and show a graceful unavailable indicator for that example only.
- **Rationale**: Keeps page educationally useful under partial asset failure.
- **Alternatives considered**:
  - Hide failed examples entirely (rejected: creates content gaps and confusion).
  - Fail the whole section/page on image error (rejected: poor resilience and user experience).

## Decision 7: Scope and non-regression
- **Decision**: Keep feature informational only (no timers, solve visualizations, data fetch dependencies) and preserve existing route behavior.
- **Rationale**: Matches specification boundaries and limits regression risk.
- **Alternatives considered**:
  - Add interactive notation trainer in this feature (rejected: out of scope; can be future feature).
  - Refactor unrelated CFOP page internals concurrently (rejected: increased merge risk without direct value).
