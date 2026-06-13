/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { useGamePersistence } from './useGamePersistence';
import { CURRENT_GAME_STATE_VERSION } from '../data/gameState';
import { STORAGE_KEY } from '../services/gamePersistence';

const baseState = {
  activeQuests: [],
  collectedKrana: {},
  completedQuests: [],
  customCharacters: [],
  kraataCollection: {},
  protodermis: 10,
  protodermisCap: 2000,
  rahkshi: [],
  recruitedCharacters: [{ exp: 0, id: 'Jala' }],
  version: CURRENT_GAME_STATE_VERSION,
};

describe('useGamePersistence', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
    localStorage.setItem('TEST_MODE', 'true');
  });

  afterEach(() => {
    jest.useRealTimers();
    localStorage.clear();
  });

  test('saves immediately in test mode', () => {
    const { rerender } = renderHook((props) => useGamePersistence(props), {
      initialProps: baseState,
    });

    rerender({
      ...baseState,
      protodermis: 99,
    });

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    expect(saved.protodermis).toBe(99);
  });

  test('debounces saves outside test mode', () => {
    localStorage.removeItem('TEST_MODE');

    const { rerender } = renderHook((props) => useGamePersistence(props), {
      initialProps: baseState,
    });

    rerender({
      ...baseState,
      protodermis: 50,
    });

    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();

    act(() => {
      jest.advanceTimersByTime(2999);
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();

    act(() => {
      jest.advanceTimersByTime(1);
    });

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    expect(saved.protodermis).toBe(50);
  });

  test('flushes pending save when the tab becomes hidden', () => {
    localStorage.removeItem('TEST_MODE');

    const { rerender } = renderHook((props) => useGamePersistence(props), {
      initialProps: baseState,
    });

    rerender({
      ...baseState,
      protodermis: 77,
    });

    act(() => {
      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        value: 'hidden',
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    expect(saved.protodermis).toBe(77);
  });
});
