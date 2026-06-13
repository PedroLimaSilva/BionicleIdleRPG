import { createContext, useContext, useEffect, useState } from 'react';
import { GameState, GameStateEditorApi } from '../types/GameState';
import { useGameLogic } from '../hooks/useGameLogic';
import { getInitialLoadedGameState, loadGameStateAsync } from '../services/gamePersistence';
import type { LoadedGameState } from '../services/gamePersistence';
import './GameLoadGate.scss';

export type GameContextValue = GameState & GameStateEditorApi;

const GameContext = createContext<GameContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};

function GameLoadGate({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: LoadedGameState;
}) {
  const game = useGameLogic(initialState);
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
}

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [initialState, setInitialState] = useState<LoadedGameState | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadGameStateAsync().then((state) => {
      if (!cancelled) {
        setInitialState(state);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!initialState) {
    return (
      <div className="game-load-gate" role="status" aria-live="polite" aria-busy="true">
        <div className="game-load-gate__panel">
          <div className="game-load-gate__spinner" aria-hidden="true" />
          <p className="game-load-gate__text">Loading your save...</p>
        </div>
      </div>
    );
  }

  return <GameLoadGate initialState={initialState}>{children}</GameLoadGate>;
};

/** Test-only provider that skips async IndexedDB hydration. */
export const GameProviderWithState = ({
  children,
  initialState = getInitialLoadedGameState(),
}: {
  children: React.ReactNode;
  initialState?: LoadedGameState;
}) => {
  return <GameLoadGate initialState={initialState}>{children}</GameLoadGate>;
};
