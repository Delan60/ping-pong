export interface LeaderboardEntry {
  id: string; // uuid or timestamp-based
  player: string;
  opponent?: string;
  score: number;
  opponentScore: number;
  durationMs: number;
  createdAt: string; // ISO
}
