import { useEffect, useRef } from 'react';
import type { CfopAlgorithm } from './AlgorithmCard';
import './CaseCarousel.css';

interface CaseCarouselProps {
  algorithms: CfopAlgorithm[];
  activeId: string;
  onSelect: (alg: CfopAlgorithm) => void;
}

export function CaseCarousel({ algorithms, activeId, onSelect }: CaseCarouselProps) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeId]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const idx = algorithms.findIndex(a => a.id === activeId);
      if (idx === -1) return;
      e.preventDefault();
      const next = e.key === 'ArrowRight'
        ? algorithms[Math.min(idx + 1, algorithms.length - 1)]
        : algorithms[Math.max(idx - 1, 0)];
      if (next && next.id !== activeId) onSelect(next);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [algorithms, activeId, onSelect]);

  return (
    <div className="case-carousel">
      {algorithms.map((alg) => {
        const isActive = alg.id === activeId;
        return (
          <button
            key={alg.id}
            ref={isActive ? activeRef : null}
            className={`case-carousel__item${isActive ? ' case-carousel__item--active' : ''}`}
            onClick={() => onSelect(alg)}
            aria-label={alg.name}
            aria-pressed={isActive}
          >
            <img
              src={alg.image}
              alt={alg.name}
              loading="lazy"
              draggable={false}
            />
          </button>
        );
      })}
    </div>
  );
}
