/**
 * Returns true if the ball (given its center y and radius) overlaps the paddle's vertical span
 * including its radius extension (simple AABB overlap on Y axis for circle vs rect edge).
 */
export function hasBallCollidedWithPaddle(ballCenterY: number, paddleCenterY: number, paddleHeight: number, ballRadius: number): boolean {
  return Math.abs(ballCenterY - paddleCenterY) <= paddleHeight / 2 + ballRadius;
}
