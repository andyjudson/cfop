# cfop-app

CFOP learning companion for Rubik's cube speedsolving with algorithm reference grids, interactive visualizations, practice timers, and solve tracking.

**Live app:** https://andyjudson.github.io/cubing.spec/

## Features

- **Algorithm Reference Grids**: Visual reference for 2-look OLL/PLL and beginner CFOP cases
- **Interactive Tooltips**: Algorithm notes on hover for learning context and execution tips
- **Solve Visualization Modal**: cubing.js TwistyPlayer for animated algorithm playback
- **Practice Timer Modal**: Scramble generation + solve timer with keyboard controls (Space to start/stop)
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

### Algorithm Grids
- Browse OLL/PLL cases organized by recognition pattern
- Essential cases marked with blue badges for 2-look progression
- Click any cube image to open solve visualization modal

### Solve Visualization
- Modal shows algorithm with cubing.js TwistyPlayer
- Auto-plays on open
- Close with escape key or click outside

### Practice Timer
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
- **Vite** for build tooling
- **Bulma CSS** for UI components
- **cubing.js** (`cubing/twisty`, `cubing/alg`) for 3D rendering and algorithm parsing
- **localStorage** for persistent solve time tracking

## File Structure

```
cfop-app/
├── src/
│   ├── App.tsx              # Main component with routing and state
│   ├── App.css              # Application-level styles
│   ├── index.css            # Global styles and color scheme
│   ├── main.tsx             # Entry point
│   ├── components/
│   │   ├── AlgoCard.tsx         # Algorithm card with image and notation
│   │   ├── DemoModal.tsx        # Solve visualization modal
│   │   └── PracticeModal.tsx    # Timer and scramble modal
│   ├── hooks/
│   │   └── useStats.ts          # Solve stats management hook
│   ├── types/
│   │   └── algorithm.ts         # TypeScript type definitions
│   └── utils/
│       ├── scramble.ts          # Custom 20-move scramble generator
│       └── stats.ts             # Stats calculation utilities
├── public/
│   ├── data/                    # Algorithm JSON data
│   └── assets/                  # Cube images
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
