import { createContext, useContext, useState } from 'react';
import {
  ListedMatoran,
  MatoranStatus,
  RecruitedMatoran,
} from '../types/Matoran';
import { INITIAL_GAME_STATE } from '../data/matoran';

export type Item = {
  id: string;
};

export type Inventory = Record<Item['id'], number>;

// function removeCharacterFromArray(character: Matoran, array: Matoran[]) {
//   const indexToRemove = array.findIndex((m) => m.id === character.id);

//   return array.filter((_, i) => i !== indexToRemove);
// }

export type GameState = {
  widgets: number;
  inventory: Inventory;
  availableCharacters: ListedMatoran[];
  recruitedCharacters: RecruitedMatoran[];
  recruitCharacter: (character: ListedMatoran) => void;
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
  const [recruitedCharacters, setRecruitedCharacters] = useState<
    RecruitedMatoran[]
  >(INITIAL_GAME_STATE.recruitedCharacters);
  const [availableCharacters] = useState<ListedMatoran[]>(
    INITIAL_GAME_STATE.availableCharacters.filter(
      (m) => !recruitedCharacters.find((c) => c.id === m.id)
    )
  );

  const recruitCharacter = (character: ListedMatoran) => {
    if (widgets >= character.cost) {
      setWidgets(widgets - character.cost);
      const recruitedCharacter: RecruitedMatoran = {
        ...character,
        level: 1,
        exp: 0,
        status: MatoranStatus.Recruited,
      };

      setRecruitedCharacters([...recruitedCharacters, recruitedCharacter]);
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
