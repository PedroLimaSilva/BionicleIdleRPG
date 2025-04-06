import { LegoColor } from '../types/Colors';
import {
  ElementTribe,
  ListedMatoran,
  Mask,
  MatoranStatus,
  RecruitedMatoran,
} from '../types/Matoran';
import { GameItemId } from './loot';

export function getMatoranFromInventoryById(
  id: RecruitedMatoran['id'],
  inventory: RecruitedMatoran[]
) {
  return inventory.find((m) => m.id === id);
}

export const RECRUITED_CHARACTERS: RecruitedMatoran[] = [
  {
    id: 1,
    status: MatoranStatus.Recruited,
    name: 'Takua',
    mask: Mask.Pakari,
    element: ElementTribe.Light,
    colors: {
      mask: LegoColor.MediumBlue,
      body: LegoColor.Red,
      feet: LegoColor.Yellow,
      arms: LegoColor.Red,
      eyes: LegoColor.TransNeonRed,
    },
    exp: 1000,
  },
];

export const AVAILABLE_CHARACTERS: ListedMatoran[] = [
  {
    id: 1,
    name: 'Takua',
    mask: Mask.Pakari,
    element: ElementTribe.Light,
    cost: 1200,
    requiredItems: [
      { item: GameItemId.LightStone, quantity: 300 },
      { item: GameItemId.Charcoal, quantity: 300 },
    ],
    status: MatoranStatus.Listed,
    colors: {
      mask: LegoColor.MediumBlue,
      body: LegoColor.Red,
      feet: LegoColor.Yellow,
      arms: LegoColor.Red,
      eyes: LegoColor.TransNeonRed,
    },
  },
  {
    id: 2,
    name: 'Jala',
    element: ElementTribe.Fire,
    mask: Mask.Hau,
    cost: 1200,
    requiredItems: [
      { item: GameItemId.Charcoal, quantity: 300 },
      { item: GameItemId.BurnishedAlloy, quantity: 100 },
    ],
    status: MatoranStatus.Listed,
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
    element: ElementTribe.Water,
    mask: Mask.Kaukau,
    cost: 1200,
    requiredItems: [
      { item: GameItemId.WaterAlgae, quantity: 300 },
      { item: GameItemId.GaPearl, quantity: 100 },
    ],
    status: MatoranStatus.Listed,
    isMaskTransparent: true,
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
    element: ElementTribe.Stone,
    mask: Mask.Kakama,
    cost: 1200,
    requiredItems: [
      { item: GameItemId.StoneBlock, quantity: 300 },
      { item: GameItemId.GemShard, quantity: 100 },
    ],
    status: MatoranStatus.Listed,
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
    element: ElementTribe.Earth,
    mask: Mask.Pakari,
    cost: 1200,
    requiredItems: [
      { item: GameItemId.LightStone, quantity: 300 },
      { item: GameItemId.BiolumeThread, quantity: 100 },
    ],
    status: MatoranStatus.Listed,
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
    element: ElementTribe.Air,
    mask: Mask.Miru,
    cost: 1200,
    requiredItems: [
      { item: GameItemId.FeatherTufts, quantity: 300 },
      { item: GameItemId.JungleResin, quantity: 100 },
    ],
    status: MatoranStatus.Listed,
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
    element: ElementTribe.Ice,
    mask: Mask.Akaku,
    cost: 1200,
    requiredItems: [
      { item: GameItemId.IceChip, quantity: 300 },
      { item: GameItemId.FrostChisel, quantity: 100 },
    ],
    status: MatoranStatus.Listed,
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
    element: ElementTribe.Water,
    mask: Mask.Huna,
    cost: 600,
    requiredItems: [
      { item: GameItemId.WaterAlgae, quantity: 150 },
      { item: GameItemId.GaPearl, quantity: 50 },
    ],
    status: MatoranStatus.Listed,
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
    element: ElementTribe.Ice,
    mask: Mask.Hau,
    cost: 300,
    requiredItems: [{ item: GameItemId.IceChip, quantity: 150 }],
    status: MatoranStatus.Listed,
    colors: {
      mask: LegoColor.SandBlue,
      body: LegoColor.White,
      feet: LegoColor.SandBlue,
      arms: LegoColor.White,
      eyes: LegoColor.TransMediumBlue,
    },
  },
  {
    id: 10,
    name: 'Kivi',
    element: ElementTribe.Stone,
    mask: Mask.Kaukau,
    cost: 300,
    requiredItems: [{ item: GameItemId.StoneBlock, quantity: 150 }],
    status: MatoranStatus.Listed,
    isMaskTransparent: true,
    colors: {
      mask: LegoColor.DarkOrange,
      body: LegoColor.Tan,
      feet: LegoColor.DarkOrange,
      arms: LegoColor.Tan,
      eyes: LegoColor.TransNeonOrange,
    },
  },
];
