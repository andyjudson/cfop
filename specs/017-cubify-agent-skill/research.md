# Research: Cubify Agent Skill (017)

## Decision 1: Headless Rendering Approach

**Decision**: Use Playwright (headless Chromium) to render cubing.js TwistyPlayer and capture images.

**Rationale**: cubing.js `experimentalDownloadScreenshot` is purely browser-API-based. The 2D SVG path uses `XMLSerializer` on a live DOM element; the 3D PNG path uses a `WebGLRenderer` + canvas `toDataURL()`. Neither works in bare Node.js. Playwright is already installed in the project (`@playwright/test` in `cfop-app`), Chromium is already downloaded to `~/.cache/ms-playwright/`, and Playwright supports both screenshot capture (PNG) and DOM content extraction (SVG). This avoids any additional browser install.

**Alternatives considered**:
- `jsdom` + manual TwistyAnimatedSVG wiring: jsdom cannot run WebGL, so 3D PNG is impossible. For SVG only it would work, but splitting the code paths adds complexity.
- `puppeteer`: Same capability as Playwright but an additional dependency; Playwright is already present.
- Native cubing.js Node API: No such API exists. `TwistyAnimatedSVG` is an internal class that requires a real HTMLElement to mount into.

---

## Decision 2: Script Location and Structure

**Decision**: A new top-level directory `cubify-scripts/` containing a self-contained ESM Node.js script with its own `package.json`. Not inside `cfop-app` or `cubify-app`.

**Rationale**: The skill is a standalone CLI tool with no React/Vite build step. Bundling it into `cfop-app` would muddy the app's dependency tree; `cubify-app` is browser-only (Vite/React). A separate directory with `"type": "module"` makes the script directly executable by Node without compilation.

**Alternatives considered**:
- Extending `cubify-app` with a CLI mode: the app is browser-first; adding a Node CLI would require dual-path code and conflict with Vite assumptions.
- A single script file at repo root with no `package.json`: requires `playwright` to be a global install; fragile.

---

## Decision 3: Playwright Usage Pattern

**Decision**: The Node script creates a minimal in-memory HTML page as a `data:` URI or temp file, loads cubing.js from `node_modules`, mounts a TwistyPlayer, waits for it to settle, then extracts SVG content (2D) or takes a page screenshot clipped to the player element (3D PNG).

**Rationale**: No server needed; `data:` URIs allow loading arbitrary HTML. However, loading ES module scripts via `data:` URIs is subject to CORS restrictions in Chromium — a temp file written to `/tmp` is more reliable.

**Alternatives considered**:
- Serve a local HTTP server: adds complexity and port management.
- Use `page.evaluate()` to call `experimentalDownloadScreenshot`: downloads to browser's download folder (not controllable), not suitable for scripted output paths.

---

## Decision 4: Claude Code Skill Format

**Decision**: The skill is a single markdown file at `.claude/commands/cubify.md`, following the same pattern as existing speckit skills. It contains a system prompt that instructs Claude to parse `/cubify` arguments and run the Node renderer script via Bash.

**Rationale**: This is the native Claude Code custom command format. Existing skills in `.claude/commands/` follow this pattern. No plugin SDK or separate process required.

**Alternatives considered**:
- A pure bash wrapper script that Claude calls directly: the skill format adds argument parsing guidance, error messaging, and output summarising that a dumb bash wrapper cannot provide.

---

## Decision 5: PNG Resizing

**Decision**: Use `sips -Z 288 <file>` after Playwright screenshot capture, called via Node's `child_process.execSync`.

**Rationale**: `sips` is macOS-native, zero-dependency, and already the established pattern in `cubify-app`. The skill is explicitly macOS-only for v1 (per spec assumptions).

**Alternatives considered**:
- `sharp` npm package: cross-platform but an additional native dependency with compilation requirements.
- Playwright `clip` option: Playwright can clip screenshots but cannot resize to exact pixel dimensions reliably across different viewport DPR settings.

---

## Decision 6: Case ID Lookup and Data Source

**Decision**: Case lookup reads from `cfop-app/public/data/algs-cfop-*.json` directly (relative to the script location). View mode (2D/3D) and mask are inferred from the case type field in the JSON (`type: "oll"`, `type: "pll"`, `type: "f2l"`, etc.).

**Rationale**: The JSON files are the canonical algorithm data source for the whole project. Reading them directly avoids duplication. The `type` field already distinguishes OLL/PLL (2D) from F2L/Cross/BGR (3D).

**Alternatives considered**:
- A separate algorithm registry in `cubify-scripts/`: duplicates data, adds maintenance burden.
- Hardcoded mask/mode tables: fragile if case IDs change.

---

## Key Technical Constraints

- macOS only (v1): `sips` dependency
- Playwright Chromium must be installed: `npx playwright install chromium` from `cfop-app/`
- cubing.js is loaded from `cfop-app/node_modules/cubing` — the script references it via relative path
- Output directory `~/.claude/tmp/cubify/` is created on first run
- The temp HTML file used for rendering is written to `/tmp/cubify-render.html` and cleaned up after each run
