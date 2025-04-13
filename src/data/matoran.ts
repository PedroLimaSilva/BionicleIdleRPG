import { LegoColor } from '../types/Colors';
import {
  BaseMatoran,
  ElementTribe,
  Mask,
  MatoranStage,
  MatoranTag,
  RecruitedCharacterData,
} from '../types/Matoran';
import { GameItemId } from './loot';

export const MATORAN_DEX: Record<string, BaseMatoran> = {
  Toa_Tahu: {
    id: 'Toa_Tahu',
    name: 'Toa Tahu',
    element: ElementTribe.Fire,
    mask: Mask.Hau,
    stage: MatoranStage.ToaMata,
    colors: {
      mask: LegoColor.Red,
      body: LegoColor.Red,
      feet: LegoColor.Red,
      arms: LegoColor.Orange,
      eyes: LegoColor.TransNeonRed,
    },
  },
  Toa_Gali:{
    id:'Toa_Gali',
    name: 'Toa Gali',
    element: ElementTribe.Water,
    mask: Mask.Kaukau,
    stage: MatoranStage.Diminished,
    colors: {
      mask: LegoColor.Blue,
      body: LegoColor.Blue,
      feet: LegoColor.Blue,
      arms: LegoColor.MediumBlue,
      eyes: LegoColor.TransNeonYellow,
    },
  },
  Toa_Pohatu:{
    id:'Toa_Pohatu',
    name: 'Toa Pohatu',
    element: ElementTribe.Stone,
    mask: Mask.Kakama,
    stage: MatoranStage.Diminished,
    colors: {
      mask: LegoColor.DarkOrange,
      body: LegoColor.DarkOrange,
      feet: LegoColor.DarkOrange,
      arms: LegoColor.Tan,
      eyes: LegoColor.TransNeonOrange,
    },
  },
  Kapura: {
    id: 'Kapura',
    name: 'Kapura',
    element: ElementTribe.Fire,
    mask: Mask.Ruru,
    stage: MatoranStage.Diminished,
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
    stage: MatoranStage.Diminished,
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
    stage: MatoranStage.Diminished,
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
    stage: MatoranStage.Diminished,
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
    stage: MatoranStage.Diminished,
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
    stage: MatoranStage.Diminished,
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
    stage: MatoranStage.Diminished,
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
    stage: MatoranStage.Diminished,
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
    stage: MatoranStage.Diminished,
    element: ElementTribe.Water,
    colors: {
      mask: LegoColor.Blue,
      body: LegoColor.MediumBlue,
      feet: LegoColor.Blue,
      arms: LegoColor.MediumBlue,
      eyes: LegoColor.TransNeonYellow,
    },
    tags: [MatoranTag.ChroniclersCompany],
  },
  Lumi: {
    id: 'Lumi',
    name: 'Lumi',
    mask: Mask.Hau,
    stage: MatoranStage.Diminished,
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
    stage: MatoranStage.Diminished,
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
    stage: MatoranStage.Diminished,
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
    stage: MatoranStage.Diminished,
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
    stage: MatoranStage.Diminished,
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
    stage: MatoranStage.Diminished,
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
