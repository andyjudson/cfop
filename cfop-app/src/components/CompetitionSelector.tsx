import type { Competition } from '../types/competition';
import { formatElapsedMs } from '../utils/timeFormat';
import './CompetitionSelector.css';

interface CompetitionSelectorProps {
  competitions: Competition[];
  selectedId: string;
  onSelect: (competition: Competition) => void;
  onCancel: () => void;
}

export function CompetitionSelector({ competitions, selectedId, onSelect, onCancel }: CompetitionSelectorProps) {
  return (
    <div className="competition-selector">
      <div className="competition-selector-header">
        <h3 className="title is-6">Choose Competition</h3>
        <button className="button is-light is-small" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <ul className="competition-list">
        {competitions.map((competition) => {
          const isSelected = competition.competition_id === selectedId;
          return (
            <li
              key={competition.competition_id}
              className={`competition-item${isSelected ? ' is-selected' : ''}`}
              onClick={() => onSelect(competition)}
            >
              <div className="competition-item-main">
                <span className="competition-item-name">{competition.competition_name}</span>
                <span className={`tier-badge tier-${competition.tier}`}>
                  {competition.tier === 'wr' ? 'WR' : 'Champ'}
                </span>
              </div>
              <div className="competition-item-times">
                <span className="competition-item-single">
                  {formatElapsedMs(competition.winner_single * 1000)}
                </span>
                {competition.winner_average !== null ? (
                  <span className="competition-item-avg">
                    avg {formatElapsedMs(competition.winner_average * 1000)}
                  </span>
                ) : (
                  <span className="competition-item-avg">avg —</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
