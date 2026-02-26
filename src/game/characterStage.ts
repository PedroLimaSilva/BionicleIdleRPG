import { RecruitedCharacterData } from '../types/Matoran';
import { MATORAN_DEX } from '../data/matoran';
import { MatoranStage } from '../types/Matoran';

/**
 * Returns the effective stage for a recruited character.
 * RecruitedCharacterData.stage overrides MATORAN_DEX when present (e.g. Rebuilt after Naming Day).
 */
export function getEffectiveStage(
  matoran: RecruitedCharacterData
): MatoranStage | undefined {
  return matoran.stage ?? MATORAN_DEX[matoran.id]?.stage;
}
