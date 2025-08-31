import { useEffect, useRef, useState } from 'react';

export interface TrailDot { id: number; x: number; y: number; age: number; }

interface Options {
  intervalMs?: number; // sampling interval
  maxDots?: number; // cap
  fadeMs?: number; // total lifetime
}

export function useBallTrail(x: number, y: number, { intervalMs = 40, maxDots = 20, fadeMs = 600 }: Options = {}) {
  const [dots, setDots] = useState<TrailDot[]>([]);
  const lastSampleRef = useRef<number>(0);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const now = performance.now();
      // age update
      setDots(prev => prev
        .map(d => ({ ...d, age: now - d.id })) // using id as timestamp base (monotonic)
        .filter(d => now - d.id < fadeMs));
      // sample
      if (now - lastSampleRef.current >= intervalMs) {
        lastSampleRef.current = now;
        setDots(prev => {
          const next: TrailDot[] = [...prev, { id: now, x, y, age: 0 }];
          if (next.length > maxDots) next.splice(0, next.length - maxDots);
          return next;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [x, y, intervalMs, maxDots, fadeMs]);

  return dots;
}
