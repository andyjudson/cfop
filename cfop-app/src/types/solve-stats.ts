/**
 * Type definitions for solve time statistics and persistence
 */

/**
 * A single valid completed solve persisted for stats calculations
 */
export interface SolveRecord {
  /** Unique identifier for this solve record */
  id: string;
  /** Solve duration in milliseconds */
  elapsedMs: number;
  /** Epoch timestamp (ms) when solve was completed */
  completedAtMs: number;
}

/**
 * Versioned persisted container stored in localStorage
 */
export interface SolveHistoryStore {
  /** Schema version for migration support */
  version: number;
  /** Epoch timestamp (ms) for last store update */
  updatedAtMs: number;
  /** Ordered solve records (oldest → newest) */
  solves: SolveRecord[];
}

/**
 * Derived statistics displayed in practice modal
 */
export interface SolveStatsSummary {
  /** Most recent valid solve time in milliseconds (null if none) */
  lastTimeMs: number | null;
  /** Arithmetic mean of last 5 valid solves in milliseconds (null if <5 solves) */
  averageLast5Ms: number | null;
  /** Minimum valid solve time in milliseconds (null if none) */
  bestTimeMs: number | null;
  /** Count of valid persisted solves */
  solveCount: number;
}
