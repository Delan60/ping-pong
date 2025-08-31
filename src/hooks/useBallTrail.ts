import { useEffect, useRef, useState } from 'react';

export interface TrailDot {
  id: number;
  x: number;
  y: number;
  age: number;
}

interface Options {
  intervalMs?: number; // sampling interval
  maxDots?: number; // cap
  fadeMs?: number; // total lifetime
}

export function useBallTrail(
  x: number,
  y: number,
  { intervalMs = 40, maxDots = 20, fadeMs = 600 }: Options = {}
) {
  const [dots, setDots] = useState<TrailDot[]>([]);
  const lastSampleRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const step = () => {
      const now = Date.now();
      // Age existing dots age = now - d.id and filter dots older than fadeMs
      setDots((prev) =>
        prev
          .map((d) => ({ ...d, age: now - d.id })) // using id as timestamp base (monotonic)
          .filter((d) => now - d.id < fadeMs)
      );
      // If more than intervalMs has passed from last sample, append a new dot
      if (now - lastSampleRef.current >= intervalMs) {
        lastSampleRef.current = now;
        setDots((prev) => {
          const next: TrailDot[] = [...prev, { id: now, x, y, age: 0 }];
          // ensure that we only store maxDots dots
          if (next.length > maxDots) next.splice(0, next.length - maxDots);
          return next;
        });
      }
      rafIdRef.current = requestAnimationFrame(step);
    };
    rafIdRef.current = requestAnimationFrame(step);
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [x, y, intervalMs, maxDots, fadeMs]);

  return dots;
}
