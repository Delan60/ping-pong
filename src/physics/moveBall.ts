import { hasBallCollidedWithPaddle } from '../utils/hasBallCollidedWithPaddle';

export interface PaddleSnapshot {
  centerY: number;
}

export interface MoveBallConfig {
  radius: number;
  playfieldWidth: number;
  playfieldHeight: number;
  paddleWidth: number;
  paddleHeight: number;
}

export interface MoveBallInput {
  x: number;
  y: number;
  vx: number;
  vy: number;
  dt: number; // seconds
  leftPaddle?: PaddleSnapshot;
  rightPaddle?: PaddleSnapshot;
  config: MoveBallConfig;
}

export interface MoveBallResult {
  x: number;
  y: number;
  vx: number;
  vy: number;
  scoredSide?: 'left' | 'right'; // side awarded the point
}

/**
 * Pure physics integration for one frame of ball movement.
 * Handles wall + paddle collisions and detects scoring events.
 */
export function moveBall(input: MoveBallInput): MoveBallResult {
  const { x, y, vx, vy, dt, leftPaddle, rightPaddle, config } = input;
  const { radius, playfieldWidth, playfieldHeight, paddleWidth, paddleHeight } = config;

  let nextX = x + vx * dt;
  let nextY = y + vy * dt;
  let nextVx = vx;
  let nextVy = vy;

  // Top / bottom walls
  if (nextY - radius < 0) {
    nextY = radius;
    nextVy = Math.abs(nextVy);
  } else if (nextY + radius > playfieldHeight) {
    nextY = playfieldHeight - radius;
    nextVy = -Math.abs(nextVy);
  }

  const headingLeft = nextVx < 0;
  const headingRight = nextVx > 0;

  // Left paddle collision (boundary = paddleWidth)
  if (headingLeft && nextX - radius <= paddleWidth) {
    if (leftPaddle && hasBallCollidedWithPaddle(nextY, leftPaddle.centerY, paddleHeight, radius)) {
      nextX = paddleWidth + radius; // place just outside paddle
      nextVx = Math.abs(nextVx);
    }
  }

  // Right paddle collision
  const rightPaddleX = playfieldWidth - paddleWidth;
  if (headingRight && nextX + radius >= rightPaddleX) {
    if (rightPaddle && hasBallCollidedWithPaddle(nextY, rightPaddle.centerY, paddleHeight, radius)) {
      nextX = rightPaddleX - radius;
      nextVx = -Math.abs(nextVx);
    }
  }

  // Scoring detection (fully past side boundaries)
  const fullyPastLeft = nextX + radius < 0;
  const fullyPastRight = nextX - radius > playfieldWidth;
  if (fullyPastLeft) {
    return { x: nextX, y: nextY, vx: nextVx, vy: nextVy, scoredSide: 'right' };
  }
  if (fullyPastRight) {
    return { x: nextX, y: nextY, vx: nextVx, vy: nextVy, scoredSide: 'left' };
  }

  return { x: nextX, y: nextY, vx: nextVx, vy: nextVy };
}
