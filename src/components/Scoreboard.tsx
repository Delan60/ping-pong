import React, { useEffect, useState } from 'react';
import styles from './Scoreboard.module.css';

export interface ScoreboardProps {
  left: number;
  right: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ left, right }) => {
  const [leftAnim, setLeftAnim] = useState(false);
  const [rightAnim, setRightAnim] = useState(false);

  // Retrigger animation on score change without remounting elements
  useEffect(() => {
    setLeftAnim(false);
    // next frame so class removal applies
    const id = requestAnimationFrame(() => setLeftAnim(true));
    return () => cancelAnimationFrame(id);
  }, [left]);
  useEffect(() => {
    setRightAnim(false);
    const id = requestAnimationFrame(() => setRightAnim(true));
    return () => cancelAnimationFrame(id);
  }, [right]);

  return (
    <div className={styles.scoreboard} aria-label="scoreboard">
      <span
        className={`${styles.score} ${leftAnim ? styles.scoreAnim : ''}`}
        aria-label="left score"
      >
        {left}
      </span>
      <span className={styles.separator}>:</span>
      <span
        className={`${styles.score} ${rightAnim ? styles.scoreAnim : ''}`}
        aria-label="right score"
      >
        {right}
      </span>
    </div>
  );
};
