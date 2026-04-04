import { useCallback, useEffect, useRef, useState } from 'react';
import { MdPlayArrow, MdStop, MdShuffle, MdHistory, MdChangeCircle, MdEmojiEvents, MdGridOn } from 'react-icons/md';
import { useSolveTimer } from '../hooks/useSolveTimer';
import { useSolveStats } from '../hooks/useSolveStats';
import type { ScrambleSource, ScrambleState } from '../types/practice';
import type { PracticeMode, Competition, CompetitiveSession, ComparisonOutcome } from '../types/competition';
import { generateRandom333Scramble } from '../utils/scramble';
import { loadCompetitions, pickRandomGroup } from '../utils/competitionData';
import { formatElapsedMs } from '../utils/timeFormat';
import { ComparisonResult } from './ComparisonResult';
import { CompetitionSelector } from './CompetitionSelector';
import { ScrambleCubePreview } from './ScrambleCubePreview';
import './PracticeSessionModal.css';

interface PracticeSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function computeOutcome(session: CompetitiveSession): ComparisonOutcome {
  const { competition, solveTimesMs } = session;
  const userBestSingleMs = Math.min(...solveTimesMs);
  const userAverageMs =
    solveTimesMs.length > 0
      ? solveTimesMs.reduce((a, b) => a + b, 0) / solveTimesMs.length
      : null;
  const beatSingle = userBestSingleMs < competition.winner_single * 1000;
  let beatAverage: boolean | null = null;
  if (competition.winner_average !== null && userAverageMs !== null) {
    beatAverage = userAverageMs < competition.winner_average * 1000;
  }
  return {
    userBestSingleMs,
    userAverageMs,
    winnerSingleS: competition.winner_single,
    winnerAverageS: competition.winner_average,
    wrSingleAtTimeS: competition.wr_single_at_time ?? null,
    wrAverageAtTimeS: competition.wr_average_at_time ?? null,
    beatSingle,
    beatAverage,
    competitionName: competition.competition_name,
    competitionYear: competition.year,
    winnerName: competition.winner_name,
  };
}

export function PracticeSessionModal({ isOpen, onClose }: PracticeSessionModalProps) {
  // Standard mode state
  const [scramble, setScramble] = useState<ScrambleState | null>(null);
  const [isScrambleLoading, setIsScrambleLoading] = useState(false);
  const [scrambleError, setScrambleError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const { timer, start, stop, reset, canStart, canStop } = useSolveTimer();
  const { stats, saveSolve, resetStats } = useSolveStats();

  // Competitive mode state
  const [mode, setMode] = useState<PracticeMode>('standard');
  const [competitiveSession, setCompetitiveSession] = useState<CompetitiveSession | null>(null);
  const [compOutcome, setCompOutcome] = useState<ComparisonOutcome | null>(null);
  const [showSelector, setShowSelector] = useState(false);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [cubeExpanded, setCubeExpanded] = useState(false);

  const loadScramble = useCallback(async (source: ScrambleSource) => {
    const requestId = ++requestIdRef.current;
    setIsScrambleLoading(true);
    setScrambleError(null);
    try {
      const nextScramble = await generateRandom333Scramble(source);
      if (requestId !== requestIdRef.current) return;
      setScramble(nextScramble);
    } catch (error) {
      console.error('Failed to generate scramble:', error);
      if (requestId !== requestIdRef.current) return;
      setScrambleError('Could not generate a scramble. Please try again.');
    } finally {
      if (requestId === requestIdRef.current) setIsScrambleLoading(false);
    }
  }, []);

  const clearTransientState = useCallback(() => {
    setScrambleError(null);
    setStatusMessage(null);
  }, []);

  // On modal open: always start in standard mode
  useEffect(() => {
    if (!isOpen) return;
    requestIdRef.current += 1;
    reset();
    clearTransientState();
    setMode('standard');
    setCompetitiveSession(null);
    setCompOutcome(null);
    setShowSelector(false);
    setCubeExpanded(false);
    loadScramble('initial');
  }, [clearTransientState, isOpen, loadScramble, reset]);

  const initCompetitiveSession = useCallback(
    (competition: Competition) => {
      const { groupId, scrambles } = pickRandomGroup(competition);
      setCompetitiveSession({ competition, groupId, scrambles, currentIndex: 0, solveTimesMs: [] });
      setCompOutcome(null);
      reset();
      clearTransientState();
    },
    [clearTransientState, reset],
  );

  const handleToggleMode = useCallback(
    async (newMode: PracticeMode) => {
      if (timer.state === 'running' || newMode === mode) return;

      if (newMode === 'competitive') {
        try {
          const loaded = await loadCompetitions();
          setCompetitions(loaded);
          setMode('competitive');
          setShowSelector(false);
          initCompetitiveSession(loaded[Math.floor(Math.random() * loaded.length)]);
        } catch (error) {
          console.error('Failed to load competition data:', error);
          setStatusMessage('Competitive mode unavailable — using random scrambles.');
        }
      } else {
        setMode('standard');
        setCompetitiveSession(null);
        setCompOutcome(null);
        setShowSelector(false);
        clearTransientState();
        loadScramble('initial');
      }
    },
    [clearTransientState, initCompetitiveSession, loadScramble, mode, timer.state],
  );

  const handleNewScramble = async () => {
    if (timer.state === 'running') return;
    clearTransientState();
    reset();
    await loadScramble('manual');
  };

  const handleStart = useCallback(() => {
    clearTransientState();
    start();
  }, [clearTransientState, start]);

  const handleStop = useCallback(() => {
    stop();
    if (mode === 'competitive' && competitiveSession !== null) {
      const newTimes = [...competitiveSession.solveTimesMs, timer.elapsedMs];
      const newIndex = competitiveSession.currentIndex + 1;
      const updatedSession: CompetitiveSession = { ...competitiveSession, solveTimesMs: newTimes, currentIndex: newIndex };
      setCompetitiveSession(updatedSession);
      if (newIndex >= competitiveSession.scrambles.length) {
        setCompOutcome(computeOutcome(updatedSession));
      }
    } else {
      saveSolve(timer.elapsedMs);
    }
  }, [competitiveSession, mode, saveSolve, stop, timer.elapsedMs]);

  const handleTryAgain = useCallback(() => {
    if (competitiveSession === null) return;
    initCompetitiveSession(competitiveSession.competition);
  }, [competitiveSession, initCompetitiveSession]);

  const handleBackToStandard = useCallback(() => {
    setMode('standard');
    setCompetitiveSession(null);
    setCompOutcome(null);
    setShowSelector(false);
    clearTransientState();
    loadScramble('initial');
  }, [clearTransientState, loadScramble]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.code !== 'Space' && event.key !== ' ') return;

      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      const isTypingTarget =
        tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable;
      if (isTypingTarget) return;

      event.preventDefault();
      if (event.repeat || isScrambleLoading) return;

      if (timer.state === 'running') {
        handleStop();
      } else {
        handleStart();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleStart, handleStop, isOpen, isScrambleLoading, onClose, timer.state]);

  if (!isOpen) return null;

  const timerDisplay = formatElapsedMs(timer.elapsedMs);
  const isCompetitive = mode === 'competitive' && competitiveSession !== null;

  // Competitive display values
  const safeIndex = competitiveSession
    ? Math.min(competitiveSession.currentIndex, competitiveSession.scrambles.length - 1)
    : 0;
  const compScramble = isCompetitive ? competitiveSession.scrambles[safeIndex] : null;

  // Running comparison values (shown after first solve)
  const solvedTimes = competitiveSession?.solveTimesMs ?? [];
  const userRunningBestMs = solvedTimes.length > 0 ? Math.min(...solvedTimes) : null;
  const userRunningAvgMs =
    solvedTimes.length > 1 ? solvedTimes.reduce((a, b) => a + b, 0) / solvedTimes.length : null;

  return (
    <div className="practice-modal-backdrop" onClick={onClose}>
      <div className="practice-modal" onClick={(event) => event.stopPropagation()}>
        <header className="practice-modal-header">
          <h2 className="title is-4">Practice</h2>
          <div className="practice-header-controls">
            <div className="mode-toggle">
              <button
                className={`button is-small ${isCompetitive ? 'is-light' : 'is-link'}`}
                onClick={() => handleToggleMode('standard')}
                disabled={timer.state === 'running'}
                aria-label="Standard mode"
              >
                <MdGridOn size={16} />
              </button>
              <button
                className={`button is-small ${isCompetitive ? 'is-link' : 'is-light'}`}
                onClick={() => handleToggleMode('competitive')}
                disabled={timer.state === 'running'}
                aria-label="Competitive mode"
              >
                <MdEmojiEvents size={16} />
              </button>
            </div>
            <button className="delete" onClick={onClose} aria-label="close"></button>
          </div>
        </header>

        <section className="practice-modal-content">
          {showSelector ? (
            <CompetitionSelector
              competitions={competitions}
              selectedId={competitiveSession?.competition.competition_id ?? ''}
              onSelect={(competition) => {
                initCompetitiveSession(competition);
                setShowSelector(false);
              }}
              onCancel={() => setShowSelector(false)}
            />
          ) : compOutcome !== null ? (
            <ComparisonResult
              outcome={compOutcome}
              onTryAgain={handleTryAgain}
              onChangeCompetition={() => setShowSelector(true)}
              onBackToStandard={handleBackToStandard}
            />
          ) : (
            <>
              {/* Scramble block */}
              <div className="practice-block">
                <div className="practice-block-header">
                  <h3 className="title is-6">Scramble</h3>
                </div>

                {scrambleError && <p className="practice-error">{scrambleError}</p>}

                {(() => {
                  const scrambleValue = isCompetitive ? compScramble : scramble?.value;
                  return (
                    <div className="scramble-row">
                      <div className="scramble-text-panel">
                        <span className="scramble-text">{scrambleValue ?? 'No scramble available yet.'}</span>
                      </div>
                      {scrambleValue && (
                        <ScrambleCubePreview
                          scramble={scrambleValue}
                          expanded={cubeExpanded}
                          onToggleExpand={() => setCubeExpanded(e => !e)}
                        />
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Timer block — hidden when cube is expanded */}
              {!cubeExpanded && <div className="practice-block">
                <div className="practice-block-header">
                  <h3 className="title is-6">Timer</h3>
                  {isCompetitive && competitiveSession ? (
                    <span className="solve-count-pill">
                      Scramble: {Math.min(competitiveSession.currentIndex + 1, competitiveSession.scrambles.length)} of {competitiveSession.scrambles.length}
                    </span>
                  ) : stats.solveCount > 0 ? (
                    <span className="solve-count-pill">Solve: {stats.solveCount}</span>
                  ) : null}
                </div>
                <div className="timer-body">
                  <div className="timer-display" aria-live="polite">{timerDisplay}</div>
                  <div className="timer-controls">
                    {!isCompetitive && (
                      <button
                        className="button is-warning is-small"
                        onClick={handleNewScramble}
                        disabled={isScrambleLoading}
                      >
                        <span className="icon is-small"><MdShuffle /></span>
                        <span>Scramble</span>
                      </button>
                    )}
                    {timer.state === 'running' ? (
                      <button
                        className="button is-danger is-small"
                        onClick={handleStop}
                        disabled={!canStop}
                      >
                        <span className="icon is-small"><MdStop /></span>
                        <span>Stop</span>
                      </button>
                    ) : (
                      <button
                        className="button is-primary is-small"
                        onClick={handleStart}
                        disabled={!canStart || (!isCompetitive && isScrambleLoading)}
                      >
                        <span className="icon is-small"><MdPlayArrow /></span>
                        <span>Start</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>}

              {/* Stats block — hidden when cube is expanded */}
              {!cubeExpanded && (isCompetitive && competitiveSession ? (  /* stats block */
                <div className="practice-block">
                  <div className="practice-block-header">
                    <h3 className="title is-6">vs Champion</h3>
                    <button
                      className="button is-small is-light"
                      onClick={() => setShowSelector(true)}
                      disabled={timer.state === 'running'}
                    >
                      <span className="icon is-small"><MdChangeCircle /></span>
                      <span>Change</span>
                    </button>
                  </div>
                  <div className="stats-display">
                    <div className="stat-item">
                      <span className="stat-label">Your best single</span>
                      <span className="stat-value">
                        {userRunningBestMs !== null ? formatElapsedMs(userRunningBestMs) : '—'}
                      </span>
                      <span className="stat-note">
                        Target: {formatElapsedMs(competitiveSession.competition.winner_single * 1000)}
                      </span>
                    </div>
                    {competitiveSession.competition.winner_average !== null && (
                      <div className="stat-item">
                        <span className="stat-label">Your average</span>
                        <span className="stat-value">
                          {userRunningAvgMs !== null ? formatElapsedMs(userRunningAvgMs) : '—'}
                        </span>
                        <span className="stat-note">
                          Target: {formatElapsedMs(competitiveSession.competition.winner_average * 1000)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="block-caption">
                    <span className="vs-champion-name">{competitiveSession.competition.winner_name}</span>
                    {' @ '}
                    {competitiveSession.competition.competition_name}
                  </p>
                </div>
              ) : (
                <div className="practice-block">
                  <div className="practice-block-header">
                    <h3 className="title is-6">Statistics</h3>
                    <button
                      className="button is-small is-light"
                      onClick={resetStats}
                    >
                      <span className="icon is-small"><MdHistory /></span>
                      <span>Reset</span>
                    </button>
                  </div>
                  <div className="stats-display">
                    <div className="stat-item">
                      <span className="stat-label">Last time</span>
                      <span className="stat-value">
                        {stats.lastTimeMs !== null ? formatElapsedMs(stats.lastTimeMs) : '—'}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Average (last 5)</span>
                      <span className="stat-value">
                        {stats.averageLast5Ms !== null ? formatElapsedMs(stats.averageLast5Ms) : '—'}
                      </span>
                      {stats.solveCount > 0 && stats.solveCount < 5 && (
                        <span className="stat-note">({stats.solveCount}/5 solves)</span>
                      )}
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Best time</span>
                      <span className="stat-value">
                        {stats.bestTimeMs !== null ? formatElapsedMs(stats.bestTimeMs) : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {statusMessage && <p className="practice-status">{statusMessage}</p>}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
