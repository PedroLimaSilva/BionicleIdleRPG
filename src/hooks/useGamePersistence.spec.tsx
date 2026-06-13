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
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    const { rerender } = renderHook((props) => useGamePersistence(props), {
      initialProps: baseState,
    });

    rerender({
      ...baseState,
      protodermis: 50,
    });

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 3000);
    expect(await readAssembledGameStateFromDatabase()).toBeNull();

    const debouncedSave = setTimeoutSpy.mock.calls.at(-1)?.[0] as (() => void) | undefined;
    expect(debouncedSave).toBeDefined();

    await act(async () => {
      debouncedSave?.();
      await Promise.resolve();
    });

    const saved = await readAssembledGameStateFromDatabase();
    expect(saved?.protodermis).toBe(50);
    setTimeoutSpy.mockRestore();
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
      await Promise.resolve();
    });

    await waitFor(async () => {
      const saved = await readAssembledGameStateFromDatabase();
      expect(saved?.protodermis).toBe(77);
    });
  });
});
