import { RecruitedCharacterData } from '../types/Matoran';
import { MATORAN_DEX } from '../data/matoran';
import { MatoranStage } from '../types/Matoran';
import { getLevelFromExp } from './Levelling';

export const NAMING_DAY_QUEST_ID = 'bohrok_kal_naming_day';
export const MATORAN_REBUILT_LEVEL = 50;
export const MATORAN_REBUILT_COST = 1000;

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

/** Maps diminished IDs to their Rebuilt form (name change). Others get stage override only. */
const EVOLUTION_MAP: Record<string, string> = {
  Jala: 'Jaller',
  Maku: 'Macku',
  Huki: 'Hewkii',
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

  const baseDex = MATORAN_DEX[matoran.id];
  const effectiveStage = matoran.stage ?? baseDex?.stage;
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
  const evolvedId = EVOLUTION_MAP[matoran.id];

  if (evolvedId) {
    return {
      id: evolvedId,
      exp: matoran.exp,
      assignment: undefined,
      quest: undefined,
    };
  }

  return {
    ...matoran,
    stage: MatoranStage.Rebuilt,
  };
}
