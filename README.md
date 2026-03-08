# cubing.spec

Specification-driven cubing applications for Rubik's cube learning and algorithm documentation.

**Live apps:** https://andyjudson.github.io/cubing.spec/

## Applications

### cfop-app
CFOP learning companion for speedsolving with algorithm reference grids, interactive visualizations, practice timers, and solve tracking.

**Live app:** https://andyjudson.github.io/cubing.spec/

**Features:**
- Algorithm reference grids (2-look OLL/PLL + beginner cases)
- Interactive tooltips with algorithm notes
- Solve visualization modal with cubing.js TwistyPlayer
- Practice timer with custom scramble generator
- Persistent solve time tracking via localStorage

**Directory:** `/cfop-app/` • [README](cfop-app/README.md)

### imggen-app
Local-only standalone cube image generator for algorithm documentation with 3D PNG and 2D SVG export capabilities.

**Usage:** Local development tool (not deployed to GitHub Pages)

**Features:**
- 3D PNG capture at native resolution (~4096×4096)
- 2D SVG export with 288×288 viewBox
- Preset mask library for CFOP stages (default, cross, F2L, OLL, PLL)
- Custom mask override with orbit notation
- Setup algorithm configuration with anchor control
- Algorithm validation and inversion logging

**Directory:** `/imggen-app/` • [README](imggen-app/README.md)

## What is this?

This project serves as a personal reference for learning and practicing CFOP (Cross, F2L, OLL, PLL) — the dominant speedcubing method used in competitive solving. Development follows a specification-first approach using **spec-kit** principles, with AI-assisted implementation via **GitHub Copilot agent mode**.

## Motivation

I first learned to solve a cube using the beginner method from [JPerm](https://www.youtube.com/@JPerm) (Dylan Wang) and progressed to CFOP through tutorials from [CubeHead](https://www.youtube.com/@CubeHead) (Milan Struyf). This app helps consolidate that learning with quick visual references and practice tools. I'm not a cubing expert — just a beginner aiming for consistent sub-2-minute solves while experimenting with modern web development workflows.

## CFOP Primer

CFOP is a four-step 3x3 speedcubing method developed around 1981 and is responsible for most [world record](https://www.worldcubeassociation.org/results/records?event_id=333&show=mixed+history) times over the last decade (sub-5 seconds is wild! 🤯).

- **Cross** - Solve four edge pieces on the bottom face (intuitive)
- **F2L** (First Two Layers) - Insert edge-corner pairs into four slots (intuitive). There are 41 cases in total, or  4 if use intuitive method.
- **OLL** (Orientation of Last Layer) - Orient last layer pieces (algorithmic). There are 57 cases in total, or 10 if use 2-look method.
- **PLL** (Permutation of Last Layer) - Position last layer pieces (algorithmic). There are 21 cases in total, or 6 if use 2-look method.

Start with the essential four algorithms (Sune, AntiSune, T-Perm, Ua-Perm), then gradually expand to the full 2-look suite for better efficiency.

## Practice Strategies

Repetition is the key theme: consistent reps build recognition and muscle memory.

### Solve with algorithms in mind

- Practice with focused weekly goals (for example: improve one F2L case set or PLL recognition).
- Start slow for accuracy and finger placement, then increase speed gradually.
- Repeat each algorithm 10-20 times in one session to build muscle memory.
- Observe piece movement during execution to strengthen visual + logical understanding.
- Work on efficient finger tricks and reduce unnecessary cube rotations.
- If you make a mistake, re-scramble and repeat the same case with cleaner execution.

### Solve with random scrambles

- Scramble randomly and practice one stage at a time (Cross, F2L, OLL, or PLL).
- Set measurable targets (for example: Cross under 8 moves, F2L under 30 seconds).
- Use a timer for algorithms and full solves to track progress over time.

## Built With

- **Cubing knowledge** from [Milan Struyf](https://www.youtube.com/@CubeHead) (CubeHead) and [Dylan Wang](https://www.youtube.com/@JPerm) (JPerm)
- **[cubing.js](https://github.com/cubing/cubing.js)** framework from Lucas Garron for cube graphics, animations, and algorithm visualization
- **React 19** and **TypeScript 5.9** for modern reactive UI
- **Vite 7** for fast development and optimized builds
- **Bulma CSS** for UI components and responsive layout
- **GitHub Copilot agent mode** for AI-assisted development
- **spec-kit** methodology for specification-driven implementation
- Deployed on **GitHub Pages**

## Development

Each application is independent with its own package.json and build configuration.

### cfop-app
```bash
cd cfop-app
npm install
npm run dev  # http://127.0.0.1:5173/cubing.spec/
```

### imggen-app
```bash
cd imggen-app
npm install
npm run dev  # http://localhost:5173/
```

## Acknowledgments

Huge thanks to the cubing community educators who make this learning journey accessible, and to the cubing.js project for providing such a powerful toolkit for cube visualization and manipulation. This project wouldn't exist without their generous knowledge sharing.

## Repository Structure

```
cubing.spec/
├── cfop-app/           # CFOP learning companion (main app)
├── imggen-app/         # Cube image generator (utility)
├── specs/              # Feature specifications
│   ├── 001-beginner-grid/
│   ├── 002-tooltips/
│   ├── 003-visualization-modal/
│   ├── 004-practice-timer/
│   ├── 005-stats-persistence/
│   ├── 006-scramble-generator/
│   └── 007-cube-image-generator/
└── .specify/           # Spec-kit configuration
```

## License

MIT License - see [LICENSE](LICENSE) for details.

Note: 
- Cubing algorithms are mathematical sequences in the public domain. 
- This project uses [cubing.js](https://github.com/cubing/cubing.js) (MPL-2.0) for visualization.

---

**Status**: Active development • Features 001-006 complete • Feature 007 (imggen-app) complete
