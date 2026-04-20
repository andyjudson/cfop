import { useState, useEffect, useMemo, useRef } from 'react';
import { Alg, Move } from 'cubing/alg';
import { TwistyPlayer } from 'cubing/twisty';
import { MdPlayArrow, MdPause, MdReplay, MdAdd, MdRemove, MdFilterCenterFocus } from 'react-icons/md';
import type { CfopAlgorithm } from './AlgorithmCard';
import { CaseCarousel } from './CaseCarousel';
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


const getMask = (method?: string, mask?: string): string => {
  if (method === 'oll') {
    return mask === 'edge'
      ? 'EDGES:----OOOO----,CORNERS:----IIII,CENTERS:------'  // cross not yet formed: hide top corners
      : 'EDGES:----OOOO----,CORNERS:----OOOO,CENTERS:------'; // cross formed: show top corners
  }
  if (method === 'pll') {
    return mask === 'corner'
      ? 'EDGES:----OOOO----,CORNERS:--------,CENTERS:------'  // corner-swap PLL: highlight edges as reference
      : 'EDGES:------------,CORNERS:--------,CENTERS:------'; // edge-swap PLL: show all stickers
  }
  return 'EDGES:------------,CORNERS:--------,CENTERS:------';
};

const parseAlgorithmMoves = (notation: string): string[] => {
  try {
    const alg = Alg.fromString(notation);
    const parsed: string[] = [];
    for (const leaf of alg.experimentalLeafMoves()) {
      if (leaf instanceof Move) parsed.push(leaf.toString());
    }
    if (parsed.length > 0) return parsed;
  } catch {
    // fallback below
  }
  return notation.replace(/[()]/g, ' ').split(/\s+/).filter(Boolean);
};

// ── Component ─────────────────────────────────────────────────────────────────

export function VisualizerModal({ onClose }: VisualizerModalProps) {
  const [ollData, setOllData] = useState<CfopAlgorithm[]>([]);
  const [pllData, setPllData] = useState<CfopAlgorithm[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [selectedSet, setSelectedSet] = useState<'OLL' | 'PLL'>('PLL');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [currentAlg, setCurrentAlg] = useState<CfopAlgorithm | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const SPEED_STEPS = [0.5, 1, 1.5, 2, 3, 4, 6];
  const [speedIndex, setSpeedIndex] = useState(1); // default ×1
  const speed = SPEED_STEPS[speedIndex];
  const [playerError, setPlayerError] = useState<string | null>(null);

  const twistyRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<TwistyPlayer | null>(null);

  // Load OLL and PLL data on mount, auto-shuffle OLL as default
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
    () => (currentAlg ? parseAlgorithmMoves(currentAlg.notation) : []),
    [currentAlg],
  );

  const mask = useMemo(
    () => getMask(currentAlg?.method?.toLowerCase(), currentAlg?.mask),
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

  // TwistyPlayer lifecycle — re-init when currentAlg changes
  useEffect(() => {
    if (!twistyRef.current || !currentAlg) return;

    let mounted = true;
    let hasRetried = false;
    let retryTimer: number | null = null;
    let player: TwistyPlayer | null = null;
    let onMoveInfo: ((info: { patternIndex: number }) => void) | null = null;
    let onTimelineInfo: ((info: { playing: boolean; atStart: boolean }) => void) | null = null;

    const cleanupPlayer = () => {
      if (!player) return;
      if (onMoveInfo) player.experimentalModel.currentMoveInfo.removeFreshListener(onMoveInfo);
      if (onTimelineInfo) player.experimentalModel.coarseTimelineInfo.removeFreshListener(onTimelineInfo);
      if (twistyRef.current?.contains(player)) twistyRef.current.removeChild(player);
      if (playerRef.current === player) playerRef.current = null;
      player = null;
    };

    const initPlayer = () => {
      if (!mounted || !twistyRef.current) return;
      try {
        setPlayerError(null);
        const nextPlayer = new TwistyPlayer({
          puzzle: '3x3x3',
          alg: currentAlg.notation,
          visualization: 'PG3D',
          background: 'none',
          hintFacelets: 'none',
          controlPanel: 'none',
          tempoScale: speed,
          experimentalSetupAlg: currentAlg.setup ?? '',
          experimentalSetupAnchor: 'end',
          experimentalStickeringMaskOrbits: mask,
          experimentalDragInput: 'auto',
        });

        twistyRef.current.innerHTML = '';
        twistyRef.current.appendChild(nextPlayer);
        playerRef.current = nextPlayer;
        player = nextPlayer;
        setCurrentMoveIndex(-1);
        setIsPlaying(false);

        onMoveInfo = (info: { patternIndex: number }) => {
          setCurrentMoveIndex(Math.min(Math.max(info.patternIndex, -1), moves.length - 1));
        };
        onTimelineInfo = (info: { playing: boolean; atStart: boolean }) => {
          setIsPlaying(info.playing);
          if (info.atStart) setCurrentMoveIndex(-1);
        };

        nextPlayer.experimentalModel.currentMoveInfo.addFreshListener(onMoveInfo);
        nextPlayer.experimentalModel.coarseTimelineInfo.addFreshListener(onTimelineInfo);
      } catch (error) {
        cleanupPlayer();
        if (!hasRetried) {
          hasRetried = true;
          retryTimer = window.setTimeout(initPlayer, 150);
          return;
        }
        setPlayerError('Could not load cube visualization. Please close and reopen.');
        console.error('TwistyPlayer failed to initialize:', error);
      }
    };

    initPlayer();

    return () => {
      mounted = false;
      if (retryTimer !== null) window.clearTimeout(retryTimer);
      cleanupPlayer();
    };
  }, [currentAlg?.id, currentAlg?.notation, mask]);

  useEffect(() => {
    if (playerRef.current) playerRef.current.tempoScale = speed;
  }, [speed]);

  const handlePlay = () => { playerRef.current?.play(); setIsPlaying(true); };
  const handlePause = () => { playerRef.current?.pause(); setIsPlaying(false); };
  const handleRewind = () => {
    playerRef.current?.pause();
    playerRef.current?.jumpToStart();
    setCurrentMoveIndex(-1);
    setIsPlaying(false);
  };

  const handleResetView = () => {
    const player = playerRef.current;
    if (!player) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (player.experimentalModel as any).twistySceneModel.orbitCoordinatesRequest.set('auto');
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if ((e.code === 'Space' || e.key === ' ') && !e.repeat) {
        e.preventDefault();
        isPlaying ? handlePause() : handlePlay();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isPlaying, onClose]);

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

        <div className="twisty-container" ref={twistyRef} />
        {playerError && (
          <p className="has-text-danger has-text-centered mt-2">{playerError}</p>
        )}

        {loadState === 'ready' && (
          <>
            <div className="controls-panel">
              <div className="control-buttons">
                <button className="button is-light" onClick={handleRewind} title="Rewind">
                  <MdReplay size={24} />
                </button>
                {isPlaying ? (
                  <button className="button is-primary" onClick={handlePause} title="Pause">
                    <MdPause size={24} />
                  </button>
                ) : (
                  <button className="button is-primary" onClick={handlePlay} title="Play">
                    <MdPlayArrow size={24} />
                  </button>
                )}
                <button
                  className="button is-light"
                  onClick={() => setSpeedIndex(i => Math.max(i - 1, 0))}
                  disabled={speedIndex === 0}
                  title="Slow down"
                >
                  <MdRemove size={24} />
                </button>
                <button
                  className="button is-light"
                  onClick={() => setSpeedIndex(i => Math.min(i + 1, SPEED_STEPS.length - 1))}
                  disabled={speedIndex === SPEED_STEPS.length - 1}
                  title="Speed up"
                >
                  <MdAdd size={24} />
                </button>
                <span className="speed-indicator">×{speed.toFixed(1)}</span>
                <button
                  className="button is-light"
                  onClick={handleResetView}
                  title="Reset view"
                >
                  <MdFilterCenterFocus size={24} />
                </button>
              </div>
            </div>

            <div className="algorithm-display">
              {moves.map((move, index) => (
                <span
                  key={index}
                  className={`move ${index === currentMoveIndex ? 'active' : ''} ${index < currentMoveIndex ? 'completed' : ''}`}
                >
                  {move}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
