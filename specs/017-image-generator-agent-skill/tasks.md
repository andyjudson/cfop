# Tasks: Cubify Agent Skill

**Input**: Design documents from `/specs/017-cubify-agent-skill/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Organization**: Tasks grouped by user story. Each story's deliverable is independently runnable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to

---

## Phase 1: Setup

**Purpose**: Create `cubify-scripts/` directory and install dependencies.

- [X] T001 Create `cubify-scripts/package.json` with `"type": "module"`, `playwright` dependency, and a `"cubify": "node cubify.mjs"` script entry
- [X] T002 Run `npm install` inside `cubify-scripts/` to install Playwright
- [X] T003 Create `cubify-scripts/lib/` directory and add `cubify-scripts/lib/masks.mjs` exporting the five mask preset constants (`default`, `cross`, `f2l`, `oll`, `pll`) ported from `cubify-app/src/utils/maskPresets.ts`
- [X] T004 Create `cubify-scripts/lib/lookup.mjs` exporting `lookupCase(caseId)` that reads from `cfop-app/public/data/algs-cfop-*.json` files and returns the matching `AlgorithmCase` object or throws with a list of available IDs
- [X] T005 Create the output directory helper in `cubify-scripts/lib/output.mjs` exporting `ensureOutputDir()` that creates `~/.claude/tmp/cubify/` if it does not exist and returns the absolute path

**Checkpoint**: `node -e "import('./cubify-scripts/lib/masks.mjs').then(m => console.log(Object.keys(m.MASKS)))"` prints the five mask names.

---

## Phase 2: Foundational (Blocking Prerequisite)

**Purpose**: The Playwright renderer is the core engine for all three user stories. Must work before any story is implemented.

**⚠️ CRITICAL**: Confirm renderer works before implementing story-specific features.

- [X] T006 Create `cubify-scripts/lib/renderer.mjs` that exports `renderCube(config)` — accepts a `RenderConfig` object (from `data-model.md`), spins up a local HTTP server serving the esbuild IIFE bundle and render HTML, launches Playwright headful (headless:false required on macOS for WebGL), mounts a `TwistyPlayer` with minimal config and waits for ready signal
- [X] T007 Extend `renderer.mjs` to handle 2D SVG output: after the player is ready, use `page.$eval` to extract `twisty-player`'s inner SVG element `outerHTML` and write it to the `outputPath` as a `.svg` file
- [X] T008 Extend `renderer.mjs` to handle 3D PNG output: use `page.screenshot` with `clip: {x:0,y:0,width:288,height:288}` on a 288×336 viewport (cube viz + control panel height) to capture only the cube area
- [X] T009 Add error handling to `renderer.mjs`: catch Playwright launch failures (Chromium not found) and invalid algorithm errors; exit with code 2 and a human-readable message

**Checkpoint**: Run `node -e "import('./cubify-scripts/lib/renderer.mjs').then(m => m.renderCube({alg:'R U R\\'  U\\'',setupAlg:'',visualization:'PG3D',mask:'',outputFormat:'png',outputPath:'/tmp/test-cubify.png'})).then(()=>console.log('ok'))"` — produces a PNG at `/tmp/test-cubify.png`.

---

## Phase 3: User Story 1 — Generate Image from Raw Algorithm (Priority: P1) 🎯 MVP

**Goal**: `/cubify R U R' U'` produces a cube state image at a predictable path and reports it.

**Independent Test**: Run `node cubify-scripts/cubify.mjs "R U R' U'"` — a PNG appears in `~/.claude/tmp/cubify/` and the path is printed to stdout.

- [X] T010 [US1] Create `cubify-scripts/cubify.mjs` entry point that parses CLI arguments: detects `--case`, `--file`, `--2d`, `--3d`, and `--setup` flags; treats remaining tokens as the raw alg string; prints usage and exits 1 if no input is provided
- [X] T011 [US1] In `cubify-scripts/cubify.mjs`, implement the raw-alg path: resolve `viewMode` (default 3D unless `--2d` passed), select mask (`default`), build the `RenderConfig`, call `ensureOutputDir()` and `renderCube()`, then print the output path
- [X] T012 [US1] Add algorithm validation to the raw-alg path using cubing.js `Alg.fromString()` (imported from `cfop-app/node_modules/cubing/alg`); catch parse errors and exit 1 with a clear message
- [X] T013 [US1] Create `.claude/commands/cubify.md` skill definition: system prompt that reads the `/cubify` arguments, maps input modes per the contract in `specs/017-cubify-agent-skill/contracts/cubify-skill.md`, runs `node cubify-scripts/cubify.mjs [args]` via Bash, and reports the output path(s) to the user

**Checkpoint**: `node cubify-scripts/cubify.mjs "R U R' U'"` writes a 288px PNG and prints the path. `/cubify R U R' U'` in Claude Code works end-to-end.

---

## Phase 4: User Story 2 — Generate Image from Case ID (Priority: P2)

**Goal**: `/cubify --case oll_sune` looks up the case, auto-selects 2D SVG + OLL mask, and writes a correctly named file.

**Independent Test**: Run `node cubify-scripts/cubify.mjs --case oll_sune` — `oll_sune.svg` appears in `~/.claude/tmp/cubify/` with the OLL sticker mask applied.

- [X] T014 [US2] In `cubify-scripts/cubify.mjs`, implement the `--case` path: call `lookupCase(caseId)` from `lookup.mjs`, infer `viewMode` and `mask` from the case `type` field using the type→config mapping in `data-model.md`, set `outputPath` to `<outputDir>/<caseId>.<ext>`, and call `renderCube()`
- [X] T015 [US2] Handle unknown case ID in the `--case` path: catch the error from `lookupCase()` and exit 1 printing the error message (which includes available IDs)
- [ ] T016 [P] [US2] Verify that `--2d` and `--3d` override flags work correctly in the `--case` path by testing `node cubify-scripts/cubify.mjs --case oll_sune --3d` produces a PNG instead of SVG

**Checkpoint**: `node cubify-scripts/cubify.mjs --case oll_sune` → `~/.claude/tmp/cubify/oll_sune.svg`. `node cubify-scripts/cubify.mjs --case f2l_basic` → `~/.claude/tmp/cubify/f2l_basic.png`.

---

## Phase 5: User Story 3 — Batch Generate from JSON File (Priority: P3)

**Goal**: `/cubify --file algs-cfop-oll.json` generates one image per case, all named by case ID, with a completion summary.

**Independent Test**: Run `node cubify-scripts/cubify.mjs --file cfop-app/public/data/algs-cfop-oll.json` — one SVG per OLL case written to `~/.claude/tmp/cubify/`, summary printed.

- [X] T017 [US3] In `cubify-scripts/cubify.mjs`, implement the `--file` path: read and parse the JSON file, iterate over cases sequentially, call `renderCube()` per case using the same type→config logic as US2, collect successes and failures
- [X] T018 [US3] After batch completion, print a summary: `✓ Batch complete: N/M images written to <outputDir>/` followed by a list of written filenames and any failures with their error messages
- [X] T019 [US3] Handle missing or malformed JSON file: exit 1 with a clear error if the file path does not exist or cannot be parsed as a JSON array

**Checkpoint**: `node cubify-scripts/cubify.mjs --file cfop-app/public/data/algs-cfop-oll.json` completes all 57 OLL cases with no manual intervention.

---

## Phase 6: Polish

- [X] T020 Add `cubify-scripts/` to the root `.gitignore` `node_modules/` pattern (already covered by top-level `node_modules/` entry)
- [X] T021 [P] Update `README.md` to mention `cubify-scripts/` in the Applications section alongside `cfop-app` and `cubify-app`, and reference the `/cubify` skill
- [X] T022 [P] Update `CLAUDE.md` Current Status to `Features 001–017 complete` and note the `/cubify` skill location in Active Technologies
- [X] T023 Run the full quickstart validation: raw alg, `--case oll_sune`, `--case f2l_basic`, and batch OLL — confirm all produce correct output

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — **blocks all story phases**
- **User Story phases (3–5)**: All depend on Phase 2; can proceed in any order after that
- **Polish (Phase 6)**: Depends on all story phases complete

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational only — implement first
- **US2 (P2)**: Depends on Foundational; shares `lookup.mjs` and `renderer.mjs` with US1 — implement after T010-T011 exist
- **US3 (P3)**: Depends on US2 logic (same type→config mapping) — implement last

### Parallel Opportunities

- T003, T004, T005 (lib files): different files, fully parallel
- T007, T008 (SVG and PNG paths in renderer): different code paths, can be worked in parallel
- T016 (flag override verification): parallel with T015

---

## Implementation Strategy

### MVP First (US1 only)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundational — renderer working)
3. Complete Phase 3 (US1 — raw alg → image)
4. **STOP and VALIDATE**: `/cubify R U R' U'` works in Claude Code
5. Skill is already useful — any algorithm can be visualised

### Incremental Delivery

1. Setup + Foundational → renderer engine works
2. Phase 3 (US1) → raw alg → image → **MVP**
3. Phase 4 (US2) → named cases with auto mask/view
4. Phase 5 (US3) → batch generation of full sets
5. Phase 6 → polish and documentation

---

## Notes

- cubing.js is imported from `cfop-app/node_modules/cubing` via `file://` URL in the temp HTML — no separate cubing.js install needed in `cubify-scripts/`
- Playwright Chromium must be installed: `cd cfop-app && npx playwright install chromium`
- The temp render HTML at `/tmp/cubify-render.html` is overwritten each run and not cleaned up (acceptable for a local dev tool)
- HashRouter is not relevant here — this is a pure Node/Playwright script, not the React app
- `--setup` flag is implemented as part of T010 arg parsing but applied in the `RenderConfig` passed to `renderCube()` — no separate task needed
