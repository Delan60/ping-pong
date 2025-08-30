import type { FC } from 'react';
import { useRef } from 'react';
import { Layout } from './layout';
import { Paddle, type PaddleHandle } from './paddle';
import { Ball } from './ball';
import { useBallPhysics } from '../hooks/useBallPhysics';

export const Game: FC = () => {
  const leftPaddleRef = useRef<PaddleHandle>(null);
  const rightPaddleRef = useRef<PaddleHandle>(null);
  const ball = useBallPhysics(leftPaddleRef, rightPaddleRef);

  return (
    <Layout>
        <Paddle ref={leftPaddleRef} side="left" ariaLabel="left player paddle" />
        <Paddle ref={rightPaddleRef} side="right" ariaLabel="right player paddle" keyMapping={{ up: ['i','I'], down: ['k','K'] }} />
        <Ball x={ball.x} y={ball.y} />
    </Layout>
  );
};
