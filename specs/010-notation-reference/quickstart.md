# Quickstart: Feature 010 Notation Reference

## Goal
Implement and validate a static notation learning page that reuses legacy content ideas (not legacy implementation code), with navigation placement between Intuitive and Beginner.

## Preconditions
- Branch: `010-notation-reference`
- Workspace root: `cubing.spec`
- Existing assets available in `cfop-app/public/assets/notation`

## Implementation Checklist
1. Create `cfop-app/src/pages/NotationPage.tsx` using `CfopPageLayout`.
2. Add route `#/notation` in `cfop-app/src/App.tsx`.
3. Add `Notation` nav item in `cfop-app/src/components/CfopNavigation.tsx`.
4. Ensure nav order: Intuitive → Notation → Beginner → F2L → OLL → PLL.
5. Add/adjust styles in `cfop-app/src/App.css` for notation section layout and responsive behavior.
6. Implement graceful missing-image handling that preserves textual meaning.

## Manual Validation
1. Run production build:
   - `cd cfop-app && npm run build`
2. Run local dev server and open:
   - `http://127.0.0.1:5173/cubing.spec/#/notation`
3. Verify:
   - Route renders on direct load.
   - All required sections are present and ordered.
   - Trigger section includes names, sequences, inverses.
   - Navbar shows `Notation` between `Intuitive` and `Beginner`.
   - Mobile baseline (~393px width) has no horizontal scrolling.
4. Simulate missing image (optional dev-only test):
   - Temporarily break one `imageSrc` path and confirm text remains readable.

## Non-Regression Validation
- Confirm `#/intuitive`, `#/2lk`, `#/f2l`, `#/oll`, `#/pll` still render correctly.
- Confirm existing card/timer/demo behavior on unaffected pages remains unchanged.

## Guardrails
- Reuse content themes and asset references only.
- Do not copy legacy implementation structures from:
  - `cubing.static/notation.html`
  - `cubing.react/cfop-app/src/pages/NotationPage.tsx`
