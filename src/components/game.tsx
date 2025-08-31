import type { FC } from 'react';
import { useRef } from 'react';
import { Layout } from './layout';
import { Paddle, type PaddleHandle } from './paddle';
import { Ball } from './ball';
import { useBallPhysics } from '../hooks/useBallPhysics';
import { Traces } from './Traces';
import { Scoreboard } from './Scoreboard';
import { Leaderboard } from './Leaderboard';
import { MatchOverlay } from './MatchOverlay';
import { useLeaderboard } from '../leaderboard/useLeaderboard';
import { useMatch } from '../hooks/useMatch';
import { WIN_SCORE } from '../gameConfig';
import styles from './game.module.css';

export const Game: FC = () => {
  const leftPaddleRef = useRef<PaddleHandle>(null);
  const rightPaddleRef = useRef<PaddleHandle>(null);
  const { addMatch } = useLeaderboard();
  const { leftScore, rightScore, awaitingStart, paused, handleScore, beginMatch } = useMatch({
    winScore: WIN_SCORE,
    addMatch,
  });

  const ball = useBallPhysics(leftPaddleRef, rightPaddleRef, {
    onScore: handleScore,
    autoResetDelayMs: 700,
    paused,
  });

  return (
    <div className={styles.gameWrapper}>
      <div className={styles.gameInner} style={{ position: 'relative' }}>
        <Scoreboard left={leftScore} right={rightScore} />
        <Layout>
          <Paddle ref={leftPaddleRef} side="left" ariaLabel="left player paddle" />
          <Paddle
            ref={rightPaddleRef}
            side="right"
            ariaLabel="right player paddle"
            keyMapping={{ up: ['i', 'I'], down: ['k', 'K'] }}
          />
          <Traces x={ball.x} y={ball.y} />
          <Ball x={ball.x} y={ball.y} />
        </Layout>
        <Leaderboard />
        <MatchOverlay
          awaitingStart={awaitingStart}
          leftScore={leftScore}
          rightScore={rightScore}
          winScore={WIN_SCORE}
          onBegin={beginMatch}
        />
      </div>
    </div>
  );
};
