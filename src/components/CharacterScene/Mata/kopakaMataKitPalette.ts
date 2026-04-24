import { LegoColor } from '../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../types/KitParts';

export const KOPAKA_MATA_KIT_PALETTE: Partial<Record<string, KitMaterialSlotEntry>> = {
  Brain: {
    color: { kind: 'lego', value: LegoColor.TransNeonYellow },
    weathered: false,
  },
  Glow: {
    emissive: { kind: 'lego', value: LegoColor.MediumBlue },
    emissiveIntensity: 4,
    weathered: false,
  },
  'Glowing Eyes': {
    emissive: { kind: 'lego', value: LegoColor.MediumBlue },
    emissiveIntensity: 50,
    weathered: false,
  },
  Main: { kind: 'lego', value: LegoColor.White },
  Metal: { kind: 'lego', value: LegoColor.LightGray },
  Secondary: { kind: 'lego', value: LegoColor.LightGray },
};
