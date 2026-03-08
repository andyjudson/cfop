/**
 * Fallback Scramble Generator for 3x3 Rubik's Cube
 *
 * Provides deterministic, rule-based scramble generation for practice mode
 * when `cubing/scramble` workers are unavailable (e.g., GitHub Pages production).
 *
 * Quality Constraints:
 * - Fixed 20-move output length
 * - No consecutive same-face moves (e.g., R R' is invalid)
 * - No opposite-face A-B-A patterns (e.g., R L R is invalid)
 * - All outputs validated via Alg.fromString for cubing.js compatibility
 */

import { Alg } from "cubing/alg";

/** Cube faces available for scramble generation */
type Face = "U" | "D" | "L" | "R" | "F" | "B";

/** Move modifiers (turn angles) */
type Modifier = "" | "'" | "2";

const FACES: Face[] = ["U", "D", "L", "R", "F", "B"];
const MODIFIERS: Modifier[] = ["", "'", "2"];

/** Opposite face pairs: U↔D, L↔R, F↔B */
const OPPOSITE_PAIRS: Record<Face, Face> = {
  U: "D",
  D: "U",
  L: "R",
  R: "L",
  F: "B",
  B: "F",
};

/**
 * Represents a single move in standard cubing notation
 */
interface Move {
  face: Face;
  modifier: Modifier;
}

/**
 * Success response from scramble generation
 */
export interface GenerateFallback333Success {
  ok: true;
  scrambleText: string;
  generatedAtMs: number;
  source: "fallback-local";
  requestId?: number;
}

/**
 * Failure response from scramble generation
 */
export interface GenerateFallback333Failure {
  ok: false;
  reason: "timeout" | "parse-error" | "generation-error";
  message: string;
  generatedAtMs: number;
  requestId?: number;
}

/**
 * Result type: success or failure
 */
export type GenerateFallback333Result =
  | GenerateFallback333Success
  | GenerateFallback333Failure;

/**
 * Options for scramble generation
 */
export interface GenerateFallback333Options {
  length?: number; // Default 20 for v1
  timeoutMs?: number; // Default 1000
  requestId?: number; // For tracking stale requests
}

/**
 * Select a random element from an array
 */
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a single move respecting quality constraints
 *
 * Enforces:
 * - No consecutive same-face moves
 * - No opposite-face A-B-A patterns in 3-move windows
 *
 * @param previousMoves - Previously generated moves for constraint checking
 * @returns Move object with face and modifier
 */
function generateMove(previousMoves: Move[]): Move {
  let face: Face;
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loop

  do {
    face = randomChoice(FACES);
    attempts++;

    if (attempts > maxAttempts) {
      // Fallback: if we can't find valid move, reset constraints (rare edge case)
      break;
    }

    // Constraint 1: No same-face consecutive moves
    if (previousMoves.length > 0) {
      const lastMove = previousMoves[previousMoves.length - 1];
      if (lastMove.face === face) {
        continue; // Try another face
      }
    }

    // Constraint 2: No opposite-face A-B-A patterns
    if (previousMoves.length >= 2) {
      const twoMovesBack = previousMoves[previousMoves.length - 2];
      const lastMove = previousMoves[previousMoves.length - 1];

      // Check if pattern is A-B-A where A and B are opposite faces
      if (
        twoMovesBack.face === face &&
        OPPOSITE_PAIRS[twoMovesBack.face] === lastMove.face
      ) {
        continue; // Try another face
      }
    }

    // Face passed all constraints
    break;
  } while (true);

  const modifier = randomChoice(MODIFIERS);
  return { face, modifier };
}

/**
 * Generate a sequence of moves as a scramble string
 *
 * @param length - Number of moves (default 20)
 * @returns Array of Move objects
 */
function generateMoveSequence(length: number = 20): Move[] {
  const moves: Move[] = [];

  for (let i = 0; i < length; i++) {
    const move = generateMove(moves);
    moves.push(move);
  }

  return moves;
}

/**
 * Convert Move array to scramble notation string
 *
 * @param moves - Array of Move objects
 * @returns Scramble notation (e.g., "R U2 F' L...")
 */
function movesToString(moves: Move[]): string {
  return moves.map((m) => m.face + m.modifier).join(" ");
}

/**
 * Validate scramble string via Alg.fromString parser
 *
 * This ensures the generated scramble is compatible with cubing.js
 * parsing and visualization pipelines.
 *
 * @param scrambleText - Scramble notation string
 * @returns true if parse succeeds, false otherwise
 */
function validateWithParser(scrambleText: string): boolean {
  try {
    // Attempt to parse with cubing.js
    // If this succeeds, the scramble is valid for all cubing.js APIs
    Alg.fromString(scrambleText);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Main scramble generator function
 *
 * Generates a deterministic rule-based scramble for 3x3 Rubik's Cube practice.
 * Validates output via Alg.fromString to ensure cubing.js compatibility.
 *
 * Guarantees (per FR-001 through FR-014):
 * - Exactly 20 moves (v1)
 * - No same-face consecutive moves
 * - No opposite-face A-B-A patterns
 * - All moves from {U, D, L, R, F, B} × {"", "'", "2"}
 * - Parseable by Alg.fromString
 * - Resolves or fails within 1000ms (timeout wrapper in caller)
 *
 * @param options - Generation options (length, timeoutMs, requestId)
 * @returns Promise<GenerateFallback333Result>
 */
export async function generateFallback333Scramble(
  options?: GenerateFallback333Options
): Promise<GenerateFallback333Result> {
  const length = options?.length ?? 20;
  const requestId = options?.requestId;

  try {
    // T002: Generate core move sequence
    const moves = generateMoveSequence(length);

    // T003: Quality constraints already enforced during generation
    // (no same-face, no opposite-face A-B-A)

    // Convert to string
    const scrambleText = movesToString(moves);

    // T004: Validate with parser (Alg.fromString)
    const isParseValid = validateWithParser(scrambleText);

    if (!isParseValid) {
      return {
        ok: false,
        reason: "parse-error",
        message: "Generated scramble failed Alg.fromString validation",
        generatedAtMs: Date.now(),
        requestId,
      };
    }

    // T006: Return typed result
    return {
      ok: true,
      scrambleText,
      generatedAtMs: Date.now(),
      source: "fallback-local",
      requestId,
    };
  } catch (error) {
    return {
      ok: false,
      reason: "generation-error",
      message: `Generation error: ${error instanceof Error ? error.message : String(error)}`,
      generatedAtMs: Date.now(),
      requestId,
    };
  }
}

/**
 * Wrap generator with timeout (T005)
 *
 * Returns a promise that rejects if generation takes longer than timeoutMs.
 * Used by modal integration to enforce 1000ms constraint.
 *
 * @param options - Generation options
 * @returns Promise that resolves with result or rejects on timeout
 */
export async function generateFallback333ScrambleWithTimeout(
  options?: GenerateFallback333Options
): Promise<GenerateFallback333Result> {
  const timeoutMs = options?.timeoutMs ?? 1000;

  const timeoutPromise = new Promise<GenerateFallback333Result>(
    (_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            `Scramble generation timeout after ${timeoutMs}ms (FR-014)`
          )
        );
      }, timeoutMs);
    }
  );

  const generationPromise = generateFallback333Scramble(options);

  try {
    return await Promise.race([generationPromise, timeoutPromise]);
  } catch (error) {
    return {
      ok: false,
      reason: "timeout",
      message: `Generation timeout after ${timeoutMs}ms`,
      generatedAtMs: Date.now(),
      requestId: options?.requestId,
    };
  }
}

export default generateFallback333Scramble;
