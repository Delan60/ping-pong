import { useEffect, useRef, useState } from 'react';
import {
  BALL_INITIAL_SPEED_PX_PER_SEC,
  PLAYFIELD_WIDTH_PX,
  PLAYFIELD_HEIGHT_PX,
  BALL_SIZE_PX,
} from '../gameConfig';

const INITIAL_DIRECTION = { x: 0.7, y: 0.3 };

export interface BallMotionState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  setVelocity: (vx: number, vy: number) => void;
  setPosition: (x: number, y: number) => void;
}

export function useBallMovement(): BallMotionState {
  const [x, setX] = useState(PLAYFIELD_WIDTH_PX / 2);
  const [y, setY] = useState(PLAYFIELD_HEIGHT_PX / 2);
  const velocityRef = useRef({
    vx: INITIAL_DIRECTION.x * BALL_INITIAL_SPEED_PX_PER_SEC,
    vy: INITIAL_DIRECTION.y * BALL_INITIAL_SPEED_PX_PER_SEC,
  });
  const prevTsRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const step = (ts: number) => {
      if (prevTsRef.current == null) prevTsRef.current = ts;
      const dt = (ts - prevTsRef.current) / 1000;
      prevTsRef.current = ts;

      let { vx, vy } = velocityRef.current;
      if (vx === 0 && vy === 0) {
        vx = INITIAL_DIRECTION.x * BALL_INITIAL_SPEED_PX_PER_SEC;
        vy = INITIAL_DIRECTION.y * BALL_INITIAL_SPEED_PX_PER_SEC;
      }
      setX((prev) => prev + vx * dt);
      setY((prev) => prev + vy * dt);
      velocityRef.current.vx = vx;
      velocityRef.current.vy = vy;
      rafIdRef.current = requestAnimationFrame(step);
    };
    rafIdRef.current = requestAnimationFrame(step);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return {
    x,
    y,
    vx: velocityRef.current.vx,
    vy: velocityRef.current.vy,
    radius: BALL_SIZE_PX / 2,
    setVelocity: (vx, vy) => {
      velocityRef.current.vx = vx;
      velocityRef.current.vy = vy;
    },
    setPosition: (nx, ny) => {
      setX(nx);
      setY(ny);
    },
  };
}
