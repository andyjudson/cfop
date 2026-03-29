# cfop-app

CFOP learning companion for Rubik's cube speedsolving with full algorithm reference grids, expandable sections, page navigation, interactive visualizations, practice timers, and solve tracking.

**Live app:** https://andyjudson.github.io/cubing.spec/

## Features

- **About Page**: Cubing background, CFOP primer, WCA context, and interactive WR evolution chart (Single + Average 3×3 world records from 2004 to present)
- **Full CFOP Navigation**: Navigate between Intuitive, Notation, 2LK, F2L (41 cases), OLL (57 cases), and PLL (21 cases) pages
- **Notation Reference Page**: Face turns, modifiers, slices, cube rotations, and common trigger references
- **Algorithm Reference Grids**: Visual reference for all CFOP algorithms organized by case groups
- **Expandable Sections**: Collapse/expand algorithm groups with session persistence
- **Interactive Tooltips**: Algorithm notes on hover for 2LK cases (learning context and execution tips)
- **Solve Visualization Modal**: cubing.js TwistyPlayer for animated algorithm playback (2LK page only)
- **Practice Timer Modal**: Scramble generation + solve timer with keyboard controls (2LK page only)
- **Stats Persistence**: localStorage-based solve time history across sessions
- **Custom Scramble Generator**: Local 20-move rule-based generation (no worker dependencies)

## Quick Start

### Development Server
```bash
npm install
npm run dev
```
Access at: `http://localhost:5173/cubing.spec/`

### Production Build
```bash
npm run build
```
Output in `dist/` folder ready for static hosting.

### Preview Production Build
```bash
npm run preview
```

## Usage

### Page Navigation
- Navigate between six CFOP learning pages via persistent header menu:
  - **Intuitive**: Cross and F2L learning primer
  - **Notation**: Move notation reference and trigger cheat sheet
  - **2LK**: Two-Look Beginner Method (9 essential algorithms)
  - **F2L**: First Two Layers (41 cases in 6 groups)
  - **OLL**: Orient Last Layer (57 cases in 7 consolidated groups)
  - **PLL**: Permute Last Layer (21 cases in 5 groups)
- Active page indicated in navigation menu
- Hash-based routing supports browser back/forward and deep links

### Algorithm Grids
- Browse algorithms organized by recognition pattern groups
- F2L, OLL, and PLL pages: static reference grids with expandable sections
- 2LK page: essential cases marked with blue badges, interactive features enabled
- **Expand/Collapse Controls**: Use "Expand All" / "Collapse All" buttons or click section headers
- Section state persists within browser tab session (resets on tab close/refresh)

### Solve Visualization (2LK page only)
- Click any cube image to open solve visualization modal
- Modal shows algorithm with cubing.js TwistyPlayer
- Auto-plays on open
- Close with escape key or click outside

### Practice Timer (2LK page only)
- Click "Practice" button to open timer modal
- Random 20-move scramble generated on open
- Space bar to start/stop timer
- Solve times automatically saved to localStorage
- View session stats (count, best, average, session average)

## Tech Stack

- **React 19** with TypeScript
- **React Router** (HashRouter) for page navigation
- **Vite** for build tooling
- **Bulma CSS** for UI components
- **cubing.js** (`cubing/twisty`, `cubing/alg`) for 3D rendering and algorithm parsing
- **sessionStorage** for expand/collapse state persistence (per-page)
- **localStorage** for persistent solve time tracking

## File Structure

```
cfop-app/
├── src/
│   ├── App.tsx                  # Main routing configuration
│   ├── App.css                  # Application-level styles
│   ├── index.css                # Global styles and color scheme
│   ├── main.tsx                 # Entry point
│   ├── pages/
│   │   ├── BGRPage.tsx          # 2LK beginner page with interactive features
│   │   ├── IntuitivePage.tsx    # Intuitive methods learning page
│   │   ├── NotationPage.tsx     # Notation reference page
│   │   ├── F2LPage.tsx          # F2L algorithm reference grid (41 cases)
│   │   ├── OLLPage.tsx          # OLL algorithm reference grid (57 cases)
│   │   └── PLLPage.tsx          # PLL algorithm reference grid (21 cases)
│   ├── components/
│   │   ├── AlgorithmGroupSection.tsx  # Expandable section wrapper
│   │   ├── ExpandCollapseControls.tsx # Expand/Collapse All buttons
│   │   ├── CfopNavigation.tsx         # Persistent header navigation
│   │   ├── CfopPageLayout.tsx         # Shared page layout wrapper
│   │   ├── ErrorBoundary.tsx          # Error display with retry
│   │   ├── DemoModal.tsx              # Solve visualization modal (2LK only)
│   │   └── PracticeSessionModal.tsx   # Timer and scramble modal (2LK only)
│   ├── hooks/
│   │   ├── useSectionToggle.ts  # Expand/collapse state management
│   │   └── useStats.ts          # Solve stats management hook
│   ├── types/
│   │   └── algorithm.ts         # TypeScript type definitions
│   └── utils/
│       ├── scramble.ts          # Custom 20-move scramble generator
│       └── stats.ts             # Stats calculation utilities
├── public/
│   ├── data/                    # Algorithm JSON data
│   │   ├── algs-cfop-bgr.json   # 2-look beginner algorithms
│   │   ├── algs-cfop-f2l.json   # Full F2L (41 cases)
│   │   ├── algs-cfop-oll.json   # Full OLL (57 cases, 7 groups)
│   │   └── algs-cfop-pll.json   # Full PLL (21 cases)
│   └── assets/                  # Cube images (cfop_bgr, cfop_f2l, cfop_oll, cfop_pll)

## Algorithm JSON — line_break field

Algorithm entries support an optional `line_break` field to control notation wrapping on cards:

```json
{ "id": "pll-3-1", "name": "T Perm", "notation": "(R U R' U') R' F (R2 U' R') U' (R U R' F')", "line_break": 9 }
```

- Value is a **token index** (0-based), where each space-delimited chunk is one token
- Brackets and modifiers (`'`, `2`, `f` wide moves) are part of the token they are attached to — e.g. `(R`, `U'`, `R')`, `D2` are each one token
- `line_break: 9` inserts a newline before the token at index 9, so the first line is tokens 0–8 and the second line starts at token 9
- Multiple breaks: `"line_break": [9, 15]` — values are token indices applied in order
- Rendered with `white-space: pre-wrap` in `AlgorithmCard`
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Browser Compatibility

Requires modern browser with:
- ES2020+ JavaScript support
- localStorage API
- WebGL support (for cubing.js 3D rendering)

## Features Overview

### Feature 008: Full CFOP Algorithm Grids
- Four-page navigation: 2LK, F2L, OLL, PLL
- Hash-based routing with browser history support
- Expandable/collapsible algorithm groups
- Session-persistent expand/collapse state (per-page)
- 7 consolidated OLL groups for better scanability
- Static reference grids (F2L, OLL, PLL) with no interactive overlays

### Feature 006: Custom Scramble Generator
- Local 20-move rule-based generation
- No web worker dependencies (better for static hosting)
- Timeout protection (1000ms fallback to empty)
- Prevents timer start until valid scramble loaded

### Feature 005: Persistent Solve Stats
- localStorage-based with versioned envelope structure
- Tracks: solve count, best time, average of all, session average
- Defensive validation on load/save
- Manual clear stats button

## Browser Compatibility

Requires modern browser with:
- ES2020+ JavaScript support
- localStorage API
- WebGL support (for cubing.js 3D rendering)

## Credits

- **Cubing knowledge** from [CubeHead](https://www.youtube.com/@CubeHead) (Milan Struyf) and [JPerm](https://www.youtube.com/@JPerm) (Dylan Wang)
- **cubing.js** framework from Lucas Garron for cube visualization
- **spec-kit** methodology for specification-driven development
- **GitHub Copilot** and **Claude Code** for AI-assisted implementation
