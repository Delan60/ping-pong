import { describe, it, expect } from 'vitest';
import { moveBall, MoveBallConfig } from './moveBall';

const baseConfig: MoveBallConfig = {
  radius: 9, // BALL_SIZE_PX / 2
  playfieldWidth: 900,
  playfieldHeight: 600,
  paddleWidth: 14,
  paddleHeight: 120,
};

describe('moveBall', () => {
  it('advances linearly with no collisions', () => {
    const result = moveBall({
      x: 450,
      y: 300,
      vx: 100,
      vy: 50,
      dt: 0.5,
      config: baseConfig,
    });
    expect(result.x).toBeCloseTo(450 + 100 * 0.5);
    expect(result.y).toBeCloseTo(300 + 50 * 0.5);
    expect(result.scoredSide).toBeUndefined();
  });

  it('bounces off top wall', () => {
    const result = moveBall({
      x: 100,
      y: 10,
      vx: 0,
      vy: -200,
      dt: 0.2,
      config: baseConfig,
    });
    expect(result.y).toBe(baseConfig.radius);
    expect(result.vy).toBeGreaterThan(0);
  });

  it('bounces off bottom wall', () => {
    const result = moveBall({
      x: 100,
      y: baseConfig.playfieldHeight - 5,
      vx: 0,
      vy: 300,
      dt: 0.2,
      config: baseConfig,
    });
    expect(result.y).toBe(baseConfig.playfieldHeight - baseConfig.radius);
    expect(result.vy).toBeLessThan(0);
  });

  it('collides with left paddle when overlapping vertically', () => {
    const result = moveBall({
      x: baseConfig.paddleWidth + baseConfig.radius + 5,
      y: 250,
      vx: -400,
      vy: 0,
      dt: 0.05,
      leftPaddle: { centerY: 250 },
      config: baseConfig,
    });
    expect(result.vx).toBeGreaterThan(0);
    expect(result.scoredSide).toBeUndefined();
  });

  it('collides with right paddle when overlapping vertically', () => {
    const startX = baseConfig.playfieldWidth - baseConfig.paddleWidth - baseConfig.radius - 5;
    const result = moveBall({
      x: startX,
      y: 260,
      vx: 500,
      vy: 0,
      dt: 0.05,
      rightPaddle: { centerY: 260 },
      config: baseConfig,
    });
    expect(result.vx).toBeLessThan(0);
    expect(result.scoredSide).toBeUndefined();
  });

  it('registers score for right side when ball fully exits left', () => {
    const result = moveBall({
      x: 10,
      y: 300,
      vx: -1000,
      vy: 0,
      dt: 0.05,
      config: baseConfig,
    });
    expect(result.scoredSide).toBe('right');
  });

  it('registers score for left side when ball fully exits right', () => {
    const result = moveBall({
      x: baseConfig.playfieldWidth - 10,
      y: 300,
      vx: 1000,
      vy: 0,
      dt: 0.05,
      config: baseConfig,
    });
    expect(result.scoredSide).toBe('left');
  });

  it('does not bounce if paddle not provided', () => {
    const result = moveBall({
      x: baseConfig.paddleWidth + baseConfig.radius + 2,
      y: 300,
      vx: -500,
      vy: 0,
      dt: 0.1,
      config: baseConfig,
    });
    expect(result.vx).toBeLessThan(0);
  });
});
