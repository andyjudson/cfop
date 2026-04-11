# Cubing App Specification

## Overview
A cross-platform mobile/web application for learning Rubik's cube solving methods, specifically CFOP (Cross, F2L, OLL, PLL) algorithms.

## Feature 001: Beginner 2-look Algorithm Cases Grid

### Status: Complete ✅

### Scope
Create a clean, single-page grid display of 2-look beginner cubing cases (OLL and PLL algorithms) organized by groups. Focus on:
- Static grids organized by case type (no interactive filtering)
- OLL cases grouped by edge/corner orientation
- PLL cases grouped by corner/edge permutation
- Clean, readable layout with images and notation
- All sections use consistent styling (no special highlighting)

### Algorithms
Assumes understanding and use of Intuitive Cross and F2L methods for solving the first two layers. With the guide focusing on the minimalist OLL and PLL algorithms required to solve any cube scramble. 

Focus initially on learning the 5 essential algorithms, then progress to rest of the 2-look cases, and then eventually to the full 1-look F2L (41 cases), OLL (57 cases), and PLL (21 cases) ... good luck, if you're brain will remember them all - not mine!!

- **2-Look Methods (bgr/2lk)**: Complete set of OLL and PLL cases for solving the last layer
  - **OLL (Orientation of Last Layer)**: 10 cases
    - Edge orientation: Line, Hook, Dot cases (3 cases)
    - Corner orientation: Sune, AntiSune, H, Pi, T, L, U shapes (7 cases)
  - **PLL (Permutation of Last Layer)**: 6 cases  
    - Corner permutation: T-Perm, Y-Perm (2 cases)
    - Edge permutation: Ua-Perm, Ub-Perm, H-Perm, Z-Perm (4 cases)

- **3-Look Subset (recommended starting point)**: 5 essential cases for basic solving with repetition.
  - **OLL**: Sune, AntiSune (2 cases)
  - **PLL**: T-Perm, Ua-Perm, H-Perm (3 cases)

### User Interface
- Single page with no navigation
- Page title: "Cubing - Learning CFOP 2LK Methodology"
- Essentials summary line near top: Sune, AntiSune, T-Perm, Ua-Perm, H-Perm
- Static sectioned grids (no duplicated essentials section):
  - "OLL edge cases" (3 algorithms)
  - "OLL corner cases" (7 algorithms)
  - "PLL corner cases" (2 algorithms)
  - "PLL edge cases" (4 algorithms)
- Consistent card layout with images, names, notation, and essential star marker on relevant cards
- Uniform section styling across all groups
- Mobile-responsive grid layout

### Data Structure
Each algorithm contains:
- id: unique identifier
- name: human-readable case name
- notation: algorithm moves in standard notation
- method: "bgr" for beginner cases
- group: "edge" or "corner" for OLL, permutation type for PLL
- image: path to case visualization image
- notes: basic information

### Technical Requirements
- React with TypeScript
- Vite for build tooling
- Bulma for base page/card/grid structure + custom CSS for tooltips and visual tuning
- Shared resources via symlinks

## Feature 002: Algorithm Notes on Hover

### Status: Complete ✅

### Scope
Add interactive tooltips to display algorithm notes when hovering over case images. Focus on:
- Hover interaction on algorithm card images
- Tooltip displays markdown-formatted notes
- Notes include orientation instructions and technique guidance
- Clean tooltip styling that doesn't obstruct other cards
- Mobile-friendly tap interaction alternative

### Features
- Tooltip appears on image hover/tap
- Renders markdown from algorithm notes field
- Positioned near cursor/image without blocking other content
- Dismisses on mouse leave or tap outside

### Technical Requirements
- react-markdown for rendering notes (already installed)
- react-icons for essential marker icon
- CSS-based tooltip positioning
- Touch event handling for mobile
- Maintain existing card layout and styling
- Bulma used for base layout/components with targeted custom CSS overrides

### Styling Decisions (Captured)
- Keep light-mode default look and avoid strong/saturated section colors
- Remove colored page header background and use a neutral header section
- Keep light cards with subtle border/shadow for readability
- Use darker text for headings/body copy on white backgrounds
- Keep notation text in monospace style for algorithm readability
- Make notation text block + shaded background span full card content width
- Use a soft indigo-tint section header background (instead of cyan)
- Keep a fresh/sleek light aesthetic (subtle gradients, gentle shadows, clean spacing)
- Keep tooltip layering above adjacent cards, including with image zoom hover effects

### User Stories
- User hovers over Sune case image → sees note about cube orientation (oriented corner front-left, unoriented front-right facing forward)
- User hovers over T-Perm → sees note about headlight positioning
- Mobile user taps image → sees same tooltip with tap-to-dismiss behavior

## Feature 003: Algorithm Demo with Cubing.js

### Status: Complete ✅

### Scope
Add interactive 3D cube visualization using cubing.js library. Focus on:
- Demo button below essentials summary
- Modal dialog with TwistyPlayer showing random algorithm
- Custom control panel using Material Design icons (play, pause, rewind, speed controls)
- Algorithm display with move-by-move highlighting during playback
- Clean modal overlay with proper animation and keyboard controls

### Features
- Compact "Demo Random Algorithm" button below essentials summary
- Click opens modal with random algorithm from current set
- TwistyPlayer displays 3D cube executing the algorithm using PG3D with no default control panel
- Custom controls: play/pause, rewind to start, speed up/down (using + and - icons)
- Algorithm notation displayed in consistent fixed-width tokens with active/completed highlighting
- Modal dismissible via close button, escape key, or backdrop click
- Compact modal/cube/control layout to preserve space for notation display

### Technical Requirements
- cubing.js library for TwistyPlayer component
- Material Design icons (react-icons/md) for custom controls
- Modal component with backdrop overlay
- Algorithm parsing via `cubing/alg` (`Alg` + `Move`) with safe fallback tokenizer
- State management for playback position and speed
- Responsive modal sizing for mobile/desktop
- Player timeline sync via `experimentalModel.currentMoveInfo` and `coarseTimelineInfo` listeners (no timer-based drift)
- TwistyPlayer config uses legacy-proven settings: `visualization: PG3D`, `background: none`, `hintFacelets: none`, `controlPanel: none`, `experimentalSetupAlg: z2`, `experimentalSetupAnchor: end`, `experimentalDragInput: none`
- Stickering masks applied by method/group using `experimentalStickeringMaskOrbits`:
  - f2l → `EDGES:----IIII----,CORNERS:----IIII,CENTERS:------`
  - oll/edge → `EDGES:----OOOO----,CORNERS:----IIII,CENTERS:------`
  - oll/corner → `EDGES:----OOOO----,CORNERS:----OOOO,CENTERS:------`
  - pll/corner → `EDGES:----OOOO----,CORNERS:--------,CENTERS:------`
  - default → `EDGES:------------,CORNERS:--------,CENTERS:------`

### User Stories
- User clicks "Demo" button → modal opens with random algorithm
- User sees 3D cube performing algorithm moves
- User clicks play → algorithm executes with synchronized move highlighting (locked to actual player timeline)
- User adjusts speed → playback rate changes smoothly
- User clicks rewind → cube returns to solved state
- User presses Escape or clicks backdrop → modal closes

## Feature 004: Practice Scramble + Solve Timer Modal

### Status: Complete ✅

### Scope
Add a dedicated practice modal for lightweight solve rehearsal. Focus on:
- Opening a separate modal dialog for practice flow
- Random 3x3 scramble generation on demand
- Simple solve timer with clear start/stop behavior
- Predictable interaction rules between scramble and timer actions

### Features
- New "Practice Scramble + Timer" entry button on the main page
- Practice modal opens/closes via button, escape key, and backdrop interaction
- Random scramble generation on modal open and via `New Scramble`
- Simple timer with `idle`, `running`, and `stopped` states
- Live elapsed timer display and retained final time on stop
- Space key toggles timer start/stop while modal is open
- Running-state protection: scramble cannot be replaced while timing is active
- Non-blocking status feedback for blocked scramble action
- Space key handling prevents background page scroll while practicing
- Improved scramble text layout (centered, padded, balanced wrapping)

### Technical Requirements
- Use existing `cubing` dependency (`cubing/scramble`) for random 3x3 scrambles
- Keep timer state deterministic and robust under rapid interactions
- Keep feature client-side only (no persistence or backend dependency)
- Preserve existing grid/tooltip/demo behavior without regressions

### User Stories
- User opens practice modal → sees scramble and timer UI
- User generates new scramble repeatedly when not timing
- User starts timer, stops timer, and sees final time
- User presses Space in practice modal → timer starts/stops without scrolling the page
- User attempts `New Scramble` while timer running → scramble remains unchanged with clear feedback

## Feature 005: Persistent Solve Time Stats

### Status: Complete ✅

### Scope
Extend the practice timer modal by persisting completed solve times in browser localStorage and displaying derived statistics. Focus on:
- Save and display last solve time across sessions
- Calculate and show rolling average of last 5 solves
- Track and display personal best (fastest) solve time
- Robust localStorage handling with validation and corruption recovery
- Clean stats UI with reset functionality

### Features
- Solve history persistence using versioned localStorage envelope
- Three statistics displayed in practice modal:
  - Last time: Most recent completed solve
  - Average (last 5): Rolling mean with partial state note for <5 solves
  - Best time: Fastest solve ever recorded
- Stats update immediately after each solve
- Stats persist across modal close/reopen and browser sessions
- "Reset Stats" button to clear all history instantly (no confirmation)
- Empty state handling with clear placeholders (—) when no data exists
- Defensive validation: corrupted/invalid data falls back to safe empty state
- Bounded history (max 100 records) prevents unbounded storage growth

### Technical Requirements
- Browser localStorage with versioned JSON envelope (version, updatedAt, solves[])
- Runtime validation for stored data (invalid records ignored)
- React hook (useSolveStats) for stat computation and persistence integration
- localStorage operations wrapped in try/catch for non-fatal error handling
- Maintain existing timer/scramble behavior without regressions

### User Stories
- User completes solve → "Last time" displays and persists across sessions
- User completes 5+ solves → "Average (last 5)" shows accurate rolling mean
- User completes faster solve → "Best time" updates immediately
- User clicks "Reset Stats" → all statistics clear and revert to empty state
- User encounters corrupted localStorage → practice flow continues without errors

### UX Refinements (Bonus)
- Unified modal headers: both practice and demo modals use consistent Bulma delete button
- Space key binding added to demo modal for play/pause toggle (matches practice timer shortcut)
- Removed header border from practice modal to match demo modal styling

## Feature 006: Fallback Scramble Generator (Non-Official)

### Status: Specified 📝

### Scope
Create a local, client-side fallback scramble generator that does **not** rely on `cubing/scramble` workers, while still producing valid scramble notation that can be consumed by existing app flows and parsed by cubing.js utilities.

### Goals
- Keep practice flow reliable in production deployments where `cubing/scramble` fails
- Generate readable 3x3 scramble notation using deterministic guardrails (non-trivial, no immediate cancellations)
- Ensure generated notation is compatible with cubing.js parsing APIs (visualization compatibility optional for v1)
- Remove no-longer-needed Vite worker workaround config once fallback is active

### Non-Goals
- Achieving official WCA scramble status
- Replacing TNoodle or official competition tooling
- Building full random-state generators for all WCA events

### Technical Requirements
- Fallback generator implemented in app code (no worker dependency)
- Output validation using `Alg.fromString` compatibility checks
- Integration with practice modal scramble loading UX
- Optional compatibility hook for TwistyPlayer usage (same notation format)
- Vite config simplification after migration away from `cubing/scramble`

### Decision Notes
- Scrambles produced by this feature are **practice-grade**, not official competition scrambles
- Existing worker workaround in Vite is safe to keep short-term, but should be removed once no runtime code imports `cubing/scramble`/`cubing/search`

## Feature 007: Cube Image Generator Tool

### Status: Specified 📝

### Scope
Create a standalone developer tool app (`/cubing.spec/cubify-app`) for generating high-quality cube state images (SVG/PNG) suitable for algorithm documentation and educational materials.

### Goals
- Provide efficient workflow for batch-generating algorithm case images
- Support both 2D (SVG) and 3D (PNG) visualization modes with fixed output dimensions
- Enable setup algorithms and custom stickering masks for different CFOP stages
- Generate production-ready images without manual post-processing (no offline resize step)
- Reuse React + Bulma + shared theme from cfop-app for consistent tooling ecosystem

### Non-Goals
- End-user learning features (this is a developer/content-creator tool)
- Animation export or video generation
- Support for non-3x3 puzzles in initial version
- Integration with cfop-app runtime (standalone utility)

### Technical Requirements
- Standalone React app with cubing.js TwistyPlayer (visualization only, no interactive controls)
- Form-based workflow with apply/play/capture actions
- Configurable visualization parameters (setup alg, move alg, masks, anchor, 2D/3D mode)
- Fixed-size image output (SVG inline for 2D, PNG with automatic sizing for 3D)
- Preset masks for common CFOP stages (cross, F2L, OLL, PLL)
- Development logging of inverted algorithms for case creation workflow

### Decision Notes
- Separate app keeps image generation tooling isolated from learner-facing cfop-app
- Based on proven cubegen.html workflow but modernized with React component architecture
- Fixed PNG dimensions eliminate manual resize step from legacy workflow

## Feature 008: Full CFOP Algorithm Grids

### Status: Complete ✅

### Scope
Add complete CFOP algorithm reference pages (F2L, OLL, PLL) to cfop-app with navigation between beginner 2-look page and advanced full method pages.

### Goals
- Provide comprehensive reference for all 119 full CFOP algorithms (41 F2L, 57 OLL, 21 PLL)
- Enable cubers to progress from 2-look beginner method to full CFOP
- Organize algorithms by case groups for pattern recognition learning
- Maintain consistent UI/UX with existing 2-look page styling
- Support mobile and desktop viewing with responsive grid layout

### Non-Goals
- Interactive features (tooltips, demo player, practice timer) on full CFOP pages at this stage
- Search or filter functionality (users can scroll/scan to find cases)
- Algorithm learning progress tracking
- Alternative algorithm suggestions or favorites system

### Pages
- **2LK Page** (existing): Beginner 2-look method (16 cases) with all interactive features
- **F2L Page** (new): Full F2L method (41 cases) organized in 6 groups
- **OLL Page** (new): Full OLL method (57 cases) organized in 14 groups  
- **PLL Page** (new): Full PLL method (21 cases) organized in 5 groups

### Navigation
- Page-level routing with navigation menu on all CFOP pages
- Active page indicator in navigation
- Browser URL updates for deep linking and back/forward button support
- Modals close when navigating between pages

### Data & Assets
- Uses existing algorithm JSON files: `algs-cfop-f2l.json`, `algs-cfop-oll.json`, `algs-cfop-pll.json`
- Uses existing cube state images from `./assets/cfop_f2l/`, `./assets/cfop_oll/`, `./assets/cfop_pll/`
- All data and assets already complete from previous feature work

## Feature 009: Intuitive Methods Learning Page

### Status: Complete ✅

### Scope
Add a dedicated Intuitive Methods page covering intuitive Cross and intuitive F2L guidance, with visual case examples and step-based progression structure. Content migrated from legacy materials with creator-specific references removed in favour of neutral instructional wording.

### Key Decisions
- Static content only — no collapsible sections, interactive cards, or hint-reveal controls
- Case cards show label + image; incomplete move hints omitted; unavailable images show a placeholder
- Page accessible from main navigation between Intuitive and Beginner items
- `IntuitiveCaseCard` variant of `AlgorithmCard` component for case visuals

## Feature 010: Notation Reference Page

### Status: Complete ✅

### Scope
Add a dedicated notation reference page covering face rotations, modifiers, slice moves, cube rotations, and common triggers. Each section uses visual examples from existing notation assets with beginner-friendly explanations.

### Key Decisions
- Navigation label "Notation", positioned between Intuitive and Beginner in the menu
- Trigger section shows name and sequence only (inverse omitted as derivable from the page explanation)
- Notation tiles use consistent card styling matching algorithm pages
- Static reference content only — no interactive players or timers

## Feature 011: About Page & Persistent Hamburger Navigation

### Status: Complete ✅

### Scope
Consolidate all educational and contextual content (cubing background, CFOP primer, methods overview, WCA context, video resources, practice strategies) into a dedicated About page as the first navigation item. Replace Bulma's responsive desktop nav bar expansion with a persistent hamburger menu at all screen widths. Clean README files to contain only technical documentation.

### Key Decisions
- About page is a single scrollable page with six named sections (no sub-pages or tabs)
- Hamburger always visible via CSS override of Bulma's default desktop expansion behaviour
- Root `/` redirect changed from `/2lk` to `/about` — About is the landing page
- BGRPage intro trimmed to essentials summary only; IntuitivePage links left in place (contextually appropriate)
- Backdrop-close and Escape-dismiss added to hamburger, consistent with notes sheet pattern
- README files (root + cfop-app) stripped of educational content; technical documentation retained

## Feature 012: WCA World Record Evolution Chart

### Status: Complete ✅

### Scope
Add an interactive step-line chart to the "World Cube Association" section of the About page, visualising how 3×3 Single and Average world record times have evolved from 2004 to the present. The chart reads from a static NDJSON data file (`public/data/wca-wr-evo.json`) that can be updated by file replacement with no code changes.

### Key Decisions
- **Recharts** (tree-shaken, ~40 kB gzip): native `type="stepAfter"` line, JSX tooltip, React-native API
- Unified `data` array on `<LineChart>` with separate `dataKey` per `<Line>` (Recharts v3 pattern)
- CSS custom property tokens for all colours; `getComputedStyle` resolution at runtime for Recharts stroke props
- Custom `TooltipContentProps`-typed tooltip component — competitor name, country flag, date, time
- Explicit `xTicks` at 2-year boundaries via `Date.UTC` to prevent duplicate year labels
- Explicit `yMax` computed across both series to correct Recharts v3 single-dataKey domain limitation
- `--color-accent-warm: #e05c28` added to token system for Average WR series (warm orange complement to blue Single WR)
- Competition ID removed from tooltip for cleaner display

## Feature 013: Global Algorithm Visualizer & Practice Timer

### Status: Complete ✅

### Scope
Promoted the Algorithm Visualizer and Practice Timer from the Beginner page into the nav bar, accessible from any page. Upgraded the Visualizer to a full OLL/PLL browser with three selectors (set, group, specific algorithm) and a Shuffle button. Cleaned up the Beginner page by removing the now-redundant modal trigger buttons. Deleted `DemoModal` (superseded by `VisualizerModal`).

### Key Decisions
- `CfopNavigation` owns modal state — no context or prop drilling; modals render directly from nav
- New `VisualizerModal` self-loads OLL/PLL data, manages its own set/group/algorithm selection state
- Three-selector layout: Set → Group → Algorithm + Shuffle; algorithm selector updates when set/group changes
- Auto-shuffles OLL on open so player is never empty
- `DemoModal` deleted; its CSS absorbed into `VisualizerModal.css` with hardcoded values replaced by tokens
- Modal width 580px to prevent long algorithm move sequences wrapping to 3 lines

## Implementation Plan

### Completed Features ✅
**Feature 001 - Beginner 2-look Algorithm Case Grid (Completed)**:
- Single-page grid of 16 2-look algorithms
- Static sections organized by case groups:
  - Essential cases to learn first (5 algorithms)
  - OLL edge cases (3 algorithms)
  - OLL corner cases (7 algorithms)
  - PLL corner cases (2 algorithms)
  - PLL edge cases (4 algorithms)
- Page title: "Cubing - Learning CFOP 2LK Methodology"
- Clean card layout without badges
- Section headings with purple gradient background
- Shared resources via symlinks
- Responsive design
- Production build verified

**Feature 002 - Algorithm Notes on Hover (Completed)**:
- Tooltip component for algorithm notes ✅
- Hover interaction directly on cube images (not whole card) ✅
- Markdown rendering in tooltips ✅
- Touch-friendly tap interaction for mobile ✅
- Clean tooltip styling with arrow indicator ✅
- Tooltips positioned to right of cube image (auto-flips to left when near viewport edge) ✅
- Smart positioning: detects available space and prevents off-screen overflow ✅
- Centered cube images within cards ✅
- Bulma adopted for layout/components (container, grid, cards, typography) ✅
- Light theme styling tuned for readability (darker text, neutral header, soft section backgrounds) ✅
- Fresh/sleek style polish (refined cards, spacing, subtle hover effects) ✅
- Essentials deduped (summary line + in-section markers instead of repeated cards) ✅
- Essential marker converted to icon-based star badge ✅
- Tooltip z-order refined to prevent overlap clipping with adjacent cards ✅
- Algorithm notation row set to full-width shaded block in each card ✅
- Production build verified ✅

**Feature 003 - Cubing.js Demo Modal (Completed)**:
- Demo button placed below essentials summary and visually compact ✅
- Random algorithm selection from the current 2-look dataset ✅
- Modal-based TwistyPlayer integration with custom controls ✅
- Custom icon controls implemented (play, pause, rewind, speed -, speed +) ✅
- Speed indicator and bounded speed adjustments (0.5x → 3.0x) ✅
- Notation tokens styled with consistent width and monospace font ✅
- Active/completed move highlighting synchronized to player timeline ✅
- Rewind behavior uses `jumpToStart()` for clean reset ✅
- Legacy player visual settings and setup behavior carried over/refined ✅
- Method/group stickering masks applied to the cube visualization ✅
- Compact modal/cube/control sizing tuned to avoid notation crowding ✅
- Control strip reverted to transparent (no full-width background fill) ✅
- Escape key + backdrop click + close button dismissal verified ✅

**Feature 004 - Practice Scramble + Solve Timer Modal (Completed)**:
- Main-page practice entry button and dedicated modal ✅
- Random scramble generation on open and on demand ✅
- Timer state machine (`idle`/`running`/`stopped`) implemented ✅
- Start/stop/reset solve flow with stable elapsed display ✅
- Running-state scramble protection with user feedback ✅
- Space key timer shortcut (start/stop) with background scroll suppression ✅
- Scramble layout refinement (centered, padded, cleaner wrapping) ✅
- Minor header/subtitle spacing polish on main page ✅
- Production build and manual browser validation completed ✅

**Feature 005 - Persistent Solve Time Stats (Completed)**:
- localStorage persistence for solve history with versioned envelope ✅
- useSolveStats hook with save/load/reset functionality ✅
- Statistics display in practice modal (Last time, Average of last 5, Best time) ✅
- Defensive validation and corruption-safe fallback for stored data ✅
- Bounded history (max 100 records) to prevent unbounded growth ✅
- Empty/partial state handling for <5 solves with helpful UI notes ✅
- Reset Stats button with instant clear (no confirmation warning) ✅
- Unified modal headers (both practice and demo use Bulma delete button) ✅
- Space key binding added to demo modal for play/pause toggle ✅
- Consistent header styling across modals (no border separation) ✅
- All three user stories implemented and validated ✅
- Production build and manual browser validation completed ✅

**Feature 009 - Intuitive Methods Learning Page (Completed)**:
- Intuitive Methods page added with Cross and F2L sections ✅
- Step-based F2L guidance (easy inserts, setup pairs, setup inserts) ✅
- `IntuitiveCaseCard` component for visual case examples ✅
- Incomplete move hints omitted; unavailable images show placeholder ✅
- Page added to main navigation ✅
- Static content only — no interactive controls ✅

**Feature 010 - Notation Reference Page (Completed)**:
- Notation page added covering face rotations, modifiers, slice moves, cube rotations, triggers ✅
- Visual tile cards per notation example with image + symbol + explanation ✅
- Common triggers section with name and sequence (inverse omitted) ✅
- Navigation label "Notation" added between Intuitive and Beginner ✅
- Consistent card and section-banner styling matching other pages ✅

**Feature 008 - Full CFOP Algorithm Grids (Completed)**:
- Four-page navigation implemented: 2LK, F2L, OLL, PLL ✅
- Hash-based routing with browser history support ✅
- React Router integration with active page indicators ✅
- BGRPage refactored from App.tsx with all interactive features preserved ✅
- F2LPage created with 41 cases organized in 6 groups ✅
- OLLPage created with 57 cases consolidated into 7 balanced groups ✅
- PLLPage created with 21 cases organized in 5 groups ✅
- OLL group consolidation: 14 groups → 7 groups (improved scanability) ✅
- Expandable/collapsible algorithm sections with sessionStorage persistence ✅
- useSectionToggle hook for per-page expand/collapse state management ✅
- AlgorithmGroupSection component with Title Case transformation ✅
- ExpandCollapseControls for "Expand All"/"Collapse All" functionality ✅
- CfopNavigation component with persistent header and active indicators ✅
- CfopPageLayout wrapper providing consistent layout across pages ✅
- ErrorBoundary component for graceful data loading error handling ✅
- Responsive design validated on mobile and desktop ✅
- README.md updated with full navigation and feature documentation ✅
- Production build validated: 1.78s, no errors ✅
- react-router-dom dependency added ✅

**Feature 015 - Dark Mode (Completed)**:
- Dark/light theme toggle (moon/sun icons) always visible in navbar brand bar alongside Visualizer and Practice icon buttons ✅
- `useTheme` hook: `localStorage` persistence (`cfop-theme`), OS `prefers-color-scheme` fallback, try/catch for private browsing ✅
- FOUC-prevention inline script in `<head>` applies theme before first paint ✅
- Full `[data-theme="dark"]` CSS token override block in `index.css`; Bulma CSS variable overrides for navbar and components ✅
- Navbar restructured: section divider between primer/beginner and F2L/OLL/PLL; Visualize and Practice moved to icon-only brand bar ✅
- Modal borders added; `PracticeSessionModal.css` and `VisualizerModal.css` fully tokenised ✅
- Beat the Champion data model fixed: `tier` removed, `wr_single_at_time`/`wr_average_at_time` computed via PySpark non-equi join ✅
- ComparisonResult redesigned: transposed table with TR-level row colours (You = primary, Champion = blue, WR = orange) ✅
- Algorithm `line_break` field for controlled notation wrapping (`white-space: pre-wrap`) ✅
- Section headers left-aligned on Notation, BGR, About pages; "What's in This App" section added to About ✅
- PySpark export functions accept `dest_path` parameter; `APP_DATA_PATH` constant for direct-to-app export ✅
- Production build verified, no TypeScript errors ✅

**Feature 014 - Beat the Champion (Completed)**:
- Competitive practice mode using real WCA competition scrambles (57 events: 36 WR + 21 championship) ✅
- Mode toggle in timer controls row with MUI icons; competition name + tier badge inline in scramble header ✅
- Solve progress pill (`n / 5`) and standard solve count pill in timer header ✅
- Comparison result screen: user times vs winner single + average, beat/miss verdict ✅
- Competition selector: scrollable list with tier badges, winner times, row highlight ✅
- WR badge accent blue, Champ badge accent orange; winner/competition names in accent blue ✅
- `saveSolve` only called in standard mode — competitive solves never contaminate stats ✅
- Production build verified, no TypeScript errors ✅

**Feature 013 - Global Algorithm Visualizer & Practice Timer (Completed)**:
- `VisualizerModal` component with OLL/PLL data loading, 3-selector UI (set/group/algorithm), Shuffle ✅
- "Visualize" and "Practice" nav action buttons in `CfopNavigation` — accessible from any page ✅
- `DemoModal` deleted; styles absorbed into `VisualizerModal.css` with hardcoded values replaced by tokens ✅
- Beginner page cleaned up: Demo/Practice buttons, state, and imports removed ✅
- Default route changed from `/about` to `/2lk` ✅
- Production build verified, no TypeScript errors ✅

**Feature 012 - WCA World Record Evolution Chart (Completed)**:
- `WrEvolutionChart` self-contained component with NDJSON fetch, parse, and Recharts render ✅
- Two step-line series (Single WR + Average WR) with unified data array on `<LineChart>` ✅
- Custom tooltip: competitor name, country flag emoji, formatted date, solve time ✅
- Explicit 2-year X-axis ticks; explicit Y-axis max across both series ✅
- Colour tokens only: `--color-accent-primary` (blue) + `--color-accent-warm` (orange, new token) ✅
- Graceful fallback for missing/failed data file ✅
- `<WrEvolutionChart />` single tag in `AboutPage.tsx` WCA section ✅
- Production build verified, no TypeScript errors ✅

**Feature 011 - About Page & Persistent Hamburger Navigation (Completed)**:
- AboutPage.tsx created with six content sections: Cubing Background, CFOP Primer, Methods Overview, WCA Context, Video Resources, Practice Strategies ✅
- Root `/` redirect changed from `/2lk` to `/about` ✅
- About added as first item in CfopNavigation navLinks ✅
- Always-hamburger CSS override applied — `.cfop-navbar .navbar-burger { display: flex !important; }` ✅
- `.cfop-navbar .navbar-menu` hidden until `.is-active` at all viewport widths ✅
- Backdrop-close (click outside) and Escape-dismiss added to hamburger menu ✅
- BGRPage intro trimmed to essentials summary only; video links and context prose migrated ✅
- README.md (root): Motivation, CFOP Primer, Recommended Videos, Practice Strategies removed ✅
- cfop-app/README.md: CFOP Method Overview and Practice Strategies sections removed ✅
- Production build verified: no errors ✅

**Feature 016 - Algorithm Image Generation (Completed)**:
- All 135 CFOP case images generated as transparent PNGs via cubify-app (Playwright + cubing.js TwistyPlayer) ✅
- OLL: 57 cases, 2D view, no masking (1-look app), z2 setup, yellow top ✅
- PLL: 21 cases, 2D view, no masking, z2 + y-compensation for green front ✅
- F2L: 41 cases, 3D view, FR slot normalised via z2 + y-prefix detection ✅
- BGR: 16 cases, mixed OLL/PLL subset for intuitive/beginner pages ✅
- Transparent PNG output: `background: transparent` + `omitBackground: true` + no white pad ✅

**Feature 017 - Cubify Agent Skill (Completed)**:
- `cubify-scripts/cubify.mjs` CLI for on-demand cube image generation ✅
- `.claude/commands/cubify.md` Claude Code skill invokable as `/cubify` ✅
- Playwright headful Chromium + esbuild IIFE bundle served via local HTTP server ✅
- Case lookup from `algs-cfop-*.json`; setup/mask derived from `method` + `mask` field ✅
- Auto y-prefix detection for F2L slot normalisation; explicit `setup` field for exceptions ✅
- Output to `.claude/tmp/cubify/` (gitignored) ✅
- Production batch run: all 135 CFOP cases regenerated as transparent PNGs ✅

**Feature 018 - Scramble Cube Preview (Completed)**:
- Live 3D TwistyPlayer cube in Practice Timer modal showing scrambled state ✅
- Two-panel row layout: scramble text left, cube right; tap cube to expand hiding timer/stats ✅
- Mobile-optimised: compact horizontal cube panel, full-width button row ✅
- Key fix: TwistyPlayer requires explicit px container dimensions for IntersectionObserver to fire ✅

**Feature 019 - Visual Case Carousel (Completed)**:
- Horizontal scrollable carousel of case images in the Visualizer modal ✅
- Tap a case image to load it into the player — recognition-first navigation ✅
- Arrow key (←/→) navigation through cases in browse mode ✅
- Single toggle button switches Browse/Select modes; group selector on same row ✅
- Active case highlighted and scrolled into view; synced with dropdown state ✅
- Mobile: toggle and carousel hidden, dropdowns always shown ✅

**Feature 020 - WR Legends Panel (Completed)**:
- Side-by-side panel in About page WCA section: 1/3 legends table, 2/3 evolution chart ✅
- Table derived from existing wca-wr-evolution.json — no new fetch ✅
- Sortable by name, WR count, single, average; current record holders highlighted ✅
- Expand/collapse toggle to go chart-only ✅
- PySpark summarize_person_wr() aligned to add is_current_single/avg flags ✅

**Feature 021 - Probability Scoring (Completed)**:
- Display `prob` field (e.g. "1/54") on each OLL and PLL case card ✅
- Show WCA case number alongside the case name ✅
- Surface probabilities in the Visualizer modal (case header area) ✅
- Data already injected into algs-cfop-oll.json and algs-cfop-pll.json ✅

**Feature 022 - cubify-harness (In Progress)**:
- `CubeState` — wraps cubing.js KPattern; `applyMove/applyAlg`, `toFaceArray()`, `invertAlg()` ✅
- `CubeRenderer3D` — Three.js 3D cube; `setState()`, `animateMove()`, `animateAlg()`; `setSpeed()` / `isAnimating` public API ✅
- `CubeStickering` — CFOP stickering presets: full, cross, f2l, oll, oll-2look, pll, pll-2look ✅
- `AlgParser` — WCA notation parser; handles wide moves, slice moves, x/y/z rotations ✅
- Interactive harness (`index.html`) — algorithm selector, play/step/speed controls, event log / face state / KPattern debug panels ✅
- `verify-perms.mjs` — 18-test cross-check suite; CubeState ground truth + physical facts ✅
- Hard-won cube-mapping-lessons.md — corner/edge slot ordering, orientation formula, animation sequencing, stickerIndex formulas ✅
- cubing.js U/D direction convention documented and animation-only fix applied ✅

**Feature 023 - cubify-stickering (Planned)**:
- `CubeStickering.fromOrbitString()` — parses masks.mjs orbit strings into visibility map ✅ (planned)
- Named CFOP presets: full, cross, f2l, oll, oll-2look, pll, pll-2look ✅ (planned)
- Stickering controls in harness demo; iamthecu.be-style cubelet group toggles ✅ (planned)
- masks.mjs orbit strings usable directly — single source of truth ✅ (planned)

**Feature 024 - cubify-animation / CubePlayer Engine (Planned)**:
- Full move timeline: play, pause, jumpTo, setSpeed, reset ✅ (planned)
- Event emitter: move { index, move, state }, complete, reset ✅ (planned)
- Configurable inter-move gap; correct onDone callback chaining (no setTimeout racing) ✅ (planned)
- Harness demo rewired to CubePlayer ✅ (planned)

**Feature 025 - cubify-theming (Planned)**:
- Named themes: Rubik's classic, modern/Twisty-style, speed cube, minimal white ✅ (planned)
- Theme dimensions: sticker colours, plastic colour, gap size, bevel radius, surface finish ✅ (planned)
- Live controls in harness demo; per-face colour pickers; export theme as JSON ✅ (planned)

**Feature 026 - cubify-image-export (Planned)**:
- `CubeRenderer2D.toSVG()` + `CubeExporter.toPNG(style: 2d|3d)` — 2D net or 3D rendered ✅ (planned)
- `CubeExporter.toSVG/toPNG()` — no browser dependency for SVG; OffscreenCanvas for PNG ✅ (planned)
- Visual parity with existing cubing.js OLL/PLL images; 3D style for cross/F2L ✅ (planned)
- Node.js validation script ✅ (planned)

**Feature 027 - cubify-tests (Planned)**:
- Vitest unit suite for CubeState: all cube-mapping-lessons verification tests ✅ (planned)
- CubeStickering orbit string parsing tests ✅ (planned)
- stickerIndex formula and MOVE_AXIS direction tests ✅ (planned)
- Runs in CI, no headed browser required ✅ (planned)

**Feature 028 - cubify.js Library API (Planned)**:
- Extract cubify-harness core into clean standalone library with documented public API ✅ (planned)
- Remove internal `_` properties from public surface; wrap speed/animating in methods ✅ (planned)
- `CubeRenderer3D.setStickering()` accepts preset name or raw orbit string ✅ (planned)
- Prerequisites: 023 stickering, 024 animation, 025 theming, 026 2D export ✅ (planned)

**Feature 029 - cubify-react (Planned)**:
- `<CubePlayer>` React component: playing/stepIndex/alg/stickering props, onMove/onComplete ✅ (planned)
- `<CubeState>` display-only component: no animation, mount + setState ✅ (planned)
- TypeScript-typed; manages mount/unmount lifecycle, no boilerplate in consumers ✅ (planned)

**Feature 030 - cubify-decouple (Planned)**:
- Remove all direct cubing.js imports from cfop-app (Alg/Move in scramble, VisualizerModal) ✅ (planned)
- cubing.js remains internal to cubify-harness (KPattern); zero imports in cfop-app source ✅ (planned)

**Feature 031 - cubify-cfop-migration (Planned)**:
- Replace TwistyPlayer in VisualizerModal with `<CubePlayer>` ✅ (planned)
- Replace TwistyPlayer in ScrambleCubePreview with `<CubeState>` ✅ (planned)
- Remove all IntersectionObserver workarounds and explicit px dimension hacks ✅ (planned)
- Production bundle size reduction: cubing.js 3D chunk removed ✅ (planned)
- Prerequisites: 024 animation, 025 theming, 029 React wrapper, 030 scramble ✅ (planned)

**Feature 032 - PWA & Bundle Optimisation (Deferred)**:
- Service worker for offline support ✅ (planned)
- Asset caching strategy for algorithm JSON, PNGs, and app shell ✅ (planned)

**Feature 033 - Personalisation & Learning Progress (Deferred)**:
- Per-case practice tracking, bookmarking, algorithm notation preference ✅ (planned)

**Feature 034 - Alt Algs UI (Deferred)**:
- Surface alternative algorithms in Visualizer modal ✅ (planned)
- Toggle between primary and alternative alg for a case ✅ (planned)
