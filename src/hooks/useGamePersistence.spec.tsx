/**
 * @jest-environment jsdom
 */
import { act, renderHook, waitFor } from '@testing-library/react';
import { useGamePersistence } from './useGamePersistence';
import { CURRENT_GAME_STATE_VERSION } from '../data/gameState';
import { clearGameDatabase, readAssembledGameStateFromDatabase } from '../services/gameDatabase';
import { E2E_FORCE_GAME_STATE_IMPORT_KEY } from '../services/gameDatabase';

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
  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem('TEST_MODE', 'true');
    localStorage.setItem(E2E_FORCE_GAME_STATE_IMPORT_KEY, 'true');
    await clearGameDatabase();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    localStorage.clear();
  });

  test('saves immediately in test mode', async () => {
    const { rerender } = renderHook((props) => useGamePersistence(props), {
      initialProps: baseState,
    });

    rerender({
      ...baseState,
      protodermis: 99,
    });

    await waitFor(async () => {
      const saved = await readAssembledGameStateFromDatabase();
      expect(saved?.protodermis).toBe(99);
    });
  });

  test('debounces saves outside test mode', async () => {
    localStorage.removeItem('TEST_MODE');

    const { rerender } = renderHook((props) => useGamePersistence(props), {
      initialProps: baseState,
    });

    rerender({
      ...baseState,
      protodermis: 50,
    });

    expect(await readAssembledGameStateFromDatabase()).toBeNull();

    act(() => {
      jest.advanceTimersByTime(2999);
    });
    expect(await readAssembledGameStateFromDatabase()).toBeNull();

    await act(async () => {
      jest.advanceTimersByTime(1);
    });

    const saved = await readAssembledGameStateFromDatabase();
    expect(saved?.protodermis).toBe(50);
  });

  test('flushes pending save when the tab becomes hidden', async () => {
    localStorage.removeItem('TEST_MODE');

    const { rerender } = renderHook((props) => useGamePersistence(props), {
      initialProps: baseState,
    });

    rerender({
      ...baseState,
      protodermis: 77,
    });

    await act(async () => {
      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        value: 'hidden',
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    const saved = await readAssembledGameStateFromDatabase();
    expect(saved?.protodermis).toBe(77);
  });
});
