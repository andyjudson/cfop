# cubing.spec

This project serves as a personal reference for learning and practicing CFOP (Cross, F2L, OLL, PLL) — the dominant speedcubing method used in competitive solving. Development follows a specification-first approach using **spec-kit** principles, with agentic AI-assisted implementation via **GitHub Copilot** and **Claude Code**.

## Applications

### cfop-app
CFOP learning companion with algorithm reference grids, interactive visualizations, practice timers, and solve tracking.

**Live app:** https://andyjudson.github.io/cubing.spec/

**Features:**
- Full CFOP navigation (Intuitive, Notation, Beginner/2LK, F2L, OLL, PLL)
- Notation reference page covering face turns, modifiers, slices, rotations, and common triggers
- Expandable/collapsible algorithm sections with session persistence
- Interactive tooltips with algorithm notes (2LK page only)
- Solve visualization modal with cubing.js TwistyPlayer (2LK page only)
- Practice timer with fallback scramble generator (2LK page only)
- Persistent solve time tracking via localStorage
- OLL consolidated from 14→7 balanced groups for improved scanability

**Directory:** `/cfop-app/` • [README](cfop-app/README.md)

### cubify-app
Standalone cube image generator for use in algorithm documentation with 3D PNG and 2D SVG export capabilities.

**Usage:** Local development tool (not deployed to GitHub Pages)

**Features:**
- 3D PNG capture at native resolution (~4096×4096)
- 2D SVG export with 288×288 viewBox
- Preset mask library for CFOP stages (default, cross, F2L, OLL, PLL)
- Custom mask override with orbit notation
- Setup algorithm configuration with anchor control
- Algorithm validation and inversion logging

**Directory:** `/cubify-app/` • [README](cubify-app/README.md)

## Built With

- **Cubing knowledge** from [Milan Struyf](https://www.youtube.com/@CubeHead) (CubeHead) and [Dylan Wang](https://www.youtube.com/@JPerm) (JPerm)
- **[Cubing.js](https://github.com/cubing/cubing.js)** framework from Lucas Garron for cube graphics and algorithm visualization
- **React 19** and **TypeScript 5.9** for modern reactive UI
- **Vite 7** for fast development and optimized builds
- **Bulma CSS** for UI components and responsive layout
- **GitHub Copilot** and **Claude Code** for agentic AI assisted development
- **Spec-Kit** methodology for specification-driven development
- Deployed on **GitHub Pages**

## Development

Each application is independent with its own package.json and build configuration.

### cfop-app
```bash
cd cfop-app
npm install
npm run dev  # http://localhost:5173/cubing.spec/
```

### cubify-app
```bash
cd cubify-app
npm install
npm run dev  # http://localhost:5173/
```

## Acknowledgments

Huge thanks to the cubing community educators who make this learning journey accessible, and to the cubing.js project for providing such a powerful toolkit for cube visualization and manipulation. This project wouldn't exist without their generous knowledge sharing.

## Repository Structure

```
cubing.spec/
├── cfop-app/           # CFOP learning companion (main app)
├── cubify-app/         # Cube image generator (utility)
├── specs/              # Feature specifications
│   ├── 001-beginner-grid/
│   ├── 002-tooltips/
│   ├── 003-visualization-modal/
│   ├── 004-practice-timer/
│   ├── 005-stats-persistence/
│   ├── 006-scramble-generator/
│   ├── 007-cube-image-generator/
│   ├── 008-full-cfop-grids/
│   ├── 009-intuitive-methods/
│   └── 010-notation-reference/
└── .specify/           # Spec-kit configuration
```

## License

MIT License - see [LICENSE](LICENSE) for details.

Note: 
- Cubing algorithms are mathematical sequences in the public domain. 
- This project uses [cubing.js](https://github.com/cubing/cubing.js) (MPL-2.0) for visualization.

---

**Status**: Active development • Features 001-010 complete
