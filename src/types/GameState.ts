import type { Dispatch, SetStateAction } from 'react';
import { BattleState, BattlePhase } from '../hooks/useBattleState';
import { MatoranJob } from './Jobs';
import { ListedCharacterData, Mask, RecruitedCharacterData } from './Matoran';
import { Quest, QuestProgress } from './Quests';
import { KranaCollection, KranaElement, KranaId } from './Krana';
import { KraataCollection, KraataPower, KraataReward, KraataTransformation } from './Kraata';
import { Combatant, EnemyEncounter } from './Combat';

export type KranaReward = { element: KranaElement; kranaId: KranaId };

export type BattleRewardParams = {
  encounter: EnemyEncounter;
  phase: BattlePhase;
  currentWave: number;
  enemies: Combatant[];
  team: Combatant[];
  /** When provided, these Krana are applied instead of rolling (used so UI can show then apply the same list). */
  kranaToApply?: KranaReward[];
  /** When provided, these kraata are added to the collection instead of rolling. */
  kraataToCollect?: KraataReward[];
};

export type GameState = {
  version: number;
  protodermis: number;
  protodermisCap: number;
  collectedKrana: KranaCollection;
  kraataCollection: KraataCollection;
  kraataTransformations: KraataTransformation[];
  buyableCharacters: ListedCharacterData[];
  recruitedCharacters: RecruitedCharacterData[];
  activeQuests: QuestProgress[];
  completedQuests: string[];
  battle: BattleState;
  recruitCharacter: (character: ListedCharacterData) => void;
  setMaskOverride: (id: RecruitedCharacterData['id'], mask: Mask) => void;
  collectKrana: (element: KranaElement, id: KranaId) => void;
  addKraata: (power: KraataPower, stage: number, count: number) => void;
  mergeKraata: (power: KraataPower, stage: number) => void;
  startKraataArmor: (power: KraataPower, stage: number) => void;
  completeKraataArmor: (power: KraataPower, stage: number) => void;
  assignJobToMatoran: (matoranId: RecruitedCharacterData['id'], job: MatoranJob) => void;
  removeJobFromMatoran: (matoranId: RecruitedCharacterData['id']) => void;
  startQuest: (quest: Quest, assignedMatoran: RecruitedCharacterData['id'][]) => void;
  cancelQuest: (questId: string) => void;
  completeQuest: (quest: Quest) => void;
  applyBattleRewards: (params: BattleRewardParams) => void;
  evolveCharacter: (
    matoranId: RecruitedCharacterData['id'],
    onSuccess?: (evolvedId: RecruitedCharacterData['id']) => void
  ) => boolean;
};

export type PartialGameState = Pick<
  GameState,
  | 'version'
  | 'protodermis'
  | 'protodermisCap'
  | 'collectedKrana'
  | 'kraataCollection'
  | 'kraataTransformations'
  | 'buyableCharacters'
  | 'recruitedCharacters'
  | 'activeQuests'
  | 'completedQuests'
>;

/** Raw setters for the game state editor (Settings). Use only while editor is open. */
export type GameStateEditorApi = {
  setCompletedQuests: (ids: string[]) => void;
  setRecruitedCharacters: Dispatch<SetStateAction<RecruitedCharacterData[]>>;
  setBuyableCharacters: Dispatch<SetStateAction<ListedCharacterData[]>>;
  setCollectedKrana: Dispatch<SetStateAction<KranaCollection>>;
  setKraataCollection: Dispatch<SetStateAction<KraataCollection>>;
  setProtodermis: Dispatch<SetStateAction<number>>;
  setProtodermisCap: Dispatch<SetStateAction<number>>;
};
