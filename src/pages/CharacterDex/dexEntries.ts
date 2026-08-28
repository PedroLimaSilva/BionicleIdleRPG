import { CHARACTER_DEX } from '../../data/dex';
import { isBohrokOrKal, isMatoran, isToa, isVahki } from '../../game/characters/matoranStage';
import {
  BaseMatoran,
  isCustomCharacterId,
  Mask,
  RecruitedCharacterData,
} from '../../types/Matoran';

export type DexTabId = 'all' | 'matoran' | 'toa' | 'other';

export const DEX_TABS: DexTabId[] = ['all', 'matoran', 'toa', 'other'];

export const PREVIEW_ANIMATIONS = ['Attack', 'Hit', 'Defeat'] as const;

export type PreviewAnimationName = (typeof PREVIEW_ANIMATIONS)[number];

/** Every dex character, static entries first, then custom, then name. */
export function getCharacterDexEntries(): BaseMatoran[] {
  return Object.values(CHARACTER_DEX).sort((a, b) => {
    const customDelta = Number(isCustomCharacterId(a.id)) - Number(isCustomCharacterId(b.id));
    if (customDelta !== 0) return customDelta;
    const nameCmp = a.name.localeCompare(b.name);
    return nameCmp !== 0 ? nameCmp : a.id.localeCompare(b.id);
  });
}

export function matchesDexTab(matoran: BaseMatoran, tab: DexTabId): boolean {
  if (tab === 'all') return true;
  if (tab === 'matoran') return isMatoran(matoran);
  if (tab === 'toa') return isToa(matoran);
  return isBohrokOrKal(matoran) || isVahki(matoran) || (!isMatoran(matoran) && !isToa(matoran));
}

export function getAdjacentDexIds(id: string): { nextId: string; prevId: string } | null {
  const entries = getCharacterDexEntries();
  const index = entries.findIndex((entry) => entry.id === id);
  if (index < 0 || entries.length === 0) return null;
  const prevId = entries[(index - 1 + entries.length) % entries.length].id;
  const nextId = entries[(index + 1) % entries.length].id;
  return { nextId, prevId };
}

export function toDexPreviewMatoran(
  base: BaseMatoran,
  options: { maskOverride?: Mask; maskPowerActive?: boolean }
): BaseMatoran & RecruitedCharacterData & { maskPowerActive?: boolean; unlockAllMasks: true } {
  return {
    ...base,
    exp: 0,
    maskOverride: options.maskOverride,
    maskPowerActive: options.maskPowerActive,
    unlockAllMasks: true,
  };
}
