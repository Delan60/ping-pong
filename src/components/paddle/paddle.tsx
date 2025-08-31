import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useKeyHold } from '../../hooks/useKeyHold';
import styles from './paddle.module.css';
import { PLAYFIELD_HEIGHT_PX, PADDLE_HEIGHT_PX, PADDLE_SPEED_PX_PER_SEC } from '../../gameConfig';

export interface PaddleHandle {
  getState(): { centerY: number; side: 'left' | 'right' };
}

export interface PaddleProps {
  side: 'left' | 'right';
  ariaLabel: string;
  keyMapping?: { up: string[]; down: string[] };
}

export const Paddle = forwardRef<PaddleHandle, PaddleProps>(
  ({ side, ariaLabel, keyMapping }, ref) => {
    const [paddleCenterY, setPaddleCenterY] = useState(PLAYFIELD_HEIGHT_PX / 2);
    const keyStateRef = useKeyHold(keyMapping);
    const previousFrameTimestampRef = useRef<number | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);

    const minimumCenterY = PADDLE_HEIGHT_PX / 2;
    const maximumCenterY = PLAYFIELD_HEIGHT_PX - PADDLE_HEIGHT_PX / 2;
    const clampCenterY = useCallback(
      (value: number) => Math.min(maximumCenterY, Math.max(minimumCenterY, value)),
      [maximumCenterY, minimumCenterY]
    );

    useEffect(() => {
      const step = (timestamp: number) => {
        if (previousFrameTimestampRef.current == null)
          previousFrameTimestampRef.current = timestamp;
        const deltaSeconds = (timestamp - previousFrameTimestampRef.current) / 1000;
        previousFrameTimestampRef.current = timestamp;

        let movementDelta = 0;
        const { up, down } = keyStateRef.current;
        if (up && !down) movementDelta = -PADDLE_SPEED_PX_PER_SEC * deltaSeconds;
        else if (down && !up) movementDelta = PADDLE_SPEED_PX_PER_SEC * deltaSeconds;

        if (movementDelta !== 0) {
          setPaddleCenterY((prev) => clampCenterY(prev + movementDelta));
        }

        animationFrameIdRef.current = requestAnimationFrame(step);
      };
      animationFrameIdRef.current = requestAnimationFrame(step);
      return () => {
        if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      };
    }, [keyStateRef, clampCenterY]);

    const topPercent = (paddleCenterY / PLAYFIELD_HEIGHT_PX) * 100;
    const edgeClass = side === 'left' ? styles.leftEdge : styles.rightEdge;
    useImperativeHandle(ref, () => ({ getState: () => ({ centerY: paddleCenterY, side }) }), [
      paddleCenterY,
      side,
    ]);

    return (
      <div
        className={`${styles.paddle} ${edgeClass}`}
        style={{ height: `${PADDLE_HEIGHT_PX}px`, top: `${topPercent}%` }}
        aria-label={ariaLabel}
        role="presentation"
      />
    );
  }
);
