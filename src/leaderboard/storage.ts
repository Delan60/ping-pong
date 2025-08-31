import type { LeaderboardEntry } from './types';

const KEY = 'pp_leaderboard_v1';
const MAX_ENTRIES = 25;

function isEntry(o: unknown): o is LeaderboardEntry {
  if (!o || typeof o !== 'object') return false;
  const obj = o as Record<string, unknown>;
  return typeof obj.player === 'string' && typeof obj.score === 'number';
}
function safeParse(json: string | null): LeaderboardEntry[] {
  if (!json) return [];
  try {
    const data: unknown = JSON.parse(json);
    if (Array.isArray(data)) return data.filter(isEntry);
    return [];
  } catch {
    return [];
  }
}

export function loadLeaderboard(): LeaderboardEntry[] {
  if (typeof localStorage === 'undefined') return [];
  return safeParse(localStorage.getItem(KEY));
}

export function saveLeaderboard(entries: LeaderboardEntry[]) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // ignore quota errors
  }
}

export function addEntry(entry: LeaderboardEntry): LeaderboardEntry[] {
  const list = loadLeaderboard();
  const existing = list.filter((e) => e.player !== entry.player); // keep best per player below
  const priorBest = list.find((e) => e.player === entry.player);
  const improved =
    !priorBest ||
    entry.score > priorBest.score ||
    (entry.score === priorBest.score && entry.durationMs < priorBest.durationMs);
  const next = improved ? [...existing, entry] : [...list, entry];
  const diff = (e: LeaderboardEntry) => e.score - e.opponentScore;
  next.sort(
    (a, b) =>
      diff(b) - diff(a) || // biggest margin first
      b.score - a.score || // then higher raw score
      a.durationMs - b.durationMs || // shorter match (faster win) first
      b.createdAt.localeCompare(a.createdAt) // newest first
  );
  saveLeaderboard(next);
  return next;
}

export function clearLeaderboard() {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(KEY);
}
