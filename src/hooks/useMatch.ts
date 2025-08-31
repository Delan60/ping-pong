import { useCallback, useEffect, useRef, useState } from 'react';

export interface AddMatchPayload {
  player: string;
  opponent?: string;
  score: number;
  opponentScore: number;
  durationMs: number;
}

export interface UseMatchResult {
  leftScore: number;
  rightScore: number;
  awaitingStart: boolean;
  paused: boolean; // convenience alias of awaitingStart
  handleScore: (side: 'left' | 'right') => void; // pass to ball physics onScore
  beginMatch: () => void; // user interaction to start / next match
  winnerSide?: 'left' | 'right';
  lastMatchDurationMs?: number;
}

interface UseMatchOptions {
  winScore: number;
}

export function useMatch({ winScore }: UseMatchOptions): UseMatchResult {
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [awaitingStart, setAwaitingStart] = useState(true);

  const matchStartRef = useRef<number>(Date.now());
  const matchFinishedRef = useRef(false);

  const handleScore = useCallback(
    (side: 'left' | 'right') => {
      if (awaitingStart || matchFinishedRef.current) return;
      if (side === 'left') setLeftScore((s) => s + 1);
      else setRightScore((s) => s + 1);
    },
    [awaitingStart]
  );

  // Win detection
  const [winnerSide, setWinnerSide] = useState<'left' | 'right' | undefined>();
  const [lastMatchDurationMs, setLastMatchDurationMs] = useState<number | undefined>();

  useEffect(() => {
    if (awaitingStart || matchFinishedRef.current) return;
    if (leftScore >= winScore || rightScore >= winScore) {
      matchFinishedRef.current = true;
      // Capture duration for later use when name is submitted (consumer can recompute if needed)
      // const durationMs = Date.now() - matchStartRef.current;
      const leftWon = leftScore > rightScore;
      setWinnerSide(leftWon ? 'left' : 'right');
      setLastMatchDurationMs(Date.now() - matchStartRef.current);
      setAwaitingStart(true); // show overlay
    }
  }, [leftScore, rightScore, winScore, awaitingStart]);

  const beginMatch = useCallback(() => {
    setLeftScore(0);
    setRightScore(0);
    matchStartRef.current = Date.now();
    matchFinishedRef.current = false;
    setWinnerSide(undefined);
    setLastMatchDurationMs(undefined);
    setAwaitingStart(false);
  }, []);

  return {
    leftScore,
    rightScore,
    awaitingStart,
    paused: awaitingStart,
    handleScore,
    beginMatch,
    winnerSide,
    lastMatchDurationMs,
  };
}
