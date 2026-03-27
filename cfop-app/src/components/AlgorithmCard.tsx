import { useState } from 'react';
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
  onImageInteraction?: (algorithmId: string) => void;
}

export function AlgorithmCard({ 
  algorithm, 
  variant = 'standard',
  onImageInteraction 
}: AlgorithmCardProps) {
  const [hoveredAlg, setHoveredAlg] = useState<string | null>(null);
  const [tooltipLeft, setTooltipLeft] = useState(false);

  const handleMouseEnter = (algId: string, e: React.MouseEvent<HTMLImageElement>) => {
    setHoveredAlg(algId);
    const imgElement = e.currentTarget;
    const rect = imgElement.getBoundingClientRect();
    const spaceOnRight = window.innerWidth - rect.right;
    setTooltipLeft(spaceOnRight < 320);
    onImageInteraction?.(algId);
  };

  const handleMouseLeave = () => {
    setHoveredAlg(null);
  };

  const handleClick = (algId: string, e: React.MouseEvent<HTMLImageElement>) => {
    if (hoveredAlg === algId) {
      setHoveredAlg(null);
    } else {
      handleMouseEnter(algId, e);
    }
  };

  const cardClassName = variant === 'compact' 
    ? 'card algo-card algo-card-compact' 
    : 'card algo-card';

  return (
    <div className={cardClassName}>
      <div className="card-content has-text-centered">
        <div className="image-container">
          <img 
            src={algorithm.image} 
            alt={algorithm.name}
            onMouseEnter={(e) => handleMouseEnter(algorithm.id, e)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => handleClick(algorithm.id, e)}
          />
          {hoveredAlg === algorithm.id && algorithm.notes && (
            <div className={`tooltip ${tooltipLeft ? 'tooltip-left' : ''}`}>
              {algorithm.notes}
            </div>
          )}
        </div>
        <h3 className="title is-5 mt-3">{algorithm.name}</h3>
        <div className="content">
          <code className="notation">{algorithm.notation}</code>
        </div>
      </div>
    </div>
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
        {moveHint && <p className="intuitive-move-hint mt-2">{moveHint}</p>}
      </div>
    </div>
  );
}
