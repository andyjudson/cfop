# Speckit Clarification Report

## Agent: speckit.clarify
**Date:** March 7, 2026  
**Objective:** Identify ambiguities, missing details, and potential conflicts in the specification, plan, and tasks before implementation begins.

## Critical Clarifications Needed

### 1. Algorithm Data Structure vs Content Type

**Issue:** Specification defines data structure for algorithms but mentions "intuitive (cross + f2l): techniques rather than algorithms"

**Questions:**
- What is the difference between "techniques" and "algorithms" in the intuitive set?
- Should the data structure accommodate both types, or are techniques handled differently?
- Are techniques stored as markdown content rather than move notation?

**Impact:** Affects data loading (Task 8), component design (Tasks 16-19), and content rendering (Task 46)

### 2. Algorithm Set Definitions and Mapping

**Issue:** Specification lists 5 sets but doesn't clearly define their boundaries and relationships

**Current Spec Sets:**
- Intuitive (cross + f2l): techniques rather than algorithms
- Beginner 3/2-look methods (bgr): OLL and PLL simplified
- First 2 layers (f2l): 41 case patterns
- Orientation of Last Layer (oll): 57 case patterns
- Permutation of Last Layer (pll): 21 case patterns

**Questions:**
- What does "bgr" stand for? Is it "beginner" or something else?
- How do the sets relate to the learning progression (3-look → 2-look → 1-look)?
- Should there be separate tabs for cross/f2l vs combined "intuitive"?

**Impact:** Affects navigation structure (Tasks 31-32, 35), page creation (Task 31), and filtering logic (Task 22)

### 3. Image Asset Management

**Issue:** Specification mentions "image: path to case visualization image" but provides no details

**Questions:**
- Where do these images come from? Are they generated, provided, or referenced from external sources?
- What is the naming convention for image files?
- What happens if images are missing?
- Are images required for all algorithms, or optional?

**Impact:** Affects data structure (Task 6), sample data creation (Task 7), and error handling (Task 39)

### 4. Learning Progression Implementation

**Issue:** Specification mentions staggered learning but doesn't specify UI implementation

**Spec Reference:** "Stagger learning from beginner with intuitive with Cross and F2L techniques and 3-look cases from OLL and PLL, then 2-look cases, and then 1-look full alg sets"

**Questions:**
- How is this progression presented in the UI? Separate learning modes? Filtered views?
- Is progression tracked per user, or just content organization?
- Should there be a "learning path" feature beyond just marking algorithms as learned?

**Impact:** Affects progress tracking (Tasks 23-25), navigation design (Tasks 31-32), and advanced features (Tasks 54-55)

### 5. Data File Organization

**Issue:** Tasks assume JSON loading but specification doesn't define file structure

**Questions:**
- Should there be separate JSON files for each algorithm set (intuitive.json, bgr.json, etc.)?
- Or one combined algorithms.json file with method filtering?
- What is the relationship to existing cubing.react data structure?

**Impact:** Affects data loading utility (Task 8), sample data creation (Task 7), and file organization

### 6. Progress Tracking Scope

**Issue:** Specification mentions "progress tracking" but scope is unclear

**Questions:**
- Is progress just "marked as learned" checkboxes?
- Should it track learning progression through the staggered approach?
- Are there different progress states (not started, learning, learned)?
- Should progress be tracked per algorithm or per set?

**Impact:** Affects storage utility (Task 23), progress indicators (Task 24), and UI design

### 7. Navigation Structure Decision

**Issue:** Plan assumes IonTabs but need to confirm this matches spec requirements

**Questions:**
- Does bottom tab navigation (IonTabs) work well with 5+ algorithm sets?
- Should cross/f2l be separate tabs or combined in "intuitive"?
- How does navigation work on larger screens vs mobile?

**Impact:** Affects navigation implementation (Tasks 31-32, 35) and responsive design (Task 37)

### 8. Cross/F2L Content Type

**Issue:** Specification treats cross and F2L as "techniques" in intuitive set

**Questions:**
- Are cross and F2L really "techniques" (textual descriptions) rather than algorithms?
- If so, how are they displayed differently from OLL/PLL algorithms?
- Should they have different UI treatment (no 3D animations, different layout)?

**Impact:** Affects component design (Tasks 16-19) and content rendering (Task 46)

## Recommended Clarification Process

### Priority Order
1. **High Priority:** Algorithm data structure and content types (blocking Tasks 6-8, 16-19)
2. **High Priority:** Algorithm set definitions and navigation (blocking Tasks 31-32)
3. **Medium Priority:** Image asset management (blocking Task 7, affecting Task 39)
4. **Medium Priority:** Learning progression UI (blocking Tasks 23-25, 54-55)
5. **Low Priority:** Data file organization (can be decided during Task 7-8)

### Clarification Methods
1. **Reference Existing Implementation:** Check cubing.react for current data structures and patterns
2. **Define Concrete Examples:** Create sample data entries for each algorithm set type
3. **UI Mockups:** Sketch navigation and content display approaches
4. **User Stories:** Define specific user flows for learning progression

### Proposed Resolutions

#### Option A: Minimal Clarification (Fast Start)
- Treat all content as algorithms with notation
- Use 5 tabs: Intuitive, BGR, F2L, OLL, PLL
- Images are optional, show placeholder if missing
- Progress = simple learned/unlearned toggle
- Single algorithms.json file

#### Option B: Full Spec Alignment (Comprehensive)
- Define technique vs algorithm data structures
- Clarify learning progression UI requirements
- Specify image asset strategy
- Implement progression tracking beyond simple marking

## Next Steps

**Immediate Action Required:**
1. Review existing cubing.react implementation for data patterns
2. Define concrete examples for each algorithm set type
3. Choose between Option A (fast start) or Option B (full alignment)
4. Update spec.md with clarified details before proceeding to Task 1

**Recommendation:** Start with Option A for rapid prototyping, then enhance to Option B if the minimal version proves viable. This allows quick validation of the technical foundation before investing in complex content structures.

## Risk Assessment

**If Clarifications Are Skipped:**
- Implementation may need significant rework after discovering content structure issues
- Navigation may not match user expectations
- Data loading may fail due to incorrect assumptions
- Progress tracking may not support intended learning flow

**If Clarifications Are Made:**
- Tasks 1-15 can proceed with confidence
- Reduces risk of major architectural changes
- Ensures implementation matches specification intent
- Provides clear validation criteria for each phase

---

## Known Issues

### Scramble Generation in Production Builds

**Issue:** The `cubing/scramble` package uses Web Workers with dynamic instantiation patterns that are incompatible with Vite's production bundler.

**Symptoms:**
- Scramble generation works perfectly in development (`npm run dev`)
- Production builds (`npm run build`) succeed without errors
- Deployed site hangs at "Generating scramble..." indefinitely
- No console errors visible

**Root Cause:**
- `cubing.js` uses `new Worker(new URL(..., import.meta.url))` pattern
- Vite's production bundler cannot resolve these dynamic worker imports due to circular dependencies in cubing.js's build output
- This is a known third-party library incompatibility, not a bug in cubing.js or Vite

**References:**
- https://github.com/cubing/cubing.js/issues/296 - cubing.js worker loading issues
- https://github.com/cubing/cubing.js/issues/301 - Vite build failures
- https://github.com/vitejs/vite/issues/14499 - Vite worker bundling limitations

**Workarounds Attempted:**
- Multiple Vite config variations (worker format, optimizeDeps, esbuild target)
- Official Vite maintainer workaround from vitejs/vite#14499
- TypeScript config adjustments
- All attempts failed to resolve production worker loading

**Current Resolution:**
- **Scramble generation is a local development-only feature**
- Works for personal practice during development
- All other features (algorithm grid, demo modal, practice timer, stats tracking) work perfectly on deployed site
- No code changes needed; documented as limitation

**Alternative Solutions (Not Implemented):**
- **mark3**: Prototype exists at https://github.com/cubing/mark3, but **not currently viable** for this app because it is an early prototype, not published to npm, requires Bun tooling, and currently calls `cubing/scramble` internally (so it inherits the same worker/bundling risk)
- **mark2**: `cs0x7f/mark2` is an old fork of the Mark 2 project. The maintained upstream is https://github.com/cubing/mark2 (legacy JS/GWT-era code, not modern npm/ESM-first tooling). It may work only with custom integration and is not a low-risk drop-in for a Vite + React app.
- **Simple random move generator**: Not WCA-quality but functional
- **Switch bundlers**: Webpack/Parcel/Turbopack may have different worker handling, but significant migration effort with no guarantee of success

**Decision:** Accept as local-only feature. The development experience is excellent, and the deployed site provides full functionality for algorithm learning, visualization, and practice timing.