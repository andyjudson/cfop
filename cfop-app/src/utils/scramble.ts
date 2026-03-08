import { Alg } from 'cubing/alg';
import type { ScrambleSource, ScrambleState } from '../types/practice';
import {
  generateFallback333ScrambleWithTimeout,
  type GenerateFallback333Result,
} from './fallbackScrambleGenerator';

const assertValidScramble = (notation: string): void => {
  const trimmed = notation.trim();
  if (!trimmed) {
    throw new Error('Generated scramble was empty.');
  }

  Alg.fromString(trimmed);
};

/**
 * Generate a random 3x3 scramble using the fallback generator.
 * 
 * This replaces the `cubing/scramble` worker which fails in production builds
 * on GitHub Pages. Uses a local deterministic rule-based generator instead.
 * 
 * Guarantees:
 * - 20-move output
 * - No consecutive same-face moves
 * - No opposite-face A-B-A patterns
 * - Parseable by Alg.fromString
 * - Resolves or fails within 1000ms
 */
export const generateRandom333Scramble = async (
  source: ScrambleSource = 'manual',
): Promise<ScrambleState> => {
  const result: GenerateFallback333Result = await generateFallback333ScrambleWithTimeout({
    length: 20,
    timeoutMs: 1000,
  });

  if (!result.ok) {
    throw new Error(
      `Scramble generation failed: ${result.reason} - ${result.message}`
    );
  }

  const notation = result.scrambleText;
  assertValidScramble(notation);

  return {
    value: notation,
    generatedAtMs: result.generatedAtMs,
    source,
  };
};
