import { useEffect } from 'react';
import { MdStars } from 'react-icons/md';
import 'bulma/css/bulma.min.css';
import './AlgorithmCard.css';

export interface CfopAlgorithm {
  id: string;
  name: string;
  notation: string;
  image: string;
  notes?: string;
  method?: string;
  group?: string;
}

interface AlgorithmCardProps {
  algorithm: CfopAlgorithm;
  variant?: 'standard' | 'compact';
  isEssential?: boolean;
  onShowNotes?: (algorithm: CfopAlgorithm) => void;
}

export function AlgorithmCard({
  algorithm,
  variant = 'standard',
  isEssential = false,
  onShowNotes
}: AlgorithmCardProps) {
  const cardClassName = variant === 'compact'
    ? 'card algo-card algo-card-compact'
    : 'card algo-card';

  return (
    <div className={cardClassName}>
      {isEssential && (
        <div className="essential-badge" aria-label="Essential algorithm">
          <MdStars size={18} />
        </div>
      )}
      <div className="card-content has-text-centered">
        <div className="image-container">
          <img
            src={algorithm.image}
            alt={algorithm.name}
            onClick={() => algorithm.notes && onShowNotes?.(algorithm)}
            style={{ cursor: algorithm.notes && onShowNotes ? 'pointer' : 'default' }}
          />
        </div>
        <h3 className="title is-5 mt-3">{algorithm.name}</h3>
        <div className="content">
          <code className="notation">{algorithm.notation}</code>
        </div>
      </div>
    </div>
  );
}

interface AlgorithmNotesSheetProps {
  algorithm: CfopAlgorithm | null;
  onClose: () => void;
}

export function AlgorithmNotesSheet({ algorithm, onClose }: AlgorithmNotesSheetProps) {
  useEffect(() => {
    if (!algorithm) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [algorithm, onClose]);

  return (
    <>
      <div
        className={`notes-sheet-backdrop${algorithm ? ' is-visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`notes-sheet${algorithm ? ' is-open' : ''}`}
        role="dialog"
        aria-label={algorithm?.name ?? 'Algorithm notes'}
      >
        <div className="notes-sheet-header">
          <span className="notes-sheet-title">{algorithm?.name}</span>
          <button className="notes-sheet-close" onClick={onClose} aria-label="Close notes">×</button>
        </div>
        {algorithm?.notes && (
          <p className="notes-sheet-body">{algorithm.notes}</p>
        )}
      </div>
    </>
  );
}

interface IntuitiveCaseCardProps {
  label: string;
  image: string;
  alt: string;
  moveHint?: string;
}

export function IntuitiveCaseCard({ label, image, alt, moveHint }: IntuitiveCaseCardProps) {
  return (
    <div className="card intuitive-case-card">
      <div className="card-content has-text-centered">
        <h6 className="intuitive-case-label">{label}</h6>
        <img src={image} alt={alt} className="intuitive-case-image" loading="lazy" />
        {moveHint && <code className="notation intuitive-move-hint mt-2">{moveHint}</code>}
      </div>
    </div>
  );
}
