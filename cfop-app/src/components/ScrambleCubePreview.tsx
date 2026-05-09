import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import { CubeState } from '@andyjudson/cubify-react';
import './ScrambleCubePreview.css';

interface ScrambleCubePreviewProps {
  scramble: string;
  expanded: boolean;
  onToggleExpand: () => void;
}

export function ScrambleCubePreview({ scramble, expanded, onToggleExpand }: ScrambleCubePreviewProps) {
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
      <div className={`scramble-cube-canvas${expanded ? ' scramble-cube-canvas--expanded' : ''}`}>
        <CubeState alg={scramble} theme="speed-dark" style={{ width: '100%', height: '100%' }} />
      </div>
      <span className="scramble-cube-hint">
        {expanded ? <MdFullscreenExit size={14} /> : <MdFullscreen size={14} />}
      </span>
    </div>
  );
}
