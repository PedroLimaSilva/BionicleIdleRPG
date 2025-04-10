import { useState } from 'react';
import {
  ListedCharacterData,
  Matoran,
  RecruitedCharacterData,
} from '../types/Matoran';
import { GameItemId } from '../data/loot';
import { MatoranJob } from '../types/Jobs';
import { recruitMatoran, assignJob, removeJob } from '../services/matoranUtils';

export function useCharactersState(
  initialRecruited: RecruitedCharacterData[],
  initialBuyable: ListedCharacterData[],
  widgets: number,
  setWidgets: (amount: number) => void,
  addItemToInventory: (item: GameItemId, amount: number) => void
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
      addItemToInventory
    );

    if (!newRecruit) return;

    setWidgets(updatedWidgets);
    setRecruitedCharacters((prev) => [...prev, newRecruit]);
    setBuyableCharacters(updatedBuyable);
  };

  const assignJobToMatoran = (id: Matoran['id'], job: MatoranJob) => {
    setRecruitedCharacters((prev) => assignJob(id, job, prev));
  };

  const removeJobFromMatoran = (id: Matoran['id']) => {
    setRecruitedCharacters((prev) => removeJob(id, prev));
  };

  return {
    recruitedCharacters,
    setRecruitedCharacters,
    buyableCharacters,
    recruitCharacter,
    assignJobToMatoran,
    removeJobFromMatoran,
  };
}
