import { GameItemId } from '../data/loot';
import { Color } from './Colors';
import { JobAssignment } from './Jobs';

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
  Matatu = "Matatu",
  Mahiki = "Mahiki",
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

type BaseMatoran = {
  id: string;
  name: string;
  mask: Mask;
  element: ElementTribe;
  isMaskTransparent?: boolean;
  colors: {
    mask: Color;
    body: Color;
    feet: Color;
    arms: Color;
    eyes: Color;
  };
  tags?: MatoranTag[];
};

export const enum MatoranStatus {
  Listed,
  Recruited,
}

export type ItemRequirement = {
  item: GameItemId;
  quantity: number;
};

export type ListedMatoran = BaseMatoran & {
  status: MatoranStatus.Listed;
  cost: number;
  requiredItems?: ItemRequirement[];
};

export type RecruitedMatoran = BaseMatoran & {
  assignment?: JobAssignment;
  exp: number;
  status: MatoranStatus.Recruited;
};

export type Matoran = ListedMatoran | RecruitedMatoran;
