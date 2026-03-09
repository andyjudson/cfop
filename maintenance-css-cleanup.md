# CSS & Component Consistency Cleanup

**Type**: Maintenance/Refactor  
**Date**: March 9, 2026  
**Status**: In Progress (Phase 2 Complete)

##Progress Summary

### Completed ✅
1. **CSS Custom Properties** - Design token system established in index.css with:
   - Color palette (18 semantic tokens)
   - Spacing scale (6 values)
   - Typography scale (weights: 400/600/700, sizes: 6 values)
   - Shadows (4 levels)
   - Border radius (5 values)
   - Gradient patterns (3 variants)
   
2. **AlgorithmCard Component** - Shared component created with:
   - Standard and compact variants
   - Tooltip integration (markdown support)
   - Essential pill marker
   - Unified image container sizing
   - Companion AlgorithmCard.css using design tokens
   - IntuitiveCaseCard variant for IntuitivePage

### In Progress 🔄
3. **Page Migration** - Migrating algorithm pages to use shared card component
   - BGRPage: Not yet migrated (file restoration needed)
   - F2L/OLL/PLL Pages: Not started
   - IntuitivePage: Not started
   - NotationPage: Keep separate (semantic difference)

### Not Started ⏳
4. **CSS Variable Migration** - Replace hardcoded colors with CSS custom properties in App.css
5. **Font Weight Normalization** - Audit and consolidate to 400/600/700 scale
6. **Style Deduplication** - Remove page-specific CSS once components migrated
7. **Production Validation** - Build + manual test pass
8. **Documentation Update** - Finalize copilot-instructions.md

## Scope

Address cross-cutting CSS quality and component reuse issues identified across cfop-app pages.

### Target Areas

1. **CSS Theme System**: Establish design token architecture using CSS custom properties
2. **Component Extraction**: Create shared card and section components to eliminate duplication
3. **Typography Normalization**: Consolidate scattered font-weight values to semantic scale
4. **Image Sizing**: Unify algorithm/notation image container dimensions and mobile scaling
5. **Style Deduplication**: Remove page-specific CSS overrides in favor of shared patterns
6. **Page Layout Consistency**: Ensure all pages use CfopPageLayout without nested container overrides; standardize max-width and spacing

## Acceptance Criteria

- [ ] CSS custom properties defined for colors, spacing, typography, shadows
- [ ] Shared `AlgorithmCard` component created with standard/compact variants
- [ ] All algorithm pages (BGR, F2L, OLL, PLL) use shared card component
- [ ] Font weights limited to 3 values: 400 (normal), 600 (semibold), 700 (bold)
- [ ] Image containers have consistent dimensions across all page types
- [ ] Page-specific CSS reduced by >50% through shared utilities
- [ ] Light theme backgrounds enforced consistently (no dark mode bleeding)
- [ ] All pages use CfopPageLayout consistently without nested container overrides
- [ ] Consistent content max-width across all pages (no extra wide/narrow pages)
- [ ] Production build passes with no TypeScript errors
- [ ] Manual test pass: all pages render correctly on mobile and desktop

## Constraints

- **No functionality changes**: This is styling/structure cleanup only
- **Preserve all interactive features**: Tooltips, hover states, demo modal, practice modal must continue working
- **Maintain responsive behavior**: Mobile layouts must remain functional
- **Incremental validation**: Test after each major change batch
- **Keep existing color palette**: Don't introduce new color schemes, consolidate existing values

## Non-Goals

- Dark mode implementation (architecture supports it, but not in scope)
- New interactive features or UX changes
- Algorithm data changes or new content
- Performance optimization beyond bundle size from CSS reduction

## Implementation Notes

### Research Findings (Pre-Work)

**Card/Box Patterns Found**:
- `.algo-card` (BGRPage) - white background, explicit border
- `.algo-card-compact` (F2L/OLL/PLL) - compact sizing variant
- `.intuitive-case-card` (IntuitivePage) - white background with `!important`
- `.notation-example-tile` (NotationPage) - uses `.box` base class

**Font Weight Scatter**:
- 20+ instances across App.css using values: 400, 500, 600, 700, 800
- No consistent semantic meaning
- Some weights render poorly on low-DPI displays

**Image Sizing Inconsistencies**:
- BGR: height 180px with max-width 100%
- F2L/OLL/PLL: max-width 200px, no explicit height
- Intuitive: width 100%, height 128px
- Notation: max-height 150px with container min-height 120px

**CSS Duplication Examples**:
- 3 different gradient patterns for section backgrounds
- Color values repeated 50+ times (e.g., `#f8fafc`, `#0f172a`, `#e2e8f0`)
- Similar card padding/border/shadow patterns across 4+ class definitions

## Rollout Plan

### Phase 1: Foundation (Theme System)
1. Create CSS custom properties in index.css
2. Define color palette, spacing scale, typography scale, shadows, borders
3. Test: No visual changes yet (tokens defined but not yet used)

### Phase 2: Component Extraction
1. Create AlgorithmCard.tsx with standard/compact variants
2. Create AlgorithmCard.css with component-specific styles
3. Test: Component renders correctly in isolation

### Phase 3: Page Migration
1. Migrate BGRPage to use AlgorithmCard
2. Migrate F2L/OLL/PLL pages to use AlgorithmCard
3. Migrate IntuitivePage card rendering
4. Migrate NotationPage tiles (or keep separate for semantic clarity)
5. Test: All pages render correctly, no regressions

### Phase 4: Style Consolidation
1. Replace hardcoded colors with CSS custom properties
2. Normalize font weights to 400/600/700 scale
3. Standardize image container sizing
4. Remove now-unused page-specific CSS
5. Test: Visual consistency verified, bundle size reduced

### Phase 5: Validation & Documentation
1. Production build validation
2. Manual test pass across all pages (mobile + desktop)
3. Update copilot-instructions.md with final standards
4. Commit with descriptive message

## Success Metrics

- **CSS lines reduced**: Target >30% reduction in App.css
- **Component reuse**: 4+ pages using shared AlgorithmCard
- **Token usage**: 80%+ of color values use CSS custom properties
- **Font weights**: Reduced from 5 values to 3 values
- **Build size**: CSS bundle reduced by ~10-15%
- **Zero regressions**: All existing features work identically

## Risk Mitigation

- **Incremental approach**: Small batches with testing between
- **Git checkpoints**: Commit after each phase completes successfully
- **Rollback ready**: Each phase is independently reversible
- **Manual validation**: Don't rely on build success alone, test visually
