import React from 'react';
import styles from './game.module.css';

export interface MatchOverlayProps {
  awaitingStart: boolean;
  leftScore: number;
  rightScore: number;
  winScore: number;
  onBegin: () => void;
}

export const MatchOverlay: React.FC<MatchOverlayProps> = ({
  awaitingStart,
  leftScore,
  rightScore,
  winScore,
  onBegin,
}) => {
  if (!awaitingStart) return null;
  const finished = leftScore >= winScore || rightScore >= winScore;
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      {finished ? (
        <>
          <div>Match complete!</div>
          <button onClick={onBegin}>Next Match</button>
        </>
      ) : (
        <>
          <div>Ready?</div>
          <button onClick={onBegin}>Start Match</button>
        </>
      )}
    </div>
  );
};
