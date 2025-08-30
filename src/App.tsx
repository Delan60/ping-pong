import { useState } from 'react';
import './app.css';

export default function App() {
  const [count, setCount] = useState<number>(0);
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Ping Pong</h1>
      <p>Starter React + Vite + TypeScript project.</p>
      <button onClick={() => setCount(c => c + 1)}>Clicks: {count}</button>
    </div>
  );
}
