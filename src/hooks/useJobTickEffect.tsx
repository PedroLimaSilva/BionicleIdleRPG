import { useEffect } from 'react';
import { RecruitedCharacterData } from '../types/Matoran';
import { tickMatoranJobExp } from '../services/jobUtils';

export function useJobTickEffect(
  recruitedCharacters: RecruitedCharacterData[],
  setRecruitedCharacters: (
    fn: (prev: RecruitedCharacterData[]) => RecruitedCharacterData[]
  ) => void,
  addProtodermis: (amount: number) => void,
  intervalMs: number = 5000
) {
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      setRecruitedCharacters((prev) =>
        prev.map((matoran) => {
          const { updatedMatoran, earnedProtodermis } = tickMatoranJobExp(matoran, now);

          if (earnedProtodermis > 0) addProtodermis(earnedProtodermis);

          return updatedMatoran;
        })
      );
    }, intervalMs);

    return () => clearInterval(interval);
  }, [recruitedCharacters, setRecruitedCharacters, addProtodermis, intervalMs]);
}
