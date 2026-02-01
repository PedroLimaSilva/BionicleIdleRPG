import { GameItemId } from '../data/loot';
import { BattleState } from '../hooks/useBattleState';
import { Inventory } from '../services/inventoryUtils';
import { LegoColor } from './Colors';
import { MatoranJob } from './Jobs';
import { ActivityLogEntry, LogType } from './Logging';
import { ListedCharacterData, Mask, RecruitedCharacterData } from './Matoran';
import { Quest, QuestProgress } from './Quests';

export type GameState = {
  version: number;
  widgets: number;
  widgetCap: number;
  inventory: Inventory;
  buyableCharacters: ListedCharacterData[];
  recruitedCharacters: RecruitedCharacterData[];
  activeQuests: QuestProgress[];
  completedQuests: string[];
  battle: BattleState,
  recruitCharacter: (character: ListedCharacterData) => void;
  setMaskOverride: (id: RecruitedCharacterData["id"], color: LegoColor, mask: Mask) => void;
  addItemToInventory: (item: GameItemId, amount: number) => void;
  assignJobToMatoran: (matoranId: RecruitedCharacterData['id'], job: MatoranJob) => void;
  removeJobFromMatoran: (matoranId: RecruitedCharacterData['id']) => void;
  activityLog: ActivityLogEntry[];
  startQuest: (quest: Quest, assignedMatoran: RecruitedCharacterData['id'][]) => void;
  cancelQuest: (questId: string) => void;
  completeQuest: (quest: Quest) => void;
  addActivityLog: (message: string, type: LogType) => void;
  removeActivityLogEntry: (id: string) => void;
  clearActivityLog: () => void;
};

export type PartialGameState = Pick<
  GameState,
  | 'version'
  | 'widgets'
  | 'widgetCap'
  | 'inventory'
  | 'buyableCharacters'
  | 'recruitedCharacters'
  | 'activeQuests'
  | 'completedQuests'
>;