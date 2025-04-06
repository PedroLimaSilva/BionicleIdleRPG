import { LegoColor } from '../types/Colors';
import {
  ElementTribe,
  ListedMatoran,
  Mask,
  MatoranStatus,
  RecruitedMatoran,
} from '../types/Matoran';

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
    cost: 120,
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
    mask: Mask.Hau,
    element: ElementTribe.Fire,
    cost: 120,
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
    mask: Mask.Kaukau,
    element: ElementTribe.Water,
    cost: 120,
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
    mask: Mask.Kakama,
    element: ElementTribe.Stone,
    cost: 120,
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
    mask: Mask.Pakari,
    element: ElementTribe.Earth,
    cost: 120,
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
    mask: Mask.Miru,
    element: ElementTribe.Air,
    cost: 120,
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
    mask: Mask.Akaku,
    element: ElementTribe.Ice,
    cost: 120,
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
    mask: Mask.Huna,
    element: ElementTribe.Water,
    cost: 100,
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
    mask: Mask.Hau,
    element: ElementTribe.Water,
    cost: 100,
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
    id: 10,
    name: 'Le Matoran',
    mask: Mask.Kaukau,
    element: ElementTribe.Air,
    cost: 50,
    status: MatoranStatus.Listed,
    isMaskTransparent: true,
    colors: {
      mask: LegoColor.DarkTurquoise,
      body: LegoColor.Lime,
      feet: LegoColor.DarkTurquoise,
      arms: LegoColor.Lime,
      eyes: LegoColor.TransNeonGreen,
    },
  },
];
