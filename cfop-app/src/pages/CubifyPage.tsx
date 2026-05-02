import { useRef, useState, useCallback } from 'react';
import { CfopPageLayout } from '../components/CfopPageLayout';
import { CubePlayer, CubePlayerControls, CubeMoveTape } from '../lib/cubify';
import type { CubePlayerHandle } from '../lib/cubify';
import { MASK_PRESETS, THEME_PRESETS, CubeState } from 'cubify';
import type { ThemePresetName } from 'cubify';
import 'bulma/css/bulma.min.css';
import '../App.css';

interface Case {
  name: string;
  alg: string;
  rotation?: string;   // e.g. 'z2' — setup is computed as rotation + inverse(alg)
  defaultMask: string;
}


const CASES: Case[] = [
  {
    name: 'Sune (OLL)',
    alg: "R U R' U R U2 R'",
    rotation: 'z2',
    defaultMask: 'oll-face-dim',
  },
  {
    name: 'T Perm (PLL)',
    alg: "R U R' U' R' F R2 U' R' U' R U R' F'",
    rotation: 'z2',
    defaultMask: 'pll-corn-dim',
  },
  {
    name: 'Sexy Move ×6',
    alg: "R U R' U' R U R' U' R U R' U' R U R' U' R U R' U' R U R' U'",
    defaultMask: 'full',
  },
];

const MASK_OPTIONS = MASK_PRESETS.map(p => ({ label: p.label, value: p.label }));

const THEME_LABELS: Partial<Record<ThemePresetName, string>> = { rubiks: 'Rubik', gan: 'GAN' };
const THEME_OPTIONS = (Object.keys(THEME_PRESETS) as ThemePresetName[])
  .sort()
  .map(key => ({ label: THEME_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1), value: key }));

export default function CubifyPage() {
  const playerRef = useRef<CubePlayerHandle>(null);
  const [caseIdx,   setCaseIdx]   = useState(0);
  const [playing,   setPlaying]   = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [mask,      setMask]      = useState(CASES[0].defaultMask);
  const [theme,     setTheme]     = useState<ThemePresetName>('speed');
  const [speed,     setSpeed]     = useState(1);

  const activeCase = CASES[caseIdx];

  const handleMove     = useCallback(({ index }: { index: number }) => setStepIndex(index), []);
  const handleComplete = useCallback(() => setPlaying(false), []);

  // Called by CubePlayerControls reset button — initiates the reset
  const handleResetButton = useCallback(() => {
    setPlaying(false);
    setStepIndex(0);
    playerRef.current?.reset();
  }, []);

  // Called by CubePlayer onReset event — player already reset, just sync state
  const handlePlayerReset = useCallback(() => {
    setPlaying(false);
    setStepIndex(0);
  }, []);

  const handleCaseChange = (idx: number) => {
    setPlaying(false);
    setStepIndex(0);
    setCaseIdx(idx);
    setMask(CASES[idx].defaultMask);
  };

  return (
    <CfopPageLayout pageTitle="Cubify" subtitle="Cubify Integration Harness">
      <section className="section">
        {/* Selectors */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          <div className="select">
            <select value={caseIdx} onChange={e => handleCaseChange(Number(e.target.value))}>
              {CASES.map((c, i) => <option key={i} value={i}>{c.name}</option>)}
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
          onCameraReset={() => playerRef.current?.resetCamera()}
          onSpeedChange={setSpeed}
          style={{ marginTop: 12 }}
        />
      </section>
    </CfopPageLayout>
  );
}
