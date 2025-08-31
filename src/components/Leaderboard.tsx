import React from 'react';
import { useLeaderboard } from '../leaderboard/useLeaderboard';
import styles from './leaderboard.module.css';

export const Leaderboard: React.FC = () => {
  const { entries, clear } = useLeaderboard();
  if (!entries.length) return <div className={styles.leaderboardEmpty}>No matches yet.</div>;
  return (
    <div className={styles.leaderboard} aria-label="leaderboard">
      <div className={styles.headerRow}>
        <span>#</span>
        <span>Player</span>
        <span>Score</span>
        <span>Time</span>
        <button onClick={clear}>Reset</button>
      </div>
      {entries.slice(0, 10).map((e, i) => (
        <div key={e.id} className={styles.row}>
          <span>{i + 1}</span>
          <span title={e.player}>{e.player}</span>
          <span>
            {e.score}-{e.opponentScore}
          </span>
          <span>{Math.round(e.durationMs / 1000)}s</span>
        </div>
      ))}
    </div>
  );
};
