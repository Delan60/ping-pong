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
import { moveBall } from '../physics/moveBall';

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

      const leftPaddle = leftPaddleRef.current?.getState();
      const rightPaddle = rightPaddleRef.current?.getState();
  const stepResult = moveBall({
        x: posRef.current.x,
        y: posRef.current.y,
        vx: velocityRef.current.vx,
        vy: velocityRef.current.vy,
        dt,
        leftPaddle: leftPaddle && { centerY: leftPaddle.centerY },
        rightPaddle: rightPaddle && { centerY: rightPaddle.centerY },
        config: {
          radius,
          playfieldWidth: PLAYFIELD_WIDTH_PX,
          playfieldHeight: PLAYFIELD_HEIGHT_PX,
          paddleWidth: PADDLE_WIDTH_PX,
          paddleHeight: PADDLE_HEIGHT_PX,
        },
      });

      if (awaitingResetRef.current) {
        // Just wait until reset fires
        rafIdRef.current = requestAnimationFrame(step);
        return;
      }

      // Scoring (ball fully crosses boundary) OR bounce if only contacting edge
      const scheduleScoreReset = (scoringSide: 'left' | 'right') => {
        awaitingResetRef.current = true;
        onScore?.(scoringSide);
        // Stop the ball from moving
        velocityRef.current.vx = 0;
        velocityRef.current.vy = 0;
        // Move ball fully off-screen on the side it exited to hide it
        if (scoringSide === 'right') {
          posRef.current = { x: -radius * 3, y: posRef.current.y }; // push further left
        } else {
          posRef.current = { x: PLAYFIELD_WIDTH_PX + radius * 3, y: posRef.current.y }; // push further right
        }
        setPositionState(posRef.current);
        setTimeout(() => {
          reset();
          awaitingResetRef.current = false;
        }, autoResetDelayMs);
      };
      if (stepResult.scoredSide) {
        scheduleScoreReset(stepResult.scoredSide);
        rafIdRef.current = requestAnimationFrame(step);
        return;
      }

      velocityRef.current.vx = stepResult.vx;
      velocityRef.current.vy = stepResult.vy;
      posRef.current = { x: stepResult.x, y: stepResult.y };
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
