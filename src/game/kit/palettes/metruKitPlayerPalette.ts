import { WeatheredMetalOptions } from '../../../components/CharacterScene/WeatheredMetalMaterial';
import { MaskDiscoloration } from '../../../hooks/maskDiscoloration';
import { LegoColor } from '../../../types/Colors';

/**
 * Pre-Cataclysm Metru Matoran — cleaner plastics and technic than Mata Nui-era
 * matoran (see `REBUILT_WEATHERED` / `DIMINISHED_WEATHERED`). Subtle grime only.
 */
export const METRU_WEATHERED: WeatheredMetalOptions = {
  cavityStrength: 0.25,
  edgeColor: '#ffffff',
  edgeCurvatureScale: 4,
  edgeStrength: 0.05,
  fineScale: 18.0,
  grimeDarken: 0.15,
  grimeMetalnessReduce: 0.25,
  grimeRoughness: 0.1,
  largeScale: 3.5,
  metalness: 0.05,
  roughness: 0.45,
};

/** Double-injected Kanohi: metallic silver-gray crown fading into the mask color below. */
export const METRU_MASK_DISCOLORATION: MaskDiscoloration = {
  color: LegoColor.LightGray,
  intensity: 1,
  metalness: 0.92,
  roughness: 0.18,
};
