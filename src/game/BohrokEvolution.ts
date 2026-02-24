import { RecruitedCharacterData } from '../types/Matoran';
import { MATORAN_DEX } from '../data/matoran';
import { MatoranStage } from '../types/Matoran';
import { getLevelFromExp } from './Levelling';

export const BOHROK_KAL_LEVEL = 100;
export const BOHROK_KAL_EVOLUTION_COST = 5000;

const BOHROK_KAL_SUFFIX = '_kal';

/**
 * Returns true if the Bohrok can evolve to Bohrok Kal (level 100 reached).
 */
export function canEvolveBohrokToKal(matoran: RecruitedCharacterData): boolean {
  const matoranDex = MATORAN_DEX[matoran.id];
  if (!matoranDex || matoranDex.stage !== MatoranStage.Bohrok) {
    return false;
  }

  const level = getLevelFromExp(matoran.exp);
  return level >= BOHROK_KAL_LEVEL && !matoran.id.endsWith(BOHROK_KAL_SUFFIX);
}

/**
 * Returns the evolved Bohrok Kal character data. Call only when canEvolveBohrokToKal is true.
 */
export function evolveBohrokToKal(matoran: RecruitedCharacterData): RecruitedCharacterData {
  if (matoran.id.endsWith(BOHROK_KAL_SUFFIX)) return matoran;
  return {
    ...matoran,
    id: `${matoran.id}${BOHROK_KAL_SUFFIX}`,
  };
}
