import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotOverride } from '../../../../types/KitParts';

/** PBR-only subset of a slot override (no color, no emissive, no weathered flag). */
export type KitMetalPbr = Pick<
  KitMaterialSlotOverride,
  | 'envMapIntensity'
  | 'fineScale'
  | 'grimeDarken'
  | 'grimeMetalnessReduce'
  | 'grimeRoughness'
  | 'metalness'
  | 'roughness'
>;

/** Mata-era technic: duller satin metal with heavier grime. */
export const MATA_METAL_PBR: KitMetalPbr = {
  envMapIntensity: 0.52,
  fineScale: 26,
  grimeMetalnessReduce: 0.52,
  grimeRoughness: 0.22,
  metalness: 0.88,
  roughness: 0.32,
};

/** Nuva-era metal: brighter, smoother, barely grimed. */
export const NUVA_METAL_PBR: KitMetalPbr = {
  envMapIntensity: 0.9,
  fineScale: 22,
  grimeDarken: 0.15,
  grimeMetalnessReduce: 0.25,
  grimeRoughness: 0.12,
  metalness: 0.95,
  roughness: 0.18,
};

export type MetalStyle = 'mata' | 'nuva';

export function metalPbrForStyle(style: MetalStyle): KitMetalPbr {
  return style === 'nuva' ? NUVA_METAL_PBR : MATA_METAL_PBR;
}

/**
 * LEGO plastics that are metallic in real life. They read as metal wherever they
 * land, so a Main / Secondary slot bound to one of them gets the same PBR as a
 * Metal slot instead of the character's plastic defaults.
 */
const METALLIC_COLOR_PBR: Partial<Record<LegoColor, KitMetalPbr>> = {
  [LegoColor.FlatDarkGold]: NUVA_METAL_PBR,
  [LegoColor.PearlGold]: NUVA_METAL_PBR,
};

/** Metal PBR defaults for a resolved hex color, or `undefined` for plastics. */
export function metallicColorPbr(color: string): KitMetalPbr | undefined {
  return METALLIC_COLOR_PBR[color.toUpperCase() as LegoColor];
}
