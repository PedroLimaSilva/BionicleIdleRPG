import { MatoranStage, RecruitedCharacterData } from '../types/Matoran';
import { QUESTS } from '../data/quests';
import { MATORAN_DEX } from '../data/matoran';
import { getLevelFromExp } from './Levelling';

export const EVOLUTION_LEVEL_REQUIREMENT = 50;

export interface AvailableEvolution {
  questId: string;
  evolvedId?: string;
  stageOverride?: MatoranStage;
  label: string;
}

/**
 * Checks all completed quests for a pending evolution or stage upgrade
 * for the given character. Returns null if no evolution is available.
 */
export function getAvailableEvolution(
  character: RecruitedCharacterData,
  completedQuests: string[]
): AvailableEvolution | null {
  for (const quest of QUESTS) {
    if (!completedQuests.includes(quest.id)) continue;

    const evolution = quest.rewards.evolution;
    if (evolution?.[character.id]) {
      const evolvedId = evolution[character.id];
      const evolvedName = MATORAN_DEX[evolvedId]?.name ?? evolvedId;
      return {
        questId: quest.id,
        evolvedId,
        label: `Evolve to ${evolvedName}`,
      };
    }

    const stageOverrides = quest.rewards.stageOverrides;
    if (stageOverrides?.[character.id]) {
      const targetStage = stageOverrides[character.id];
      const currentStage = character.stage ?? MATORAN_DEX[character.id]?.stage;
      if (currentStage !== targetStage) {
        return {
          questId: quest.id,
          stageOverride: targetStage,
          label: `Upgrade to ${targetStage} form`,
        };
      }
    }
  }
  return null;
}

export function meetsEvolutionLevel(character: RecruitedCharacterData): boolean {
  return getLevelFromExp(character.exp) >= EVOLUTION_LEVEL_REQUIREMENT;
}

/**
 * Returns evolved character data. Only call when evolution is available.
 */
export function applyCharacterEvolution(
  character: RecruitedCharacterData,
  evolution: AvailableEvolution
): RecruitedCharacterData {
  if (evolution.evolvedId) {
    return {
      ...character,
      id: evolution.evolvedId,
      maskOverride: undefined,
    };
  }
  if (evolution.stageOverride !== undefined) {
    return {
      ...character,
      stage: evolution.stageOverride,
    };
  }
  return character;
}
