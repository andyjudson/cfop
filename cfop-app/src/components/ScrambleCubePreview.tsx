import { useEffect, useRef } from 'react';
import { TwistyPlayer } from 'cubing/twisty';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import './ScrambleCubePreview.css';

interface ScrambleCubePreviewProps {
  scramble: string;
  expanded: boolean;
  onToggleExpand: () => void;
}

export function ScrambleCubePreview({ scramble, expanded, onToggleExpand }: ScrambleCubePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<TwistyPlayer | null>(null);

  useEffect(() => {
    if (!containerRef.current || !scramble) return;

    const size = expanded ? 200 : 120;
    const container = containerRef.current;

    const player = new TwistyPlayer({
      puzzle: '3x3x3',
      alg: scramble,
      visualization: 'PG3D',
      background: 'none',
      hintFacelets: 'none',
      controlPanel: 'none',
    });
    player.style.width = `${size}px`;
    player.style.height = `${size}px`;

    container.innerHTML = '';
    container.appendChild(player);
    playerRef.current = player;

    return () => {
      player.remove();
      playerRef.current = null;
    };
  }, [scramble, expanded]);

  const size = expanded ? 200 : 120;

  return (
    <div
      className={`scramble-cube-panel${expanded ? ' scramble-cube-panel--expanded' : ''}`}
      onClick={onToggleExpand}
      role="button"
      title={expanded ? 'Collapse cube' : 'Expand cube'}
      aria-label={expanded ? 'Collapse cube view' : 'Expand cube view'}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggleExpand(); } }}
    >
      <div
        className="scramble-cube-canvas"
        ref={containerRef}
        style={{ width: size, height: size }}
      />
      <span className="scramble-cube-hint">
        {expanded ? <MdFullscreenExit size={14} /> : <MdFullscreen size={14} />}
      </span>
    </div>
  );
}
