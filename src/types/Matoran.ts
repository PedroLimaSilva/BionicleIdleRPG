export const enum Rarity {
  Common = 'common',
  Rare = 'rare',
  Legend = 'legend',
}

export const enum Mask {
  Hau = 'Hau',
  Huna = 'Huna',
}

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

type Color = RGB | RGBA | HEX;

export type Matoran = {
  id: number;
  name: string;
  mask: Mask;
  element: string;
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
