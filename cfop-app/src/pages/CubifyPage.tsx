import { useRef, useState, useCallback, useEffect } from 'react';
import { CfopPageLayout } from '../components/CfopPageLayout';
import { CubePlayer, CubePlayerControls, CubeMoveTape } from '@andyjudson/cubify-react';
import type { CubePlayerHandle } from '@andyjudson/cubify-react';
import { MASK_PRESETS, THEME_PRESETS, CubeState, AlgParser, CubeSolver } from '@andyjudson/cubify';
import type { ThemePresetName } from '@andyjudson/cubify';
import { MdInfo, MdShuffle, MdPsychology, MdRemove, MdAdd } from 'react-icons/md';
import { FaGithub } from 'react-icons/fa';
import { warmUp, nextScramble } from '../utils/scrambleCache';
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

type CubifyMode = 'case' | 'scramble' | 'solve';

const CASES: Case[] = [
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
  const solverRef      = useRef<CubeSolver | null>(null);

  const SUPERFLIP_IDX = CASES.findIndex(c => c.name === 'Superflip');
  const [caseIdx,       setCaseIdx]       = useState(SUPERFLIP_IDX);
  const [mode,          setMode]          = useState<CubifyMode>('case');
  const [scrambleAlg,   setScrambleAlg]   = useState<string | null>(null);
  const [solveAlg,      setSolveAlg]      = useState<string | null>(null);
  const [scrambleDone,  setScrambleDone]  = useState(false);
  const [isScrambling,  setIsScrambling]  = useState(false);
  const [isSolving,     setIsSolving]     = useState(false);
  const [thinking, setThinking] = useState(false);

  const [playing,   setPlaying]   = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [mask,      setMask]      = useState(CASES[SUPERFLIP_IDX].defaultMask);
  const [theme,     setTheme]     = useState<ThemePresetName>('speed-dark');
  const [speed,     setSpeed]     = useState(1);

  useEffect(() => {
    warmUp();
    const solver = new CubeSolver();
    solverRef.current = solver;
    return () => { solver.dispose(); };
  }, []);

  useEffect(() => {
    document.body.style.cursor = (isScrambling || isSolving) ? 'wait' : '';
    return () => { document.body.style.cursor = ''; };
  }, [isScrambling, isSolving]);

  const activeCase = CASES[caseIdx];

  // Derive active alg, setup, mask, and moves from current mode
  const activeAlg = mode === 'case'
    ? activeCase.alg
    : mode === 'scramble'
      ? (scrambleAlg ?? '')
      : (solveAlg ?? '');

  const activeSetup = mode === 'case'
    ? CubeState.setupFromAlg(activeCase.alg, activeCase.rotation)
    : mode === 'scramble'
      ? ''
      : (scrambleAlg ?? '');

  const activeMask = mode === 'case' ? mask : 'full';
  modeRef.current = mode;

  const moves = activeAlg ? AlgParser.parse(activeAlg) : [];
  const moveCount = moves.length;

  const statusMessage =
    (isScrambling || (mode === 'scramble' && (playing || thinking))) ? 'Scrambling… using WCA random-state method' :
    (isSolving    || (mode === 'solve'    && (playing || thinking))) ? 'Solving… using Kociemba 2-phase method' :
    null;

  const autoPlay = useCallback(() => {
    pendingPlayRef.current = true;
    setThinking(true);
    setPlaying(false);
    setStepIndex(0);
    playerRef.current?.reset();
  }, []);

  const handleMove = useCallback(({ index }: { index: number }) => {
    setStepIndex(index);
  }, []);

  // Stable identity — reads mode via ref to avoid stale closure
  const handleComplete = useCallback(() => {
    setPlaying(false);
    if (modeRef.current === 'scramble') setScrambleDone(true);
  }, []);

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
      setTimeout(() => { setPlaying(true); setThinking(false); }, 300);
    } else {
      setThinking(false);
      setPlaying(false);
    }
  }, []);

  const handlePlayToggle = useCallback(() => {
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

  const handleCaseChange = (idx: number) => {
    setMode('case');
    setScrambleAlg(null);
    setSolveAlg(null);
    setPlaying(false);
    setStepIndex(0);
    setCaseIdx(idx);
    setMask(CASES[idx].defaultMask);
  };

  const handleScramble = useCallback(async () => {
    if (isScrambling) return;
    setIsScrambling(true);
    setIsSolving(false);
    setScrambleDone(false);
    setSolveAlg(null);
    try {
      const alg = await nextScramble();
      setScrambleAlg(alg);
      setSolveAlg(null);
      setMode('scramble');
      autoPlay();
    } finally {
      setIsScrambling(false);
    }
  }, [isScrambling, autoPlay]);

  const handleSolve = useCallback(async () => {
    if (!scrambleDone || !scrambleAlg || isSolving) return;
    const solver = solverRef.current;
    console.info('[handleSolve] solver:', solver, 'available:', solver?.available);
    if (!solver?.available) { console.error('[handleSolve] solver not available'); return; }
    setIsSolving(true);
    try {
      const state = await CubeState.fromAlg(scrambleAlg);
      console.info('[handleSolve] state ready, calling solver…');
      const result = await solver.solve(state);
      console.info('[handleSolve] solve result:', result.alg, `(${result.elapsedMs}ms)`);
      const alg = result.alg;
      setSolveAlg(alg);
      setMode('solve');
      setScrambleDone(false);
      autoPlay();
    } catch (err) {
      console.error('[solve] failed:', err);
    } finally {
      setIsSolving(false);
    }
  }, [scrambleDone, scrambleAlg, isSolving, autoPlay]);

  return (
    <CfopPageLayout pageTitle="Cubify" subtitle="3x3 cube visualization framework optimized for CFOP simulation">
      <section className="section" style={{ paddingTop: '1rem' }}>
        {/* Selectors */}
        <div className="cubify-select-row">
          <div className="select" style={{ width: 120 }}>
            <select style={{ width: '100%' }} value={caseIdx} onChange={e => handleCaseChange(Number(e.target.value))}>
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
          <div className="select" style={{ width: 120 }}>
            <select style={{ width: '100%' }} value={mode !== 'case' ? 'full' : mask} onChange={e => setMask(e.target.value)}>
              {MASK_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="select" style={{ width: 120 }}>
            <select style={{ width: '100%' }} value={theme} onChange={e => setTheme(e.target.value as ThemePresetName)}>
              {THEME_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label.toLowerCase()}</option>)}
            </select>
          </div>
        </div>

        {/* Cube */}
        <div style={{ width: 290, height: 290, margin: '0 auto' }}>
          <CubePlayer
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
          <div className="cubify-controls-secondary">
            <div className="cubify-controls-separator" />
            <button className="cubify-speed-btn" onClick={() => setSpeed(s => Math.round(Math.min(3, Math.max(0.5, s - 0.5)) / 0.5) * 0.5)} disabled={speed <= 0.5} title="Slower"><MdRemove /></button>
            <span className="cubify-speed-label">×{speed.toFixed(1)}</span>
            <button className="cubify-speed-btn" onClick={() => setSpeed(s => Math.round(Math.min(3, Math.max(0.5, s + 0.5)) / 0.5) * 0.5)} disabled={speed >= 3} title="Faster"><MdAdd /></button>
            <div className="cubify-controls-separator" />
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
              onClick={handleSolve}
              disabled={mode !== 'scramble' || !scrambleDone || isSolving || isScrambling || playing}
              title="Solve (Kociemba 2-phase)"
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
              The <strong>Solve</strong> button (<MdPsychology style={{ verticalAlign: 'middle' }} />) solves the
              scrambled cube via <code>CubeSolver</code>, which uses the same{' '}
              <a href="https://github.com/cubing/twips" target="_blank" rel="noreferrer" style={{ color: '#00b89c' }}>twips</a>{' '}
              WASM worker — a Kociemba two-phase solver that finds near-optimal solutions without blocking the UI.
            </p>
            <p style={{ marginBottom: 10 }}>
              The React wrapper is a thin layer — <code>{'<CubePlayer>'}</code>, <code>{'<CubePlayerControls>'}</code>, and <code>{'<CubeState>'}</code> manage
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
