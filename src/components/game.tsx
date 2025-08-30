import type { FC } from 'react';
import { useRef } from 'react';
import { Layout } from './layout';
import { Paddle, type PaddleHandle } from './paddle';
import { Ball, type BallHandle } from './ball';
import { usePaddleBallCollision } from '../hooks/usePaddleBallCollision';

export const Game: FC = () => {
  const leftPaddleRef = useRef<PaddleHandle>(null);
  const rightPaddleRef = useRef<PaddleHandle>(null);
  const ballRef = useRef<BallHandle>(null);

  usePaddleBallCollision(leftPaddleRef, rightPaddleRef, ballRef);

  return (
    <Layout>
      <Paddle ref={leftPaddleRef} side="left" ariaLabel="left player paddle" />
      <Paddle ref={rightPaddleRef} side="right" ariaLabel="right player paddle" keyMapping={{ up: ['i','I'], down: ['k','K'] }} />
      <Ball ref={ballRef} />
    </Layout>
  );
};
