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

## Feature Backlog (Not in Scope)
All of below ideas are out of scope until explicitly requested. We are just capturing them here as a backlog. We'll explore them iteratively using speckit.specify prompts.
**Roadmaps**
- About page
- Cubing notation primer
- Intuitive Cross and F2L primer
- Full CFOP method coverage (all F2L, OLL, PLL cases)
- Interactive visualizations of solve algorithms
- Scramble generator for practice
- Solve time tracking for practice
- Algorithm learning tracking for practice
- Advanced UI components
- Mobile app deployment
- Additional algorithm sets

## Implementation Plan

### Completed Features ✅
**Feature 001 - Beginner 2-lookses Grid (Completed)**:
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
