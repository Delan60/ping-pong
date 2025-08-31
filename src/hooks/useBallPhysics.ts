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

export function useBallPhysics(leftPaddleRef: React.RefObject<PaddleHandle | null>, rightPaddleRef: React.RefObject<PaddleHandle | null>): BallPhysicsState {
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

      // Horizontal walls (missed paddles) ensure containment
      if (nx - radius < 0) { nx = radius; vx = Math.abs(vx); collided = true; }
      else if (nx + radius > PLAYFIELD_WIDTH_PX) { debugger; nx = PLAYFIELD_WIDTH_PX - radius; vx = -Math.abs(vx); collided = true; }

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
  }, [leftPaddleRef, rightPaddleRef, radius]);

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
