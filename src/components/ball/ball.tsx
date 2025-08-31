import styles from './ball.module.css';
import { BALL_SIZE_PX } from '../../gameConfig';

export interface BallProps {
  x: number; // center x
  y: number; // center y
}

export function Ball({ x, y }: BallProps) {
  const style: React.CSSProperties = {
    width: BALL_SIZE_PX,
    height: BALL_SIZE_PX,
    left: x - BALL_SIZE_PX / 2,
    top: y - BALL_SIZE_PX / 2,
  };
  return <div className={styles.ball} style={style} aria-label="ball" role="presentation" />;
}
