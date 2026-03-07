# Shared Resources for Cubing Apps

This directory contains shared resources that can be used across different cubing applications in the cubing.spec workspace.

## Contents

### `shared-assets/`
- **cfop_bgr/**: Images for beginner 2-look OLL and PLL algorithms
- **cfop_f2l/**: Images for First 2 Layers algorithms
- **cfop_oll/**: Images for Orient Last Layer algorithms
- **cfop_pll/**: Images for Permute Last Layer algorithms
- **notation/**: Notation reference images
- **cfop_*.png**: General CFOP method images
- **cubing-*.png**: App icons in various sizes

### `shared-data/`
- **algs-cfop-bgr.json**: Beginner 2-look OLL & PLL algorithm definitions
- **algs-cfop-f2l.json**: F2L algorithm definitions
- **algs-cfop-oll.json**: OLL algorithm definitions
- **algs-cfop-pll.json**: PLL algorithm definitions

### `shared-theme/`
- **global.css**: Global styles
- **variables.css**: CSS custom properties
- **custom.css**: Custom component styles

## Usage

When creating a new cubing app, use symlinks to reference these shared resources (avoid copying to prevent duplication):

```bash
# Create symlinks to shared assets in your app public directory
ln -s ../../../shared-assets ./public/assets

# Create symlinks to shared data in your app src directory  
ln -s ../../../shared-data ./src/data

# Create symlinks to shared theme css files in your app src directory (optional)
ln -s ../../../shared-theme ./src/theme
```

**Important**: Always use symlinks instead of copying files. This ensures changes to shared resources are automatically reflected across all apps and prevents version drift.

## Data Structure

Each algorithm JSON file contains an array of objects with the following structure:

```typescript
interface CfopAlgorithm {
  id: string;           // Unique identifier
  name: string;         // Display name
  notation: string;     // Cube notation (Cubing.js compatible)
  method: string;       // "bgr", "f2l", "oll", or "pll"
  group: string;        // Sub-grouping (e.g., "edge", "corner")
  image: string;        // Path to associated image
  notes: string;        // Additional notes/markdown
}
```

## Dependencies

These resources are designed to work with:
- **React 18+** with TypeScript
- **Ionic 8+** for UI components
- **Cubing.js** for 3D cube visualizations
- **Vite** for build tooling</content>
