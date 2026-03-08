import { Alg } from 'cubing/alg';
import { randomScrambleForEvent } from 'cubing/scramble';
import { setSearchDebug } from 'cubing/search';
import type { ScrambleSource, ScrambleState } from '../types/practice';

// Enable esbuild workaround for production builds
setSearchDebug({ 
  prioritizeEsbuildWorkaroundForWorkerInstantiation: true,
  showWorkerInstantiationWarnings: false,
});

const EVENT_333 = '333';

const assertValidScramble = (notation: string): void => {
  const trimmed = notation.trim();
  if (!trimmed) {
    throw new Error('Generated scramble was empty.');
  }

  Alg.fromString(trimmed);
};

export const generateRandom333Scramble = async (
  source: ScrambleSource = 'manual',
): Promise<ScrambleState> => {
  const alg = await randomScrambleForEvent(EVENT_333);
  const notation = alg.toString();

  assertValidScramble(notation);

  return {
    value: notation,
    generatedAtMs: Date.now(),
    source,
  };
};
