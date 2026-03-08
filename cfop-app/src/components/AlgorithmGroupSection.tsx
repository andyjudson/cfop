import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import 'bulma/css/bulma.min.css';

interface AlgorithmGroupSectionProps {
  title: string;
  groupId: string;
  children: ReactNode;
  initialExpanded?: boolean;
  onToggle?: (groupId: string, isExpanded: boolean) => void;
}

const toTitleCase = (value: string) =>
  value
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

export function AlgorithmGroupSection({
  title,
  groupId,
  children,
  initialExpanded = false,
  onToggle,
}: AlgorithmGroupSectionProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  useEffect(() => {
    setIsExpanded(initialExpanded);
  }, [initialExpanded]);

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggle?.(groupId, newExpanded);
  };

  const displayTitle = toTitleCase(title);

  return (
    <section className="section cfop-group-section" data-group-id={groupId}>
      <div 
        className="section-header is-flex is-align-items-center is-justify-content-space-between"
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        aria-expanded={isExpanded}
        aria-controls={`section-content-${groupId}`}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title} section`}
      >
        <h2 className="title is-5">{displayTitle}</h2>
        <span className="icon is-medium">
          {isExpanded ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 13L5 8h10l-5 5z"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 10L8 5v10l5-5z"/>
            </svg>
          )}
        </span>
      </div>
      
      {isExpanded && (
        <div id={`section-content-${groupId}`}>
          {children}
        </div>
      )}
    </section>
  );
}
