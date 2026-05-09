import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { CubePlayer, CubePlayerControls, CubeMoveTape } from '@andyjudson/cubify-react';
import type { CubePlayerHandle } from '@andyjudson/cubify-react';
import { AlgParser, CubeState } from '@andyjudson/cubify';
import type { CfopAlgorithm } from './AlgorithmCard';
import { CaseCarousel } from './CaseCarousel';
import '../cubify.css';
import './VisualizerModal.css';

// ── Types ─────────────────────────────────────────────────────────────────────

type LoadState = 'loading' | 'ready' | 'error';

interface VisualizerModalProps {
  onClose: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fetchSet(set: 'OLL' | 'PLL'): Promise<CfopAlgorithm[]> {
  const file = set === 'OLL' ? 'algs-cfop-oll.json' : 'algs-cfop-pll.json';
  const res = await fetch(import.meta.env.BASE_URL + 'data/' + file);
  if (!res.ok) throw new Error(`Failed to load ${set} data`);
  const text = await res.text();
  if (text.trimStart().startsWith('<')) throw new Error(`${set} data file not found`);
  return JSON.parse(text) as CfopAlgorithm[];
}

function getGroups(algorithms: CfopAlgorithm[]): string[] {
  const unique = [...new Set(algorithms.map(a => a.group ?? ''))].filter(Boolean).sort();
  return ['all', ...unique];
}

const getMask = (method?: string): string => {
  if (method === 'oll') return 'oll-face-dim';
  if (method === 'pll') return 'pll-face-dim';
  return 'full';
};

// ── Component ─────────────────────────────────────────────────────────────────

export function VisualizerModal({ onClose }: VisualizerModalProps) {
  const [ollData, setOllData] = useState<CfopAlgorithm[]>([]);
  const [pllData, setPllData] = useState<CfopAlgorithm[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [selectedSet, setSelectedSet] = useState<'OLL' | 'PLL'>('PLL');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [currentAlg, setCurrentAlg] = useState<CfopAlgorithm | null>(null);

  const [playing,     setPlaying]     = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed,       setSpeed]       = useState(1);
  const playerRef      = useRef<CubePlayerHandle>(null);
  const pendingPlayRef = useRef(false);

  // Load OLL and PLL data on mount
  useEffect(() => {
    Promise.all([fetchSet('OLL'), fetchSet('PLL')])
      .then(([oll, pll]) => {
        setOllData(oll);
        setPllData(pll);
        setLoadState('ready');
        setCurrentAlg(pll[0] ?? null);
      })
      .catch(() => setLoadState('error'));
  }, []);

  const activeData = useMemo(
    () => (selectedSet === 'OLL' ? ollData : pllData),
    [selectedSet, ollData, pllData],
  );

  const availableGroups = useMemo(() => getGroups(activeData), [activeData]);

  const shufflePool = useMemo(
    () => selectedGroup === 'all' ? activeData : activeData.filter(a => a.group === selectedGroup),
    [activeData, selectedGroup],
  );

  const moves = useMemo(
    () => (currentAlg ? AlgParser.parse(currentAlg.notation) : []),
    [currentAlg],
  );

  const mask = useMemo(
    () => getMask(currentAlg?.method?.toLowerCase()),
    [currentAlg?.method],
  );

  const setup = useMemo(
    () => (currentAlg ? CubeState.setupFromAlg(currentAlg.notation, currentAlg.setup) : ''),
    [currentAlg],
  );

  const handleSetChange = (set: 'OLL' | 'PLL') => {
    setSelectedSet(set);
    setSelectedGroup('all');
    const data = set === 'OLL' ? ollData : pllData;
    setCurrentAlg(data[0] ?? null);
  };

  const handleGroupChange = (group: string) => {
    setSelectedGroup(group);
    const pool = group === 'all' ? activeData : activeData.filter(a => a.group === group);
    setCurrentAlg(pool[0] ?? null);
  };

  // Reset playback state when algorithm changes
  useEffect(() => {
    pendingPlayRef.current = false;
    setPlaying(false);
    setCurrentStep(0);
  }, [currentAlg?.id]);

  const handleMove = useCallback(({ index }: { index: number }) => {
    setCurrentStep(index);
  }, []);

  const handleComplete = useCallback(() => setPlaying(false), []);

  // Called by CubePlayer onReset — player already reset, sync state
  const handlePlayerReset = useCallback(() => {
    setCurrentStep(0);
    if (pendingPlayRef.current) {
      pendingPlayRef.current = false;
      setTimeout(() => setPlaying(true), 300);
    } else {
      setPlaying(false);
    }
  }, []);

  const handlePlayToggle = useCallback(() => {
    if (!playing && currentStep >= moves.length) {
      // At end — reset then auto-play
      pendingPlayRef.current = true;
      setCurrentStep(0);
      playerRef.current?.reset();
    } else {
      setPlaying(p => !p);
    }
  }, [playing, currentStep, moves.length]);

  const handleStepForward = useCallback(() => {
    playerRef.current?.stepForward();
  }, []);

  const handleStepBackward = useCallback(() => {
    playerRef.current?.stepBackward();
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if ((e.code === 'Space' || e.key === ' ') && !e.repeat) {
        e.preventDefault();
        handlePlayToggle();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose, handlePlayToggle]);

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">

        <div className="modal-header">
          <div className="visualizer-header-text">
            <h2 className="title is-4">
              {loadState === 'loading' ? 'Loading…' : (currentAlg?.name ?? '—')}
            </h2>
            {currentAlg?.group && (
              <p className="visualizer-group-label">
                {selectedSet} · {currentAlg.group}{currentAlg.prob ? ` · ${currentAlg.prob}` : ''}
              </p>
            )}
          </div>
          <button className="delete" onClick={onClose} aria-label="close" />
        </div>

        {loadState === 'ready' && (
          <>
            <div className="visualizer-nav-toggle">
              <div className="select">
                <select
                  value={selectedSet}
                  onChange={e => handleSetChange(e.target.value as 'OLL' | 'PLL')}
                  aria-label="Algorithm set"
                >
                  <option value="OLL">OLL (57)</option>
                  <option value="PLL">PLL (21)</option>
                </select>
              </div>
              <div className="select">
                <select
                  value={selectedGroup}
                  onChange={e => handleGroupChange(e.target.value)}
                  aria-label="Algorithm group"
                >
                  {availableGroups.map(g => (
                    <option key={g} value={g}>{g === 'all' ? 'All groups' : g}</option>
                  ))}
                </select>
              </div>
            </div>

            <CaseCarousel
              algorithms={shufflePool}
              activeId={currentAlg?.id ?? ''}
              onSelect={(alg) => setCurrentAlg(alg)}
            />
          </>
        )}

        {loadState === 'error' && (
          <p className="has-text-danger has-text-centered mt-3">Algorithm data unavailable.</p>
        )}

        <div className="cube-player-container">
          {currentAlg && (
            <CubePlayer
              ref={playerRef}
              alg={currentAlg.notation}
              setup={setup}
              stickering={mask}
              theme="speed-dark"
              playing={playing}
              speed={speed}
              onMove={handleMove}
              onComplete={handleComplete}
              onReset={handlePlayerReset}
              style={{ width: '100%', height: '100%' }}
            />
          )}
        </div>

        {loadState === 'ready' && (
          <>
            <CubeMoveTape
              moves={moves}
              stepIndex={currentStep}
              style={{ marginBottom: 12 }}
            />

            <div className="controls-panel">
              <CubePlayerControls
                playing={playing}
                stepIndex={currentStep}
                moveCount={moves.length}
                onPlayToggle={handlePlayToggle}
                onReset={() => { pendingPlayRef.current = false; setPlaying(false); setCurrentStep(0); playerRef.current?.reset(); }}
                onStepBackward={handleStepBackward}
                onStepForward={handleStepForward}
                onCameraReset={() => playerRef.current?.resetCamera()}
              />
              <div className="cubify-speed-row">
                <button
                  className="cubify-speed-btn"
                  onClick={() => setSpeed(s => Math.round(Math.min(3, Math.max(0.5, s - 0.5)) / 0.5) * 0.5)}
                  disabled={speed <= 0.5}
                  title="Slower"
                >−</button>
                <span className="cubify-speed-label">×{speed.toFixed(1)}</span>
                <button
                  className="cubify-speed-btn"
                  onClick={() => setSpeed(s => Math.round(Math.min(3, Math.max(0.5, s + 0.5)) / 0.5) * 0.5)}
                  disabled={speed >= 3}
                  title="Faster"
                >+</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
