import { GameItemId } from '../data/loot';
import { Inventory } from '../services/inventoryUtils';
import { ListedCharacterData, RecruitedCharacterData } from './Matoran';

export interface QuestItemRequirement {
  id: GameItemId; // Item ID
  amount: number;
  consumed: boolean; // If true, item will be removed from inventory
}
export interface QuestRequirement {
  matoran?: RecruitedCharacterData['id'][]; // Required Matoran by ID
  items?: QuestItemRequirement[];
  minLevel?: number; // Minimum level required for all assigned Matoran
}

export interface QuestReward {
  unlockCharacters?: ListedCharacterData[]; // IDs of unlocked characters (e.g., Toa, Matoran)
  loot?: Inventory;
  xpPerMatoran?: number; // XP awarded to each participating Matoran
  currency?: number; // Generic currency reward
  cutscene?: string; // Optional cutscene ID
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  durationSeconds: number;
  requirements: QuestRequirement;
  rewards: QuestReward;
  unlockedAfter?: string[]; // Optional prerequisites
}

export interface QuestProgress {
  questId: string;
  startedAt: number; // timestamp
  endsAt: number; // timestamp
  assignedMatoran: RecruitedCharacterData['id'][];
}
