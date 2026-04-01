# Feature Specification: Cubify Agent Skill

**Feature Branch**: `017-cubify-agent-skill`
**Created**: 2026-03-30
**Status**: Draft
**Input**: User description: "Add a Claude Code agent skill /cubify that generates cube state images from algorithm inputs. Accepts three input modes: (1) a raw alg string, (2) a case ID looked up from a JSON algorithm file, (3) a full JSON algorithm file for batch generation. Output format depends on view mode: 2D cases (OLL/PLL) render as SVG, 3D cases (Cross/F2L/default) render as PNG resized to 288px using macOS sips. Images are written to a predictable temp location. Uses cubing.js directly in a standalone Node script. The skill is a vanilla Claude Code agent skill invoked as /cubify. Supports setup moves, masks for OLL/PLL sticker focus, and view selection (2D vs 3D) inferred from case type or via explicit flag."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate Image from Raw Algorithm (Priority: P1)

A developer or learner invokes `/cubify R U R' U'` in Claude Code and receives a cube state image showing the result of that algorithm applied to a solved cube.

**Why this priority**: This is the core MVP — a single alg in, one image out. Everything else builds on this.

**Independent Test**: Run `/cubify R U R' U'` and verify an image file is written to the output location with the correct cube state rendered.

**Acceptance Scenarios**:

1. **Given** the skill is installed, **When** `/cubify R U R' U'` is invoked, **Then** an image file is written to the output location and its path is returned
2. **Given** a 3D view mode (default), **When** the image is generated, **Then** the output is a PNG resized to 288px
3. **Given** an explicit `--2d` flag, **When** the image is generated, **Then** the output is an SVG file
4. **Given** an invalid algorithm string, **When** the skill is invoked, **Then** a clear error message is returned and no file is written

---

### User Story 2 - Generate Image from Case ID (Priority: P2)

A developer invokes `/cubify --case oll_sune` and receives the canonical cube state image for that named algorithm case, with the correct view mode and mask automatically applied based on case type.

**Why this priority**: Case-based lookup is the primary practical use — generating images for specific OLL/PLL cases without remembering the exact notation.

**Independent Test**: Run `/cubify --case oll_sune` and verify a 2D SVG is written with the OLL mask applied and the sune case state rendered correctly.

**Acceptance Scenarios**:

1. **Given** a valid case ID, **When** `/cubify --case oll_sune` is invoked, **Then** the algorithm is looked up from the JSON data file and an image is generated
2. **Given** an OLL or PLL case, **When** the image is generated, **Then** view mode defaults to 2D SVG with the appropriate mask applied
3. **Given** a Cross or F2L case, **When** the image is generated, **Then** view mode defaults to 3D PNG at 288px
4. **Given** an unknown case ID, **When** the skill is invoked, **Then** a clear error is returned listing available case IDs

---

### User Story 3 - Batch Generate from JSON File (Priority: P3)

A developer invokes `/cubify --file algs-cfop-oll.json` and receives a set of images — one per algorithm case in the file — written to the output location, enabling bulk regeneration of all reference images.

**Why this priority**: Batch mode is a power-user workflow for regenerating all case images at once; useful after algorithm data changes but not needed for daily use.

**Independent Test**: Run `/cubify --file algs-cfop-oll.json` and verify one image per case is written to the output folder, correctly named by case ID.

**Acceptance Scenarios**:

1. **Given** a valid JSON algorithm file, **When** `/cubify --file algs-cfop-oll.json` is invoked, **Then** one image is generated per case entry in the file
2. **Given** a batch run, **When** images are written, **Then** each file is named by its case ID (e.g. `oll_sune.svg`)
3. **Given** a batch run, **When** it completes, **Then** a summary of files written (and any failures) is returned
4. **Given** a JSON file with mixed OLL and F2L cases, **When** batch runs, **Then** each case uses the correct view mode and format

---

### Edge Cases

- What happens when the output location is not writable?
- What if `sips` is not available (non-macOS environment)?
- What if a JSON file contains a case with no algorithm string?
- What if the algorithm string contains unknown moves or invalid notation?
- What if a batch run partially fails — are completed files kept?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The skill MUST accept a raw algorithm string as input and generate a cube state image
- **FR-002**: The skill MUST accept a `--case <id>` flag to look up an algorithm from the JSON data file
- **FR-003**: The skill MUST accept a `--file <path>` flag to batch generate images for all cases in a JSON file
- **FR-004**: Output format MUST be SVG for 2D mode (OLL/PLL cases) and PNG for 3D mode (all others)
- **FR-005**: PNG output MUST be resized to 288px using the macOS `sips` utility
- **FR-006**: Images MUST be written to a predictable, consistent output location (e.g. `~/.claude/tmp/cubify/`)
- **FR-007**: The output file path MUST be returned to the user after generation
- **FR-008**: View mode (2D/3D) MUST be inferred from case type when using `--case`, and MUST be overridable via `--2d` or `--3d` flags
- **FR-009**: OLL and PLL cases MUST apply the appropriate sticker mask to focus on the relevant face
- **FR-010**: Batch mode MUST name output files by case ID and return a completion summary
- **FR-011**: The skill MUST return a clear error message for invalid input, unknown case IDs, or missing files

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A single-alg image is generated and written within 5 seconds of invocation
- **SC-002**: Case lookup correctly resolves and renders 100% of case IDs present in the OLL and PLL JSON files
- **SC-003**: Batch generation of a full OLL set (57 cases) completes without manual intervention
- **SC-004**: Output images are visually correct — cube state matches the algorithm applied
- **SC-005**: The skill can be invoked with a single command and requires no manual setup steps after installation

## Assumptions

- Running on macOS — `sips` is available for PNG resizing
- cubing.js supports headless SVG/PNG generation in a Node.js context without a browser
- The existing JSON algorithm files (`algs-cfop-oll.json`, `algs-cfop-pll.json`, etc.) in `cfop-app/public/data/` are the canonical data source for case lookup
- Output location is `~/.claude/tmp/cubify/` — created automatically if it does not exist
- The skill is installed locally in the Claude Code skills directory; no server or CI/CD integration required
- Setup moves (applying an alg to a solved state to show the case) are supported by cubing.js and are the correct approach for OLL/PLL case rendering
- Batch mode processes cases sequentially (not in parallel) to keep the implementation simple
- The skill is macOS-only for v1 — `sips` dependency is accepted; cross-platform support is out of scope
