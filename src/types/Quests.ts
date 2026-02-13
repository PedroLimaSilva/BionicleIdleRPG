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
  // Optional: requires all Krana to be collected (Bohrok Swarm arc).
  // This is derived at runtime from global Krana state and not persisted separately.
  requiresAllKrana?: boolean;
}

/**
 * Maps current MATORAN_DEX id to evolved MATORAN_DEX id.
 * Applied to recruited characters who participated in the quest.
 * Evolved characters keep EXP, assignment, and quest; mask overrides are dropped.
 */
export interface EvolutionMap {
  [currentDexId: string]: string;
}

export interface QuestReward {
  unlockCharacters?: ListedCharacterData[]; // IDs of unlocked characters (e.g., Toa, Matoran)
  loot?: Inventory;
  xpPerMatoran?: number; // XP awarded to each participating Matoran
  currency?: number; // Generic currency reward
  cutscene?: string; // Optional cutscene ID
  /** Evolution trigger: maps participant dex IDs to their evolved form. Applied on quest completion. */
  evolution?: EvolutionMap;
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
