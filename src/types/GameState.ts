import { GameItemId } from '../data/loot';
import { StoryProgression } from '../game/story';
import { Inventory } from '../services/inventoryUtils';
import { MatoranJob } from './Jobs';
import { ActivityLogEntry, LogType } from './Logging';
import { ListedMatoran, Matoran, RecruitedMatoran } from './Matoran';

export type GameState = {
  version: number;
  widgets: number;
  inventory: Inventory;
  availableCharacters: ListedMatoran[];
  recruitedCharacters: RecruitedMatoran[];
  storyProgress: StoryProgression[];
  recruitCharacter: (character: ListedMatoran) => void;
  addItemToInventory: (item: GameItemId, amount: number) => void;
  assignJobToMatoran: (matoranId: Matoran['id'], job: MatoranJob) => void;
  removeJobFromMatoran: (matoranId: Matoran['id']) => void;
  activityLog: ActivityLogEntry[];
  addActivityLog: (message: string, type: LogType) => void;
  removeActivityLogEntry: (id: string) => void;
  clearActivityLog: () => void;
};
