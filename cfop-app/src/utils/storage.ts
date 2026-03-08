/**
 * Versioned localStorage utilities for solve history persistence
 * with validation and corruption-safe fallback
 */

import type { SolveHistoryStore, SolveRecord } from '../types/solve-stats';

const STORAGE_KEY = 'cfop-practice.solveHistory';
const CURRENT_VERSION = 1;
const MAX_HISTORY_SIZE = 100; // Bounded history to prevent unbounded growth

/**
 * Load solve history from localStorage with defensive validation
 * @returns Validated solve history or empty state on corruption/missing data
 */
export function loadSolveHistory(): SolveHistoryStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createEmptyStore();
    }

    const parsed = JSON.parse(raw);
    
    // Validate envelope structure
    if (!isValidStore(parsed)) {
      console.warn('[Storage] Invalid store structure, returning empty state');
      return createEmptyStore();
    }

    // Sanitize solve records
    const validSolves = parsed.solves
      .filter(isValidSolveRecord)
      .slice(-MAX_HISTORY_SIZE); // Keep only most recent records within bounds

    return {
      version: CURRENT_VERSION,
      updatedAtMs: parsed.updatedAtMs,
      solves: validSolves,
    };
  } catch (error) {
    console.error('[Storage] Failed to load solve history:', error);
    return createEmptyStore();
  }
}

/**
 * Save solve history to localStorage
 * @param store - The solve history store to persist
 */
export function saveSolveHistory(store: SolveHistoryStore): void {
  try {
    // Ensure we don't exceed max history size
    const boundedStore: SolveHistoryStore = {
      ...store,
      solves: store.solves.slice(-MAX_HISTORY_SIZE),
      updatedAtMs: Date.now(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(boundedStore));
  } catch (error) {
    console.error('[Storage] Failed to save solve history:', error);
    // Non-fatal: practice session can continue even if persistence fails
  }
}

/**
 * Clear all solve history from localStorage
 */
export function clearSolveHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('[Storage] Failed to clear solve history:', error);
  }
}

/**
 * Create an empty solve history store
 */
function createEmptyStore(): SolveHistoryStore {
  return {
    version: CURRENT_VERSION,
    updatedAtMs: Date.now(),
    solves: [],
  };
}

/**
 * Validate store envelope structure
 */
function isValidStore(obj: unknown): obj is SolveHistoryStore {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const store = obj as Record<string, unknown>;
  
  return (
    typeof store.version === 'number' &&
    typeof store.updatedAtMs === 'number' &&
    Array.isArray(store.solves)
  );
}

/**
 * Validate individual solve record
 */
function isValidSolveRecord(record: unknown): record is SolveRecord {
  if (typeof record !== 'object' || record === null) {
    return false;
  }

  const solve = record as Record<string, unknown>;
  
  return (
    typeof solve.id === 'string' &&
    typeof solve.elapsedMs === 'number' &&
    typeof solve.completedAtMs === 'number' &&
    Number.isFinite(solve.elapsedMs) &&
    Number.isFinite(solve.completedAtMs) &&
    solve.elapsedMs > 0 && // Duration must be positive
    solve.completedAtMs > 0 // Timestamp must be valid epoch
  );
}
