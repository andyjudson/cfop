import { CubeScramble } from '@andyjudson/cubify';
import type { ScrambleSource, ScrambleState } from '../types/practice';

export const generateRandom333Scramble = async (
  source: ScrambleSource = 'manual',
): Promise<ScrambleState> => {
  const notation = CubeScramble.random(20);
  return {
    value: notation,
    generatedAtMs: Date.now(),
    source,
  };
};
