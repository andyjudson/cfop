/**
 * React hook for managing solve statistics with localStorage persistence
 */

import { useState, useEffect, useCallback } from 'react';
import type { SolveStatsSummary, SolveRecord } from '../types/solve-stats';
import { loadSolveHistory, saveSolveHistory, clearSolveHistory } from '../utils/storage';

/**
 * Custom hook for solve statistics tracking and persistence
 * @returns Stats summary and function to save new solves
 */
export function useSolveStats() {
  const [stats, setStats] = useState<SolveStatsSummary>({
    lastTimeMs: null,
    averageLast5Ms: null,
    bestTimeMs: null,
    solveCount: 0,
  });

  // Load persisted history on mount and compute initial stats
  useEffect(() => {
    const store = loadSolveHistory();
    setStats(computeStats(store.solves));
  }, []);

  /**
   * Save a new completed solve and update stats
   * @param elapsedMs - Solve duration in milliseconds
   */
  const saveSolve = useCallback((elapsedMs: number) => {
    // Load current history
    const store = loadSolveHistory();

    // Create new solve record
    const newSolve: SolveRecord = {
      id: crypto.randomUUID(),
      elapsedMs,
      completedAtMs: Date.now(),
    };

    // Append to history
    const updatedStore = {
      ...store,
      solves: [...store.solves, newSolve],
    };

    // Persist updated history (with automatic bounding)
    saveSolveHistory(updatedStore);

    // Recompute and update stats
    setStats(computeStats(updatedStore.solves));
  }, []);

  /**
   * Clear all solve history and reset stats
   */
  const resetStats = useCallback(() => {
    clearSolveHistory();
    setStats({
      lastTimeMs: null,
      averageLast5Ms: null,
      bestTimeMs: null,
      solveCount: 0,
    });
  }, []);

  return { stats, saveSolve, resetStats };
}

/**
 * Compute statistics summary from solve records
 * @param solves - Array of solve records (ordered oldest → newest)
 * @returns Derived statistics summary
 */
function computeStats(solves: SolveRecord[]): SolveStatsSummary {
  const solveCount = solves.length;

  // Last solve: most recent record
  const lastTimeMs = solveCount > 0 ? solves[solveCount - 1].elapsedMs : null;

  // Average of last 5: null if fewer than 5 solves
  let averageLast5Ms: number | null = null;
  if (solveCount >= 5) {
    const lastFive = solves.slice(-5);
    const sum = lastFive.reduce((acc, solve) => acc + solve.elapsedMs, 0);
    averageLast5Ms = sum / 5;
  }

  // Best time: minimum elapsed time across all solves
  const bestTimeMs =
    solveCount > 0
      ? Math.min(...solves.map((solve) => solve.elapsedMs))
      : null;

  return {
    lastTimeMs,
    averageLast5Ms,
    bestTimeMs,
    solveCount,
  };
}
