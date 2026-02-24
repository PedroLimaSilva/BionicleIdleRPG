import { BaseMatoran, MatoranStage } from '../types/Matoran';
import { LegoColor } from '../types/Colors';
import { isNuvaSymbolsSequestered } from './nuvaSymbols';

const GOLD_MASK_QUEST_IDS = ['mnog_kini_nui_arrival', 'mnog_gali_call'] as const;

function isGoldMaskQuestCompleted(completedQuests: string[]): boolean {
  return GOLD_MASK_QUEST_IDS.some((id) => completedQuests.includes(id));
}

/**
 * Effective mask color for Toa Mata, based on user override and game state.
 * Gold mask override when Kini-Nui quests are completed.
 */
export function getEffectiveMataMaskColor(
  matoran: BaseMatoran & { maskColorOverride?: string; maskOverride?: string },
  completedQuests: string[]
): string {
  if (matoran.maskColorOverride) return matoran.maskColorOverride;
  if (isGoldMaskQuestCompleted(completedQuests)) return LegoColor.PearlGold;
  return matoran.colors.mask;
}

/**
 * Effective mask color for Toa Nuva, based on user override and game state.
 * Light gray when nuva symbols are sequestered.
 */
export function getEffectiveNuvaMaskColor(
  matoran: BaseMatoran & { maskColorOverride?: string; maskOverride?: string },
  completedQuests: string[]
): string {
  if (matoran.maskColorOverride) return matoran.maskColorOverride;
  if (isNuvaSymbolsSequestered(completedQuests)) return LegoColor.LightGray;
  return matoran.colors.mask;
}

/**
 * Effective mask color for any Toa, based on stage.
 */
export function getEffectiveMaskColor(
  matoran: BaseMatoran & { maskColorOverride?: string; maskOverride?: string },
  completedQuests: string[]
): string {
  if (matoran.stage === MatoranStage.ToaNuva) {
    return getEffectiveNuvaMaskColor(matoran, completedQuests);
  }
  return getEffectiveMataMaskColor(matoran, completedQuests);
}
