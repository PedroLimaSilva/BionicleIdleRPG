import { useState } from 'react';
import { ListedMatoran, Matoran, RecruitedMatoran } from '../types/Matoran';
import { GameItemId } from '../data/loot';
import { MatoranJob } from '../types/Jobs';
import { recruitMatoran, assignJob, removeJob } from '../services/matoranUtils';

export function useCharactersState(
  initialRecruited: RecruitedMatoran[],
  initialAvailable: ListedMatoran[],
  widgets: number,
  setWidgets: (amount: number) => void,
  addItemToInventory: (item: GameItemId, amount: number) => void
) {
  const [recruitedCharacters, setRecruitedCharacters] =
    useState<RecruitedMatoran[]>(initialRecruited);

  const [availableCharacters, setAvailableCharacters] = useState<
    ListedMatoran[]
  >(
    initialAvailable.filter((m) => !initialRecruited.find((r) => r.id === m.id))
  );

  const recruitCharacter = (character: ListedMatoran) => {
    const { updatedWidgets, newRecruit, updatedAvailable } = recruitMatoran(
      character,
      widgets,
      availableCharacters,
      addItemToInventory
    );

    if (!newRecruit) return;

    setWidgets(updatedWidgets);
    setRecruitedCharacters(prev => [...prev, newRecruit]);
    setAvailableCharacters(updatedAvailable);
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
    availableCharacters,
    recruitCharacter,
    assignJobToMatoran,
    removeJobFromMatoran,
  };
}
