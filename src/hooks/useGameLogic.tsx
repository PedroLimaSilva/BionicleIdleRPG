import { useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { loadGameState } from '../services/gamePersistence';
import { useCharactersState } from './useCharactersState';
import { useJobTickEffect } from './useJobTickEffect';
import { useGamePersistence } from './useGamePersistence';
import { GameState, GameStateEditorApi } from '../types/GameState';
import { useQuestState } from './useQuestState';
import { useQuestNotifications } from './useQuestNotifications';
import { useBattleState } from './useBattleState';
import { clamp } from '../utils/math';
import { KranaCollection, KranaElement, KranaId } from '../types/Krana';
import { BattleRewardParams, KranaReward } from '../types/GameState';
import { RecruitedCharacterData } from '../types/Matoran';
import {
  computeBattleExpTotal,
  computeKranaRewardsForBattle,
  computeKraataRewardsForBattle,
  getParticipantIds,
} from '../game/BattleRewards';
import { isKranaCollectionActive } from '../game/Krana';
import {
  getAvailableEvolution,
  meetsEvolutionLevel,
  applyCharacterEvolution,
} from '../game/CharacterEvolution';
import { isNuvaSymbolsSequestered } from '../game/nuvaSymbols';
import {
  KraataCollection,
  KraataPower,
  KraataReward,
  addKraataToCollection,
} from '../types/Kraata';

export const useGameLogic = (): GameState & GameStateEditorApi => {
  const [initialState] = useState(() => loadGameState());

  const [version] = useState(initialState.version);

  const [collectedKrana, setCollectedKrana] = useState<KranaCollection>(
    initialState.collectedKrana ?? {}
  );

  const [kraataCollection, setKraataCollection] = useState<KraataCollection>(
    initialState.kraataCollection ?? {}
  );

  const [protodermis, setProtodermis] = useState(initialState.protodermis);
  const [protodermisCap, setProtodermisCap] = useState(initialState.protodermisCap);

  const recruitedCharactersRef = useRef(initialState.recruitedCharacters);
  const setRecruitedCharactersRef = useRef<
    Dispatch<SetStateAction<RecruitedCharacterData[]>>
  >(() => {});

  const { activeQuests, completedQuests, setCompletedQuests, startQuest, cancelQuest, completeQuest } = useQuestState({
    initialActive: initialState.activeQuests,
    initialCompleted: initialState.completedQuests,
    getCharacters: () => recruitedCharactersRef.current,
    setRecruitedCharacters: (action) => setRecruitedCharactersRef.current(action),
    addProtodermis: (amount: number) => {
      if (amount > protodermisCap) {
        setProtodermisCap(amount);
        setProtodermis(amount);
      } else {
        setProtodermis((prev) => clamp(prev + amount, 0, protodermisCap));
      }
    },
  });

  const {
    recruitedCharacters,
    setRecruitedCharacters,
    buyableCharacters,
    recruitCharacter,
    assignJobToMatoran,
    removeJobFromMatoran,
    setMaskOverride,
  } = useCharactersState(
    initialState.recruitedCharacters,
    completedQuests,
    protodermis,
    setProtodermis
  );

  recruitedCharactersRef.current = recruitedCharacters;
  setRecruitedCharactersRef.current = setRecruitedCharacters;

  useJobTickEffect(recruitedCharacters, setRecruitedCharacters, (amount) =>
    setProtodermis((prev) => clamp(prev + amount, 0, protodermisCap))
  );

  useQuestNotifications(activeQuests);

  const battle = useBattleState(isNuvaSymbolsSequestered(completedQuests));

  // Auto-save when critical state changes (buyableCharacters is derived, not persisted)
  useGamePersistence({
    version,
    protodermis,
    protodermisCap,
    collectedKrana,
    kraataCollection,
    recruitedCharacters,
    activeQuests,
    completedQuests,
  });

  return {
    version,
    activeQuests,
    completedQuests,
    protodermis,
    protodermisCap,
    collectedKrana,
    kraataCollection,
    recruitedCharacters,
    buyableCharacters: buyableCharacters,
    // State editor API (raw setters; only use while editor is open to avoid conflicts)
    setCompletedQuests,
    setRecruitedCharacters,
    setBuyableCharacters,
    setCollectedKrana,
    setKraataCollection,
    setProtodermis,
    setProtodermisCap,
    addKraata: (power: KraataPower, stage: number, count: number) => {
      setKraataCollection((prev) => addKraataToCollection(prev, power, stage, count));
    },
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

      setProtodermis((prev) => {
        if (prev < evolution.protodermisCost) return prev;
        const evolved = applyCharacterEvolution(matoran, evolution);
        setRecruitedCharacters((prevChars) =>
          prevChars.map((m) => (m.id === matoranId ? evolved : m))
        );
        onSuccess?.(evolved.id);
        return prev - evolution.protodermisCost;
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

      // Apply kraata drops
      const kraataExplicitlyProvided = params.kraataToCollect !== undefined;
      let kraataToCollect: KraataReward[] = params.kraataToCollect ?? [];
      if (!kraataExplicitlyProvided && kraataToCollect.length === 0) {
        kraataToCollect = computeKraataRewardsForBattle(
          params.encounter,
          params.phase,
          params.currentWave,
          params.enemies
        );
      }
      for (const { power, stage, qty } of kraataToCollect) {
        setKraataCollection((prev) => addKraataToCollection(prev, power, stage, qty));
      }
    },
  };
};
