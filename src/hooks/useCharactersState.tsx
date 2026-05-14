import { useState, useMemo, useEffect } from 'react';
import {
  BaseMatoran,
  CUSTOM_CHARACTER_COST,
  CREATE_CUSTOM_CHARACTER_ID,
  ListedCharacterData,
  Mask,
  RecruitedCharacterData,
  isCustomCharacterId,
} from '../types/Matoran';
import { MatoranJob } from '../types/Jobs';
import { recruitMatoran, assignJob, removeJob } from '../services/matoranUtils';
import { getBuyableCharacters, isCharacterRecruited } from '../game/Recruitment';
import { registerCustomCharacterInDex } from '../data/dex/index';

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

  useEffect(() => {
    for (const base of customCharacters) {
      registerCustomCharacterInDex(base);
    }
  }, [customCharacters]);

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
    setRecruitedCharacters((prev) => assignJob(id, job, prev));
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

  const createCustomCharacter = (base: Omit<BaseMatoran, 'id'>): string | null => {
    if (protodermis < CUSTOM_CHARACTER_COST) return null;
    const id = nextCustomId(customCharacters);
    const newBase: BaseMatoran = { ...base, id };
    registerCustomCharacterInDex(newBase);
    setCustomCharacters((prev) => [...prev, newBase]);
    setRecruitedCharacters((prev) => [...prev, { exp: 0, id }]);
    setProtodermis(protodermis - CUSTOM_CHARACTER_COST);
    return id;
  };

  const registerSharedCustomCharacter = (base: BaseMatoran): string => {
    if (customCharacters.some((c) => c.id === base.id)) return base.id;
    registerCustomCharacterInDex(base);
    setCustomCharacters((prev) => [...prev, base]);
    return base.id;
  };

  const dismissCustomCharacter = (id: string) => {
    const recruited = recruitedCharacters.some((m) => m.id === id);
    if (recruited) return;
    setCustomCharacters((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCustomCharacter = (
    id: string,
    base: Omit<BaseMatoran, 'id'>,
    extras?: Pick<RecruitedCharacterData, 'customMataModelId'>
  ): boolean => {
    if (!isCustomCharacterId(id)) return false;
    const existing = customCharacters.find((c) => c.id === id);
    if (!existing) return false;
    if (!recruitedCharacters.some((m) => m.id === id)) return false;

    const updated: BaseMatoran = {
      ...existing,
      ...base,
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
