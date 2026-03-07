# Cubing App Specification

## Overview
A cross-platform mobile/web application for learning Rubik's cube solving methods, specifically CFOP (Cross, F2L, OLL, PLL) algorithms.

## Core Features

### Algorithm Learning
- Display CFOP algorithms organized by method (Cross, F2L, OLL, PLL)
- Stagger learning from beginner with intuitive with Cross and F2L techniques and 3-look cases from OLL and PLL, then 2-look cases, and then 1-look full alg sets from F2L, OLL, and PLL 
- User should be flow from grid of algs, to a single case with image and alg, to an animation if needed
- Interactive 3D cube visualizations using Cubing.js TwistyPlayer
- Algorithm notation display with proper formatting
- Markdown support for algorithm notes and footnotes
- Progress tracking with localStorage persistence
- Should be an about page with some introduction to the history and overview of the CFOP method and the incredible times the world is seeing these days in competitions
- Should be an notation page to explain the syntax vs moves

### Algorithm Sets
- Intuitive (cross + f2l): techniques rather than algorithms
- Beginner 3/2-look methods (bgr): OLL and PLL simplified
- First 2 layers (f2l): 41 case patterns
- Orientation of Last Layer (oll): 57 case patterns
- Permutation of Last Layer (pll): 21 case patterns

### User Interface
- Mobile-first design using Ionic components
- Dark/light mode support
- Responsive grid layouts for algorithm display
- Navigation between different algorithm sets
- Modal panels for detailed algorithm information

### Data Structure
Each algorithm contains:
- id: unique identifier
- name: human-readable case name
- notation: algorithm moves in standard notation
- method: CFOP step (cross/f2l/oll/pll)
- group: UI grouping category
- image: path to case visualization image
- notes: markdown-formatted additional information

### Technical Requirements
- React 18+ with TypeScript
- Ionic 8+ for UI components
- Capacitor 7+ for native mobile deployment
- Cubing.js for cube visualizations and scramble generation
- Vite for build tooling
- Local storage for user progress tracking

## User Stories

### Algorithm Browsing
- User can browse algorithms by CFOP step
- User can view 3D cube visualization (static image >> animation) for each case
- User can read algorithm notation and notes
- User can mark algorithms as learned or favorite/marked for practice

### Learning Progress
- User can track which algorithms they've mastered
- Progress persists across app sessions
- User can filter to show only unlearned algorithms

### Mobile Experience
- App works offline for algorithm reference
- Touch-optimized interface for mobile devices
- Native app deployment via Capacitor

## Technical Architecture

### Reference Implementation
- see cubing.react project for the app built last year by me + copilot chat mode
- index.html for core implementation
- paper.html for the simple, printable, offline one-pagers
- src/data for alg sets and mappings to images
- public/assets for generated cube images 

### Component Structure
- App: Main router and navigation
- AlgorithmicPage: Main algorithm browsing interface
- AlgMenuGrid: Algorithm set selection
- AlgLearnGrid: Algorithm case display
- AlgDetailPanel: Detailed algorithm information
- CubePlayer: 3D cube visualization wrapper

### Data Flow
1. JSON algorithm data loaded from static files
2. User selections update component state
3. Progress tracking stored in localStorage
4. Cube visualizations rendered via Cubing.js

### Build Pipeline
- TypeScript compilation via Vite
- Ionic components for mobile UI
- Capacitor for native app packaging
- Automated testing with Cypress and Vitest

## Future Enhancements
- Official scramble generator integration
- Simple solve timer functionality
- Additional algorithm sets from other CFOP collections
- PWA capabilities for offline use