import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMatch } from './useMatch';

describe('useMatch', () => {
  it('initial state before beginMatch', () => {
    const { result, unmount } = renderHook(() => useMatch({ winScore: 3 }));
    expect(result.current.awaitingStart).toBe(true);
    expect(result.current.leftScore).toBe(0);
    expect(result.current.rightScore).toBe(0);
    unmount();
  });

  it('beginMatch resets scores and clears winner', () => {
    vi.useFakeTimers();
    vi.setSystemTime(1000);
  const { result, rerender, unmount } = renderHook(() => useMatch({ winScore: 2 }));
    act(() => {
      result.current.beginMatch();
    });
    rerender();
    expect(result.current.awaitingStart).toBe(false);
    expect(result.current.winnerSide).toBeUndefined();
    expect(result.current.leftScore).toBe(0);
    expect(result.current.rightScore).toBe(0);
    vi.useRealTimers();
    unmount();
  });

  it('increments scores and declares winner at winScore', () => {
    vi.useFakeTimers();
    vi.setSystemTime(2000);
  const { result, rerender, unmount } = renderHook(() => useMatch({ winScore: 2 }));
    act(() => {
      result.current.beginMatch();
    });
    rerender();
    act(() => {
      result.current.handleScore('left');
    });
    rerender();
    expect(result.current.leftScore).toBe(1);
    expect(result.current.winnerSide).toBeUndefined();
    vi.setSystemTime(3500);
    act(() => {
      result.current.handleScore('left');
    });
    rerender();
    expect(result.current.leftScore).toBe(2);
    expect(result.current.winnerSide).toBe('left');
    expect(result.current.awaitingStart).toBe(true);
    expect(result.current.lastMatchDurationMs).toBe(1500);
    const prev = result.current.leftScore;
    act(() => {
      result.current.handleScore('left');
    });
    rerender();
    expect(result.current.leftScore).toBe(prev);
    vi.useRealTimers();
    unmount();
  });

  it('ignores scoring before match starts', () => {
  const { result, rerender, unmount } = renderHook(() => useMatch({ winScore: 1 }));
    act(() => {
      result.current.handleScore('right');
    });
    rerender();
    expect(result.current.rightScore).toBe(0);
    unmount();
  });
});
