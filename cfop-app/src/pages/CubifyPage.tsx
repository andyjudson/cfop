import { useRef, useState, useCallback } from 'react';
import { CfopPageLayout } from '../components/CfopPageLayout';
import { CubePlayer, CubePlayerControls, CubeMoveTape } from '../lib/cubify';
import type { CubePlayerHandle } from '../lib/cubify';
import { MASK_PRESETS, THEME_PRESETS, CubeState } from 'cubify';
import type { ThemePresetName } from 'cubify';
import { MdInfo } from 'react-icons/md';
import { FaGithub } from 'react-icons/fa';
import 'bulma/css/bulma.min.css';
import '../App.css';

interface Case {
  name: string;
  alg: string;
  rotation?: string;   // e.g. 'z2' — setup is computed as rotation + inverse(alg)
  defaultMask: string;
  group: string;
}


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
    name: 'T Perm (corners)',
    alg: "R U R' U' R' F R2 U' R' U' R U R' F'",
    rotation: 'z2',
    defaultMask: 'pll-corn-dim',
    group: '2-Look PLL',
  },
  {
    name: 'Ua Perm (edges)',
    alg: "M2 U M U2 M' U M2",
    rotation: 'z2',
    defaultMask: 'pll-edge-dim',
    group: '2-Look PLL',
  },
  {
    name: 'H Perm (edges)',
    alg: "M2 U M2 U2 M2 U M2",
    rotation: 'z2',
    defaultMask: 'pll-edge-dim',
    group: '2-Look PLL',
  },
  {
    name: 'Z Perm (edges)',
    alg: "M2 U M2 U M' U2 M2 U2 M'",
    rotation: 'z2',
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
  const playerRef  = useRef<CubePlayerHandle>(null);
  const steppingRef = useRef(false);
  const [caseIdx,   setCaseIdx]   = useState(0);
  const [playing,   setPlaying]   = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [mask,      setMask]      = useState(CASES[0].defaultMask);
  const [theme,     setTheme]     = useState<ThemePresetName>('speed-dark');
  const [speed,     setSpeed]     = useState(1);

  const activeCase = CASES[caseIdx];

  const handleMove = useCallback(({ index }: { index: number }) => {
    setStepIndex(index);
    if (steppingRef.current) {
      steppingRef.current = false;
      setPlaying(false);
    }
  }, []);
  const handleComplete = useCallback(() => setPlaying(false), []);

  // Called by CubePlayerControls reset button — initiates the reset
  const handleResetButton = useCallback(() => {
    steppingRef.current = false;
    setPlaying(false);
    setStepIndex(0);
    playerRef.current?.reset();
  }, []);

  // Called by CubePlayer onReset event — player already reset, just sync state
  const handlePlayerReset = useCallback(() => {
    setPlaying(false);
    setStepIndex(0);
  }, []);

  const moveCount = activeCase.alg.split(' ').length;

  const handleStepForward = useCallback(() => {
    if (stepIndex >= moveCount) return;
    steppingRef.current = true;
    setPlaying(true);
  }, [stepIndex, moveCount]);

  const handleStepBack = useCallback(() => {
    if (stepIndex <= 0) return;
    const prev = stepIndex - 1;
    setStepIndex(prev);
    playerRef.current?.jumpTo(prev);
  }, [stepIndex]);

  const handleCaseChange = (idx: number) => {
    steppingRef.current = false;
    setPlaying(false);
    setStepIndex(0);
    setCaseIdx(idx);
    setMask(CASES[idx].defaultMask);
  };

  return (
    <CfopPageLayout pageTitle="Cubify" subtitle="3x3 cube visualization framework optimized for CFOP simulation">
      <section className="section">
        {/* Selectors */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div className="select">
            <select value={caseIdx} onChange={e => handleCaseChange(Number(e.target.value))}>
              {Object.entries(
                CASES.reduce<Record<string, { name: string; idx: number }[]>>((acc, c, i) => {
                  (acc[c.group] ??= []).push({ name: c.name, idx: i });
                  return acc;
                }, {})
              ).map(([group, items]) => (
                <optgroup key={group} label={group}>
                  {items.map(({ name, idx }) => <option key={idx} value={idx}>{name}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="select">
            <select value={mask} onChange={e => setMask(e.target.value)}>
              {MASK_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {THEME_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTheme(opt.value as ThemePresetName)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid',
                  borderColor: theme === opt.value ? '#00b89c' : '#dbdbdb',
                  background:  theme === opt.value ? '#00b89c' : '#f5f5f5',
                  color:       theme === opt.value ? '#fff'    : '#363636',
                  fontSize: '0.82rem',
                  fontWeight: theme === opt.value ? 600 : 400,
                  cursor: 'pointer',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cube */}
        <div style={{ width: 320, height: 320, margin: '0 auto' }}>
          <CubePlayer
            ref={playerRef}
            alg={activeCase.alg}
            setup={CubeState.setupFromAlg(activeCase.alg, activeCase.rotation)}
            stickering={mask || undefined}
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
          moves={activeCase.alg.split(' ')}
          stepIndex={stepIndex}
          style={{ marginTop: 12 }}
        />

        <CubePlayerControls
          playing={playing}
          speed={speed}
          onPlayToggle={() => setPlaying(p => !p)}
          onReset={handleResetButton}
          onStepBack={handleStepBack}
          onStepForward={handleStepForward}
          stepBackDisabled={stepIndex <= 0}
          stepForwardDisabled={stepIndex >= moveCount}
          onCameraReset={() => playerRef.current?.resetCamera()}
          onSpeedChange={setSpeed}
          style={{ marginTop: 12 }}
        />

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
              use, cubify is designed for embedding — a renderer built to sit inside a custom app
              with its own UI and design language. That means two things: cube state is a first-class
              value you can read, diff, and react to at any point; and the visual layer is fully
              decoupled — face colours, plastic, gap, bevel, and surface finish are all driven by a
              typed theme object that integrates with your own CSS custom properties, so the cube
              looks like it belongs in your app rather than being dropped in from somewhere else.
            </p>
            <p style={{ marginBottom: 10 }}>
              The split is intentional — cubing.js solves the hard problem (KPattern permutation
              state, WCA-correct move application, puzzle definitions) and cubify owns the rendering
              layer: a Three.js 3×3-focused renderer with a clean theme system (face colours,
              plastic material, gap, bevel, surface finish), a stickering / masking API for CFOP
              case visualisation, a CubePlayer animation engine that emits move-level events, and a
              PNG export pipeline for both 2D and 3D renders — single alg or bulk batch. Where
              cubing.js scramble generation requires a web worker setup that adds bundler complexity,
              cubify ships a pure JS <code>CubeScramble</code> — no worker, no Vite config ceremony.
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
              The React wrapper is a thin layer — <code>{'<CubePlayer>'}</code> and <code>{'<CubeState>'}</code> manage
              the mount/unmount lifecycle and expose a prop-driven interface, so consumers get
              declarative control without the imperative boilerplate. The <a href="https://github.com/andyjudson/cfop/tree/main/cfop-app/src/lib/cubify" target="_blank" rel="noreferrer" style={{ color: '#00b89c' }}>reference implementation</a> lives in this repo.
            </p>
            <p style={{ marginBottom: 0, color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
              Built iteratively with <a href="https://claude.ai/code" target="_blank" rel="noreferrer" style={{ color: '#00b89c' }}>Claude Code</a> — architecture,
              renderer design, theme system, and React wrappers developed through spec-driven
              development sessions using <a href="https://github.com/github/spec-kit" target="_blank" rel="noreferrer" style={{ color: '#00b89c' }}>speckit</a>.
              <br />
              <FaGithub style={{ verticalAlign: 'middle', marginRight: 4 }} />
              <a href="https://github.com/andyjudson/cubify" target="_blank" rel="noreferrer" style={{ color: '#00b89c' }}>github.com/andyjudson/cubify</a>
            </p>
          </div>
        </details>
      </section>
    </CfopPageLayout>
  );
}
