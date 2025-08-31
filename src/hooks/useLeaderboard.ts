import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { addEntry as persistAdd, clearLeaderboard, loadLeaderboard } from '../localstorage/storage';
import type { LeaderboardEntry } from '../localstorage/types';

export interface UseLeaderboardApi {
  entries: LeaderboardEntry[];
  addMatch: (data: Omit<LeaderboardEntry, 'id' | 'createdAt'>) => void;
  clear: () => void;
  refreshedAt: number;
  lowestScoreDiff: number; // smallest (score - opponentScore) among entries
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useLeaderboard(): UseLeaderboardApi {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [refreshedAt, setRefreshedAt] = useState(Date.now());
  const mountedRef = useRef(false);

  useEffect(() => {
    setEntries(loadLeaderboard());
    mountedRef.current = true;
  }, []);

  // sync across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'pp_leaderboard_v1') {
        setEntries(loadLeaderboard());
        setRefreshedAt(Date.now());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const addMatch = useCallback((data: Omit<LeaderboardEntry, 'id' | 'createdAt'>) => {
    const entry: LeaderboardEntry = { id: makeId(), createdAt: new Date().toISOString(), ...data };
    const next = persistAdd(entry);
    setEntries(next);
    setRefreshedAt(Date.now());
  }, []);

  const clear = useCallback(() => {
    clearLeaderboard();
    setEntries([]);
    setRefreshedAt(Date.now());
  }, []);

  const lowestScoreDiff = useMemo(() => {
    if (entries.length === 0) return 0;
    let min = null;
    for (const e of entries) {
      const diff = e.score - e.opponentScore;
      if (min == null || diff < min) min = diff;
    }
    return min === null ? 0 : min;
  }, [entries]);

  return { entries, addMatch, clear, refreshedAt, lowestScoreDiff };
}
