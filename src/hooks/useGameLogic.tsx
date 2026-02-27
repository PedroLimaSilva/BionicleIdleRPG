import { useState } from 'react';
import { loadGameState } from '../services/gamePersistence';
import { useInventoryState } from './useInventoryState';
import { useCharactersState } from './useCharactersState';
import { useJobTickEffect } from './useJobTickEffect';
import { useGamePersistence } from './useGamePersistence';
import { GameState } from '../types/GameState';
import { useQuestState } from './useQuestState';
import { useBattleState } from './useBattleState';
import { clamp } from '../utils/math';
import { KranaCollection, KranaElement, KranaId } from '../types/Krana';
import { BattleRewardParams, KranaReward } from '../types/GameState';
import { RecruitedCharacterData } from '../types/Matoran';
import {
  computeBattleExpTotal,
  computeKranaRewardsForBattle,
  getParticipantIds,
} from '../game/BattleRewards';
import { isKranaCollectionActive } from '../game/Krana';
import {
  getAvailableEvolution,
  meetsEvolutionLevel,
  applyCharacterEvolution,
} from '../game/CharacterEvolution';
import { isNuvaSymbolsSequestered } from '../game/nuvaSymbols';

export const useGameLogic = (): GameState => {
  const [initialState] = useState(() => loadGameState());

  const [version] = useState(initialState.version);

  const { inventory, addItemToInventory } = useInventoryState(initialState.inventory);

  const [collectedKrana, setCollectedKrana] = useState<KranaCollection>(
    initialState.collectedKrana ?? {}
  );

  const [protodermis, setProtodermis] = useState(initialState.protodermis);
  const [protodermisCap, setProtodermisCap] = useState(initialState.protodermisCap);

  const {
    recruitedCharacters,
    setRecruitedCharacters,
    setBuyableCharacters,
    buyableCharacters,
    recruitCharacter,
    assignJobToMatoran,
    removeJobFromMatoran,
    setMaskOverride,
  } = useCharactersState(
    initialState.recruitedCharacters,
    initialState.buyableCharacters,
    protodermis,
    setProtodermis,
    addItemToInventory
  );

  useJobTickEffect(
    recruitedCharacters,
    setRecruitedCharacters,
    (amount) => setProtodermis((prev) => clamp(prev + amount, 0, protodermisCap)),
    addItemToInventory
  );

  const { activeQuests, completedQuests, startQuest, cancelQuest, completeQuest } = useQuestState({
    initialActive: initialState.activeQuests,
    initialCompleted: initialState.completedQuests,
    characters: recruitedCharacters,
    addItemToInventory,
    setRecruitedCharacters,
    setBuyableCharacters,
    addProtodermis: (amount: number) => {
      if (amount > protodermisCap) {
        setProtodermisCap(amount);
        setProtodermis(amount);
      } else {
        setProtodermis((prev) => clamp(prev + amount, 0, protodermisCap));
      }
    },
  });

  const battle = useBattleState(isNuvaSymbolsSequestered(completedQuests));

  // Auto-save when critical state changes
  useGamePersistence({
    version,
    protodermis,
    protodermisCap,
    inventory,
    collectedKrana,
    recruitedCharacters,
    buyableCharacters: buyableCharacters,
    activeQuests,
    completedQuests,
  });

  return {
    version,
    activeQuests,
    completedQuests,
    protodermis,
    protodermisCap,
    inventory,
    collectedKrana,
    recruitedCharacters,
    buyableCharacters: buyableCharacters,
    addItemToInventory,
    recruitCharacter,
    setMaskOverride,
    assignJobToMatoran,
    removeJobFromMatoran,
    startQuest,
    cancelQuest,
    completeQuest,
    battle,
    collectKrana: (element: KranaElement, id: KranaId) => {
      setCollectedKrana((prev) => {
        const existingForElement = prev[element] ?? [];
        if (existingForElement.includes(id)) {
          return prev;
        }
        return {
          ...prev,
          [element]: [...existingForElement, id],
        };
      });
    },
    evolveCharacter: (
      matoranId: RecruitedCharacterData['id'],
      onSuccess?: (evolvedId: RecruitedCharacterData['id']) => void
    ) => {
      const matoran = recruitedCharacters.find((m) => m.id === matoranId);
      if (!matoran) return false;

      const evolution = getAvailableEvolution(matoran, completedQuests);
      if (!evolution || !meetsEvolutionLevel(matoran, evolution)) return false;

      const evolved = applyCharacterEvolution(matoran, evolution);
      setRecruitedCharacters((prev) => prev.map((m) => (m.id === matoranId ? evolved : m)));
      onSuccess?.(evolved.id);
      return true;
    },
    applyBattleRewards: (params: BattleRewardParams) => {
      const totalExp = computeBattleExpTotal(
        params.encounter,
        params.phase,
        params.currentWave,
        params.enemies
      );
      const participantIds = getParticipantIds(params.team);
      if (participantIds.length > 0 && totalExp > 0) {
        const expPerParticipant = Math.floor(totalExp / participantIds.length);
        setRecruitedCharacters((prev) =>
          prev.map((m) =>
            participantIds.includes(m.id) ? { ...m, exp: m.exp + expPerParticipant } : m
          )
        );
      }

      // Apply Krana: use pre-computed list from battle screen when provided (so display and
      // collection stay in sync). Only roll when kranaToApply was not passed at all.
      const kranaExplicitlyProvided = params.kranaToApply !== undefined;
      let toApply: KranaReward[] = params.kranaToApply ?? [];
      if (
        !kranaExplicitlyProvided &&
        toApply.length === 0 &&
        isKranaCollectionActive(completedQuests)
      ) {
        toApply = computeKranaRewardsForBattle(
          params.encounter,
          params.phase,
          params.currentWave,
          params.enemies,
          completedQuests,
          collectedKrana
        );
      }
      for (const { element, kranaId } of toApply) {
        setCollectedKrana((prev) => {
          const existing = prev[element] ?? [];
          if (existing.includes(kranaId)) return prev;
          return {
            ...prev,
            [element]: [...existing, kranaId],
          };
        });
      }
    },
  };
};
