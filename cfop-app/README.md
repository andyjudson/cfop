# cfop-app

CFOP learning companion for Rubik's cube speedsolving with full algorithm reference grids, expandable sections, page navigation, interactive visualizations, practice timers, and solve tracking.

**Live app:** https://andyjudson.github.io/cubing.spec/

## Features

- **Full CFOP Navigation**: Navigate between 2LK, F2L (41 cases), OLL (57 cases), and PLL (21 cases) pages
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
Access at: `http://127.0.0.1:5173/cubing.spec/`

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
- Navigate between four CFOP learning pages via persistent header menu:
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

## CFOP Method Overview

CFOP is a four-step speedcubing method:

| Step | Description | Cases |
|------|-------------|-------|
| **Cross** | Solve four edge pieces on bottom face | Intuitive |
| **F2L** | Insert edge-corner pairs (First Two Layers) | 41 total (4 intuitive) |
| **OLL** | Orient last layer pieces | 57 total (10 for 2-look) |
| **PLL** | Permute last layer pieces | 21 total (6 for 2-look) |

Start with the **essential 4 algorithms** (Sune, AntiSune, T-Perm, Ua-Perm), then expand to full 2-look suite.

## Practice Strategies

### Focused Algorithm Practice
- Set weekly goals (e.g., improve one F2L case set or PLL recognition)
- Start slow for accuracy and finger placement, increase speed gradually
- Repeat each algorithm 10-20 times in one session for muscle memory
- Observe piece movement during execution for visual + logical understanding
- Work on efficient finger tricks and reduce unnecessary cube rotations

### Random Scramble Practice
- Scramble randomly and practice one stage at a time (Cross, F2L, OLL, or PLL)
- Set measurable targets (e.g., Cross under 8 moves, F2L under 30 seconds)
- Use timer for algorithms and full solves to track progress over time

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
- **GitHub Copilot** for AI-assisted implementation
