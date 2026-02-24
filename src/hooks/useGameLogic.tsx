import { useState } from 'react';
import { loadGameState } from '../services/gamePersistence';
import { useInventoryState } from './useInventoryState';
import { useCharactersState } from './useCharactersState';
import { useJobTickEffect } from './useJobTickEffect';
import { useActivityLogState } from './useActivityLogState';
import { useGamePersistence } from './useGamePersistence';
import { GameState } from '../types/GameState';
import { useQuestState } from './useQuestState';
import { useBattleState } from './useBattleState';
import { clamp } from '../utils/math';
import { KranaCollection, KranaElement, KranaId } from '../types/Krana';
import { BattleRewardParams, KranaReward } from '../types/GameState';
import { RecruitedCharacterData } from '../types/Matoran';
import { LogType } from '../types/Logging';
import { MATORAN_DEX } from '../data/matoran';
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

  const { activityLog, addActivityLog, removeActivityLogEntry, clearActivityLog } =
    useActivityLogState(initialState.activityLog);

  useJobTickEffect(
    recruitedCharacters,
    setRecruitedCharacters,
    (amount) => setWidgets((prev) => clamp(prev + amount, 0, widgetCap)),
    addItemToInventory,
    addActivityLog
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
    addActivityLog,
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
    activityLog,
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
    addActivityLog,
    removeActivityLogEntry,
    clearActivityLog,
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
    evolveBohrokToKal: (matoranId: RecruitedCharacterData['id']) => {
      const matoran = recruitedCharacters.find((m) => m.id === matoranId);
      if (!matoran || !canEvolveBohrokToKal(matoran)) return false;
      if (widgets < BOHROK_KAL_EVOLUTION_COST) return false;

      setWidgets((prev) => prev - BOHROK_KAL_EVOLUTION_COST);
      const evolved = evolveBohrokToKal(matoran);
      setRecruitedCharacters((prev) =>
        prev.map((m) => (m.id === matoranId ? evolved : m))
      );
      addActivityLog(
        `${MATORAN_DEX[matoranId]?.name ?? matoranId} evolved into ${MATORAN_DEX[evolved.id]?.name ?? evolved.id}!`,
        LogType.Event
      );
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
