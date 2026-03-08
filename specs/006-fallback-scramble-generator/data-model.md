# Data Model — Feature 006 Fallback Scramble Generator

## Entity: PracticeScramble

Represents a generated scramble string used by practice flow.

### Fields
- `text: string`
  - Example: `R U2 F' L D2 ...`
  - Must contain exactly 20 move tokens in v1
- `moves: string[]`
  - Tokenized move list (length 20)
- `generatedAtMs: number`
  - Unix epoch milliseconds
- `source: "local"`
  - Distinguishes origin from legacy worker generator
- `isParseValid: boolean`
  - True only if `Alg.fromString(text)` succeeds

### Validation Rules
- `text` MUST be non-empty
- `moves.length` MUST equal 20
- Each token face MUST be one of `[U, D, L, R, F, B]`
- Each token suffix MUST be one of `"" | "'" | "2"`
- Adjacent tokens MUST NOT share same face
- Any 3-token window MUST NOT form opposite-face A-B-A pattern
- `isParseValid` MUST be true before entity is emitted to UI

---

## Entity: GenerationRequest

Represents one user-triggered scramble request within modal state.

### Fields
- `requestId: number`
  - Monotonic per modal instance
- `startedAtMs: number`
- `timeoutMs: 1000`
- `status: "pending" | "fulfilled" | "failed" | "timedOut" | "stale"`
- `errorMessage?: string`

### Validation Rules
- `requestId` MUST be strictly increasing
- `timeoutMs` is fixed to 1000 for v1
- Only latest `requestId` may commit scramble to UI

### State Transitions
- `pending -> fulfilled` (valid scramble generated, latest request)
- `pending -> timedOut` (exceeds 1000ms)
- `pending -> failed` (generation/parse error)
- `pending -> stale` (older request superseded by newer request)

---

## Entity: PracticeScrambleViewState

Modal-facing state for scramble display and feedback.

### Fields
- `currentScrambleText: string`
  - Example: `R U2 F' L D2 ...` (or empty string on initial load)
  - Displayed in scramble text block of practice modal
- `lastValidScrambleText: string`
  - Preserved value from last successful generation
  - Used to restore display on generation failure
- `isGenerating: boolean`
  - True while scramble generation request is pending
  - Used to show loading state (e.g., disable "New Scramble" button, show spinner)
  - Cleared when request resolves (success, timeout, or failure)
- `inlineErrorText: string | null`
  - User-visible error message on failure (e.g., "Generation timed out after 1000ms")
  - Cleared on successful generation
  - Set to null when `isGenerating` becomes true
- `activeRequestId: number`
  - Latest request token used to filter stale responses

### Validation Rules
- On `failed`/`timedOut`: keep `currentScrambleText = lastValidScrambleText`
- On `fulfilled` latest request: set both `currentScrambleText` and `lastValidScrambleText`
- `inlineErrorText` MUST be user-visible text, not thrown stack traces

---

## Relationship Summary

- One `GenerationRequest` may produce one `PracticeScramble`
- `PracticeScrambleViewState` references latest successful `PracticeScramble`
- Multiple requests can exist transiently; only latest affects final view state (last-click-wins)
