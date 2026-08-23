import type { KitMaterialSlotEntry, MatoranPaletteKey } from '../../../types/KitParts';

/**
 * Weathered silver for all Nuva kit `Metal` slots (pins, gears, blades, propellers).
 * Shinier than Mata `MATA_KIT_PLAYER_PALETTE_PLASTICS` Metal; still uses the weathered pass.
 * Color follows `colors.metal` (LightGray when unset) so Takanuva gold and custom
 * metals share one slot.
 */
export const NUVA_KIT_METAL: Partial<Record<string, KitMaterialSlotEntry>> = {
  Metal: {
    color: { key: 'metal', kind: 'palette' },
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

/** Same PBR as `NUVA_KIT_METAL.Metal`, bound to a different palette key (e.g. joints). */
export function nuvaKitMetalForKey(key: MatoranPaletteKey): KitMaterialSlotEntry {
  return {
    ...NUVA_KIT_METAL.Metal!,
    color: { key, kind: 'palette' },
  };
}
