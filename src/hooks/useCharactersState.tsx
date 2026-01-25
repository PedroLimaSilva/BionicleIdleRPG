import { useState } from 'react';
import {
  ListedCharacterData,
  Mask,
  RecruitedCharacterData,
} from '../types/Matoran';
import { GameItemId } from '../data/loot';
import { MatoranJob } from '../types/Jobs';
import { recruitMatoran, assignJob, removeJob } from '../services/matoranUtils';
import { LegoColor } from '../types/Colors';

export function useCharactersState(
  initialRecruited: RecruitedCharacterData[],
  initialBuyable: ListedCharacterData[],
  widgets: number,
  setWidgets: (amount: number) => void,
  addItemToInventory: (item: GameItemId, amount: number) => void,
) {
  const [recruitedCharacters, setRecruitedCharacters] =
    useState<RecruitedCharacterData[]>(initialRecruited);

  const [buyableCharacters, setBuyableCharacters] = useState<
    ListedCharacterData[]
  >(initialBuyable.filter((m) => !initialRecruited.find((r) => r.id === m.id)));

  const recruitCharacter = (character: ListedCharacterData) => {
    const { updatedWidgets, newRecruit, updatedBuyable } = recruitMatoran(
      character,
      widgets,
      buyableCharacters,
      addItemToInventory,
    );

    if (!newRecruit) return;

    setWidgets(updatedWidgets);
    setRecruitedCharacters((prev) => [...prev, newRecruit]);
    setBuyableCharacters(updatedBuyable);
  };

  const assignJobToMatoran = (
    id: RecruitedCharacterData['id'],
    job: MatoranJob,
  ) => {
    setRecruitedCharacters((prev) => assignJob(id, job, prev));
  };

  const removeJobFromMatoran = (id: RecruitedCharacterData['id']) => {
    setRecruitedCharacters((prev) => removeJob(id, prev));
  };

  const setMaskOverride = (
    id: RecruitedCharacterData['id'],
    color: LegoColor,
    mask: Mask,
  ) => {
    setRecruitedCharacters((prev) =>
      prev.map((m) => {
        if (id === m.id) {
          return { ...m, maskOverride: mask, maskColorOverride: color };
        }
        return m;
      }),
    );
  };

  return {
    recruitedCharacters,
    setRecruitedCharacters,
    setBuyableCharacters,
    buyableCharacters,
    recruitCharacter,
    assignJobToMatoran,
    removeJobFromMatoran,
    setMaskOverride,
  };
}
