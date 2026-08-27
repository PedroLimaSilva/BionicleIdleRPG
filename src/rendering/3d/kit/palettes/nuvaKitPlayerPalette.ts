import type { BodyPartId, KitMaterialSlotEntry } from '../../../../types/KitParts';
import { kitPartMetal } from './partSlots';

/**
 * Weathered silver PBR for Nuva kit `Metal` slots. Color comes from the chosen
 * body-part `metal` slot (LightGray when the dex omits it).
 */
export const NUVA_KIT_METAL: Partial<Record<string, KitMaterialSlotEntry>> = {
  Metal: kitPartMetal('body', 'nuva'),
};

export function nuvaKitMetalForPart(part: BodyPartId): KitMaterialSlotEntry {
  return kitPartMetal(part, 'nuva');
}
