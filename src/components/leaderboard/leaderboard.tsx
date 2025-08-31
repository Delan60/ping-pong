import React from 'react';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import styles from './leaderboard.module.css';

export const Leaderboard: React.FC = () => {
  const { entries, clear } = useLeaderboard();
  return (
    <div className={styles.leaderboard} aria-label="leaderboard">
      <div className={styles.headerRow}>
        <span>#</span>
        <span>Player</span>
        <span>Score</span>
        <span>Time</span>
      </div>
      {entries.length === 0 && (
        <div className={styles.leaderboardEmpty} style={{ gridColumn: '1 / -1', padding: '8px 0' }}>
          No matches yet.
        </div>
      )}
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
      <div style={{ textAlign: 'right', marginTop: '8px' }}>
        <button onClick={clear} aria-label="Reset leaderboard">
          Reset
        </button>
      </div>
    </div>
  );
};
