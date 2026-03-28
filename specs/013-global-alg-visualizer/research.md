# Research: Global Alg Visualizer & Practice Timer — Phase 0

**Feature**: 013-global-alg-visualizer
**Date**: 2026-03-28

## Decision 1: How to surface modals from the nav bar

**Decision**: `CfopNavigation` owns the modal open/close state and renders `VisualizerModal` + `PracticeSessionModal` directly.

**Rationale**: The nav is already a self-contained component included in every page via `CfopPageLayout`. Making it own its own modal triggers keeps the blast radius small — no context, no prop drilling through `CfopPageLayout` or `App.tsx`. Both modals use `position: fixed` so z-index and stacking are unaffected by where they mount in the tree. Two boolean state variables (`showVisualizer`, `showPractice`) are added to `CfopNavigation`. Nav items are a mix of page-link anchors and action buttons; both can be styled as `.navbar-item` using `<button>` elements.

**Alternatives considered**:
- React context at `App.tsx` level — unnecessary complexity for two simple booleans; adds an indirection layer with no benefit here
- Props passed through `CfopPageLayout` — requires `CfopPageLayout` to know about modals, breaking its generic wrapper role
- New top-level provider — over-engineered; constitution prefers minimal complexity

---

## Decision 2: VisualizerModal — new component vs extending DemoModal

**Decision**: Create a new `VisualizerModal.tsx` component. `DemoModal` is left unchanged.

**Rationale**: `DemoModal` accepts a pre-selected `CfopAlgorithm` as a prop and is purpose-built for the Beginner page flow (caller selects alg, passes it in). `VisualizerModal` needs to own its own algorithm selection (set/group/shuffle) internally. These are different ownership models; merging them would create a messy optional-prop API. Keeping them separate preserves `DemoModal`'s simple interface. Since BGRPage's Demo button is being removed (US3), `DemoModal` will no longer be used after this feature — but it stays in place without modification (dead code can be removed in a future cleanup if desired).

`VisualizerModal` will:
- Load OLL and PLL JSON data on first open
- Maintain `selectedSet`, `selectedGroup`, and `currentAlgorithm` state
- Reuse the same TwistyPlayer initialization and controls logic as DemoModal (duplicated but self-contained; the player lifecycle is complex enough that composition via a shared sub-component is not worth the abstraction cost for two modals)
- Add Shuffle button to the controls row
- Display algorithm name + group label in the modal header

---

## Decision 3: Algorithm data loading in VisualizerModal

**Decision**: Fetch OLL and PLL JSON files on first open; cache in component state for the session.

**Rationale**: Data files already exist at `public/data/algs-cfop-oll.json` (57 cases) and `public/data/algs-cfop-pll.json` (21 cases). Both are already fetched by `OLLPage` and `PLLPage` via the same pattern used across the app. Fetching on first open (not on every render) keeps load fast. No new data format or processing needed — the existing `CfopAlgorithm` schema (`id`, `name`, `notation`, `method`, `group`, `image`) covers all required fields.

---

## Decision 4: OLL group names and count

**Decision**: Use the 7 group names as they exist in `algs-cfop-oll.json`. The spec mentioned 14 groups — that was the pre-consolidation count. The current data has 7 groups (consolidated in Feature 008).

**Actual groups**:
- **OLL (7 groups)**: Block & Edge Setup, Cross Solved, Dot Patterns, Fish & Awkward, Lightning & Hooks, Line & L Shapes, Small Patterns
- **PLL (5 groups)**: adjacent swap, corners only, diagonal swap, edges only, G perms

SC-003 in the spec references "14 groups" — this will be updated to "7 groups" in the implementation. The spec assumption is based on a stale count.

---

## Decision 5: Nav entry styling for action items (buttons)

**Decision**: Style `<button>` elements with the `.navbar-item` class to match existing link entries.

**Rationale**: Bulma `.navbar-item` applies to both `<a>` and any element. Using `<button type="button" className="navbar-item">` with appropriate CSS reset (no background, no border, cursor pointer) gives consistent visual appearance. A subtle visual cue (e.g., icon prefix using react-icons) distinguishes action items from page links without introducing a new design pattern.

**Icons**: `MdVideocam` for Visualize, `MdTimer` for Practice — both already imported in the app.

---

## Decision 6: BGRPage clean-up scope

**Decision**: Remove the two modal trigger buttons (`Demo Random Algorithm`, `Practice Scramble + Timer`) and all associated state (`showDemo`, `demoAlgorithm`, `showPracticeSession`) and handlers from `BGRPage.tsx`.

**Rationale**: Once both tools are in the nav, these buttons become redundant. Their removal simplifies `BGRPage` — it no longer imports `DemoModal`, `PracticeSessionModal`, or the timer/video icons. The `button-row` div and the inline modal rendering (`{showDemo && ...}`, `<PracticeSessionModal ...>`) are also removed. The remaining `BGRPage` is a clean algorithm reference page.

---

## Decision 7: Default state when VisualizerModal opens

**Decision**: Default to OLL / All groups. Auto-shuffle one algorithm on open (so the player is never empty).

**Rationale**: Opens into a useful state immediately without requiring the user to press Shuffle first. OLL is the larger and more commonly practised set — a reasonable default. "All groups" is the most open default scope.
