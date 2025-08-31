import { useEffect, useRef } from 'react';

/** Shape of directional key state returned by the hook. */
export interface DirectionalKeyState {
  up: boolean;
  down: boolean;
  left?: boolean;
  right?: boolean;
}

// Default key mappings for vertical movement. Keeping them centralized avoids
// repeating arrays at every call site and makes future remapping trivial.
const DEFAULT_KEYS: { up: string[]; down: string[] } = {
  up: ['ArrowUp', 'w', 'W'],
  down: ['ArrowDown', 's', 'S'],
};

/**
 * useKeyHold
 * Global keydown/keyup listeners tracking whether movement keys are currently held.
 * Returns a ref whose .current can be read inside animation frames without causing re-renders.
 *
 * For now only up/down are exposed; left/right placeholders kept in the type for easy extension.
 */
export function useKeyHold(customKeys?: { up: string[]; down: string[] }) {
  const stateRef = useRef<DirectionalKeyState>({ up: false, down: false });
  const keys = customKeys ?? DEFAULT_KEYS;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (keys.up.includes(e.key)) stateRef.current.up = true;
      if (keys.down.includes(e.key)) stateRef.current.down = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (keys.up.includes(e.key)) stateRef.current.up = false;
      if (keys.down.includes(e.key)) stateRef.current.down = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keys.up, keys.down]);

  return stateRef;
}
