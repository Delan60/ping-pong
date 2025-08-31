import { useEffect, useRef, useState, useCallback } from 'react';
import {
  BALL_INITIAL_SPEED_PX_PER_SEC,
  BALL_SIZE_PX,
  PADDLE_HEIGHT_PX,
  PADDLE_WIDTH_PX,
  PLAYFIELD_HEIGHT_PX,
  PLAYFIELD_WIDTH_PX,
} from '../gameConfig';
import type { PaddleHandle } from '../components/paddle/paddle';
import { getRandomSign } from '../utils/getRandomSign';
import { hasBallCollidedWithPaddle } from '../utils/hasBallCollidedWithPaddle';

const INITIAL_DIRECTION = { x: 0.7, y: 0.3 };

export interface BallPhysicsState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  setVelocity: (vx: number, vy: number) => void;
  setPosition: (x: number, y: number) => void;
  reset: () => void;
}

interface UseBallPhysicsOptions {
  onScore?: (side: 'left' | 'right') => void; // side that scored
  autoResetDelayMs?: number; // delay before reset after score
  paused?: boolean; // freeze movement (no position updates)
  difficulty?: number; // difficulty multiplier for initial/base speed
}

export function useBallPhysics(
  leftPaddleRef: React.RefObject<PaddleHandle | null>,
  rightPaddleRef: React.RefObject<PaddleHandle | null>,
  options: UseBallPhysicsOptions = {}
): BallPhysicsState {
  const { onScore, autoResetDelayMs = 800, paused = false, difficulty = 1 } = options;
  // Single position state (source of truth for rendering)
  const [position, setPositionState] = useState({
    x: PLAYFIELD_WIDTH_PX / 2,
    y: PLAYFIELD_HEIGHT_PX / 2,
  });

  // Mutable ref for physics integration
  const posRef = useRef(position);
  const velocityRef = useRef({
    vx: getRandomSign() * INITIAL_DIRECTION.x * BALL_INITIAL_SPEED_PX_PER_SEC * difficulty,
    vy: getRandomSign() * INITIAL_DIRECTION.y * BALL_INITIAL_SPEED_PX_PER_SEC * difficulty,
  });
  const prevTsRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const radius = BALL_SIZE_PX / 2;
  const awaitingResetRef = useRef(false);

  const seedVelocity = useCallback(() => {
    velocityRef.current.vx =
      getRandomSign() * INITIAL_DIRECTION.x * BALL_INITIAL_SPEED_PX_PER_SEC * difficulty;
    velocityRef.current.vy =
      getRandomSign() * INITIAL_DIRECTION.y * BALL_INITIAL_SPEED_PX_PER_SEC * difficulty;
  }, [difficulty]);

  const reset = useCallback(() => {
    posRef.current = { x: PLAYFIELD_WIDTH_PX / 2, y: PLAYFIELD_HEIGHT_PX / 2 };
    seedVelocity();
    setPositionState(posRef.current);
  }, [seedVelocity]);

  useEffect(() => {
    const MAX_DT = 0.05; // cap to avoid huge leaps after tab inactive
    const step = (ts: number) => {
      if (prevTsRef.current == null) prevTsRef.current = ts;
      let dt = (ts - prevTsRef.current) / 1000;
      prevTsRef.current = ts;
      if (dt > MAX_DT) dt = MAX_DT;

      if (paused) {
        // Keep timestamps in sync but skip physics integration
        rafIdRef.current = requestAnimationFrame(step);
        return;
      }

      let { vx, vy } = velocityRef.current;
      let nextX = posRef.current.x + vx * dt;
      let nextY = posRef.current.y + vy * dt;
      let collided = false;

      // Vertical walls
      if (nextY - radius < 0) {
        // Bottom collision
        nextY = radius;
        vy = Math.abs(vy);
        collided = true;
      } else if (nextY + radius > PLAYFIELD_HEIGHT_PX) {
        // Top collision
        nextY = PLAYFIELD_HEIGHT_PX - radius;
        vy = -Math.abs(vy);
        collided = true;
      }

      const leftPaddle = leftPaddleRef.current?.getState();
      const rightPaddle = rightPaddleRef.current?.getState();

      const headingLeft = vx < 0;
      const headingRight = vx > 0;

      // Left paddle collision (check crossing boundary to reduce tunneling)
      if (headingLeft && nextX - radius <= PADDLE_WIDTH_PX) {
        if (
          leftPaddle &&
          hasBallCollidedWithPaddle(nextY, leftPaddle.centerY, PADDLE_HEIGHT_PX, radius)
        ) {
          nextX = PADDLE_WIDTH_PX + radius;
          vx = Math.abs(vx);
          collided = true;
        }
      }
      // Right paddle collision
      const rightPaddleX = PLAYFIELD_WIDTH_PX - PADDLE_WIDTH_PX;
      if (headingRight && nextX + radius >= rightPaddleX) {
        if (
          rightPaddle &&
          hasBallCollidedWithPaddle(nextY, rightPaddle.centerY, PADDLE_HEIGHT_PX, radius)
        ) {
          nextX = rightPaddleX - radius;
          vx = -Math.abs(vx);
          collided = true;
        }
      }

      if (awaitingResetRef.current) {
        // Just wait until reset fires
        rafIdRef.current = requestAnimationFrame(step);
        return;
      }

      // Scoring (ball fully crosses boundary) OR bounce if only contacting edge
      const scheduleScoreReset = (scoringSide: 'left' | 'right') => {
        awaitingResetRef.current = true;
        onScore?.(scoringSide);
        velocityRef.current.vx = 0;
        velocityRef.current.vy = 0; // freeze during pause
        setTimeout(() => {
          reset();
          awaitingResetRef.current = false;
        }, autoResetDelayMs);
      };

      const fullyPastLeft = nextX + radius < 0;
      const fullyPastRight = nextX - radius > PLAYFIELD_WIDTH_PX;
      if (fullyPastLeft || fullyPastRight) {
        // If the ball fully passed the left side, it is a score for the right player
        scheduleScoreReset(fullyPastLeft ? 'right' : 'left');
        rafIdRef.current = requestAnimationFrame(step);
        return;
      }

      if (collided) {
        // Velocity changes only if collided
        velocityRef.current.vx = vx;
        velocityRef.current.vy = vy;
      }

      posRef.current = { x: nextX, y: nextY };
      // Push to React state (could throttle if needed)
      setPositionState(posRef.current);

      rafIdRef.current = requestAnimationFrame(step);
    };
    rafIdRef.current = requestAnimationFrame(step);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [leftPaddleRef, rightPaddleRef, radius, onScore, autoResetDelayMs, paused, difficulty, reset]);

  return {
    x: position.x,
    y: position.y,
    vx: velocityRef.current.vx,
    vy: velocityRef.current.vy,
    radius,
    setVelocity: (nvx, nvy) => {
      velocityRef.current.vx = nvx;
      velocityRef.current.vy = nvy;
    },
    setPosition: (x, y) => {
      posRef.current = { x, y };
      setPositionState(posRef.current);
    },
    reset,
  };
}
