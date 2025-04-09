import { createContext, useContext } from 'react';
import { GameState } from '../types/GameState';
import { useGameLogic } from '../hooks/useGameLogic';

const GameContext = createContext<GameState | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const game = useGameLogic();

  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
};
