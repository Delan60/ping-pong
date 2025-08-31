import { useCallback, useEffect, useRef, useState } from 'react';

export interface AddMatchPayload {
  player: string;
  opponent?: string;
  score: number;
  opponentScore: number;
  durationMs: number;
}
export type AddMatchFn = (data: AddMatchPayload) => void;

export interface UseMatchResult {
  leftScore: number;
  rightScore: number;
  awaitingStart: boolean;
  paused: boolean; // convenience alias of awaitingStart
  handleScore: (side: 'left' | 'right') => void; // pass to ball physics onScore
  beginMatch: () => void; // user interaction to start / next match
}

interface UseMatchOptions {
  winScore: number;
  addMatch: AddMatchFn;
}

export function useMatch({ winScore, addMatch }: UseMatchOptions): UseMatchResult {
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
  useEffect(() => {
    if (awaitingStart || matchFinishedRef.current) return;
    if (leftScore >= winScore || rightScore >= winScore) {
      matchFinishedRef.current = true;
      const durationMs = Date.now() - matchStartRef.current;
      const leftWon = leftScore > rightScore;
      addMatch({
        player: leftWon ? 'Left' : 'Right',
        opponent: leftWon ? 'Right' : 'Left',
        score: leftWon ? leftScore : rightScore,
        opponentScore: leftWon ? rightScore : leftScore,
        durationMs,
      });
      setAwaitingStart(true); // show overlay
    }
  }, [leftScore, rightScore, winScore, addMatch, awaitingStart]);

  const beginMatch = useCallback(() => {
    setLeftScore(0);
    setRightScore(0);
    matchStartRef.current = Date.now();
    matchFinishedRef.current = false;
    setAwaitingStart(false);
  }, []);

  return {
    leftScore,
    rightScore,
    awaitingStart,
    paused: awaitingStart,
    handleScore,
    beginMatch,
  };
}
