import React from 'react';
import styles from './matchOverlay.module.css';
import { DifficultyPicker } from './DifficultyPicker';

export interface MatchOverlayProps {
  awaitingStart: boolean;
  leftScore: number;
  rightScore: number;
  winScore: number;
  onBegin: () => void;
  difficulty: 'easy' | 'normal' | 'hard';
  onChangeDifficulty: (d: 'easy' | 'normal' | 'hard') => void;
}

export const MatchOverlay: React.FC<MatchOverlayProps> = ({
  awaitingStart,
  leftScore,
  rightScore,
  winScore,
  onBegin,
  difficulty,
  onChangeDifficulty,
}) => {
  if (!awaitingStart) return null;
  const finished = leftScore >= winScore || rightScore >= winScore;
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.overlayContent}>
  <DifficultyPicker value={difficulty} onChange={onChangeDifficulty} compact />
        {finished ? (
          <>
            <h2>Match complete</h2>
            <p>
              Final Score {leftScore} – {rightScore} (first to {winScore})
            </p>
            <button onClick={onBegin} autoFocus>
              Next Match
            </button>
          </>
        ) : (
          <>
            <h2>Ready?</h2>
            <p>First to {winScore} points wins.</p>
            <ul className={styles.instructions} aria-label="How to play">
              <li>
                <strong>Left Player:</strong> <code>W</code> for up / <code>S</code> for down
              </li>
              <li>
                <strong>Right Player:</strong> <code>I</code> for up / <code>K</code> for down
              </li>
              <li>
                <strong>Tip:</strong> Change difficulty above before starting.
              </li>
            </ul>
            <button onClick={onBegin} autoFocus>
              Start Match
            </button>
          </>
        )}
      </div>
    </div>
  );
};
// (duplicate removed)
