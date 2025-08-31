import React from 'react';
import styles from './matchOverlay.module.css';
import { DifficultyPicker } from '../difficultypicker/difficultyPicker';
import { WinnerNameForm } from '../winnernameform/winnerNameForm';

export interface MatchOverlayProps {
  awaitingStart: boolean;
  leftScore: number;
  rightScore: number;
  winScore: number;
  onBeginMatch: () => void;
  difficulty: 'easy' | 'normal' | 'hard';
  onChangeDifficulty: (d: 'easy' | 'normal' | 'hard') => void;
  winnerSide?: 'left' | 'right';
  winnerNeedsName?: boolean;
  onSubmitWinner?: (name: string) => void;
}

export const MatchOverlay: React.FC<MatchOverlayProps> = ({
  awaitingStart,
  leftScore,
  rightScore,
  winScore,
  onBeginMatch,
  difficulty,
  onChangeDifficulty,
  winnerSide,
  winnerNeedsName,
  onSubmitWinner,
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
            {winnerNeedsName && winnerSide ? (
              <WinnerNameForm
                winnerSide={winnerSide}
                autoFocus
                onSubmit={(name: string) => {
                  onSubmitWinner?.(name);
                  onBeginMatch();
                }}
              />
            ) : (
              <button onClick={onBeginMatch} autoFocus>
                Next Match
              </button>
            )}
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
            <button onClick={onBeginMatch} autoFocus>
              Start Match
            </button>
          </>
        )}
      </div>
    </div>
  );
};
// (duplicate removed)
