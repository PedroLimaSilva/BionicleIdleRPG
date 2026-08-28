import type { KitMaterialSlotEntry } from '../../../../types/KitParts';

/**
 * Transmissive brains (`Brain` material on MataBrain / MetruBrain kit nodes): runtime
 * transmission + IOR (see `transmissiveKitMaterial`) with diffuse / emission from eyes.
 */
export const BRAIN_BAKED_EMISSIVE_INTENSITY = 0.1;

const BRAIN_TRANSMISSIVE_SLOT: KitMaterialSlotEntry = {
  color: { key: 'eyes', kind: 'palette' },
  emissive: { key: 'eyes', kind: 'palette' },
  emissiveIntensity: BRAIN_BAKED_EMISSIVE_INTENSITY,
  weathered: false,
};

/** Spread into rig palettes wherever brain sockets clone kit parts. */
export const KIT_PALETTE_BRAIN_BAKED: Partial<Record<string, KitMaterialSlotEntry>> = {
  Brain: BRAIN_TRANSMISSIVE_SLOT,
};

/** @deprecated Use `KIT_PALETTE_BRAIN_BAKED` — kept for import stability. */
export const MATA_KIT_PALETTE_BRAIN_BAKED = KIT_PALETTE_BRAIN_BAKED;

/** @deprecated Use `KIT_PALETTE_BRAIN_BAKED` — kept for import stability. */
export const METRU_KIT_PALETTE_BRAIN_BAKED = KIT_PALETTE_BRAIN_BAKED;
