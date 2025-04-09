import { GameItemId } from '../data/loot';
import { Inventory } from '../services/inventoryUtils';
import { MatoranJob } from './Jobs';
import { ActivityLogEntry, LogType } from './Logging';
import { ListedMatoran, Matoran, RecruitedMatoran } from './Matoran';
import { Quest, QuestProgress } from './Quests';

export type GameState = {
  version: number;
  widgets: number;
  inventory: Inventory;
  availableCharacters: ListedMatoran[];
  recruitedCharacters: RecruitedMatoran[];
  activeQuests: QuestProgress[];
  completedQuests: string[];
  recruitCharacter: (character: ListedMatoran) => void;
  addItemToInventory: (item: GameItemId, amount: number) => void;
  assignJobToMatoran: (matoranId: Matoran['id'], job: MatoranJob) => void;
  removeJobFromMatoran: (matoranId: Matoran['id']) => void;
  activityLog: ActivityLogEntry[];
  startQuest: (quest: Quest, assignedMatoran: Matoran['id'][]) => void;
  addActivityLog: (message: string, type: LogType) => void;
  removeActivityLogEntry: (id: string) => void;
  clearActivityLog: () => void;
};
