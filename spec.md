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
Create a standalone developer tool app (`/cubing.spec/imggen-app`) for generating high-quality cube state images (SVG/PNG) suitable for algorithm documentation and educational materials.

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

## Feature Backlog (Not in Scope)
All of below ideas are out of scope until explicitly requested. We are just capturing them here as a backlog. We'll explore them iteratively using speckit.specify prompts.
**Roadmaps**
- Notation primer
- Intuitive Cross and F2L primer
- Interactive visualizations for any user selected cases
- Algorithm learning tracking for practice
- Revisit UI design, layout, theme, components
- Mobile deployment or native app (unlikely)
- Alternative algorithm sets (unlikely)

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
