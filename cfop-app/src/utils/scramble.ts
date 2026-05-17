import type { ScrambleSource, ScrambleState } from '../types/practice';
import { nextScramble } from './scrambleCache';

export const generateRandom333Scramble = async (
  source: ScrambleSource = 'manual',
): Promise<ScrambleState> => {
  const notation = await nextScramble();
  return {
    value: notation,
    generatedAtMs: Date.now(),
    source,
  };
};
