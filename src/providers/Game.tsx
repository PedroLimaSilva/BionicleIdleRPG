import { createContext, useContext, useEffect, useState } from 'react';
import {
  ListedMatoran,
  MatoranStatus,
  RecruitedMatoran,
} from '../types/Matoran';
import { MatoranJob } from '../types/Jobs';
import {
  applyJobExp,
  applyOfflineJobExp,
  getProductivityModifier,
} from '../game/Jobs';
import { JOB_DETAILS } from '../data/jobs';
import { StoryProgression } from '../game/story';
import { ActivityLogEntry, LogType } from '../types/Logging';
import {
  CURRENT_GAME_STATE_VERSION,
  INITIAL_GAME_STATE,
} from '../data/gameState';

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
  storyProgress: StoryProgression[];
  recruitCharacter: (character: ListedMatoran) => void;
  addItemToInventory: (item: string, amount: number) => void;
  assignJobToMatoran: (matoranId: number, job: MatoranJob) => void;
  removeJobFromMatoran: (matoranId: number) => void;
  tickJobExp: () => void;
  activityLog: ActivityLogEntry[];
  addActivityLog: (message: string, type: LogType) => void;
  removeActivityLogEntry: (id: string) => void;
  clearActivityLog: () => void;
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
        const [recruitedCharacters, logs] = applyOfflineJobExp(
          parsed.recruitedCharacters
        );

        return {
          ...parsed,
          recruitedCharacters,
          activityLog: logs,
        };
      }
    } catch (e) {
      console.error('Failed to parse game state:', e);
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
  const [initialState] = useState(() => loadGameState());

  const [version] = useState(initialState.version);

  const [activityLog, setActivityLog] = useState(initialState.activityLog);
  const [storyProgress] = useState(initialState.storyProgress);
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
      activityLog: [],
      widgets,
      inventory,
      recruitedCharacters,
      storyProgress,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [storyProgress, widgets, inventory, recruitedCharacters, version]);

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
    const baseRate = JOB_DETAILS[job].rate;
    const now = Date.now();

    setRecruitedCharacters((prev) =>
      prev.map((matoran) =>
        matoran.id === id
          ? {
              ...matoran,
              assignment: {
                job,
                expRatePerSecond:
                  baseRate * getProductivityModifier(job, matoran),
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
        matoran.id === id ? { ...matoran, assignment: undefined } : matoran
      )
    );
  };

  const tickJobExp = () => {
    const now = Date.now();
    setRecruitedCharacters((prev) =>
      prev.map((m) => {
        const [updated, earned] = applyJobExp(m, now);
        if (earned > 0) {
          addActivityLog(`${m.name} gained ${earned} EXP`, LogType.Event);
        }
        return updated;
      })
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      tickJobExp();
    }, 5000); // or whatever interval makes sense

    return () => clearInterval(interval); // cleanup on unmount
  });

  const addActivityLog = (message: string, type: LogType) => {
    setActivityLog((log: ActivityLogEntry[]) => [
      ...log,
      {
        id: crypto.randomUUID(),
        message,
        type,
        timestamp: Date.now(),
      } as ActivityLogEntry,
    ]);
  };

  const removeActivityLogEntry = (id: string) => {
    setActivityLog((log) => log.filter((entry) => entry.id !== id));
  };

  const clearActivityLog = () => {
    setActivityLog([]);
  };

  return (
    <GameContext.Provider
      value={{
        storyProgress,
        activityLog,
        version,
        widgets,
        inventory,
        availableCharacters,
        recruitedCharacters,
        recruitCharacter,
        addItemToInventory,
        assignJobToMatoran,
        removeJobFromMatoran,
        tickJobExp,
        clearActivityLog,
        addActivityLog,
        removeActivityLogEntry,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
