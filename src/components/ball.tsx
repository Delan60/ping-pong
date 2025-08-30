import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import styles from './ball.module.css';
import { PLAYFIELD_WIDTH_PX, PLAYFIELD_HEIGHT_PX, BALL_SIZE_PX, BALL_INITIAL_SPEED_PX_PER_SEC } from '../gameConfig';

// Simple initial direction (down-right); could be randomized later.
const INITIAL_DIRECTION = { x: 0.7, y: 0.3 };

export interface BallHandle {
  getState(): { x: number; y: number; vx: number; vy: number; radius: number };
  setVelocity(vx: number, vy: number): void;
  setPosition(x: number, y: number): void;
}

export const Ball = forwardRef<BallHandle>(function Ball(_props, ref) {
  // Center position in pixels
  const [x, setX] = useState(PLAYFIELD_WIDTH_PX / 2);
  const [y, setY] = useState(PLAYFIELD_HEIGHT_PX / 2);

  // Velocity components (pixels per second)
  const velocityRef = useRef({
    vx: INITIAL_DIRECTION.x * BALL_INITIAL_SPEED_PX_PER_SEC,
    vy: INITIAL_DIRECTION.y * BALL_INITIAL_SPEED_PX_PER_SEC,
  });

  const previousTimestampRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const step = (ts: number) => {
      if (previousTimestampRef.current == null) previousTimestampRef.current = ts;
      const delta = (ts - previousTimestampRef.current) / 1000;
      previousTimestampRef.current = ts;

  let { vx, vy } = velocityRef.current;
      // Safety: if velocity somehow zeroed out, reinitialize so ball moves.
      if (vx === 0 && vy === 0) {
        vx = INITIAL_DIRECTION.x * BALL_INITIAL_SPEED_PX_PER_SEC;
        vy = INITIAL_DIRECTION.y * BALL_INITIAL_SPEED_PX_PER_SEC;
      }

  setX(prevX => prevX + vx * delta);

  setY(prevY => prevY + vy * delta);

      velocityRef.current.vx = vx;
      velocityRef.current.vy = vy;

      rafIdRef.current = requestAnimationFrame(step);
    };
    rafIdRef.current = requestAnimationFrame(step);
    return () => { if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current); };
  }, []);

  const style: React.CSSProperties = {
    width: BALL_SIZE_PX,
    height: BALL_SIZE_PX,
    left: x - BALL_SIZE_PX / 2,
    top: y - BALL_SIZE_PX / 2,
  };

  useImperativeHandle(ref, (): BallHandle => ({
    getState: () => ({ x, y, vx: velocityRef.current.vx, vy: velocityRef.current.vy, radius: BALL_SIZE_PX / 2 }),
    setVelocity: (nvx, nvy) => { velocityRef.current.vx = nvx; velocityRef.current.vy = nvy; },
    setPosition: (nx, ny) => { setX(nx); setY(ny); }
  }), [x, y]);

  return <div className={styles.ball} style={style} aria-label="ball" role="presentation" />;
});
