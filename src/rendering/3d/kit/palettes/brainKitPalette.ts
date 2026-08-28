import type { KitMaterialSlotEntry } from '../../../../types/KitParts';

/**
 * Transmissive brains (`MataBrain_baked`, `MetruBrain`): runtime transmission +
 * IOR (see `transmissiveKitMaterial`) with diffuse / emission tinted from eyes.
 * The kit GLB has no `KHR_materials_emissive_strength`, so Three.js defaults to 1 —
 * too hot once emissive is replaced with a full eye color and selective bloom.
 * Use a modest glow instead of the 35× eye / 50× mask intensities (Vahki hood too).
 */
export const BRAIN_BAKED_EMISSIVE_INTENSITY = 0.1;

const brainBakedSlot = (): KitMaterialSlotEntry => ({
  color: { key: 'eyes', kind: 'palette' },
  emissive: { key: 'eyes', kind: 'palette' },
  emissiveIntensity: BRAIN_BAKED_EMISSIVE_INTENSITY,
  weathered: false,
});

const BRAIN_BAKED_SLOT = brainBakedSlot();

/** Mata (2001) brain — `MataBrain` kit node material slot. */
export const MATA_KIT_PALETTE_BRAIN_BAKED: Partial<Record<string, KitMaterialSlotEntry>> = {
  MataBrain_baked: BRAIN_BAKED_SLOT,
};

/** Metru (2004) brain — `MetruBrain` kit node material slot. */
export const METRU_KIT_PALETTE_BRAIN_BAKED: Partial<Record<string, KitMaterialSlotEntry>> = {
  MetruBrain_baked: BRAIN_BAKED_SLOT,
  /** GLB material name before `_baked` rename on export. */
  MetruBrain: BRAIN_BAKED_SLOT,
};

/** Spread into rig palettes wherever brain sockets clone kit parts. */
export const KIT_PALETTE_BRAIN_BAKED: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...MATA_KIT_PALETTE_BRAIN_BAKED,
  ...METRU_KIT_PALETTE_BRAIN_BAKED,
};
