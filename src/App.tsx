import React, { useState } from 'react';
import { Game } from './components';
import { LeaderboardScreen } from './components/screens/leaderboardScreen';
import styles from './App.module.css';

// Very simple routing to move the Leaderboard to a separate screen.
export const App: React.FC = () => {
  const [screen, setScreen] = useState<'game' | 'leaderboard'>('game');
  const isGame = screen === 'game';
  const toggle = () => setScreen(isGame ? 'leaderboard' : 'game');
  return (
    <div className={styles.appRoot}>
      <div className={styles.toggleBtnContainer}>
        <button
          onClick={toggle}
          aria-label={isGame ? 'Show leaderboard' : 'Return to game'}
          className={styles.toggleBtn}
        >
          {isGame ? 'Leaderboard' : 'Back'}
        </button>
      </div>
      {isGame ? <Game /> : <LeaderboardScreen />}
    </div>
  );
};
