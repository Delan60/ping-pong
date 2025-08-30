import { useEffect, useRef, useState, type FC } from 'react';
import { useKeyHold } from '../hooks/useKeyHold';
import styles from './paddle.module.css';
import { PLAYFIELD_HEIGHT_PX, PADDLE_HEIGHT_PX, PADDLE_SPEED_PX_PER_SEC } from '../gameConfig';

export const Paddle: FC = () => {
	/** Center Y position of the paddle (in pixels, relative to top of playfield). */
	const [paddleCenterY, setPaddleCenterY] = useState(PLAYFIELD_HEIGHT_PX / 2);

	/** Timing refs; key state comes from reusable hook. */
	const keyStateRef = useKeyHold();
	const previousFrameTimestampRef = useRef<number | null>(null);
	const animationFrameIdRef = useRef<number | null>(null);

	/** Precomputed clamping bounds so paddle stays inside playfield. */
	const minimumCenterY = PADDLE_HEIGHT_PX / 2;
	const maximumCenterY = PLAYFIELD_HEIGHT_PX - PADDLE_HEIGHT_PX / 2;
	const clampCenterY = (value: number) => Math.min(maximumCenterY, Math.max(minimumCenterY, value));

	// Animation loop: converts elapsed time into movement for smooth, framerate‑independent motion.
	useEffect(() => {
		const step = (timestamp: number) => {
			if (previousFrameTimestampRef.current == null) previousFrameTimestampRef.current = timestamp;
			const deltaSeconds = (timestamp - previousFrameTimestampRef.current) / 1000;
			previousFrameTimestampRef.current = timestamp;

			let movementDelta = 0;
			const { up, down } = keyStateRef.current;
			if (up && !down) movementDelta = -PADDLE_SPEED_PX_PER_SEC * deltaSeconds;
			else if (down && !up) movementDelta = PADDLE_SPEED_PX_PER_SEC * deltaSeconds;

			if (movementDelta !== 0) {
				setPaddleCenterY(prev => clampCenterY(prev + movementDelta));
			}

			animationFrameIdRef.current = requestAnimationFrame(step);
		};
		animationFrameIdRef.current = requestAnimationFrame(step);
		return () => { if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current); };
	}, []);

	/** Convert current center to a percentage for positioning with translateY(-50%). */
	const topPercent = (paddleCenterY / PLAYFIELD_HEIGHT_PX) * 100;

	return <div className={styles.paddle} style={{ height: `${PADDLE_HEIGHT_PX}px`, top: `${topPercent}%` }} aria-label="player paddle" role="presentation" />;
};
