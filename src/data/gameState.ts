/* eslint-disable @typescript-eslint/no-unused-vars */

import { LogType } from '../types/Logging';
import { MatoranJob } from '../types/Jobs';
import { ListedCharacterData, BaseMatoran, Mask, RecruitedCharacterData } from '../types/Matoran';
import { GameState } from '../types/GameState';
import { Quest } from '../types/Quests';
import { LISTED_MATORAN_DATA, RECRUITED_MATORAN_DATA } from './matoran';
import { LegoColor } from '../types/Colors';
import { INITIAL_BATTLE_STATE } from '../hooks/useBattleState';
import { KranaElement, KranaId } from '../types/Krana';

export const CURRENT_GAME_STATE_VERSION = 9; // ONLY UPDATE IF BREAKING CHANGES WHERE MADE

export const INITIAL_GAME_STATE: GameState = {
  version: CURRENT_GAME_STATE_VERSION,
  widgetCap: 2000,
  activityLog: [],
  widgets: 10,
  completedQuests: [],
  activeQuests: [],
  recruitedCharacters: RECRUITED_MATORAN_DATA,
  buyableCharacters: LISTED_MATORAN_DATA,
  inventory: {},
  collectedKrana: {},
  battle: INITIAL_BATTLE_STATE,
  recruitCharacter: function (_character: ListedCharacterData): void {
    throw new Error('Function not implemented.');
  },
  addItemToInventory: function (_item: string, _amount: number): void {
    throw new Error('Function not implemented.');
  },
  assignJobToMatoran: function (_id: BaseMatoran['id'], _job: MatoranJob): void {
    throw new Error('Function not implemented.');
  },
  removeJobFromMatoran: function (_id: BaseMatoran['id']): void {
    throw new Error('Function not implemented.');
  },
  addActivityLog: function (_message: string, _type: LogType): void {
    throw new Error('Function not implemented.');
  },
  clearActivityLog: function (): void {
    throw new Error('Function not implemented.');
  },
  removeActivityLogEntry: function (_id: string): void {
    throw new Error('Function not implemented.');
  },
  startQuest: function (_quest: Quest, _assignedMatoran: BaseMatoran['id'][]): void {
    throw new Error('Function not implemented.');
  },
  cancelQuest: function (_questId: string): void {
    throw new Error('Function not implemented.');
  },
  completeQuest: function (_quest: Quest): void {
    throw new Error('Function not implemented.');
  },
  setMaskOverride: function (
    _id: RecruitedCharacterData['id'],
    _color: LegoColor,
    _mask: Mask
  ): void {
    throw new Error('Function not implemented.');
  },
  collectKrana: function (_element: KranaElement, _id: KranaId): void {
    throw new Error('Function not implemented.');
  },
};
