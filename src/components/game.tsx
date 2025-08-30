import { useState, type FC } from 'react';
import styles from './game.module.css';

export const Game: FC = () => {
  const [count, setCount] = useState<number>(0);
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Ping Pong</h1>
      <p>Starter React + Vite + TypeScript project.</p>
      <button className={styles.button} onClick={() => setCount(c => c + 1)}>Clicks: {count}</button>
    </div>
  );
};
