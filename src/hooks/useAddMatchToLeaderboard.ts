import { useCallback } from 'react';
import { useLeaderboard } from './useLeaderboard';

interface Params {
  winnerSide?: 'left' | 'right';
  leftScore: number;
  rightScore: number;
  lastMatchDurationMs?: number;
}

/**
 * Provides a stable callback to add the just-finished match to the leaderboard.
 * Keeps Game component slimmer and centralizes mapping logic.
 */
export function useAddMatchToLeaderboard({
  winnerSide,
  leftScore,
  rightScore,
  lastMatchDurationMs,
}: Params) {
  const { addMatch } = useLeaderboard();

  return useCallback(
    (name: string) => {
      if (!winnerSide) return;
      const leftWon = winnerSide === 'left';
      const score = leftWon ? leftScore : rightScore;
      const opponentScore = leftWon ? rightScore : leftScore;
      const opponentName = leftWon ? 'Right' : 'Left';
      addMatch({
        player: name || (leftWon ? 'Left' : 'Right'),
        opponent: opponentName,
        score,
        opponentScore,
        durationMs: lastMatchDurationMs ?? 0,
      });
    },
    [winnerSide, leftScore, rightScore, lastMatchDurationMs, addMatch]
  );
}
