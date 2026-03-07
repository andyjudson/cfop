# AI Coding Agent Instructions for Cubing Workspace

## Project Overview
This workspace contains three related projects for learning and practicing Rubik's cube solving methods:
- **cubing.react**: Current reference implementation. Interactive CFOP app built with React, Ionic, Capacitor, and Cubing.js for mobile/web. All new work should target this codebase unless noted otherwise.
- **cubing.static**: Legacy static HTML guides built with Bootstrap and Cubing.js; largely retired and should be ignored unless a specific historical comparison is requested.
- **cubing.spec**: Spec‑kit playground for capturing requirements and experimenting with agentic tooling; potential future source for new implementations of the site or other tooling.

**Project Context & Motivations**: Personal learning tool for CFOP methods while serving as an AI coding sandbox. Originally intended as native iOS app, but Capacitor chosen to avoid Apple Developer Program licensing costs. Static site provides offline/print-friendly backup and resilience against potential dependency changes (e.g., Cubing.js license expiration). PWA architecture under consideration as potential improvement, though TwistyPlayer compatibility and packaging remain open questions.

**Current Status & Future Ideas**: Project is functional and actively used for learning. Content based on CubeHead tutorials (excellent but now has his own site, so kept private to avoid copyright concerns). Known areas for improvement: pages are wordy, some UI designs could be refined. Open to modernizing approaches vs latest patterns. Potential features: official scramble generator, simple time tracker, additional algorithm sets. GitHub repos are personal/private.

## Architecture & Data Flow
- **cubing.react**: Single-page app with Ionic routing. Algorithms loaded from JSON files in `src/data/`. State managed via React hooks. Cube visualizations via Cubing.js TwistyPlayer.
- **cubing.static**: Static HTML pages with embedded Cubing.js for interactive cube displays. No build process - direct file serving.
- Data flows: JSON algorithm definitions → React components → Cubing.js visualizations → User interactions stored in localStorage.

## Key Components & Patterns
- **Algorithm Management**: `CfopAlgorithm` interface in `utils/algorithms.ts`. Bundles loaded from JSON. Marked algorithms tracked in localStorage.
- **Cube Visualization**: Consistent use of Cubing.js `TwistyPlayer` with PG3D visualization, no background, hintFacelets none, controlPanel none.
- **Ionic UI**: Pages use `IonPage`, `IonContent`, `IonHeader` with standard toolbar patterns. Routing via `IonReactRouter`.
- **Static HTML**: Bootstrap grid layouts, embedded Cubing.js scripts for interactive elements.

## Development Workflows
- **React App**: `npm run dev` (Vite), `npm run build` (TypeScript + Vite), `ionic capacitor sync ios` for mobile builds
- **Testing**: `npm run test.e2e` (Cypress), `npm run test.unit` (Vitest)
- **Mobile**: `ionic capacitor run ios` for device/simulator testing
- **Static Sites**: No build - edit HTML/CSS directly, serve from filesystem

## Project-Specific Conventions
- **Algorithm Sets**: 'bgr' (beginner 2-look), 'f2l', 'oll', 'pll' - match JSON filenames
- **File Naming**: `algs-cfop-{set}.json` for data, `{set}.html` for static pages
- **JSON Structure**: each algorithm entry follows `CfopAlgorithm` interface with keys `id`, `name`, `notation`, `method`, `group`, `image`, `notes`. The `group` value controls grouping in UI grids, `image` points to a local asset matching the case (e.g. `oll_sune.png`), and `notation` is parsed by Cubing.js’s `Alg` class. Notes may contain markdown and footnotes.
- **Icons**: Cubing.js icons via CDN, Material Symbols, IonIcons
- **Styling**: Custom CSS in `theme/` for React, `default.css`/`cfop.css` for static
- **State Persistence**: User progress in localStorage as JSON, preset learning sets available

## Integration Points
- **Cubing.js**: Core dependency for all cube logic - scrambles, algorithms, visualizations
- **Capacitor**: Mobile app wrapper, sync commands required after web changes
- **Ionic**: UI components and routing, CLI for generation (`ionic generate`)
- **Bootstrap**: Layout framework for static sites only

## Common Patterns
- Cube players initialized with `puzzle: "3x3x3"`, `visualization: "PG3D"`, `background: "none"`
- Algorithm notation stored as strings, parsed by Cubing.js Alg class
- Responsive design with Ionic grid for React, Bootstrap for static
- Markdown content rendered via react-markdown in dynamic content

## Key Files to Reference
- `cubing.static/cfop-*.html`: Example static page structure (legacy, not actively used)
- `cubing.react/cfop-app/src/utils/algorithms.ts`: Algorithm data structures and loading
- `cubing.react/cfop-app/src/data/algs-cfop-*.json`: Algorithm definitions
- `cubing.react/cfop-app/src/paper.tsx`: newer "paper" page that replicates static layout in React with cleaner code and url parameter support
- `cubing.react/cfop-app/src/components/CubePlayer.tsx`: Cube visualization component

## Additional Documentation & Learnings
- `cubing.static/SCRATCH.md`: Development research, cubing ecosystem references, alternative apps/frameworks for inspiration
- `cubing.static/README.md`: Project overview, useful cubing resources
- `cubing.react/SCRATCH.md`: Development roadmap, React/Ionic learnings (multipage app structure, callback handlers for state management), known issues (scramble generator iOS compatibility, menu transitions)
- `cubing.react/README.md`: Setup instructions, package management workflows

## Technology Stack Assessment (2024-2026)
- **React (v19.2)**: Still dominant web framework with massive adoption
- **Ionic (v8)**: Very active (15M npm installs, 49k stars) for hybrid mobile apps
- **Capacitor (v7)**: Primary cross-platform native runtime, no major competitors
- **Cubing.js**: Actively maintained with good documentation and CDN support
- **Vite (v5)**: Extremely popular (75k stars, 40M weekly downloads) powering modern frameworks
- **Bootstrap (v5.3.8)**: Still very popular and actively maintained
- **Hugo**: Excellent static site generator, but current React + Bulma "paper" pages already provide URL parameters and clean code - no replacement needed unless specific static site requirements emerge
