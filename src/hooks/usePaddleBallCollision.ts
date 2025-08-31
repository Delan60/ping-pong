import { useEffect, useRef } from 'react';
import {
  PADDLE_HEIGHT_PX,
  PADDLE_WIDTH_PX,
  PLAYFIELD_WIDTH_PX,
  PLAYFIELD_HEIGHT_PX,
} from '../gameConfig';
import type { PaddleHandle } from '../components/paddle/paddle';
import type { BallPhysicsState } from './useBallPhysics';

/** Simple paddle-ball collision hook. Call inside Game with refs to paddles & ball. */
export function usePaddleBallCollision(
  leftPaddleRef: React.RefObject<PaddleHandle | null>,
  rightPaddleRef: React.RefObject<PaddleHandle | null>,
  ball: BallPhysicsState
) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const step = () => {
      if (ball) {
        let { x, y, vx, vy } = ball;
        const radius = ball.radius;
        const left = leftPaddleRef.current?.getState();
        const right = rightPaddleRef.current?.getState();

        let collided = false;

        // Vertical wall bounce (top/bottom)
        if (y - radius < 0) {
          y = radius;
          vy = Math.abs(vy);
          collided = true;
        } else if (y + radius > PLAYFIELD_HEIGHT_PX) {
          y = PLAYFIELD_HEIGHT_PX - radius;
          vy = -Math.abs(vy);
          collided = true;
        }
        // Left paddle collision
        if (vx < 0 && x - radius <= PADDLE_WIDTH_PX) {
          if (left && Math.abs(y - left.centerY) <= PADDLE_HEIGHT_PX / 2 + radius) {
            x = PADDLE_WIDTH_PX + radius;
            vx = Math.abs(vx); // reflect right
            collided = true;
          }
        }
        // Right paddle collision
        const rightPaddleX = PLAYFIELD_WIDTH_PX - PADDLE_WIDTH_PX;
        if (vx > 0 && x + radius >= rightPaddleX) {
          if (right && Math.abs(y - right.centerY) <= PADDLE_HEIGHT_PX / 2 + radius) {
            x = rightPaddleX - radius;
            vx = -Math.abs(vx); // reflect left
            collided = true;
          }
        }

        // Horizontal wall bounce if missed paddles (temporary scoring placeholder)
        if (!collided) {
          if (x - radius < 0) {
            x = radius;
            vx = Math.abs(vx);
            collided = true;
          } else if (x + radius > PLAYFIELD_WIDTH_PX) {
            x = PLAYFIELD_WIDTH_PX - radius;
            vx = -Math.abs(vx);
            collided = true;
          }
        }

        if (collided) {
          // Write back only if a collision actually changed something
          ball.setPosition(x, y);
          ball.setVelocity(vx, vy);
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [leftPaddleRef, rightPaddleRef, ball]);
}
