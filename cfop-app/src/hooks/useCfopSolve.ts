import { useRef, useState, useCallback, useEffect } from 'react';
import { CubeState, CubeSolverCfop } from '@andyjudson/cubify';
import type { SolveStage } from '@andyjudson/cubify';

interface Options {
  scrambleDone: boolean;
  scrambleAlg: string | null;
  onSolveStart: () => void;
}

export function useCfopSolve({ scrambleDone, scrambleAlg, onSolveStart }: Options) {
  const solverRef       = useRef<CubeSolverCfop | null>(null);
  const stagesRef       = useRef<SolveStage[]>([]);
  const stageIdxRef     = useRef<number>(0);
  const setupRef        = useRef<string>('');
  const onSolveStartRef = useRef(onSolveStart);
  onSolveStartRef.current = onSolveStart;

  const [cfopStages,     setCfopStages]     = useState<SolveStage[] | null>(null);
  const [cfopStageIndex, setCfopStageIndex] = useState(0);
  const [cfopSetup,      setCfopSetup]      = useState('');
  const [isSolving,      setIsSolving]      = useState(false);

  useEffect(() => {
    const solver = new CubeSolverCfop();
    solverRef.current = solver;
    return () => { solver.dispose(); };
  }, []);

  const reset = useCallback(() => {
    stagesRef.current   = [];
    stageIdxRef.current = 0;
    setupRef.current    = '';
    setCfopStages(null);
    setCfopStageIndex(0);
    setCfopSetup('');
  }, []);

  const handleSolve = useCallback(async () => {
    if (!scrambleDone || !scrambleAlg || isSolving) return;
    const solver = solverRef.current;
    if (!solver?.available) return;
    setIsSolving(true);
    try {
      const state    = await CubeState.fromAlg(scrambleAlg);
      const solution = await solver.solve(state);
      const initialSetup = [scrambleAlg, solution.setupAlg].filter(Boolean).join(' ');
      stagesRef.current   = solution.stages;
      stageIdxRef.current = 0;
      setupRef.current    = initialSetup;
      setCfopStages(solution.stages);
      setCfopStageIndex(0);
      setCfopSetup(initialSetup);
      onSolveStartRef.current();
    } catch (err) {
      console.error('[cfop solve] failed:', err);
    } finally {
      setIsSolving(false);
    }
  }, [scrambleDone, scrambleAlg, isSolving]);

  const onStageComplete = useCallback(() => {
    const stages = stagesRef.current;
    const idx    = stageIdxRef.current;
    const setup  = setupRef.current;
    const completed = stages[idx];
    const newSetup  = completed?.alg ? [setup, completed.alg].filter(Boolean).join(' ') : setup;
    let nextIdx = idx + 1;
    while (nextIdx < stages.length && !stages[nextIdx].alg) nextIdx++;
    setupRef.current    = newSetup;
    stageIdxRef.current = nextIdx;
    setCfopSetup(newSetup);
    setCfopStageIndex(nextIdx);
  }, []);

  const canPlayCurrentStage = useCallback(
    () => !!stagesRef.current[stageIdxRef.current]?.alg,
    [],
  );

  return {
    cfopStages,
    cfopStageIndex,
    cfopSetup,
    cfopStage: cfopStages?.[cfopStageIndex],
    isSolving,
    handleSolve,
    onStageComplete,
    canPlayCurrentStage,
    reset,
  };
}
