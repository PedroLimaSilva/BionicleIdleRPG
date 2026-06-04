import { LegoColor } from '../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../types/KitParts';

/**
 * Weathered silver for all Nuva kit `Metal` slots (pins, gears, blades, propellers).
 * Shinier than Mata `MATA_KIT_PLAYER_PALETTE_PLASTICS` Metal; still uses the weathered pass.
 */
export const NUVA_KIT_METAL: Partial<Record<string, KitMaterialSlotEntry>> = {
  Metal: {
    color: { kind: 'lego', value: LegoColor.LightGray },
    envMapIntensity: 0.9,
    fineScale: 22,
    grimeDarken: 0.15,
    grimeMetalnessReduce: 0.25,
    grimeRoughness: 0.12,
    metalness: 0.95,
    roughness: 0.18,
    weathered: true,
  },
};
