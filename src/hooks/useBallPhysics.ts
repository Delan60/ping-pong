import { useEffect, useRef, useState } from 'react';
import { BALL_INITIAL_SPEED_PX_PER_SEC, BALL_SIZE_PX, PADDLE_HEIGHT_PX, PADDLE_WIDTH_PX, PLAYFIELD_HEIGHT_PX, PLAYFIELD_WIDTH_PX } from '../gameConfig';
import type { PaddleHandle } from '../components/paddle';

const INITIAL_DIRECTION = { x: 0.7, y: 0.3 };

export interface BallPhysicsState {
  x: number; y: number; vx: number; vy: number; radius: number;
  setVelocity: (vx: number, vy: number) => void;
  setPosition: (x: number, y: number) => void;
  reset: () => void;
}

interface UseBallPhysicsOptions {
  onScore?: (side: 'left' | 'right') => void; // side that scored
  autoResetDelayMs?: number; // delay before reset after score
}

export function useBallPhysics(
  leftPaddleRef: React.RefObject<PaddleHandle | null>,
  rightPaddleRef: React.RefObject<PaddleHandle | null>,
  options: UseBallPhysicsOptions = {}
): BallPhysicsState {
  const { onScore, autoResetDelayMs = 800 } = options;
  // Render-state (derived from refs each frame)
  const [renderX, setRenderX] = useState(PLAYFIELD_WIDTH_PX / 2);
  const [renderY, setRenderY] = useState(PLAYFIELD_HEIGHT_PX / 2);
  // Authoritative mutable refs
  const xRef = useRef(renderX);
  const yRef = useRef(renderY);
  const velocityRef = useRef({
    vx: INITIAL_DIRECTION.x * BALL_INITIAL_SPEED_PX_PER_SEC,
    vy: INITIAL_DIRECTION.y * BALL_INITIAL_SPEED_PX_PER_SEC,
  });
  const prevTsRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const radius = BALL_SIZE_PX / 2;
  const awaitingResetRef = useRef(false);

  const reset = () => {
    xRef.current = PLAYFIELD_WIDTH_PX / 2;
    yRef.current = PLAYFIELD_HEIGHT_PX / 2;
    velocityRef.current.vx = INITIAL_DIRECTION.x * BALL_INITIAL_SPEED_PX_PER_SEC * (Math.random() < 0.5 ? -1 : 1);
    velocityRef.current.vy = INITIAL_DIRECTION.y * BALL_INITIAL_SPEED_PX_PER_SEC * (Math.random() < 0.5 ? -1 : 1);
    setRenderX(xRef.current);
    setRenderY(yRef.current);
  };

  useEffect(() => {
    const MAX_DT = 0.05; // cap to avoid huge leaps after tab inactive
    const step = (ts: number) => {
      if (prevTsRef.current == null) prevTsRef.current = ts;
      let dt = (ts - prevTsRef.current) / 1000;
      prevTsRef.current = ts;
      if (dt > MAX_DT) dt = MAX_DT;

      let { vx, vy } = velocityRef.current;
      let nx = xRef.current + vx * dt;
      let ny = yRef.current + vy * dt;
      let collided = false;

      // Vertical walls
      if (ny - radius < 0) { ny = radius; vy = Math.abs(vy); collided = true; }
      else if (ny + radius > PLAYFIELD_HEIGHT_PX) { ny = PLAYFIELD_HEIGHT_PX - radius; vy = -Math.abs(vy); collided = true; }

      const leftPaddle = leftPaddleRef.current?.getState();
      const rightPaddle = rightPaddleRef.current?.getState();

      // Left paddle collision (check crossing boundary to reduce tunneling)
      if (vx < 0 && nx - radius <= PADDLE_WIDTH_PX) {
        if (leftPaddle && Math.abs(ny - leftPaddle.centerY) <= PADDLE_HEIGHT_PX / 2 + radius) {
          nx = PADDLE_WIDTH_PX + radius; vx = Math.abs(vx); collided = true; }
      }
      // Right paddle collision
      const rightPaddleX = PLAYFIELD_WIDTH_PX - PADDLE_WIDTH_PX;
      if (vx > 0 && nx + radius >= rightPaddleX) {
        if (rightPaddle && Math.abs(ny - rightPaddle.centerY) <= PADDLE_HEIGHT_PX / 2 + radius) {
          nx = rightPaddleX - radius; vx = -Math.abs(vx); collided = true; }
      }

      // Scoring (ball fully crosses boundary) OR bounce if only contacting edge
      const fullyPastLeft = nx + radius < 0;
      const fullyPastRight = nx - radius > PLAYFIELD_WIDTH_PX;
      if (awaitingResetRef.current) {
        // Just wait until reset fires
        rafIdRef.current = requestAnimationFrame(step);
        return;
      }
      if (fullyPastLeft) {
        awaitingResetRef.current = true;
        onScore?.('right');
        velocityRef.current.vx = 0; velocityRef.current.vy = 0; // freeze
        setTimeout(() => { reset(); awaitingResetRef.current = false; }, autoResetDelayMs);
        rafIdRef.current = requestAnimationFrame(step);
        return;
      }
      if (fullyPastRight) {
        awaitingResetRef.current = true;
        onScore?.('left');
        velocityRef.current.vx = 0; velocityRef.current.vy = 0;
        setTimeout(() => { reset(); awaitingResetRef.current = false; }, autoResetDelayMs);
        rafIdRef.current = requestAnimationFrame(step);
        return;
      }

      if (collided) {
        velocityRef.current.vx = vx;
        velocityRef.current.vy = vy;
      }

      xRef.current = nx;
      yRef.current = ny;
      // Push to React state (could throttle if needed)
      setRenderX(nx);
      setRenderY(ny);

      rafIdRef.current = requestAnimationFrame(step);
    };
    rafIdRef.current = requestAnimationFrame(step);
    return () => { if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current); };
  }, [leftPaddleRef, rightPaddleRef, radius, onScore, autoResetDelayMs]);

  return {
    x: renderX,
    y: renderY,
    vx: velocityRef.current.vx,
    vy: velocityRef.current.vy,
    radius,
    setVelocity: (nvx, nvy) => { velocityRef.current.vx = nvx; velocityRef.current.vy = nvy; },
    setPosition: (nx, ny) => { xRef.current = nx; yRef.current = ny; setRenderX(nx); setRenderY(ny); },
    reset,
  };
}
