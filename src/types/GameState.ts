import type { Dispatch, SetStateAction } from 'react';
import { BattleState, BattlePhase } from '../hooks/useBattleState';
import { MatoranJob } from './Jobs';
import { BaseMatoran, ListedCharacterData, Mask, RecruitedCharacterData } from './Matoran';
import { Quest, QuestProgress } from './Quests';
import { KranaCollection, KranaElement, KranaId } from './Krana';
import { KraataCollection, KraataPower, KraataReward } from './Kraata';
import { Combatant, EnemyEncounter } from './Combat';
import { RahkshiArmor } from './Rahkshi';

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
  rahkshi: RahkshiArmor[];
  buyableCharacters: ListedCharacterData[];
  recruitedCharacters: RecruitedCharacterData[];
  /**
   * Player-created and player-received custom characters. Their `BaseMatoran` data lives
   * here (not in `CHARACTER_DEX`) so we can persist it across loads. At runtime each entry
   * is registered into `CHARACTER_DEX` so the rest of the codebase can look them up by id.
   */
  customCharacters: BaseMatoran[];
  activeQuests: QuestProgress[];
  completedQuests: string[];
  battle: BattleState;
  recruitCharacter: (character: ListedCharacterData) => void;
  /**
   * Adds a freshly designed custom character: registers it in `CHARACTER_DEX`,
   * stores its base data in `customCharacters`, deducts the cost, and adds it to
   * `recruitedCharacters`. Returns the created id, or null if it could not be created.
   */
  createCustomCharacter: (base: Omit<BaseMatoran, 'id'>) => string | null;
  /**
   * Registers a custom character base entry received from a share link, without
   * recruiting it. Appears in the buyable list until recruited or dismissed.
   * No-ops if the id is already known. Returns the registered id (existing or new).
   */
  registerSharedCustomCharacter: (base: BaseMatoran) => string;
  /** Removes a custom character from the recruitment list (only valid before recruitment). */
  dismissCustomCharacter: (id: string) => void;
  /**
   * Updates an existing recruited custom character's appearance and name, and syncs their
   * `stage` on the recruited slice (used when confirming the character-creation form after
   * evolution). Returns false if the id is invalid or the character is not found.
   */
  updateCustomCharacter: (
    id: string,
    base: Omit<BaseMatoran, 'id'>,
    extras?: Pick<RecruitedCharacterData, 'customMataModelId'>
  ) => boolean;
  setMaskOverride: (id: RecruitedCharacterData['id'], mask: Mask) => void;
  collectKrana: (element: KranaElement, id: KranaId) => void;
  addKraata: (power: KraataPower, stage: number, count: number) => void;
  mergeKraata: (power: KraataPower, stage: number) => void;
  mergeAllKraata: () => void;
  startRahkshiForge: (power: KraataPower, stage: number) => void;
  completeRahkshiForge: (rahkshiId: string) => void;
  insertKraataIntoRahkshi: (rahkshiId: string, power: KraataPower, stage: number) => void;
  removeKraataFromRahkshi: (rahkshiId: string) => void;
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
  /** Spend protodermis to add XP to a recruited character (detail page). Returns false if invalid. */
  convertProtodermisToExp: (
    matoranId: RecruitedCharacterData['id'],
    protodermisSpent: number
  ) => boolean;
};

export type PartialGameState = Pick<
  GameState,
  | 'version'
  | 'protodermis'
  | 'protodermisCap'
  | 'collectedKrana'
  | 'kraataCollection'
  | 'rahkshi'
  | 'recruitedCharacters'
  | 'customCharacters'
  | 'activeQuests'
  | 'completedQuests'
>;

/** Raw setters for the game state editor (Settings). Use only while editor is open. */
export type GameStateEditorApi = {
  setCompletedQuests: (ids: string[]) => void;
  setRecruitedCharacters: Dispatch<SetStateAction<RecruitedCharacterData[]>>;
  setCollectedKrana: Dispatch<SetStateAction<KranaCollection>>;
  setKraataCollection: Dispatch<SetStateAction<KraataCollection>>;
  setProtodermis: Dispatch<SetStateAction<number>>;
  setProtodermisCap: Dispatch<SetStateAction<number>>;
};
