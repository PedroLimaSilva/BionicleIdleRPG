import { GameItemId } from '../data/loot';
import { LegoColor } from './Colors';
import { JobAssignment } from './Jobs';
import { Quest } from './Quests';

export const enum Mask {
  Hau = 'Hau',
  Hau_Nuva = 'Hau_Nuva',
  Kaukau = 'Kaukau',
  Kaukau_Nuva = 'Kaukau_Nuva',
  Huna = 'Huna',
  Huna_Nuva = 'Huna_Nuva',
  Kakama = 'Kakama',
  Kakama_Nuva = 'Kakama_Nuva',
  Akaku = 'Akaku',
  Akaku_Nuva = 'Akaku_Nuva',
  Pakari = 'Pakari',
  Pakari_Nuva = 'Pakari_Nuva',
  Miru = 'Miru',
  Ruru = 'Ruru',
  Komau = 'Komau',
  Rau = 'Rau',
  Matatu = 'Matatu',
  Mahiki = 'Mahiki',
}

export enum ElementTribe {
  Water = 'Water',
  Fire = 'Fire',
  Air = 'Air',
  Ice = 'Ice',
  Stone = 'Stone',
  Earth = 'Earth',
  Light = 'Light',
  Shadow = 'Shadow',
}

export const enum MatoranTag {
  ChroniclersCompany = 'ChroniclersCompany',
}

export const enum MatoranStage {
  ToaMata = 'Toa Mata',
  ToaNuva = 'Toa Nuva',
  Diminished = 'Diminished',
  Rebuilt = 'Rebuilt',
  Metru = 'Metru',
}

// Static data for any Matoran
export type BaseMatoran = {
  id: string;
  name: string;
  mask: Mask;
  element: ElementTribe;
  isMaskTransparent?: boolean;
  stage: MatoranStage;
  colors: {
    mask: LegoColor;
    body: LegoColor;
    feet: LegoColor;
    arms: LegoColor;
    eyes: LegoColor;
  };
  tags?: MatoranTag[];
  /** Reference to shared chronicle set - multiple matoran entries can share the same chronicle ID */
  chronicleId?: string;
};

export type ListedCharacterData = {
  id: string;
  cost: number;
  requiredItems: ItemRequirement[];
};

export type RecruitedCharacterData = {
  id: string;
  exp: number;
  assignment?: JobAssignment;
  quest?: Quest['id'];
  maskOverride?: Mask;
  maskColorOverride?: LegoColor;
};

export type ItemRequirement = {
  item: GameItemId;
  quantity: number;
};
