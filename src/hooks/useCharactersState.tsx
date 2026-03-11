import { useState, useMemo } from 'react';
import { ListedCharacterData, Mask, RecruitedCharacterData } from '../types/Matoran';
import { MatoranJob } from '../types/Jobs';
import { recruitMatoran, assignJob, removeJob } from '../services/matoranUtils';
import { getBuyableCharacters } from '../game/Recruitment';

/**
 * @param completedQuests - Used to derive buyable characters (with recruitedCharacters).
 *                          Passed from parent so buyable list is resilient to inconsistent saves.
 */
export function useCharactersState(
  initialRecruited: RecruitedCharacterData[],
  completedQuests: string[],
  protodermis: number,
  setProtodermis: (amount: number) => void
) {
  const [recruitedCharacters, setRecruitedCharacters] =
    useState<RecruitedCharacterData[]>(initialRecruited);

  const buyableCharacters = useMemo(
    () => getBuyableCharacters(completedQuests, recruitedCharacters),
    [completedQuests, recruitedCharacters]
  );

  const recruitCharacter = (character: ListedCharacterData) => {
    const { updatedProtodermis, newRecruit } = recruitMatoran(
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

  return {
    recruitedCharacters,
    setRecruitedCharacters,
    buyableCharacters,
    recruitCharacter,
    assignJobToMatoran,
    removeJobFromMatoran,
    setMaskOverride,
  };
}
