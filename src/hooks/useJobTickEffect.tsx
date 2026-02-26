import { useEffect } from 'react';
import { RecruitedCharacterData } from '../types/Matoran';
import { GameItemId } from '../data/loot';
import { ActivityLogEntry } from '../types/Logging';
import { tickMatoranJobExp } from '../services/jobUtils';

export function useJobTickEffect(
  recruitedCharacters: RecruitedCharacterData[],
  setRecruitedCharacters: (
    fn: (prev: RecruitedCharacterData[]) => RecruitedCharacterData[]
  ) => void,
  addProtodermis: (amount: number) => void,
  addItemToInventory: (item: GameItemId, amount: number) => void,
  addActivityLog: (message: string, type: ActivityLogEntry['type']) => void,
  intervalMs: number = 5000
) {
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      setRecruitedCharacters((prev) =>
        prev.map((matoran) => {
          const { updatedMatoran, earnedProtodermis, earnedLoot, logs } = tickMatoranJobExp(
            matoran,
            now
          );

          if (earnedProtodermis > 0) addProtodermis(earnedProtodermis);
          Object.entries(earnedLoot).forEach(([item, amount]) => {
            addItemToInventory(item as GameItemId, amount);
          });
          logs.forEach((log) => addActivityLog(log.message, log.type));

          return updatedMatoran;
        })
      );
    }, intervalMs);

    return () => clearInterval(interval);
  }, [
    recruitedCharacters,
    setRecruitedCharacters,
    addProtodermis,
    addItemToInventory,
    addActivityLog,
    intervalMs,
  ]);
}
