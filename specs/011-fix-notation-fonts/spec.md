---
id: 011
short-name: fix-notation-fonts
title: Fix notation font rendering and sync documentation
created: 2026-03-09
status: draft
---

# 011 — Fix notation font rendering and sync documentation

Summary
-------
Resolve inconsistent font rendering across the CFOP app (notation grids and intuitive page), ensure documentation and governance artifacts (constitution, instructions, spec-kit resources, README) are in sync, and capture a short follow-up spec for next-month work.

Goals
-----
- Fix the notation/algorithm font family to the approved design token across all pages.
- Remove unintended italic styling on the intuitive page algorithm text.
- Verify spec and governance documents reflect completed features and rules of the road so future features don't repeat past issues.
- Capture a concise follow-up note/spec to drive work next month.

Actors
------
- Product owner / repository owner
- Frontend developer
- QA/tester

Scope & Constraints
-------------------
- Applies primarily to `cfop-app` (notation, intuitive, algorithm grids) but may include shared assets if the font files/styles are used in `cubify-app`.
- Changes should respect existing design tokens (`index.css`) and avoid introducing new, unapproved fonts.

Assumptions
-----------
- Design tokens are authoritative; font family should be set via `--font-*` tokens in `index.css`.
- The regression (courier-like font and italics) is caused by a CSS override, not by missing font assets.

User Scenarios & Testing
------------------------
1. Developer opens `cfop-app` pages (Intuitive, Notation, F2L, OLL, PLL) and verifies algorithm text uses the intended font family and weight.
   - Acceptance: Algorithm grids match the design token font on desktop and mobile (iPhone 16 baseline).
2. QA inspects the intuitive page and confirms no italic style is applied to algorithm text unless explicitly intended.
   - Acceptance: No unintended italics; intentional italics limited to notes/annotations only.
3. Reviewer checks `constitution`, `copilot-instructions.md`, `.specify/` resources, and `README.md` to ensure feature listings and rules reflect actual implemented features; document any discrepancies.
   - Acceptance: A short follow-up note is added to `specs/011-fix-notation-fonts/spec.md` listing needed documentation updates.

Functional Requirements (testable)
---------------------------------
FR-1: Global Font Token: The application must use the `--font-base` design token for algorithm text; page-level overrides are not permitted unless documented.
FR-2: No Italics: The intuitive page must not apply `font-style: italic` to algorithm glyphs or algorithm text classes; artifacts intended to be italic must carry an explicit class and be documented.
FR-3: Documentation Sync: The `README.md`, `constitution.md`, and `copilot-instructions.md` must list features 001-010 and the rules-of-the-road for new specs.
FR-4: Regression Test: A visual diff test (or manual inspection) must confirm the font change across primary pages on iPhone 16 viewport and desktop 1280×800.

Success Criteria
----------------
- All algorithm grids render with the specified font token on desktop and mobile (verification: manual inspection or screenshot comparison).
- Intuitive page has no unintended italics applied to algorithm text.
- README and spec indexes list features up to 010 and include a short follow-up note for remaining cleanup.
- A clear follow-up task list is captured in this spec for next-month work.

Key Entities
------------
- `AlgorithmCard` (component)
- `index.css` (design tokens)
- Notation grid pages (notation, intuitive, 2LK pages)

[NEEDS CLARIFICATION: Scope]
- Should the font fix be applied to all applications in the repo (`cfop-app`, `cubify-app`) or only `cfop-app`? (see Questions below)

[NEEDS CLARIFICATION: Priority]
- Should this be a hotfix merged immediately to the main branch, or scheduled as a feature branch for next sprint?

[NEEDS CLARIFICATION: Font Choice]
- Confirm the canonical font family/token to use for algorithm text (e.g., `--font-mono` vs `--font-base`).

Questions (for next cycle)
-------------------------
Q1: Scope — A: `cfop-app` only (less risk) | B: All apps (comprehensive) | C: Custom — specify.
Q2: Priority — A: Hotfix (immediate) | B: Next sprint (scheduled) | C: Defer.
Q3: Font token — A: Use `--font-base` | B: Use `--font-mono` (monospace) | C: Provide custom token name.

Next Steps
----------
1. Dev: search for CSS overrides that set `font-family`/`font-style` on algorithm text and remove or correct them to use design tokens.
2. QA: verify rendering across pages and devices; capture screenshots.
3. Docs: update `README.md` (done), `specs/009` and `specs/010` summaries (if missing), and `copilot-instructions.md` if any governance rules changed.
4. Merge as per chosen priority and capture deployment notes.

Follow-up Issues Discovered
--------------------------
The following UI regressions were observed during verification and should be tracked as follow-up work:

- Sequence/triggers styling on the Notation page: red/blank states are visually poor and need restyling (selector(s) to review: notation trigger/sequence classes).
- Tooltip hover z-order on BGR page: tooltip overlays are behind content; adjust z-index stacking context for tooltip containers.
- Algorithm notation width in cards: notation no longer spans full card width as before — investigate `AlgorithmCard` layout/padding and notation wrapper display rules.
- Scramble display width reduced: scramble text container (`.scramble-text`) appears narrower than previously; restore intended max-width/spacing.
- Inconsistent card variants: Notation and Intuitive page cards differ from other pages and from each other; decide on consolidation (1, 2, or 3 standardized card variants) and update `AlgorithmCard` variants accordingly.
- Essential algorithm marker missing: the star/essential marker that indicates an algorithm is 'essential' or favorited has disappeared from algorithm cards and grids; restore its visual (icon), positioning, and interactive behavior (toggle + a11y label).
- Grid-style parity between Notation and Intuitive: the notation grid and the intuitive method grid exhibit inconsistent spacing, card padding, notation width, and image sizing which causes a jarring visual mismatch. Restore a shared card/grid baseline (tokens for padding, unified `.notation` rules, consistent `.image-container` sizing) so both pages visually match and behave consistently at mobile and desktop breakpoints.
 - Notation page mobile layout: the Notation page does not fit well on small screens — it appears to be using an inconsistent page structure compared with other pages (different container, padding, or grid rules). Investigate the Notation page layout, unify container/grid rules with the Intuitive and Beginner pages, and ensure the page uses responsive tokens and breakpoints (iPhone 16 baseline).
 - Default landing page: the app currently opens to the Intuitive page by default. Make the Beginner/primer page the default landing route for new/first-time users. Document the routing change, update navigation order if needed, and ensure no regressions in deep links.

Suggested short-term actions
---------------------------
- Create focused issues/PRs for each item above with screenshots and target selectors.
- Prioritize z-index and visual readability issues (tooltip and sequence color) as high.
- Consolidation of card variants and layout fixes can be medium priority and scheduled once visual regressions are resolved.

