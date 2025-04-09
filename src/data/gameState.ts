/* eslint-disable @typescript-eslint/no-unused-vars */

import { LogType } from '../types/Logging';
import { MatoranJob } from '../types/Jobs';
import { ListedMatoran, Matoran } from '../types/Matoran';
import { AVAILABLE_CHARACTERS, RECRUITED_CHARACTERS } from './matoran';
import { GameState } from '../types/GameState';
import { Quest } from '../types/Quests';

export const CURRENT_GAME_STATE_VERSION = 6; // ONLY UPDATE IF BREAKING CHANGES WHERE MADE

export const INITIAL_GAME_STATE: GameState = {
  version: CURRENT_GAME_STATE_VERSION,
  activityLog: [],
  widgets: 10,
  completedQuests: [],
  activeQuests: [],
  recruitedCharacters: RECRUITED_CHARACTERS,
  availableCharacters: AVAILABLE_CHARACTERS,
  inventory: {},
  recruitCharacter: function (_character: ListedMatoran): void {
    throw new Error('Function not implemented.');
  },
  addItemToInventory: function (_item: string, _amount: number): void {
    throw new Error('Function not implemented.');
  },
  assignJobToMatoran: function (_id: Matoran['id'], _job: MatoranJob): void {
    throw new Error('Function not implemented.');
  },
  removeJobFromMatoran: function (_id: Matoran['id']): void {
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
  startQuest: function (_quest: Quest, _assignedMatoran: Matoran['id'][]): void {
    throw new Error('Function not implemented.');
  }
};
