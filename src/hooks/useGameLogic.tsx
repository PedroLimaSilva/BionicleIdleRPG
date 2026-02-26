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
  canEvolveBohrokToKal,
  evolveBohrokToKal,
  BOHROK_KAL_EVOLUTION_COST,
} from '../game/BohrokEvolution';
import { isNuvaSymbolsSequestered } from '../game/nuvaSymbols';

export const useGameLogic = (): GameState => {
  const [initialState] = useState(() => loadGameState());

  const [version] = useState(initialState.version);

  const { inventory, addItemToInventory } = useInventoryState(initialState.inventory);

  const [collectedKrana, setCollectedKrana] = useState<KranaCollection>(
    initialState.collectedKrana ?? {}
  );

  const [widgets, setWidgets] = useState(initialState.widgets);
  const [widgetCap] = useState(initialState.widgetCap);

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
    widgets,
    setWidgets,
    addItemToInventory
  );

  useJobTickEffect(
    recruitedCharacters,
    setRecruitedCharacters,
    (amount) => setWidgets((prev) => clamp(prev + amount, 0, widgetCap)),
    addItemToInventory
  );

  const { activeQuests, completedQuests, startQuest, cancelQuest, completeQuest } = useQuestState({
    initialActive: initialState.activeQuests,
    initialCompleted: initialState.completedQuests,
    characters: recruitedCharacters,
    addItemToInventory,
    setRecruitedCharacters,
    setBuyableCharacters,
    addWidgets: (widgets: number) => {
      setWidgets((prev) => clamp(prev + widgets, 0, widgetCap));
    },
  });

  const battle = useBattleState(isNuvaSymbolsSequestered(completedQuests));

  // Auto-save when critical state changes
  useGamePersistence({
    version,
    widgets,
    widgetCap,
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
    widgets,
    widgetCap,
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
    evolveBohrokToKal: (
      matoranId: RecruitedCharacterData['id'],
      onSuccess?: (evolvedId: RecruitedCharacterData['id']) => void
    ) => {
      const matoran = recruitedCharacters.find((m) => m.id === matoranId);
      if (!matoran || !canEvolveBohrokToKal(matoran)) return false;

      setWidgets((prev) => {
        if (prev < BOHROK_KAL_EVOLUTION_COST) return prev;
        const evolved = evolveBohrokToKal(matoran);
        setRecruitedCharacters((prevChars) =>
          prevChars.map((m) => (m.id === matoranId ? evolved : m))
        );
        onSuccess?.(evolved.id);
        return prev - BOHROK_KAL_EVOLUTION_COST;
      });
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
