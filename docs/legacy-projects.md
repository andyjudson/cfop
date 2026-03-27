# Overview of past cubing projects for learning CFOP

## Project 1 - cubing.static
**Overview**: 
Legacy static HTML app, built manually with Bootstrap and Cubing.js. Treat as retired, do not make changes, and should be ignored unless a specific historical comparison is requested. 

**Architecture**: 
Static HTML pages with embedded Cubing.js for interactive cube display and image creation from algorithm / setup params. No build process, direct file serving, hard coded content. Algorithm definitions are embedded directly in HTML. This app hosts other useful capabilities from Cubing.js - random scramble player, and particular the case image creator which i used to create all the assets for these projects.

## Project 2 - cubing.react
**Overview**: 
Legacy interactive REACT app, built using AI ask-mode with React, Ionic, Capacitor and Cubing.js. Whilst I've stopped developing the app, it has served me well, as I've used it regularly to learn CFOP 2-Look OLL and PLL methods, with my solve times reduced! Treat as retired, do not make changes, and should be ignored unless a specific historical comparison is requested. I'll go into more detail below on the how this app works and the journey, as it is a solid reference implementation.

**Motivation**: 
Personal learning tool for CFOP methods while serving as an AI coding sandbox. Originally intended as native iOS app, but Capacitor chosen to avoid Apple Developer Program licensing costs. Static site provides offline/print-friendly backup and resilience against potential dependency changes. PWA architecture under consideration as potential improvement, though Cubing.js TwistyPlayer compatibility and packaging remain open questions.

**Status**: 
- Project is functional and actively used for my cubing practice. Algorithm content is based on CubeHead youtube tutorials which are excellent, but he now has his own algorithm learning site, so I've kept these github projects private to avoid copyright concerns. 
- Known areas for improvement: pages are wordy or about my own journey, some UI designs could be refined. Open to modernizing approaches vs latest patterns. 
- Potential features: official scramble generator, simple time tracker, additional algorithm sets.

**Architecture**: 
- Single-page app with Ionic routing. Algorithms loaded from JSON files in `src/data/`. State managed via React hooks. Cube visualizations via Cubing.js TwistyPlayer. 
- Algorithm definitions are maintained in JSON files → React components → Cubing.js visualizations → User interactions stored in localStorage. `CfopAlgorithm` interface in `utils/algorithms.ts`. 
- Marked algorithms tracked in localStorage. Algorithm sets (bgr, f2l, oll, pll) control grouping in UI. 
- Pages use `IonPage`, `IonContent`, `IonHeader` with standard toolbar patterns. 
- Routing via `IonReactRouter`. Use of Cubing.js `TwistyPlayer` with PG3D for cube visualization, no background, hintFacelets none, controlPanel none, with dynamic algorithm updates via props (setup and solve) and settings for animation speed.

**Conventions**:
- Algorithm Sets: 'bgr' (beginner 2-look), 'f2l', 'oll', 'pll' match JSON filenames
- JSON files: `algs-cfop-{set}.json` for data, `{set}.html` for static pages
- JSON structure: each algorithm entry follows `CfopAlgorithm` interface with keys `id`, `name`, `notation`, `method`, `group`, `image`, `notes`. The `group` value controls grouping in UI grids, `image` points to a local asset matching the case (e.g. `oll_sune.png`), and `notation` is parsed by Cubing.js’s `Alg` class. Notes may contain markdown and footnotes.
- Icons: Cubing.js icons via CDN, Material Symbols, IonIcons
- Styling: Custom CSS in `theme/` for React, `default.css`/`cfop.css` for static
- State: User progress in localStorage as JSON, preset learning sets available
- Mask: Masking effect used to hide irrelevant positions vs highlight the algorithm case

**Frameworks**:
- Cubing.js: Core dependency for all cube logic - scrambles, algorithms, visualizations
- Capacitor: Mobile app wrapper, sync commands required after web changes
- Ionic: UI components and routing, CLI for generation (`ionic generate`)
- Bulma: Used to create clean printable offline alg grid pages
- Bootstrap: Layout framework for static sites only
