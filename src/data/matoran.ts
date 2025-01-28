import { GameState } from '../providers/Game';
import { LegoColor } from '../types/Colors';
import { ElementTribe, Mask, Matoran, Rarity } from '../types/Matoran';

export function getMatoranFromInventoryById(
  id: Matoran['id'],
  inventory: Matoran[]
) {
  return inventory.find((m) => m.id === id);
}


export const INITIAL_GAME_STATE:GameState = {
  widgets: 1000,
  recruitedCharacters: [
    {
      id: 1,
      name: 'Takua',
      mask: Mask.Pakari,
      element: ElementTribe.Light,
      strength: 8,
      agility: 5,
      intelligence: 6,
      cost: 120,
      rarity: Rarity.Legend,
      colors: {
        mask: LegoColor.MediumBlue,
        body: LegoColor.Red,
        feet: LegoColor.Yellow,
        arms: LegoColor.Red,
        eyes: LegoColor.TransNeonRed,
      },
    },
  ],
  availableCharacters: [
    {
      id: 2,
      name: 'Jala',
      mask: Mask.Hau,
      element: ElementTribe.Fire,
      strength: 8,
      agility: 5,
      intelligence: 6,
      cost: 120,
      rarity: Rarity.Legend,
      colors: {
        mask: LegoColor.Yellow,
        body: LegoColor.Red,
        feet: LegoColor.Yellow,
        arms: LegoColor.Red,
        eyes: LegoColor.TransNeonRed,
      },
    },
    {
      id: 3,
      name: 'Hali',
      mask: Mask.Kaukau,
      element: ElementTribe.Water,
      strength: 5,
      agility: 7,
      intelligence: 8,
      rarity: Rarity.Legend,
      cost: 120,
      colors: {
        mask: LegoColor.Blue,
        body: LegoColor.MediumBlue,
        feet: LegoColor.Blue,
        arms: LegoColor.MediumBlue,
        eyes: LegoColor.TransNeonYellow,
      },
    },
    {
      id: 4,
      name: 'Huki',
      mask: Mask.Kakama,
      element: ElementTribe.Stone,
      strength: 5,
      agility: 7,
      intelligence: 8,
      rarity: Rarity.Legend,
      cost: 120,
      colors: {
        mask: LegoColor.DarkOrange,
        body: LegoColor.Tan,
        feet: LegoColor.DarkOrange,
        arms: LegoColor.Tan,
        eyes: LegoColor.TransNeonOrange,
      },
    },
    {
      id: 5,
      name: 'Nuparu',
      mask: Mask.Pakari,
      element: ElementTribe.Earth,
      strength: 5,
      agility: 7,
      intelligence: 8,
      rarity: Rarity.Legend,
      cost: 120,
      colors: {
        mask: LegoColor.Orange,
        body: LegoColor.Black,
        feet: LegoColor.DarkGray,
        arms: LegoColor.Black,
        eyes: LegoColor.TransGreen,
      },
    },
    {
      id: 6,
      name: 'Kongu',
      mask: Mask.Miru,
      element: ElementTribe.Air,
      strength: 5,
      agility: 7,
      intelligence: 8,
      rarity: Rarity.Legend,
      cost: 120,
      colors: {
        mask: LegoColor.DarkTurquoise,
        body: LegoColor.Lime,
        feet: LegoColor.DarkTurquoise,
        arms: LegoColor.Lime,
        eyes: LegoColor.TransNeonGreen,
      },
    },
    {
      id: 7,
      name: 'Matoro',
      mask: Mask.Akaku,
      element: ElementTribe.Ice,
      strength: 5,
      agility: 7,
      intelligence: 8,
      rarity: Rarity.Legend,
      cost: 120,
      colors: {
        mask: LegoColor.SandBlue,
        body: LegoColor.White,
        feet: LegoColor.SandBlue,
        arms: LegoColor.White,
        eyes: LegoColor.TransMediumBlue,
      },
    },
    {
      id: 8,
      name: 'Maku',
      mask: Mask.Huna,
      element: ElementTribe.Water,
      strength: 5,
      agility: 7,
      intelligence: 8,
      rarity: Rarity.Rare,
      cost: 100,
      colors: {
        mask: LegoColor.Blue,
        body: LegoColor.MediumBlue,
        feet: LegoColor.Blue,
        arms: LegoColor.MediumBlue,
        eyes: LegoColor.TransNeonYellow,
      },
    },
    {
      id: 9,
      name: 'Lumi',
      mask: Mask.Hau,
      element: ElementTribe.Water,
      strength: 5,
      agility: 7,
      intelligence: 8,
      rarity: Rarity.Rare,
      cost: 100,
      colors: {
        mask: LegoColor.LightGray,
        body: LegoColor.White,
        feet: LegoColor.LightGray,
        arms: LegoColor.White,
        eyes: LegoColor.TransMediumBlue,
      },
    },
    {
      id: 10,
      name: 'Le Matoran',
      mask: Mask.Kaukau,
      element: ElementTribe.Water,
      strength: 5,
      agility: 7,
      intelligence: 8,
      rarity: Rarity.Common,
      cost: 50,
      colors: {
        mask: LegoColor.DarkTurquoise,
        body: LegoColor.Lime,
        feet: LegoColor.DarkTurquoise,
        arms: LegoColor.Lime,
        eyes: LegoColor.TransNeonGreen,
      },
    },
  ],
  inventory: {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  recruitCharacter: function (_character: Matoran, _cost: number): void {
    throw new Error('Function not implemented.');
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addItemToInventory: function (_item: string, _amount: number): void {
    throw new Error('Function not implemented.');
  }
}