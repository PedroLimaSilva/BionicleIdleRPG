import { RecruitedCharacterData } from '../types/Matoran';
import { MatoranStage } from '../types/Matoran';
import { getLevelFromExp } from './Levelling';
import { getEffectiveStage } from './characterStage';

export const NAMING_DAY_QUEST_ID = 'bohrok_kal_naming_day';
export const MATORAN_REBUILT_LEVEL = 50;
export const MATORAN_REBUILT_COST = 1000;

/** Config for character evolution: ID changes and/or stage overrides. */
export interface EvolutionConfig {
  /** Maps participant IDs to their evolved form (new ID). */
  evolutionMap?: Record<string, string>;
  /** Stage override for participants who keep their ID. */
  stageOverride?: MatoranStage;
}

/**
 * Generic evolution: applies evolutionMap (ID change) or stageOverride (same ID).
 * If evolutionMap has an entry for matoran.id, returns evolved character with new ID.
 * Otherwise, if stageOverride is set, returns matoran with stage override.
 */
export function evolveCharacter(
  matoran: RecruitedCharacterData,
  config: EvolutionConfig
): RecruitedCharacterData {
  const evolvedId = config.evolutionMap?.[matoran.id];

  if (evolvedId) {
    return {
      id: evolvedId,
      exp: matoran.exp,
      assignment: undefined,
      quest: undefined,
    };
  }

  if (config.stageOverride !== undefined) {
    return {
      ...matoran,
      stage: config.stageOverride,
    };
  }

  return matoran;
}

/** Diminished matoran IDs that can evolve to Rebuilt after Naming Day. */
const UPGRADEABLE_DIMINISHED_IDS = [
  'Kapura',
  'Takua',
  'Jala',
  'Hali',
  'Huki',
  'Nuparu',
  'Onepu',
  'Kongu',
  'Matoro',
  'Maku',
  'Lumi',
  'Kivi',
  'Taipu',
  'Tamaru',
  'Kopeke',
  'Hafu',
] as const;

const MATORAN_REBUILT_EVOLUTION: EvolutionConfig = {
  evolutionMap: {
    Jala: 'Jaller',
    Maku: 'Macku',
    Huki: 'Hewkii',
  },
  stageOverride: MatoranStage.Rebuilt,
};

/**
 * Returns true if the diminished matoran can evolve to Rebuilt (Naming Day complete, level 50+).
 */
export function canEvolveMatoranToRebuilt(
  matoran: RecruitedCharacterData,
  completedQuests: string[]
): boolean {
  if (!completedQuests.includes(NAMING_DAY_QUEST_ID)) {
    return false;
  }

  if (!UPGRADEABLE_DIMINISHED_IDS.includes(matoran.id as (typeof UPGRADEABLE_DIMINISHED_IDS)[number])) {
    return false;
  }

  const effectiveStage = getEffectiveStage(matoran);
  if (effectiveStage !== MatoranStage.Diminished) {
    return false;
  }

  const level = getLevelFromExp(matoran.exp);
  return level >= MATORAN_REBUILT_LEVEL;
}

/**
 * Returns the evolved Rebuilt character data. Call only when canEvolveMatoranToRebuilt is true.
 * For Jala/Maku/Huki: changes ID to Jaller/Macku/Hewkii. For others: adds stage override.
 */
export function evolveMatoranToRebuilt(
  matoran: RecruitedCharacterData
): RecruitedCharacterData {
  return evolveCharacter(matoran, MATORAN_REBUILT_EVOLUTION);
}
