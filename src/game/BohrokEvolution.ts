import { RecruitedCharacterData } from '../types/Matoran';
import { MATORAN_DEX } from '../data/matoran';
import { MatoranStage } from '../types/Matoran';
import { getLevelFromExp } from './Levelling';

export const BOHROK_KAL_LEVEL = 100;
export const BOHROK_KAL_EVOLUTION_COST = 5000;

const BOHROK_TO_KAL_ID: Record<string, string> = {
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
  const matoranDex = MATORAN_DEX[matoran.id];
  if (!matoranDex || matoranDex.stage !== MatoranStage.Bohrok) {
    return false;
  }

  const level = getLevelFromExp(matoran.exp);
  return level >= BOHROK_KAL_LEVEL && !!BOHROK_TO_KAL_ID[matoran.id];
}

/**
 * Returns the evolved Bohrok Kal character data. Call only when canEvolveBohrokToKal is true.
 */
export function evolveBohrokToKal(matoran: RecruitedCharacterData): RecruitedCharacterData {
  const evolvedId = BOHROK_TO_KAL_ID[matoran.id];
  if (!evolvedId) {
    return matoran;
  }

  return {
    ...matoran,
    id: evolvedId,
  };
}
