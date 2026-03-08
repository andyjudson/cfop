# imggen-app

Standalone cube image generator app for 3×3 algorithm documentation.

## Features

- **3D PNG Capture**: High-resolution (~4096×4096) cube visualizations with transparent background
- **2D SVG Export**: Flat top-layer diagrams (288×288 viewBox) for web/print use
- **Preset Mask Library**: Quick access to CFOP stage masks (default, cross, F2L, OLL, PLL)
- **Custom Mask Override**: Manual orbit string input for fine-grained sticker visibility control
- **Setup Algorithm**: Optional setup moves with anchor (start/end) configuration
- **Move Algorithm**: Main algorithm with real-time validation via cubing.js parser
- **Play Animation**: Tempo-controlled algorithm playback (1.5× speed)
- **Console Logging**: Original and inverted algorithm notation for documentation

## Quick Start

### Development Server
```bash
npm install
npm run dev
```
Access at: `http://localhost:5173/`

### Production Build
```bash
npm run build
```
Output in `dist/` folder ready for static hosting.

## Usage

1. **Enter Setup Algorithm** (optional): Pre-configure cube state (e.g., `R U R'`)
2. **Select Anchor**: Choose whether setup runs at `start` or `end`
3. **Enter Move Algorithm**: Main algorithm to visualize (e.g., `F R U R' U' F'`)
4. **Choose Visualization Mode**: 
   - `3D` → PNG export at native resolution (~4096×4096)
   - `2D` → SVG export with fixed 288×288 viewBox
5. **Select Preset Mask** (or enter custom): Control which stickers are visible
6. **Click Apply**: Update cube visualization
7. **Click Play**: Animate the algorithm
8. **Click Capture**: Download PNG or SVG

### Post-Processing PNG Images
Captured PNGs are at native resolution (~4096×4096). To resize to 288×288:
```bash
sips -Z 288 *.png
```

## Preset Masks

| Preset | Description | Use Case |
|--------|-------------|----------|
| `default` | Full cube visible | General algorithms |
| `cross` | Bottom layer only | Cross solutions |
| `F2L` | Bottom two layers | F2L pair insertions |
| `OLL` | Top layer only | OLL cases |
| `PLL` | Top layer only | PLL cases |

## Custom Mask Format

Custom mask uses cubing.js orbit notation:
```
CENTERS:ALL,EDGES:ALL,CORNERS:U---
```
Sticker visibility: `-` (hidden), others (visible)

## Boundary Rules

Standalone application with no runtime coupling:
- No links/buttons/routes to `cfop-app`
- No runtime imports from `cfop-app`
- No shared runtime state between apps
- Independent deployment and versioning

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Bulma CSS** for UI components
- **cubing.js** (`cubing/twisty`, `cubing/alg`) for 3D rendering and algorithm parsing

## File Structure

```
imggen-app/
├── src/
│   ├── App.tsx              # Main component with state management
│   ├── App.css              # Application-level styles
│   ├── index.css            # Global styles and color scheme
│   ├── main.tsx             # Entry point
│   ├── components/
│   │   ├── ActionButtons.tsx   # Apply/Play/Capture buttons
│   │   ├── ControlForm.tsx     # Form inputs and validation
│   │   └── CubeViewer.tsx      # TwistyPlayer wrapper
│   ├── types/
│   │   └── imageGenerator.ts   # TypeScript type definitions
│   └── utils/
│       ├── algUtils.ts         # Algorithm validation and inversion
│       ├── captureUtils.ts     # Capture request helpers
│       └── maskPresets.ts      # CFOP preset mask definitions
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Known Limitations

1. **PNG Resize**: cubing.js captures at native resolution regardless of target size parameter. Use `sips` for offline resize.
2. **No Batch Capture**: Single image per capture (intentional for quality control).
3. **Browser Compatibility**: Requires modern browser with WebGL support.
