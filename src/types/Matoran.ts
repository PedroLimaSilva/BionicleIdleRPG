import { Color } from './Colors';

export const enum Mask {
  Hau = 'Hau',
  Kaukau = 'Kaukau',
  Huna = 'Huna',
  Kakama = 'Kakama',
  Akaku = 'Akaku',
  Pakari = 'Pakari',
  Miru = 'Miru',
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

type BaseMatoran = {
  id: number;
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
};

export const enum MatoranStatus {
  Listed,
  Recruited,
}

export type ListedMatoran = BaseMatoran & {
  status: MatoranStatus.Listed;
  cost: number;
};

export type RecruitedMatoran = BaseMatoran & {
  status: MatoranStatus.Recruited;
  exp: number;
};

export type Matoran = ListedMatoran | RecruitedMatoran;
