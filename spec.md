# Cubing App Specification

## Overview
A cross-platform mobile/web application for learning Rubik's cube solving methods, specifically CFOP (Cross, F2L, OLL, PLL) algorithms.

## Current Iteration: Starting to learn CFOP using 2-Look cases

### Scope
Build a skeleton site displaying a grid of 2-look beginner cubing cases (OLL and PLL algorithms). Focus on:
- Clean, responsive grid layout
- Algorithm images and notation
- Basic filtering by case type
- Mobile-friendly design

### Algorithm Sets (Current Focus)
- **Beginner 2-look methods (bgr/2lk)**: Complete set of OLL and PLL cases for solving the last layer
  - **OLL (Orientation of Last Layer)**: 10 cases
    - Edge orientation: Line, Hook, Dot cases (3 cases)
    - Corner orientation: Sune, AntiSune, H, Pi, T, L, U shapes (7 cases)
  - **PLL (Permutation of Last Layer)**: 6 cases  
    - Corner permutation: T-Perm, Y-Perm (2 cases)
    - Edge permutation: Ua-Perm, Ub-Perm, H-Perm, Z-Perm (4 cases)

- **3-Look Subset (Recommended Starting Point)**: 5 essential cases for basic solving with repetition
  - **OLL Corners**: Sune, AntiSune (2 cases)
  - **PLL**: T-Perm, Ua-Perm, H-Perm (3 cases)
  
  These 5 algorithms provide a foundation that works (with repetition) and can be expanded to full 2-look solving.

These 16 algorithms, combined with intuitive methods for Cross and F2L, enable complete cube solving.

### User Interface
- Mobile-first responsive grid
- Light mode default
- Simple navigation/filtering
- Clean card-based layout

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
- Cubing.js for interactive cube visualizations
- Responsive CSS (no frameworks yet)

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

## Implementation Notes
- Use shared resources via symlinks
- Start with static grid, add interactivity iteratively
- Focus on clean code and maintainable structure
- Test on mobile devices early