# Tasks: 019 — Visual Case Carousel

**Input**: [spec.md](spec.md), [plan.md](plan.md)
**Branch**: `019-visual-case-carousel`

## Phase 1: New Components

- [x] T001 [US-001] Create `CaseCarousel.tsx` in `cfop-app/src/components/`
- [x] T002 [US-001] Create `CaseCarousel.css` with horizontal scroll strip, active highlight, mobile thumbnail size

## Phase 2: VisualizerModal Integration

- [x] T003 [US-003] Add `navMode` state (`'browse' | 'select'`) to `VisualizerModal`
- [x] T004 [US-001, US-003] Add Browse/Select toggle pill to `visualizer-nav-toggle` row (alongside set selector)
- [x] T005 [US-001, US-002] Render `CaseCarousel` when `navMode === 'browse'`; render dropdowns when `navMode === 'select'`
- [x] T006 [US-002] Wire `CaseCarousel.onSelect` → `setCurrentAlg` (loads algorithm into TwistyPlayer)
- [x] T007 [US-003] Retain group + algorithm dropdowns + shuffle in Select mode, unchanged

## Phase 3: Mobile Handling

- [x] T008 Add CSS mobile overrides (≤480px): hide toggle + carousel, always show dropdowns

## Phase 4: Active Case Highlight & Scroll (FR-004, FR-007)

- [x] T009 [US-001] Active case highlighted via `.case-carousel__item--active` (accent border + glow)
- [x] T010 [US-001] `scrollIntoView` on `activeId` change in `CaseCarousel` (covers modal open + dropdown-driven change)

## Remaining / Fine-tuning

- [x] T011 Visual QA: desktop browse mode, select mode, mobile dropdowns
- [x] T012 Verify carousel scrolls correctly to active item on modal open (PLL default)
- [x] T013 Verify switching OLL↔PLL resets carousel to new active item
- [x] T014 Acceptance criteria sign-off per spec.md
- [x] T015 Commit and merge to main, push to GitHub

## Dependencies

- T001–T002 can run in parallel (different files)
- T003–T010 depend on T001–T002 being created first
- T011–T014 depend on T003–T010 being complete
- T015 is final, after sign-off
