/* eslint-disable @typescript-eslint/no-unused-vars */

import { MatoranJob } from '../types/Jobs';
import { ListedCharacterData, BaseMatoran, Mask, RecruitedCharacterData } from '../types/Matoran';
import { BattleRewardParams, GameState } from '../types/GameState';
import { Quest } from '../types/Quests';
import { LISTED_MATORAN_DATA, RECRUITED_MATORAN_DATA } from './dex/index';
import { INITIAL_BATTLE_STATE } from '../hooks/useBattleState';
import { KranaElement, KranaId } from '../types/Krana';
import { KraataPower } from '../types/Kraata';

export const CURRENT_GAME_STATE_VERSION = 9; // ONLY UPDATE IF BREAKING CHANGES WHERE MADE

export const INITIAL_GAME_STATE: GameState = {
  activeQuests: [],
  addKraata: function (_power: KraataPower, _stage: number, _count: number): void {
    throw new Error('Function not implemented.');
  },
  applyBattleRewards: function (_params: BattleRewardParams): void {
    throw new Error('Function not implemented.');
  },
  assignJobToMatoran: function (_id: BaseMatoran['id'], _job: MatoranJob): void {
    throw new Error('Function not implemented.');
  },
  battle: INITIAL_BATTLE_STATE,
  buyableCharacters: LISTED_MATORAN_DATA,
  cancelQuest: function (_questId: string): void {
    throw new Error('Function not implemented.');
  },
  collectedKrana: {},
  collectKrana: function (_element: KranaElement, _id: KranaId): void {
    throw new Error('Function not implemented.');
  },
  completedQuests: [],
  completeQuest: function (_quest: Quest): void {
    throw new Error('Function not implemented.');
  },
  completeRahkshiForge: function (_rahkshiId: string): void {
    throw new Error('Function not implemented.');
  },
  convertProtodermisToExp: function (
    _matoranId: RecruitedCharacterData['id'],
    _protodermisSpent: number
  ): boolean {
    throw new Error('Function not implemented.');
  },
  evolveCharacter: function (
    _matoranId: RecruitedCharacterData['id'],
    _onSuccess?: (evolvedId: RecruitedCharacterData['id']) => void
  ): boolean {
    throw new Error('Function not implemented.');
  },
  insertKraataIntoRahkshi: function (
    _rahkshiId: string,
    _power: KraataPower,
    _stage: number
  ): void {
    throw new Error('Function not implemented.');
  },
  kraataCollection: {},
  mergeAllKraata: function (): void {
    throw new Error('Function not implemented.');
  },
  mergeKraata: function (_power: KraataPower, _stage: number): void {
    throw new Error('Function not implemented.');
  },
  protodermis: 10,
  protodermisCap: 2000,
  rahkshi: [],
  recruitCharacter: function (_character: ListedCharacterData): void {
    throw new Error('Function not implemented.');
  },
  recruitedCharacters: RECRUITED_MATORAN_DATA,
  removeJobFromMatoran: function (_id: BaseMatoran['id']): void {
    throw new Error('Function not implemented.');
  },
  removeKraataFromRahkshi: function (_rahkshiId: string): void {
    throw new Error('Function not implemented.');
  },
  setMaskOverride: function (_id: RecruitedCharacterData['id'], _mask: Mask): void {
    throw new Error('Function not implemented.');
  },
  startQuest: function (_quest: Quest, _assignedMatoran: BaseMatoran['id'][]): void {
    throw new Error('Function not implemented.');
  },
  startRahkshiForge: function (_power: KraataPower, _stage: number): void {
    throw new Error('Function not implemented.');
  },
  version: CURRENT_GAME_STATE_VERSION,
};
