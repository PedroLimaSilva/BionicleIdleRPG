import { MATORAN_DEX } from './matoran';
import { ENEMY_DEX } from './enemy';
import { TOA_DEX } from './toa';
import { BaseMatoran, RecruitedCharacterData } from '../../types/Matoran';

const dex = {
  ...ENEMY_DEX,
  ...TOA_DEX,
  ...MATORAN_DEX,
};

/** All characters (enemies, Toa, Matoran) by id. Indexable by string for runtime ids. */
export const CHARACTER_DEX: Record<string, BaseMatoran> = dex;

export const RECRUITED_MATORAN_DATA: RecruitedCharacterData[] = [
  {
    id: 'Takua',
    exp: 1000,
  },
];

export const LISTED_MATORAN_DATA = [];
