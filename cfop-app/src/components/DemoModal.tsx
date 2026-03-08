import { useState, useEffect, useMemo, useRef } from 'react';
import { Alg, Move } from 'cubing/alg';
import { TwistyPlayer } from 'cubing/twisty';
import { MdPlayArrow, MdPause, MdReplay, MdAdd, MdRemove } from 'react-icons/md';
import './DemoModal.css';

interface CfopAlgorithm {
  id: string;
  name: string;
  notation: string;
  method: string;
  group: string;
  image: string;
  notes: string;
}

interface DemoModalProps {
  algorithm: CfopAlgorithm;
  onClose: () => void;
}

const getMask = (method?: string, group?: string): string => {
  if (method === 'f2l') {
    return 'EDGES:----IIII----,CORNERS:----IIII,CENTERS:------';
  }
  if (method === 'oll' && group === 'edge') {
    return 'EDGES:----OOOO----,CORNERS:----IIII,CENTERS:------';
  }
  if (method === 'oll' && group === 'corner') {
    return 'EDGES:----OOOO----,CORNERS:----OOOO,CENTERS:------';
  }
  if (method === 'pll' && group === 'corner') {
    return 'EDGES:----OOOO----,CORNERS:--------,CENTERS:------';
  }
  return 'EDGES:------------,CORNERS:--------,CENTERS:------';
};

const parseAlgorithmMoves = (notation: string): string[] => {
  try {
    const alg = Alg.fromString(notation);
    const parsed: string[] = [];

    for (const leaf of alg.experimentalLeafMoves()) {
      if (leaf instanceof Move) {
        parsed.push(leaf.toString());
      }
    }

    if (parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Fallback below.
  }

  return notation
    .replace(/[()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
};

export function DemoModal({ algorithm, onClose }: DemoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [speed, setSpeed] = useState(1);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const twistyRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<TwistyPlayer | null>(null);

  const mask = useMemo(
    () => getMask(algorithm.method?.toLowerCase(), algorithm.group?.toLowerCase()),
    [algorithm.method, algorithm.group],
  );

  const moves = useMemo(() => parseAlgorithmMoves(algorithm.notation), [algorithm.notation]);

  useEffect(() => {
    if (!twistyRef.current) {
      return;
    }
    let mounted = true;
    let hasRetried = false;
    let retryTimer: number | null = null;
    let player: TwistyPlayer | null = null;
    let onMoveInfo: ((info: { patternIndex: number }) => void) | null = null;
    let onTimelineInfo: ((info: { playing: boolean; atStart: boolean }) => void) | null = null;

    const cleanupPlayer = () => {
      if (!player) {
        return;
      }

      if (onMoveInfo) {
        player.experimentalModel.currentMoveInfo.removeFreshListener(onMoveInfo);
      }
      if (onTimelineInfo) {
        player.experimentalModel.coarseTimelineInfo.removeFreshListener(onTimelineInfo);
      }

      if (twistyRef.current?.contains(player)) {
        twistyRef.current.removeChild(player);
      }

      if (playerRef.current === player) {
        playerRef.current = null;
      }

      player = null;
    };

    const initPlayer = () => {
      if (!mounted || !twistyRef.current) {
        return;
      }

      try {
        setPlayerError(null);

        const nextPlayer = new TwistyPlayer({
          puzzle: '3x3x3',
          alg: algorithm.notation,
          visualization: 'PG3D',
          background: 'none',
          hintFacelets: 'none',
          controlPanel: 'none',
          tempoScale: speed,
          experimentalSetupAlg: 'z2',
          experimentalSetupAnchor: 'end',
          experimentalStickeringMaskOrbits: mask,
          experimentalDragInput: 'none',
        });

        twistyRef.current.innerHTML = '';
        twistyRef.current.appendChild(nextPlayer);
        playerRef.current = nextPlayer;
        player = nextPlayer;
        setCurrentMoveIndex(-1);
        setIsPlaying(false);

        onMoveInfo = (info: { patternIndex: number }) => {
          const nextIndex = Math.min(Math.max(info.patternIndex, -1), moves.length - 1);
          setCurrentMoveIndex(nextIndex);
        };

        onTimelineInfo = (info: { playing: boolean; atStart: boolean }) => {
          setIsPlaying(info.playing);
          if (info.atStart) {
            setCurrentMoveIndex(-1);
          }
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

        setPlayerError('Could not load cube visualization. Please close and reopen Demo.');
        console.error('TwistyPlayer failed to initialize:', error);
      }
    };

    initPlayer();

    return () => {
      mounted = false;
      if (retryTimer !== null) {
        window.clearTimeout(retryTimer);
      }
      cleanupPlayer();
    };
  }, [algorithm.id, algorithm.notation, moves.length, mask]);

  // Update tempo when speed changes
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.tempoScale = speed;
    }
  }, [speed]);

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleRewind = () => {
    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current.jumpToStart();
      setCurrentMoveIndex(-1);
      setIsPlaying(false);
    }
  };

  const handleSpeedUp = () => {
    setSpeed(prev => Math.min(prev + 0.5, 3));
  };

  const handleSlowDown = () => {
    setSpeed(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      
      if (e.repeat) {
        return;
      }

      // Toggle play/pause on Space key
      if (isPlaying) {
        handlePause();
      } else {
        handlePlay();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, onClose]);

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="title is-4">{algorithm.name}</h2>
          <button className="delete" onClick={onClose} aria-label="close"></button>
        </div>

        <div className="twisty-container" ref={twistyRef}></div>
        {playerError && <p className="has-text-danger has-text-centered mt-2">{playerError}</p>}

        <div className="controls-panel">
          <div className="control-buttons">
            <button 
              className="button is-light" 
              onClick={handleRewind}
              title="Rewind"
            >
              <MdReplay size={24} />
            </button>
            
            {isPlaying ? (
              <button 
                className="button is-primary" 
                onClick={handlePause}
                title="Pause"
              >
                <MdPause size={24} />
              </button>
            ) : (
              <button 
                className="button is-primary" 
                onClick={handlePlay}
                title="Play"
              >
                <MdPlayArrow size={24} />
              </button>
            )}

            <button 
              className="button is-light" 
              onClick={handleSlowDown}
              disabled={speed <= 0.5}
              title="Slow down"
            >
              <MdRemove size={24} />
            </button>

            <button 
              className="button is-light" 
              onClick={handleSpeedUp}
              disabled={speed >= 3}
              title="Speed up"
            >
              <MdAdd size={24} />
            </button>

            <span className="speed-indicator">×{speed.toFixed(1)}</span>
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
      </div>
    </div>
  );
}
