Card consolidation proposal
==========================

Problem:
- Notation and Intuitive page cards differ from other card variants; there is drift across pages.
- This increases maintenance and causes visual inconsistencies.

Options:
- Option 1 — Single unified card
  - One `AlgorithmCard` variant with props for `compact`, `intuitive`, and `notation` modes implemented via modifiers/utility classes.
  - Pros: Easiest to maintain, single source of truth.
  - Cons: Slightly more complex conditionals when rendering specialized layouts.

- Option 2 — Two variants
  - `AlgorithmCardStandard` (default) and `AlgorithmCardCompact` (for dense grids). Use `IntuitiveCaseCard` as a light wrapper that applies a label + image area.
  - Pros: Clear separation for density concerns.
  - Cons: Duplicate styles between similar variants may remain.

- Option 3 — Three dedicated variants
  - `AlgorithmCardStandard`, `AlgorithmCardNotation`, `AlgorithmCardIntuitive` each with tailored markup.
  - Pros: Maximum control and pixel-perfect layout per page.
  - Cons: Harder to maintain and increases duplication.

Recommendation:
- Start with Option 2. Implement a single `AlgorithmCard` base with `--variant` modifiers (`.algo-card--compact`, `.algo-card--notation`) and provide small layout overrides. Keep `IntuitiveCaseCard` as a thin wrapper that sets the variant and small view-specific styles. This balances maintainability and layout requirements.

Implementation notes:
- Centralize card spacing, image sizing, and notation wrapper in `AlgorithmCard.css`.
- Use CSS custom properties for card paddings and image heights so variants can override only the variables.
- Add visual regression tests for each variant (screenshot + baseline) to prevent future drift.

Suggested next steps:
1. Add variables to `AlgorithmCard.css`: `--card-padding`, `--card-image-height`, `--notation-font-size`.
2. Update JSX/TSX to map props -> modifier class names.
3. Create visual snapshot tests for main pages.
4. Roll out variant cleanup in small PRs.
