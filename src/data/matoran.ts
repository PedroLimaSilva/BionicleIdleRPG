import { LegoColor } from '../types/Colors';
import {
  BaseMatoran,
  ElementTribe,
  ListedCharacterData,
  ListedMatoran,
  Mask,
  MatoranTag,
  RecruitedCharacterData,
  RecruitedMatoran,
} from '../types/Matoran';
import { GameItemId } from './loot';

export function getListedMatoran(
  id: string,
  listed: ListedCharacterData[]
): ListedMatoran {
  const base = MATORAN_DEX[id];
  const listing = listed.find((m) => m.id === id);
  if (!base || !listing)
    throw new Error(`Missing data for listed Matoran: ${id}`);
  return {
    ...base,
    cost: listing.cost,
    requiredItems: listing.requiredItems,
  };
}

export function getRecruitedMatoran(
  id: string,
  recruitedCharacters: RecruitedCharacterData[]
): RecruitedMatoran {
  const base = MATORAN_DEX[id];
  const recruited = recruitedCharacters.find((m) => m.id === id);
  if (!base || !recruited)
    throw new Error(`Missing data for recruited Matoran: ${id}`);
  return {
    ...base,
    exp: recruited.exp,
    assignment: recruited.assignment,
    quest: recruited.quest,
  };
}

export const MATORAN_DEX: Record<string, BaseMatoran> = {
  Toa_Tahu: {
    id: 'Toa_Tahu',
    name: 'Toa Tau',
    element: ElementTribe.Fire,
    mask: Mask.Hau,
    colors: {
      mask: LegoColor.Red,
      body: LegoColor.Red,
      feet: LegoColor.Red,
      arms: LegoColor.Orange,
      eyes: LegoColor.TransNeonRed,
    },
  },
  Kapura: {
    id: 'Kapura',
    name: 'Kapura',
    element: ElementTribe.Fire,
    mask: Mask.Ruru,
    colors: {
      mask: LegoColor.Red,
      body: LegoColor.Red,
      feet: LegoColor.Red,
      arms: LegoColor.Red,
      eyes: LegoColor.TransNeonRed,
    },
    tags: [MatoranTag.ChroniclersCompany],
  },
  Takua: {
    id: 'Takua',
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
  },
  Jala: {
    id: 'Jala',
    name: 'Jala',
    mask: Mask.Hau,
    element: ElementTribe.Fire,
    colors: {
      mask: LegoColor.Yellow,
      body: LegoColor.Red,
      feet: LegoColor.Yellow,
      arms: LegoColor.Red,
      eyes: LegoColor.TransNeonRed,
    },
  },
  Hali: {
    id: 'Hali',
    name: 'Hali',
    mask: Mask.Kaukau,
    element: ElementTribe.Water,
    isMaskTransparent: true,
    colors: {
      mask: LegoColor.Blue,
      body: LegoColor.MediumBlue,
      feet: LegoColor.Blue,
      arms: LegoColor.MediumBlue,
      eyes: LegoColor.TransNeonYellow,
    },
  },
  Huki: {
    id: 'Huki',
    name: 'Huki',
    mask: Mask.Kakama,
    element: ElementTribe.Stone,
    colors: {
      mask: LegoColor.DarkOrange,
      body: LegoColor.Tan,
      feet: LegoColor.DarkOrange,
      arms: LegoColor.Tan,
      eyes: LegoColor.TransNeonOrange,
    },
  },
  Nuparu: {
    id: 'Nuparu',
    name: 'Nuparu',
    mask: Mask.Pakari,
    element: ElementTribe.Earth,
    colors: {
      mask: LegoColor.Orange,
      body: LegoColor.Black,
      feet: LegoColor.DarkGray,
      arms: LegoColor.Black,
      eyes: LegoColor.TransGreen,
    },
  },
  Kongu: {
    id: 'Kongu',
    name: 'Kongu',
    mask: Mask.Miru,
    element: ElementTribe.Air,
    colors: {
      mask: LegoColor.DarkTurquoise,
      body: LegoColor.Lime,
      feet: LegoColor.DarkTurquoise,
      arms: LegoColor.Lime,
      eyes: LegoColor.TransNeonGreen,
    },
  },
  Matoro: {
    id: 'Matoro',
    name: 'Matoro',
    mask: Mask.Akaku,
    element: ElementTribe.Ice,
    colors: {
      mask: LegoColor.SandBlue,
      body: LegoColor.White,
      feet: LegoColor.SandBlue,
      arms: LegoColor.White,
      eyes: LegoColor.TransMediumBlue,
    },
  },
  Maku: {
    id: 'Maku',
    name: 'Maku',
    mask: Mask.Huna,
    element: ElementTribe.Water,
    colors: {
      mask: LegoColor.Blue,
      body: LegoColor.MediumBlue,
      feet: LegoColor.Blue,
      arms: LegoColor.MediumBlue,
      eyes: LegoColor.TransNeonYellow,
    },
  },
  Lumi: {
    id: 'Lumi',
    name: 'Lumi',
    mask: Mask.Hau,
    element: ElementTribe.Ice,
    colors: {
      mask: LegoColor.SandBlue,
      body: LegoColor.White,
      feet: LegoColor.SandBlue,
      arms: LegoColor.White,
      eyes: LegoColor.TransMediumBlue,
    },
  },
  Kivi: {
    id: 'Kivi',
    name: 'Kivi',
    mask: Mask.Kaukau,
    element: ElementTribe.Stone,
    isMaskTransparent: true,
    colors: {
      mask: LegoColor.DarkOrange,
      body: LegoColor.Tan,
      feet: LegoColor.DarkOrange,
      arms: LegoColor.Tan,
      eyes: LegoColor.TransNeonOrange,
    },
  },
  Taipu: {
    id: 'Taipu',
    name: 'Taipu',
    mask: Mask.Pakari,
    element: ElementTribe.Earth,
    colors: {
      mask: LegoColor.Black,
      body: LegoColor.Tan,
      feet: LegoColor.Black,
      arms: LegoColor.Tan,
      eyes: LegoColor.TransGreen,
    },
    tags: [MatoranTag.ChroniclersCompany],
  },
  Tamaru: {
    id: 'Tamaru',
    name: 'Tamaru',
    mask: Mask.Rau,
    element: ElementTribe.Air,
    colors: {
      mask: LegoColor.DarkTurquoise,
      body: LegoColor.Lime,
      feet: LegoColor.DarkTurquoise,
      arms: LegoColor.Lime,
      eyes: LegoColor.TransNeonGreen,
    },
    tags: [MatoranTag.ChroniclersCompany],
  },
  Kopeke: {
    id: 'Kopeke',
    name: 'Kopeke',
    mask: Mask.Komau,
    element: ElementTribe.Ice,
    colors: {
      mask: LegoColor.SandBlue,
      body: LegoColor.White,
      feet: LegoColor.SandBlue,
      arms: LegoColor.White,
      eyes: LegoColor.TransMediumBlue,
    },
    tags: [MatoranTag.ChroniclersCompany],
  },
  Hafu: {
    id: 'Hafu',
    name: 'Hafu',
    mask: Mask.Ruru,
    element: ElementTribe.Stone,
    colors: {
      mask: LegoColor.Black,
      body: LegoColor.Tan,
      feet: LegoColor.Black,
      arms: LegoColor.Tan,
      eyes: LegoColor.TransNeonOrange,
    },
    tags: [MatoranTag.ChroniclersCompany],
  },
};

export const RECRUITED_MATORAN_DATA: RecruitedCharacterData[] = [
  {
    id: 'Takua',
    exp: 1000,
  },
];

export const LISTED_MATORAN_DATA = [
  {
    id: 'Takua',
    cost: 1200,
    requiredItems: [
      {
        item: GameItemId.LightStone,
        quantity: 300,
      },
      {
        item: GameItemId.Charcoal,
        quantity: 300,
      },
    ],
  },
  {
    id: 'Jala',
    cost: 1200,
    requiredItems: [
      {
        item: GameItemId.Charcoal,
        quantity: 300,
      },
      {
        item: GameItemId.BurnishedAlloy,
        quantity: 100,
      },
    ],
  },
  {
    id: 'Hali',
    cost: 1200,
    requiredItems: [
      {
        item: GameItemId.WaterAlgae,
        quantity: 300,
      },
      {
        item: GameItemId.GaPearl,
        quantity: 100,
      },
    ],
  },
  {
    id: 'Huki',
    cost: 1200,
    requiredItems: [
      {
        item: GameItemId.StoneBlock,
        quantity: 300,
      },
      {
        item: GameItemId.GemShard,
        quantity: 100,
      },
    ],
  },
  {
    id: 'Nuparu',
    cost: 1200,
    requiredItems: [
      {
        item: GameItemId.LightStone,
        quantity: 300,
      },
      {
        item: GameItemId.BiolumeThread,
        quantity: 100,
      },
    ],
  },
  {
    id: 'Kongu',
    cost: 1200,
    requiredItems: [
      {
        item: GameItemId.FeatherTufts,
        quantity: 300,
      },
      {
        item: GameItemId.JungleResin,
        quantity: 100,
      },
    ],
  },
  {
    id: 'Matoro',
    cost: 1200,
    requiredItems: [
      {
        item: GameItemId.IceChip,
        quantity: 300,
      },
      {
        item: GameItemId.FrostChisel,
        quantity: 100,
      },
    ],
  },
  {
    id: 'Maku',
    cost: 600,
    requiredItems: [
      {
        item: GameItemId.WaterAlgae,
        quantity: 150,
      },
      {
        item: GameItemId.GaPearl,
        quantity: 50,
      },
    ],
  },
  {
    id: 'Lumi',
    cost: 300,
    requiredItems: [
      {
        item: GameItemId.IceChip,
        quantity: 150,
      },
    ],
  },
  {
    id: 'Kivi',
    cost: 300,
    requiredItems: [
      {
        item: GameItemId.StoneBlock,
        quantity: 150,
      },
    ],
  },
  {
    id: 'Taipu',
    cost: 600,
    requiredItems: [
      {
        item: GameItemId.LightStone,
        quantity: 150,
      },
      {
        item: GameItemId.BiolumeThread,
        quantity: 50,
      },
    ],
  },
  {
    id: 'Tamaru',
    cost: 600,
    requiredItems: [
      {
        item: GameItemId.FeatherTufts,
        quantity: 150,
      },
      {
        item: GameItemId.JungleResin,
        quantity: 50,
      },
    ],
  },
  {
    id: 'Kopeke',
    cost: 600,
    requiredItems: [
      {
        item: GameItemId.IceChip,
        quantity: 150,
      },
      {
        item: GameItemId.FrostChisel,
        quantity: 50,
      },
    ],
  },
  {
    id: 'Hafu',
    cost: 600,
    requiredItems: [
      {
        item: GameItemId.StoneBlock,
        quantity: 150,
      },
      {
        item: GameItemId.GemShard,
        quantity: 50,
      },
    ],
  },
];
