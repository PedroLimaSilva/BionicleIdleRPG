import { LegoColor } from '../../types/Colors';
import { ElementTribe, Mask, MatoranStage } from '../../types/Matoran';
import { CHRONICLE_IDS } from '../chronicles';
import { metruLimbPalettes, partPalette, uniformLimbPalettes } from './partPalettes';

function mataToaColors(colors: {
  arms: LegoColor;
  body: LegoColor;
  eyes: LegoColor;
  face: LegoColor;
  feet: LegoColor;
  mask: LegoColor;
  weaponGlow?: LegoColor;
}) {
  const glow = colors.eyes;
  return {
    eyes: colors.eyes,
    face: colors.face,
    mask: colors.mask,
    ...uniformLimbPalettes(
      partPalette(colors.body, {
        glow,
        metal: LegoColor.LightGray,
        secondary: colors.arms,
      })
    ),
    weapon: partPalette(colors.body, {
      glow: colors.weaponGlow ?? colors.arms,
      metal: LegoColor.LightGray,
    }),
  };
}

export const TOA_DEX = {
  Takanuva: {
    chronicleId: CHRONICLE_IDS.TAKUA,
    colors: {
      arms: partPalette(LegoColor.LightGray, {
        glow: LegoColor.TransNeonOrange,
        metal: LegoColor.FlatDarkGold,
        secondary: LegoColor.White,
      }),
      body: partPalette(LegoColor.White, {
        glow: LegoColor.TransNeonOrange,
        metal: LegoColor.FlatDarkGold,
        secondary: LegoColor.White,
      }),
      eyes: LegoColor.TransNeonOrange,
      face: LegoColor.White,
      feet: partPalette(LegoColor.White, {
        glow: LegoColor.TransNeonOrange,
        metal: LegoColor.FlatDarkGold,
      }),
      legs: partPalette(LegoColor.LightGray, {
        glow: LegoColor.TransNeonOrange,
        metal: LegoColor.FlatDarkGold,
        secondary: LegoColor.White,
      }),
      mask: LegoColor.FlatDarkGold,
      weapon: partPalette(LegoColor.FlatDarkGold, {
        glow: LegoColor.TransNeonOrange,
        metal: LegoColor.LightGray,
      }),
    },
    element: ElementTribe.Light,
    id: 'Takanuva',
    mask: Mask.Avohkii,
    name: 'Takanuva',
    stage: MatoranStage.ToaNuva,
  },
  Toa_Gali: {
    chronicleId: CHRONICLE_IDS.GALI,
    colors: mataToaColors({
      arms: LegoColor.MediumBlue,
      body: LegoColor.Blue,
      eyes: LegoColor.TransNeonYellow,
      face: LegoColor.LightGray,
      feet: LegoColor.Blue,
      mask: LegoColor.Blue,
      weaponGlow: LegoColor.MediumBlue,
    }),
    element: ElementTribe.Water,
    id: 'Toa_Gali',
    isMaskTransparent: true,
    mask: Mask.Kaukau,
    name: 'Toa Gali',
    stage: MatoranStage.ToaMata,
  },
  Toa_Gali_Nuva: {
    chronicleId: CHRONICLE_IDS.GALI,
    colors: mataToaColors({
      arms: LegoColor.MediumBlue,
      body: LegoColor.Blue,
      eyes: LegoColor.TransNeonYellow,
      face: LegoColor.LightGray,
      feet: LegoColor.Blue,
      mask: LegoColor.Blue,
      weaponGlow: LegoColor.MediumBlue,
    }),
    element: ElementTribe.Water,
    id: 'Toa_Gali_Nuva',
    isMaskTransparent: true,
    mask: Mask.KaukauNuva,
    name: 'Toa Gali Nuva',
    stage: MatoranStage.ToaNuva,
  },
  Toa_Kopaka: {
    chronicleId: CHRONICLE_IDS.KOPAKA,
    colors: mataToaColors({
      arms: LegoColor.LightGray,
      body: LegoColor.White,
      eyes: LegoColor.MediumBlue,
      face: LegoColor.LightGray,
      feet: LegoColor.White,
      mask: LegoColor.White,
      weaponGlow: LegoColor.MediumBlue,
    }),
    element: ElementTribe.Ice,
    id: 'Toa_Kopaka',
    mask: Mask.Akaku,
    name: 'Toa Kopaka',
    stage: MatoranStage.ToaMata,
  },
  Toa_Kopaka_Nuva: {
    chronicleId: CHRONICLE_IDS.KOPAKA,
    colors: mataToaColors({
      arms: LegoColor.LightGray,
      body: LegoColor.White,
      eyes: LegoColor.MediumBlue,
      face: LegoColor.LightGray,
      feet: LegoColor.White,
      mask: LegoColor.White,
      weaponGlow: LegoColor.MediumBlue,
    }),
    element: ElementTribe.Ice,
    id: 'Toa_Kopaka_Nuva',
    mask: Mask.AkakuNuva,
    name: 'Toa Kopaka Nuva',
    stage: MatoranStage.ToaNuva,
  },
  Toa_Lewa: {
    chronicleId: CHRONICLE_IDS.LEWA,
    colors: mataToaColors({
      arms: LegoColor.Lime,
      body: LegoColor.Green,
      eyes: LegoColor.TransNeonGreen,
      face: LegoColor.LightGray,
      feet: LegoColor.Green,
      mask: LegoColor.Green,
      weaponGlow: LegoColor.Lime,
    }),
    element: ElementTribe.Air,
    id: 'Toa_Lewa',
    mask: Mask.Miru,
    name: 'Toa Lewa',
    stage: MatoranStage.ToaMata,
  },
  Toa_Lewa_Nuva: {
    chronicleId: CHRONICLE_IDS.LEWA,
    colors: mataToaColors({
      arms: LegoColor.Lime,
      body: LegoColor.Green,
      eyes: LegoColor.TransNeonGreen,
      face: LegoColor.LightGray,
      feet: LegoColor.Green,
      mask: LegoColor.Green,
    }),
    element: ElementTribe.Air,
    id: 'Toa_Lewa_Nuva',
    mask: Mask.MiruNuva,
    name: 'Toa Lewa Nuva',
    stage: MatoranStage.ToaNuva,
  },
  Toa_Lhikan: {
    colors: {
      ...metruLimbPalettes(LegoColor.Orange),
      body: partPalette(LegoColor.Red, {
        metal: LegoColor.LightGray,
        secondary: LegoColor.Orange,
      }),
      eyes: LegoColor.TransNeonRed,
      face: LegoColor.LightGray,
      feet: partPalette(LegoColor.Red, {
        metal: LegoColor.LightGray,
        secondary: LegoColor.Orange,
      }),
      mask: LegoColor.Red,
      weapon: partPalette(LegoColor.Orange, {
        metal: LegoColor.LightGray,
      }),
    },
    element: ElementTribe.Fire,
    id: 'Toa_Lhikan',
    mask: Mask.Hau,
    name: 'Toa Lhikan',
    stage: MatoranStage.ToaMetru,
  },
  Toa_Onua: {
    chronicleId: CHRONICLE_IDS.ONUA,
    colors: mataToaColors({
      arms: LegoColor.DarkGray,
      body: LegoColor.Black,
      eyes: LegoColor.Green,
      face: LegoColor.LightGray,
      feet: LegoColor.Black,
      mask: LegoColor.Black,
    }),
    element: ElementTribe.Earth,
    id: 'Toa_Onua',
    mask: Mask.Pakari,
    name: 'Toa Onua',
    stage: MatoranStage.ToaMata,
  },
  Toa_Onua_Nuva: {
    chronicleId: CHRONICLE_IDS.ONUA,
    colors: mataToaColors({
      arms: LegoColor.DarkGray,
      body: LegoColor.Black,
      eyes: LegoColor.Green,
      face: LegoColor.LightGray,
      feet: LegoColor.Black,
      mask: LegoColor.Black,
    }),
    element: ElementTribe.Earth,
    id: 'Toa_Onua_Nuva',
    mask: Mask.PakariNuva,
    name: 'Toa Onua Nuva',
    stage: MatoranStage.ToaNuva,
  },
  Toa_Pohatu: {
    chronicleId: CHRONICLE_IDS.POHATU,
    colors: mataToaColors({
      arms: LegoColor.Tan,
      body: LegoColor.Brown,
      eyes: LegoColor.TransNeonOrange,
      face: LegoColor.LightGray,
      feet: LegoColor.Brown,
      mask: LegoColor.Brown,
    }),
    element: ElementTribe.Stone,
    id: 'Toa_Pohatu',
    mask: Mask.Kakama,
    name: 'Toa Pohatu',
    stage: MatoranStage.ToaMata,
  },
  Toa_Pohatu_Nuva: {
    chronicleId: CHRONICLE_IDS.POHATU,
    colors: mataToaColors({
      arms: LegoColor.Tan,
      body: LegoColor.Brown,
      eyes: LegoColor.TransNeonOrange,
      face: LegoColor.LightGray,
      feet: LegoColor.Brown,
      mask: LegoColor.Brown,
    }),
    element: ElementTribe.Stone,
    id: 'Toa_Pohatu_Nuva',
    mask: Mask.KakamaNuva,
    name: 'Toa Pohatu Nuva',
    stage: MatoranStage.ToaNuva,
  },
  Toa_Tahu: {
    chronicleId: CHRONICLE_IDS.TAHU,
    colors: mataToaColors({
      arms: LegoColor.Orange,
      body: LegoColor.Red,
      eyes: LegoColor.TransNeonRed,
      face: LegoColor.LightGray,
      feet: LegoColor.Red,
      mask: LegoColor.Red,
      weaponGlow: LegoColor.Orange,
    }),
    element: ElementTribe.Fire,
    id: 'Toa_Tahu',
    mask: Mask.Hau,
    name: 'Toa Tahu',
    stage: MatoranStage.ToaMata,
  },
  Toa_Tahu_Nuva: {
    chronicleId: CHRONICLE_IDS.TAHU,
    colors: mataToaColors({
      arms: LegoColor.Orange,
      body: LegoColor.Red,
      eyes: LegoColor.TransNeonRed,
      face: LegoColor.LightGray,
      feet: LegoColor.Red,
      mask: LegoColor.Red,
      weaponGlow: LegoColor.Orange,
    }),
    element: ElementTribe.Fire,
    id: 'Toa_Tahu_Nuva',
    mask: Mask.HauNuva,
    name: 'Toa Tahu Nuva',
    stage: MatoranStage.ToaNuva,
  },
};
