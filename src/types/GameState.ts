import { GameItemId } from '../data/loot';
import { BattleState, BattlePhase } from '../hooks/useBattleState';
import { Inventory } from '../services/inventoryUtils';
import { MatoranJob } from './Jobs';
import { ListedCharacterData, Mask, RecruitedCharacterData } from './Matoran';
import { Quest, QuestProgress } from './Quests';
import { KranaCollection, KranaElement, KranaId } from './Krana';
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
};

export type GameState = {
  version: number;
  widgets: number;
  widgetCap: number;
  inventory: Inventory;
  collectedKrana: KranaCollection;
  buyableCharacters: ListedCharacterData[];
  recruitedCharacters: RecruitedCharacterData[];
  activeQuests: QuestProgress[];
  completedQuests: string[];
  battle: BattleState;
  recruitCharacter: (character: ListedCharacterData) => void;
  setMaskOverride: (id: RecruitedCharacterData['id'], mask: Mask) => void;
  collectKrana: (element: KranaElement, id: KranaId) => void;
  addItemToInventory: (item: GameItemId, amount: number) => void;
  assignJobToMatoran: (matoranId: RecruitedCharacterData['id'], job: MatoranJob) => void;
  removeJobFromMatoran: (matoranId: RecruitedCharacterData['id']) => void;
  startQuest: (quest: Quest, assignedMatoran: RecruitedCharacterData['id'][]) => void;
  cancelQuest: (questId: string) => void;
  completeQuest: (quest: Quest) => void;
  applyBattleRewards: (params: BattleRewardParams) => void;
  evolveBohrokToKal: (
    matoranId: RecruitedCharacterData['id'],
    onSuccess?: (evolvedId: RecruitedCharacterData['id']) => void
  ) => boolean;
  evolveMatoranToRebuilt: (
    matoranId: RecruitedCharacterData['id'],
    onSuccess?: (evolvedId: RecruitedCharacterData['id']) => void
  ) => boolean;
  evolveToaToNuva: (
    matoranId: RecruitedCharacterData['id'],
    onSuccess?: (evolvedId: RecruitedCharacterData['id']) => void
  ) => boolean;
};

export type PartialGameState = Pick<
  GameState,
  | 'version'
  | 'widgets'
  | 'widgetCap'
  | 'inventory'
  | 'collectedKrana'
  | 'buyableCharacters'
  | 'recruitedCharacters'
  | 'activeQuests'
  | 'completedQuests'
>;
