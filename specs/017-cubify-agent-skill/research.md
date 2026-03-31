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

**Decision**: The Node script spins up a minimal local HTTP server (Node `http.createServer`, random port) that serves two endpoints: `/` returns the render HTML, `/bundle.js` returns the esbuild IIFE bundle. Playwright navigates to `http://127.0.0.1:<port>/`.

**Rationale**: `data:` URIs fail for this use case — cubing.js bare specifier imports (Three.js etc.) are resolved at bundle time by esbuild into a single IIFE, but inlining 1.8MB of JS into the HTML kills page execution entirely (no console output, TwistyPlayer is function but nothing renders). Serving the bundle as a separate `/bundle.js` endpoint fixes this. A temp file at `file://` also fails because bare specifiers remain unresolved without bundling, and `file://` CORS blocks cross-origin module fetches.

**Alternatives considered**:
- `data:` URI with inlined bundle: tried first; 1.8MB inline silently kills script execution.
- `file://` temp HTML: bare specifier imports fail — Three.js uses `import 'three'` which Chromium cannot resolve from `file://`.
- `page.evaluate()` to call `experimentalDownloadScreenshot`: downloads to browser's download folder (not controllable), not suitable for scripted output paths.

---

## Decision 4: Claude Code Skill Format

**Decision**: The skill is a single markdown file at `.claude/commands/cubify.md`, following the same pattern as existing speckit skills. It contains a system prompt that instructs Claude to parse `/cubify` arguments and run the Node renderer script via Bash.

**Rationale**: This is the native Claude Code custom command format. Existing skills in `.claude/commands/` follow this pattern. No plugin SDK or separate process required.

**Alternatives considered**:
- A pure bash wrapper script that Claude calls directly: the skill format adds argument parsing guidance, error messaging, and output summarising that a dumb bash wrapper cannot provide.

---

## Decision 5: PNG Crop and Resize

**Decision**: Use Playwright's built-in `clip` option (`{ x: 0, y: 0, width: 288, height: 288 }`) to capture only the cube visualisation area, excluding the TwistyPlayer control panel. No `sips` required for cropping.

**Rationale**: The TwistyPlayer renders the cube in the top portion of the player and appends a control panel strip (~48px) below it. Setting the viewport to 288×336 (viz + panel) and clipping the screenshot to the top 288px isolates just the cube. `sips -c` (crop) was tried first but crops from the centre of the image, leaving the control panel partially visible. Playwright `clip` from `(0,0)` is exact and needs no post-processing.

**Why not hide the control panel via TwistyPlayer API**: `controlPanel: 'none'` passed in the constructor or set post-append breaks WebGL rendering entirely — the canvas goes blank. Root cause unknown; likely a timing issue in the web component lifecycle. The clip approach avoids touching TwistyPlayer config beyond the minimal working set (`puzzle`, `visualization`, `alg`, `background: 'none'`).

**Alternatives considered**:
- `sips -c`: crops from centre, not top-left — leaves control panel in frame.
- `sharp` npm package: unnecessary; clip handles the geometry, no resize needed since viewport is already 288px wide.
- `controlPanel: 'none'` in constructor: breaks WebGL on macOS (blank output).

---

## Decision 6: Case ID Lookup and Data Source

**Decision**: Case lookup reads from `cfop-app/public/data/algs-cfop-*.json` directly (relative to the script location). View mode (2D/3D) and mask are inferred from the case type field in the JSON (`type: "oll"`, `type: "pll"`, `type: "f2l"`, etc.).

**Rationale**: The JSON files are the canonical algorithm data source for the whole project. Reading them directly avoids duplication. The `type` field already distinguishes OLL/PLL (2D) from F2L/Cross/BGR (3D).

**Alternatives considered**:
- A separate algorithm registry in `cubify-scripts/`: duplicates data, adds maintenance burden.
- Hardcoded mask/mode tables: fragile if case IDs change.

---

## Key Technical Constraints

- macOS only (v1): `headless: false` required — headless Chromium blocks WebGL on macOS (`BindToCurrentSequence failed`)
- Playwright Chromium must be installed: `npx playwright install chromium` from `cfop-app/`
- cubing.js is bundled via esbuild IIFE into `/tmp/cubify-twisty-bundle.js` on first run; served via local HTTP server
- esbuild entry file must be written inside `cfop-app/` so it resolves `node_modules/cubing` naturally
- Output directory `~/.claude/tmp/cubify/` is created on first run
- TwistyPlayer constructor: use only `puzzle`, `visualization`, `alg`, `background: 'none'` — any additional properties (controlPanel, hintFacelets) cause WebGL to fail

---

## Implementation Learnings

Surprises encountered during renderer implementation that future work should be aware of:

1. **headless Chromium blocks WebGL on macOS**: `THREE.WebGLRenderer: A WebGL context could not be created. BindToCurrentSequence failed`. `--use-gl=swiftshader`, `--enable-webgl`, `--disable-gpu` all tried and failed. `headless: false` is the only working option.

2. **1.8MB bundle cannot be inlined in HTML**: Embedding the esbuild output directly in a `<script>` tag silently kills page execution — no console output, TwistyPlayer constructor is defined but nothing renders. Serving as a separate HTTP endpoint fixes this.

3. **Constructor properties break WebGL**: Passing `controlPanel: 'none'` (or `hintFacelets`, `experimentalDragInput`) in the TwistyPlayer constructor causes the WebGL canvas to go blank. Root cause unknown — likely a web component lifecycle race. Workaround: set `hintFacelets = 'none'` via `page.evaluate()` AFTER the 3s ready signal fires. `controlPanel` can only be excluded by clipping the screenshot to the visualization element, not by hiding it.

4. **`sips -c` crops from centre, not top**: `sips -c 288 288 file.png` crops 24px from each edge of a 288×336 image, leaving the control panel partially in frame. Switched to Playwright `clip` option.

5. **GitHub Pages thin-app idea**: Considered deploying a URL-parameterised TwistyPlayer page to GitHub Pages so the script could navigate there instead of bundling. Would not help — `headless: false` is a macOS/Chromium constraint regardless of page origin. Still requires Playwright and adds network/latency dependency.

6. **CSS clip-path removes control panel without shadow DOM access**: `clip-path: inset(0 0 64px 0)` applied to the `twisty-player` element in the HTML template visually clips its bottom 64px (the control panel strip) at the compositor level. This is applied in the CSS before the player renders and requires no shadow DOM access or TwistyPlayer API. The output is 288×288 with the top ~224px being the cube and the bottom 64px being the white page background.

7. **SVG output not achievable via Playwright screenshot**: Playwright's `page.screenshot()` only supports PNG output — writing to a `.svg` path throws a MIME type error. True SVG extraction from TwistyPlayer's `experimental-2D-LL` mode would require accessing the internal `<svg>` element inside the closed shadow DOM (not practical). For v1, all output formats are PNG; OLL/PLL use `experimental-2D-LL` (2D flat view) but still output as `.png`.

8. **JSON field names differ from data-model spec**: The `algs-cfop-*.json` files use `method` (not `type`) and `notation` (not `alg`). The code resolves both with `c.method || c.type` and `c.notation || c.alg` for forwards compatibility.

9. **The breakthrough: inspect structure before manipulating it**: The control panel problem was solved only after writing a small debug script that printed the actual shadow DOM structure. This revealed that `twisty-2d-scene-wrapper` and `twisty-control-panel` are siblings inside the player's shadow root — not parent/child — and that `twisty-2d-scene-wrapper` exposes a bounding rect that exactly frames the visualization. The solution then became obvious: clip the screenshot to that element's rect, rather than trying to hide the panel.

   The lesson: when automating a third-party web component you don't control, **inspect the actual element tree first** (one small Playwright script that dumps `shadowRoot` children, bounding rects, and tag names), then design the capture strategy. We lost significant time trying to manipulate TwistyPlayer's API based on assumptions about its internals rather than observing them first.

   **The two Playwright techniques that made it work:**
   - `page.addInitScript()` — runs before any page script, including the bundle load. This is the correct layer for intercepting `attachShadow` and `getContext`. Injecting the same intercept inside the HTML `<script>` tag fires too late — the bundle has already initialized by then.
   - `getBoundingClientRect()` via `page.evaluate()` on intercepted shadow root elements — gives exact pixel coordinates usable as a Playwright `clip` option, without any CSS manipulation or CDP complexity.
