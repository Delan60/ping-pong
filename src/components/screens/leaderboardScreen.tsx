import React from 'react';
import { Leaderboard } from '../leaderboard/leaderboard';

export const LeaderboardScreen: React.FC = () => {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Leaderboard</h1>
      <Leaderboard />
    </div>
  );
};
