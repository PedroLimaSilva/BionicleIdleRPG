import { Color } from './Colors';

export const enum Rarity {
  Common = 'common',
  Rare = 'rare',
  Legend = 'legend',
}

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

export type Matoran = {
  id: number;
  name: string;
  mask: Mask;
  element: ElementTribe;
  strength: number;
  agility: number;
  intelligence: number;
  cost: number;
  rarity: Rarity;
  colors: {
    mask: Color;
    body: Color;
    feet: Color;
    arms: Color;
    eyes: Color;
  };
};
