import type { FC } from 'react';
import { useRef, useState, useMemo } from 'react';
import { Layout } from '../layout/layout';
import { Paddle, type PaddleHandle } from '../paddle/paddle';
import { Ball } from '../ball/ball';
import { useBallPhysics } from '../../hooks/useBallPhysics';
import { Traces } from '../traces/traces';
import { Scoreboard } from '../scoreboard/scoreboard';
import { Leaderboard } from '../leaderboard/leaderboard';
import { MatchOverlay } from '../matchoverlay/matchOverlay';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { useMatch } from '../../hooks/useMatch';
import { WIN_SCORE } from '../../gameConfig';
import styles from './game.module.css';

export const Game: FC = () => {
  const leftPaddleRef = useRef<PaddleHandle>(null);
  const rightPaddleRef = useRef<PaddleHandle>(null);
  const { addMatch } = useLeaderboard();
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const difficultyScale = useMemo(() => {
    switch (difficulty) {
      case 'easy':
        return 0.8;
      case 'hard':
        return 1.4;
      default:
        return 1.0;
    }
  }, [difficulty]);
  const { leftScore, rightScore, awaitingStart, paused, handleScore, beginMatch } = useMatch({
    winScore: WIN_SCORE,
    addMatch,
  });

  const ball = useBallPhysics(leftPaddleRef, rightPaddleRef, {
    onScore: handleScore,
    autoResetDelayMs: 700,
    paused,
    difficulty: difficultyScale,
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
          <MatchOverlay
            awaitingStart={awaitingStart}
            leftScore={leftScore}
            rightScore={rightScore}
            winScore={WIN_SCORE}
            onBegin={beginMatch}
            difficulty={difficulty}
            onChangeDifficulty={(d) => setDifficulty(d)}
          />
        </Layout>
        <Leaderboard />
      </div>
    </div>
  );
};
