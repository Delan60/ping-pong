/**
 * Central game configuration constants.
 * Keep these in sync with any hard-coded CSS dimensions (e.g. layout.module.css, paddle.module.css).
 */
export const PLAYFIELD_WIDTH_PX = 960;
export const PLAYFIELD_HEIGHT_PX = 600;

export const PADDLE_HEIGHT_PX = 120; // match paddle.module.css height
export const PADDLE_SPEED_PX_PER_SEC = 360; // vertical speed in pixels per second
export const PADDLE_WIDTH_PX = 14; // match paddle.module.css width

export const BALL_SIZE_PX = 18;
export const BALL_INITIAL_SPEED_PX_PER_SEC = 500;
export const BALL_SPEED_INCREMENT = 40; // speed added after each paddle hit (future use)
export const BALL_MAX_SPEED_PX_PER_SEC = 1000;

// export const PADDLE_WIDTH_PX = 12; // if needed in logic

export const WIN_SCORE = 5; // points required to win a match
