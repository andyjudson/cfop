# Cubing App Specification

## Overview
A cross-platform mobile/web application for learning Rubik's cube solving methods, specifically CFOP (Cross, F2L, OLL, PLL) algorithms.

## Current Iteration: Algorithm Notes on Hover

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

## Previous Iteration: 2-Look Beginner Cases Grid

### Scope
Create a clean, single-page grid display of 2-look beginner cubing cases (OLL and PLL algorithms) organized by groups. Focus on:
- Static grids organized by case type (no interactive filtering)
- OLL cases grouped by edge/corner orientation
- PLL cases grouped by corner/edge permutation
- Clean, readable layout with images and notation
- All sections use consistent styling (no special highlighting)

### Algorithm Sets (Current Focus)
- **2-Look Methods (bgr/2lk)**: Complete set of OLL and PLL cases for solving the last layer
  - **OLL (Orientation of Last Layer)**: 10 cases
    - Edge orientation: Line, Hook, Dot cases (3 cases)
    - Corner orientation: Sune, AntiSune, H, Pi, T, L, U shapes (7 cases)
  - **PLL (Permutation of Last Layer)**: 6 cases  
    - Corner permutation: T-Perm, Y-Perm (2 cases)
    - Edge permutation: Ua-Perm, Ub-Perm, H-Perm, Z-Perm (4 cases)

- **3-Look Subset (recommended starting point)**: 5 essential cases for basic solving with repetition
  - **OLL Corners**: Sune, AntiSune (2 cases)
  - **PLL**: T-Perm, Ua-Perm, H-Perm (3 cases)
  
  These 5 algorithms provide a foundation that works (with repetition) and can be expanded to full 2-look solving, and then eventually to the full 1-look F2L (41 cases), OLL (57 cases), and PLL (21 cases) set of algorithms if you're brain will remember them all - not mine!!

### User Interface
- Single page with no navigation
- Page title: "Cubing - Learning CFOP 2LK Methodology"
- Essentials summary line near top: Sune, AntiSune, T-Perm, Ua-Perm, H-Perm
- Static sectioned grids (no duplicated essentials section):
  - "OLL edge cases" (3 algorithms)
  - "OLL corner cases"  (7 algorithms)
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

## Future Iterations (Not in Scope)
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

### Current State ✅
**Previous Iteration - Static Grid (Completed)**:
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

**Current Iteration - Hover Tooltips (Completed)**:
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

### Future Iterations (Out of Scope)
All of below ideas are out of scope until explicitly requested through speckit.specify. We are just capturing them here as a roadmap. We'll promote them up when ready as new feature specs.

**Roadmap**
- Expandable/collapsible sections for groups of cases
- Full algorithm detail modal/page view
- 3D cube visualizations
- Progress tracking
- Practice tools
- Full CFOP coverage
- Enhanced learning features
- Mobile app deployment

## Implementation Notes
- Use shared resources via symlinks
- Start with static grid, add interactivity iteratively
- Focus on clean code and maintainable structure
- Test on mobile devices early