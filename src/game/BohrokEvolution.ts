import { RecruitedCharacterData } from '../types/Matoran';
import { MatoranStage } from '../types/Matoran';
import { getLevelFromExp } from './Levelling';
import { getEffectiveStage } from './characterStage';
import { evolveCharacter } from './MatoranEvolution';

export const BOHROK_KAL_LEVEL = 100;
export const BOHROK_KAL_EVOLUTION_COST = 5000;

const BOHROK_TO_KAL: Record<string, string> = {
  tahnok: 'tahnok_kal',
  gahlok: 'gahlok_kal',
  lehvak: 'lehvak_kal',
  pahrak: 'pahrak_kal',
  nuhvok: 'nuhvok_kal',
  kohrak: 'kohrak_kal',
};

/**
 * Returns true if the Bohrok can evolve to Bohrok Kal (level 100 reached).
 */
export function canEvolveBohrokToKal(matoran: RecruitedCharacterData): boolean {
  const effectiveStage = getEffectiveStage(matoran);
  if (effectiveStage !== MatoranStage.Bohrok) {
    return false;
  }

  const level = getLevelFromExp(matoran.exp);
  return level >= BOHROK_KAL_LEVEL && matoran.id in BOHROK_TO_KAL;
}

/**
 * Returns the evolved Bohrok Kal character data. Call only when canEvolveBohrokToKal is true.
 */
export function evolveBohrokToKal(matoran: RecruitedCharacterData): RecruitedCharacterData {
  return evolveCharacter(matoran, { evolutionMap: BOHROK_TO_KAL });
}
