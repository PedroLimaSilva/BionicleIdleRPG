import { GameItemId } from '../data/loot';
import { Color } from './Colors';
import { JobAssignment } from './Jobs';
import { Quest } from './Quests';

export const enum Mask {
  Hau = 'Hau',
  Kaukau = 'Kaukau',
  Huna = 'Huna',
  Kakama = 'Kakama',
  Akaku = 'Akaku',
  Pakari = 'Pakari',
  Miru = 'Miru',
  Ruru = 'Ruru',
  Komau = 'Komau',
  Rau = 'Rau',
  Matatu = 'Matatu',
  Mahiki = 'Mahiki',
}

export const enum ElementTribe {
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
    mask: Color;
    body: Color;
    feet: Color;
    arms: Color;
    eyes: Color;
  };
  tags?: MatoranTag[];
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
};

export type ItemRequirement = {
  item: GameItemId;
  quantity: number;
};
