import { GameItemId } from '../data/loot';
import { Inventory } from '../services/inventoryUtils';
import { ListedCharacterData, MatoranStage, RecruitedCharacterData } from './Matoran';
import type { VisualNovelCutsceneRef } from './Cutscenes';

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
 * Maps current CHARACTER_DEX id to evolved CHARACTER_DEX id.
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
  /** Visual novel cutscene ID. All cutscenes (including video-only) use the visual novel system. */
  cutscene?: VisualNovelCutsceneRef;
  /** Evolution trigger: maps participant dex IDs to their evolved form. Applied on quest completion. */
  evolution?: EvolutionMap;
  /** Stage overrides for participants who keep their ID but change form (e.g. Diminished → Rebuilt). */
  stageOverrides?: { [participantId: string]: MatoranStage };
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  durationSeconds: number;
  requirements: QuestRequirement;
  rewards: QuestReward;
  unlockedAfter?: string[]; // Optional prerequisites
  /** Optional section for grouping in the completed quests UI (e.g. "Bohrok Swarms", "Infected Rahi / Hunt for the Masks") */
  section?: string;
}

export interface QuestProgress {
  questId: string;
  startedAt: number; // timestamp
  endsAt: number; // timestamp
  assignedMatoran: RecruitedCharacterData['id'][];
}
