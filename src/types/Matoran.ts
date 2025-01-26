export const enum Rarity {
  Common = 'common',
  Rare = 'rare',
  Legend = 'legend',
}

export const enum Mask {
  Hau = 'Hau',
  Huna = 'Huna',
  Kaukau = 'Kaukau',
}

export const enum ElementTribe {
  Water = 'Water',
  Fire = 'Fire',
  Air = 'Air',
  Ice = 'Ice',
}

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

type Color = RGB | RGBA | HEX;

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
