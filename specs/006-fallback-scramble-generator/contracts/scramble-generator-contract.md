# Contract: Fallback Scramble Generator Integration

## Scope
Contract between generator utilities and practice modal integration.

## API Contract

### `generate333Scramble(options?)`

#### Input
```ts
type Generate333Options = {
  length?: 20;          // optional, defaults to 20 (v1 fixed)
  timeoutMs?: 1000;     // optional, defaults to 1000
  requestId?: number;   // optional integration token for stale filtering
};
```

#### Output (success)
```ts
type Generate333Success = {
  ok: true;
  scrambleText: string;
  generatedAtMs: number;
  source: "local";
  requestId?: number;
};
```

#### Output (failure)
```ts
type Generate333Failure = {
  ok: false;
  reason: "timeout" | "parse-error" | "generation-error";
  message: string;
  generatedAtMs: number;
  requestId?: number;
};
```

## Behavioral Guarantees

1. Success output MUST be parseable by `Alg.fromString`.
2. Success output MUST contain exactly 20 tokens in v1.
3. Tokens MUST use only faces `U D L R F B` and suffixes `"" | "'" | "2"`.
4. Consecutive same-face tokens are forbidden.
5. Opposite-face A-B-A triples are forbidden.
6. Calls exceeding 1000ms default timeout MUST return failure with `reason: "timeout"`.

## UI Integration Contract (`PracticeSessionModal`)

1. Modal MUST use last-click-wins semantics:
   - Only response with current `activeRequestId` may update scramble text.
2. On failure/timeout:
   - Preserve last valid scramble text
   - Set inline error text
   - Clear loading state
3. On success:
   - Replace displayed scramble text
   - Clear inline error text
   - Clear loading state

## Vite/Build Contract

After runtime migration to fallback generator:
- No runtime imports from `cubing/scramble` or `cubing/search` remain.
- Worker-specific scramble workaround logic in `vite.config.ts` is removed/reduced.
- `npm run build` remains green.
