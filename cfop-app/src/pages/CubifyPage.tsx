import { useRef, useState, useCallback, useEffect, useMemo, type ReactNode } from 'react';
import { CfopPageLayout } from '../components/CfopPageLayout';
import { CubePlayerComponent, CubePlayerControls, CubeMoveTape } from '@andyjudson/cubify-react';
import type { CubePlayerHandle } from '@andyjudson/cubify-react';
import { MASK_PRESETS, THEME_PRESETS, CubeState, AlgParser, CubeSolverKociemba } from '@andyjudson/cubify';
import type { ThemePresetName } from '@andyjudson/cubify';
import { useCfopSolve } from '../hooks/useCfopSolve';
import { MdInfo, MdShuffle, MdPsychology, MdRemove, MdAdd, MdTune } from 'react-icons/md';
import { FaGithub } from 'react-icons/fa';
import { warmUp, nextScramble } from '../utils/scrambleCache';
import { SPEED_MIN, SPEED_MAX, SPEED_STEP, nudgeSpeed } from '../utils/speed';
import 'bulma/css/bulma.min.css';
import '../App.css';
import '../cubify.css';

interface Case {
  name: string;
  alg: string;
  rotation?: string;
  defaultMask: string;
  group: string;
}

type CubifyMode  = 'case' | 'scramble' | 'solve';
type SolveMode   = 'beginner' | 'advanced' | 'optimal';

const CASES: Case[] = [
  {
    name: 'Solved',
    alg: '',
    defaultMask: 'full',
    group: 'Basics',
  },
  {
    name: 'Line (edges)',
    alg: "F R U R' U' F'",
    rotation: 'z2',
    defaultMask: 'oll-face-dim',
    group: '2-Look OLL',
  },
  {
    name: 'Hook (edges)',
    alg: "f R U R' U' f'",
    rotation: 'z2',
    defaultMask: 'oll-face-dim',
    group: '2-Look OLL',
  },
  {
    name: 'Sune (corners)',
    alg: "R U R' U R U2 R'",
    rotation: 'z2',
    defaultMask: 'oll-face-dim',
    group: '2-Look OLL',
  },
  {
    name: 'Anti-Sune (corners)',
    alg: "R U2 R' U' R U' R'",
    rotation: 'z2',
    defaultMask: 'oll-face-dim',
    group: '2-Look OLL',
  },
  {
    name: 'T-Perm (corners)',
    alg: "R U R' U' R' F R2 U' R' U' R U R' F'",
    rotation: 'z2',
    defaultMask: 'pll-corn-dim',
    group: '2-Look PLL',
  },
  {
    name: 'Ua-Perm (edges)',
    alg: "R2 U' R' U' R U R U R U' R",
    rotation: 'z2',
    defaultMask: 'pll-edge-dim',
    group: '2-Look PLL',
  },
  {
    name: 'H-Perm (edges)',
    alg: "M2 U' M2 U2 M2 U' M2",
    rotation: 'z2 y2',
    defaultMask: 'pll-edge-dim',
    group: '2-Look PLL',
  },
  {
    name: 'Sexy ×6',
    alg: "R U R' U' R U R' U' R U R' U' R U R' U' R U R' U' R U R' U'",
    defaultMask: 'full',
    group: 'Fun',
  },
  {
    name: 'Sledgehammer ×6',
    alg: "R' F R F' R' F R F' R' F R F' R' F R F' R' F R F' R' F R F'",
    defaultMask: 'full',
    group: 'Fun',
  },
  {
    name: 'Checkerboard',
    alg: "M2 E2 S2",
    defaultMask: 'full',
    group: 'Fun',
  },
  {
    name: 'Superflip',
    alg: "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2",
    defaultMask: 'full',
    group: 'Fun',
  },
];

const MASK_OPTIONS = MASK_PRESETS.map(p => ({ label: p.label, value: p.label }));

const THEME_LABELS: Partial<Record<ThemePresetName, string>> = { rubiks: 'Rubik', 'speed-dark': 'Dark', 'speed-light': 'Light' };
const THEME_OPTIONS = (Object.keys(THEME_PRESETS) as ThemePresetName[])
  .sort()
  .map(key => ({ label: THEME_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1), value: key }));

export default function CubifyPage() {
  const playerRef      = useRef<CubePlayerHandle>(null);
  const pendingPlayRef = useRef(false);
  const modeRef        = useRef<CubifyMode>('case');

  const [caseIdx,      setCaseIdx]    = useState(0);
  const [mode,         setMode]       = useState<CubifyMode>('case');
  const [scrambleAlg,  setScrambleAlg]  = useState<string | null>(null);
  const [scrambleDone, setScrambleDone] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);

  const [playing,      setPlaying]      = useState(false);
  const [stepIndex,    setStepIndex]    = useState(0);
  const [mask,         setMask]         = useState(CASES[0].defaultMask);
  const [theme,        setTheme]        = useState<ThemePresetName>('speed-dark');
  const [speed,        setSpeed]        = useState(1);
  const [solveMode,    setSolveMode]    = useState<SolveMode>('beginner');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef    = useRef<HTMLDivElement>(null);

  // Kociemba solver (Optimal mode)
  const kociembaRef         = useRef<CubeSolverKociemba | null>(null);
  const [kociembaAlg,       setKociembaAlg]       = useState<string | null>(null);
  const [isKociembaSolving, setIsKociembaSolving] = useState(false);

  const cfopSolve = useCfopSolve({
    scrambleDone,
    scrambleAlg,
    beginner: solveMode === 'beginner',
    onSolveStart: () => {
      setMode('solve');
      setScrambleDone(false);
      setPlaying(false);
    },
  });

  useEffect(() => { warmUp(); }, []);

  useEffect(() => {
    const solver = new CubeSolverKociemba();
    kociembaRef.current = solver;
    return () => { solver.dispose(); };
  }, []);

  // Auto-scramble on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { handleScramble(); }, []);

  // Close settings popover on outside click
  useEffect(() => {
    if (!settingsOpen) return;
    const handler = (e: MouseEvent) => {
      if (!settingsRef.current?.contains(e.target as Node)) setSettingsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [settingsOpen]);

  const isSolving = cfopSolve.isSolving || isKociembaSolving;

  useEffect(() => {
    document.body.style.cursor = (isScrambling || isSolving) ? 'wait' : '';
    return () => { document.body.style.cursor = ''; };
  }, [isScrambling, isSolving]);

  const activeCase = CASES[caseIdx];

  // Derive active alg, setup, mask from current mode
  const { cfopStage } = cfopSolve;
  const isOptimal = solveMode === 'optimal';

  const activeAlg = mode === 'case'
    ? activeCase.alg
    : mode === 'scramble'
      ? (scrambleAlg ?? '')
      : isOptimal
        ? (kociembaAlg ?? '')
        : (cfopStage?.alg ?? '');

  const activeSetup = mode === 'case'
    ? CubeState.setupFromAlg(activeCase.alg, activeCase.rotation)
    : mode === 'scramble'
      ? ''
      : isOptimal
        ? (scrambleAlg ?? '')
        : cfopSolve.cfopSetup;

  const activeMask = mode === 'case'
    ? mask
    : mode === 'solve'
      ? (isOptimal ? 'full' : (cfopStage?.mask ?? 'full'))
      : 'full';

  modeRef.current = mode;

  const moves = useMemo(() => activeAlg ? AlgParser.parse(activeAlg) : [], [activeAlg]);
  const moveCount = moves.length;

  const sep = <span style={{ color: 'var(--color-text-muted)', margin: '0 6px' }}>·</span>;
  const scrambleMoveCount = scrambleAlg ? scrambleAlg.trim().split(/\s+/).length : 0;
  const scrambleInfoMessage: ReactNode = scrambleAlg
    ? <>WCA random-state scramble · generated using twips · {scrambleMoveCount} moves · 4.3 × 10<sup>19</sup> possibilities</>
    : 'Scrambling…';

  const statusMessage: ReactNode =
    (isScrambling || mode === 'scramble') ? scrambleInfoMessage :
    isKociembaSolving ? 'Solving… optimal' :
    cfopSolve.isSolving ? `Solving… CFOP ${solveMode} mode` :
    (mode === 'solve' && isOptimal && kociembaAlg)
      ? `Solved! ${kociembaAlg ? AlgParser.parse(kociembaAlg).length : 0} moves · optimal` :
    (mode === 'solve' && !isOptimal && cfopSolve.cfopStages && !cfopStage)
      ? `Solved! ${cfopSolve.cfopStages.reduce((n, s) => n + s.moves, 0)} moves` :
    (mode === 'solve' && !isOptimal && cfopStage)
      ? (
          <>
            <span style={{ fontWeight: 600 }}>
              {cfopStage.label.toUpperCase().replace(/-/g, ' ')}
            </span>
            {cfopStage.caseName && <>
              {sep}
              <span>{cfopStage.caseName}</span>
            </>}
            {cfopStage.alg && <>{sep}<span style={{ fontFamily: 'inherit' }}>{cfopStage.alg}</span></>}
          </>
        ) :
    null;

  const autoPlay = useCallback(() => {
    pendingPlayRef.current = true;
    setPlaying(false);
    setStepIndex(0);
    playerRef.current?.reset();
  }, []);

  const handleMove = useCallback(({ index }: { index: number }) => {
    setStepIndex(index);
  }, []);

  // Stable identity — reads mode via ref to avoid stale closures; cfop stage progression delegated to hook
  const solveModeRef = useRef<SolveMode>('beginner');
  solveModeRef.current = solveMode;

  const handleComplete = useCallback(() => {
    setPlaying(false);
    if (modeRef.current === 'scramble') {
      setScrambleDone(true);
    } else if (modeRef.current === 'solve' && solveModeRef.current !== 'optimal') {
      cfopSolve.onStageComplete();
    }
  }, [cfopSolve.onStageComplete]);

  const handleResetButton = useCallback(() => {
    pendingPlayRef.current = false;
    setPlaying(false);
    setStepIndex(0);
    if (modeRef.current === 'scramble') setScrambleDone(false);
    playerRef.current?.reset();
  }, []);

  const handlePlayerReset = useCallback(() => {
    setStepIndex(0);
    if (pendingPlayRef.current) {
      pendingPlayRef.current = false;
      setTimeout(() => { setPlaying(true); }, 300);
    } else {
      setPlaying(false);
    }
  }, []);

  const handleOptimalSolve = useCallback(async () => {
    if (!scrambleDone || !scrambleAlg || isKociembaSolving) return;
    const solver = kociembaRef.current;
    if (!solver?.available) return;
    setIsKociembaSolving(true);
    setMode('solve');
    setScrambleDone(false);
    setPlaying(false);
    try {
      const state  = await CubeState.fromAlg(scrambleAlg);
      const result = await solver.solve(state);
      setKociembaAlg(result.alg);
      autoPlay();
    } catch (err) {
      console.error('[kociemba] failed:', err);
    } finally {
      setIsKociembaSolving(false);
    }
  }, [scrambleDone, scrambleAlg, isKociembaSolving, autoPlay]);

  const handlePlayToggle = useCallback(() => {
    // Guard: no stage to play when CFOP solve is complete (not applicable to optimal)
    if (modeRef.current === 'solve' && !isOptimal && !cfopSolve.canPlayCurrentStage()) return;
    if (!playing && stepIndex >= moveCount) {
      pendingPlayRef.current = true;
      setStepIndex(0);
      playerRef.current?.reset();
    } else {
      setPlaying(p => !p);
    }
  }, [playing, stepIndex, moveCount]);

  const handleStepForward  = useCallback(() => { playerRef.current?.stepForward(); }, []);
  const handleStepBackward = useCallback(() => { playerRef.current?.stepBackward(); }, []);

  // Spacebar toggles play/pause (ignored while typing in a form field).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.key !== ' ') return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      e.preventDefault();
      handlePlayToggle();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePlayToggle]);

  const handleCaseChange = (idx: number) => {
    setMode('case');
    setScrambleAlg(null);
    setKociembaAlg(null);
    cfopSolve.reset();
    setPlaying(false);
    setStepIndex(0);
    setCaseIdx(idx);
    setMask(CASES[idx].defaultMask);
  };

  const handleScramble = useCallback(async () => {
    if (isScrambling) return;
    setIsScrambling(true);
    setScrambleDone(false);
    setKociembaAlg(null);
    cfopSolve.reset();
    try {
      const alg = await nextScramble();
      setScrambleAlg(alg);
      setMode('scramble');
      autoPlay();
    } finally {
      setIsScrambling(false);
    }
  }, [isScrambling, autoPlay, cfopSolve.reset]);

  return (
    <CfopPageLayout pageTitle="Cubify" subtitle="3x3 cube visualization framework optimized for CFOP simulation">
      <section className="section" style={{ paddingTop: 0 }}>
        {/* Cube */}
        <div style={{ width: 290, height: 290, margin: '0 auto' }}>
          <CubePlayerComponent
            ref={playerRef}
            alg={activeAlg}
            setup={activeSetup}
            stickering={activeMask || undefined}
            theme={theme}
            playing={playing}
            speed={speed}
            onMove={handleMove}
            onReset={handlePlayerReset}
            onComplete={handleComplete}
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        <CubeMoveTape
          moves={moves}
          stepIndex={stepIndex}
          style={{ marginTop: 12 }}
        />

        <div className="cubify-controls-row">
          <div className="cubify-controls-primary">
            <CubePlayerControls
              playing={playing}
              stepIndex={stepIndex}
              moveCount={moveCount}
              size="sm"
              onPlayToggle={handlePlayToggle}
              onReset={handleResetButton}
              onStepBackward={handleStepBackward}
              onStepForward={handleStepForward}
              onCameraReset={() => playerRef.current?.resetCamera()}
            />
            <div className="cubify-settings-wrapper" ref={settingsRef}>
              <button
                className="cubify-speed-btn"
                onClick={() => setSettingsOpen(o => !o)}
                disabled={isSolving || isScrambling}
                title="Settings"
              >
                <MdTune />
              </button>
              {settingsOpen && (
                <div className="cubify-settings-popover">
                  <div className="cubify-settings-row">
                    <span className="cubify-settings-label">Case</span>
                    <div className="select is-small" style={{ flex: 1 }}>
                      <select style={{ width: '100%' }} value={caseIdx} onChange={e => { handleCaseChange(Number(e.target.value)); setSettingsOpen(false); }}>
                        {Object.entries(
                          CASES.reduce<Record<string, { name: string; idx: number }[]>>((acc, c, i) => {
                            (acc[c.group] ??= []).push({ name: c.name, idx: i });
                            return acc;
                          }, {})
                        ).map(([group, items]) => (
                          <optgroup key={group} label={group}>
                            {items.map(({ name, idx }) => <option key={idx} value={idx}>{name.toLowerCase()}</option>)}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="cubify-settings-row">
                    <span className="cubify-settings-label">Mask</span>
                    <div className="select is-small" style={{ flex: 1 }}>
                      <select style={{ width: '100%' }} value={mode !== 'case' ? 'full' : mask} onChange={e => setMask(e.target.value)}>
                        {MASK_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="cubify-settings-row">
                    <span className="cubify-settings-label">Theme</span>
                    <div className="select is-small" style={{ flex: 1 }}>
                      <select style={{ width: '100%' }} value={theme} onChange={e => setTheme(e.target.value as ThemePresetName)}>
                        {THEME_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label.toLowerCase()}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="cubify-settings-row">
                    <span className="cubify-settings-label">Solver</span>
                    <div className="select is-small" style={{ flex: 1 }}>
                      <select style={{ width: '100%' }} value={solveMode} onChange={e => setSolveMode(e.target.value as SolveMode)}>
                        <option value="beginner">beginner</option>
                        <option value="advanced">advanced</option>
                        <option value="optimal">optimal</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="cubify-controls-secondary">
            <button className="cubify-speed-btn" onClick={() => setSpeed(s => nudgeSpeed(s, -SPEED_STEP))} disabled={speed <= SPEED_MIN} title="Slower"><MdRemove /></button>
            <span className="cubify-speed-label">×{speed.toFixed(1)}</span>
            <button className="cubify-speed-btn" onClick={() => setSpeed(s => nudgeSpeed(s, SPEED_STEP))} disabled={speed >= SPEED_MAX} title="Faster"><MdAdd /></button>
            <button
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                border: '1px solid #dbdbdb', background: '#f5f5f5',
                cursor: (isScrambling || isSolving || (playing && mode !== 'case')) ? 'default' : 'pointer',
                color: '#363636', fontSize: 18,
                opacity: (isScrambling || isSolving || (playing && mode !== 'case')) ? 0.35 : 1,
              }}
              onClick={handleScramble}
              disabled={isScrambling || isSolving || (playing && mode !== 'case')}
              title="Scramble (WCA random-state)"
            >
              <MdShuffle />
            </button>
            <button
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                border: '1px solid #dbdbdb', background: '#f5f5f5',
                cursor: (mode !== 'scramble' || !scrambleDone || isSolving || isScrambling || playing) ? 'default' : 'pointer',
                color: '#363636', fontSize: 18,
                opacity: (mode !== 'scramble' || !scrambleDone || isSolving || isScrambling || playing) ? 0.35 : 1,
              }}
              onClick={isOptimal ? handleOptimalSolve : cfopSolve.handleSolve}
              disabled={mode !== 'scramble' || !scrambleDone || isSolving || isScrambling || playing}
              title={`Solve (${solveMode})`}
            >
              <MdPsychology />
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="notification is-info is-light" style={{ padding: '0.5rem 1rem', marginTop: 10, textAlign: 'center', fontSize: '0.85rem', maxWidth: 640, margin: '10px auto 0' }}>
            {statusMessage}
          </div>
        )}

        <details style={{ maxWidth: 640, margin: '32px auto 0', fontFamily: 'inherit' }}>
          <summary style={{
            cursor: 'pointer', fontSize: '0.82rem', color: 'var(--color-text-muted)',
            listStyle: 'none', display: 'flex', alignItems: 'center', gap: 6,
            userSelect: 'none',
          }}>
            <MdInfo style={{ fontSize: '1rem', flexShrink: 0 }} /> About cubify ...
          </summary>
          <div style={{
            marginTop: 12, padding: '16px 20px',
            background: 'var(--color-bg-subtle)', borderRadius: 8,
            border: '1px solid var(--color-border-medium)', fontSize: '0.82rem',
            lineHeight: 1.65, color: 'var(--color-text-secondary)',
          }}>
            <p style={{ marginBottom: 10 }}>
              <strong>Cubify</strong> is a 3×3 cube rendering and logic library that delegates permutation
              state and move application to <a href="https://github.com/cubing/cubing.js" target="_blank" rel="noreferrer" style={{ color: '#00b89c' }}>cubing.js</a> as ground truth, then owns the rendering
              layer itself. Where TwistyPlayer is a self-contained component optimised for standalone
              use, cubify is designed for embedding — built to sit inside a custom app with its own
              UI and design language. Cube state is a first-class value you can read, diff, and react
              to at any point. The rendering layer is fully decoupled: a Three.js renderer with a
              typed theme system (face colours, plastic material, gap, bevel, surface finish), a
              stickering / masking API for CFOP case visualisation, a <code>CubePlayer</code> animation engine
              that emits move-level events, and a PNG export pipeline for both 2D and 3D renders.
            </p>
            <p style={{ marginBottom: 10 }}>
              Inspectable means two things. For a developer building a trainer app:
              live permutation state via <code>player.state</code>, move-level events (<code>onMove</code>, <code>onComplete</code>),
              and a plain canvas you can read from devtools without a shadow root in the way.
              For a developer working on the library: the <a href="https://github.com/andyjudson/cubify/tree/main/cubify-harness" target="_blank" rel="noreferrer" style={{ color: '#00b89c' }}>interactive harness</a> exposes
              KPattern slot data, face arrays, corner and edge orientation, and applied move history
              in real time — the same debug surface used to build and verify the renderer itself.
            </p>
            <p style={{ marginBottom: 10 }}>
              The <strong>Scramble</strong> button (<MdShuffle style={{ verticalAlign: 'middle' }} />) generates a
              random-state scramble via <code>CubeScramble</code>, which uses the{' '}
              <a href="https://github.com/cubing/twips" target="_blank" rel="noreferrer" style={{ color: '#00b89c' }}>twips</a>{' '}
              WASM scrambler — a random-state generator using the same approach as WCA competitions. Scrambles are pre-generated in the background so the first one is ready
              immediately; the cache refills after each use so wait time stays near zero.
              The <strong>Solve</strong> button (<MdPsychology style={{ verticalAlign: 'middle' }} />) runs the
              scrambled cube through <code>CubeSolverCfop</code> — a stage-annotated CFOP solver that breaks the
              solution into 7 stages (cross, four F2L pairs, OLL, PLL), each with its own alg, mask, and
              case name. Stages play back one at a time so you can follow the solve step by step. The solver
              runs in a web worker and does not block the UI.
            </p>
            <p style={{ marginBottom: 10 }}>
              The React wrapper is a thin layer — <code>{'<CubePlayerComponent>'}</code>, <code>{'<CubePlayerControls>'}</code>, and <code>{'<CubeStateComponent>'}</code> manage
              the mount/unmount lifecycle and expose a prop-driven interface, so consumers get
              declarative control without the imperative boilerplate. The <a href="https://github.com/andyjudson/cubify/tree/main/packages/cubify-react/src" target="_blank" rel="noreferrer" style={{ color: '#00b89c' }}>React package</a> lives in the cubify repo.
            </p>
            <p style={{ marginBottom: 0, color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
              Built iteratively with <a href="https://claude.ai/code" target="_blank" rel="noreferrer" style={{ color: '#00b89c' }}>Claude Code</a> and <a href="https://github.com/github/spec-kit" target="_blank" rel="noreferrer" style={{ color: '#00b89c' }}>Speckit</a> — architecture, renderer design, theme system, api  and React wrappers.
              <FaGithub style={{ verticalAlign: 'middle', marginRight: 4, marginLeft: 4 }} />
              <a href="https://github.com/andyjudson/cubify" target="_blank" rel="noreferrer" style={{ color: '#00b89c' }}>github.com/andyjudson/cubify</a>
            </p>
          </div>
        </details>
      </section>
    </CfopPageLayout>
  );
}
