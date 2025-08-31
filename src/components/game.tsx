import type { FC } from 'react';
import { useRef, useState, useCallback } from 'react';
import { Layout } from './layout';
import { Paddle, type PaddleHandle } from './paddle';
import { Ball } from './ball';
import { useBallPhysics } from '../hooks/useBallPhysics';
import { Traces } from './Traces';
import { Scoreboard } from './Scoreboard';
import styles from './game.module.css';

export const Game: FC = () => {
  const leftPaddleRef = useRef<PaddleHandle>(null);
  const rightPaddleRef = useRef<PaddleHandle>(null);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const handleScore = useCallback(
    (side: 'left' | 'right') => {
      if (side === 'left') setLeftScore((s) => s + 1);
      else setRightScore((s) => s + 1);
    },
    [setLeftScore, setRightScore]
  );

  const ball = useBallPhysics(leftPaddleRef, rightPaddleRef, {
    onScore: handleScore,
    autoResetDelayMs: 700,
  });

  return (
    <div className={styles.gameWrapper}>
      <div className={styles.gameInner}>
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
      </div>
    </div>
  );
};
