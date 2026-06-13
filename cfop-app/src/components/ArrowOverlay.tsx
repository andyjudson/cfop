import './ArrowOverlay.css';
import type { Arrow } from '../data/bgrArrows';

interface ArrowOverlayProps {
  arrows: Arrow[];
}

function arcPath({ from, to, cp }: Arrow): string {
  if (cp) return `M ${from[0]} ${from[1]} Q ${cp[0]} ${cp[1]} ${to[0]} ${to[1]}`;
  return `M ${from[0]} ${from[1]} L ${to[0]} ${to[1]}`;
}

// Arrows are authored in the renderer's native 288-square cell grid
// (U-face cell centres at 75.5 / 144 / 212.5). The exported case PNGs are
// 288×224 with the cube scaled down and re-centred — the U-face measures
// 145px (centre 143.5,111.5) vs the 205px authoring square. This single
// affine transform maps authoring space onto the actual PNG cube:
//   scale 0.7056 (= 48.33 / 68.5 cell size), translate (41.9, 9.9).
// Measured from the PNG assets; identical across all 16 cases.
const CUBE_TRANSFORM = 'translate(41.9 9.9) scale(0.7056)';

export function ArrowOverlay({ arrows }: ArrowOverlayProps) {
  return (
    <svg
      className="arrow-overlay"
      viewBox="0 0 288 224"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L0,6 L6,3 z" fill="rgba(255,140,0,0.9)" />
        </marker>
      </defs>
      <g transform={CUBE_TRANSFORM}>
        {arrows.map((arrow, i) => (
          <path
            key={i}
            d={arcPath(arrow)}
            stroke="rgba(255,140,0,0.85)"
            strokeWidth={4}
            fill="none"
            markerEnd="url(#arrowhead)"
            markerStart={arrow.both ? 'url(#arrowhead)' : undefined}
            strokeLinecap="round"
          />
        ))}
      </g>
    </svg>
  );
}
