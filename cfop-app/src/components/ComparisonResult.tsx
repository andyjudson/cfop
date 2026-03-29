import type { ComparisonOutcome } from '../types/competition';
import { formatElapsedMs } from '../utils/timeFormat';
import './ComparisonResult.css';

interface ComparisonResultProps {
  outcome: ComparisonOutcome;
  onTryAgain: () => void;
  onChangeCompetition: () => void;
  onBackToStandard: () => void;
}

function fmtS(seconds: number): string {
  return formatElapsedMs(Math.round(seconds * 1000));
}

function fmtDelta(deltaMs: number): string {
  const sign = deltaMs < 0 ? '−' : '+';
  return `${sign}${formatElapsedMs(Math.abs(deltaMs))}`;
}

function shortfallText(singleDeltaMs: number, avgDeltaMs: number | null): string {
  if (avgDeltaMs !== null && avgDeltaMs > singleDeltaMs) {
    return `+${(avgDeltaMs / 1000).toFixed(2)}s behind on average`;
  }
  return `+${(singleDeltaMs / 1000).toFixed(2)}s behind on single`;
}

export function ComparisonResult({ outcome, onTryAgain, onChangeCompetition, onBackToStandard }: ComparisonResultProps) {
  const {
    userBestSingleMs,
    userAverageMs,
    winnerSingleS,
    winnerAverageS,
    wrSingleAtTimeS,
    wrAverageAtTimeS,
    beatSingle,
    beatAverage,
    competitionName,
    competitionYear,
    winnerName,
  } = outcome;

  const beatAny = beatSingle || beatAverage === true;

  const singleDeltaMs = userBestSingleMs - winnerSingleS * 1000;
  const avgDeltaMs =
    userAverageMs !== null && winnerAverageS !== null
      ? userAverageMs - winnerAverageS * 1000
      : null;

  const wrSingleDeltaMs = wrSingleAtTimeS !== null ? userBestSingleMs - wrSingleAtTimeS * 1000 : null;
  const wrAvgDeltaMs =
    wrAverageAtTimeS !== null && userAverageMs !== null ? userAverageMs - wrAverageAtTimeS * 1000 : null;

  return (
    <div className="comparison-result">
      <div className="comparison-header">
        <div className="comparison-event-name">{competitionName}</div>
        <div className="comparison-vs">vs {winnerName}</div>
      </div>

      <table className="comparison-table">
        <thead>
          <tr>
            <th></th>
            <th>You</th>
            <th>Target</th>
            <th>Delta</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="comparison-row-label">Single</td>
            <td className={`comparison-user-time${beatSingle ? ' is-beat' : ''}`}>
              {formatElapsedMs(userBestSingleMs)}
            </td>
            <td className="comparison-champ-time">{fmtS(winnerSingleS)}</td>
            <td className={`comparison-delta ${singleDeltaMs < 0 ? 'delta-ahead' : 'delta-behind'}`}>
              {fmtDelta(singleDeltaMs)}
            </td>
          </tr>
          {winnerAverageS !== null && (
            <tr>
              <td className="comparison-row-label">Average</td>
              <td className={`comparison-user-time${beatAverage === true ? ' is-beat' : ''}`}>
                {userAverageMs !== null ? formatElapsedMs(userAverageMs) : '—'}
              </td>
              <td className="comparison-champ-time">{fmtS(winnerAverageS)}</td>
              <td
                className={`comparison-delta ${
                  avgDeltaMs !== null && avgDeltaMs < 0 ? 'delta-ahead' : 'delta-behind'
                }`}
              >
                {avgDeltaMs !== null ? fmtDelta(avgDeltaMs) : '—'}
              </td>
            </tr>
          )}
          {wrSingleAtTimeS !== null && (
            <tr>
              <td className="comparison-row-label comparison-wr-label">WR single ({competitionYear})</td>
              <td className={`comparison-user-time${wrSingleDeltaMs !== null && wrSingleDeltaMs < 0 ? ' is-beat' : ''}`}>
                {formatElapsedMs(userBestSingleMs)}
              </td>
              <td className="comparison-wr-time">{fmtS(wrSingleAtTimeS)}</td>
              <td className={`comparison-delta ${wrSingleDeltaMs !== null && wrSingleDeltaMs < 0 ? 'delta-ahead' : 'delta-behind'}`}>
                {wrSingleDeltaMs !== null ? fmtDelta(wrSingleDeltaMs) : '—'}
              </td>
            </tr>
          )}
          {wrAverageAtTimeS !== null && (
            <tr>
              <td className="comparison-row-label comparison-wr-label">WR average ({competitionYear})</td>
              <td className={`comparison-user-time${wrAvgDeltaMs !== null && wrAvgDeltaMs < 0 ? ' is-beat' : ''}`}>
                {userAverageMs !== null ? formatElapsedMs(userAverageMs) : '—'}
              </td>
              <td className="comparison-wr-time">{fmtS(wrAverageAtTimeS)}</td>
              <td className={`comparison-delta ${wrAvgDeltaMs !== null && wrAvgDeltaMs < 0 ? 'delta-ahead' : 'delta-behind'}`}>
                {wrAvgDeltaMs !== null ? fmtDelta(wrAvgDeltaMs) : '—'}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={`comparison-verdict ${beatAny ? 'verdict-beat' : 'verdict-miss'}`}>
        {beatAny ? 'You beat the champion!' : shortfallText(singleDeltaMs, avgDeltaMs)}
      </div>

      <div className="comparison-actions">
        <button className="button is-primary is-small" onClick={onTryAgain}>
          Try Again
        </button>
        <button className="button is-link is-light is-small" onClick={onChangeCompetition}>
          Change Competition
        </button>
        <button className="button is-light is-small" onClick={onBackToStandard}>
          Back to Standard
        </button>
      </div>
    </div>
  );
}
