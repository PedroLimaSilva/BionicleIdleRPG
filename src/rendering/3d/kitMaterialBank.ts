import { LegoColor } from '../../types/Colors';
import {
  getWeatheredMetalMaterial,
  type WeatheredMetalOptions,
} from './CharacterScene/WeatheredMetalMaterial';
import { MATA_METAL_PBR, NUVA_METAL_PBR } from './kit/palettes/metalPbr';
import { METRU_WEATHERED } from './kit/palettes/metruKitPlayerPalette';
import {
  buildTransmissiveKitMaterial,
  type TransmissiveKitKind,
} from './hooks/transmissiveKitMaterial';

/** Matches Mata / Nuva / Bohrok kit plastic (see `TAHU_WEATHERED` et al.). */
export const BANK_PLASTIC_WEATHERED: WeatheredMetalOptions = {
  cavityStrength: 1,
  edgeColor: '#ffffff',
  edgeCurvatureScale: 2,
  edgeStrength: 0.15,
  fineScale: 18,
  grimeDarken: 0.4,
  grimeMetalnessReduce: 0.5,
  grimeRoughness: 0.2,
  metalness: 0.05,
  roughness: 0.55,
};

const TRANSMISSIVE_KINDS: readonly TransmissiveKitKind[] = [
  'brain',
  'clear',
  'crystal',
  'mctoranFace',
  'vahkiHood',
];

/** Every shipped LEGO hex. Const enums cannot be iterated with Object.values. */
const BANK_LEGO_COLORS: readonly LegoColor[] = [
  LegoColor.Black,
  LegoColor.Blue,
  LegoColor.Brown,
  LegoColor.DarkBlue,
  LegoColor.DarkBluishGray,
  LegoColor.DarkGray,
  LegoColor.DarkGreen,
  LegoColor.DarkOrange,
  LegoColor.DarkRed,
  LegoColor.DarkTurquoise,
  LegoColor.FlatDarkGold,
  LegoColor.Green,
  LegoColor.LightBrown,
  LegoColor.LightGray,
  LegoColor.Lime,
  LegoColor.MediumBlue,
  LegoColor.Orange,
  LegoColor.PearlGold,
  LegoColor.Purple,
  LegoColor.Red,
  LegoColor.SandBlue,
  LegoColor.Tan,
  LegoColor.TransDarkBlue,
  LegoColor.TransGreen,
  LegoColor.TransLightBlue,
  LegoColor.TransMediumBlue,
  LegoColor.TransNeonGreen,
  LegoColor.TransNeonOrange,
  LegoColor.TransNeonPink,
  LegoColor.TransNeonRed,
  LegoColor.TransNeonYellow,
  LegoColor.TransYellow,
  LegoColor.White,
  LegoColor.Yellow,
];

let primed = false;

/**
 * CPU-only: construct the shared weathered / transmissive material instances for
 * every shipped LEGO color. Safe before the canvas exists. GPU programs still
 * compile later via {@link ShaderVariantBank} / `SceneCompileAsync`.
 */
export function primeKitMaterialBank(): void {
  if (primed) return;
  primed = true;

  const metalOpts = { ...BANK_PLASTIC_WEATHERED, ...MATA_METAL_PBR };
  const nuvaMetalOpts = { ...BANK_PLASTIC_WEATHERED, ...NUVA_METAL_PBR };

  for (const color of BANK_LEGO_COLORS) {
    getWeatheredMetalMaterial(color, BANK_PLASTIC_WEATHERED);
    getWeatheredMetalMaterial(color, METRU_WEATHERED);
    getWeatheredMetalMaterial(color, metalOpts);
    getWeatheredMetalMaterial(color, nuvaMetalOpts);
    for (const kind of TRANSMISSIVE_KINDS) {
      buildTransmissiveKitMaterial('Bank', kind, color, color, kind === 'clear' ? 0 : 0.1);
    }
  }
}

export function isKitMaterialBankPrimed(): boolean {
  return primed;
}

/** Test helper — materials stay in the process-wide cache. */
export function resetKitMaterialBankPrimeFlag(): void {
  primed = false;
}
