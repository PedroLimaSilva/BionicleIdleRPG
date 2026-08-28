import type { KitMaterialSlotEntry } from '../../../../types/KitParts';

/**
 * Transmissive brains (`Brain` on MataBrain / MetruBrain kit nodes): runtime
 * transmission + IOR with diffuse / emission from eyes (`transmissiveKitMaterial`).
 */
export const BRAIN_EMISSIVE_INTENSITY = 0.1;

const brainTransmissiveSlot = (): KitMaterialSlotEntry => ({
  color: { key: 'eyes', kind: 'palette' },
  emissive: { key: 'eyes', kind: 'palette' },
  emissiveIntensity: BRAIN_EMISSIVE_INTENSITY,
  transmissive: 'brain',
  weathered: false,
});

/** McToran face (`McToranFace` kit node) — clearer brain gel than Toa `MataBrain`. */
export const MCTORAN_FACE_BRAIN_SLOT: KitMaterialSlotEntry = {
  color: { key: 'eyes', kind: 'palette' },
  emissive: { key: 'eyes', kind: 'palette' },
  emissiveIntensity: BRAIN_EMISSIVE_INTENSITY,
  transmissive: 'mctoranFace',
  weathered: false,
};

const BRAIN_TRANSMISSIVE_SLOT = brainTransmissiveSlot();

/** Spread into Toa / Nuva rig palettes wherever brain sockets clone kit parts. */
export const KIT_PALETTE_BRAIN: Partial<Record<string, KitMaterialSlotEntry>> = {
  Brain: BRAIN_TRANSMISSIVE_SLOT,
};

/** MataBrain socket on Toa Nuva rigs — transmissive `Brain` slot only. */
export const KIT_BRAIN_SOCKET_MATERIAL_COLORS = KIT_PALETTE_BRAIN;
