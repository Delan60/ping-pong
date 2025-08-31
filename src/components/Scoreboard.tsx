import React from 'react';
import styles from './Scoreboard.module.css';

export interface ScoreboardProps {
  left: number;
  right: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ left, right }) => (
  <div className={styles.scoreboard} aria-label="scoreboard">
    <span key={left} className={`${styles.score} ${styles.scoreAnim}`} aria-label="left score">{left}</span>
    <span className={styles.separator}>:</span>
    <span key={right} className={`${styles.score} ${styles.scoreAnim}`} aria-label="right score">{right}</span>
  </div>
);
