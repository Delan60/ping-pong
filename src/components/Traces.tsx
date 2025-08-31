import React from 'react';
import { useBallTrail } from '../hooks/useBallTrail';
import { BALL_SIZE_PX } from '../gameConfig';
import styles from './ball.module.css';

export interface TracesProps {
  x: number;
  y: number;
  intervalMs?: number;
  maxDots?: number;
  fadeMs?: number;
  baseOpacity?: number; // starting opacity of newest dot
  shrinkFactor?: number; // proportion of size reduction at end of life (0..1)
}

export const Traces: React.FC<TracesProps> = ({
  x,
  y,
  intervalMs = 30,
  maxDots = 10,
  fadeMs = 200,
  baseOpacity = 0.5,
  shrinkFactor = 0.2,
}) => {
  const dots = useBallTrail(x, y, { intervalMs, maxDots, fadeMs });
  return (
    <>
      {dots.map((d) => {
        const lifeRatio = d.age / fadeMs; // 0..1
        const size = BALL_SIZE_PX * (1 - lifeRatio * shrinkFactor);
        const opacity = Math.max(0, baseOpacity * (1 - lifeRatio));
        return (
          <div
            key={d.id}
            className={styles.trailDot}
            style={{ left: d.x, top: d.y, width: size, height: size, opacity }}
          />
        );
      })}
    </>
  );
};
