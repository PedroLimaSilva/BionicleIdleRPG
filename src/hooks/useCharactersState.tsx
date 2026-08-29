import { useState, useMemo } from 'react';
import {
  BaseMatoran,
  CUSTOM_CHARACTER_COST,
  CREATE_CUSTOM_CHARACTER_ID,
  ListedCharacterData,
  Mask,
  MatoranStage,
  RecruitedCharacterData,
  isCustomCharacterId,
} from '../types/Matoran';
import { getDefaultCustomToaModelIdForStage } from '../rendering/3d/customToaBuild';
import { MatoranJob } from '../types/Jobs';
import { recruitMatoran, assignJob, removeJob } from '../services/matoranUtils';
import { areEquivalentSharedCustomMatoran } from '../services/customCharacterShare';
import { getBuyableCharacters, isCharacterRecruited } from '../game/recruitment/Recruitment';
import { registerCustomCharacterInDex } from '../data/dex/index';
import { normalizeMatoranColors } from '../game/characters/matoranColors';

/**
 * @param completedQuests - Used to derive buyable characters (with recruitedCharacters).
 *                          Passed from parent so buyable list is resilient to inconsistent saves.
 */
export function useCharactersState(
  initialRecruited: RecruitedCharacterData[],
  initialCustomCharacters: BaseMatoran[],
  completedQuests: string[],
  protodermis: number,
  setProtodermis: (amount: number) => void
) {
  const [recruitedCharacters, setRecruitedCharacters] =
    useState<RecruitedCharacterData[]>(initialRecruited);
  const [customCharacters, setCustomCharacters] = useState<BaseMatoran[]>(initialCustomCharacters);

  // Register in render (not only in useEffect) so CHARACTER_DEX is populated before the first
  // paint. Otherwise getRecruitedMatoran spreads undefined from CHARACTER_DEX[id] for custom
  // ids until effects run — e.g. reloading /characters/:id on a custom character crashes
  // RebuiltMatoranModel when reading matoran.colors.
  for (const base of customCharacters) {
    registerCustomCharacterInDex({
      ...base,
      colors: normalizeMatoranColors(base.colors, base.stage),
    });
  }

  const buyableCharacters = useMemo(() => {
    const standard = getBuyableCharacters(completedQuests, recruitedCharacters);
    const customBuyable: ListedCharacterData[] = customCharacters
      .filter((c) => !isCharacterRecruited(c.id, recruitedCharacters))
      .map((c) => ({ cost: CUSTOM_CHARACTER_COST, id: c.id }));
    return [
      { cost: CUSTOM_CHARACTER_COST, id: CREATE_CUSTOM_CHARACTER_ID },
      ...customBuyable,
      ...standard,
    ];
  }, [completedQuests, recruitedCharacters, customCharacters]);

  const recruitCharacter = (character: ListedCharacterData) => {
    const { newRecruit, updatedProtodermis } = recruitMatoran(
      character,
      protodermis,
      buyableCharacters
    );

    if (!newRecruit) return;

    setProtodermis(updatedProtodermis);
    setRecruitedCharacters((prev) => [...prev, newRecruit]);
  };

  const assignJobToMatoran = (id: RecruitedCharacterData['id'], job: MatoranJob) => {
    setRecruitedCharacters((prev) => assignJob(id, job, prev, completedQuests));
  };

  const removeJobFromMatoran = (id: RecruitedCharacterData['id']) => {
    setRecruitedCharacters((prev) => removeJob(id, prev));
  };

  const setMaskOverride = (id: RecruitedCharacterData['id'], mask: Mask) => {
    setRecruitedCharacters((prev) =>
      prev.map((m) => {
        if (id === m.id) {
          return { ...m, maskOverride: mask };
        }
        return m;
      })
    );
  };

  const nextCustomId = (existing: BaseMatoran[]): string => {
    let n = existing.length;
    let id = `custom_${n}`;
    const used = new Set(existing.map((c) => c.id));
    while (used.has(id)) {
      n += 1;
      id = `custom_${n}`;
    }
    return id;
  };

  const createCustomCharacter = (
    base: Omit<BaseMatoran, 'id'>,
    extras?: Pick<RecruitedCharacterData, 'customMataModelId'>
  ): string | null => {
    if (protodermis < CUSTOM_CHARACTER_COST) return null;
    const id = nextCustomId(customCharacters);
    const newBase: BaseMatoran = {
      ...base,
      colors: normalizeMatoranColors(base.colors, base.stage),
      id,
    };
    registerCustomCharacterInDex(newBase);
    setCustomCharacters((prev) => [...prev, newBase]);
    const recruitEntry: RecruitedCharacterData = {
      exp: 0,
      id,
      ...(base.stage === MatoranStage.ToaMata ||
      base.stage === MatoranStage.ToaNuva ||
      base.stage === MatoranStage.ToaMetru
        ? {
            customMataModelId:
              extras?.customMataModelId ?? getDefaultCustomToaModelIdForStage(base.stage),
          }
        : {}),
    };
    setRecruitedCharacters((prev) => [...prev, recruitEntry]);
    setProtodermis(protodermis - CUSTOM_CHARACTER_COST);
    return id;
  };

  const registerSharedCustomCharacter = (base: BaseMatoran): BaseMatoran => {
    const identityMatch = customCharacters.find((c) => areEquivalentSharedCustomMatoran(c, base));
    if (identityMatch) return identityMatch;

    if (customCharacters.some((c) => c.id === base.id)) {
      const id = nextCustomId(customCharacters);
      const newBase: BaseMatoran = {
        ...base,
        colors: normalizeMatoranColors(base.colors, base.stage),
        id,
      };
      registerCustomCharacterInDex(newBase);
      setCustomCharacters((prev) => [...prev, newBase]);
      return newBase;
    }

    const stored: BaseMatoran = {
      ...base,
      colors: normalizeMatoranColors(base.colors, base.stage),
    };
    registerCustomCharacterInDex(stored);
    setCustomCharacters((prev) => [...prev, stored]);
    return stored;
  };

  const dismissCustomCharacter = (id: string) => {
    const recruited = recruitedCharacters.some((m) => m.id === id);
    if (recruited) return;
    setCustomCharacters((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCustomCharacter = (
    id: string,
    base: Omit<BaseMatoran, 'id'>,
    extras?: Pick<RecruitedCharacterData, 'customMataModelId'>,
    options?: { protodermisCost?: number }
  ): boolean => {
    if (!isCustomCharacterId(id)) return false;
    const existing = customCharacters.find((c) => c.id === id);
    if (!existing) return false;
    if (!recruitedCharacters.some((m) => m.id === id)) return false;

    const cost = options?.protodermisCost;
    if (cost !== undefined && protodermis < cost) return false;

    const updated: BaseMatoran = {
      ...existing,
      ...base,
      colors: normalizeMatoranColors(base.colors, base.stage),
      id,
      tags: base.tags ?? existing.tags,
    };
    registerCustomCharacterInDex(updated);
    setCustomCharacters((prev) => prev.map((c) => (c.id === id ? updated : c)));
    setRecruitedCharacters((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const next: RecruitedCharacterData = { ...m, stage: base.stage };
        if (extras?.customMataModelId !== undefined) {
          next.customMataModelId = extras.customMataModelId;
        }
        return next;
      })
    );
    if (cost !== undefined) {
      setProtodermis(protodermis - cost);
    }
    return true;
  };

  return {
    assignJobToMatoran,
    buyableCharacters,
    createCustomCharacter,
    customCharacters,
    dismissCustomCharacter,
    recruitCharacter,
    recruitedCharacters,
    registerSharedCustomCharacter,
    removeJobFromMatoran,
    setCustomCharacters,
    setMaskOverride,
    setRecruitedCharacters,
    updateCustomCharacter,
  };
}
