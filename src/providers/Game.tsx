import { createContext, useContext, useEffect, useState } from 'react';
import {
  ListedMatoran,
  MatoranStatus,
  RecruitedMatoran,
} from '../types/Matoran';
import {
  CURRENT_GAME_STATE_VERSION,
  INITIAL_GAME_STATE,
} from '../data/matoran';
import { MatoranJob } from '../types/Jobs';
import { jobExpRates } from '../game/Jobs';

export type Item = {
  id: string;
};

export type Inventory = Record<Item['id'], number>;

// function removeCharacterFromArray(character: Matoran, array: Matoran[]) {
//   const indexToRemove = array.findIndex((m) => m.id === character.id);

//   return array.filter((_, i) => i !== indexToRemove);
// }

export type GameState = {
  version: number;
  widgets: number;
  inventory: Inventory;
  availableCharacters: ListedMatoran[];
  recruitedCharacters: RecruitedMatoran[];
  recruitCharacter: (character: ListedMatoran) => void;
  addItemToInventory: (item: string, amount: number) => void;
  assignJobToMatoran: (matoranId: number, job: MatoranJob) => void;
  removeJobFromMatoran: (matoranId: number) => void;
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

const STORAGE_KEY = `GAME_STATE`;

function loadGameState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (isValidGameState(parsed)) {
        return parsed;
      } else {
        console.warn('Invalid or outdated game state. Using defaults.', parsed);
      }
    } catch (e) {
      console.error('Failed to parse game state:', e, stored);
    }
  }
  return INITIAL_GAME_STATE;
}

function isValidGameState(data: GameState): data is typeof INITIAL_GAME_STATE {
  return (
    data &&
    typeof data === 'object' &&
    data.version === CURRENT_GAME_STATE_VERSION &&
    typeof data.widgets === 'number' &&
    typeof data.inventory === 'object' &&
    Array.isArray(data.recruitedCharacters)
  );
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  // Only access localStorage once
  const initialState = loadGameState();

  const [version] = useState(initialState.version);
  const [widgets, setWidgets] = useState(initialState.widgets);
  const [inventory, setInventory] = useState<Inventory>(initialState.inventory);
  const [recruitedCharacters, setRecruitedCharacters] = useState<
    RecruitedMatoran[]
  >(initialState.recruitedCharacters);

  const [availableCharacters, setAvailableCharacters] = useState<
    ListedMatoran[]
  >(() => {
    return INITIAL_GAME_STATE.availableCharacters.filter(
      (m) =>
        !initialState.recruitedCharacters.find(
          (c: RecruitedMatoran) => c.id === m.id
        )
    );
  });

  // Save to localStorage on state change
  useEffect(() => {
    const state: Partial<GameState> = {
      version,
      widgets,
      inventory,
      recruitedCharacters,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [widgets, inventory, recruitedCharacters, version]);

  const recruitCharacter = (character: ListedMatoran) => {
    if (widgets >= character.cost) {
      setWidgets(widgets - character.cost);
      const recruitedCharacter: RecruitedMatoran = {
        ...character,
        exp: 0,
        status: MatoranStatus.Recruited,
      };

      setRecruitedCharacters([...recruitedCharacters, recruitedCharacter]);
      setAvailableCharacters(
        availableCharacters.filter((m) => recruitedCharacter.id !== m.id)
      );
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

  const assignJobToMatoran = (id: number, job: MatoranJob) => {
    const expRatePerSecond = jobExpRates[job]; // You'll need to define this object
    const now = Date.now();

    setRecruitedCharacters((prev) =>
      prev.map((matoran) =>
        matoran.id === id
          ? {
              ...matoran,
              assignment: {
                job,
                expRatePerSecond,
                assignedAt: now,
              },
            }
          : matoran
      )
    );
  };

  const removeJobFromMatoran = (id: number) => {
    setRecruitedCharacters((prev) =>
      prev.map((matoran) =>
        matoran.id === id
          ? { ...matoran, assignment: undefined }
          : matoran
      )
    );
  };

  return (
    <GameContext.Provider
      value={{
        version,
        widgets,
        inventory,
        availableCharacters,
        recruitedCharacters,
        recruitCharacter,
        addItemToInventory,
        assignJobToMatoran,
        removeJobFromMatoran,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
