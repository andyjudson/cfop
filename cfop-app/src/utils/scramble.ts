import { Alg } from 'cubing/alg';
import type { ScrambleSource, ScrambleState } from '../types/practice';
import {
  generate333ScrambleWithTimeout,
  type Generate333Result,
} from './scrambleGenerator';

const assertValidScramble = (notation: string): void => {
  const trimmed = notation.trim();
  if (!trimmed) {
    throw new Error('Generated scramble was empty.');
  }

  Alg.fromString(trimmed);
};

/**
 * Generate a random 3x3 scramble using the custom local generator.
 *
 * Note: This is now the primary scramble generation path for the app.
 * `cubing/scramble` worker generation has been removed from runtime usage.
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
  const result: Generate333Result = await generate333ScrambleWithTimeout({
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
