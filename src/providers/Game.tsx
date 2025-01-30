import { createContext, useContext, useState } from 'react';
import { Matoran } from '../types/Matoran';
import { INITIAL_GAME_STATE } from '../data/matoran';

export type Item = {
  id: string;
};

export type Inventory = Record<Item['id'], number>;

function removeCharacterFromArray(character: Matoran, array: Matoran[]) {
  const indexToRemove = array.findIndex((m) => m.id === character.id);

  return array.filter((_, i) => i !== indexToRemove);
}

export type GameState = {
  widgets: number;
  inventory: Inventory;
  availableCharacters: Matoran[];
  recruitedCharacters: Matoran[];
  recruitCharacter: (character: Matoran, cost: number) => void;
  addItemToInventory: (item: string, amount: number) => void;
};

const GameContext = createContext<GameState | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [widgets, setWidgets] = useState(INITIAL_GAME_STATE.widgets);
  const [inventory, setInventory] = useState<Inventory>(
    INITIAL_GAME_STATE.inventory
  );
  const [recruitedCharacters, setRecruitedCharacters] = useState<Matoran[]>(
    INITIAL_GAME_STATE.recruitedCharacters
  );
  const [availableCharacters] = useState<Matoran[]>(
    INITIAL_GAME_STATE.availableCharacters.filter(
      (m) => !recruitedCharacters.find((c) => c.id === m.id)
    )
  );

  const recruitCharacter = (character: Matoran, cost: number) => {
    if (widgets >= cost) {
      setWidgets(widgets - cost);
      setRecruitedCharacters([...recruitedCharacters, character]);
    } else {
      alert('Not enough widgets!');
    }
  };

  const addItemToInventory = (item: string, amount: number) => {
    setInventory((prevInventory) => ({
      ...prevInventory,
      [item]: (prevInventory[item] || 0) + amount,
    }));
  };

  return (
    <GameContext.Provider
      value={{
        widgets,
        inventory,
        availableCharacters,
        recruitedCharacters,
        recruitCharacter,
        addItemToInventory,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
