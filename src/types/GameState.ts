import { GameItemId } from '../data/loot';
import { Inventory } from '../services/inventoryUtils';
import { MatoranJob } from './Jobs';
import { ActivityLogEntry, LogType } from './Logging';
import { ListedCharacterData, Matoran, RecruitedCharacterData } from './Matoran';
import { Quest, QuestProgress } from './Quests';

export type GameState = {
  version: number;
  widgets: number;
  inventory: Inventory;
  buyableCharacters: ListedCharacterData[];
  recruitedCharacters: RecruitedCharacterData[];
  activeQuests: QuestProgress[];
  completedQuests: string[];
  recruitCharacter: (character: ListedCharacterData) => void;
  addItemToInventory: (item: GameItemId, amount: number) => void;
  assignJobToMatoran: (matoranId: Matoran['id'], job: MatoranJob) => void;
  removeJobFromMatoran: (matoranId: Matoran['id']) => void;
  activityLog: ActivityLogEntry[];
  startQuest: (quest: Quest, assignedMatoran: Matoran['id'][]) => void;
  cancelQuest: (questId: string) => void;
  completeQuest: (quest: Quest) => void;
  addActivityLog: (message: string, type: LogType) => void;
  removeActivityLogEntry: (id: string) => void;
  clearActivityLog: () => void;
};
