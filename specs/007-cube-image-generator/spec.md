# Feature Specification: Cube Image Generator Tool

**Feature Branch**: `[007-cube-image-generator]`  
**Created**: 2026-03-08  
**Status**: Draft  
**Input**: User description: "Separate app for generating quality cube images for algorithm documentation using cubing.js TwistyPlayer with form controls for settings and automated fixed-size output."

## Clarifications

### Session 2026-03-08

- Q: When the user enters invalid algorithm notation (e.g., `XYZ` or `R3`), what should happen? → A: Show inline error message near algorithm field without clearing input
- Q: What filename pattern should captured screenshots use when downloaded? → A: cubing-3x3-{timestamp}
- Q: Should the Play button be available when the algorithm field is empty or invalid? → A: Disabled when empty/invalid; enabled only for valid algorithms
- Q: How should the app handle switching visualization modes (2D ↔ 3D) when a setup algorithm or mask is already applied? → A: Preserve all settings and re-render with new mode
- Q: Should there be a maximum file size target for generated PNG images? → A: 200KB target size

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate Algorithm Case Images (Priority: P1)

As a cubing content developer, I want to quickly generate cube state images for algorithm documentation so I can create visual references without manual screenshot editing.

**Why this priority**: Core purpose of the tool - enables efficient content creation workflow.

**Independent Test**: Enter algorithm, set visualization preferences, click capture, verify downloaded file has correct dimensions and visual quality.

**Acceptance Scenarios**:

1. **Given** I enter an algorithm and click apply, **When** the cube renders, **Then** the visualization shows the resulting state correctly.
2. **Given** I select 3D mode and click capture, **When** download completes, **Then** the PNG file is 288×288px (or configured fixed size).
3. **Given** I select 2D mode and click capture, **When** download completes, **Then** the SVG file has fixed viewBox dimensions.

---

### User Story 2 - Use Preset Masks for CFOP Stages (Priority: P1)

As a content developer, I want preset stickering masks for cross/F2L/OLL/PLL stages so I can quickly highlight relevant pieces without memorizing mask syntax.

**Why this priority**: Common use case that significantly improves workflow efficiency.

**Independent Test**: Select each preset mask from dropdown, apply, verify correct pieces are visible/highlighted in visualization.

**Acceptance Scenarios**:

1. **Given** I select "cross" preset mask, **When** applied, **Then** only bottom cross edges are visible (not ignored).
2. **Given** I select "F2L" preset mask, **When** applied, **Then** first two layers are visible.
3. **Given** I select "OLL" preset mask, **When** applied, **Then** last layer corners are ignored, edges are visible.
4. **Given** I select "PLL" preset mask, **When** applied, **Then** last layer edges are visible with oriented stickers.

---

### User Story 3 - Custom Mask for Special Cases (Priority: P2)

As an advanced content developer, I want to enter custom mask notation so I can create images for non-standard case presentations or specific teaching scenarios.

**Why this priority**: Provides flexibility for advanced use cases beyond standard CFOP stages.

**Independent Test**: Enter custom mask syntax in text field, apply, verify visualization matches expected stickering.

**Acceptance Scenarios**:

1. **Given** I enter valid custom mask notation, **When** applied, **Then** visualization respects the custom mask.
2. **Given** I select a preset then modify custom mask field, **When** applied, **Then** custom mask takes precedence over preset.

---

### User Story 4 - Preview Algorithm Animation (Priority: P3)

As a content developer, I want to play the algorithm animation so I can verify the move sequence before capturing the final state image.

**Why this priority**: Nice-to-have QA step but not critical for static image generation workflow.

**Independent Test**: Enter algorithm, click play button, observe animation executes at readable tempo.

**Acceptance Scenarios**:

1. **Given** I enter a valid algorithm and click play button, **When** animation starts, **Then** moves execute at ~1.5× speed (or configured tempo).
2. **Given** animation is playing, **When** it completes, **Then** cube remains at final state shown.
3. **Given** algorithm field is empty or contains invalid notation, **When** I view the Play button, **Then** the button is disabled and cannot be clicked.

---

### User Story 5 - Debug with Inverted Algorithms (Priority: P3)

As a content developer creating case setup images, I want inverted algorithms logged to console so I can easily copy setup sequences for generating initial case states.

**Why this priority**: Developer convenience feature that streamlines specific workflow.

**Independent Test**: Enter algorithm, apply, check browser console for logged inverted algorithm notation.

**Acceptance Scenarios**:

1. **Given** I enter an algorithm and click apply, **When** visualization updates, **Then** console logs both original and inverted algorithm strings.

---

### Edge Cases

- Empty algorithm should show solved cube state
- Invalid algorithm notation (e.g., `XYZ`, `R3`) MUST display an inline error message near the algorithm input field without clearing the user's input, allowing correction and retry
- Rapid repeated apply/capture clicks should not cause race conditions or corrupt downloads
- Large/complex algorithms should render without performance degradation
- Switching between 2D/3D modes MUST preserve all current settings (algorithms, mask, anchor) and re-render the cube state with the new visualization mode

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST be a standalone React application located in `/cubing.spec/cube-img-gen/`.
- **FR-002**: The app MUST use cubing.js TwistyPlayer for cube visualization with rendering-only mode (no interactive controls on player).
- **FR-003**: The app MUST provide form inputs for setup algorithm, move algorithm, visualization mode (2D/3D), anchor (start/end), and stickering mask.
- **FR-004**: The app MUST provide preset mask dropdown with options: default, cross, F2L, OLL, PLL.
- **FR-005**: The app MUST provide custom mask text input that overrides preset selection when non-empty.
- **FR-006**: The app MUST provide three action buttons: Apply (update visualization), Play (animate algorithm), Capture (download screenshot).
- **FR-007**: Capture button MUST generate fixed-size output: 288×288px PNG for 3D mode, fixed viewBox SVG for 2D mode.
- **FR-008**: 3D PNG downloads MUST be automatically sized to 288×288px without requiring manual post-processing.
- **FR-009**: The app MUST use React + Bulma styling consistent with cfop-app shared theme.
- **FR-010**: The app MUST log original and inverted algorithm notation to browser console when visualization is applied.
- **FR-011**: Enter key in form fields MUST trigger Apply action (update visualization).
- **FR-012**: TwistyPlayer MUST use "none" background and "none" hint facelets for clean image output.
- **FR-013**: Invalid algorithm notation MUST display an inline error message near the algorithm field while preserving the invalid input text for user correction.
- **FR-014**: Play and Capture buttons MUST be disabled when the algorithm field is empty or contains invalid notation, and enabled only when a valid algorithm is present.
- **FR-015**: Switching between 2D and 3D visualization modes MUST preserve all current form settings (setup algorithm, move algorithm, mask, anchor) and automatically re-render the cube with the new mode.
- **FR-016**: Generated 3D PNG output SHOULD target a file size of ≤200KB under normal usage to keep documentation assets lightweight.

### Key Entities *(include if feature involves data)*

- **Visualization Config**: Algorithm(s), mask, visualization mode, anchor setting
- **Preset Mask**: Named mask configuration (cross, F2L, OLL, PLL) with orbit notation
- **Output Image**: Generated SVG or PNG file with fixed dimensions
- **Algorithm Log**: Console output with original and inverted notation for developer reference

### Assumptions

- Scope is 3×3×3 cube only (no other puzzles in initial version)
- Tool is for developer/content-creator use, not end-user learning
- cubing.js TwistyPlayer provides all necessary visualization and export APIs
- Fixed output dimensions are suitable for documentation and web use
- User has browser console access for viewing inverted algorithm logs

## Technical Design *(for complex features)*

### Preset Mask Definitions

Based on legacy cubegen.html implementation:

- **default**: `EDGES:------------,CORNERS:--------,CENTERS:------` (all pieces ignored/transparent)
- **cross**: `EDGES:----IIIIIIII,CORNERS:IIIIIIII,CENTERS:------` (bottom edges and all corners visible)
- **F2L**: `EDGES:----IIII----,CORNERS:----IIII,CENTERS:------` (F2L pieces visible)
- **OLL**: `EDGES:----OOOO----,CORNERS:----IIII,CENTERS:------` (LL edges oriented, corners ignored)
- **PLL**: `EDGES:----OOOO----,CORNERS:--------,CENTERS:------` (LL edges oriented, corners visible)

### TwistyPlayer Configuration

```typescript
{
  puzzle: "3x3x3",
  visualization: "PG3D" | "experimental-2D-LL",
  background: "none",
  hintFacelets: "none",
  controlPanel: "none"
}
```

### Image Output Specification

- **Filename Pattern**: `cubing-3x3-{timestamp}` where timestamp is ISO format or Unix milliseconds to prevent overwrite conflicts

- **3D Mode (PNG)**:
  - Use `experimentalDownloadScreenshot(filename)` API
  - Target dimensions: 288×288px
  - Implementation note: May require canvas scaling or CSS sizing before capture

- **2D Mode (SVG)**:
  - Use `experimentalDownloadScreenshot(filename)` API (generates SVG for 2D mode)
  - Target viewBox: Fixed dimensions suitable for inline documentation use

### Component Structure

```
cube-img-gen/
├── src/
│   ├── App.tsx              # Main app container
│   ├── main.tsx             # React entry point
│   ├── components/
│   │   ├── CubeViewer.tsx   # TwistyPlayer wrapper
│   │   ├── ControlForm.tsx  # Input form with all controls
│   │   └── ActionButtons.tsx # Apply/Play/Capture buttons
│   └── utils/
│       ├── maskPresets.ts   # Preset mask definitions
│       └── algUtils.ts      # Algorithm logging and validation
├── public/
│   └── ...                  # Static assets if needed
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Capturing a 3D visualization produces a PNG file exactly 288×288px (verified with file metadata check).
- **SC-002**: Capturing a 2D visualization produces an SVG file with fixed viewBox dimensions.
- **SC-003**: All five preset masks (default, cross, F2L, OLL, PLL) correctly show/hide expected piece sets when applied.
- **SC-004**: Entering an algorithm and pressing Enter key updates visualization without requiring Apply button click.
- **SC-005**: Console logs both original and inverted algorithm strings when Apply is clicked.
- **SC-006**: App builds and runs successfully with `npm run dev` and `npm run build` without errors.
- **SC-007**: Manual test of 10 consecutive captures produces 10 valid image files with correct dimensions and no UI freezing.
- **SC-008**: In a manual sample of 10 standard captures, generated 3D PNG files are at or below 200KB each.
